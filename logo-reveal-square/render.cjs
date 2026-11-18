// Renders index.html frame by frame with headless Chromium, then encodes with ffmpeg.
// Usage: node render.cjs                 -> out/frames/*.png + out/video_silent.mp4 + out/cues.json
//        node render.cjs --still 1,4.5   -> out/still_1.00.png ... (single-sample previews)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const WORKERS = 4;
const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.join(__dirname, 'out');
const framesDir = path.join(outDir, 'frames');
const stills = get('--still', null);
const url = 'file://' + path.join(__dirname, 'index.html') + (stills ? '?still' : '?render');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  await page.evaluate(() => document.body.classList.add('render'));
  return page;
}
const shot = (page, file) => page.locator('#c').screenshot({ path: file });

(async () => {
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  if (stills) {
    const page = await openPage(browser);
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await shot(page, path.join(outDir, `still_${t.toFixed(2)}.png`));
    }
    await browser.close(); return;
  }
  const pages = await Promise.all(Array.from({ length: WORKERS }, () => openPage(browser)));
  const { FPS, DUR, CUES } = await pages[0].evaluate(() => ({ FPS: window.FPS, DUR: window.DUR, CUES: window.CUES }));
  fs.writeFileSync(path.join(outDir, 'cues.json'), JSON.stringify({ FPS, DUR, CUES }, null, 1));
  const TOTAL = Math.round(FPS * DUR);
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < TOTAL) {
      const f = next++;
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await shot(page, path.join(framesDir, `f${String(f).padStart(4, '0')}.png`));
      if (++done % 60 === 0) console.log(`${done}/${TOTAL} frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-tune', 'animation', path.join(outDir, 'video_silent.mp4')], { stdio: 'inherit' });
  console.log('wrote out/video_silent.mp4');
})();
