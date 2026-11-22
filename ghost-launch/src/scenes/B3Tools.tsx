import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { drift, easeOut, enter, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Badge, Chip, Icon, MotionBlurDefs, Typer, mb, whip } from "../components/Fx";
import { Cursor } from "../components/Cursor";

// Problem 3 · too many tools.
// Left: a cluster of five tool tiles with tangled links and price badges.
// Right: a "Monthly bills" receipt that fills line by line as each badge pops, totalling $121/mo.
// The cursor juggles data between tools, with toasts that show the manual work (and a failure).
const TOOLS = [
  { label: "Website", icon: "globe", price: 19, x: -700, y: -200 },
  { label: "Email", icon: "mail", price: 39, x: -430, y: -250 },
  { label: "Payments", icon: "card", price: 9, x: -520, y: 30 },
  { label: "Members", icon: "users", price: 29, x: -250, y: -20 },
  { label: "Analytics", icon: "chart", price: 25, x: -760, y: 230 },
];
const S = 200;
const ROW_AT = (k: number) => 40 + k * 16;
const LINKS: [number, number][] = [[0, 1], [1, 3], [3, 2], [2, 4], [4, 0], [0, 3], [1, 2], [2, 0]];
const TOASTS = [
  { f: 128, x: 40, y: -20, text: "Export members.csv", tone: "dark" },
  { f: 160, x: -150, y: -330, text: "Import to Email · 1 of 3", tone: "dark" },
  { f: 190, x: -460, y: 175, text: "Payment sync failed", tone: "red" },
] as const;

