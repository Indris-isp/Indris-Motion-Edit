import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../config";
import { drift } from "../anim";

/** Places a child with its center at (x, y) relative to the canvas center. */
export const At: React.FC<{ x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  x = 0, y = 0, style, children,
}) => (
  <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`, ...style }}>
    {children}
  </div>
);

/** One camera per scene: scale around the canvas center, then center the world point (x, y). Always a micro-push. */
export const Camera: React.FC<{ f: number; scale?: number; x?: number; y?: number; push?: number; children: React.ReactNode }> = ({
  f, scale = 1, x = 0, y = 0, push = 0.00012, children,
}) => (
  <AbsoluteFill style={{ transform: `scale(${scale * (1 + push * f)}) translate(${-x}px, ${-y}px)`, transformOrigin: "50% 50%" }}>
    {children}
  </AbsoluteFill>
);

/** Charcoal ground with a slow pink glow and a parallax dot grid. warm: 0 (tense, cool) → 1 (warm). */
export const Background: React.FC<{ f: number; warm?: number; parallax?: number }> = ({ f, warm = 0, parallax = 0 }) => {
  const gx = drift(f, 20, 900) - parallax * 0.15;
  const gy = drift(f, 14, 1100, 1);
  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.line} 1.2px, transparent 1.2px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${gx}px ${gy}px`,
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 45% at ${50 + drift(f, 4, 700)}% ${55 + drift(f, 3, 800, 2)}%, rgba(255,61,127,${0.05 + 0.13 * warm}), transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const sans = (weight: number, size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONTS.sans, fontWeight: weight, fontSize: size, color: COLORS.ink, ...extra,
});
