// Effects library for storyboard v4 (FX01–FX17), adapted from the reference launch films.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONTS } from "../config";
import { drift, easeIn, enter, tw } from "../anim";

export type Accent = "pink" | "purple" | "lime";

/* ---------- FX02 · Defocus headline ---------- */
export const Headline: React.FC<{
  f: number;
  start: number;
  lines: string[][];
  accentLine?: number;
  accent?: Accent;
  size?: number;
  offset?: number;
  exitAt?: number;
  align?: "center" | "left";
  color?: string;
  lineHeight?: number;
}> = ({ f, start, lines, accentLine, accent = "purple", size = 120, offset = 3, exitAt, align = "center", color = COLORS.text, lineHeight = 1.02 }) => {
  let i = 0;
  const e = exitAt !== undefined ? tw(f, exitAt, exitAt + 18, 0, 1, easeIn) : 0;
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start",
        opacity: 1 - e, filter: e > 0.01 ? `blur(${e * 16}px)` : undefined, transform: `scale(${1 + 0.05 * e})`,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{ display: "flex", gap: size * 0.24, whiteSpace: "nowrap" }}>
          {words.map((w) => {
            const p = enter(f, start + offset * i++);
            const blur = Math.max(0, (1 - p) * 14);
            return (
              <span
                key={li + w + i}
                style={{
                  display: "inline-block", fontFamily: FONTS.sans, fontWeight: 700, fontSize: size, lineHeight,
                  letterSpacing: "-0.04em", color: li === accentLine ? COLORS[accent] : color,
                  opacity: Math.min(1, Math.max(0, p * 1.4)), filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
                  transform: `translateY(${(1 - p) * size * 0.3}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- FX03 · Typewriter with caret (and FX10 inline nodes) ---------- */
export type Seg = { t: string; c?: string } | { node: React.ReactNode; w: number };
export const Typer: React.FC<{
  f: number;
  start: number;
  lines: Seg[][];
  size?: number;
  weight?: number;
  perChar?: number;
  color?: string;
  caretColor?: string;
  exitAt?: number;
  gap?: number;
}> = ({ f, start, lines, size = 90, weight = 700, perChar = 2, color = COLORS.text, caretColor, exitAt, gap = 0 }) => {
  const n = Math.max(0, Math.floor((f - start) / perChar));
  let total = 0;
  lines.forEach((l) => l.forEach((s) => { total += "t" in s ? s.t.length : s.w; }));
  const typing = n > 0 && n < total;
  const blinkOn = typing || Math.floor(f / 18) % 2 === 0;
  const e = exitAt !== undefined ? tw(f, exitAt, exitAt + 18, 0, 1, easeIn) : 0;
  const caret = (
    <span style={{ position: "relative", width: 0, display: "inline-block" }}>
      <span style={{ position: "absolute", left: size * 0.03, top: size * 0.08, width: Math.max(3, size * 0.045), height: size * 1.0, background: caretColor ?? COLORS.purple, opacity: blinkOn && f >= start ? 1 : 0, borderRadius: 2 }} />
    </span>
  );
  let k = 0;
  let caretPlaced = false;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap, opacity: 1 - e, filter: e > 0.01 ? `blur(${e * 16}px)` : undefined, transform: `scale(${1 + 0.05 * e})` }}>
      {lines.map((segs, li) => (
        <div key={li} style={{ display: "flex", alignItems: "center", whiteSpace: "pre", fontFamily: FONTS.sans, fontWeight: weight, fontSize: size, letterSpacing: "-0.04em", lineHeight: 1.1, color }}>
          {segs.map((s, si) => {
            if ("node" in s) {
              const at = k;
              k += s.w;
              const p = enter(f, start + at * perChar);
              const out: React.ReactNode[] = [];
              if (!caretPlaced && n <= at) { out.push(<React.Fragment key="c">{caret}</React.Fragment>); caretPlaced = true; }
              out.push(<span key="n" style={{ display: "inline-block", opacity: n > at ? Math.min(1, p * 1.5) : 0, transform: `scale(${0.6 + 0.4 * Math.min(1.05, p)})`, margin: `0 ${size * 0.12}px` }}>{s.node}</span>);
              return <React.Fragment key={si}>{out}</React.Fragment>;
            }
            return (
              <React.Fragment key={si}>
                {s.t.split("").map((ch, ci) => {
                  const idx = k++;
                  const parts: React.ReactNode[] = [];
                  if (!caretPlaced && idx === n) { parts.push(<React.Fragment key="c">{caret}</React.Fragment>); caretPlaced = true; }
                  parts.push(<span key="ch" style={{ color: s.c ?? color, opacity: idx < n ? 1 : 0 }}>{ch}</span>);
                  return <React.Fragment key={ci}>{parts}</React.Fragment>;
                })}
                {li === lines.length - 1 && si === segs.length - 1 && !caretPlaced ? caret : null}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- People ---------- */
export const PEOPLE: { n: string; h: number }[] = [
  { n: "Maya", h: 330 }, { n: "Jon", h: 210 }, { n: "Ana", h: 20 }, { n: "Lee", h: 265 }, { n: "Sam", h: 150 },
  { n: "Ivy", h: 290 }, { n: "Raj", h: 40 }, { n: "Noa", h: 190 }, { n: "Eli", h: 350 }, { n: "Kim", h: 240 },
  { n: "Tom", h: 100 }, { n: "Zoe", h: 310 },
];

/** Stylised person avatar (head and shoulders), so no stock photos are needed. grey=true for the desaturated wall. */
export const Avatar: React.FC<{ i: number; size: number; grey?: number; ring?: boolean }> = ({ i, size, grey = 0, ring = true }) => {
  const h = PEOPLE[i % PEOPLE.length].h;
  const skin = ["#F2C9A9", "#D9A27C", "#B97D57", "#8D5A3B", "#F5D6BF"][i % 5];
  const hair = ["#2B1D16", "#5A3A22", "#C98A3D", "#1B1B1B", "#7A4B2A", "#B44A2C"][i % 6];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", position: "relative", filter: grey > 0 ? `grayscale(${grey}) contrast(${1 - 0.15 * grey}) brightness(${1 + 0.08 * grey})` : undefined, boxShadow: ring ? "0 0 0 3px #fff, 0 8px 20px rgba(17,24,39,.16)" : undefined, background: `linear-gradient(160deg, hsl(${h},70%,86%), hsl(${h + 25},62%,70%))` }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <path d="M14 104 C16 74 32 64 50 64 C68 64 84 74 86 104 Z" fill={`hsl(${(h + 180) % 360},45%,${i % 2 ? 40 : 58}%)`} />
        <rect x="43" y="52" width="14" height="16" rx="6" fill={skin} />
        <ellipse cx="50" cy="42" rx="17" ry="20" fill={skin} />
        <path d={i % 3 === 0 ? "M31 42 C30 20 70 18 69 42 C66 30 56 27 50 27 C42 27 34 31 31 42 Z" : i % 3 === 1 ? "M32 38 C34 22 66 20 68 38 C64 32 40 32 32 38 Z" : "M30 46 C26 18 74 16 70 50 C70 40 66 30 50 29 C36 30 32 38 30 46 Z"} fill={hair} />
      </svg>
    </div>
  );
};

export const AvatarStack: React.FC<{ n: number; size: number; from?: number }> = ({ n, size, from = 0 }) => (
  <div style={{ display: "inline-flex" }}>
    {Array.from({ length: n }, (_, k) => (
      <div key={k} style={{ marginLeft: k ? -size * 0.3 : 0 }}><Avatar i={from + k} size={size} /></div>
    ))}
  </div>
);

/** Tiny speech-bubble label used with floating avatars (FX05). */
export const Bubble: React.FC<{ text: string; dark?: boolean; size?: number }> = ({ text, dark, size = 17 }) => (
  <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: size, color: dark ? "#fff" : COLORS.text, background: dark ? COLORS.paperInk : "#fff", padding: `${size * 0.4}px ${size * 0.75}px`, borderRadius: size, borderBottomLeftRadius: 4, boxShadow: "0 6px 18px rgba(17,24,39,.12)", whiteSpace: "nowrap" }}>{text}</div>
);

/** Notification-style badge (FX07). */
export const Badge: React.FC<{ text: string; color?: string; size?: number; tilt?: number }> = ({ text, color = COLORS.pink, size = 22, tilt = 0 }) => (
  <div style={{ display: "inline-block", fontFamily: FONTS.sans, fontWeight: 700, fontSize: size, color: "#fff", background: color, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 999, transform: `rotate(${tilt}deg)`, boxShadow: `0 8px 20px ${color}55`, whiteSpace: "nowrap" }}>{text}</div>
);

export const Chip: React.FC<{ text: string; tone: "pink" | "purple" | "white" }> = ({ text, tone }) => {
  const c = tone === "pink" ? { bg: "#FFE1EC", fg: "#D3145F" } : tone === "purple" ? { bg: "#ECE2FF", fg: "#6A2EE0" } : { bg: "rgba(255,255,255,.18)", fg: "#fff" };
  return <div style={{ display: "inline-block", fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, fontSize: 20, letterSpacing: "0.1em", color: c.fg, background: c.bg, padding: "9px 16px", borderRadius: 8 }}>{text}</div>;
};

/** Concentric pulsing rings behind a headline (FX05). */
export const Rings: React.FC<{ f: number; opacity?: number }> = ({ f, opacity = 1 }) => (
  <AbsoluteFill style={{ opacity }}>
    {[0, 1, 2, 3].map((k) => {
      const r = 260 + k * 150 + 20 * Math.sin(f / 40 + k);
      return <div key={k} style={{ position: "absolute", left: 960 - r, top: 540 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `1.5px solid rgba(122,51,239,${0.16 - k * 0.03})`, background: k === 0 ? "radial-gradient(circle, rgba(142,66,255,.07), transparent 70%)" : undefined }} />;
    })}
  </AbsoluteFill>
);

/* ---------- Directional motion blur (FX11/FX17) ---------- */
export const MotionBlurDefs: React.FC<{ id: string; x: number; y?: number }> = ({ id, x, y = 0 }) => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={`${Math.max(0.01, x)} ${Math.max(0.01, y)}`} />
      </filter>
    </defs>
  </svg>
);
export const mb = (id: string, amount: number) => (amount > 0.6 ? `url(#${id})` : undefined);

/** Whip transition helper: returns x offset and blur amount for a fast horizontal slide. dir = -1 to the left. */
export const whip = (f: number, f0: number, dur: number, dist: number, mode: "in" | "out") => {
  const t = mode === "out" ? tw(f, f0, f0 + dur, 0, 1, easeIn) : 1 - tw(f, f0, f0 + dur, 0, 1, (x) => 1 - Math.pow(1 - x, 3));
  const v = Math.sin(Math.PI * Math.min(1, Math.max(0, mode === "out" ? t : 1 - t))) * 0.5 + (mode === "out" ? t : 1 - t) * 0.5;
  return { x: dist * t, blur: 60 * v * (t > 0.001 && t < 0.999 ? 1 : 0) };
};

/* ---------- 3D laptop (FX11) ---------- */
export const Laptop: React.FC<{ rx: number; ry: number; children: React.ReactNode }> = ({ rx, ry, children }) => {
  const W = 1100, Hs = 690;
  return (
    <div style={{ perspective: 2600 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        <div style={{ width: W, height: Hs, borderRadius: 30, background: "#0E0F11", padding: 22, boxSizing: "border-box", boxShadow: "inset 0 0 0 2px #2A2C31, 0 40px 80px rgba(17,24,39,.25)", position: "relative" }}>
          <div style={{ position: "absolute", left: W / 2 - 70, top: 0, width: 140, height: 20, borderRadius: "0 0 12px 12px", background: "#0E0F11", zIndex: 3 }} />
          <div style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", background: "#fff", position: "relative" }}>{children}</div>
        </div>
        <div style={{ width: W * 1.16, height: 420, marginLeft: -W * 0.08, transformOrigin: "top center", transform: "rotateX(84deg)", borderRadius: "0 0 34px 34px", background: "linear-gradient(180deg,#D9DBDF,#C3C6CC)", boxShadow: "inset 0 3px 0 #EEF0F2", position: "relative" }}>
          <div style={{ position: "absolute", left: "12%", right: "12%", top: 30, height: 200, borderRadius: 10, background: "repeating-linear-gradient(90deg,#2B2D31 0 52px,#C3C6CC 52px 58px)", opacity: 0.85 }} />
          <div style={{ position: "absolute", left: "36%", right: "36%", top: 250, height: 130, borderRadius: 12, background: "#CDD0D5", boxShadow: "inset 0 0 0 2px #BFC2C8" }} />
        </div>
      </div>
    </div>
  );
};

/* ---------- Simple line icons for tiles ---------- */
const P: Record<string, string> = {
  pen: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  news: "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7 9h7M7 13h7M7 16h4",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4",
  palette: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8zM7.5 11h.01M10 7h.01M15 7h.01",
  video: "M3 6h12v12H3zM15 10l6-3v10l-6-3",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 3a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
};
export const Icon: React.FC<{ name: keyof typeof P | string; size: number; color?: string; stroke?: number }> = ({ name, size, color = COLORS.text, stroke = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d={P[name] ?? ""} /></svg>
);

/** Rounded bento tile (FX06). */
export const Tile: React.FC<{ size: number; filled?: boolean; children?: React.ReactNode; bg?: string }> = ({ size, filled, children, bg }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.24, display: "grid", placeItems: "center", boxSizing: "border-box",
      background: filled ? bg ?? "#fff" : "rgba(255,255,255,.35)", border: filled ? "none" : "2px dashed rgba(100,116,139,.25)",
      boxShadow: filled ? "0 10px 28px rgba(17,24,39,.10), 0 0 0 1px rgba(17,24,39,.04)" : undefined,
    }}
  >
    {children}
  </div>
);

/** Floating wrapper: slow parallax drift so nothing ever stops. */
export const Float: React.FC<{ f: number; seed: number; amp?: number; children: React.ReactNode }> = ({ f, seed, amp = 8, children }) => (
  <div style={{ transform: `translate(${drift(f, amp, 300 + seed * 37, seed)}px, ${drift(f, amp, 260 + seed * 29, seed + 1)}px)` }}>{children}</div>
);
