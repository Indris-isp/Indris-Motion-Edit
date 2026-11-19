// Renders seamless looping MP4s of each frame with the border glow and light streak moving.
// Usage: node render-loops.cjs [name-filter] [seconds=4] [fps=30]
// Output: out/loops/<name>.mp4 (1920x1080, or 1080x1920 for mobile)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const frames = [
  ['01_title', 'title', 1920, 1080], ['02_dashboard', 'dashboard', 1920, 1080], ['03_projects', 'projects', 1920, 1080],
  ['04_request', 'request', 1920, 1080], ['05_analytics', 'analytics', 1920, 1080], ['06_features', 'features', 1920, 1080],
  ['07_mobile', 'mobile', 1080, 1920], ['08_logo', 'logo', 1920, 1080], ['09_endcard', 'endcard', 1920, 1080],
];

(async () => {
  const [only, secs = 4, fps = 30] = [process.argv[2], +(process.argv[3] || 4), +(process.argv[4] || 30)];
  const n = Math.round(secs * fps);
  const outDir = path.join(__dirname, 'out', 'loops');
  const tmp = path.join(__dirname, 'out', '.loopframes');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const file = 'file://' + path.join(__dirname, 'screens.html');
  for (const [name, hash, w, h] of frames) {
    if (only && only !== 'all' && !name.includes(only)) continue;
    fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto(`${file}#${hash}`);
    await page.evaluate(() => document.fonts.ready.then(() => window.placed));
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.setT(t), i / n);
      await page.screenshot({ path: path.join(tmp, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    await page.close();
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(tmp, '%04d.jpg'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', path.join(outDir, `${name}.mp4`)]);
    console.log('loop', name);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  await browser.close();
})();
