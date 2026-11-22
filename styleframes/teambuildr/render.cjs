// Renders each styleframe to PNG, then builds two labelled contact sheets.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FRAMES = [
  ['A1', 'Spreadsheet wall', 'hook', '0:02 · f120'],
  ['A2', 'The manual loop', 'problem', '0:11 · f660'],
  ['A3', 'Build it once', 'fix', '0:17 · f1020'],
  ['A4', 'Athletes log it', 'fix', '0:25 · f1500'],
  ['A5', 'See it, adjust it', 'fix', '0:34 · f2040'],
  ['A6', 'Program in sync', 'payoff', '0:39 · f2340'],
  ['A7', 'Logo + CTA', 'logo', '0:43 · f2580'],
  ['B1', "Who's ready?", 'hook', '0:02 · f120'],
  ['B2', 'Morning check-in', 'problem → fix', '0:06 · f360'],
  ['B3', 'Load at a glance', 'fix', '0:11 · f660'],
  ['B4', 'Where it hurts', 'fix', '0:15 · f900'],
  ['B5', 'Adjust + logo', 'payoff / logo', '0:19 · f1140'],
];
const dir = __dirname, out = path.join(dir, 'out');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  for (const [id] of FRAMES) {
    await page.goto('file://' + path.join(dir, 'frames.html') + '?f=' + id);
    await page.waitForSelector('body[data-ready="1"]');
    const bad = await page.evaluate(() => [...document.fonts].filter(f => f.status !== 'loaded' && f.status !== 'unloaded').length);
    if (bad) throw new Error(id + ': fonts failed');
    await page.screenshot({ path: path.join(out, id + '.png') });
  }
  for (const set of ['A', 'B']) {
    const items = FRAMES.filter(f => f[0][0] === set);
    const title = set === 'A' ? 'TeamBuildr Strength · “From spreadsheet to scoreboard” · 45 s' : 'TeamBuildr AMS · “Who’s ready today?” · 20 s';
    const html = `<html><head><style>
      @font-face{font-family:Figtree;src:url(file://${path.resolve(dir,'assets/fonts/figtree-latin-600-normal.woff2')});font-weight:600}
      @font-face{font-family:Figtree;src:url(file://${path.resolve(dir,'assets/fonts/figtree-latin-800-normal.woff2')});font-weight:800}
      body{margin:0;background:#F6F7FA;color:#1E212E;font-family:Figtree;padding:60px}
      h1{font-weight:800;font-size:40px;margin:0 0 8px} p{color:#6E7487;font-weight:600;margin:0 0 40px;font-size:20px}
      .g{display:grid;grid-template-columns:repeat(2,1fr);gap:36px}
      img{width:100%;border-radius:12px;display:block;border:1px solid #E6E8EE;box-shadow:0 10px 30px rgba(30,33,46,.08)}
      .l{display:flex;justify-content:space-between;margin-top:12px;font-weight:600;font-size:20px} .l span{color:#6E7487}
    </style></head><body><h1>${title}</h1><p>Styleframes for approval · TeamBuildr brand (colors, Figtree, logo from teambuildr.com) · UI rebuilt as placeholder until Figma arrives</p><div class="g">
    ${items.map(f => `<div><img src="file://${path.join(out, f[0] + '.png')}"><div class="l"><div>${f[0]} · ${f[1]} <span>(${f[2]})</span></div><span>${f[3]}</span></div></div>`).join('')}
    </div></body></html>`;
    const tmp = path.join(out, '_sheet.html');
    fs.writeFileSync(tmp, html);
    const p2 = await browser.newPage({ viewport: { width: 1920, height: 400 }, deviceScaleFactor: 1 });
    await p2.goto('file://' + tmp);
    await p2.evaluate(() => document.fonts.ready);
    await p2.screenshot({ path: path.join(out, `contact_sheet_${set}.png`), fullPage: true });
    await p2.close();
    fs.unlinkSync(tmp);
  }
  await browser.close();
  console.log('done');
})();
