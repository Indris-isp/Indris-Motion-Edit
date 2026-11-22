import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./config";

export const easyEase = Easing.bezier(0.42, 0, 0.58, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.75, 0.2);
export const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Clamped tween between two frames. */
export const tw = (f: number, f0: number, f1: number, v0: number, v1: number, easing = easyEase) =>
  interpolate(f, [f0, f1], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** ~0.5 s entrance with slight overshoot (spring, damping 14). Returns 0 → 1 (may exceed 1 briefly). */
export const enter = (f: number, start: number) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 14, stiffness: 150, mass: 1 }, durationInFrames: 30 });

/** Exit: 60% of the entrance (18 frames), ease-in. Returns 1 → 0. */
export const exit = (f: number, start: number, dur = 18) => tw(f, start, start + dur, 1, 0, easeIn);

/** Click press: scale 1 → 0.96 → 1 over 8 frames. */
export const press = (f: number, at: number, depth = 0.04) => {
  if (f < at || f > at + 8) return 1;
  const t = (f - at) / 8;
  return 1 - depth * Math.sin(Math.PI * t);
};

/** Golden rule: nothing fully stops. Slow sinusoidal drift. */
export const drift = (f: number, amp = 4, period = 240, phase = 0) =>
  amp * Math.sin((2 * Math.PI * f) / period + phase);

/** Count-up over ~1 s, ease-out. */
export const count = (f: number, start: number, from: number, to: number, dur = 60) =>
  Math.round(tw(f, start, start + dur, from, to, easeOut));

export const fmt = (n: number) => n.toLocaleString("en-US");
