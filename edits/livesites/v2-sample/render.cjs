// PAGE=scenes3d.html (default; v1 was scenes.html)
// node render.cjs <framesDir> <outDir> stills 0.5,1.6,...   -> outDir/still_<t>.png
// node render.cjs <framesDir> <outDir> all                  -> outDir/f00000.png ... (every source frame)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const [framesDir, outDir, mode, list] = process.argv.slice(2);
const FPS = 30000 / 1001, N = +(process.env.NFRAMES || 316), WORKERS = +(process.env.WORKERS || 4);
fs.mkdirSync(outDir, { recursive: true });
const PAGE = process.env.PAGE || 'scenes3d.html';
const url = 'file://' + path.join(__dirname, PAGE) + '?frames=' + encodeURIComponent('file://' + path.resolve(framesDir));
async function open(b) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto(url); await p.waitForFunction('window.READY === true', null, { timeout: 120000 }); return p;
}
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const times = mode === 'stills' ? list.split(',').map(Number) : Array.from({ length: N }, (_, i) => i / FPS);
  const names = mode === 'stills' ? times.map(t => `still_${t.toFixed(2)}.png`) : times.map((_, i) => `f${String(i).padStart(5, '0')}.png`);
  const pages = await Promise.all(Array.from({ length: Math.min(WORKERS, times.length) }, () => open(b)));
  let next = 0;
  await Promise.all(pages.map(async p => { while (next < times.length) { const i = next++;
    await p.evaluate(t => window.renderAt(t), times[i]);
    await p.screenshot({ path: path.join(outDir, names[i]) }); } }));
  await b.close(); console.log('rendered', times.length);
})();
