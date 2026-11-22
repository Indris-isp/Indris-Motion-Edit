import React from "react";
import { COLORS, COPY } from "../config";
import { Bar, Donut, Pill, Window } from "./UI";
import { sans } from "./Stage";
import { fmt } from "../anim";

export const WIN_W = 500;
export const WIN_H = 360;
export const TOOL_X = [-1120, -560, 0, 560, 1120];
export const TOOL_Y = -20;
export const PRICES = ["$19/mo", "$29/mo", "$39/mo", "$9/mo", "$25/mo"];

const rows = [
  ["Maya R.", "maya@…", "Paid"],
  ["Jon K.", "jon@…", "Free"],
  ["Ana P.", "ana@…", "Paid"],
  ["Lee S.", "lee@…", "Paid"],
];

export type ToolState = {
  copiedRow?: number; // highlight intensity 0..1
  pasted?: number; // 0..1 new row in Email
  revenue?: number;
  slice?: { x: number; y: number; r: number; o: number };
};

const Website = () => (
  <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}><Bar w={90} h={14} c={COLORS.faint} /><div style={{ display: "flex", gap: 10 }}><Bar w={40} /><Bar w={40} /><Bar w={40} /></div></div>
    <Bar w="100%" h={130} r={10} c={COLORS.panel2} />
    <Bar w="70%" h={18} c={COLORS.faint} />
    <Bar w="90%" /><Bar w="55%" />
  </div>
);

const Members: React.FC<{ hl: number }> = ({ hl }) => (
  <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "10px 12px", borderRadius: 10, background: i === 0 ? `rgba(255,61,127,${0.22 * hl})` : "transparent", border: `1.5px solid ${i === 0 ? `rgba(255,61,127,${hl})` : COLORS.panel2}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: COLORS.panel2 }} />
        <div style={sans(600, 19, { width: 110 })}>{r[0]}</div>
        <div style={sans(400, 17, { color: COLORS.mute, flex: 1 })}>{r[1]}</div>
        <div style={sans(600, 15, { color: r[2] === "Paid" ? COLORS.ink : COLORS.mute })}>{r[2]}</div>
      </div>
    ))}
  </div>
);

const Email: React.FC<{ pasted: number }> = ({ pasted }) => (
  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={sans(600, 16, { color: COLORS.mute, letterSpacing: "0.1em" })}>RECIPIENTS</div>
    {["jon@…", "lee@…"].map((e) => (
      <div key={e} style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${COLORS.panel2}` }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: COLORS.panel2 }} /><div style={sans(500, 18, { color: COLORS.mute })}>{e}</div>
      </div>
    ))}
    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 12px", borderRadius: 10, border: `1.5px solid rgba(255,61,127,${pasted})`, background: `rgba(255,61,127,${0.18 * pasted})`, opacity: pasted, transform: `translateY(${(1 - pasted) * 14}px)` }}>
      <div style={{ width: 26, height: 26, borderRadius: 13, background: COLORS.pink }} /><div style={sans(600, 18)}>Maya R. · maya@…</div>
    </div>
    <Bar w="80%" style={{ marginTop: 6 }} /><Bar w="50%" />
  </div>
);

const Payments: React.FC<{ revenue: number; slice: ToolState["slice"] }> = ({ revenue, slice }) => (
  <div style={{ padding: 22, display: "flex", alignItems: "center", gap: 22, height: "100%" }}>
    <Donut size={190} slicePct={COPY.problem.feePct} sliceOffset={slice ? { x: slice.x, y: slice.y, r: slice.r } : undefined} sliceOpacity={slice?.o ?? 1} />
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={sans(600, 15, { color: COLORS.mute, letterSpacing: "0.12em" })}>MONTHLY REVENUE</div>
      <div style={sans(800, 58, { letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", color: revenue < COPY.problem.revenue ? COLORS.pink : COLORS.ink })}>${fmt(revenue)}</div>
      <div style={sans(500, 16, { color: COLORS.mute })}>{COPY.problem.feePct}% platform fee</div>
    </div>
  </div>
);

const Analytics = () => (
  <div style={{ padding: 24, display: "flex", alignItems: "flex-end", gap: 16, height: "100%", boxSizing: "border-box" }}>
    {[40, 70, 55, 90, 65, 110, 80].map((h, i) => <Bar key={i} w={42} h={h * 1.9} r={8} c={i === 5 ? COLORS.faint : COLORS.panel2} />)}
  </div>
);

export const ToolWindow: React.FC<{ i: number; st: ToolState; priceIn: number }> = ({ i, st, priceIn }) => {
  const body = [<Website />, <Members hl={st.copiedRow ?? 0} />, <Email pasted={st.pasted ?? 0} />, <Payments revenue={st.revenue ?? COPY.problem.revenue} slice={st.slice} />, <Analytics />][i];
  return (
    <div style={{ position: "relative" }}>
      <Window title={COPY.problem.tools[i]} w={WIN_W} h={WIN_H}>{body}</Window>
      <div style={{ position: "absolute", right: -18, top: -22, opacity: Math.min(1, priceIn * 1.5), transform: `scale(${0.6 + 0.4 * priceIn}) rotate(${6 - i * 3}deg)` }}>
        <Pill color="#15171A" bg={COLORS.ink} size={20}>{PRICES[i]}</Pill>
      </div>
    </div>
  );
};
