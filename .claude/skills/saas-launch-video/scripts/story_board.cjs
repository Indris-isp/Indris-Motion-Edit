// Storyboard stills for story films (shots_story.js).
//   node story_board.cjs <project_dir> [--format 9:16]  → <project>/out/storyboard[_9x16].png
// Renders each beat at its d.boards times (authored seconds; default: hero) and lays them out with the
// on-screen copy, what moves, and where the material comes from (REAL UI / SAMPLE DATA / PLACEHOLDER).
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const args = process.argv.slice(2), proj = path.resolve(args[0]);
const fmt = args.includes('--format') ? args[args.indexOf('--format') + 1] : '16:9', V = fmt === '9:16';
const meta = JSON.parse(fs.readFileSync(path.join(proj, 'film.json'), 'utf8'));
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: V ? 1080 : 1920, height: V ? 1920 : 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto('file://' + path.join(proj, 'index.html') + '?render=1&fmt=' + encodeURIComponent(fmt));
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  const cues = await page.evaluate(() => window.exportCues());
  const cells = [];
  for (const [i, s] of cues.scenes.entries()) {
    const d = s.d || {}, times = d.boards || [s.hero != null ? s.hero : (s.b - s.a) * s.k * .7];
    for (const [j, lt] of times.entries()) {
      const t = Math.min(s.a + lt / s.k, s.b - .02);
      await page.evaluate(t => window.renderAt(t), t);
      const buf = await page.locator('#stage').screenshot({ type: 'jpeg', quality: 86 });
      cells.push({ n: `${i + 1}${times.length > 1 ? String.fromCharCode(97 + j) : ''}`, t, a: s.a, b: s.b, first: j === 0, d, img: buf.toString('base64') });
    }
  }
  fs.mkdirSync(path.join(proj, 'out'), { recursive: true });
  const cols = V ? 6 : 3, cw = V ? 380 : 760, BW = cols * cw + (cols - 1) * 36 + 140;
  const tag = { real: ['REAL UI', '#1f7a4d'], sample: ['REAL UI + SAMPLE DATA', '#2f5fd0'], illus: ['ILLUSTRATIVE · BUILT IN BRAND', '#8a5a00'], placeholder: ['PLACEHOLDER · NEEDS CAPTURE', '#b3261e'], brand: ['BRAND', '#444'] };
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = `<html><head><style>
  @font-face{font-family:I;src:url(file://${path.join(proj, 'fonts', 'Inter-500.ttf')})}@font-face{font-family:I;font-weight:700;src:url(file://${path.join(proj, 'fonts', 'Inter-700.ttf')})}
  body{margin:0;background:#EDEBE6;font-family:I,sans-serif;color:#141414}#b{width:${BW}px;padding:56px 70px;box-sizing:border-box}
  .top{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:34px;gap:40px}
  h1{font-size:44px;margin:0 0 8px;letter-spacing:-.02em}.sub{font-size:21px;color:#555;max-width:1400px;line-height:1.4}
  .chips{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.chip{display:flex;align-items:center;gap:8px;font-size:15px;background:#fff;border-radius:99px;padding:6px 12px 6px 6px}.chip i{width:22px;height:22px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
  .g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:40px 36px}
  img{width:100%;display:block;border-radius:10px;box-shadow:0 14px 34px -16px rgba(0,0,0,.35)}
  .m{margin-top:12px;font-size:17px;line-height:1.4}.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .n{background:#141414;color:#fff;border-radius:6px;padding:2px 9px;font-weight:700}.tc{color:#666}
  .tg{font-size:12px;font-weight:700;letter-spacing:.06em;color:#fff;border-radius:5px;padding:4px 8px}
  .copy{font-weight:700;font-size:${V ? 18 : 21}px;margin:8px 0 4px}.note{color:#444}
  .foot{margin-top:40px;font-size:17px;color:#555;line-height:1.5}</style></head><body><div id="b">
  <div class="top"><div><h1>${esc(meta.title)}</h1><div class="sub">${esc(meta.concept)}</div></div>
  <div class="chips">${(meta.palette || []).map(([n, c]) => `<span class="chip"><i style="background:${c}"></i>${esc(n)} ${c}</span>`).join('')}${(meta.fonts || []).map(f => `<span class="chip" style="padding-left:12px">${esc(f)}</span>`).join('')}</div></div>
  <div class="g">${cells.map(c => { const tg = tag[c.d.src] || tag.real; return `<div><img src="data:image/jpeg;base64,${c.img}"><div class="m">
    <div class="row"><span class="n">${c.n}</span><span class="tc">${c.t.toFixed(1)} s${c.first ? ` · shot ${c.a.toFixed(1)}–${c.b.toFixed(1)} s` : ''}</span><span class="tg" style="background:${tg[1]}">${tg[0]}</span></div>
    ${c.first && c.d.copy ? `<div class="copy">${esc(c.d.copy)}</div>` : ''}${c.first ? `<div class="note">${esc(c.d.note)}</div>` : ''}</div></div>`; }).join('')}</div>
  <div class="foot">${(meta.footnotes || []).map(esc).join('<br>')}<br>Total ${cues.DUR.toFixed(1)} s · ${cues.W}×${cues.H} · ${cues.FPS} fps</div></div></body></html>`;
  const hp = path.join(proj, 'out', 'board.html'); fs.writeFileSync(hp, html);
  const bp = await browser.newPage({ viewport: { width: BW, height: 1000 } });
  await bp.goto('file://' + hp); await bp.evaluate(() => document.fonts.ready);
  const out = path.join(proj, 'out', `storyboard${V ? '_9x16' : ''}.png`);
  await bp.locator('#b').screenshot({ path: out }); fs.unlinkSync(hp);
  console.log('wrote', out, cells.length, 'frames', cues.DUR.toFixed(1) + 's');
  await browser.close();
})();
