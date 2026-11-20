// node render_clip.cjs <page.html> <durationSec> <fps> <out.mp4> [still times, comma separated]
// Renders a renderAt(t) page frame by frame (pure function of time) and encodes H.264.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
(async () => {
  const [page_, dur, fps, out, stills] = process.argv.slice(2);
  const tmp = path.join(__dirname, 'out', 'frames'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, page_)); await p.evaluate(() => document.fonts.ready);
  if (stills) for (const s of stills.split(',')) { await p.evaluate(t => renderAt(t), +s); await p.screenshot({ path: `out/stills/wheel_${(+s).toFixed(2)}s.png` }); }
  const n = Math.round(+dur * +fps);
  for (let i = 0; i < n; i++) { await p.evaluate(t => renderAt(t), i / +fps); await p.screenshot({ path: path.join(tmp, String(i).padStart(5, '0') + '.png') }); }
  await b.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', fps, '-i', path.join(tmp, '%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
})();
