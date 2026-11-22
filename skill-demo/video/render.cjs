// Renders loopin.html frame by frame in headless Chromium, then encodes with ffmpeg.
// Usage: node render.cjs                 → out/frames/*.png + out/video_silent.mp4
//        node render.cjs --still 1,5.5   → out/still_1.00.png ...
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'cues.js'), 'utf8'), ctx);
const { FPS, DUR } = ctx.window.CUES;
const TOTAL = Math.round(FPS * DUR), WORKERS = 4;
const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.join(__dirname, 'out'), framesDir = path.join(outDir, 'frames');
const url = 'file://' + path.join(__dirname, 'loopin.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  return page;
}

(async () => {
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  const stills = get('--still', null);
  if (stills) {
    const page = await openPage(browser);
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(outDir, `still_${t.toFixed(2)}.png`) });
    }
    await browser.close(); return;
  }
  const pages = await Promise.all(Array.from({ length: WORKERS }, () => openPage(browser)));
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < TOTAL) {
      const f = next++;
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await page.screenshot({ path: path.join(framesDir, `f${String(f).padStart(4, '0')}.png`) });
      if (++done % 150 === 0) console.log(`${done}/${TOTAL} frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', path.join(outDir, 'video_silent.mp4')], { stdio: 'inherit' });
  console.log('wrote out/video_silent.mp4');
})();
