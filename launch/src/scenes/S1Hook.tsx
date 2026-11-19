/* Scene 1 · Nobody's watching (hook) */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COPY, FONT, cue } from '../config';
import { At, Camera, Center, CAM, Words, countVal, drift, enter, pop, prog, rnd, useL } from '../lib';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const Phone: React.FC<{ f: number }> = ({ f }) => {
  const p0 = cue('posting') + 2;
  const posted = DAYS.filter((_, i) => f >= p0 + i * 12).length;
  const tq = cue('nobody') + 18;
  const views = countVal(f, tq, 0, COPY.weekViews);
  return (
    <div style={{ width: 440, height: 880, borderRadius: 64, background: '#050506', border: '2px solid #2A2A2E', boxShadow: '0 60px 120px rgba(0,0,0,.7), inset 0 0 0 10px #0E0E10', position: 'relative', overflow: 'hidden', fontFamily: FONT.sans, color: C.text }}>
      {/* notch */}
      <div style={{ position: 'absolute', left: 170, top: 22, width: 100, height: 28, borderRadius: 14, background: '#000' }} />
      {/* profile header */}
      <div style={{ position: 'absolute', left: 30, top: 80, display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'linear-gradient(160deg,#3A3A3F,#232326)', display: 'grid', placeItems: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="19" r="10" fill="#5A5A60" /><path d="M8 48c2-11 9-16 18-16s16 5 18 16" fill="#5A5A60" /></svg>
        </div>
        <div style={{ display: 'flex', gap: 26 }}>
          {[
            [posted, 'Posts'],
            [112, 'Followers'],
            [98, 'Following'],
          ].map(([n, l], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 17, color: C.mut }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 30, top: 194, fontSize: 21, fontWeight: 600 }}>@you</div>
      <div style={{ position: 'absolute', left: 30, top: 226, width: 220, height: 10, borderRadius: 5, background: '#26262A' }} />
      <div style={{ position: 'absolute', left: 30, top: 246, width: 150, height: 10, borderRadius: 5, background: '#26262A' }} />
      {/* grid */}
      <div style={{ position: 'absolute', left: 14, top: 284, width: 412 }}>
        {DAYS.map((d, i) => {
          const st = p0 + i * 12;
          const s = pop(f, st);
          const col = i % 3, row = Math.floor(i / 3);
          const g = 34 + Math.floor(rnd('g' + i) * 16);
          return (
            <div key={d} style={{ position: 'absolute', left: col * 138, top: row * 182, width: 134, height: 178, borderRadius: 10, overflow: 'hidden', opacity: prog(f, st, 8), transform: `translateY(${(1 - s) * -60}px) scale(${0.85 + 0.15 * s})`, background: `linear-gradient(${150 + i * 20}deg, hsl(30 4% ${g}%), hsl(30 3% ${g - 16}%))` }}>
              <div style={{ position: 'absolute', left: 10, top: 9, fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,.55)', letterSpacing: '.06em' }}>{d}</div>
              <div style={{ position: 'absolute', left: 10, bottom: 9, fontSize: 16, fontWeight: 600, color: f > tq ? C.red : 'rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="13" viewBox="0 0 12 13"><path d="M1 1 L11 6.5 L1 12 Z" fill="currentColor" /></svg>
                {COPY.postViews[i]}
              </div>
            </div>
          );
        })}
      </div>
      {/* toast */}
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 30, height: 96, borderRadius: 22, background: 'rgba(32,32,36,.96)', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', boxSizing: 'border-box', ...enter(f, tq - 6, 80) }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(255,79,69,.15)', display: 'grid', placeItems: 'center' }}>
          <svg width="30" height="30" viewBox="0 0 30 30"><path d="M3 8 L11 16 L16 11 L27 22" fill="none" stroke={C.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 22 H27 V14" fill="none" stroke={C.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div>
          <div style={{ fontSize: 17, color: C.mut }}>Views this week</div>
          <div style={{ fontSize: 34, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{Math.round(views)}</div>
        </div>
      </div>
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const d = drift(f, 2, 5);
  const s = 1 + 0.045 * prog(f, 0, 240, CAM);
  const head = (size: number, width: number, align: 'left' | 'center') => (
    <div style={{ width }}>
      <Words segs={[{ t: 'Posting every day…' }]} start={cue('posting')} size={size} align={align} width={width} />
      <div style={{ height: size * 0.25 }} />
      <Words segs={[{ t: 'and still', mut: true }, { t: "nobody's watching?", serif: true, acc: true }]} start={cue('nobody')} size={size} align={align} width={width} />
    </div>
  );
  const pos = L.wide
    ? { hx: -430, hy: 0, px: 340, py: 0, ps: 1, hs: 96, hw: 720, al: 'left' as const }
    : L.tall
      ? { hx: 0, hy: -650, px: 0, py: 210, ps: 1.05, hs: 92, hw: 900, al: 'center' as const }
      : { hx: 0, hy: -380, px: 0, py: 150, ps: 0.68, hs: 70, hw: 900, al: 'center' as const };
  return (
    <Center>
      <Camera s={s}>
        <At x={pos.hx} y={pos.hy}>{head(pos.hs, pos.hw, pos.al)}</At>
        <At x={pos.px + d.x} y={pos.py + d.y} style={{ ...enter(f, 0, 120), scale: `${pos.ps}` }}>
          <Phone f={f} />
        </At>
      </Camera>
    </Center>
  );
};
