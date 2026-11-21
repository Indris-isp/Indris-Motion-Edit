import React from 'react';
import {TYPE, LIGHT} from '../config';
import {Rolling} from '../components/Rolling';
import {useCurrentFrame} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {Words} from '../components/Words';
import {countValue} from '../components/Counter';
import {COLORS, COPY} from '../config';
import {BODY, DISPLAY} from '../fonts';
import {enter, exit, drift, tween, clamp} from '../anim';
import {interpolate} from 'remotion';
import T from '../timing.json';

const CARD_W = 700, CARD_H = 104, STEP = 120, TOP = -250;

// Scene 1 · Still waiting (hook) — follow-up emails stack up while the wait counter climbs.
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t = T.s1;
  const out = exit(f, t.exit);
  const emails = COPY.s1.emails;
  const dv = countValue(f, t.counter, 0, COPY.s1.counterTo, 60);
  const days = Math.round(dv);
  const counterIn = enter(f, t.counter - 10);

  return (
    <Stage>
      <Camera push={tween(f, 0, 240, 1, 1.07)} rotate={tween(f, 0, 240, -1.4, 0.4)}>
        <div style={{position: 'absolute', inset: 0, opacity: out, transform: `scale(${0.96 + 0.04 * out})`, transformOrigin: '960px 540px', filter: out < 0.99 ? `blur(${(1 - out) * 18}px)` : 'none'}}>
          {/* Notification stack: newest on top; each new card pushes the older ones down. */}
          {emails.map((e, i) => {
            const p = enter(f, t.cards[i]);
            let push = 0;
            for (let j = i + 1; j < emails.length; j++) push += enter(f, t.cards[j]);
            const y = TOP + push * STEP - (1 - p) * 70 + drift(f, 3, 260, i * 40);
            const age = interpolate(push, [0, 3], [1, 0.7], clamp);
            const dof = push * 1.1; // older cards drift out of focus
            const urgent = i === emails.length - 1;
            return (
              <At key={i} x={0} y={y} style={{zIndex: 10 + i}}>
                <div style={{width: CARD_W, height: CARD_H, borderRadius: 20, background: COLORS.paper, opacity: Math.min(1, p * 1.5) * age, filter: dof > 0.1 ? `blur(${dof}px)` : 'none', border: LIGHT.cardBorder,
                  transform: i === 0 ? `scale(${0.08 + 0.92 * Math.min(1.04, p)}, ${0.12 + 0.88 * Math.min(1.04, p)})` : `scale(${0.9 + 0.1 * p})`, borderRadius: i === 0 ? 20 + (1 - Math.min(1, p)) * 40 : 20, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px',
                  boxShadow: LIGHT.cardShadow, fontFamily: BODY}}>
                  <div style={{width: 52, height: 52, borderRadius: '50%', background: '#f3c9a8', color: '#7a4422', fontWeight: TYPE.subheading,
                    fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>M</div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 18, color: COLORS.ink2, fontWeight: TYPE.body}}>{e.from}</div>
                    <div style={{fontSize: 27, color: COLORS.ink, fontWeight: TYPE.subheading, whiteSpace: 'nowrap'}}>{e.subject}</div>
                  </div>
                  <div style={{fontSize: 18, color: urgent ? '#e0452c' : COLORS.ink2, fontWeight: 600}}>{e.meta}</div>
                </div>
              </At>
            );
          })}

          {/* Guide dot: falls with gravity, squashes on impact and opens into the first card. */}
          {f < t.cards[0] + 10 && (() => {
            const fall = interpolate(f, [0, t.cards[0]], [0, 1], {...clamp, easing: (x) => x * x});
            const sq = interpolate(f, [t.cards[0], t.cards[0] + 3, t.cards[0] + 6], [0, 1, 0], clamp);
            const dy = -620 + (TOP + 620) * fall;
            return <At x={0} y={dy} style={{zIndex: 30, opacity: interpolate(f, [t.cards[0] + 2, t.cards[0] + 8], [1, 0], clamp)}}>
              <div style={{width: 34, height: 34, borderRadius: '50%', background: LIGHT.accent, boxShadow: '0 0 30px rgba(79,124,255,.8)',
                transform: `scale(${1 + 0.5 * sq + (1 - fall) * 0}, ${1 - 0.4 * sq + 0.35 * fall * (1 - sq)})`}} />
            </At>;
          })()}

          {/* Wait counter, top-right inside the 5% safe zone. */}
          <At x={590} y={-430}>
            <div style={{opacity: Math.min(1, counterIn * 1.4), transform: `translateY(${(1 - counterIn) * -24}px)`,
              display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px', borderRadius: 18, height: 76,
              background: LIGHT.glass, border: LIGHT.cardBorder, boxShadow: LIGHT.cardShadow, fontFamily: BODY, color: LIGHT.ink}}>
              <span style={{fontSize: 20, fontWeight: TYPE.subheading, letterSpacing: '.1em', textTransform: 'uppercase', color: LIGHT.ink2, whiteSpace: 'nowrap'}}>{COPY.s1.counterLabel}</span>
              <div style={{margin: '-57px 0', width: 40}}><Rolling v={dv} min={0} max={COPY.s1.counterTo} size={52} color={LIGHT.pain} /></div>
              <span style={{fontSize: 24, fontWeight: TYPE.subheading}}>{COPY.s1.counterUnit}</span>
            </div>
          </At>

          <At x={0} y={330}>
            <Words words={COPY.s1.headline.split(' ')} f={f} start={t.headline} size={86} accent={{4: LIGHT.accent}} />
          </At>
        </div>
      </Camera>
    </Stage>
  );
};
