// node render.cjs stills 3,8.5,...  -> out/stills/t_<t>.jpg
// node render.cjs all [from] [to]   -> out/frames/f00000.jpg ... (30 fps)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const [mode, list, to] = process.argv.slice(2);
const FPS = 30, TOTAL = 149.5, WORKERS = +(process.env.WORKERS || 4);
const url = 'file://' + path.join(__dirname, 'foundry.html');
async function open(b) {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()) });
  await p.goto(url); await p.waitForFunction('window.READY === true', null, { timeout: 60000 }); return p;
}
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  let jobs;
  if (mode === 'stills') { fs.mkdirSync(path.join(__dirname, 'out/stills'), { recursive: true }); jobs = list.split(',').map(t => [+t, `out/stills/t_${(+t).toFixed(2).padStart(6, '0')}.jpg`]); }
  else { fs.mkdirSync(path.join(__dirname, 'out/frames'), { recursive: true }); const a = +(list || 0), z = +(to || Math.round(TOTAL * FPS));
    jobs = []; for (let i = a; i < z; i++) jobs.push([i / FPS, `out/frames/f${String(i).padStart(5, '0')}.jpg`]); }
  const pages = await Promise.all(Array.from({ length: Math.min(WORKERS, jobs.length) }, () => open(b)));
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async p => { while (next < jobs.length) { const [t, f] = jobs[next++];
    await p.evaluate(t => window.renderAt(t), t); await p.screenshot({ path: path.join(__dirname, f), type: 'jpeg', quality: 92 });
    if (++done % 300 === 0) console.log(done, 'frames', ((Date.now() - t0) / done).toFixed(0) + ' ms/frame'); } }));
  await b.close(); console.log('rendered', jobs.length);
})();