export const B3Tools: React.FC = () => {
  const f = useCurrentFrame();
  const inn = whip(f, 0, 20, 1400, "in");
  const stress = tw(f, 196, 236, 0, 1);
  const total = TOOLS.reduce((a, t, k) => a + t.price * tw(f, ROW_AT(k), ROW_AT(k) + 14, 0, 1, easeOut), 0);
  const totalPop = enter(f, ROW_AT(4) + 16);
  const keys = [
    { f: 100, x: 40, y: 320 },
    { f: 124, x: TOOLS[3].x + 20, y: TOOLS[3].y + 30 },
    { f: 128, x: TOOLS[3].x + 20, y: TOOLS[3].y + 30, click: true },
    { f: 156, x: TOOLS[1].x + 20, y: TOOLS[1].y + 30 },
    { f: 160, x: TOOLS[1].x + 20, y: TOOLS[1].y + 30, click: true },
    { f: 186, x: TOOLS[2].x + 20, y: TOOLS[2].y + 30 },
    { f: 190, x: TOOLS[2].x + 20, y: TOOLS[2].y + 30, click: true },
    { f: 230, x: TOOLS[2].x + 80, y: TOOLS[2].y + 160 },
  ];
  return (
    <AbsoluteFill>
      <Background f={f + START.tools} warm={0} bars={0.5} />
      <MotionBlurDefs id="mbT" x={inn.blur} />
      <AbsoluteFill style={{ transform: `translateX(${inn.x}px)`, filter: mb("mbT", inn.blur) }}>
        <Camera f={f} push={0.00016}>
          <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)" }}>
            <Chip text="PROBLEM 3 · TOO MANY TOOLS" tone="pink" />
          </At>

          {/* tangled links between the tools */}
          <svg width={1920} height={1080} viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0 }}>
            {LINKS.map(([a, b], k) => {
              const A = TOOLS[a], B = TOOLS[b];
              const bend = (k % 2 ? 1 : -1) * (90 + k * 18) * (1 + 0.15 * stress * Math.sin(f / 6 + k));
              const mx = (A.x + B.x) / 2 + bend * 0.4, my = (A.y + B.y) / 2 + bend;
              const L = 1400, draw = tw(f, 44 + k * 7, 84 + k * 7, 0, 1);
              return <path key={k} d={`M${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} fill="none" stroke={k % 3 === 0 ? COLORS.pink : "#A9ADB8"} strokeOpacity={k % 3 === 0 ? 0.75 : 0.55} strokeWidth={4} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />;
            })}
          </svg>

          {/* tool tiles */}
          {TOOLS.map((t, k) => {
            const p = enter(f, 8 + k * 6);
            const j = stress * 5;
            const clicked = [128, 160, 190].some((c, i) => [3, 1, 2][i] === k && f >= c && f < c + 8) ? 0.95 : 1;
            return (
              <At key={k} x={t.x + drift(f, 5, 240, k) + j * Math.sin(f * 0.9 + k)} y={t.y + (1 - p) * 120 + drift(f, 5, 300, k + 2) + j * Math.cos(f * 1.1 + k)}>
                <div style={{ opacity: Math.min(1, p * 1.4), transform: `scale(${(0.7 + 0.3 * p) * clicked}) rotate(${stress * (k % 2 ? 3 : -3)}deg)`, position: "relative" }}>
                  <div style={{ width: S, height: S, borderRadius: 50, background: "#fff", boxShadow: "0 22px 50px rgba(17,24,39,.13), 0 0 0 1px rgba(17,24,39,.05)", display: "grid", placeItems: "center", alignContent: "center", gap: 12 }}>
                    <Icon name={t.icon} size={76} />
                    <div style={sans(700, 26, { color: COLORS.text, letterSpacing: "-0.02em" })}>{t.label}</div>
                  </div>
                  <div style={{ position: "absolute", right: -24, top: -20, transform: `scale(${Math.min(1.12, enter(f, ROW_AT(k)))})` }}>
                    <Badge text={`$${t.price}/mo`} color="#F5313D" size={22} />
                  </div>
                </div>
              </At>
            );
          })}

          {/* toasts that show the manual work */}
          {TOASTS.map((t, k) => {
            const p = enter(f, t.f + 2);
            const gone = tw(f, t.f + 40, t.f + 52, 0, 1);
            if (f < t.f) return null;
            return (
              <At key={k} x={t.x} y={t.y}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, ...sans(600, 22, { color: "#fff" }), background: t.tone === "red" ? "#F5313D" : COLORS.paperInk, borderRadius: 14, padding: "12px 18px", boxShadow: "0 14px 30px rgba(17,24,39,.25)", whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5) * (t.tone === "red" ? 1 : 1 - gone), transform: `translateY(${(1 - p) * 16}px) scale(${0.9 + 0.1 * Math.min(1, p)})` }}>
                  <span>{t.tone === "red" ? "⚠" : "⇄"}</span>{t.text}
                </div>
              </At>
            );
          })}

          {/* monthly bills receipt */}
          <At x={470} y={-60}>
            <div style={{ width: 560, background: "#fff", borderRadius: 32, padding: "30px 34px", boxShadow: "0 30px 70px rgba(17,24,39,.14), 0 0 0 1px rgba(17,24,39,.05)", opacity: Math.min(1, enter(f, 26) * 1.4), transform: `translateY(${(1 - Math.min(1, enter(f, 26))) * 40}px) rotate(${stress * 1.2}deg)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={sans(700, 30, { color: COLORS.text, letterSpacing: "-0.02em" })}>Monthly bills</div>
                <div style={sans(500, 18, { color: COLORS.textMute })}>5 tools · 5 logins</div>
              </div>
              <div style={{ marginTop: 18, display: "grid", gap: 6 }}>
                {TOOLS.map((t, k) => {
                  const p = enter(f, ROW_AT(k));
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, height: 58, borderBottom: "1.5px dashed #E4E5E9", opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - Math.min(1, p)) * -60}px)` }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F3F4F6", display: "grid", placeItems: "center" }}><Icon name={t.icon} size={22} /></div>
                      <div style={sans(600, 24, { color: COLORS.text, flex: 1 })}>{t.label}</div>
                      <div style={sans(700, 24, { color: COLORS.text, fontVariantNumeric: "tabular-nums" })}>${t.price}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={sans(600, 24, { color: COLORS.textMute })}>Total</div>
                <div style={{ transform: `scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, totalPop))})`, transformOrigin: "right center" }}>
                  <span style={sans(800, 76, { color: COLORS.pink, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" })}>${Math.round(total)}</span>
                  <span style={sans(600, 26, { color: COLORS.pink })}> /mo</span>
                </div>
              </div>
            </div>
          </At>

          <Cursor f={f} keys={keys} opacity={tw(f, 100, 110, 0, 1) * tw(f, 226, 238, 1, 0)} />
          <At y={385}>
            <Typer f={f} start={200} perChar={1.6} size={76} caretColor={COLORS.pink} lines={[[{ t: "Five tools. Five bills. " }, { t: "$121", c: COLORS.pink }, { t: " a month." }]]} />
          </At>
        </Camera>
      </AbsoluteFill>
      {/* hard cut to the starfield happens at the scene boundary */}
      <AbsoluteFill style={{ background: "#05070F", opacity: tw(f, 296, 300, 0, 1) }} />
    </AbsoluteFill>
  );
};
