// node stills.cjs <compId> <outDir> <frame,frame,...>  — bundles once, renders key-frame stills.
const path = require('path');
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderStill} = require('@remotion/renderer');
(async () => {
  const [comp, outDir, frames] = process.argv.slice(2);
  const serveUrl = await bundle({entryPoint: path.join(__dirname, 'src/index.ts')});
  const inputProps = {audio: false};
  const composition = await selectComposition({serveUrl, id: comp, inputProps, browserExecutable: '/opt/pw-browsers/chromium'});
  for (const f of frames.split(',').map(Number)) {
    const output = path.join(outDir, `${comp}_${String(f).padStart(4, '0')}.png`);
    await renderStill({serveUrl, composition, frame: f, output, inputProps, browserExecutable: '/opt/pw-browsers/chromium'});
    console.log('still', output);
  }
})().catch((e) => { console.error(e); process.exit(1); });
