// Renders each UI screen in screens.html to out/<name>.png at 2x.
// Usage: node render-ui.cjs
const { chromium } = require('playwright');
const path = require('path');

const screens = [
  ['dashboard', 1920, 1080],
  ['projects', 1920, 1080],
  ['analytics', 1920, 1080],
  ['brandkit', 1920, 1080],
  ['mobile', 1080, 1920],
  ['components', 1920, 1080, true], // transparent background
];

(async () => {
  const browser = await chromium.launch();
  const file = 'file://' + path.join(__dirname, 'screens.html');
  for (const [name, w, h, transparent] of screens) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await page.goto(`${file}#${name}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(__dirname, 'out', `${name}.png`), omitBackground: !!transparent });
    await page.close();
    console.log('rendered', name);
  }
  await browser.close();
})();
