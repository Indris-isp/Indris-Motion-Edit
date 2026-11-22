import React from "react";
import { interpolate } from "remotion";
import { easyEase, overshoot } from "../anim";

export type CursorKey = { f: number; x: number; y: number; click?: boolean };

/** Position along arcs between keys: quadratic bezier with control point offset ~15% of the distance. */
export const cursorPos = (f: number, keys: CursorKey[]) => {
  if (f <= keys[0].f) return { x: keys[0].x, y: keys[0].y };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f >= a.f && f <= b.f) {
      const raw = (f - a.f) / (b.f - a.f);
      // ease in and out for most of the trip, settle with a tiny overshoot at the end
      const t = raw < 0.85 ? easyEase(raw / 0.85) * 0.97 : 0.97 + 0.03 * overshoot((raw - 0.85) / 0.15);
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const cx = (a.x + b.x) / 2 - (dy / d) * d * 0.15;
      const cy = (a.y + b.y) / 2 + (dx / d) * d * 0.15;
      const u = 1 - t;
      return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
    }
  }
  const l = keys[keys.length - 1];
  return { x: l.x, y: l.y };
};

/** Cursor drawn in world space (inside the scene camera). Clicks press the arrow. */
export const Cursor: React.FC<{ f: number; keys: CursorKey[]; opacity?: number; scale?: number }> = ({ f, keys, opacity = 1, scale = 1 }) => {
  const { x, y } = cursorPos(f, keys);
  let s = 1;
  let ring = 0;
  for (const k of keys) {
    if (k.click && f >= k.f && f <= k.f + 8) s = 1 - 0.14 * Math.sin((Math.PI * (f - k.f)) / 8);
    if (k.click && f >= k.f && f <= k.f + 22) ring = (f - k.f) / 22;
  }
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(${x}px, ${y}px)`, opacity, zIndex: 50 }}>
      {ring > 0 && (
        <div
          style={{
            position: "absolute", left: -30 * scale, top: -30 * scale, width: 60 * scale, height: 60 * scale, borderRadius: "50%",
            border: `${3 * scale}px solid rgba(255,61,127,${interpolate(ring, [0, 1], [0.8, 0])})`,
            transform: `scale(${0.4 + ring})`,
          }}
        />
      )}
      <svg width={34 * scale} height={42 * scale} viewBox="0 0 34 42" style={{ transform: `scale(${s})`, transformOrigin: "4px 3px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.5))" }}>
        <path d="M3 2 L3 33 L11 26 L17 39 L23 36 L17 23 L28 23 Z" fill="#FFFFFF" stroke="#15171A" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
