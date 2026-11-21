import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import T from '../timing.json';

// Deterministic hash → [0,1). Same frame always gives the same glitch.
export const rnd = (n: number) => {
  let t = (Math.floor(n) * 2654435761) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Glitch amount at a global frame: each hit swells in and out around its center.
// The pattern re-rolls every 2 frames (the digital stutter); the envelope stays smooth.
export const glitchAt = (f: number) => {
  let g = 0, seed = 0;
  T.fx.glitch.forEach((h, i) => {
    const half = h.len / 2, d = Math.abs(f - h.at);
    if (d < half) {
      const e = h.amp * Math.pow(Math.cos((d / half) * Math.PI / 2), 1.2);
      if (e > g) { g = e; seed = i * 1009 + Math.floor(f / 2); }
    }
  });
  return {g, seed};
};

const BLOCK_COLORS = ['#2b59e8', '#7b9bff', '#3de0ff', '#c9d6ff']; // light look: blues only

export const GlitchFX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const {g, seed} = glitchAt(f);
  if (g < 0.02) return <AbsoluteFill>{children}</AbsoluteFill>;

  const r = (k: number) => rnd(seed * 131 + k * 7 + 3);
  // Horizontal slices of the frame, displaced sideways.
  const bands: {y: number; h: number; dx: number}[] = [];
  let y = 0, k = 0;
  while (y < height) {
    const h = (0.02 + r(k++) * 0.14) * height;
    if (r(k++) < 0.2 + 0.6 * g) bands.push({y, h, dx: (r(k++) - 0.5) * 2 * g * width * 0.14});
    y += h;
  }
  const split = 4 + g * 22;
  const jump = (r(99) - 0.5) * g * 18;
  const blocks = Array.from({length: Math.floor(3 + g * 16)}, (_, i) => ({
    x: r(200 + i) * width, y: r(300 + i) * height,
    w: 30 + r(400 + i) * 380 * (0.4 + g), h: 6 + r(500 + i) * 70,
    kind: r(600 + i), color: BLOCK_COLORS[Math.floor(r(700 + i) * BLOCK_COLORS.length)],
  }));

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <defs>
          <filter id="rgbsplit" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={split} dy={0} result="r2" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx={-split} dy={0} result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{filter: 'url(#rgbsplit)', transform: `translateY(${jump}px) scale(${1 + g * 0.06})`}}>
        <AbsoluteFill>{children}</AbsoluteFill>
        {bands.map((b, i) => (
          <AbsoluteFill key={i} style={{clipPath: `inset(${b.y}px 0 ${Math.max(0, height - b.y - b.h)}px 0)`, transform: `translateX(${b.dx}px)`}}>
            {children}
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
      {/* Data blocks: inverted patches, solid color chips and noise stripes. */}
      {blocks.map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b.x - b.w / 2, top: b.y, width: b.w, height: b.h,
          ...(b.kind < 0.4 ? {background: 'rgba(43,89,232,.85)', mixBlendMode: 'multiply' as const}
            : b.kind < 0.75 ? {background: b.color, opacity: 0.7}
            : {background: `repeating-linear-gradient(90deg, ${b.color} 0 3px, transparent 3px 7px)`, opacity: 0.7})}} />
      ))}
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 1px, transparent 1px 3px)', opacity: g * 0.22, mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};
