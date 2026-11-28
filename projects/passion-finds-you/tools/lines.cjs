// mode "measure": width at size 100 for each item; mode "render": tight PNG per item
const { chromium } = require('playwright'); const fs = require('fs');
const [mode, inp, out, dir] = process.argv.slice(2); const items = JSON.parse(fs.readFileSync(inp));
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 3000, height: 800 } });
  await pg.goto('file://' + dir + '/line.html'); const res = {};
  for (const it of items) {
    const r = await pg.evaluate(o => window.setLine(o), { ...it, size: mode === 'measure' ? 100 : it.size });
    res[it.key] = r;
    if (mode === 'render') await pg.screenshot({ path: `${dir}/lines/${it.key}.png`, omitBackground: true, clip: { x: r.x, y: r.y, width: Math.ceil(r.w), height: Math.ceil(r.h) } });
  }
  fs.writeFileSync(out, JSON.stringify(res)); await b.close();
})();
