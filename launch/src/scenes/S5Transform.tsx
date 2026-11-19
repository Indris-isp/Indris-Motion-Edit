/* Scene 5 · Raw → content that grows you (fix) */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COPY, cue } from '../config';
import { At, CAM, Camera, Center, Check, Cursor, Words, card, countVal, drift, enter, fmt, lerp, pop, press, prog, useL } from '../lib';

const EW = 1000, EH = 600;
const ED = { x: -300, y: 60 }; // editor centre (world)
const PH = { x: 560, y: 40 }; // phone centre (world)
const BTN = { x: 830, y: 44 }; // Auto-edit button, editor-local
const CLICK = 66;

const Preview: React.FC<{ f: number; grade: number; w: number; h: number; capStart: number }> = ({ f, grade, w, h, capStart }) => {
  const words = ['THIS', 'CHANGED', 'EVERYTHING'];
  return (
    <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: 14, background: '#2A2928' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#56534F 0%,#3B3936 60%,#1F1E1D 100%)', opacity: 1 - grade }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg,#5A2E12 0%,#2A160B 55%,#120B07 100%)', opacity: grade }} />
      <div style={{ position: 'absolute', left: '50%', bottom: 0, width: w * 0.26, height: h * 0.62, translate: '-50% 0', borderRadius: `${w * 0.13}px ${w * 0.13}px 0 0`, background: grade > 0 ? `linear-gradient(180deg, rgba(225,140,80,${grade}), rgba(110,52,20,${grade}))` : '#24231F' }} />
      <div style={{ position: 'absolute', left: '50%', top: h * 0.14, width: w * 0.16, height: w * 0.16, translate: '-50% 0', borderRadius: '50%', background: grade > 0.5 ? '#E09060' : '#24231F' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.66, textAlign: 'center', fontWeight: 800, fontSize: w * 0.065, lineHeight: 1.15, color: '#fff' }}>
        {words.map((t, i) => {
          const s = pop(f, capStart + i * 7);
          return (
            <span key={t} style={{ display: 'inline-block', margin: '0 .14em', opacity: f >= capStart + i * 7 ? 1 : 0, transform: `scale(${0.6 + 0.4 * s})`, color: i === 2 ? C.accHi : '#fff', textShadow: '0 3px 0 #000, 0 0 14px rgba(0,0,0,.6)' }}>
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Editor: React.FC<{ f: number }> = ({ f }) => {
  const cut = prog(f, CLICK + 8, 30);
  const grade = prog(f, CLICK + 20, 40);
  const segs = [0, 1, 2, 3, 4, 5];
  const chips = ['Cuts', 'Captions', 'Color', 'Sound'];
  return (
    <div style={card(EW, EH, { borderRadius: 26 })}>
      {/* toolbar */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 88, borderBottom: `1px solid ${C.line}` }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
          <div key={c} style={{ position: 'absolute', left: 28 + i * 26, top: 36, width: 15, height: 15, borderRadius: '50%', background: c }} />
        ))}
        <div style={{ position: 'absolute', left: 130, top: 30, fontSize: 22, color: C.mut }}>{COPY.rawFile}</div>
        <div style={{ position: 'absolute', left: BTN.x - 105, top: BTN.y - 26, width: 210, height: 52, borderRadius: 26, background: `linear-gradient(135deg, ${C.accHi}, ${C.acc} 50%, ${C.accLo})`, color: '#111', fontSize: 22, fontWeight: 700, display: 'grid', placeItems: 'center', transform: `scale(${press(f, CLICK)})`, boxShadow: `0 10px 30px rgba(255,115,20,${0.3 + 0.4 * prog(f, CLICK, 6) * (1 - prog(f, CLICK + 6, 30))})` }}>
          ✦ Auto-edit
        </div>
      </div>
      {/* preview */}
      <div style={{ position: 'absolute', left: 28, top: 110 }}>
        <Preview f={f} grade={grade} w={600} h={300} capStart={CLICK + 34} />
      </div>
      {/* side panel: what got done */}
      <div style={{ position: 'absolute', left: 656, top: 110, width: 316 }}>
        {chips.map((c, i) => {
          const st = CLICK + 14 + i * 4 * 3;
          return (
            <div key={c} style={{ height: 62, marginBottom: 12, borderRadius: 14, background: '#141416', display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', fontSize: 22, fontWeight: 600, color: f >= st ? C.text : C.dim }}>
              <Check p={prog(f, st, 20)} size={32} color={C.acc} />
              {c}
            </div>
          );
        })}
      </div>
      {/* timeline */}
      <div style={{ position: 'absolute', left: 28, top: 440, width: EW - 56, height: 130, borderRadius: 14, background: '#141416' }}>
        {segs.map((i) => {
          const w = (EW - 56 - 40) / 6;
          const g = 10 * cut;
          const x = 20 + i * w + (i - 2.5) * g;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: 34, width: w - (cut > 0 ? 6 * cut : 0) + (cut > 0 ? 0 : 1), height: 62, borderRadius: cut > 0 ? 10 : 0, background: cut > 0 ? `color-mix(in srgb, ${['#FF821C', '#FF9F4D', '#FFB862', '#FF821C', '#E65000', '#FF9F4D'][i]} ${Math.round(prog(f, CLICK + 12 + i * 3, 16) * 100)}%, #4A4845)` : '#4A4845', transform: `translateY(${-(pop(f, CLICK + 12 + i * 3) - (f >= CLICK + 12 + i * 3 ? 1 : 0)) * 14}px)` }} />
          );
        })}
        <div style={{ position: 'absolute', left: 20 + (EW - 96) * prog(f, CLICK + 20, 120, CAM), top: 16, width: 3, height: 98, background: '#fff', boxShadow: '0 0 10px #fff' }} />
      </div>
    </div>
  );
};

const Phone: React.FC<{ f: number; t0: number }> = ({ f, t0 }) => (
  <div style={{ width: 360, height: 720, borderRadius: 56, background: '#050506', border: '2px solid #2A2A2E', boxShadow: '0 60px 120px rgba(0,0,0,.7), inset 0 0 0 9px #0E0E10', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 12, top: 12 }}>
      <Preview f={f} grade={1} w={336} h={696} capStart={-100} />
    </div>
    <div style={{ position: 'absolute', left: 140, top: 22, width: 80, height: 24, borderRadius: 12, background: '#000' }} />
    <div style={{ position: 'absolute', right: 26, top: 330, display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>
      <div style={{ textAlign: 'center', transform: `scale(${press(f, t0 + 30) * (0.9 + 0.1 * pop(f, t0 + 26))})` }}>
        <svg width="44" height="40" viewBox="0 0 24 22"><path d="M12 21s-9-5.6-9-12A5 5 0 0 1 12 6a5 5 0 0 1 9 3c0 6.4-9 12-9 12z" fill={f > t0 + 26 ? C.red : '#fff'} /></svg>
        <div>{fmt(countVal(f, t0 + 8, 0, 9_800))}</div>
      </div>
    </div>
  </div>
);

export const S5Transform: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const k = L.wide ? 1 : L.tall ? 1 : 0.82;
  const t0 = 160; // stats start
  // camera: editor → zoom on Auto-edit → back → pan to the phone
  const B = { x: ED.x - EW / 2 + BTN.x, y: ED.y - EH / 2 + BTN.y };
  const F0 = { s: 1, x: -ED.x, y: -ED.y };
  const F1 = { s: 1.25, x: -1.25 * B.x, y: -1.25 * B.y };
  const F3 = { s: 1, x: -PH.x, y: -PH.y + 20 };
  const z1 = prog(f, 26, 44, CAM), z2 = prog(f, CLICK + 30, 44, CAM), z3 = prog(f, 136, 54, CAM);
  const mix = (a: typeof F0, b: typeof F0, p: number) => ({ s: lerp(a.s, b.s, p), x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) });
  const cam = mix(mix(mix(F0, F1, z1), F0, z2), F3, z3);
  const d = drift(f, 7, 4);
  const headY = L.wide ? -436 : L.tall ? -700 : -440;
  return (
    <Center>
      <Camera s={cam.s * k} x={cam.x * k} y={cam.y * k}>
        <At x={ED.x} y={ED.y} style={{ ...enter(f, 0, 80), opacity: 1 - 0.55 * z3 }}>
          <Editor f={f} />
        </At>
        <At x={PH.x + d.x} y={PH.y + d.y} style={enter(f, 120, 120)}>
          <Phone f={f} t0={t0} />
        </At>
        <At x={PH.x + 330} y={PH.y - 150} style={enter(f, t0 - 6, 50)}>
          <div style={card(310, 128, { borderRadius: 22, padding: '20px 26px' })}>
            <div style={{ fontSize: 19, color: C.mut }}>Views</div>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{fmt(countVal(f, t0, 0, COPY.views))}</div>
          </div>
        </At>
        <At x={PH.x + 300} y={PH.y + 20} style={enter(f, t0 + 4, 50)}>
          <div style={card(310, 128, { borderRadius: 22, padding: '20px 26px' })}>
            <div style={{ fontSize: 19, color: C.mut }}>New followers</div>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', color: C.green, fontVariantNumeric: 'tabular-nums' }}>+{fmt(countVal(f, t0 + 4, 0, COPY.followers))}</div>
          </div>
        </At>
        <Cursor keys={[{ f: 14, x: 380, y: 420 }, { f: 60, x: B.x + 24, y: B.y + 10 }, { f: 110, x: B.x + 140, y: B.y + 260 }]} clicks={[CLICK]} opacity={prog(f, 10, 8) * (1 - prog(f, 104, 12))} />
      </Camera>
      <At x={0} y={headY}>
        <Words segs={[{ t: 'Raw footage →', mut: true }, { t: 'content that' }, { t: 'actually grows you.', serif: true, acc: true }]} start={cue('turn') + 136} size={L.wide ? 66 : 58} width={L.wide ? undefined : 960} />
      </At>
    </Center>
  );
};
