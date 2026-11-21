import React from 'react';
import {DISPLAY} from '../fonts';
import {TYPE, LIGHT} from '../config';

// Slot-machine number: a column of integers that rolls with the continuous value `v`.
// Neighbours above and below stay visible, faded and blurred, like the reference.
export const Rolling: React.FC<{v: number; min: number; max: number; size?: number; color?: string; pad?: number}> = ({v, min, max, size = 56, color = LIGHT.ink, pad = 1}) => {
  const lh = size * 1.1;
  const items = [];
  for (let n = min - 1; n <= max + 1; n++) {
    const d = Math.abs(n - v);
    const o = Math.max(0, 1 - d * 0.75);
    items.push(
      <div key={n} style={{height: lh, lineHeight: `${lh}px`, opacity: n < min || n > max ? 0 : 0.12 + 0.88 * o,
        filter: d > 0.15 ? `blur(${Math.min(4, d * 3)}px)` : 'none', transform: `scale(${1 - Math.min(0.25, d * 0.15)})`}}>
        {String(n).padStart(pad, '0')}
      </div>,
    );
  }
  return (
    <div style={{height: lh * 3, overflow: 'hidden', position: 'relative', fontFamily: DISPLAY, fontWeight: TYPE.heading, fontSize: size,
      color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', textAlign: 'center',
      WebkitMaskImage: 'linear-gradient(transparent, #000 30%, #000 70%, transparent)', maskImage: 'linear-gradient(transparent, #000 30%, #000 70%, transparent)'}}>
      <div style={{transform: `translateY(${-(v - min) * lh}px)`}}>{items}</div>
    </div>
  );
};
