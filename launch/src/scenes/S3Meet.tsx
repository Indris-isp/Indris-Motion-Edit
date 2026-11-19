/* Scene 3 · Meet I.S.P. (fix) */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, cue } from '../config';
import { At, CAM, Camera, Center, Words, drift, prog, useL } from '../lib';
import { Logo } from '../brand';

export const S3Meet: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const k = L.wide ? 1 : 0.92;
  const m = cue('meet');
  const d = drift(f, 3, 3);
  const bloom = prog(f, m + 4, 40);
  return (
    <Center>
      <Camera s={k * (1 + 0.08 * prog(f, 0, 162, CAM))}>
        <At x={0} y={20}>
          <div style={{ width: 1100, height: 700, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,130,28,.30), rgba(255,130,28,.08) 60%, transparent)', opacity: bloom, scale: `${0.7 + 0.3 * bloom}` }} />
        </At>
        <At x={0} y={-250}>
          <Words segs={[{ t: 'Meet', serif: true }]} start={m} size={84} />
        </At>
        <At x={d.x} y={40 + d.y}>
          <Logo f={f} start={m + 6} size={0.82} id="meet" />
        </At>
        <At x={0} y={330}>
          <div style={{ fontSize: 26, color: C.mut, letterSpacing: '.02em', whiteSpace: 'nowrap', opacity: prog(f, m + 50, 20) }}>Video · Brand · Growth</div>
        </At>
      </Camera>
    </Center>
  );
};
