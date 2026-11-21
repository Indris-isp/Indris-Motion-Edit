import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import T from '../timing.json';

// Premium camera FX (replaces the glitch): zoom blur, soft bloom, a hint of chromatic edge
// and a gentle punch-in. Envelope is a smooth cosine swell, so the hit is buttery, not steppy.
export const lensAt = (f: number) => {
  let g = 0, kind = 'whip';
  for (const h of T.fx.lens) {
    const half = h.len / 2, d = Math.abs(f - h.at);
    if (d < half) {
      const e = h.amp * Math.pow(Math.cos((d / half) * Math.PI / 2), 2);
      if (e > g) { g = e; kind = h.kind; }
    }
  }
  return {g, kind};
};

export const LensFX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const {g, kind} = lensAt(f);
  if (g < 0.01) return <AbsoluteFill>{children}</AbsoluteFill>;
  // Ring opening: an iris that expands out of the centre through the hit (reference: ring/iris wipes).
  const h = T.fx.lens.find((x) => Math.abs(f - x.at) < x.len / 2);
  const ring = h ? Math.min(1, Math.max(0, (f - (h.at - h.len / 2)) / h.len)) : -1;
  const whip = kind === 'whip';
  const punch = 1 + g * (whip ? 0.06 : 0.035);
  const split = g * (whip ? 6 : 3.5);
  const trails = whip ? [0.03, 0.06, 0.1] : [0.02, 0.04];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <defs>
          <filter id="lens-ca" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={split} dy={0} result="r2" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
            <feOffset in="gb" dx={-split * 0.4} dy={0} result="gb2" />
            <feBlend in="r2" in2="gb2" mode="screen" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{transform: `scale(${punch})`, filter: `url(#lens-ca) blur(${g * (whip ? 5 : 2.5)}px) brightness(${1 + g * 0.12})`}}>
        <AbsoluteFill>{children}</AbsoluteFill>
        {/* Zoom-blur trails: faint scaled copies stretching out from the center. */}
        {trails.map((k, i) => (
          <AbsoluteFill key={i} style={{transform: `scale(${1 + k * g})`, opacity: g * (0.32 - i * 0.08)}}>{children}</AbsoluteFill>
        ))}
      </AbsoluteFill>
      {/* Bloom */}
      <AbsoluteFill style={{background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,.95) 0%, rgba(220,232,255,.6) 45%, rgba(255,255,255,0) 80%)', opacity: g * (whip ? 0.75 : 0.45)}} />
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${200 * g}px rgba(79,124,255,${0.35 * g})`}} />
      {whip && ring >= 0 && (
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: '50%',
          border: `${10 * (1 - ring) + 2}px solid rgba(43,89,232,${0.8 * (1 - ring)})`, boxShadow: `0 0 60px rgba(79,124,255,${0.6 * (1 - ring)})`,
          transform: `scale(${0.05 + ring * 3.2})`}} />
      )}
    </AbsoluteFill>
  );
};
