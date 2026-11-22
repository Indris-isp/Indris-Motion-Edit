// Renders each storyboard frame of frames.html to out/NN.png (1920x1080).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, 'frames.html'));
  await p.evaluate(() => document.fonts.ready);
  const frames = await p.$$('.frame');
  for (let i = 0; i < frames.length; i++) {
    await frames[i].screenshot({ path: path.join(__dirname, 'out', String(i + 1).padStart(2, '0') + '.png') });
  }
  await b.close();
})();
