import React from "react";
import { AbsoluteFill, getInputProps } from "remotion";
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

/** Background variant for client review: "soft" (current), "A" smoke, "B" spotlight. Set via --props or BG in config. */
export const BG_VARIANT = (): "soft" | "A" | "B" => ((getInputProps() as { bg?: string }).bg as "soft" | "A" | "B") ?? "soft";

const mix = (a: number[], b: number[], t: number) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * White-and-black gradient ground (client direction): soft black/charcoal washes drifting over white.
 * Soft colour washes drift slowly over a white base, so nothing ever fully stops.
 */
export const Background: React.FC<{ f: number; warm?: number; parallax?: number; bars?: number }> = ({ f, warm = 0, parallax = 0, bars = 0.6 }) => {
  const w = Math.max(0, Math.min(1, warm));
  const base2 = mix([244, 244, 245], [245, 245, 247], w); // soft grey-white
  const blobA = mix([17, 18, 20], [17, 18, 20], w); // black wash
  const blobB = mix([40, 42, 46], [40, 42, 46], w); // charcoal wash
  const blobC = mix([120, 124, 132], [120, 124, 132], w); // grey wash
  const ax = 18 + drift(f, 8, 900), ay = 16 + drift(f, 6, 1100, 1);
  const bx = 84 + drift(f, 7, 1000, 2), by = 82 + drift(f, 6, 950, 3);
  const cx = 78 + drift(f, 9, 1300, 4), cy = 14 + drift(f, 5, 1200, 5);
  const gx = drift(f, 20, 900) - parallax * 0.15;
  const gy = drift(f, 14, 1100, 1);
  const variant = BG_VARIANT();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${135 + drift(f, 6, 1400)}deg, #FFFFFF 0%, ${rgba(base2, 1)} 60%, #FFFFFF 100%)`, overflow: "hidden" }}>
      {variant === "A" && (
        /* Option A · smoke: strong black clouds drifting in from corners and edges, white centre */
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(ellipse 48% 55% at ${4 + drift(f, 6, 900)}% ${6 + drift(f, 5, 1100, 1)}%, rgba(10,11,13,0.78), transparent 70%)`,
              `radial-gradient(ellipse 52% 50% at ${97 + drift(f, 6, 1000, 2)}% ${96 + drift(f, 5, 950, 3)}%, rgba(10,11,13,0.82), transparent 70%)`,
              `radial-gradient(ellipse 34% 38% at ${96 + drift(f, 7, 1300, 4)}% ${4 + drift(f, 5, 1200, 5)}%, rgba(30,32,36,0.55), transparent 70%)`,
              `radial-gradient(ellipse 30% 34% at ${3 + drift(f, 7, 1250, 6)}% ${97 + drift(f, 5, 1150, 7)}%, rgba(30,32,36,0.5), transparent 70%)`,
            ].join(", "),
          }}
        />
      )}
      {variant === "B" && (
        /* Option B · spotlight: bright white centre falling off to deep black at the edges */
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${78 + drift(f, 3, 900)}% ${82 + drift(f, 3, 1100, 1)}% at ${50 + drift(f, 3, 1300)}% ${46 + drift(f, 2, 1000, 2)}%, rgba(255,255,255,0) 38%, rgba(60,62,66,0.55) 68%, rgba(8,9,11,0.96) 100%)`,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(ellipse 55% 60% at ${ax}% ${ay}%, ${rgba(blobA, 0.16)}, transparent 70%)`,
            `radial-gradient(ellipse 60% 55% at ${bx}% ${by}%, ${rgba(blobB, 0.2)}, transparent 70%)`,
            `radial-gradient(ellipse 42% 40% at ${cx}% ${cy}%, ${rgba(blobC, 0.18 + 0.1 * w)}, transparent 70%)`,
          ].join(", "),
        }}
      />
      {/* FX01 light bars glowing up from the bottom edge */}
      {bars > 0 && (
        <AbsoluteFill style={{ opacity: bars * 0.55, filter: "blur(46px)" }}>
          {Array.from({ length: 16 }, (_, k) => {
            const hgt = 180 + 160 * (0.5 + 0.5 * Math.sin(k * 1.7 + f / 70)) + 80 * Math.sin(k * 0.6);
            const c = k % 3 === 0 ? rgba(blobA, 0.55) : k % 3 === 1 ? rgba(blobB, 0.5) : rgba(blobC, 0.35 + 0.2 * w);
            return <div key={k} style={{ position: "absolute", bottom: -40, left: 40 + k * 118 + drift(f, 10, 500, k), width: 110 + (k % 4) * 20, height: hgt * 0.85, borderRadius: 60, background: `linear-gradient(0deg, ${c}, transparent)` }} />;
          })}
        </AbsoluteFill>
      )}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(17,34,32,0.09) 1.2px, transparent 1.2px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${gx}px ${gy}px`,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const sans = (weight: number, size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONTS.sans, fontWeight: weight, fontSize: size, color: COLORS.ink, ...extra,
});
