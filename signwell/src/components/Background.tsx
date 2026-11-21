import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LIGHT} from '../config';
import {drift} from '../anim';

export type BgVariant = 'glow' | 'aurora' | 'mesh' | 'halo';

const Blob: React.FC<{w: number; h: number; x: string; y: string; color: string; dx: number; dy: number; blur?: number}> = ({w, h, x, y, color, dx, dy, blur = 24}) => (
  <div style={{position: 'absolute', width: w, height: h, borderRadius: '50%', left: x, top: y,
    transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
    background: `radial-gradient(closest-side, ${color} 0%, rgba(255,255,255,0) 100%)`, filter: `blur(${blur}px)`}} />
);

// Global background. Four light variants; all drift slowly so nothing ever stops.
export const Background: React.FC<{variant?: BgVariant}> = ({variant = 'glow'}) => {
  const f = useCurrentFrame();

  if (variant === 'aurora') {
    // Officely-style: clean white top, saturated blue aurora rising from the bottom with tall light rays.
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #ffffff 0%, #f4f7ff 45%, #dfe8ff 75%, #c3d4ff 100%)', overflow: 'hidden'}}>
        <Blob w={2200} h={900} x="50%" y="112%" color="rgba(43,89,232,.75)" dx={drift(f, 80, 1100)} dy={drift(f, 14, 700)} blur={30} />
        <Blob w={1100} h={600} x="20%" y="100%" color="rgba(110,150,255,.55)" dx={drift(f, 60, 900, 200)} dy={0} />
        <Blob w={1100} h={600} x="82%" y="104%" color="rgba(90,170,255,.5)" dx={drift(f, 60, 1000, 500)} dy={0} />
        <div style={{position: 'absolute', left: -120, right: -120, bottom: 0, height: 620,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,.55) 10px, rgba(255,255,255,0) 26px, rgba(255,255,255,0) 44px, rgba(255,255,255,.3) 52px, rgba(255,255,255,0) 64px)',
          backgroundPosition: `${(f * 0.5) % 64}px 0`,
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,0))', maskImage: 'linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,0))',
          filter: 'blur(5px)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(70% 50% at 50% 0%, rgba(255,255,255,.9), rgba(255,255,255,0))'}} />
      </AbsoluteFill>
    );
  }

  if (variant === 'mesh') {
    // Soft pastel mesh: blue, periwinkle, a touch of lilac and aqua, flowing slowly.
    return (
      <AbsoluteFill style={{background: '#f7f8ff', overflow: 'hidden'}}>
        <Blob w={1300} h={1100} x="18%" y="22%" color="rgba(120,155,255,.55)" dx={drift(f, 90, 1300)} dy={drift(f, 60, 1000, 300)} blur={40} />
        <Blob w={1200} h={1000} x="85%" y="30%" color="rgba(176,150,255,.42)" dx={drift(f, 80, 1200, 600)} dy={drift(f, 60, 900)} blur={40} />
        <Blob w={1300} h={1000} x="65%" y="95%" color="rgba(90,190,255,.42)" dx={drift(f, 90, 1400, 200)} dy={drift(f, 40, 1100, 500)} blur={40} />
        <Blob w={1000} h={900} x="10%" y="95%" color="rgba(43,89,232,.32)" dx={drift(f, 70, 1000, 800)} dy={drift(f, 40, 900, 100)} blur={40} />
        <AbsoluteFill style={{background: 'radial-gradient(55% 55% at 50% 48%, rgba(255,255,255,.85), rgba(255,255,255,0))'}} />
      </AbsoluteFill>
    );
  }

  if (variant === 'halo') {
    // Clean product look: white, faint dot grid, soft concentric halo rings behind the subject, bottom glow.
    const rings = [260, 400, 560, 740, 940];
    return (
      <AbsoluteFill style={{background: 'radial-gradient(90% 90% at 50% 50%, #ffffff 0%, #f3f6fe 70%, #e7eefc 100%)', overflow: 'hidden'}}>
        <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(43,89,232,.16) 1.4px, transparent 1.6px)', backgroundSize: '34px 34px',
          backgroundPosition: `${(f * 0.25) % 34}px ${(f * 0.15) % 34}px`,
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, rgba(0,0,0,.9), rgba(0,0,0,0))', maskImage: 'radial-gradient(70% 70% at 50% 50%, rgba(0,0,0,.9), rgba(0,0,0,0))'}} />
        {rings.map((r, i) => {
          const s = 1 + 0.03 * Math.sin((f / 240 + i * 0.4) * Math.PI * 2);
          return <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: '50%',
            border: `1.5px solid rgba(43,89,232,${0.16 - i * 0.025})`, boxShadow: `0 0 40px rgba(79,124,255,${0.12 - i * 0.02})`, transform: `scale(${s})`}} />;
        })}
        <Blob w={1700} h={700} x="50%" y="108%" color="rgba(79,124,255,.45)" dx={drift(f, 60, 1100)} dy={0} blur={30} />
      </AbsoluteFill>
    );
  }

  // 'glow' — current rev 5 background.
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
      <div style={{position: 'absolute', left: -100, right: -100, bottom: 0, height: 420,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(79,124,255,0) 0px, rgba(79,124,255,.22) 18px, rgba(79,124,255,0) 46px, rgba(79,124,255,.12) 70px, rgba(79,124,255,0) 96px)',
        backgroundPosition: `${(f * 0.6) % 96}px 0`,
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0))', maskImage: 'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0))',
        filter: 'blur(6px)', opacity: 0.8}} />
    </AbsoluteFill>
  );
};
