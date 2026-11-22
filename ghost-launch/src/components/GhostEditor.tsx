import React from "react";
import { COLORS, COPY, FONTS } from "../config";
import { Bar } from "./UI";
import { sans } from "./Stage";

export const ED_W = 1280;
export const ED_H = 720;
// Button center relative to the editor center (for camera + cursor targeting)
export const BTN = { x: ED_W / 2 - 150, y: -ED_H / 2 + 38 };

/** Vector rebuild of a Ghost-style post editor. */
export const GhostEditor: React.FC<{ typed: number; body: number[]; btnScale: number; btnDone: number; caret: boolean }> = ({ typed, body, btnScale, btnDone, caret }) => {
  const title = COPY.fix.postTitle.slice(0, typed);
  return (
    <div style={{ width: ED_W, height: ED_H, borderRadius: 22, background: "#FBFBFA", overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.55)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 76, display: "flex", alignItems: "center", padding: "0 30px", gap: 18, borderBottom: "1.5px solid #ECECEA" }}>
        <div style={sans(600, 20, { color: "#15171A" })}>‹ Posts</div>
        <div style={sans(500, 18, { color: "#8B8F96" })}>Draft · Saved</div>
        <div style={{ flex: 1 }} />
        <div style={sans(600, 19, { color: "#5A5E66" })}>Preview</div>
        <div
          style={{
            ...sans(700, 20, { color: "#fff" }), background: btnDone ? COLORS.green : COLORS.pink, borderRadius: 10, padding: "12px 24px",
            transform: `scale(${btnScale})`, boxShadow: "0 8px 20px rgba(255,61,127,.35)", minWidth: 180, textAlign: "center",
          }}
        >
          {btnDone ? "✓ Sent" : COPY.fix.button}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", paddingTop: 44 }}>
        <div style={{ width: 760, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ height: 150, borderRadius: 14, background: "linear-gradient(135deg,#F1D7E0,#E9E2EC 50%,#DDE6EC)", position: "relative", overflow: "hidden" }}>
            <svg viewBox="0 0 760 150" width="760" height="150" style={{ position: "absolute", inset: 0 }}>
              <path d="M0 120 L140 70 L260 110 L400 50 L560 100 L760 60 L760 150 L0 150 Z" fill="#E3C4D1" />
              <circle cx="640" cy="44" r="22" fill="#FF3D7F" opacity=".55" />
            </svg>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 64, lineHeight: 1.05, color: "#15171A", minHeight: 68, letterSpacing: "-0.01em" }}>
            {title}
            {caret && <span style={{ display: "inline-block", width: 3, height: 56, background: COLORS.pink, marginLeft: 4, verticalAlign: -6 }} />}
            {typed === 0 && <span style={{ color: "#C9CACC" }}>Post title</span>}
          </div>
          {[92, 100, 76, 88].map((w, i) => (
            <Bar key={i} w={`${w * body[i]}%`} h={14} c="#E2E3E1" style={{ opacity: body[i] }} />
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: body[3] }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, border: "2px solid #D2D3D1", display: "grid", placeItems: "center", ...sans(400, 26, { color: "#8B8F96" }) }}>+</div>
            {["Image", "Video", "Bookmark", "Button"].map((c) => <div key={c} style={sans(500, 17, { color: "#8B8F96" })}>{c}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Channel: React.FC<{ label: string; lit: number }> = ({ label, lit }) => (
  <div
    style={{
      width: 300, height: 84, borderRadius: 18, display: "flex", alignItems: "center", gap: 16, padding: "0 26px", boxSizing: "border-box",
      background: COLORS.panel, border: `2.5px solid ${lit > 0.5 ? COLORS.pink : COLORS.line}`, boxShadow: lit > 0.5 ? `0 0 ${40 * lit}px rgba(255,61,127,.35)` : "none",
    }}
  >
    <div style={{ width: 18, height: 18, borderRadius: 9, background: lit > 0.5 ? COLORS.pink : COLORS.faint, transform: `scale(${1 + 0.4 * Math.sin(Math.PI * Math.min(1, lit))})` }} />
    <div style={sans(700, 26)}>{label}</div>
  </div>
);
