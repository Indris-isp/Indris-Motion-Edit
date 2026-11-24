const { chromium } = require('playwright');
const D = process.argv[2];
const targets = [
  ["you can achieve","standard",541],["you're focusing,","standard",533],["I was nothing","standard",443],
  ["about three","standard",389],["years ago.","standard",346],["anything in life.","italic",486],
  ["embarrassed?","emphasis",662],["listening,","hero",627],["impossible","hero_max",691]];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1276, height: 718 } });
  for (const [text, tier, tw] of targets) {
    const hash = encodeURIComponent(JSON.stringify({ W: 1276, H: 718, lines: [{ text, tier }], watermark: false }));
    await pg.goto(`file://${D}/preset/demo.html?n=${Math.random()}#${hash}`); await pg.evaluate(() => window.ready);
    // glyph ink width via canvas-free trick: measure with a Range
    const m = await pg.evaluate(() => { const e = document.querySelector('.fm-line'); const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(); return { w: b.width, fs: parseFloat(getComputedStyle(e).fontSize) }; });
    console.log(tier.padEnd(9), text.padEnd(20), "rendered", m.w.toFixed(0), "target", tw, "ratio", (tw / m.w).toFixed(3), "fs", m.fs.toFixed(1), "-> fs/H", (m.fs * tw / m.w / 718).toFixed(4));
  }
  await b.close();
})();
