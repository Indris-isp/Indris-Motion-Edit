import React from 'react';
import {enter, drift, pop} from '../anim';
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
        <span key={i} style={{display: 'inline-block', position: 'relative', isolation: 'isolate', color: accent[i] ?? color, opacity: Math.min(1, p * 1.3),
          transform: `translateY(${(1 - Math.min(p, 1)) * 28}px) scale(${0.94 + 0.06 * Math.min(p, 1.05)})`,
          filter: blur > 0.2 ? `blur(${blur}px)` : 'none'}}>
          {/* Highlighter swipe behind accent words (reference: fast bar wipes behind key words). */}
          {accent[i] && <span style={{position: 'absolute', zIndex: -1, left: accent[i - 1] ? `-${gap + 0.02}em` : '-0.14em', right: '-0.14em', top: '0.08em', bottom: '0.02em', borderRadius: `${accent[i - 1] ? 0 : 0.2}em ${accent[i + 1] ? 0 : 0.2}em ${accent[i + 1] ? 0 : 0.2}em ${accent[i - 1] ? 0 : 0.2}em`,
            background: 'rgba(255,255,255,.92)', boxShadow: '0 10px 30px rgba(43,89,232,.25), 0 0 30px rgba(79,124,255,.35)',
            transform: `scaleX(${pop(f, s + 5, 16)})`, transformOrigin: 'left center'}} />}
          {w}
        </span>
      );
    })}
  </div>
);
