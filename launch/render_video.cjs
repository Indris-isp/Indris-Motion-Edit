// Render video.html (pure function of time) to H.264.
//   node render_video.cjs stills 1.0,2.5,...        -> out/check/t_<sec>.png
//   node render_video.cjs video [workers]            -> out/ISP_launch_1920x1080.mp4 (silent), segments rendered in parallel
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const ROOT = __dirname, FPS = 60, DUR = 36;
async function page(b) {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + path.join(ROOT, 'video.html'));
  await p.evaluate(() => window.ready);
  return p;
}
async function segment(b, f0, f1, out) {
  const p = await page(b);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out]);
  for (let f = f0; f < f1; f++) {
    await p.evaluate(t => renderAt(t), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 120 === 0) console.log(out, f, '/', f1);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await p.close();
}
(async () => {
  const [mode, arg] = process.argv.slice(2);
  const b = await chromium.launch();
  if (mode === 'stills') {
    fs.mkdirSync(path.join(ROOT, 'out/check'), { recursive: true });
    const p = await page(b);
    for (const s of arg.split(',')) { await p.evaluate(t => renderAt(t), +s); await p.screenshot({ path: path.join(ROOT, `out/check/t_${(+s).toFixed(2)}.png`) }); }
  } else {
    const W = +(arg || 4), N = DUR * FPS, per = Math.ceil(N / W), segs = [];
    await Promise.all([...Array(W)].map((_, i) => { const o = path.join(ROOT, `out/seg_${i}.mp4`); segs.push(o); return segment(b, i * per, Math.min(N, (i + 1) * per), o); }));
    fs.writeFileSync(path.join(ROOT, 'out/segs.txt'), segs.map(s => `file '${s}'`).join('\n'));
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(ROOT, 'out/segs.txt'), '-c', 'copy', path.join(ROOT, 'out/video_silent.mp4')]);
    segs.forEach(s => fs.rmSync(s)); fs.rmSync(path.join(ROOT, 'out/segs.txt'));
  }
  await b.close();
})();
