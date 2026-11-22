// Renders index.html frame-exact in headless Chromium.
//   node render.cjs                → out/cues.json, out/frames/*.png, out/video_silent.mp4
//   node render.cjs --still 1,5.5  → out/still_1.00.png ...
//   node render.cjs --board        → out/board.png (one annotated still per shot, for approval)
//   node render.cjs --cues         → out/cues.json only (needed by audio.py)
//   add --format 9:16 to any of these for the vertical (1080x1920) version
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const WORKERS = +get('--workers', 4);
const outDir = path.join(__dirname, 'out'), framesDir = path.join(outDir, 'frames');
const FORMAT = get('--format', '');
const url = 'file://' + path.join(__dirname, 'index.html') + '?render=1' + (FORMAT ? '&fmt=' + encodeURIComponent(FORMAT) : '');

async function openPage(browser, W, H) {
  const page = await browser.newPage({ viewport: { width: W || 1920, height: H || 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(url);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  return page;
}
const shoot = (page, file) => page.locator('#stage').screenshot({ path: file });

(async () => {
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  const page0 = await openPage(browser);
  const cues = await page0.evaluate(() => window.exportCues());
  await page0.setViewportSize({ width: cues.W, height: cues.H });
  fs.writeFileSync(path.join(outDir, 'cues.json'), JSON.stringify(cues, null, 1));
  const { FPS, DUR } = cues, TOTAL = Math.round(FPS * DUR), TAG = cues.FMT === '9:16' ? '_9x16' : '';
  console.log(`timeline: ${cues.scenes.length} shots, ${DUR.toFixed(2)} s, ${TOTAL} frames, ${cues.W}x${cues.H}`);
  if (args.includes('--cues')) { await browser.close(); return; }

  const stills = get('--still', null);
  if (stills) {
    for (const t of stills.split(',').map(Number)) {
      await page0.evaluate(t => window.renderAt(t), t);
      await shoot(page0, path.join(outDir, `still${TAG}_${t.toFixed(2)}.png`));
    }
    await browser.close(); return;
  }

  if (args.includes('--board')) { // the "hero" moment of each shot: late enough that its content has landed
    const cells = [];
    for (const [i, s] of cues.scenes.entries()) {
      const d = s.b - s.a, t = s.a + Math.min(s.hero != null ? s.hero / s.k : d * .7, d - .05);
      await page0.evaluate(t => window.renderAt(t), t);
      const buf = await page0.locator('#stage').screenshot({ type: 'jpeg', quality: 88 });
      cells.push({ i, id: s.id, a: s.a, d, img: 'data:image/jpeg;base64,' + buf.toString('base64') });
    }
    const bp = await browser.newPage({ viewport: { width: 2400, height: 1000 }, deviceScaleFactor: 1 });
    const font = 'file://' + path.join(__dirname, 'fonts', 'Inter-600.ttf');
    await bp.setContent(`<html><head><style>@font-face{font-family:I;src:url(${font})}body{margin:0;background:#F3F5FA;font-family:I,sans-serif;color:#0B0D12}
      #b{width:2400px;padding:50px 60px;box-sizing:border-box}h1{margin:0 0 30px;font-size:40px;letter-spacing:-.03em}
      .g{display:grid;grid-template-columns:repeat(${cues.W < cues.H ? 8 : 4},1fr);gap:34px 28px}img{width:100%;border-radius:14px;display:block;box-shadow:0 18px 40px -18px rgba(30,50,110,.4)}
      .m{display:flex;gap:10px;align-items:center;margin-top:12px;font-size:19px}.n{background:#0B0D12;color:#fff;border-radius:7px;padding:2px 9px}.t{color:#6B7180}</style></head>
      <body><div id="b"><h1>Storyboard · ${cues.scenes.length} shots · ${DUR.toFixed(1)} s · ${cues.W}×${cues.H}</h1><div class="g">${cells.map(c =>
        `<div><img src="${c.img}"><div class="m"><span class="n">${String(c.i + 1).padStart(2, '0')}</span><b>${c.id}</b><span class="t">${c.a.toFixed(1)} s · ${c.d.toFixed(1)} s</span></div></div>`).join('')}</div></div></body></html>`);
    await bp.evaluate(() => document.fonts.ready);
    await bp.locator('#b').screenshot({ path: path.join(outDir, `board${TAG}.png`) });
    console.log(`wrote out/board${TAG}.png`);
    await browser.close(); return;
  }

  for (const f of fs.readdirSync(framesDir)) fs.unlinkSync(path.join(framesDir, f));
  const pages = [page0, ...await Promise.all(Array.from({ length: WORKERS - 1 }, () => openPage(browser, cues.W, cues.H)))];
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < TOTAL) {
      const f = next++;
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await shoot(page, path.join(framesDir, `f${String(f).padStart(4, '0')}.png`));
      if (++done % 150 === 0) console.log(`${done}/${TOTAL} frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', path.join(outDir, `video_silent${TAG}.mp4`)], { stdio: 'inherit' });
  console.log(`wrote out/video_silent${TAG}.mp4`);
})();
