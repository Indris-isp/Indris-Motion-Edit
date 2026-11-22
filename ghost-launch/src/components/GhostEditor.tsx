import React from "react";
import { COLORS, COPY, FONTS } from "../config";
import { sans } from "./Stage";

export const ED_W = 1280;
export const ED_H = 720;
// Publish button center relative to the editor center (camera + cursor target)
export const BTN = { x: ED_W / 2 - 172, y: -ED_H / 2 + 34 };

const INK = COLORS.paperInk;
const GREY = "#8E9196";

const Para: React.FC<{ text: string; p: number }> = ({ text, p }) => (
  <div style={{ fontFamily: FONTS.serif, fontSize: 21, lineHeight: 1.6, color: "#2B2E33", opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{text}</div>
);

/** Vector rebuild of the Ghost post editor as shown on ghost.org: white, calm, Inter titles, serif body. */
export const GhostEditor: React.FC<{ typed: number; body: number[]; btnScale: number; btnDone: number; caret: boolean }> = ({ typed, body, btnScale, btnDone, caret }) => {
  const title = COPY.fix.postTitle.slice(0, typed);
  return (
    <div style={{ width: ED_W, height: ED_H, borderRadius: 14, background: COLORS.paper, overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.55)", position: "relative" }}>
      {/* top bar */}
      <div style={{ height: 68, display: "flex", alignItems: "center", padding: "0 28px", gap: 22 }}>
        <div style={sans(600, 18, { color: INK })}>‹&nbsp; Posts</div>
        <div style={sans(400, 17, { color: GREY })}>Draft - saved</div>
        <div style={{ flex: 1 }} />
        <div style={sans(500, 18, { color: INK })}>Preview</div>
        <div
          style={{
            ...sans(600, 18, { color: "#fff" }), background: btnDone ? COLORS.green : INK, borderRadius: 7, padding: "10px 20px",
            transform: `scale(${btnScale})`, minWidth: 196, textAlign: "center", boxSizing: "border-box",
          }}
        >
          {btnDone ? "✓  Published & sent" : COPY.fix.button}
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2.5" /><line x1="15" y1="4" x2="15" y2="20" /></svg>
      </div>
      {/* writing column */}
      <div style={{ position: "absolute", left: (ED_W - 720) / 2, top: 110, width: 720, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...sans(500, 16, { color: GREY }) }}>
          <span>+ Add feature image</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 16l5-5 4 4 3-3 6 6" /></svg>
        </div>
        <div style={{ ...sans(700, 54, { color: typed ? INK : "#C5C7CA", letterSpacing: "-0.03em", lineHeight: 1.08 }), minHeight: 60 }}>
          {typed ? title : "Post title"}
          {caret && <span style={{ display: "inline-block", width: 3, height: 50, background: INK, marginLeft: 4, verticalAlign: -6 }} />}
        </div>
        <Para p={body[0]} text="Local newsrooms are disappearing. Local stories aren’t. Here’s how a team of three built a newsroom that its readers pay for, without an algorithm deciding who gets to read it." />
        <div style={{ ...sans(700, 30, { color: INK, letterSpacing: "-0.02em" }), opacity: body[1], transform: `translateY(${(1 - body[1]) * 12}px)`, marginTop: 6 }}>Why readers pay</div>
        <Para p={body[2]} text="Trust is built one email at a time. Every story lands in the inbox, and every member supports the work directly." />
        <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: body[3] }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, border: "1.5px solid #D5D7DA", display: "grid", placeItems: "center", ...sans(400, 22, { color: GREY }) }}>+</div>
          {["Image", "Gallery", "Video", "Bookmark", "Signup", "Button"].map((c) => <div key={c} style={sans(500, 16, { color: GREY })}>{c}</div>)}
        </div>
      </div>
    </div>
  );
};

export const Channel: React.FC<{ label: string; lit: number }> = ({ label, lit }) => {
  const on = lit > 0.5;
  return (
    <div
      style={{
        width: 300, height: 84, borderRadius: 12, display: "flex", alignItems: "center", gap: 16, padding: "0 26px", boxSizing: "border-box",
        background: COLORS.panel, border: `2px solid ${on ? COLORS.lime : COLORS.line}`, boxShadow: on ? `0 0 ${36 * lit}px rgba(209,255,25,.22)` : "none",
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: 8, background: on ? COLORS.lime : COLORS.faint, transform: `scale(${1 + 0.4 * Math.sin(Math.PI * Math.min(1, lit))})` }} />
      <div style={sans(700, 26, { letterSpacing: "-0.02em" })}>{label}</div>
    </div>
  );
};
