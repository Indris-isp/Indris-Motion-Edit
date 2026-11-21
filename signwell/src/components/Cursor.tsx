import React from 'react';
import {interpolate} from 'remotion';
import {clamp} from '../anim';

// Arrow cursor drawn in vector. `pressAt` frames get a small squash.
export const Cursor: React.FC<{x: number; y: number; f: number; pressAt?: number[]; opacity?: number}> = ({x, y, f, pressAt = [], opacity = 1}) => {
  let s = 1;
  for (const p of pressAt) s = Math.min(s, interpolate(f, [p, p + 3, p + 8], [1, 0.86, 1], clamp));
  return (
    <div style={{position: 'absolute', left: 960 + x, top: 540 + y, opacity, transform: `scale(${s})`, transformOrigin: '0 0',
      filter: 'drop-shadow(0 8px 12px rgba(0,0,0,.35))', zIndex: 50}}>
      <svg width="40" height="50" viewBox="0 0 24 30" style={{display: 'block', marginLeft: -4, marginTop: -3}}>
        <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L21 17 Z" fill="#fff" stroke="#141b2d" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
