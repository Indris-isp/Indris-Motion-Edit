// Renders index.html frame-by-frame with headless Chromium, then encodes with ffmpeg and muxes out/audio.wav.
// Usage: node render.cjs            full render -> out/isp_meet_screen_1920x1080.mp4
//        node render.cjs --still 1,3.5,6   quick stills -> out/still_<t>.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const WORKERS = 4;
const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.resolve(__dirname, 'out');
const framesDir = path.join(outDir, 'frames');
const url = 'file://' + path.join(__dirname, 'index.html') + '?render=1';

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
  const probe = await openPage(browser);
  const { FPS, frames: TOTAL } = await probe.evaluate(() => window.TIMING);
  await probe.close();
  // Motion blur: SUB sub-frames per output frame, centred on the frame time, blended by ffmpeg (tmix).
  const SUB = +get('--sub', 3), N = TOTAL * SUB;
  const pages = await Promise.all(Array.from({ length: WORKERS }, () => openPage(browser)));
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < N) {
      const f = next++, k = Math.floor(f / SUB), j = f % SUB;
      const t = Math.max(0, (k + (j - (SUB - 1) / 2) / SUB * .5) / FPS);     // 180° shutter
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(framesDir, `f${String(f).padStart(5, '0')}.png`) });
      if (++done % 120 === 0) console.log(`${done}/${N} sub-frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  const silent = path.join(outDir, 'video_silent.mp4');
  const vf = SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB` : 'null';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS * SUB), '-i', path.join(framesDir, 'f%05d.png'),
    '-vf', vf, '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-tune', 'animation', silent], { stdio: 'inherit' });
  const audio = path.join(outDir, 'audio.wav'), final = path.join(outDir, 'isp_meet_screen_1920x1080.mp4');
  if (fs.existsSync(audio)) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' });
    console.log('wrote', path.relative(process.cwd(), final));
  } else console.log('wrote out/video_silent.mp4 (no out/audio.wav yet — run audio.py, then render again or mux by hand)');
})();
