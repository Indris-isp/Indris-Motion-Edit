const { chromium } = require('playwright');
const D = process.argv[2], OUT = process.argv[3];
const shots = [
  ["cmp_standard", 100, [{text:"you can achieve",tier:"standard"}], 0, 0],
  ["cmp_hero", 20, [{text:"listening,",tier:"hero"}], -200, -120],
  ["cmp_italic", 140, [{text:"anything in life.",tier:"italic"}], 0, 0],
  ["cmp_heromax", 540, [{text:"impossible",tier:"hero_max"}], -500, -300],
  ["cmp_stack", 330, [{text:"if you're",tier:"small"},{text:"listening,",tier:"hero"}], -900, -500],
  ["cmp_emphasis", 470, [{text:"embarrassed?",tier:"emphasis"}], -300, 0],
];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1276, height: 718 } });
  for (const [name, f, lines, tx, ty] of shots) {
    const hash = encodeURIComponent(JSON.stringify({ W:1276, H:718, bg:"bg_clean_f490.jpg", lines, texX:tx, texY:ty }));
    await pg.goto(`file://${D}/preset/demo.html?n=${Math.random()}#${hash}`); await pg.evaluate(() => window.ready);
    await pg.waitForTimeout(150);
    await pg.screenshot({ path: `${OUT}/${name}_mine.png` });
  }
  await b.close();
})();
