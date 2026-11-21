import React from 'react';
import {cancelRender, Composition, continueRender, delayRender, staticFile} from 'remotion';
import {FPS, SCENES, TOTAL} from './config';
import {Launch} from './Launch';

// Fonts must be loaded before frame 0: a fallback font is a bug.
const FONTS: [string, string, string, string][] = [
  ['Inter', 'Inter-400.ttf', '400', 'normal'],
  ['Inter', 'Inter-500.ttf', '500', 'normal'],
  ['Inter', 'Inter-600.ttf', '600', 'normal'],
  ['Inter', 'Inter-700.ttf', '700', 'normal'],
  ['Inter', 'Inter-800.ttf', '800', 'normal'],
  ['Serif', 'InstrumentSerif-Italic.ttf', '400', 'italic'],
];
const handle = delayRender('Loading fonts', {timeoutInMilliseconds: 120000, retries: 2});
Promise.all(
  FONTS.map(([fam, file, weight, style]) =>
    new FontFace(fam, `url(${staticFile(file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff)),
  ),
)
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));

// Scene lengths must add up to the total, with no gaps.
let at = 0;
for (const s of SCENES) {
  if (s.from !== at) throw new Error(`Scene ${s.id} starts at ${s.from}, expected ${at}`);
  at += s.dur;
}
if (at !== TOTAL) throw new Error(`Scenes add up to ${at} frames, expected ${TOTAL}`);

export const Root: React.FC = () => (
  <>
    <Composition id="Launch169" component={Launch} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{audio: true}} />
    <Composition id="Launch916" component={Launch} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{audio: true}} />
  </>
);
