import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TEAL_GRAD} from './config';

// ---------- easing ----------
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  hand: Easing.bezier(0.5, 0, 0.2, 1.06), // cursor: ease in/out with a tiny settle
};
export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const tw = (f: number, a: number, b: number, from = 0, to = 1, ease = E.out) =>
  interpolate(f, [a, b], [from, to], {...CL, easing: ease});

// ---------- layout: everything is positioned from the canvas center ----------
export const useLand = () => {
  const {width, height} = useVideoConfig();
  return width > height;
};
/** pick(landscapeValue, portraitValue) */
export const usePick = () => {
  const land = useLand();
  return <T,>(l: T, p: T): T => (land ? l : p);
};

export const At: React.FC<{x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  x = 0,
  y = 0,
  style,
  children,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: width / 2 + x, top: height / 2 + y, transform: 'translate(-50%,-50%)'}}>
      <div style={style}>{children}</div>
    </div>
  );
};

// ---------- entrances / exits ----------
export const EXIT = 12;
type AnimOpts = {dur?: number; dy?: number; dx?: number; s0?: number; exit?: number; blur?: number};
/** Overshoot entrance (~0.5 s) and a faster ease-in exit (60% of the entrance). */
export function anim(f: number, start: number, o: AnimOpts = {}): React.CSSProperties {
  const {dur = 30, dy = 40, dx = 0, s0 = 0.96, exit, blur = 8} = o;
  const p = interpolate(f, [start, start + dur], [0, 1], {...CL, easing: E.back});
  const op = interpolate(f, [start, start + dur * 0.4], [0, 1], {...CL, easing: E.out});
  let xs = 0;
  // exits are fast (12 frames, ease-in) and finish exactly on the cut when exit = sceneDur - EXIT
  if (exit !== undefined) xs = interpolate(f, [exit, exit + EXIT], [0, 1], {...CL, easing: E.in});
  const b = (1 - op) * blur + xs * blur * 0.6;
  return {
    opacity: op * (1 - xs),
    transform: `translate(${(1 - p) * dx}px,${(1 - p) * dy - xs * 24}px) scale(${s0 + (1 - s0) * p - xs * 0.04})`,
    filter: b > 0.05 ? `blur(${b}px)` : undefined,
  };
}

/** Click press: 1 → 0.96 → 1 over 8 frames. */
export const press = (f: number, at: number) =>
  f < at || f > at + 8 ? 1 : 1 - 0.04 * Math.sin(((f - at) / 8) * Math.PI);

