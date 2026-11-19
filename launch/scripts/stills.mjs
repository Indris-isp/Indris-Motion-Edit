// Renders key-frame stills (and an optional contact sheet) without re-bundling per frame.
// node scripts/stills.mjs [compId] [frames comma list]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const id = process.argv[2] || 'ISP-16x9';
const frames = (process.argv[3] || '30,120,200,290,360,450,560,640,720,800,880,960,1040,1080,1130,1180,1240,1290,1340,1420,1500,1580,1640,1760').split(',').map(Number);
const browserExecutable = process.env.REMOTION_CHROME || null;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const comp = await selectComposition({ serveUrl, id, browserExecutable });
fs.mkdirSync('out/stills', { recursive: true });
for (const frame of frames) {
  const output = `out/stills/${id}_${String(frame).padStart(4, '0')}.jpg`;
  await renderStill({ serveUrl, composition: comp, frame, output, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, scale: 0.5 });
  console.log(output);
}
