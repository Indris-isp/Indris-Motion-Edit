/* Scene 7 · Logo + CTA */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COPY, cue } from '../config';
import { At, CAM, Camera, Center, Cursor, drift, enter, press, prog, rnd, useL } from '../lib';
import { Logo } from '../brand';

export const S7Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const L = useL();
  const b = cue('book'), bio = cue('bio');
  const k = L.wide ? 1 : L.tall ? 1 : 0.9;
  const click = b + 92;
  const d = drift(f, 11, 3);
  const glow = prog(f, click, 8) * (1 - prog(f, click + 8, 40));
  // handle scramble-in
  const target = COPY.handle, pool = 'abcdefghijklmnopqrstuvwxyz0123456789_';
  const sp = prog(f, bio + 6, 30);
  let handle = '';
  for (let i = 0; i < target.length; i++) handle += (i + 1) / target.length <= sp ? target[i] : pool[Math.floor(rnd(Math.floor(f / 2) * 31 + i) * pool.length)];
  return (
    <Center>
      <Camera s={k * (1 + 0.05 * prog(f, 0, dur, CAM))}>
        <At x={0} y={-250}>
          <div style={{ width: 900, height: 600, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,130,28,.22), transparent)', opacity: prog(f, 0, 40) }} />
        </At>
        <At x={d.x} y={-200 + d.y}>
          <Logo f={f} start={0} size={0.6} id="cta" />
        </At>
        <At x={0} y={150} style={enter(f, b, 50)}>
          <div style={{ transform: `scale(${press(f, click)})`, padding: '30px 56px', borderRadius: 999, background: `linear-gradient(135deg, ${C.accHi} 0%, ${C.acc} 48%, ${C.accLo} 100%)`, color: '#111', fontSize: 46, fontWeight: 700, letterSpacing: '-0.025em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 18, boxShadow: `inset 0 2px 0 rgba(255,255,255,.4), 0 20px 50px rgba(255,115,20,${0.35 + 0.4 * glow})` }}>
            {COPY.cta}
            <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: `translateX(${6 * prog(f, click, 10) * (1 - prog(f, click + 10, 20))}px)` }}><path d="M8 20 H31 M22 11 L31 20 L22 29" fill="none" stroke="#111" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </At>
        <At x={0} y={150 + 64} style={{ opacity: prog(f, b + 10, 20) }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#111', background: '#F5F3F0', padding: '6px 16px', borderRadius: 999, transform: `translate(${L.wide ? 330 : 280}px, -110px) rotate(6deg) scale(${f >= b + 10 ? 1 : 0})`, letterSpacing: '.06em' }}>FREE</div>
        </At>
        <At x={0} y={330} style={enter(f, bio, 40)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 38, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>
            {COPY.ctaSub}
            <svg width="34" height="34" viewBox="0 0 34 34" style={{ transform: `translateY(${Math.sin(f / 10) * 4}px)` }}><path d="M17 5 V27 M8 18 L17 27 L26 18" fill="none" stroke={C.acc} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ color: C.mut, fontWeight: 500, fontFamily: 'Inter', fontVariantNumeric: 'tabular-nums' }}>{handle}</span>
          </div>
        </At>
        <Cursor keys={[{ f: b + 40, x: 520, y: 430 }, { f: b + 86, x: 140, y: 168 }, { f: b + 140, x: 360, y: 300 }]} clicks={[click]} opacity={prog(f, b + 38, 8) * (1 - prog(f, b + 132, 12))} />
      </Camera>
      <div style={{ position: 'absolute', inset: -5000, background: '#000', opacity: prog(f, dur - 18, 18) }} />
    </Center>
  );
};
