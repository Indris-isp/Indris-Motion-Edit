import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {COLORS, COPY} from '../config';
import {BODY, DISPLAY} from '../fonts';
import {enter, tween, drift, easeOut} from '../anim';
import T from '../timing.json';

const t = T.s5;

// Scene 5 · Logo + CTA — signature stroke draws, wordmark builds over it, tagline and CTA follow.
export const S5Logo: React.FC = () => {
  const f = useCurrentFrame();
  const stroke = tween(f, t.stroke[0], t.stroke[1], 0, 1, easeOut);
  const tag = enter(f, t.tagline);
  const cta = enter(f, t.cta);
  const len = 1400;

  return (
    <Stage>
      <Camera push={tween(f, 0, 300, 1, 1.05)}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${drift(f, 4, 360)}px)`}}>
          <svg width="1920" height="1080" viewBox="-960 -540 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
            <path d="M -400 110 C -320 40, -260 170, -180 95 C -120 40, -80 85, -55 110 C -20 150, 40 50, 110 75 C 170 95, 220 115, 400 80"
              fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="12" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - stroke)} />
          </svg>
          <At x={0} y={-70}>
            <div style={{display: 'flex', fontFamily: DISPLAY, fontWeight: 800, fontSize: 190, letterSpacing: '-0.035em', color: '#fff', lineHeight: 1}}>
              {COPY.s5.wordmark.split('').map((ch, i) => {
                const p = enter(f, t.word + i * 2);
                return <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 50}px)`}}>{ch}</span>;
              })}
            </div>
          </At>
          <At x={0} y={210}>
            <div style={{opacity: Math.min(1, tag * 1.4), transform: `translateY(${(1 - tag) * 30}px)`, fontFamily: BODY, fontWeight: 500, fontSize: 42, color: 'rgba(255,255,255,.92)', whiteSpace: 'nowrap'}}>
              {COPY.s5.tagline}
            </div>
          </At>
          <At x={0} y={335}>
            <div style={{opacity: Math.min(1, cta * 1.4), transform: `translateY(${(1 - cta) * 30}px) scale(${0.9 + 0.1 * cta})`, display: 'flex', alignItems: 'center', gap: 18,
              padding: '24px 48px', borderRadius: 18, background: '#fff', color: COLORS.blue, fontFamily: BODY, fontWeight: 700, fontSize: 34,
              boxShadow: '0 20px 50px rgba(10,20,60,.3)', whiteSpace: 'nowrap'}}>
              {COPY.s5.cta}<span style={{width: 2, height: 34, background: COLORS.line}} /><span style={{color: COLORS.ink2, fontWeight: 600}}>{COPY.s5.url}</span>
            </div>
          </At>
        </div>
      </Camera>
    </Stage>
  );
};
