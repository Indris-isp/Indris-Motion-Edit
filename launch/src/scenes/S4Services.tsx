/* Scene 4 · All in one team (fix): video editing, personal branding, social media growth */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COPY, cue } from '../config';
import { At, CAM, Camera, Center, Check, OUT, Words, card, countVal, drift, enter, lerp, pop, prog, useL } from '../lib';

const TW = 500, TH = 580, PW = TW - 56;

const Editing: React.FC<{ f: number; s: number }> = ({ f, s }) => {
  const clips = [
    [0, 0, 120, C.acc], [0, 126, 90, '#FF9F4D'], [0, 222, 150, C.acc], [0, 378, 66, '#FFB862'],
    [1, 40, 160, '#5B8CFF'], [1, 240, 120, '#5B8CFF'],
    [2, 0, 444, '#3FD98A'],
  ] as const;
  const ph = prog(f, s + 10, 150, CAM);
  return (
    <>
      <div style={{ position: 'absolute', left: 28, top: 28, width: PW, height: 236, borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg,#3B2414,#1B1410 60%,#0F0D0C)' }}>
        <div style={{ position: 'absolute', left: 170, top: 66, width: 104, height: 170, borderRadius: '52px 52px 12px 12px', background: 'linear-gradient(180deg,#C9733A,#6A3415)' }} />
        <div style={{ position: 'absolute', left: 190, top: 22, width: 64, height: 64, borderRadius: '50%', background: '#D88A55' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#fff', textShadow: '0 2px 0 #000', opacity: prog(f, s + 40, 10) }}>
          <span style={{ background: C.acc, color: '#111', padding: '2px 8px', borderRadius: 6 }}>HOOK</span> in 1 second
        </div>
      </div>
      <div style={{ position: 'absolute', left: 28, top: 282, width: PW, height: 112 }}>
        {[0, 1, 2].map((t) => (
          <div key={t} style={{ position: 'absolute', left: 0, top: t * 38, width: PW, height: 30, borderRadius: 7, background: '#141416' }} />
        ))}
        {clips.map(([t, x, w, col], i) => {
          const e = pop(f, s + 4 + i * 3);
          return <div key={i} style={{ position: 'absolute', left: x, top: t * 38, width: w, height: 30, borderRadius: 7, background: col, opacity: 0.9 * prog(f, s + 4 + i * 3, 6), transform: `scaleX(${e})`, transformOrigin: 'left' }} />;
        })}
        <div style={{ position: 'absolute', left: ph * PW, top: -10, width: 3, height: 132, background: '#fff', boxShadow: '0 0 10px #fff', opacity: prog(f, s + 8, 8) }} />
      </div>
    </>
  );
};

const Branding: React.FC<{ f: number; s: number }> = ({ f, s }) => {
  const ring = prog(f, s + 4, 36);
  return (
    <div style={{ position: 'absolute', left: 28, top: 28, width: PW, height: 366, borderRadius: 16, background: '#141416' }}>
      <svg width="150" height="150" style={{ position: 'absolute', left: 147, top: 22 }}>
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.accHi} /><stop offset="1" stopColor={C.accLo} /></linearGradient>
        </defs>
        <circle cx="75" cy="75" r="68" fill="none" stroke="url(#ring)" strokeWidth="7" pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 75 75)" strokeLinecap="round" />
        <circle cx="75" cy="75" r="58" fill="#D88A55" />
        <circle cx="75" cy="62" r="20" fill="#7A3B16" />
        <path d="M40 118c5-20 18-28 35-28s30 8 35 28" fill="#7A3B16" />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 190, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 700, ...enter(f, s + 14, 20) }}>
        @you
        <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: `scale(${pop(f, s + 30)})` }}><circle cx="14" cy="14" r="13" fill={C.acc} /><path d="M8 14.5 L12.5 19 L20 10" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center', fontSize: 19, color: C.mut, ...enter(f, s + 18, 20) }}>Founder · I teach what I build</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 284, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {[C.acc, '#FFE2C4', '#111114', '#F5F3F0', '#FF4F45'].map((c, i) => (
          <div key={i} style={{ width: 50, height: 50, borderRadius: 14, background: c, border: '2px solid rgba(255,255,255,.12)', transform: `scale(${pop(f, s + 22 + i * 3)})` }} />
        ))}
      </div>
    </div>
  );
};

