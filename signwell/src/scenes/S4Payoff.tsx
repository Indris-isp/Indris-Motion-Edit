import React from 'react';
import {TYPE} from '../config';
import {LIGHT} from '../config';
import {Rolling} from '../components/Rolling';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {Words} from '../components/Words';
import {countValue} from '../components/Counter';
import {Editor, Signature} from '../components/Editor';
import {COLORS, COPY} from '../config';
import {BODY, DISPLAY} from '../fonts';
import {enter, exit, press, tween, drift, clamp, easeIn, outQuint} from '../anim';
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
  const pull = tween(f, t.pull[0], t.pull[1] + 12, 0, 1, outQuint);
  const phoneIn = tween(f, 6, 62, 0, 1, outQuint);
  const ink = tween(f, t.sign[0], t.sign[1], 0, 1);
  const status = f >= t.signed ? 'signed' : f >= t.viewed ? 'viewed' : 'sent';
  const statusScale = press(f, t.viewed) * press(f, t.signed);
  const deskInk = tween(f, t.signed, t.signed + 30, 0, 1);
  const done = enter(f, t.signed);
  const counterIn = enter(f, t.count - 20);
  // Slot-machine roll 6 → 4 while the unit dissolves from days to min: six days become four minutes.
  const roll = countValue(f, t.count, 6, 4, 60);
  const unitMix = interpolate(f, [t.count + 18, t.count + 42], [0, 1], clamp);
  const out = interpolate(f, [t.exit, t.exit + 18], [1, 0], {...clamp, easing: easeIn});
  // Match cut into the logo: push into the client's signature (ease-in); scene 5 opens on the same stroke.
  const m = interpolate(f, [t.match[0], t.match[1]], [0, 1], {...clamp, easing: Easing.bezier(0.55, 0, 0.9, 0.45)});
  const SIG = {x: 450, y: 14};
  const whip = Math.max(0, 1 - phoneIn) * 14;

  return (
    <Stage>
      <Camera push={tween(f, 0, 360, 1, 1.03)} zoom={1 + 2.2 * m} focus={SIG} amount={m} rotate={tween(f, 0, t.match[0], 0.6, -0.4) * (1 - m)}>
        <div style={{position: 'absolute', inset: 0}}>
          {/* Pull back: editor shrinks to the left to make room for the phone. */}
          <div style={{position: 'absolute', inset: 0, transformOrigin: '960px 540px',
            transform: `translate(${-330 * pull}px, ${30 * pull + drift(f, 3, 280)}px) scale(${1 - 0.3 * pull})`, filter: pull > 0.05 ? `blur(${pull * 2.2}px)` : 'none'}}>
            <div style={{opacity: out}}><Editor sig={1} date={1} status={status} statusScale={statusScale} sigInk={deskInk} /></div>
          </div>

          {/* Client's phone. */}
          <At x={450 + (1 - phoneIn) * 700} y={30 + drift(f, 4, 260, 90) * (1 - m)} style={{opacity: 1 - interpolate(m, [0.35, 0.85], [0, 1], clamp), filter: whip > 0.3 ? `blur(${whip}px)` : 'none'}}>
            <div style={{width: 340, height: 700, borderRadius: 56, background: '#0d1220', padding: 14, transform: `rotate(${3 * (1 - phoneIn) + 2}deg)`,
              boxShadow: '0 50px 100px rgba(43,89,232,.34), 0 6px 16px rgba(43,89,232,.2), 0 0 70px rgba(79,124,255,.40)', border: '2px solid #2a3142'}}>
              <div style={{width: '100%', height: '100%', borderRadius: 44, background: '#fff', position: 'relative', overflow: 'hidden', fontFamily: BODY, color: COLORS.ink, padding: '58px 26px 26px'}}>
                <div style={{position: 'absolute', top: 14, left: '50%', width: 90, height: 24, marginLeft: -45, borderRadius: 12, background: '#0d1220'}} />
                <div style={{fontWeight: TYPE.heading, fontSize: 22}}>{COPY.s3.docTitle}</div>
                <div style={{fontSize: 15, color: COLORS.ink2, marginBottom: 22}}>From {COPY.s3.sender}</div>
                {[100, 88, 94, 70].map((w, k) => <div key={k} style={{height: 8, width: `${w}%`, borderRadius: 4, background: '#e8ebf2', marginBottom: 12}} />)}
                <div style={{marginTop: 30, height: 150, borderRadius: 14, border: `3px solid ${f >= t.signed ? COLORS.green : COLORS.blue}`,
                  background: f >= t.signed ? 'rgba(30,158,100,.06)' : 'rgba(43,89,232,.06)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{position: 'absolute', left: 12, top: 8, fontSize: 12, fontWeight: TYPE.subheading, letterSpacing: '.1em', color: COLORS.blue}}>SIGN HERE</span>
                  <Signature progress={ink} width={250} />
                </div>
                <div style={{position: 'absolute', left: 26, right: 26, bottom: 26, height: 64, borderRadius: 16, background: COLORS.green, color: '#fff',
                  fontWeight: TYPE.button, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press(f, t.finish)})`}}>Finish</div>
                {/* Done overlay */}
                <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 236, background: '#fff', opacity: Math.min(1, done * 1.3),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 30}}>
                  <div style={{width: 84, height: 84, borderRadius: '50%', background: COLORS.green, color: '#fff', fontSize: 44, fontWeight: TYPE.heading,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${done})`}}>✓</div>
                  <div style={{fontFamily: DISPLAY, fontWeight: TYPE.heading, fontSize: 28}}>All signed</div>
                </div>
                <div style={{position: 'absolute', left: 26, right: 26, bottom: 26, height: 64, borderRadius: 16, background: COLORS.greenSoft, color: COLORS.green,
                  fontWeight: TYPE.button, fontSize: 18, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, done * 1.3)}}>Copy sent to both parties</div>
              </div>
            </div>
          </At>

          {/* Twin of the signature: stays put as the phone fades away, ready for scene 5. */}
          <At x={SIG.x} y={SIG.y} style={{opacity: interpolate(m, [0.35, 0.85], [0, 1], clamp), transform: 'translate(-50%, -50%) rotate(2deg)'}}>
            <Signature progress={1} width={250} color="#14286e" />
          </At>

          {/* Time-to-signed counter, top-right. */}
          <At x={545} y={-440}>
            <div style={{opacity: Math.min(1, counterIn * 1.4) * out, transform: `translateY(${(1 - counterIn) * -24}px)`, display: 'flex', alignItems: 'center', gap: 14, height: 76,
              padding: '10px 26px', borderRadius: 18, background: LIGHT.glass, border: LIGHT.cardBorder, boxShadow: LIGHT.cardShadow, fontFamily: BODY, color: LIGHT.ink}}>
              <span style={{fontSize: 20, fontWeight: TYPE.subheading, letterSpacing: '.1em', textTransform: 'uppercase', color: LIGHT.ink2, whiteSpace: 'nowrap'}}>{COPY.s4.counterLabel}</span>
              <div style={{margin: '-57px 0', width: 40}}><Rolling v={roll} min={4} max={6} size={52} color={COLORS.green} /></div>
              <span style={{fontSize: 24, fontWeight: TYPE.subheading, minWidth: 64, position: 'relative', height: 30}}>
                <span style={{position: 'absolute', left: 0, opacity: 1 - unitMix, filter: `blur(${unitMix * 6}px)`}}>days</span>
                <span style={{position: 'absolute', left: 0, opacity: unitMix, filter: `blur(${(1 - unitMix) * 6}px)`}}>min</span>
              </span>
            </div>
          </At>

          <At x={0} y={440} style={{opacity: out}}>
            <Words words={COPY.s4.headline} f={f} start={t.words} offset={5} size={80} accent={{1: LIGHT.accent, 2: LIGHT.accent}} />
          </At>
        </div>
      </Camera>
    </Stage>
  );
};
