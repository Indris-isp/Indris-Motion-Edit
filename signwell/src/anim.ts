import {Easing, interpolate, spring} from 'remotion';

export const FPS = 60;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Easing library. Nothing in this video moves linearly.
export const easy = Easing.bezier(0.42, 0, 0.58, 1); // easy ease (camera, pans)
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1); // counters, settles
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0); // exits
export const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1); // entrances
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1); // fast in, long buttery settle
// pop: 0→1 over n frames with out-expo, for fast cascades
export const pop = (f: number, start: number, n = 14) => interpolate(f, [start, start + n], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
export const outCubic = Easing.bezier(0.33, 1, 0.68, 1); // fast start, long gentle settle
export const outQuint = Easing.bezier(0.22, 1, 0.36, 1);
export const inOutCubic = Easing.bezier(0.65, 0, 0.35, 1);
export const handMove = Easing.bezier(0.45, 0, 0.25, 1.06); // cursor: ease in/out, tiny overshoot

export const tween = (f: number, a: number, b: number, from: number, to: number, easing = easy) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing});

// ~0.5 s entrance with slight overshoot (spring, damping 14). Returns 0 → ~1.05 → 1.
export const enter = (f: number, start: number) =>
  spring({frame: f - start, fps: FPS, config: {damping: 17, stiffness: 300, mass: 0.85}, durationInFrames: 22});

// Exits: ~60% of an entrance (18 frames), ease-in. Returns 1 → 0.
export const exit = (f: number, start: number, dur = 18) => tween(f, start, start + dur, 1, 0, easeIn);

// Click press: scale 1 → 0.96 → 1 over 8 frames.
export const press = (f: number, at: number) =>
  interpolate(f, [at, at + 3, at + 8], [1, 0.96, 1], clamp);

// Golden rule: holding elements keep drifting.
export const drift = (f: number, amp = 4, period = 240, phase = 0) =>
  Math.sin(((f + phase) / period) * Math.PI * 2) * amp;

export type Pt = {x: number; y: number};

// Quadratic bezier between two points, control offset perpendicular by `bend` of the distance.
export const arc = (a: Pt, b: Pt, t: number, bend = 0.15): Pt => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const c = {x: (a.x + b.x) / 2 - (dy / d) * d * bend, y: (a.y + b.y) / 2 + (dx / d) * d * bend};
  const u = 1 - t;
  return {x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y};
};

// Piecewise path along arcs. moves: [{a, b, to}] in frame order.
export type Move = {a: number; b: number; to: Pt; bend?: number};
export const pathAt = (f: number, start: Pt, moves: Move[], easing = handMove): Pt => {
  let p = start;
  for (const m of moves) {
    if (f <= m.a) return p;
    const t = interpolate(f, [m.a, m.b], [0, 1], {...clamp, easing});
    if (f < m.b) return arc(p, m.to, t, m.bend ?? 0.15);
    p = m.to;
  }
  return p;
};
