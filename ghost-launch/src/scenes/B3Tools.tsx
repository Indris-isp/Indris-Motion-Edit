import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { drift, enter, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Badge, Chip, Icon, MotionBlurDefs, Typer, mb, whip } from "../components/Fx";
import { Cursor } from "../components/Cursor";

// FX06 bento of tool tiles · FX07 notification price badges · FX03 typewriter
const TOOLS = [
  { label: "Website", icon: "globe", price: "$19/mo" },
  { label: "Email", icon: "mail", price: "$39/mo" },
  { label: "Payments", icon: "card", price: "$9/mo" },
  { label: "Members", icon: "users", price: "$29/mo" },
  { label: "Analytics", icon: "chart", price: "$25/mo" },
];
const X = [-640, -320, 0, 320, 640];
const Y = [-90, -150, -60, -150, -90];
const S = 230;

export const B3Tools: React.FC = () => {
  const f = useCurrentFrame();
  const inn = whip(f, 0, 20, 1400, "in");
  const stress = tw(f, 200, 250, 0, 1);
  // cursor drags a subscriber from Members (3) to Email (1)
  const drag = tw(f, 118, 168, 0, 1);
  const keys = [
    { f: 80, x: 200, y: 260 },
    { f: 112, x: X[3] + 10, y: Y[3] + 40 },
    { f: 116, x: X[3] + 10, y: Y[3] + 40, click: true },
    { f: 168, x: X[1] + 10, y: Y[1] + 40 },
    { f: 172, x: X[1] + 10, y: Y[1] + 40, click: true },
    { f: 200, x: X[1] + 60, y: Y[1] + 200 },
  ];
  const cx = X[3] + (X[1] - X[3]) * drag, cy = Y[3] + 40 - Math.sin(Math.PI * drag) * 90 + (Y[1] - Y[3]) * drag;
  return (
    <AbsoluteFill>
      <Background f={f + START.tools} warm={0} bars={0.5} />
      <MotionBlurDefs id="mbT" x={inn.blur} />
      <AbsoluteFill style={{ transform: `translateX(${inn.x}px)`, filter: mb("mbT", inn.blur) }}>
        <Camera f={f} push={0.00016}>
          <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)" }}>
            <Chip text="PROBLEM 3 · TOO MANY TOOLS" tone="pink" />
          </At>
          {/* tangled dotted lines */}
          <svg width={1920} height={1080} viewBox="-960 -540 1920 1080" style={{ position: "absolute", inset: 0 }}>
            {[[0, 2], [1, 3], [2, 4], [0, 3], [1, 4], [0, 4], [3, 1]].map(([a, b], k) => {
              const L = 2400;
              const bend = (k % 2 ? 1 : -1) * (150 + k * 30);
              return <path key={k} d={`M${X[a]} ${Y[a]} Q ${(X[a] + X[b]) / 2} ${(Y[a] + Y[b]) / 2 + bend} ${X[b]} ${Y[b]}`} fill="none" stroke={k === 6 ? COLORS.pink : "#B9BCC4"} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={tw(f, 60 + k * 6, 100 + k * 6, 0, 1)} style={{ strokeDashoffset: -f * 0.6 }} />;
            })}
          </svg>
          {TOOLS.map((t, k) => {
            const p = enter(f, 10 + k * 5);
            const j = stress * 5;
            return (
              <At key={k} x={X[k] + drift(f, 5, 240, k) + j * Math.sin(f * 0.9 + k)} y={Y[k] + (1 - p) * 120 + drift(f, 5, 300, k + 2) + j * Math.cos(f * 1.1 + k)}>
                <div style={{ opacity: Math.min(1, p * 1.4), transform: `scale(${0.7 + 0.3 * p}) rotate(${stress * (k % 2 ? 3 : -3)}deg)`, position: "relative" }}>
                  <div style={{ width: S, height: S, borderRadius: 56, background: "#fff", boxShadow: "0 20px 50px rgba(17,24,39,.12), 0 0 0 1px rgba(17,24,39,.05)", display: "grid", placeItems: "center", alignContent: "center", gap: 14 }}>
                    <Icon name={t.icon} size={84} />
                    <div style={sans(700, 26, { color: COLORS.text, letterSpacing: "-0.02em" })}>{t.label}</div>
                  </div>
                  <div style={{ position: "absolute", right: -22, top: -18, transform: `scale(${Math.min(1.12, enter(f, 40 + k * 8))})` }}>
                    <Badge text={t.price} color="#F5313D" size={22} />
                  </div>
                </div>
              </At>
            );
          })}
          {/* dragged subscriber row */}
          {f > 116 && f < 182 && (
            <At x={cx + 90} y={cy - 70}>
              <div style={{ ...sans(600, 20, { color: COLORS.text }), background: "#fff", borderRadius: 999, padding: "10px 18px", boxShadow: "0 12px 30px rgba(17,24,39,.2)", border: `2px solid ${COLORS.pink}`, whiteSpace: "nowrap" }}>maya@… · copy to Email</div>
            </At>
          )}
          <Cursor f={f} keys={keys} opacity={tw(f, 80, 90, 0, 1) * tw(f, 200, 212, 1, 0)} />
          <At y={290}>
            <Typer f={f} start={176} perChar={2} size={80} caretColor={COLORS.pink} lines={[[{ t: "Five tools. Five bills. " }, { t: "$121", c: COLORS.pink }, { t: " a month." }]]} />
          </At>
        </Camera>
      </AbsoluteFill>
      {/* hard cut to the starfield happens at the scene boundary */}
      <AbsoluteFill style={{ background: "#05070F", opacity: tw(f, 296, 300, 0, 1) }} />
    </AbsoluteFill>
  );
};
