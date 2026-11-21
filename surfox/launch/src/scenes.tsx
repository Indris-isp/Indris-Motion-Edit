import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, COPY} from './config';
import {anim, At, Bg, EXIT, Camera, Chip, CL, count, Cursor, E, Fox, Glow, gradText, press, tw, usePick, Words} from './lib';

type S = {dur: number};
const NIGHT = '#7C8BA0';

// ============ 1 · HOOK ============
const Notif: React.FC<{start: number; exit: number; w: number}> = ({start, exit, w}) => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [start + 8, start + 20, start + 70], [0, 1, 0.3], CL);
  return (
    <div
      style={{
        ...anim(f, start, {dy: -90, s0: 0.92, exit}),
        width: w,
        padding: '38px 46px',
        borderRadius: 40,
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.14)',
        boxShadow: `0 40px 90px rgba(0,0,0,.5), 0 0 ${60 * glow}px rgba(63,224,232,${0.25 * glow})`,
        color: '#fff',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 22, fontSize: 26, color: C.nightText, fontWeight: 600}}>
        <div style={{width: 62, height: 62, borderRadius: 17, background: '#22C55E', display: 'grid', placeItems: 'center'}}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff">
            <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z" />
          </svg>
        </div>
        MESSAGES <span style={{marginLeft: 'auto', fontWeight: 500}}>now</span>
      </div>
      <div style={{fontSize: 38, fontWeight: 700, marginTop: 26}}>{COPY.hook.from}</div>
      <div style={{fontSize: 34, lineHeight: 1.4, color: '#D5DEE8', marginTop: 8}}>{COPY.hook.msg}</div>
    </div>
  );
};

const Rings: React.FC<{y: number; start: number; o?: number}> = ({y, start, o = 1}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  return (
    <>
      {[0, 1, 2].map((k) => {
        const ph = (((f - start - k * 25) % 75) + 75) % 75 / 75;
        if (f - start < k * 25) return null;
        return (
          <At key={k} y={y}>
            <div
              style={{
                width: 900,
                height: 900,
                borderRadius: '50%',
                border: '2px solid rgba(63,224,232,.5)',
                transform: `scale(${0.45 + ph * 1.3})`,
                opacity: (1 - ph) * 0.45 * o,
              }}
            />
          </At>
        );
      })}
    </>
  );
};

export const Hook: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const X = dur - EXIT;
  const cardY = pk(200, 180);
  return (
    <Bg dark>
      <Camera dur={dur} push={0.05}>
        <Rings y={cardY} start={62} o={1 - tw(f, X, X + 10)} />
        <At y={pk(-350, -600)}>
          <div style={{...anim(f, 4, {exit: X}), fontFamily: 'Serif', fontStyle: 'italic', fontSize: pk(60, 68), color: NIGHT}}>{COPY.hook.time}</div>
        </At>
        <At y={pk(-185, -400)}>
          <Words text={COPY.hook.head} start={10} size={pk(118, 132)} color="#fff" exit={X} />
        </At>
        <At y={cardY}>
          <Notif start={56} exit={X} w={pk(900, 860)} />
        </At>
      </Camera>
    </Bg>
  );
};

