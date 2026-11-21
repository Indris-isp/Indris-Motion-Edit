import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LIGHT} from '../config';
import {drift} from '../anim';

// Global background: airy white with soft blue glows and a light "curtain" of vertical streaks
// rising from the bottom, all on a slow parallax drift so nothing ever stops.
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 100% at 50% 20%, #ffffff 0%, ${LIGHT.bg} 55%, ${LIGHT.bgDeep} 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1400, height: 900, borderRadius: '50%', left: '50%', bottom: -560,
        transform: `translateX(-50%) translate(${drift(f, 60, 1000)}px, ${drift(f, 20, 700, 200)}px)`,
        background: `radial-gradient(closest-side, ${LIGHT.glow} 0%, rgba(79,124,255,0) 100%)`, filter: 'blur(20px)'}} />
      <div style={{position: 'absolute', width: 900, height: 700, borderRadius: '50%', left: '12%', top: -380,
        transform: `translateX(-50%) translate(${drift(f, 40, 1200, 300)}px, 0)`,
        background: 'radial-gradient(closest-side, rgba(123,155,255,.28) 0%, rgba(123,155,255,0) 100%)', filter: 'blur(24px)'}} />
      <div style={{position: 'absolute', width: 800, height: 700, borderRadius: '50%', left: '92%', top: '30%',
        transform: `translateX(-50%) translate(${drift(f, 30, 900, 500)}px, ${drift(f, 30, 1100)}px)`,
        background: 'radial-gradient(closest-side, rgba(120,170,255,.22) 0%, rgba(120,170,255,0) 100%)', filter: 'blur(24px)'}} />
      {/* Light curtain */}
      <div style={{position: 'absolute', left: -100, right: -100, bottom: 0, height: 420,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(79,124,255,0) 0px, rgba(79,124,255,.22) 18px, rgba(79,124,255,0) 46px, rgba(79,124,255,.12) 70px, rgba(79,124,255,0) 96px)',
        backgroundPosition: `${(f * 0.6) % 96}px 0`,
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0))', maskImage: 'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0))',
        filter: 'blur(6px)', opacity: 0.8}} />
    </AbsoluteFill>
  );
};