const Growth: React.FC<{ f: number; s: number }> = ({ f, s }) => {
  const p = prog(f, s + 4, 60, OUT);
  const pts = [0, 4, 3, 9, 8, 15, 19, 26, 34, 46].map((v, i) => [24 + i * 44, 300 - v * 5.2]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const cut = 24 + p * 9 * 44;
  return (
    <div style={{ position: 'absolute', left: 28, top: 28, width: PW, height: 366, borderRadius: 16, background: '#141416', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 24, top: 20, fontSize: 19, color: C.mut }}>Followers</div>
      <div style={{ position: 'absolute', left: 24, top: 46, fontSize: 56, fontWeight: 800, color: C.green, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>+{Math.round(countVal(f, s + 4, 0, COPY.growthPct))}%</div>
      <svg width={PW} height={366} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.green} stopOpacity=".35" /><stop offset="1" stopColor={C.green} stopOpacity="0" /></linearGradient>
          <clipPath id="gCut"><rect x="0" y="0" width={cut} height="366" /></clipPath>
        </defs>
        <g clipPath="url(#gCut)">
          <path d={`${d} L${24 + 9 * 44} 366 L24 366 Z`} fill="url(#gArea)" />
          <path d={d} fill="none" stroke={C.green} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export const S4Services: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const cues = [cue('editing'), cue('branding'), cue('growth')];
  const one = cue('allone');
  const m = prog(f, one - 4, 36, CAM); // merge
  const titles = ['Video editing', 'Personal branding', 'Social media growth'];
  const k = L.wide ? 1 : L.tall ? 0.72 : 0.56;
  const gap = lerp(L.tall ? 620 : 560, L.tall ? 600 : 525, m);
  const pos = (i: number) => (L.tall ? { x: 0, y: (i - 1) * gap } : { x: (i - 1) * gap, y: 0 });
  const act = f < cues[1] ? 0 : f < cues[2] ? 1 : 2;
  const fol = (i: number) => (L.tall ? -pos(i).y : -pos(i).x) * 0.15 * k;
  let c = fol(0);
  c = lerp(c, fol(1), prog(f, cues[1] - 6, 40, CAM));
  c = lerp(c, fol(2), prog(f, cues[2] - 6, 40, CAM));
  c = lerp(c, 0, m);
  const camS = k * (1.03 - 0.1 * m);
  const panelW = (L.tall ? TW : 3 * TW + 2 * (gap - TW)) + 60;
  const panelH = (L.tall ? 3 * TH + 2 * (gap - TH) : TH) + 60;
  const yOff = L.wide ? 70 : L.tall ? 90 : 50;
  return (
    <Center>
      <Camera s={camS} x={L.tall ? 0 : c} y={(L.tall ? c : 0) + yOff * m}>
        <At x={0} y={0}>
          <div style={{ width: panelW, height: panelH, borderRadius: 44, border: `2px solid rgba(255,130,28,${0.55 * m})`, background: `rgba(255,130,28,${0.05 * m})`, boxShadow: `0 0 80px rgba(255,130,28,${0.18 * m})`, scale: `${1.06 - 0.06 * m}` }} />
        </At>
        {[0, 1, 2].map((i) => {
          const p = pos(i), d = drift(f, i + 4, 4);
          const dim = (i !== act ? prog(f, cues[Math.min(2, i + 1)] - 6, 20) : 0) * (1 - m);
          return (
            <At key={i} x={p.x + d.x} y={p.y + d.y} style={enter(f, cues[i] - 4, 70)}>
              <div style={{ ...card(TW, TH), opacity: 1 - 0.45 * dim }}>
                {i === 0 && <Editing f={f} s={cues[0]} />}
                {i === 1 && <Branding f={f} s={cues[1]} />}
                {i === 2 && <Growth f={f} s={cues[2]} />}
                <div style={{ position: 'absolute', left: 32, top: 420, fontSize: 19, fontWeight: 600, color: C.acc, letterSpacing: '.12em' }}>SERVICE 0{i + 1}</div>
                <div style={{ position: 'absolute', left: 32, top: 452, fontSize: 44, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05 }}>{titles[i]}</div>
                <div style={{ position: 'absolute', right: 30, top: 422 }}>
                  <Check p={prog(f, one + 10 + i * 4, 24)} size={40} color={C.acc} />
                </div>
              </div>
            </At>
          );
        })}
      </Camera>
      <At x={0} y={L.wide ? -410 : L.tall ? -790 : -420}>
        <Words segs={[{ t: 'All in one' }, { t: 'team.', serif: true, acc: true }]} start={one} size={L.square ? 72 : 92} />
      </At>
    </Center>
  );
};
