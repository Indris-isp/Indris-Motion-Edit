/* Scene 2 · Three gaps (problem): unedited footage, no personal brand, no strategy */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COPY, cue } from '../config';
import { At, CAM, Camera, Center, Stamp, card, drift, enter, exitP, lerp, prog, rnd, useL } from '../lib';

const W = 470, H = 540;

const Raw: React.FC<{ f: number }> = ({ f }) => {
  const j = { x: (rnd('jx' + Math.floor(f / 3)) - 0.5) * 10, y: (rnd('jy' + Math.floor(f / 3)) - 0.5) * 8, r: (rnd('jr' + Math.floor(f / 3)) - 0.5) * 2.4 };
  return (
    <div style={{ position: 'absolute', left: 30, top: 30, width: W - 60, height: 270, borderRadius: 18, overflow: 'hidden', background: '#2A2928' }}>
      <div style={{ position: 'absolute', inset: -30, transform: `translate(${j.x}px, ${j.y}px) rotate(${-4 + j.r}deg)`, background: 'linear-gradient(180deg,#56534F 0%,#3B3936 48%,#2B2A28 49%,#1F1E1D 100%)', filter: 'saturate(.2) contrast(.8)' }}>
        <div style={{ position: 'absolute', left: 180, top: 120, width: 90, height: 150, borderRadius: '45px 45px 10px 10px', background: '#24231F' }} />
        <div style={{ position: 'absolute', left: 197, top: 82, width: 56, height: 56, borderRadius: '50%', background: '#24231F' }} />
      </div>
      <div style={{ position: 'absolute', left: 14, top: 12, fontSize: 17, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.red, opacity: Math.floor(f / 20) % 2 ? 1 : 0.3 }} />
        {COPY.rawFile}
      </div>
      <div style={{ position: 'absolute', right: 14, bottom: 12, fontSize: 17, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '3px 9px', borderRadius: 6 }}>{COPY.rawLength}</div>
    </div>
  );
};

const NoBrand: React.FC = () => (
  <div style={{ position: 'absolute', left: 30, top: 30, width: W - 60, height: 270, borderRadius: 18, background: '#1C1C1F', border: `1px dashed ${C.dim}`, boxSizing: 'border-box' }}>
    <div style={{ position: 'absolute', left: 30, top: 40, width: 110, height: 110, borderRadius: '50%', background: '#2C2C30', display: 'grid', placeItems: 'center' }}>
      <svg width="62" height="62" viewBox="0 0 52 52"><circle cx="26" cy="19" r="10" fill="#55555B" /><path d="M8 48c2-11 9-16 18-16s16 5 18 16" fill="#55555B" /></svg>
    </div>
    <div style={{ position: 'absolute', left: 166, top: 58, fontSize: 26, fontWeight: 600, color: C.mut }}>@your_name</div>
    <div style={{ position: 'absolute', left: 166, top: 100, fontSize: 18, color: C.dim }}>no bio · no look · no voice</div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: 'absolute', left: 30 + i * 128, top: 182, width: 112, height: 60, borderRadius: 12, background: '#26262A' }} />
    ))}
  </div>
);

const NoStrategy: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const p = prog(f, start + 4, 40);
  const pts = [0, 6, -4, 3, -6, 2, -8, -3, -10].map((v, i) => [30 + i * 47, 150 - v * 4]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <div style={{ position: 'absolute', left: 30, top: 30, width: W - 60, height: 270, borderRadius: 18, background: '#1C1C1F' }}>
      <div style={{ position: 'absolute', left: 22, top: 18, fontSize: 18, color: C.mut }}>Reach · last 30 days</div>
      <div style={{ position: 'absolute', right: 22, top: 14, fontSize: 26, fontWeight: 800, color: C.red }}>−3%</div>
      <svg width={W - 60} height={270} style={{ position: 'absolute', inset: 0 }}>
        {[90, 140, 190, 240].map((y) => (
          <line key={y} x1="22" x2={W - 82} y1={y} y2={y} stroke="rgba(255,255,255,.05)" />
        ))}
        <path d={d} transform="translate(0 40)" fill="none" stroke={C.mut} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      </svg>
    </div>
  );
};

export const S2Gaps: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const L = useL();
  const cues = [cue('unedited'), cue('nobrand'), cue('nostrat')];
  const titles = ['Unedited footage.', 'No personal brand.', 'No strategy.'];
  const sp = L.tall ? 0 : 540;
  const vs = L.wide ? 0 : L.tall ? 590 : 0;
  const k = L.wide ? 1 : L.tall ? 0.95 : 0.56;
  const at = (i: number) => ({ x: (i - 1) * sp, y: (i - 1) * vs });
  // camera follows the active card, then frames all three
  const act = f < cues[1] ? 0 : f < cues[2] ? 1 : 2;
  const follow = (i: number) => -at(i).x * 0.2 * k - at(i).y * 0.2 * k * (L.tall ? 1 : 0);
  let cx = follow(0);
  cx = lerp(cx, follow(1), prog(f, cues[1] - 6, 40, CAM));
  cx = lerp(cx, follow(2), prog(f, cues[2] - 6, 40, CAM));
  cx = lerp(cx, 0, prog(f, cues[2] + 50, 50, CAM));
  const exitStart = dur - 26;
  return (
    <Center>
      <Camera s={k * (1.04 - 0.04 * prog(f, cues[2] + 50, 50, CAM))} x={L.tall ? 0 : cx} y={L.tall ? cx : 0}>
        {[0, 1, 2].map((i) => {
          const p = at(i), d = drift(f, i, 4);
          const x = exitP(f, exitStart + i * 3, 18);
          return (
            <At key={i} x={p.x + d.x} y={p.y + d.y - x * 900} style={{ ...enter(f, cues[i] - 4, 70), rotate: `${x * (i - 1) * 8}deg` }}>
              <div style={{ ...card(W, H), opacity: 1 - 0.45 * (i < 2 ? prog(f, cues[i + 1] - 6, 20) : 0) * (1 - prog(f, cues[2] + 50, 30)) }}>
                {i === 0 && <Raw f={f} />}
                {i === 1 && <NoBrand />}
                {i === 2 && <NoStrategy f={f} start={cues[2]} />}
                <div style={{ position: 'absolute', left: 34, top: 340, fontSize: 19, fontWeight: 600, color: C.red, letterSpacing: '.12em' }}>PROBLEM 0{i + 1}</div>
                <div style={{ position: 'absolute', left: 34, top: 374, width: W - 68, fontSize: 46, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05 }}>{titles[i]}</div>
              </div>
              <div style={{ position: 'absolute', right: -24, top: -24 }}>
                <Stamp f={f} at={cues[i] + 26} />
              </div>
            </At>
          );
        })}
      </Camera>
    </Center>
  );
};