export const gradText = (grad = TEAL_GRAD): React.CSSProperties => ({
  background: grad,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

// ---------- kinetic type ----------
export const Words: React.FC<{
  text: string; // '|' = line break
  start: number;
  size: number;
  color?: string;
  lineColors?: string[];
  accent?: string[];
  accentGrad?: boolean;
  accentColor?: string;
  exit?: number;
  stagger?: number;
  weight?: number;
  align?: 'center' | 'left';
  serif?: boolean;
  lh?: number;
  ls?: string;
}> = ({text, start, size, color = C.ink, lineColors, accent = [], accentGrad, accentColor = C.teal, exit, stagger = 3, weight = 700, align = 'center', serif, lh = 1.04, ls = '-0.045em'}) => {
  const f = useCurrentFrame();
  let i = 0;
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: serif ? 400 : weight,
        lineHeight: lh,
        letterSpacing: serif ? '-0.01em' : ls,
        textAlign: align,
        whiteSpace: 'nowrap',
        fontFamily: serif ? 'Serif' : 'Inter',
        fontStyle: serif ? 'italic' : 'normal',
      }}
    >
      {text.split('|').map((line, li) => (
        <div key={li}>
          {line.split(' ').map((w, wi) => {
            const k = i++;
            const isAcc = accent.includes(w);
            const st = anim(f, start + k * stagger, {dur: 26, dy: size * 0.4, s0: 1, exit, blur: 10});
            const col: React.CSSProperties = isAcc
              ? accentGrad
                ? gradText()
                : {color: accentColor}
              : {color: lineColors?.[li] ?? color};
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? ' ' : null}
                <span style={{display: 'inline-block', paddingBottom: '0.08em', ...col, ...st}}>{w}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- counter (~1 s, ease-out, never jumps in one frame) ----------
export const count = (f: number, start: number, to: number, dur = 60, from = 0) =>
  interpolate(f, [start, start + dur], [from, to], {...CL, easing: E.out});

// ---------- camera ----------
/**
 * One camera per scene. Always a micro push-in over the scene (nothing ever fully stops),
 * plus optional zoom keys [frame, zoom, focusX, focusY] eased in-out. The focus point
 * (offset from center, unzoomed) is pulled toward the center as the zoom grows.
 */
export const Camera: React.FC<{dur: number; push?: number; keys?: [number, number, number, number][]; children: React.ReactNode}> = ({
  dur,
  push = 0.04,
  keys,
  children,
}) => {
  const f = useCurrentFrame();
  let z = 1,
    fx = 0,
    fy = 0;
  if (keys && keys.length) {
    const fr = keys.map((k) => k[0]);
    const lerp = (idx: number) =>
      fr.length === 1 ? keys[0][idx] : interpolate(f, fr, keys.map((k) => k[idx]), {...CL, easing: E.inOut});
    z = lerp(1);
    fx = lerp(2);
    fy = lerp(3);
  }
  const tx = (-fx * (z - 1) * 2) / z;
  const ty = (-fy * (z - 1) * 2) / z;
  const micro = 1 + push * interpolate(f, [0, dur], [0, 1], {...CL, easing: Easing.bezier(0.3, 0, 0.7, 1)});
  return (
    <AbsoluteFill style={{transform: `scale(${micro}) scale(${z}) translate(${tx}px,${ty}px)`, transformOrigin: '50% 50%'}}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- backgrounds (light parallax drift) ----------
export const Bg: React.FC<{dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties}> = ({dark, children, style}) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 90) * 18,
    dy = Math.cos(f / 110) * 12;
  return (
    <AbsoluteFill style={{background: dark ? '#060A12' : '#EEF0F0', overflow: 'hidden', fontFamily: 'Inter', color: dark ? '#fff' : C.ink, ...style}}>
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px,${dy}px) scale(1.08)`,
          background: dark
            ? 'radial-gradient(ellipse 65% 62% at 50% 45%, #14324A 0%, #0B1626 48%, #060A12 100%)'
            : 'radial-gradient(ellipse 70% 62% at 50% 42%, #FFFFFF 0%, #F7F8F8 50%, #E8EBEB 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Glow: React.FC<{x?: number; y?: number; size: number; o?: number}> = ({x = 0, y = 0, size, o = 1}) => (
  <At x={x} y={y}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        opacity: o,
        background: 'radial-gradient(closest-side,rgba(22,166,174,.38),rgba(22,166,174,.11) 55%,rgba(22,166,174,0))',
      }}
    />
  </At>
);

// ---------- fox mark (placeholder vector; swap for the official SVG) ----------
const FACETS: [string, string][] = [
  ['22,8 78,62 40,92', 'url(#fx2)'],
  ['178,8 122,62 160,92', 'url(#fx2)'],
  ['36,24 66,60 46,78', '#0B1220'],
  ['164,24 134,60 154,78', '#0B1220'],
  ['40,92 78,62 122,62 160,92 150,128 100,190 50,128', 'url(#fx1)'],
  ['78,62 122,62 100,104', '#2C3E54'],
  ['50,128 100,190 100,140 72,122', '#162232'],
  ['150,128 100,190 100,140 128,122', '#1E2C3E'],
  ['88,168 112,168 100,190', '#05080E'],
];
export const Fox: React.FC<{size: number; start: number; ignite: number; stagger?: number; exit?: number}> = ({size, start, ignite, stagger = 2, exit}) => {
  const f = useCurrentFrame();
  const eye = tw(f, ignite, ignite + 14, 0, 1, E.out);
  const flare = interpolate(f, [ignite, ignite + 6, ignite + 30], [0, 1, 0.35], CL);
  const xs = exit !== undefined ? tw(f, exit, exit + 10, 0, 1, E.in) : 0;
  const id = React.useId().replace(/:/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{overflow: 'visible', opacity: 1 - xs, filter: `drop-shadow(0 0 ${20 + 40 * flare}px rgba(63,224,232,${0.15 + 0.35 * eye})) drop-shadow(0 30px 40px rgba(0,0,0,.45))`}}
    >
      <defs>
        <linearGradient id="fx1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A4E66" />
          <stop offset="1" stopColor="#0F1A28" />
        </linearGradient>
        <linearGradient id="fx2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#506A86" />
          <stop offset="1" stopColor="#1B2A3C" />
        </linearGradient>
        <radialGradient id={`eye${id}`}>
          <stop offset="0" stopColor="#E8FFFF" />
          <stop offset=".35" stopColor="#3FE0E8" />
          <stop offset="1" stopColor="#3FE0E8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {FACETS.map(([pts, fill], i) => {
        const p = tw(f, start + i * stagger, start + i * stagger + 22, 0, 1, E.back);
        const o = tw(f, start + i * stagger, start + i * stagger + 10);
        return (
          <polygon key={i} points={pts} fill={fill} opacity={o} style={{transformOrigin: '100px 100px', transform: `scale(${0.7 + 0.3 * p}) translateY(${(1 - p) * 14}px)`}} />
        );
      })}
      <polyline points="40,92 78,62 122,62 160,92" fill="none" stroke="#3FE0E8" strokeOpacity={0.35 * eye} strokeWidth={1.5} />
      <g opacity={eye}>
        <polygon points="56,100 86,108 64,118" fill="#3FE0E8" />
        <polygon points="144,100 114,108 136,118" fill="#3FE0E8" />
        <circle cx="70" cy="109" r={16 + 10 * flare} fill={`url(#eye${id})`} />
        <circle cx="130" cy="109" r={16 + 10 * flare} fill={`url(#eye${id})`} />
      </g>
    </svg>
  );
};

// ---------- cursor: arcs like a real hand ----------
export const Cursor: React.FC<{from: [number, number]; to: [number, number]; start: number; dur: number; click: number}> = ({from, to, start, dur, click}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = interpolate(f, [start, start + dur], [0, 1], {...CL, easing: E.hand});
  const [x0, y0] = from,
    [x1, y1] = to;
  const dx = x1 - x0,
    dy = y1 - y0,
    d = Math.hypot(dx, dy);
  const cx = (x0 + x1) / 2 + (-dy / d) * d * 0.15,
    cy = (y0 + y1) / 2 + (dx / d) * d * 0.15;
  const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1;
  const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
  const s = f >= click && f <= click + 8 ? 1 - 0.12 * Math.sin(((f - click) / 8) * Math.PI) : 1;
  const o = tw(f, start, start + 8);
  return (
    <div style={{position: 'absolute', left: width / 2 + x, top: height / 2 + y, opacity: o, transform: `scale(${s})`, transformOrigin: '6px 4px'}}>
      <svg width="54" height="62" viewBox="0 0 27 31" style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))'}}>
        <path d="M2 2 L2 25 L8 19.5 L12.5 29 L16.5 27.2 L12 18 L20 18 Z" fill="#fff" stroke="#0B1220" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Chip: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 28, style}) => (
  <span
    style={{
      display: 'inline-block',
      padding: `${size * 0.45}px ${size * 0.95}px`,
      borderRadius: 999,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '.08em',
      background: C.tealSoft,
      color: C.teal,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);
