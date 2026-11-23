// Usage:
//   node render.cjs --still 0.6,1.8,2.9,3.6,4.0,4.9   -> out/still_<t>.png + out/contact_sheet.png
//   node render.cjs --video [fps]                      -> out/sample_1920x1080.mp4 (5 s)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');

const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const url = 'file://' + path.join(__dirname, 'sample.html');
const args = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  const stage = await page.$('#stage');
  const shoot = async (t, file) => {
    await page.evaluate(t => window.renderAt(t), t);
    await stage.screenshot({ path: file });
  };

  if (args[0] === '--still') {
    const ts = (args[1] || '0.6,1.8,2.9,3.6,4.0,4.9').split(',').map(Number);
    const files = [];
    for (const t of ts) { const f = path.join(OUT, `still_${t.toFixed(2)}s.png`); await shoot(t, f); files.push(f); }
    // 3-column contact sheet
    const inputs = files.flatMap(f => ['-i', f]);
    const n = files.length, cols = 3, rows = Math.ceil(n / cols);
    const layout = files.map((_, i) => `${(i % cols) * 960}_${Math.floor(i / cols) * 540}`).join('|');
    const scaled = files.map((_, i) => `[${i}]scale=960:540[s${i}]`).join(';');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex',
      `${scaled};${files.map((_, i) => `[s${i}]`).join('')}xstack=inputs=${n}:layout=${layout}:fill=black`,
      path.join(OUT, 'contact_sheet.png')]);
    console.log('wrote', files.length, 'stills + contact_sheet.png', `(${rows} rows)`);
  } else if (args[0] === '--video') {
    const fps = +(args[1] || 30), dir = path.join(OUT, 'frames');
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    for (let i = 0; i < fps * 5; i++) await shoot(i / fps, path.join(dir, String(i).padStart(4, '0') + '.png'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(dir, '%04d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', path.join(OUT, 'sample_1920x1080.mp4')]);
    console.log('wrote sample_1920x1080.mp4');
  }
  await browser.close();
})();
