import React from 'react';
import {TYPE} from '../config';
import {pop} from '../anim';
import {COLORS, COPY} from '../config';
import {BODY, DISPLAY, HAND} from '../fonts';

// SignWell editor, drawn as vector (placeholder until the Figma SVGs arrive).
// Window is 1440×760, centered on the canvas: window-local (lx, ly) = world (lx - 720, ly - 400).
export const WIN = {w: 1440, h: 760, top: 72, side: 280};
export const PAGE = {x: 540, y: 100, w: 640};
export const SLOT_SIG = {x: 48, y: 380, w: 260, h: 80};
export const SLOT_DATE = {x: 48, y: 520, w: 200, h: 56};
export const toWorld = (lx: number, ly: number) => ({x: lx - WIN.w / 2, y: ly - WIN.h / 2});
export const paletteCenter = (i: number) => toWorld(24 + 116, 150 + i * 76);
export const slotCenter = (s: typeof SLOT_SIG) => toWorld(PAGE.x + s.x + s.w / 2, PAGE.y + s.y + s.h / 2);
export const sendCenter = toWorld(WIN.w - 24 - 70, 36);

export type Status = 'send' | 'sent' | 'viewed' | 'signed';

export const FieldChip: React.FC<{label: string; w: number; h: number; color?: string; soft?: string; dashed?: boolean; size?: number}> = ({label, w, h, color = COLORS.blue, soft = 'rgba(43,89,232,.12)', dashed, size = 20}) => (
  <div style={{width: w, height: h, borderRadius: 10, border: `3px ${dashed ? 'dashed' : 'solid'} ${color}`, background: soft,
    display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontFamily: BODY, fontWeight: TYPE.button, fontSize: size}}>{label}</div>
);

export const Signature: React.FC<{progress: number; width?: number; color?: string}> = ({progress, width = 240, color = '#14286e'}) => {
  const len = 900;
  return (
    <svg width={width} height={width * 0.33} viewBox="0 0 240 80" style={{overflow: 'visible'}}>
      <path d="M8 56 C 20 20, 34 18, 30 48 C 28 66, 18 70, 22 52 C 28 34, 44 40, 46 54 C 48 64, 58 40, 64 50 C 70 60, 78 38, 86 48 C 92 56, 100 46, 108 50
               M120 30 C 116 50, 112 64, 124 60 C 136 56, 144 44, 150 50 C 156 58, 162 40, 172 48 C 180 54, 190 42, 200 50 C 210 58, 222 44, 234 38"
        fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - progress)} />
    </svg>
  );
};

