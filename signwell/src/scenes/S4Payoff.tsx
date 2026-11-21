import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {Words} from '../components/Words';
import {countValue} from '../components/Counter';
import {Editor, Signature} from '../components/Editor';
import {COLORS, COPY} from '../config';
import {BODY, DISPLAY} from '../fonts';
import {enter, exit, press, tween, drift, clamp, easeIn} from '../anim';
import T from '../timing.json';

const t = T.s4;

const fmtWait = (min: number) => {
  if (min >= 1440) return {v: Math.round(min / 1440), u: Math.round(min / 1440) === 1 ? 'day' : 'days'};
  if (min >= 60) return {v: Math.round(min / 60), u: 'hours'};
  return {v: Math.max(1, Math.round(min)), u: 'min'};
};

// Scene 4 · Signed (payoff) — client signs on the phone, status flips to Signed, days become minutes.
export const S4Payoff: React.FC = () => {
  const f = useCurrentFrame();
  const pull = tween(f, t.pull[0], t.pull[1], 0, 1);
  const phoneIn = enter(f, 10);
  const ink = tween(f, t.sign[0], t.sign[1], 0, 1);
  const status = f >= t.signed ? 'signed' : f >= t.viewed ? 'viewed' : 'sent';
  const statusScale = press(f, t.viewed) * press(f, t.signed);
  const deskInk = tween(f, t.signed, t.signed + 30, 0, 1);
  const done = enter(f, t.signed);
  const counterIn = enter(f, t.count - 20);
  const wait = fmtWait(countValue(f, t.count, COPY.s4.fromMinutes, COPY.s4.toMinutes, 60));
  const out = interpolate(f, [t.exit, t.exit + 18], [1, 0], {...clamp, easing: easeIn});

  return (
    <Stage>
      <Camera push={tween(f, 0, 360, 1, 1.03)}>
        <div style={{position: 'absolute', inset: 0, opacity: out, transform: `scale(${0.88 + 0.12 * out})`, transformOrigin: '960px 540px'}}>
          {/* Pull back: editor shrinks to the left to make room for the phone. */}
          <div style={{position: 'absolute', inset: 0, transformOrigin: '960px 540px',
            transform: `translate(${-330 * pull}px, ${30 * pull + drift(f, 3, 280)}px) scale(${1 - 0.3 * pull})`}}>
            <Editor sig={1} date={1} status={status} statusScale={statusScale} sigInk={deskInk} />
          </div>

          {/* Client's phone. */}
          <At x={450 + (1 - phoneIn) * 700} y={30 + drift(f, 4, 260, 90)}>
            <div style={{width: 340, height: 700, borderRadius: 56, background: '#0d1220', padding: 14, transform: `rotate(${3 * (1 - phoneIn) + 2}deg)`,
              boxShadow: '0 50px 100px rgba(0,0,0,.5)', border: '2px solid rgba(255,255,255,.12)'}}>
              <div style={{width: '100%', height: '100%', borderRadius: 44, background: '#fff', position: 'relative', overflow: 'hidden', fontFamily: BODY, color: COLORS.ink, padding: '58px 26px 26px'}}>
                <div style={{position: 'absolute', top: 14, left: '50%', width: 90, height: 24, marginLeft: -45, borderRadius: 12, background: '#0d1220'}} />
                <div style={{fontWeight: 700, fontSize: 22}}>{COPY.s3.docTitle}</div>
                <div style={{fontSize: 15, color: COLORS.ink2, marginBottom: 22}}>From {COPY.s3.sender}</div>
                {[100, 88, 94, 70].map((w, k) => <div key={k} style={{height: 8, width: `${w}%`, borderRadius: 4, background: '#e8ebf2', marginBottom: 12}} />)}
                <div style={{marginTop: 30, height: 150, borderRadius: 14, border: `3px solid ${f >= t.signed ? COLORS.green : COLORS.blue}`,
                  background: f >= t.signed ? 'rgba(30,158,100,.06)' : 'rgba(43,89,232,.06)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{position: 'absolute', left: 12, top: 8, fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: COLORS.blue}}>SIGN HERE</span>
                  <Signature progress={ink} width={250} />
                </div>
                <div style={{position: 'absolute', left: 26, right: 26, bottom: 26, height: 64, borderRadius: 16, background: COLORS.green, color: '#fff',
                  fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press(f, t.finish)})`}}>Finish</div>
                {/* Done overlay */}
                <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,.94)', opacity: Math.min(1, done * 1.3),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
                  <div style={{width: 110, height: 110, borderRadius: '50%', background: COLORS.green, color: '#fff', fontSize: 56, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${done})`}}>✓</div>
                  <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 32}}>All signed</div>
                </div>
              </div>
            </div>
          </At>

          {/* Time-to-signed counter, top-right. */}
          <At x={545} y={-440}>
            <div style={{opacity: Math.min(1, counterIn * 1.4), transform: `translateY(${(1 - counterIn) * -24}px)`, display: 'flex', alignItems: 'baseline', gap: 14,
              padding: '14px 26px', borderRadius: 16, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', fontFamily: BODY, color: '#fff'}}>
              <span style={{fontSize: 20, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .75, whiteSpace: 'nowrap'}}>{COPY.s4.counterLabel}</span>
              <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: '#5fe0a3', fontVariantNumeric: 'tabular-nums', minWidth: 60, textAlign: 'right'}}>{wait.v}</span>
              <span style={{fontSize: 24, fontWeight: 600, minWidth: 70}}>{wait.u}</span>
            </div>
          </At>

          <At x={0} y={440}>
            <Words words={COPY.s4.headline} f={f} start={t.words} offset={5} size={80} />
          </At>
        </div>
      </Camera>
    </Stage>
  );
};
