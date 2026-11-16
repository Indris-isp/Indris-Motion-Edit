// Renders index.html frame-by-frame with headless Chromium, then encodes with ffmpeg.
// Usage: node render.cjs [framesDir] [--from N --to M] [--still t1,t2,...]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const FPS = 30, WORKERS = 4;
const TOTAL = require('./out/timeline.json').frames;
const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.resolve(__dirname, 'out');
const framesDir = path.resolve(get('--frames', path.join(outDir, 'frames')));
const url = 'file://' + path.join(__dirname, 'index.html') + '?render=1';

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  return page;
}

(async () => {
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  const stills = get('--still', null);
  if (stills) { // quick preview stills: --still 0.5,2.0 → out/still_0.5.png
    const page = await openPage(browser);
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(outDir, `still_${t.toFixed(2)}.png`) });
    }
    await browser.close(); return;
  }
  const from = +get('--from', 0), to = +get('--to', TOTAL);
  const pages = await Promise.all(Array.from({ length: WORKERS }, () => openPage(browser)));
  let next = from, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < to) {
      const f = next++;
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await page.screenshot({ path: path.join(framesDir, `f${String(f).padStart(4, '0')}.png`) });
      if (++done % 60 === 0) console.log(`${done}/${to - from} frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  if (from === 0 && to === TOTAL) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-tune', 'animation', path.join(outDir, 'video_silent.mp4')], { stdio: 'inherit' });
    console.log('wrote out/video_silent.mp4');
  }
})();
