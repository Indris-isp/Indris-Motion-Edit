import React from "react";
import { COLORS, COPY } from "../config";
import { count, easeOut, enter, fmt, tw } from "../anim";
import { Donut, GhostOrb, Pill } from "./UI";
import { sans } from "./Stage";

export const DB_W = 1440;
export const DB_H = 700;
// "You keep" block center relative to dashboard center (the camera starts here)
export const REV = { x: 497, y: 262 };

const SIDE = 260;
const ICON = "#B9BBBF";

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const ICONS = {
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  site: "M3 4h18v16H3zM3 9h18M9 9v11",
  post: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  page: "M6 3h9l4 4v14H6zM15 3v4h4",
  tag: "M3 12V3h9l9 9-9 9z M7.5 7.5h.01",
  members: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 3a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3",
  offer: "M5 19L19 5M7 8a1.5 1.5 0 1 0 0-.01M17 16a1.5 1.5 0 1 0 0-.01",
  pro: "M3 6h18v12H3zM8 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
};

const Item: React.FC<{ label: string; icon?: keyof typeof ICONS; active?: boolean; dot?: string; badge?: string; plus?: boolean; sub?: boolean }> = ({ label, icon, active, dot, badge, plus, sub }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, height: sub ? 30 : 34, paddingLeft: sub ? 34 : 0 }}>
    {icon && <Icon d={ICONS[icon]} />}
    <div style={sans(active ? 700 : 500, 17, { color: active ? COLORS.ink : "#D3D4D6", flex: 1 })}>{label}</div>
    {dot && <div style={{ width: 7, height: 7, borderRadius: 4, background: dot, marginRight: 6 }} />}
    {badge && <div style={{ ...sans(500, 14, { color: "#D3D4D6", fontVariantNumeric: "tabular-nums" }), background: COLORS.panel2, borderRadius: 999, padding: "3px 10px" }}>{badge}</div>}
    {plus && <div style={sans(300, 26, { color: ICON, lineHeight: 1 })}>+</div>}
  </div>
);

const Delta: React.FC<{ v: string }> = ({ v }) => <span style={sans(500, 15, { color: COLORS.green, marginLeft: 12 })}>↑ {v}</span>;

/** Smooth path through points (Catmull-Rom → cubic bezier). */
const smooth = (pts: number[][]) =>
  pts.map((p, i) => {
    if (i === 0) return `M${p[0]} ${p[1]}`;
    const p0 = pts[i - 2] || pts[i - 1], p1 = pts[i - 1], p3 = pts[i + 1] || p;
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
    return `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p[0]} ${p[1]}`;
  }).join(" ");

