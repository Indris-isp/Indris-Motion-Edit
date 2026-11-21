// Renders each <section class="frame"> in frames.html to stills/NN.png and builds a contact sheet.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const out = path.join(dir, 'stills');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(dir, 'frames.html'));
  await p.evaluate(() => document.fonts.ready);
  const ids = await p.$$eval('section.frame', s => s.map(e => e.id));
  for (const id of ids) {
    const n = id.slice(1).padStart(2, '0');
    await (await p.$('#' + id)).screenshot({ path: path.join(out, `${n}.png`) });
  }
  // contact sheet: 4 x 3 grid of thumbnails
  const imgs = ids.map(id => `stills/${id.slice(1).padStart(2, '0')}.png`);
  const html = `<html><body style="margin:0;background:#0d0f14;font-family:sans-serif">
    <div style="display:grid;grid-template-columns:repeat(4,360px);gap:24px;padding:40px">
    ${imgs.map((s, i) => `<div><img src="${s}" style="width:360px;height:640px;border-radius:14px;display:block">
      <div style="color:#9aa;font-size:18px;margin-top:8px">${String(i + 1).padStart(2, '0')}</div></div>`).join('')}
    </div></body></html>`;
  fs.writeFileSync(path.join(dir, '_sheet.html'), html);
  const q = await b.newPage({ viewport: { width: 1584, height: 800 } });
  await q.goto('file://' + path.join(dir, '_sheet.html'));
  await q.waitForLoadState('networkidle');
  await q.screenshot({ path: path.join(out, 'contact_sheet.png'), fullPage: true });
  fs.unlinkSync(path.join(dir, '_sheet.html'));
  await b.close();
  console.log('rendered', ids.length, 'frames');
})();
