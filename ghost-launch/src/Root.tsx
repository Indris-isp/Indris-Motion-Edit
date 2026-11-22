import React from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { FPS, H, TOTAL, W } from "./config";
import { GhostLaunch } from "./Video";

// Load every face before frame 0 renders. A fallback font is a bug.
const faces: [string, string, string, string][] = [
  ["Inter", "Inter-400.ttf", "400", "normal"],
  ["Inter", "Inter-500.ttf", "500", "normal"],
  ["Inter", "Inter-600.ttf", "600", "normal"],
  ["Inter", "Inter-700.ttf", "700", "normal"],
  ["Inter", "Inter-800.ttf", "800", "normal"],
  ["Instrument Serif", "InstrumentSerif-Regular.ttf", "400", "normal"],
  ["Instrument Serif", "InstrumentSerif-Italic.ttf", "400", "italic"],
];
const handle = delayRender("Loading fonts");
Promise.all(
  faces.map(([family, file, weight, style]) =>
    new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight, style }).load().then((ff) => (document.fonts as any).add(ff)),
  ),
)
  .then(() => document.fonts.ready)
  .then(() => continueRender(handle))
  .catch((e) => { console.error(e); continueRender(handle); });

if (TOTAL !== 1800) throw new Error(`Scene lengths sum to ${TOTAL}, expected 1800`);

export const RemotionRoot: React.FC = () => (
  <Composition id="GhostLaunch" component={GhostLaunch} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
