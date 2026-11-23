// Exact video frames at each beat's board times, full resolution, no annotations.
//   node story_stills.cjs <project_dir> [--format 9:16]  → <project>/out/stills[_9x16]/NN_<beat>_<t>s.png
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const args = process.argv.slice(2), proj = path.resolve(args[0]);
const fmt = args.includes('--format') ? args[args.indexOf('--format') + 1] : '16:9', V = fmt === '9:16';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: V ? 1080 : 1920, height: V ? 1920 : 1080 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + path.join(proj, 'index.html') + '?render=1&fmt=' + encodeURIComponent(fmt));
  await p.waitForFunction('window.READY === true', null, { timeout: 30000 });
  const cues = await p.evaluate(() => window.exportCues());
  const dir = path.join(proj, 'out', V ? 'stills_9x16' : 'stills'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  for (const [i, s] of cues.scenes.entries()) {
    const d = s.d || {}, times = d.boards || [s.hero != null ? s.hero : (s.b - s.a) * s.k * .7];
    for (const [j, lt] of times.entries()) {
      const t = Math.min(s.a + lt / s.k, s.b - .02), fr = Math.round(t * cues.FPS) / cues.FPS; // snap to a real frame
      await p.evaluate(t => window.renderAt(t), fr);
      const f = path.join(dir, `${String(i + 1).padStart(2, '0')}${times.length > 1 ? String.fromCharCode(97 + j) : ''}_${d.name || s.id}_${fr.toFixed(2)}s.png`);
      await p.locator('#stage').screenshot({ path: f }); n++;
    }
  }
  console.log(path.relative(process.cwd(), dir), n, 'frames');
  await b.close();
})();
