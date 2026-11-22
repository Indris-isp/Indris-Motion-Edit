import React from "react";
import { COLORS, COPY } from "../config";
import { count, easeOut, enter, fmt, tw } from "../anim";
import { Donut, GhostWordmark, Pill } from "./UI";
import { sans } from "./Stage";

export const DB_W = 1440;
export const DB_H = 660;
// Revenue card center relative to dashboard center (camera starts here)
export const REV = { x: 400, y: -40 };

const Card: React.FC<{ w: number | string; h: number; children: React.ReactNode; accent?: boolean; style?: React.CSSProperties }> = ({ w, h, children, accent, style }) => (
  <div style={{ width: w, height: h, borderRadius: 18, background: COLORS.panel, border: `2px solid ${accent ? COLORS.pink : COLORS.line}`, padding: 28, boxSizing: "border-box", position: "relative", ...style }}>{children}</div>
);

/** Vector rebuild of a Ghost-style admin dashboard. `f` is the scene-local frame driving its counters. */
export const Dashboard: React.FC<{ f: number }> = ({ f }) => {
  const members = count(f, 40, 0, COPY.payoff.members);
  const revenue = count(f, 62, COPY.payoff.revenue * 0.9, COPY.payoff.revenue);
  const draw = tw(f, 40, 130, 0, 1, easeOut);
  const snap = enter(f, 58);
  const slice = { x: (1 - snap) * 30, y: (1 - snap) * -300, r: (1 - snap) * -40 };
  const pill = enter(f, 112);
  const pts = [0, 6, 9, 15, 22, 28, 40, 47, 58, 66, 80, 92, 100].map((v, i, a) => [(i / (a.length - 1)) * 560, 190 - v * 1.7]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  const nav = ["Dashboard", "Posts", "Members", "Analytics", "Network", "Settings"];
  const minis: [string, string][] = [["Open rate", "64%"], ["New signups", "+312"], ["Social web followers", "1,204"]];

  return (
    <div style={{ width: DB_W, height: DB_H, borderRadius: 24, background: COLORS.bg2, border: `2px solid ${COLORS.line}`, display: "flex", overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.6)" }}>
      <div style={{ width: 250, borderRight: `1.5px solid ${COLORS.line}`, padding: "30px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ marginBottom: 26 }}><GhostWordmark size={40} /></div>
        {nav.map((n, i) => (
          <div key={n} style={{ ...sans(i === 0 ? 700 : 500, 19, { color: i === 0 ? COLORS.ink : COLORS.mute }), padding: "10px 14px", borderRadius: 10, background: i === 0 ? COLORS.panel2 : "transparent" }}>{n}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "30px 36px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={sans(800, 34, { letterSpacing: "-0.03em" })}>Dashboard</div>
          <Pill size={17} color={COLORS.mute}>Last 30 days</Pill>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Card w={640} h={330}>
            <div style={sans(600, 16, { color: COLORS.mute, letterSpacing: "0.12em" })}>PAID MEMBERS</div>
            <div style={sans(800, 72, { letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", marginTop: 6 })}>{fmt(members)}</div>
            <svg width={580} height={200} viewBox="0 -10 560 210" style={{ position: "absolute", left: 30, bottom: 18, overflow: "visible" }}>
              <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FF3D7F" stopOpacity=".35" /><stop offset="1" stopColor="#FF3D7F" stopOpacity="0" /></linearGradient></defs>
              {[50, 100, 150].map((y) => <line key={y} x1="0" x2="560" y1={y} y2={y} stroke={COLORS.line} strokeWidth="1" />)}
              <clipPath id="clip"><rect x="0" y="-20" width={560 * draw} height="240" /></clipPath>
              <g clipPath="url(#clip)">
                <path d={`${path} L560 200 L0 200 Z`} fill="url(#ga)" />
                <path d={path} fill="none" stroke="#FF3D7F" strokeWidth="4" strokeLinejoin="round" />
              </g>
              {draw > 0.98 && <circle cx="560" cy={pts[pts.length - 1][1]} r="7" fill="#FF3D7F" stroke={COLORS.panel} strokeWidth="3" />}
            </svg>
          </Card>
          <Card w={466} h={330} accent>
            <div style={sans(600, 16, { color: COLORS.pink, letterSpacing: "0.12em" })}>YOU KEEP</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 14 }}>
              <Donut size={170} slicePct={10} sliceOffset={slice} sliceOpacity={Math.min(1, snap * 2)} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={sans(800, 60, { letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" })}>${fmt(revenue)}</div>
                <div style={sans(500, 17, { color: COLORS.mute })}>of every $1,000</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 28, bottom: 26, opacity: Math.min(1, pill * 1.5), transform: `scale(${0.7 + 0.3 * pill})`, transformOrigin: "left center" }}>
              <Pill bg={COLORS.pink} size={20}>{COPY.payoff.feeNote}</Pill>
            </div>
          </Card>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {minis.map(([k, v], i) => {
            const e = enter(f, 124 + i * 4);
            return (
              <Card key={k} w="33%" h={110} style={{ opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 30}px)`, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                <div style={sans(600, 15, { color: COLORS.mute, letterSpacing: "0.1em" })}>{k.toUpperCase()}</div>
                <div style={sans(800, 34, { letterSpacing: "-0.03em" })}>{v}</div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
