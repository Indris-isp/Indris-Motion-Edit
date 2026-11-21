import React from 'react';
import {interpolate} from 'remotion';
import {enter, drift, clamp} from '../anim';
import {rnd} from '../fx/Glitch';
import {DISPLAY} from '../fonts';
import {TYPE} from '../config';

// Kinetic headline: each word rises out of a mask with overshoot and a short RGB-split
// stutter on arrival, then keeps a slow drift. `accent` maps word index → color.
export const Words: React.FC<{
  words: string[]; f: number; start?: number; starts?: number[]; offset?: number;
  size?: number; color?: string; weight?: number; gap?: number; accent?: Record<number, string>;
}> = ({words, f, start = 0, starts, offset = 4, size = 84, color = '#fff', weight = TYPE.heading, gap = 0.28, accent = {}}) => (
  <div style={{display: 'flex', gap: `0 ${gap}em`, justifyContent: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap',
    fontFamily: DISPLAY, fontWeight: weight, fontSize: size, letterSpacing: '-0.02em', color, lineHeight: 1.1,
    transform: `translateY(${drift(f, 3, 300)}px)`}}>
    {words.map((w, i) => {
      const s = starts ? starts[i] : start + i * offset;
      const p = enter(f, s);
      const stutter = interpolate(f, [s, s + 10], [1, 0], clamp);
      const jx = stutter > 0 ? (rnd(Math.floor(f / 2) * 13 + i) - 0.5) * 14 * stutter : 0;
      const split = 10 * stutter;
      return (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
          <span style={{display: 'inline-block', color: accent[i] ?? color,
            transform: `translateY(${(1 - Math.min(p, 1)) * 105}%) translateX(${jx}px)`,
            textShadow: split > 0.2 ? `${split}px 0 rgba(255,45,111,.85), ${-split}px 0 rgba(45,224,255,.85)` : 'none'}}>{w}</span>
        </span>
      );
    })}
  </div>
);