/** Vector rebuild of the Ghost admin dashboard as shown on ghost.org. `f` drives counters and chart draws. */
export const Dashboard: React.FC<{ f: number }> = ({ f }) => {
  const total = count(f, 36, 0, COPY.payoff.members);
  const paid = count(f, 40, 0, 200);
  const mrr = count(f, 62, COPY.payoff.revenue * 0.9, COPY.payoff.revenue);
  const draw = tw(f, 36, 130, 0, 1, easeOut);
  const snap = enter(f, 58);
  const slice = { x: (1 - snap) * 30, y: (1 - snap) * -260, r: (1 - snap) * -40 };
  const pill = enter(f, 112);
  const bars = enter(f, 70);

  const CW = 1040, CH = 200;
  const vals = [4, 6, 5, 9, 12, 11, 16, 15, 21, 26, 24, 31, 37, 35, 44, 52, 50, 61, 70, 68, 79, 88, 95, 100];
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * CW, CH - v * 1.8]);
  const line = smooth(pts);
  const mrrPts = [8, 12, 10, 15, 14, 19, 22, 21, 27, 30].map((v, i) => [i * 24, 46 - v * 1.4]);

  return (
    <div style={{ width: DB_W, height: DB_H, borderRadius: 18, background: COLORS.bg, border: `1.5px solid ${COLORS.line}`, display: "flex", overflow: "hidden", boxShadow: "0 50px 100px rgba(17,24,39,.28)", position: "relative" }}>
      {/* sidebar */}
      <div style={{ width: SIDE, borderRight: `1.5px solid ${COLORS.line}`, padding: "26px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <GhostOrb size={30} rotate={f * 0.15} />
          <div style={sans(700, 18, { flex: 1 })}>Ghost</div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
        </div>
        <Item icon="home" label="Dashboard" active />
        <Item icon="site" label="View site" />
        <div style={{ height: 14 }} />
        <Item icon="post" label="Posts" plus />
        <Item sub label="Drafts" />
        <Item sub label="Scheduled" />
        <Item sub label="Published" />
        <Item sub label="Free posts" dot={COLORS.yellow} />
        <Item sub label="Paid posts" dot={COLORS.green} />
        <Item sub label="Newsletters" dot="#F5313D" />
        <div style={{ height: 14 }} />
        <Item icon="page" label="Pages" />
        <Item icon="tag" label="Tags" />
        <Item icon="members" label="Members" badge={fmt(total)} />
        <Item icon="offer" label="Offers" />
        <div style={{ height: 14 }} />
        <Item icon="pro" label="Ghost(Pro)" />
      </div>

      {/* main */}
      <div style={{ position: "relative", flex: 1, padding: "28px 40px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
          <div style={sans(700, 32, { letterSpacing: "-0.02em" })}>Dashboard</div>
          <div style={sans(500, 15, { color: COLORS.mute })}>Past 30 days ⌄</div>
        </div>
        {/* stat strip */}
        <div style={{ marginTop: 18, height: 104, borderRadius: 10, background: COLORS.panel, display: "flex", alignItems: "center" }}>
          {[
            ["Total members", fmt(total), "+12%"],
            ["Paid members", fmt(paid), "+8%"],
            ["Free members", fmt(Math.max(0, total - paid)), "+14%"],
          ].map(([k, v, d], i) => (
            <div key={k} style={{ flex: 1, padding: "0 28px", borderLeft: i ? `1.5px solid ${COLORS.line}` : "none", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={sans(600, 16)}>{k}</div>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={sans(600, 38, { letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" })}>{v}</span><Delta v={d} />
              </div>
            </div>
          ))}
        </div>
        {/* chart card */}
        <div style={{ marginTop: 22, height: 452, borderRadius: 10, border: `1.5px solid ${COLORS.line}`, padding: "20px 28px", boxSizing: "border-box", position: "relative" }}>
          <div style={sans(600, 16)}>Total members&nbsp; <span style={{ color: COLORS.mute }}>⌄</span></div>
          <svg width={CW} height={CH + 10} viewBox={`0 -10 ${CW} ${CH + 10}`} style={{ position: "absolute", left: 28, top: 58, overflow: "visible" }}>
            <defs>
              <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={COLORS.pink} stopOpacity=".28" /><stop offset="1" stopColor={COLORS.pink} stopOpacity=".06" /></linearGradient>
              <clipPath id="clip"><rect x="-4" y="-20" width={CW * draw + 4} height={CH + 40} /></clipPath>
            </defs>
            {Array.from({ length: 28 }, (_, i) => <line key={i} x1={(i * CW) / 27} x2={(i * CW) / 27} y1="0" y2={CH} stroke="#3A3D43" strokeWidth="1" strokeDasharray="2 4" />)}
            <g clipPath="url(#clip)">
              <path d={`${line} L${CW} ${CH} L0 ${CH} Z`} fill="url(#ga)" />
              <path d={line} fill="none" stroke={COLORS.pink} strokeWidth="3.5" strokeLinejoin="round" />
            </g>
            {draw > 0.97 && <circle cx={CW} cy={pts[pts.length - 1][1]} r="7" fill={COLORS.bg} stroke={COLORS.pink} strokeWidth="3.5" />}
          </svg>
          {draw > 0.97 && (
            <div style={{ position: "absolute", right: 40, top: 40, background: COLORS.panel2, borderRadius: 8, padding: "8px 14px", opacity: tw(f, 130, 140, 0, 1) }}>
              <div style={sans(500, 13, { color: COLORS.mute })}>Today</div>
              <div style={sans(600, 17)}>{fmt(total)} <span style={{ color: COLORS.mute, fontWeight: 500 }}>Total members</span></div>
            </div>
          )}
          <div style={{ position: "absolute", left: 28, right: 28, top: 282, display: "flex", justifyContent: "space-between", ...sans(400, 14, { color: COLORS.mute }) }}>
            <span>30 days ago</span><span>Today</span>
          </div>
          {/* bottom row */}
          <div style={{ position: "absolute", left: 28, right: 28, top: 322, height: 108, display: "flex" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={sans(600, 16)}>MRR</div>
                <div style={sans(600, 36, { letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" })}>${fmt(mrr)}</div>
                <div style={sans(500, 14, { color: COLORS.green })}>↑ +11.1%</div>
              </div>
              <svg width="216" height="50" viewBox="0 0 216 50" style={{ opacity: draw }}><path d={smooth(mrrPts)} fill="none" stroke={COLORS.purple} strokeWidth="3" /></svg>
            </div>
            <div style={{ flex: 1, borderLeft: `1.5px solid ${COLORS.line}`, paddingLeft: 28, display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={sans(600, 16)}>Paid subscriptions</div>
                <div style={sans(500, 14, { color: COLORS.mute })}><span style={{ color: COLORS.purple }}>●</span> New&nbsp;&nbsp;<span style={{ color: COLORS.pink }}>●</span> Canceled</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, height: 80 }}>
                {[30, 44, 26, 52, 38, 58, 34, 48, 62, 40, 54].map((h, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 5, height: h * 0.9 * Math.min(1, bars), background: COLORS.purple, borderRadius: 2 }} />
                    <div style={{ width: 5, height: (i % 3 === 0 ? 10 : 5) * Math.min(1, bars), background: COLORS.pink, borderRadius: 2, marginTop: 2 }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, borderLeft: `1.5px solid ${COLORS.line}`, paddingLeft: 28, display: "flex", alignItems: "center", gap: 20 }}>
              <Donut size={96} slicePct={10} sliceOffset={slice} sliceOpacity={Math.min(1, snap * 2)} ringColor={COLORS.purple} sliceColor={COLORS.lime} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={sans(600, 16)}>You keep</div>
                <div style={sans(600, 30, { letterSpacing: "-0.02em" })}>100%</div>
                <div style={{ opacity: Math.min(1, pill * 1.5), transform: `scale(${0.7 + 0.3 * pill})`, transformOrigin: "left center" }}>
                  <Pill bg={COLORS.lime} color={COLORS.paperInk} size={14}>{COPY.payoff.feeNote}</Pill>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
