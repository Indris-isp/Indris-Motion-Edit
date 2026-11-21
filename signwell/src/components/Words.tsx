import React from 'react';
import {enter, drift} from '../anim';
import {DISPLAY} from '../fonts';

// Kinetic headline: words rise in one by one with overshoot, then keep a slow drift.
export const Words: React.FC<{
  words: string[]; f: number; start?: number; starts?: number[]; offset?: number;
  size?: number; color?: string; weight?: number; gap?: number;
}> = ({words, f, start = 0, starts, offset = 4, size = 84, color = '#fff', weight = 800, gap = 0.28}) => (
  <div style={{display: 'flex', gap: `0 ${gap}em`, justifyContent: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap',
    fontFamily: DISPLAY, fontWeight: weight, fontSize: size, letterSpacing: '-0.02em', color, lineHeight: 1.05,
    transform: `translateY(${drift(f, 3, 300)}px)`}}>
    {words.map((w, i) => {
      const s = starts ? starts[i] : start + i * offset;
      const p = enter(f, s);
      return (
        <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p * 1.4),
          transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`}}>{w}</span>
      );
    })}
  </div>
);
