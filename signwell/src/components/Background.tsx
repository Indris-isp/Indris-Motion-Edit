import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../config';
import {drift, tween} from '../anim';
import T from '../timing.json';

// Global background: deep navy with two soft glows on a slow parallax. Turns brand blue for the logo.
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const blue = tween(f, T.scenes.s5.from - 10, T.scenes.s5.from + 30, 0, 1);
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at 50% 30%, ${COLORS.navy2} 0%, ${COLORS.navy} 70%)`}}>
      <div style={{position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', left: '18%', top: '-30%',
        transform: `translate(-50%, 0) translate(${drift(f, 40, 900)}px, ${drift(f, 24, 700, 200)}px)`,
        background: 'radial-gradient(circle, rgba(43,89,232,.35) 0%, rgba(43,89,232,0) 65%)'}} />
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', left: '82%', top: '45%',
        transform: `translate(-50%, 0) translate(${drift(f, 30, 1100, 400)}px, ${drift(f, 30, 800)}px)`,
        background: 'radial-gradient(circle, rgba(123,155,255,.22) 0%, rgba(123,155,255,0) 65%)'}} />
      <AbsoluteFill style={{opacity: blue, background: `radial-gradient(110% 90% at 50% 40%, #3b6cf2 0%, ${COLORS.blueDeep} 75%)`}} />
    </AbsoluteFill>
  );
};
