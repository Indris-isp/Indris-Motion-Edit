import React from 'react';
import {TYPE} from '../config';
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
  const punch = 1 + 0.18 * Math.max(0, 1 - Math.abs(dv - days) * 3) * (f > t.counter && f < t.counter + 62 ? 1 : 0);
  const counterIn = enter(f, t.counter - 10);

  return (
    <Stage>
      <Camera push={tween(f, 0, 240, 1, 1.07)} rotate={tween(f, 0, 240, -1.4, 0.4)}>
        <div style={{position: 'absolute', inset: 0, opacity: out, transform: `scale(${0.96 + 0.04 * out})`, transformOrigin: '960px 540px'}}>
          {/* Notification stack: newest on top; each new card pushes the older ones down. */}
          {emails.map((e, i) => {
            const p = enter(f, t.cards[i]);
            let push = 0;
            for (let j = i + 1; j < emails.length; j++) push += enter(f, t.cards[j]);
            const y = TOP + push * STEP - (1 - p) * 70 + drift(f, 3, 260, i * 40);
            const age = interpolate(push, [0, 3], [1, 0.55], clamp);
            const urgent = i === emails.length - 1;
            return (
              <At key={i} x={0} y={y} style={{zIndex: 10 + i}}>
                <div style={{width: CARD_W, height: CARD_H, borderRadius: 20, background: COLORS.paper, opacity: Math.min(1, p * 1.5) * age,
                  transform: `scale(${0.9 + 0.1 * p})`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px',
                  boxShadow: '0 24px 50px rgba(0,0,0,.35)', fontFamily: BODY}}>
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

          {/* Wait counter, top-right inside the 5% safe zone. */}
          <At x={590} y={-430}>
            <div style={{opacity: Math.min(1, counterIn * 1.4), transform: `translateY(${(1 - counterIn) * -24}px)`,
              display: 'flex', alignItems: 'baseline', gap: 14, padding: '14px 26px', borderRadius: 16,
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', fontFamily: BODY, color: '#fff'}}>
              <span style={{fontSize: 20, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .75, whiteSpace: 'nowrap'}}>{COPY.s1.counterLabel}</span>
              <span style={{fontFamily: DISPLAY, fontWeight: TYPE.heading, fontSize: 52, color: COLORS.amber, fontVariantNumeric: 'tabular-nums', minWidth: 34, textAlign: 'right', display: 'inline-block', transform: `scale(${punch})`}}>{days}</span>
              <span style={{fontSize: 24, fontWeight: 600}}>{COPY.s1.counterUnit}</span>
            </div>
          </At>

          <At x={0} y={330}>
            <Words words={COPY.s1.headline.split(' ')} f={f} start={t.headline} size={86} accent={{4: COLORS.amber}} />
          </At>
        </div>
      </Camera>
    </Stage>
  );
};
