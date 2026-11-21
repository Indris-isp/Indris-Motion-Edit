import React from 'react';
import {enter, drift} from '../anim';
import {DISPLAY} from '../fonts';
import {TYPE, LIGHT} from '../config';

// Kinetic headline (light look): each word sharpens out of a blur as it rises a little,
// with a slight scale settle, then keeps a slow drift. `accent` maps word index → color.
export const Words: React.FC<{
  words: string[]; f: number; start?: number; starts?: number[]; offset?: number;
  size?: number; color?: string; weight?: number; gap?: number; accent?: Record<number, string>;
}> = ({words, f, start = 0, starts, offset = 4, size = 84, color = LIGHT.ink, weight = TYPE.heading, gap = 0.26, accent = {}}) => (
  <div style={{display: 'flex', gap: `0 ${gap}em`, justifyContent: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap',
    fontFamily: DISPLAY, fontWeight: weight, fontSize: size, letterSpacing: '-0.035em', color, lineHeight: 1.1,
    transform: `translateY(${drift(f, 3, 300)}px)`}}>
    {words.map((w, i) => {
      const s = starts ? starts[i] : start + i * offset;
      const p = Math.max(0, enter(f, s));
      const blur = Math.max(0, 1 - p) * 14;
      return (
        <span key={i} style={{display: 'inline-block', color: accent[i] ?? color, opacity: Math.min(1, p * 1.3),
          transform: `translateY(${(1 - Math.min(p, 1)) * 28}px) scale(${0.94 + 0.06 * Math.min(p, 1.05)})`,
          filter: blur > 0.2 ? `blur(${blur}px)` : 'none'}}>{w}</span>
      );
    })}
  </div>
);
