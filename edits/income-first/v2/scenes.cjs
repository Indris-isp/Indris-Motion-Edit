// Renders every designed scene / overlay listed in out/plan.json to out/scenes/<name>/f00000.png ...
//   node scenes.cjs                     all scenes
//   node scenes.cjs money,puzzle        only these
//   node scenes.cjs --still money 2.5   one frame -> out/scene_money_2.50.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const plan = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'plan.json'), 'utf8'));
const FPS = plan.fps, WORKERS = 4;
const args = process.argv.slice(2);
const url = s => 'file://' + path.join(__dirname, 'scenes.html') +
  `?name=${s.name}&dur=${((s.f1 - s.f0) / FPS).toFixed(4)}&cues=${encodeURIComponent(JSON.stringify(s.cues))}`;

async function open(browser, s) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', s.name, e.message));
  await page.goto(url(s));
  await page.waitForFunction('window.READY === true', null, { timeout: 60000 });
  return page;
}

(async () => {
  const browser = await chromium.launch();
  if (args[0] === '--still') {
    const s = plan.scenes.find(x => x.name === args[1]), t = +args[2];
    const page = await open(browser, s);
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: path.join(__dirname, 'out', `scene_${s.name}_${t.toFixed(2)}.png`), omitBackground: s.kind !== 'scene' });
    await browser.close(); return;
  }
  const only = args[0] ? args[0].split(',') : null;
  for (const s of plan.scenes.filter(s => !only || only.includes(s.name))) {
    const dir = path.join(__dirname, 'out', 'scenes', s.name);
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const n = s.f1 - s.f0, pages = await Promise.all(Array.from({ length: WORKERS }, () => open(browser, s)));
    let next = 0;
    await Promise.all(pages.map(async page => {
      while (next < n) {
        const f = next++;
        await page.evaluate(t => window.renderAt(t), f / FPS);
        await page.screenshot({ path: path.join(dir, `f${String(f).padStart(5, '0')}.png`), omitBackground: s.kind !== 'scene' });
      }
    }));
    await Promise.all(pages.map(p => p.close()));
    console.log(`${s.name}: ${n} frames`);
  }
  await browser.close();
})();
