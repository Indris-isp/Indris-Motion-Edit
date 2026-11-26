// Re-render chosen frames of one scene into out/scenes/<name>/ (for stills after a fix):  node frames.cjs <name> 10,40,62
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const plan = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'plan.json'), 'utf8'));
const [name, list] = process.argv.slice(2); const s = plan.scenes.find(x => x.name === name);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', name, e.message));
  await p.goto('file://' + path.join(__dirname, 'scenes.html') + `?name=${s.name}&dur=${((s.f1 - s.f0) / plan.fps).toFixed(4)}&cues=${encodeURIComponent(JSON.stringify(s.cues))}`);
  await p.waitForFunction('window.READY === true', null, { timeout: 120000 });
  const dir = path.join(__dirname, 'out', 'scenes', name); fs.mkdirSync(dir, { recursive: true });
  for (const f of list.split(',').map(Number)) {
    await p.evaluate(t => window.renderAt(t), f / plan.fps);
    await p.screenshot({ path: path.join(dir, `f${String(f).padStart(5, '0')}.png`), omitBackground: s.kind !== 'scene' });
  }
  await b.close(); console.log(name, 'frames', list);
})();
