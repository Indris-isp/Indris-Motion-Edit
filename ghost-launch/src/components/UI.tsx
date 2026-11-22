import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, FONTS } from "../config";
import { sans } from "./Stage";

/** Generic app window (SVG-sharp: pure vector DOM, no bitmaps). */
export const Window: React.FC<{ title: string; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode; accent?: boolean }> = ({
  title, w, h, style, children, accent,
}) => (
  <div
    style={{
      width: w, height: h, borderRadius: 18, background: COLORS.panel, border: `2px solid ${accent ? COLORS.pink : COLORS.line}`,
      boxShadow: "0 30px 60px rgba(0,0,0,.45)", overflow: "hidden", display: "flex", flexDirection: "column", ...style,
    }}
  >
    <div style={{ height: 46, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: `1.5px solid ${COLORS.line}`, background: COLORS.bg2 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.line }} />)}
      <div style={sans(600, 17, { color: COLORS.mute, marginLeft: 10, letterSpacing: "0.02em" })}>{title}</div>
    </div>
    <div style={{ flex: 1, position: "relative" }}>{children}</div>
  </div>
);

export const Bar: React.FC<{ w: number | string; h?: number; c?: string; r?: number; style?: React.CSSProperties }> = ({ w, h = 12, c = COLORS.line, r = 6, style }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: c, ...style }} />
);

export const Pill: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({
  children, color = COLORS.ink, bg = COLORS.panel2, size = 18, style,
}) => (
  <div style={{ ...sans(600, size, { color }), background: bg, borderRadius: 999, padding: `${size * 0.42}px ${size * 0.9}px`, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

/** Social-feed post card (generic platform, no real brand). */
export const FeedCard: React.FC<{ mine?: boolean; seed: number; style?: React.CSSProperties }> = ({ mine, seed, style }) => {
  const tones = ["#3B4048", "#41464F", "#383C44", "#444851"];
  const t = tones[seed % tones.length];
  return (
    <div
      style={{
        width: 620, height: 220, borderRadius: 20, background: COLORS.panel, border: `2.5px solid ${mine ? COLORS.pink : COLORS.line}`,
        padding: 24, display: "flex", gap: 20, boxShadow: mine ? "0 0 60px rgba(255,61,127,.25)" : "0 20px 40px rgba(0,0,0,.35)", ...style,
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 28, background: mine ? COLORS.pink : t, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        {mine ? (
          <>
            <div style={sans(700, 22)}>You</div>
            <div style={sans(700, 30, { letterSpacing: "-0.03em", lineHeight: 1.1 })}>Why I started writing again</div>
            <Bar w="85%" />
            <Bar w="60%" />
          </>
        ) : (
          <>
            <Bar w={150 + (seed * 37) % 80} h={16} c={t} />
            <Bar w="92%" c={t} />
            <Bar w={`${55 + (seed * 13) % 35}%`} c={t} />
            <div style={{ display: "flex", gap: 14, marginTop: "auto" }}>
              <Bar w={70} h={70} r={12} c={t} />
              <Bar w={70} h={70} r={12} c={t} />
            </div>
          </>
        )}
        <div style={{ display: "flex", gap: 22, marginTop: mine ? "auto" : 0 }}>
          {["♡", "↻", "↗"].map((g) => <span key={g} style={sans(500, 18, { color: COLORS.faint })}>{g}</span>)}
        </div>
      </div>
    </div>
  );
};

/** Donut ring with an optional detachable slice (pct of the ring). */
export const Donut: React.FC<{ size: number; slicePct: number; sliceOffset?: { x: number; y: number; r: number }; sliceColor?: string; sliceOpacity?: number; ringColor?: string }> = ({
  size, slicePct, sliceOffset = { x: 0, y: 0, r: 0 }, sliceColor = COLORS.pink, sliceOpacity = 1, ringColor = COLORS.ink,
}) => {
  const r = 40, c = 2 * Math.PI * r, sw = 14;
  const main = c * (1 - slicePct / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke={COLORS.panel2} strokeWidth={sw} />
        <circle cx="50" cy="50" r={r} fill="none" stroke={ringColor} strokeWidth={sw} strokeDasharray={`${main} ${c}`} />
      </svg>
      <svg
        width={size} height={size} viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, transform: `translate(${sliceOffset.x}px, ${sliceOffset.y}px) rotate(${-90 + sliceOffset.r}deg)`, opacity: sliceOpacity, overflow: "visible" }}
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke={sliceColor} strokeWidth={sw} strokeDasharray={`${c * (slicePct / 100) - 1.2} ${c}`} strokeDashoffset={-main - 0.6} />
      </svg>
    </div>
  );
};

/** Official Ghost logo (white, from ghost.org). `reveal` 0..1 wipes it in from the left. */
export const GhostLogo: React.FC<{ width: number; reveal?: number }> = ({ width, reveal = 1 }) => (
  <Img
    src={staticFile("brand/ghost-logo-white.png")}
    style={{ width, height: width * (294 / 800), display: "block", clipPath: `inset(0 ${100 - reveal * 100}% 0 0)` }}
  />
);

/** Ghost orb mark (black artwork, inverted for dark UI). */
export const GhostOrb: React.FC<{ size: number; rotate?: number; dark?: boolean }> = ({ size, rotate = 0, dark = true }) => (
  <Img src={staticFile("brand/ghost-orb.png")} style={{ width: size, height: size, display: "block", filter: dark ? "invert(1)" : "none", transform: `rotate(${rotate}deg)` }} />
);
