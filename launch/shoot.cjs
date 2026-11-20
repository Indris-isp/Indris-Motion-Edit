// Renders each styleframe <section> to out/stills/<id>.png at 1920x1080
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/' + (process.argv[2] || 'styleframes.html'));
  await p.evaluate(() => document.fonts.ready);
  for (const id of await p.$$eval('section.frame', s => s.map(e => e.id)))
    await (await p.$('#' + id)).screenshot({ path: `${process.argv[3] || 'out/stills'}/${id}.png` });
  await b.close();
})();
