const { chromium } = require('playwright'); const V = process.argv[2];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + V + '/arc.html'); await pg.evaluate(() => window.ready); await pg.waitForTimeout(100);
  await pg.screenshot({ path: V + '/lines/arc_full.png', omitBackground: true }); await b.close(); })();