// ============ 2 · PROBLEM ============
export const Problem: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const X = dur - EXIT;
  const mins = Math.round(count(f, 36, COPY.problem.delayMinutes));
  const deg = count(f, 36, 335);
  const shake = f > 96 && f < 110 ? Math.sin((f - 96) * 1.9) * 7 * (1 - (f - 96) / 14) : 0;
  const D = pk(520, 580);
  const dial = (
    <div style={{...anim(f, 12, {dy: 30, s0: 0.88, exit: X})}}>
      <div
        style={{
          position: 'relative',
          width: D,
          height: D,
          borderRadius: '50%',
          transform: `translateX(${shake}px)`,
          background: `conic-gradient(#C3C8CE 0 ${deg}deg, #FFFFFF ${deg}deg)`,
          boxShadow: '0 40px 80px rgba(0,0,0,.08)',
        }}
      >
        <div style={{position: 'absolute', inset: 38, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center'}}>
          <div>
            <div style={{fontSize: D * 0.25, fontWeight: 700, letterSpacing: '-.05em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
              {Math.floor(mins / 60)}h {String(mins % 60).padStart(2, '0')}m
            </div>
            <div style={{fontSize: 30, color: C.mut, fontWeight: 500, marginTop: 14}}>{COPY.problem.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
  const sub = (
    <div style={{...anim(f, 104, {exit: X}), fontSize: pk(42, 46), color: C.mut, lineHeight: 1.35, textAlign: 'center', whiteSpace: 'nowrap'}}>
      {COPY.problem.sub1}
      <br />
      <b style={{color: C.ink}}>{COPY.problem.sub2}</b>
    </div>
  );
  return (
    <Bg>
      <Camera dur={dur} push={0.04}>
        <At x={pk(-430, 0)} y={pk(-90, -640)}>
          <Words text={COPY.problem.head} start={0} size={pk(112, 122)} lineColors={['#9CA3AF', C.ink]} exit={X} />
        </At>
        <At x={pk(410, 0)} y={pk(0, 150)}>
          {dial}
        </At>
        <At x={pk(-430, 0)} y={pk(190, 640)}>
          {sub}
        </At>
      </Camera>
    </Bg>
  );
};

// ============ 3 · REVEAL ============
export const Reveal: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const {width, height} = useVideoConfig();
  const X = dur - EXIT;
  const r = tw(f, 0, 22, 0, Math.hypot(width, height) / 2 + 20, E.inOut);
  const glow = tw(f, 30, 70);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill style={{clipPath: `circle(${r}px at 50% 50%)`}}>
        <Bg dark>
          <Camera dur={dur} push={0.06}>
            <Glow y={pk(-170, -330)} size={pk(1100, 1300)} o={glow} />
            <At y={pk(-175, -340)}>
              <Fox size={pk(330, 470)} start={8} ignite={36} exit={X} />
            </At>
            <At y={pk(65, 170)}>
              <div style={{...anim(f, 44, {exit: X}), fontFamily: 'Serif', fontStyle: 'italic', fontSize: pk(58, 72), color: '#8FA3B8'}}>{COPY.reveal.meet}</div>
            </At>
            <At y={pk(170, 300)}>
              <Words text={COPY.reveal.name} start={48} stagger={5} size={pk(150, 170)} color="#fff" accent={['AI']} accentGrad exit={X} />
            </At>
            <At y={pk(305, 510)}>
              <div style={{...anim(f, 64, {exit: X}), fontSize: pk(36, 40), color: C.nightText, textAlign: 'center', lineHeight: 1.4, whiteSpace: 'nowrap'}}>
                {pk(COPY.reveal.sub, 'The AI that answers every lead')}
                {pk(null, <br />)}
                {pk(null, 'the moment they reach out.')}
              </div>
            </At>
          </Camera>
        </Bg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ 4 · THREE DOORS ============
const ICONS = [
  <path key="sms" d="M4 5h16v11H9l-5 4z" />,
  <g key="web">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 8h18" />
  </g>,
  <path key="voice" d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z" />,
];
export const Doors: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const land = pk(true, false);
  const X = dur - EXIT;
  return (
    <Bg>
      <Camera dur={dur} push={0.03}>
        <At y={pk(-330, -640)}>
          <Words text={pk('Same AI. Three doors.', COPY.doors.head)} start={0} size={pk(100, 118)} accent={['Three', 'doors.']} exit={X} />
        </At>
        {COPY.doors.cards.map((c, i) => {
          const st = 10 + i * 4;
          const chipAt = 52 + i * 6;
          const pulse = interpolate(f, [chipAt, chipAt + 6, chipAt + 16], [1, 1.12, 1], CL);
          const x = land ? (i - 1) * 560 : i === 1 ? 40 : 0;
          const y = land ? 30 : -170 + i * 230;
          return (
            <At key={i} x={x} y={y}>
              <div
                style={{
                  ...anim(f, st, {dy: 60, s0: 0.92, exit: X}),
                  width: land ? 520 : 860,
                  height: land ? 330 : 190,
                  padding: land ? '44px 44px' : '0 56px',
                  boxSizing: 'border-box',
                  borderRadius: 40,
                  background: '#fff',
                  boxShadow: '0 40px 80px rgba(15,40,50,.12),0 6px 18px rgba(15,40,50,.06)',
                  display: 'flex',
                  flexDirection: land ? 'column' : 'row',
                  alignItems: land ? 'flex-start' : 'center',
                  gap: land ? 26 : 40,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 34,
                    flexShrink: 0,
                    background: 'linear-gradient(180deg,#1BB0B8,#0E737C)',
                    display: 'grid',
                    placeItems: 'center',
                    transform: `scale(${pulse})`,
                    boxShadow: `0 0 ${30 * (pulse - 1) * 8}px rgba(22,166,174,.6)`,
                  }}
                >
                  <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
                    {ICONS[i]}
                  </svg>
                </div>
                <div>
                  <div style={{fontSize: 24, letterSpacing: '.14em', color: C.teal, fontWeight: 700}}>{c.k}</div>
                  <div style={{fontSize: land ? 38 : 44, fontWeight: 700, marginTop: 6, letterSpacing: '-.02em', whiteSpace: 'nowrap'}}>{c.line}</div>
                </div>
                <div style={{position: 'absolute', right: land ? 30 : 36, top: land ? 30 : -16, ...anim(f, chipAt, {dur: 22, dy: 0, s0: 0.6, exit: X, blur: 0})}}>
                  <Chip size={20} style={{background: '#E8F7EE', color: C.green}}>
                    ✓ {COPY.doors.chip}
                  </Chip>
                </div>
              </div>
            </At>
          );
        })}
        <At y={pk(340, 620)}>
          <div style={{...anim(f, 72, {exit: X}), fontSize: pk(44, 46), color: C.mut, whiteSpace: 'nowrap'}}>
            {COPY.doors.foot[0]} <b style={{color: C.ink}}>{COPY.doors.foot[1]}</b>
          </div>
        </At>
      </Camera>
    </Bg>
  );
};

// ============ 5 · CONVERSATION ============
const Typing: React.FC<{f: number}> = ({f}) => (
  <span style={{display: 'inline-flex', gap: 10}}>
    {[0, 1, 2].map((k) => (
      <i
        key={k}
        style={{width: 14, height: 14, borderRadius: '50%', background: '#9CA3AF', display: 'inline-block', transform: `translateY(${Math.sin(f / 4 - k * 0.9) * 5}px)`, opacity: 0.55 + 0.45 * Math.sin(f / 4 - k * 0.9)}}
      />
    ))}
  </span>
);

const Phone: React.FC<{f: number; X: number}> = ({f, X}) => {
  const m = COPY.chat.msgs;
  const bubble = (txt: string, out: boolean, top: number, at: number) => (
    <div
      style={{
        position: 'absolute',
        top,
        [out ? 'right' : 'left']: 36,
        maxWidth: 440,
        padding: '22px 28px',
        borderRadius: 30,
        fontSize: 27,
        lineHeight: 1.35,
        background: out ? C.navy : '#F1F2F4',
        color: out ? '#fff' : '#1F2937',
        [out ? 'borderBottomRightRadius' : 'borderBottomLeftRadius']: 10,
        transformOrigin: out ? '100% 100%' : '0% 100%',
        ...anim(f, at, {dur: 24, dy: 24, s0: 0.85, blur: 4}),
      }}
    >
      {txt}
    </div>
  );
  const typing = (top: number, a: number, b: number) =>
    f >= a && f < b ? (
      <div style={{position: 'absolute', left: 36, top, padding: '24px 32px', borderRadius: 30, background: '#F1F2F4', borderBottomLeftRadius: 10, ...anim(f, a, {dur: 14, dy: 10, s0: 0.8, blur: 0})}}>
        <Typing f={f} />
      </div>
    ) : null;
  const tag = (txt: string, top: number, at: number) => (
    <div
      style={{
        position: 'absolute',
        right: 36,
        top,
        fontSize: 19,
        fontWeight: 600,
        letterSpacing: '.09em',
        color: C.teal,
        background: C.tealSoft,
        padding: '9px 14px',
        borderRadius: 10,
        transformOrigin: '100% 0%',
        ...anim(f, at, {dur: 22, dy: -6, s0: 0.6, blur: 0}),
      }}
    >
      ✓ {txt}
    </div>
  );
  return (
    <div style={{width: 620, height: 1260, borderRadius: 92, background: '#0B0F17', padding: 22, boxSizing: 'border-box', boxShadow: '0 80px 140px rgba(5,20,30,.30),0 20px 40px rgba(5,20,30,.18),inset 0 0 0 3px #2a2f3a'}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 72, background: '#fff', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', width: 190, height: 54, borderRadius: 30, background: '#0B0F17'}} />
        <div style={{position: 'absolute', top: 30, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 26}}>
          <span>11:52</span>
          <span style={{letterSpacing: 2}}>●●● ▭</span>
        </div>
        <div style={{position: 'absolute', top: 110, left: 0, right: 0, padding: '0 36px 26px', display: 'flex', alignItems: 'center', gap: 18, borderBottom: `1px solid ${C.line}`}}>
          <div style={{width: 72, height: 72, borderRadius: '50%', background: C.tealSoft, color: C.teal, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 30, flexShrink: 0}}>J</div>
          <div>
            <div style={{fontSize: 30, fontWeight: 600}}>{COPY.chat.name}</div>
            <div style={{fontSize: 20, color: C.mut, width: 290}}>{COPY.chat.role}</div>
          </div>
          <div style={{marginLeft: 'auto', fontSize: 19, color: C.teal, background: C.tealSoft, padding: '8px 14px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap', opacity: 0.6 + 0.4 * Math.sin(f / 10)}}>● AI live</div>
        </div>
        {typing(270, 20, 80)}
        {bubble(m[0], false, 270, 80)}
        {bubble(m[1], true, 470, 122)}
        {tag(COPY.chat.tags[0], 596, 134)}
        {typing(660, 160, 176)}
        {bubble(m[2], false, 660, 176)}
        {bubble(m[3], true, 840, 216)}
        {tag(COPY.chat.tags[1], 936, 228)}
        {typing(1000, 300, 9999)}
      </div>
    </div>
  );
};

export const Chat: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const land = pk(true, false);
  const X = dur - EXIT;
  const sc = pk(0.98, 0.96);
  const px = pk(320, 0),
    py = pk(95, 230);
  // focus on the "Qualifies requirement" tag (phone-local offset ≈ +60, +300)
  const fx = px + 60 * sc,
    fy = py + 300 * sc;
  const zoom = pk(1.3, 1.25);
  // the clock runs in real time while the AI types, and stops when the reply lands
  const secs = interpolate(f, [20, 80], [0, COPY.chat.statValue], CL);
  const peek = tw(f, 180, 216, 0, 1, E.back);
  const exitAll = anim(f, -100, {exit: X});
  const side = land ? 1 - interpolate(f, [226, 252, 305, 335], [0, 1, 1, 0], {...CL, easing: E.inOut}) : 1;
  return (
    <Bg>
      <Camera
        dur={dur}
        push={0.03}
        keys={[
          [232, 1, fx, fy],
          [270, zoom, fx, fy],
          [305, zoom, fx, fy],
          [340, 1, fx, fy],
        ]}
      >
        <At x={pk(-470, 0)} y={pk(-170, -730)} style={{opacity: side}}>
          <Words text={COPY.chat.head} start={2} size={pk(100, 100)} accent={['your', 'best', 'rep.']} exit={X} />
        </At>
        {/* first-reply stat */}
        <At x={pk(-470, 260)} y={pk(170, -500)} style={{opacity: side}}>
          <div style={{...anim(f, 14, {s0: 0.8, exit: X})}}>
            {land ? (
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 28, letterSpacing: '.2em', color: C.teal, fontWeight: 700}}>{COPY.chat.statLabel}</div>
                <div style={{fontSize: 190, fontWeight: 800, letterSpacing: '-.06em', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums', ...gradText()}}>{secs.toFixed(1)}s</div>
                <div style={{fontSize: 36, color: C.mut, fontWeight: 500}}>{COPY.chat.statCaption}</div>
              </div>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#fff', padding: '18px 30px', borderRadius: 999, boxShadow: '0 20px 40px rgba(15,40,50,.12)', whiteSpace: 'nowrap'}}>
                <span style={{fontSize: 22, letterSpacing: '.16em', color: C.teal, fontWeight: 700}}>{COPY.chat.statLabel}</span>
                <span style={{fontSize: 44, fontWeight: 800, letterSpacing: '-.04em', fontVariantNumeric: 'tabular-nums', ...gradText()}}>{secs.toFixed(1)}s</span>
              </div>
            )}
          </div>
        </At>
        {/* fox peeks from behind the phone */}
        <At x={px + 290 * sc + peek * 120 * sc} y={py + 380 * sc}>
          <div style={{transform: `rotate(${-14 + 8 * peek}deg)`, opacity: Math.min(1, peek * 3) * (exitAll.opacity as number)}}>
            <Fox size={300 * sc} start={170} ignite={200} stagger={0} />
          </div>
        </At>
        <At x={px} y={py}>
          <div style={{transform: `scale(${sc})`}}>
            <div style={{...anim(f, 0, {dy: 160, s0: 0.94, exit: X})}}>
              <Phone f={f} X={X} />
            </div>
          </div>
        </At>
      </Camera>
    </Bg>
  );
};

// ============ 6 · QUALIFIED → BOOKED ============
export const Booked: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const X = dur - EXIT;
  const B = 128; // night falls
  const night = tw(f, B, B + 22, 0, 1, E.inOut);
  const q = Math.round(count(f, 32, COPY.booked.qualifySeconds));
  const check = tw(f, 150, 170, 0, 1, E.inOut);
  const dot = 0.5 + 0.5 * Math.sin(f / 7);
  const W = pk(900, 880);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill style={{opacity: night}}>
        <Bg dark />
      </AbsoluteFill>
      <Camera dur={dur} push={0.05}>
        <Glow y={pk(-70, -180)} size={1400} o={night} />
        {/* phase A — qualified */}
        <At y={pk(-370, -640)}>
          <Words text={pk('Qualified before you wake up.', COPY.booked.head)} start={0} size={pk(88, 104)} accent={['before', 'you', 'wake', 'up.']} exit={B} />
        </At>
        <At y={pk(70, 60)}>
          <div style={{...anim(f, 6, {dy: 60, s0: 0.94, exit: B}), width: W, padding: 56, boxSizing: 'border-box', borderRadius: 40, background: '#fff', boxShadow: '0 40px 80px rgba(15,40,50,.14),0 6px 18px rgba(15,40,50,.08)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22, fontSize: 52, fontWeight: 700, letterSpacing: '-.02em'}}>
              <i style={{width: 28, height: 28, borderRadius: '50%', background: C.green, boxShadow: `0 0 0 ${6 + 8 * dot}px rgba(22,163,74,${0.22 - 0.12 * dot})`, display: 'inline-block'}} />
              {COPY.booked.status}
            </div>
            <div style={{marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
              {[...COPY.booked.fields, ['TIME TO QUALIFY', `${Math.floor(q / 60)}m ${q % 60}s`]].map(([k, v], i) => (
                <div key={k} style={{background: '#F5F6F7', borderRadius: 24, padding: '26px 30px', ...anim(f, 22 + i * 4, {dur: 24, dy: 24, s0: 0.92, blur: 4})}}>
                  <div style={{fontSize: 21, letterSpacing: '.12em', color: C.mut, fontWeight: 600}}>{k}</div>
                  <div style={{fontSize: 40, fontWeight: 700, marginTop: 8, color: i === 3 ? C.teal : C.ink, fontVariantNumeric: 'tabular-nums'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </At>
        {/* phase B — booked */}
        <At y={pk(-95, -200)}>
          <div
            style={{
              ...anim(f, 140, {dy: 80, s0: 0.8, exit: X}),
              width: pk(760, 840),
              padding: '60px 56px',
              boxSizing: 'border-box',
              borderRadius: 44,
              textAlign: 'center',
              background: 'linear-gradient(180deg,#F0FDF7,#E2F8EE)',
              border: '2px solid #A7E8C7',
              boxShadow: '0 0 0 14px rgba(63,224,232,.08),0 60px 120px rgba(0,0,0,.5)',
              color: C.ink,
            }}
          >
            <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="3" />
              <path d="M3 10h18M8 3v4M16 3v4" />
              <path d="M8.5 15.5l2.2 2.2 4.8-4.8" strokeWidth="2" strokeDasharray="12" strokeDashoffset={12 * (1 - check)} />
            </svg>
            <div style={{fontSize: pk(80, 92), fontWeight: 700, letterSpacing: '-.04em', color: '#15803D', marginTop: 16}}>{COPY.booked.title}</div>
            <div style={{fontSize: pk(132, 150), fontWeight: 700, letterSpacing: '-.05em', lineHeight: 1}}>{COPY.booked.time}</div>
            <div style={{fontSize: 32, color: '#4B5563', marginTop: 20}}>{COPY.booked.handoff}</div>
          </div>
        </At>
        <At y={pk(355, 470)}>
          <Words
            text={pk('Cold leads become calendar holds,|without the chase.', COPY.booked.hero)}
            start={168}
            stagger={3}
            size={pk(62, 88)}
            color="#fff"
            accent={['calendar', 'holds,']}
            accentGrad
            exit={X}
          />
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

// ============ 7 · ALWAYS ON ============
export const Always: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const land = pk(true, false);
  const X = dur - EXIT;
  const tx = pk(-400, 0);
  return (
    <Bg dark style={{background: '#070C16'}}>
      <Camera dur={dur} push={0.04}>
        <At x={pk(-560, 170)} y={pk(-330, -640)}>
          <div style={{...anim(f, 0, {dy: 20, exit: X}), width: 170, height: 170}}>
            <div style={{width: 170, height: 170, borderRadius: '50%', boxShadow: '-36px 26px 0 0 #E8F3FF', transform: 'translate(36px,-26px)', filter: 'drop-shadow(0 0 40px rgba(200,230,255,.45))'}} />
          </div>
        </At>
        <At x={tx} y={pk(-150, -320)}>
          <div style={{...anim(f, 0, {exit: X}), fontSize: pk(180, 200), fontWeight: 700, letterSpacing: '-.06em', whiteSpace: 'nowrap'}}>{COPY.always.time}</div>
        </At>
        <At x={tx} y={pk(20, -110)}>
          <div style={{...anim(f, 10, {exit: X}), fontSize: pk(46, 48), color: C.nightText, whiteSpace: 'nowrap'}}>{COPY.always.asleep}</div>
        </At>
        <At x={tx} y={pk(115, -10)}>
          <div style={{...anim(f, 18, {exit: X}), fontSize: pk(92, 96), fontWeight: 700, letterSpacing: '-.04em', whiteSpace: 'nowrap', ...gradText()}}>{COPY.always.awake}</div>
        </At>
        {COPY.always.rows.map(([a, b], i) => (
          <At key={i} x={pk(440, 0)} y={pk(-110 + i * 115, 300 + i * 120)}>
            <div
              style={{
                ...anim(f, 28 + i * 4, {dx: land ? 60 : 0, dy: land ? 0 : 30, exit: X}),
                width: pk(740, 860),
                gap: 30,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '28px 36px',
                boxSizing: 'border-box',
                borderRadius: 24,
                background: 'rgba(255,255,255,.07)',
                border: '1px solid rgba(255,255,255,.08)',
                fontSize: 32,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{a}</span>
              <span style={{color: '#5EEAF0', fontWeight: 600, ...anim(f, 44 + i * 4, {dur: 20, dy: 0, s0: 0.6, blur: 0})}}>● {b}</span>
            </div>
          </At>
        ))}
        <At y={pk(420, 760)}>
          <div style={{...anim(f, 44, {exit: X}), fontSize: 34, letterSpacing: '.3em', color: '#7FD9DE', fontWeight: 600}}>{COPY.always.label}</div>
        </At>
      </Camera>
    </Bg>
  );
};

// ============ 8 · OFFER ============
export const Offer: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const X = dur - EXIT;
  const v = Math.round(count(f, 6, COPY.offer.price));
  const bump = interpolate(f, [66, 72, 84], [1, 1.05, 1], CL);
  return (
    <Bg>
      <Camera dur={dur} push={0.05}>
        <Glow y={pk(0, -120)} size={1100} o={0.55} />
        <At y={pk(-340, -560)}>
          <div style={anim(f, 0, {exit: X})}>
            <Chip size={26} style={{background: C.teal, color: '#fff'}}>
              {COPY.offer.chip}
            </Chip>
          </div>
        </At>
        <At y={pk(-245, -430)}>
          <div style={{...anim(f, 3, {exit: X}), fontSize: pk(50, 56), color: C.mut, fontWeight: 500, whiteSpace: 'nowrap'}}>{COPY.offer.pre}</div>
        </At>
        <At y={pk(-10, -130)}>
          <div style={{...anim(f, 6, {dy: 60, s0: 0.85, exit: X})}}>
            <div style={{fontSize: pk(340, 400), fontWeight: 800, letterSpacing: '-.07em', lineHeight: 1, transform: `scale(${bump})`, fontVariantNumeric: 'tabular-nums', ...gradText(), padding: '0 .08em .06em 0'}}>${v}</div>
          </div>
        </At>
        <At y={pk(205, 160)}>
          <div style={{...anim(f, 14, {exit: X}), fontSize: pk(56, 60), fontWeight: 600, color: C.mut}}>{COPY.offer.per}</div>
        </At>
        <At y={pk(330, 380)}>
          <div style={{...anim(f, 44, {exit: X}), fontSize: pk(40, 42), color: C.mut, whiteSpace: 'nowrap'}}>{COPY.offer.line}</div>
        </At>
      </Camera>
    </Bg>
  );
};

// ============ 9 · LOGO + CTA ============
export const Cta: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const pk = usePick();
  const CLICK = 98;
  const by = pk(175, 290);
  const ripple = tw(f, CLICK, CLICK + 30, 0, 1, E.out);
  const lit = interpolate(f, [CLICK, CLICK + 6, CLICK + 40], [0, 1, 0.4], CL);
  const fade = tw(f, dur - 14, dur, 0, 1, E.in);
  return (
    <Bg dark>
      <Camera dur={dur} push={0.04}>
        <Glow y={pk(-150, -250)} size={1300} o={tw(f, 10, 50)} />
        <At y={pk(-305, -330)}>
          <Fox size={pk(220, 300)} start={0} stagger={1} ignite={18} />
        </At>
        <At y={pk(-95, -80)}>
          <Words text={COPY.cta.name} start={20} stagger={5} size={pk(124, 140)} color="#fff" accent={['AI']} accentGrad />
        </At>
        <At y={pk(30, 60)}>
          <div style={{...anim(f, 32), fontSize: pk(40, 42), color: C.nightText, whiteSpace: 'nowrap'}}>{COPY.cta.tag}</div>
        </At>
        <At y={by}>
          <div style={anim(f, 42, {s0: 0.8})}>
            <div style={{position: 'relative', transform: `scale(${press(f, CLICK)})`}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  boxShadow: `0 0 0 ${ripple * 40}px rgba(63,224,232,${0.35 * (1 - ripple)})`,
                  opacity: f >= CLICK ? 1 : 0,
                }}
              />
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '32px 60px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: pk(40, 42),
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  background: `linear-gradient(180deg,${lit > 0.5 ? '#22C3CB' : '#1BB0B8'},#0E737C)`,
                  boxShadow: `0 0 0 10px rgba(22,166,174,.18),0 24px 50px rgba(15,124,134,.45),0 0 ${40 + 60 * lit}px rgba(63,224,232,${0.25 + 0.4 * lit}),inset 0 2px 0 rgba(255,255,255,.3)`,
                }}
              >
                <svg width="42" height="42" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z" />
                </svg>
                {COPY.cta.button}
              </div>
            </div>
          </div>
        </At>
        <At y={pk(305, 470)}>
          <div style={{...anim(f, 52), fontSize: pk(42, 46), fontWeight: 600, color: '#5EEAF0', letterSpacing: '.01em'}}>{COPY.cta.url}</div>
        </At>
        <Cursor from={pk<[number, number]>([620, 560], [430, 900])} to={[110, by + 20]} start={62} dur={36} click={CLICK} />
      </Camera>
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </Bg>
  );
};
