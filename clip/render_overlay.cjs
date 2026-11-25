// Renders the clip overlay with headless Chromium.
//   node render_overlay.cjs            -> out/bg.png + out/fg/f00000.png ... (transparent)
//   node render_overlay.cjs --still 1,5 -> out/fg_still_<t>.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const WORKERS = 4;
const clip = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'clip.json'), 'utf8'));
const FPS = clip.fps, TOTAL = clip.frames;
const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.join(__dirname, 'out'), fgDir = path.join(outDir, 'fg');
const url = layer => 'file://' + path.join(__dirname, 'overlay.html') + '?layer=' + layer;

async function openPage(browser, layer) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url(layer));
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

(async () => {
  fs.mkdirSync(fgDir, { recursive: true });
  const browser = await chromium.launch();
  const bg = await openPage(browser, 'bg');
  await bg.screenshot({ path: path.join(outDir, 'bg.png') });
  await bg.close();
  const stills = get('--still', null);
  if (stills) {
    const page = await openPage(browser, 'fg');
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(outDir, `fg_still_${t.toFixed(2)}.png`), omitBackground: true });
    }
    await browser.close(); return;
  }
  const pages = await Promise.all(Array.from({ length: WORKERS }, () => openPage(browser, 'fg')));
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < TOTAL) {
      const f = next++;
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await page.screenshot({ path: path.join(fgDir, `f${String(f).padStart(5, '0')}.png`), omitBackground: true });
      if (++done % 150 === 0) console.log(`${done}/${TOTAL} overlay frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  console.log('overlay done');
})();
