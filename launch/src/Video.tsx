import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, SCENES, SCENE_FROM, VO } from './config';
import { Backdrop } from './brand';
import { Shell, lerp, prog, CAM } from './lib';
import { S1Hook } from './scenes/S1Hook';
import { S2Gaps } from './scenes/S2Gaps';
import { S3Meet } from './scenes/S3Meet';
import { S4Services } from './scenes/S4Services';
import { S5Transform } from './scenes/S5Transform';
import { S6Record } from './scenes/S6Record';
import { S7Cta } from './scenes/S7Cta';
import './brand';

const VIEWS: Record<string, React.FC<{ dur: number }>> = {
  hook: S1Hook, gaps: S2Gaps, meet: S3Meet, services: S4Services, transform: S5Transform, record: S6Record, cta: S7Cta,
};
/* where the warm glow sits per scene (fraction of the canvas) */
const GLOW: Record<string, [number, number]> = {
  hook: [0.7, 0.5], gaps: [0.5, 0.5], meet: [0.5, 0.48], services: [0.5, 0.55], transform: [0.62, 0.5], record: [0.35, 0.5], cta: [0.5, 0.4],
};

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  let gx = GLOW.hook[0], gy = GLOW.hook[1];
  SCENES.forEach((s, i) => {
    const p = prog(f, SCENE_FROM[i] - 20, 50, CAM);
    gx = lerp(gx, GLOW[s.id][0], p); gy = lerp(gy, GLOW[s.id][1], p);
  });
  return <Backdrop glowX={gx} glowY={gy} />;
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: '#0B0B0C', fontFamily: FONT.sans, color: C.text }}>
    <Bg />
    {SCENES.map((s, i) => {
      const V = VIEWS[s.id];
      return (
        <Sequence key={s.id} from={SCENE_FROM[i]} durationInFrames={s.dur} name={`${i + 1} · ${s.id}`}>
          <Shell dur={s.dur} noExit={s.id === 'cta'}>
            <V dur={s.dur} />
          </Shell>
        </Sequence>
      );
    })}
    {Object.values(VO).map((v) => (
      <Sequence key={v.key} from={v.from} durationInFrames={v.dur + 30} name={`VO ${v.key}`} layout="none">
        <Html5Audio src={staticFile(`vo/${v.key}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
