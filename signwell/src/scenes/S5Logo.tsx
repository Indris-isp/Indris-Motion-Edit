import React from 'react';
import {TYPE} from '../config';
import {LIGHT} from '../config';
import {useCurrentFrame} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {COLORS, COPY} from '../config';
import {BODY, DISPLAY} from '../fonts';
import {enter, tween, drift, easeOut} from '../anim';
import {Signature} from '../components/Editor';
import T from '../timing.json';

const t = T.s5;

// Scene 5 · Logo + CTA — signature stroke draws, wordmark builds over it, tagline and CTA follow.
export const S5Logo: React.FC = () => {
  const f = useCurrentFrame();
  const settle = tween(f, t.settle[0], t.settle[1], 0, 1, easeOut);
  const tag = enter(f, t.tagline);
  const cta = enter(f, t.cta);

  return (
    <Stage>
      <Camera push={tween(f, 0, 300, 1, 1.05)}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${drift(f, 4, 360)}px)`}}>
          {/* Match cut: the client's signature arrives full-frame and settles under the wordmark. */}
          <At x={0} y={settle * 105}>
            <div style={{transform: `rotate(${2 * (1 - settle)}deg) scale(${1 + 0.04 * settle})`}}>
              <Signature progress={1} width={800} color="#14286e" />
            </div>
          </At>
          <At x={0} y={-90}>
            <div style={{display: 'flex', fontFamily: DISPLAY, fontWeight: TYPE.heading, fontSize: 190, letterSpacing: '-0.045em', color: LIGHT.ink, lineHeight: 1}}>
              {COPY.s5.wordmark.split('').map((ch, i) => {
                const p = enter(f, t.word + i * 2);
                return <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 50}px)`}}>{ch}</span>;
              })}
            </div>
          </At>
          <At x={0} y={262}>
            <div style={{opacity: Math.min(1, tag * 1.4), transform: `translateY(${(1 - tag) * 30}px)`, fontFamily: BODY, fontWeight: TYPE.subheading, fontSize: 42, color: LIGHT.ink2, whiteSpace: 'nowrap'}}>
              {COPY.s5.tagline}
            </div>
          </At>
          <At x={0} y={380}>
            <div style={{opacity: Math.min(1, cta * 1.4), transform: `translateY(${(1 - cta) * 30}px) scale(${0.9 + 0.1 * cta})`, display: 'flex', alignItems: 'center', gap: 18,
              padding: '24px 48px', borderRadius: 18, background: LIGHT.accent, color: '#fff', fontFamily: BODY, fontWeight: TYPE.button, fontSize: 34,
              boxShadow: '0 20px 50px rgba(43,89,232,.35)', whiteSpace: 'nowrap'}}>
              {COPY.s5.cta}<span style={{width: 2, height: 34, background: 'rgba(255,255,255,.35)'}} /><span style={{color: 'rgba(255,255,255,.85)', fontWeight: TYPE.button}}>{COPY.s5.url}</span>
            </div>
          </At>
        </div>
      </Camera>
    </Stage>
  );
};
