/* Shared motion toolkit: easing, entrances, camera, cursor, counter, kinetic type. */
import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { C, FONT, FPS } from './config';

/* ---------- easing ---------- */
export const EASE = Easing.bezier(0.45, 0, 0.2, 1); // element easy-ease
export const CAM = Easing.bezier(0.65, 0, 0.35, 1); // camera easy-ease in/out
export const IN = Easing.bezier(0.55, 0, 1, 0.45); // exits
export const OUT = Easing.bezier(0.16, 1, 0.3, 1); // counters
export const OVER = Easing.bezier(0.34, 1.56, 0.64, 1); // entrance overshoot

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
/** eased progress of frame f through [start, start+dur] */
export const prog = (f: number, start: number, dur: number, ease = EASE) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/** overshoot spring, ~0.5 s */
export const pop = (f: number, start: number) =>
  f < start ? 0 : spring({ frame: f - start, fps: FPS, config: { damping: 14, stiffness: 160, mass: 1 } });

/** standard entrance: rise + scale with overshoot, opacity ramps fast */
export const enter = (f: number, start: number, dist = 46) => {
  const s = pop(f, start);
  return {
    opacity: prog(f, start, 12),
    transform: `translateY(${(1 - s) * dist}px) scale(${0.9 + 0.1 * s})`,
  };
};

/** exit factor (0 → 1), ~60 % of an entrance, ease-in */
export const exitP = (f: number, start: number, dur = 18) => prog(f, start, dur, IN);

/** click press: 1 → 0.96 → 1 over 8 frames */
export const press = (f: number, at: number) => {
  const t = f - at;
  if (t < 0 || t > 8) return 1;
  return 1 - 0.04 * Math.sin((t / 8) * Math.PI);
};

/** nothing ever fully stops: slow float */
export const drift = (f: number, seed = 0, amp = 4) => ({
  x: Math.sin(f / 70 + seed * 1.7) * amp,
  y: Math.cos(f / 83 + seed * 2.3) * amp,
});

/* ---------- layout (everything from the canvas centre) ---------- */
export const useL = () => {
  const { width: W, height: H } = useVideoConfig();
  const mode = W > H * 1.3 ? 'wide' : H > W * 1.3 ? 'tall' : 'square';
  return { W, H, mode, wide: mode === 'wide', tall: mode === 'tall', square: mode === 'square' } as const;
};

export const Center: React.FC<{ children: React.ReactNode; scale?: number; style?: React.CSSProperties }> = ({ children, scale = 1, style }) => {
  const { W, H } = useL();
  return (
    <div style={{ position: 'absolute', left: W / 2, top: H / 2, width: 0, height: 0, transform: `scale(${scale})`, ...style }}>
      {children}
    </div>
  );
};

/** element centred on (x, y), relative to its parent's origin */
export const At: React.FC<{ x?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties; w?: number; h?: number }> = ({ x = 0, y = 0, children, style, w, h }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...style, translate: '-50% -50%' }}>{children}</div>
);

/** one camera per scene. World point P lands on screen at s·P + (x, y). Always a micro push-in. */
export const Camera: React.FC<{ s?: number; x?: number; y?: number; children: React.ReactNode }> = ({ s = 1, x = 0, y = 0, children }) => {
  const f = useCurrentFrame();
  const S = s * (1 + f * 0.00008);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `translate(${x}px, ${y}px) scale(${S})` }}>
      {children}
    </div>
  );
};

