// Renders each frame in screens.html to out/<name>.png at 2x.
// First run: ./fetch-fonts.sh  (downloads the Satoshi brand font)
// Usage: node render-ui.cjs            (all frames)
//        node render-ui.cjs dashboard  (one frame)
// A "-flat" suffix renders the same screen without the 3D tilt or cursor,
// for compositing and animating your own camera moves.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const frames = [
  ['01_title', 'title', 1920, 1080],
  ['02_dashboard', 'dashboard', 1920, 1080],
  ['03_projects', 'projects', 1920, 1080],
  ['04_request', 'request', 1920, 1080],
  ['05_analytics', 'analytics', 1920, 1080],
  ['06_features', 'features', 1920, 1080],
  ['07_mobile', 'mobile', 1080, 1920],
  ['08_endcard', 'endcard', 1920, 1080],
  ['flat_dashboard', 'dashboard-flat', 1920, 1080],
  ['flat_projects', 'projects-flat', 1920, 1080],
  ['flat_request', 'request-flat', 1920, 1080],
  ['flat_analytics', 'analytics-flat', 1920, 1080],
];

(async () => {
  const only = process.argv[2];
  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const file = 'file://' + path.join(__dirname, 'screens.html');
  for (const [name, hash, w, h] of frames) {
    if (only && !name.includes(only)) continue;
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    page.on('pageerror', e => console.error('PAGE ERROR', name, e.message));
    await page.goto(`${file}#${hash}`);
    await page.evaluate(() => document.fonts.ready.then(() => window.placed));
    await page.screenshot({ path: path.join(outDir, `${name}.png`) });
    await page.close();
    console.log('rendered', name);
  }
  await browser.close();
})();