export const Editor: React.FC<{
  sig: number; date: number; status: Status; statusScale?: number; sigInk?: number; hoverIndex?: number; build?: number; chrome?: number;
}> = ({sig, date, status, statusScale = 1, sigInk = 0, hoverIndex = -1, build, chrome = 1}) => {
  const ca = (a: number) => (a * chrome).toFixed(3);
  // build: frames since the build-in started (undefined = fully built). Fast staggered cascade.
  const bp = (k: number) => build === undefined ? 1 : pop(build, k * 2, 14);
  const fly = (k: number, dx: number, dy: number) => { const q = bp(k); return {opacity: q, transform: `translate(${(1 - q) * dx}px, ${(1 - q) * dy}px)`}; };
  const pill = {
    send: {bg: COLORS.blue, fg: '#fff', label: COPY.s3.send},
    sent: {bg: COLORS.blueSoft, fg: COLORS.blue, label: 'Sent'},
    viewed: {bg: '#fdf0e2', fg: '#a85d12', label: 'Viewed'},
    signed: {bg: COLORS.green, fg: '#fff', label: '✓ Signed'},
  }[status];
  return (
    <div style={{position: 'absolute', left: 960 - WIN.w / 2, top: 540 - WIN.h / 2, width: WIN.w, height: WIN.h, borderRadius: 24,
      background: `rgba(255,255,255,${ca(1)})`, overflow: 'hidden', boxShadow: `0 50px 120px rgba(43,89,232,${ca(.24)}), 0 6px 18px rgba(43,89,232,${ca(.14)}), 0 0 90px rgba(79,124,255,${ca(.32)})`, border: `1px solid rgba(228,233,245,${ca(1)})`, fontFamily: BODY, color: COLORS.ink}}>
      {/* top bar */}
      <div style={{height: WIN.top, borderBottom: `1px solid rgba(223,227,236,${ca(1)})`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px'}}>
        {[0, 1, 2].map(i => <div key={i} style={{width: 14, height: 14, borderRadius: '50%', background: '#e3e6ee', ...fly(i, 0, -20)}} />)}
        <div style={{fontFamily: DISPLAY, fontWeight: TYPE.heading, fontSize: 26, color: COLORS.blue, marginLeft: 16, ...fly(3, 0, -24)}}>{COPY.s3.product}</div>
        <div style={{fontSize: 19, color: COLORS.ink2, marginLeft: 22, ...fly(4, 0, -24)}}>{COPY.s3.docName}</div>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: COLORS.ink2, ...fly(5, 40, 0)}}>
          To
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 99, background: COLORS.blueSoft, color: COLORS.blue, fontWeight: 600}}>
            <span style={{width: 10, height: 10, borderRadius: '50%', background: COLORS.blue}} />{COPY.s3.recipient}</span>
        </div>
        <div style={{width: 140, height: 46, borderRadius: 12, background: pill.bg, color: pill.fg, fontWeight: TYPE.button, fontSize: 20, marginLeft: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: bp(6), transform: `scale(${statusScale * (0.6 + 0.4 * bp(6))})`}}>{pill.label}</div>
      </div>
      <div style={{display: 'flex', height: WIN.h - WIN.top}}>
        {/* field palette */}
        <div style={{width: WIN.side, borderRight: `1px solid rgba(223,227,236,${ca(1)})`, padding: '0 24px', position: 'relative'}}>
          <div style={{position: 'absolute', top: 30, left: 24, fontSize: 15, fontWeight: TYPE.subheading, letterSpacing: '.12em', color: COLORS.ink2, ...fly(1, -40, 0)}}>FIELDS</div>
          {COPY.s3.fields.map((label, i) => (
            <div key={i} style={{position: 'absolute', left: 24, top: 150 + i * 76 - 30 - WIN.top, width: 232, height: 60, borderRadius: 12,
              border: `2px solid ${hoverIndex === i ? COLORS.blue : COLORS.line}`, background: hoverIndex === i ? COLORS.blueSoft : '#fff',
              display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 20, fontWeight: 600, color: hoverIndex === i ? COLORS.blue : COLORS.ink, ...fly(2 + i, -70, 0)}}>
              <span style={{width: 26, height: 26, borderRadius: 7, background: COLORS.blueSoft, color: COLORS.blue, fontSize: 15, fontWeight: TYPE.heading,
                display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{['✎', 'AB', '▦', 'T'][i]}</span>{label}
            </div>
          ))}
        </div>
        {/* document canvas */}
        <div style={{flex: 1, background: `rgba(238,241,247,${ca(1)})`, position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: PAGE.x - WIN.side, top: PAGE.y - WIN.top, width: PAGE.w, height: 900, background: '#fff',
            boxShadow: '0 8px 24px rgba(20,27,45,.08)'}}>
            <div style={{opacity: build === undefined ? 1 : pop(build, 4, 18)}}>
            <div style={{position: 'absolute', left: 48, top: 48, fontFamily: DISPLAY, fontWeight: TYPE.heading, fontSize: 32}}>{COPY.s3.docTitle}</div>
            {[[110, 92], [134, 100], [158, 86], [182, 96], [206, 70]].map(([y, w], k) => (
              <div key={k} style={{position: 'absolute', left: 48, top: y, width: `${(w as number) * 0.85}%`, height: 9, borderRadius: 5, background: '#e8ebf2'}} />
            ))}
            <div style={{position: 'absolute', left: 48, top: 300, fontFamily: DISPLAY, fontWeight: TYPE.subheading, fontSize: 24}}>7. Signatures</div>
            {/* client slot */}
            <div style={{position: 'absolute', left: SLOT_SIG.x, top: SLOT_SIG.y + SLOT_SIG.h + 6, width: SLOT_SIG.w, borderTop: '2px solid #c9ced8', paddingTop: 6, fontSize: 15, color: COLORS.ink2}}>Client · {COPY.s3.recipient}</div>
            <div style={{position: 'absolute', left: SLOT_SIG.x, top: SLOT_SIG.y, transform: `scale(${sig})`, opacity: Math.min(1, sig * 1.5)}}>
              <FieldChip label={sigInk > 0 ? '' : `Signature · ${COPY.s3.recipient.split(' ')[0]}`} w={SLOT_SIG.w} h={SLOT_SIG.h}
                color={sigInk > 0 ? COLORS.green : COLORS.blue} soft={sigInk > 0 ? 'rgba(30,158,100,.08)' : 'rgba(43,89,232,.12)'} />
              {sigInk > 0 && <div style={{position: 'absolute', left: 10, top: 2}}><Signature progress={sigInk} /></div>}
            </div>
            {/* studio slot, pre-placed for the second signer */}
            <div style={{position: 'absolute', left: 340, top: SLOT_SIG.y + SLOT_SIG.h + 6, width: SLOT_SIG.w, borderTop: '2px solid #c9ced8', paddingTop: 6, fontSize: 15, color: COLORS.ink2}}>Studio · {COPY.s3.sender}</div>
            <div style={{position: 'absolute', left: 340, top: SLOT_SIG.y}}>
              <FieldChip label={`Signature · ${COPY.s3.sender.split(' ')[0]}`} w={SLOT_SIG.w} h={SLOT_SIG.h} color={COLORS.magenta} soft="rgba(194,64,159,.08)" dashed />
            </div>
            {/* date slot */}
            <div style={{position: 'absolute', left: SLOT_DATE.x, top: SLOT_DATE.y, transform: `scale(${date})`, opacity: Math.min(1, date * 1.5)}}>
              <FieldChip label="Date signed" w={SLOT_DATE.w} h={SLOT_DATE.h} size={18} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
