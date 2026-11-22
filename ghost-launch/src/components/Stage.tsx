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

const mix = (a: number[], b: number[], t: number) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * Animated gradient ground in Ghost colors. warm: 0 = problem (pink/magenta, tense), 1 = Ghost (purple + lime).
 * Three soft colour fields drift slowly over a dark diagonal base, so nothing ever fully stops.
 */
export const Background: React.FC<{ f: number; warm?: number; parallax?: number }> = ({ f, warm = 0, parallax = 0 }) => {
  const w = Math.max(0, Math.min(1, warm));
  const base1 = mix([24, 14, 22], [16, 14, 32], w); // deep wine → deep indigo
  const base2 = mix([14, 15, 18], [12, 14, 22], w);
  const blobA = mix([255, 36, 125], [142, 66, 255], w); // pink → purple
  const blobB = mix([142, 30, 90], [255, 36, 125], w); // magenta → pink
  const blobC = mix([90, 40, 160], [209, 255, 25], w); // violet → lime
  const ax = 22 + drift(f, 8, 900), ay = 20 + drift(f, 6, 1100, 1);
  const bx = 80 + drift(f, 7, 1000, 2), by = 78 + drift(f, 6, 950, 3);
  const cx = 70 + drift(f, 9, 1300, 4), cy = 18 + drift(f, 5, 1200, 5);
  const gx = drift(f, 20, 900) - parallax * 0.15;
  const gy = drift(f, 14, 1100, 1);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${135 + drift(f, 6, 1400)}deg, ${rgba(base1, 1)} 0%, ${rgba(base2, 1)} 55%, ${rgba(base1, 1)} 100%)`, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(ellipse 55% 60% at ${ax}% ${ay}%, ${rgba(blobA, 0.34)}, transparent 70%)`,
            `radial-gradient(ellipse 60% 55% at ${bx}% ${by}%, ${rgba(blobB, 0.3)}, transparent 70%)`,
            `radial-gradient(ellipse 40% 38% at ${cx}% ${cy}%, ${rgba(blobC, 0.1 + 0.06 * w)}, transparent 70%)`,
          ].join(", "),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.07) 1.2px, transparent 1.2px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${gx}px ${gy}px`,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

export const sans = (weight: number, size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONTS.sans, fontWeight: weight, fontSize: size, color: COLORS.ink, ...extra,
});