/* ---------- cursor: arcs, easy ease, settles with a tiny overshoot ---------- */
type Key = { f: number; x: number; y: number };
const CURSOR_EASE = Easing.bezier(0.55, 0, 0.25, 1.06);
export const cursorPos = (f: number, keys: Key[]) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const p = CURSOR_EASE(clamp((f - a.f) / (b.f - a.f)));
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      const sign = i % 2 ? -1 : 1;
      const cx = (a.x + b.x) / 2 - (dy / d) * d * 0.15 * sign;
      const cy = (a.y + b.y) / 2 + (dx / d) * d * 0.15 * sign;
      const u = 1 - p;
      return { f, x: u * u * a.x + 2 * u * p * cx + p * p * b.x, y: u * u * a.y + 2 * u * p * cy + p * p * b.y };
    }
  }
  return keys[keys.length - 1];
};
export const Cursor: React.FC<{ keys: Key[]; clicks?: number[]; opacity?: number }> = ({ keys, clicks = [], opacity = 1 }) => {
  const f = useCurrentFrame();
  const p = cursorPos(f, keys);
  const s = clicks.reduce((acc, c) => acc * (f >= c && f <= c + 8 ? 1 - 0.14 * Math.sin(((f - c) / 8) * Math.PI) : 1), 1);
  const last = clicks.filter((c) => f >= c).pop();
  const rp = last == null ? 1 : clamp((f - last) / 24);
  return (
    <div style={{ position: 'absolute', left: p.x, top: p.y, opacity }}>
      {rp < 1 && (
        <div style={{ position: 'absolute', left: -40 * (0.3 + rp), top: -40 * (0.3 + rp), width: 80 * (0.3 + rp), height: 80 * (0.3 + rp), borderRadius: '50%', border: `3px solid ${C.accHi}`, opacity: 1 - rp }} />
      )}
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: 'absolute', left: -6, top: -4, transform: `scale(${s})`, transformOrigin: '6px 4px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}>
        <path d="M6 4 L6 34 L14 26 L20 40 L26 37.5 L20 24 L32 24 Z" fill="#fff" stroke="#111" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ---------- counter: ~1 s, ease-out, never jumps ---------- */
export const fmt = (n: number) => (n >= 1000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace('.0', '') + 'K' : Math.round(n).toString());
export const countVal = (f: number, start: number, from: number, to: number, dur = 60) => lerp(from, to, prog(f, start, dur, OUT));

/* ---------- kinetic type ---------- */
export type Seg = { t: string; serif?: boolean; acc?: boolean; mut?: boolean };
export const Words: React.FC<{ segs: Seg[]; start: number; size: number; gap?: number; weight?: number; align?: 'center' | 'left'; width?: number; out?: number }> = ({ segs, start, size, gap = 4, weight = 700, align = 'center', width, out = 0 }) => {
  const f = useCurrentFrame();
  const words: { w: string; s: Seg }[] = [];
  segs.forEach((s) => s.t.split(' ').filter(Boolean).forEach((w) => words.push({ w, s })));
  return (
    <div style={{ width, textAlign: align, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.035em', fontWeight: weight, fontFamily: FONT.sans, color: C.text, whiteSpace: width ? 'normal' : 'nowrap', opacity: 1 - out }}>
      {words.map(({ w, s }, i) => {
        const st = start + i * gap;
        const e = pop(f, st);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.24em',
              opacity: prog(f, st, 10),
              transform: `translateY(${(1 - e) * 0.5 * size}px)`,
              fontFamily: s.serif ? FONT.serif : undefined,
              fontStyle: s.serif ? 'italic' : undefined,
              fontWeight: s.serif ? 400 : undefined,
              fontSize: s.serif ? '1.16em' : undefined,
              letterSpacing: s.serif ? '-0.01em' : undefined,
              color: s.acc ? C.acc : s.mut ? C.mut : undefined,
              textShadow: s.acc ? '0 0 34px rgba(255,130,28,.45)' : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- small UI parts ---------- */
export const card = (w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 28,
  background: `linear-gradient(160deg, ${C.card2} 0%, ${C.card} 70%)`,
  border: `1px solid ${C.line}`,
  boxShadow: '0 40px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  position: 'relative',
  fontFamily: FONT.sans,
  color: C.text,
  ...extra,
});

/** check mark that draws itself */
export const Check: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 34, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 34 34">
    <circle cx="17" cy="17" r="16" fill={color} opacity={0.16 * clamp(p * 3)} />
    <circle cx="17" cy="17" r="15" fill="none" stroke={color} strokeWidth="2" pathLength={1} strokeDasharray={`${clamp(p * 1.6)} 1`} transform="rotate(-90 17 17)" />
    <path d="M10 17.5 L15 22 L24 12.5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${clamp(p * 2 - 0.6)} 1.01`} />
  </svg>
);

/** red ✕ stamp with a press */
export const Stamp: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const s = pop(f, at);
  if (f < at) return null;
  return (
    <div style={{ width: 84, height: 84, borderRadius: '50%', background: C.red, display: 'grid', placeItems: 'center', transform: `scale(${(1.5 - 0.5 * s) * press(f, at + 10)}) rotate(${(1 - s) * -30}deg)`, opacity: prog(f, at, 6), boxShadow: '0 12px 30px rgba(255,79,69,.45)' }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path d="M11 11 L29 29 M29 11 L11 29" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const rnd = (seed: string | number) => random(seed);

/** scene shell: short fade-in, ease-in exit (push through + fade) in the last frames */
export const Shell: React.FC<{ dur: number; children: React.ReactNode; exit?: number; noExit?: boolean }> = ({ dur, children, exit = 16, noExit }) => {
  const f = useCurrentFrame();
  const x = noExit ? 0 : exitP(f, dur - exit, exit);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: prog(f, 0, 8) * (1 - x), transform: `scale(${1 + 0.05 * x})`, filter: x > 0 ? `blur(${x * 10}px)` : undefined }}>
      {children}
    </div>
  );
};
