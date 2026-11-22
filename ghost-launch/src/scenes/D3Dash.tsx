import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY, START } from "../config";
import { count, easeIn, easyEase, enter, fmt, tw } from "../anim";
import { At, Background, sans } from "../components/Stage";
import { Chip, Headline } from "../components/Fx";
import { Dashboard, DB_H, DB_W } from "../components/Dashboard";

// FX12 brand-colour wall with repeated text + panel morph · FX13 floating cards over a curved horizon
const WORDS = "website · newsletter · members · payments · analytics · ";

export const D3Dash: React.FC = () => {
  const f = useCurrentFrame();
  const morph = tw(f, 84, 124, 0, 1, easyEase);
  const dashIn = tw(f, 112, 132, 0, 1);
  const horizon = tw(f, 120, 170, 0, 1, easyEase);
  const out = tw(f, 222, 240, 0, 1, easeIn);
  const DS = 0.74;
  const w = 640 + (DB_W * DS - 640) * morph, h = 320 + (DB_H * DS - 320) * morph;
  const cards = [
    { x: -720, y: -170, k: "Total members", v: fmt(count(f, 150, 0, COPY.payoff.members)), d: "+12%", rot: 10 },
    { x: 730, y: -200, k: "MRR", v: `$${fmt(count(f, 156, 0, COPY.payoff.revenue))}`, d: "+11%", rot: -10 },
    { x: 700, y: 200, k: "You keep", v: "100%", d: "0% fees", rot: -8 },
  ];
  return (
    <AbsoluteFill>
      <Background f={f + START.dash} warm={1} bars={0.4} />
      {/* purple wall that sinks into a curved horizon */}
      <AbsoluteFill style={{ clipPath: horizon < 0.001 ? undefined : `ellipse(${150 - 30 * horizon}% ${100 - 62 * horizon}% at 50% ${50 + 75 * horizon}%)`, background: "linear-gradient(160deg,#9A5BFF 0%,#7A33EF 55%,#5B1FD1 100%)" }}>
        {Array.from({ length: 7 }, (_, r) => (
          <div key={r} style={{ position: "absolute", left: 0, top: 30 + r * 150, whiteSpace: "nowrap", ...sans(700, 120, { color: "rgba(255,255,255,0.1)", letterSpacing: "-0.04em" }), transform: `translateX(${(r % 2 ? -1 : 1) * (f * 2.2) - 400 - r * 160}px)` }}>
            {WORDS.repeat(4)}
          </div>
        ))}
      </AbsoluteFill>
      <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)", zIndex: 4 }}>
        <Chip text="FIXES PROBLEM 3" tone={horizon > 0.5 ? "purple" : "white"} />
      </At>
      <At y={0}>
        <Headline f={f} start={6} size={118} color="#FFFFFF" lines={[["Your", "whole", "business,"], ["in", "one", "place."]]} accentLine={1} accent="lime" exitAt={70} />
      </At>
      {/* morphing panel → dashboard */}
      {f >= 80 && (
        <At y={-30 * morph}>
          <div style={{ width: w, height: h, borderRadius: 120 - 106 * morph, background: morph < 1 ? "#fff" : "transparent", boxShadow: "0 40px 100px rgba(40,10,90,.35)", overflow: "hidden", position: "relative", transform: `scale(${(0.6 + 0.4 * Math.min(1, enter(f, 80))) * (1 + 0.15 * out)})`, opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 14}px)` : undefined }}>
            <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${DS})`, transformOrigin: "top left", opacity: dashIn }}>
              <Dashboard f={f - 110} />
            </div>
          </div>
        </At>
      )}
      {/* floating stat cards in 3D */}
      <AbsoluteFill style={{ perspective: 1800, opacity: 1 - out }}>
        {cards.map((c, i) => {
          const p = enter(f, 146 + i * 5);
          return (
            <At key={i} x={c.x} y={c.y + Math.sin(f / 40 + i) * 8}>
              <div style={{ transform: `rotateY(${c.rot}deg) rotateX(6deg) scale(${Math.min(1.06, p)})`, opacity: Math.min(1, p * 1.4), background: "#fff", borderRadius: 26, padding: "22px 28px", minWidth: 250, boxShadow: "0 30px 60px rgba(40,10,90,.22)", display: "grid", gap: 4 }}>
                <div style={sans(600, 20, { color: COLORS.textMute })}>{c.k}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={sans(700, 52, { color: COLORS.text, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" })}>{c.v}</span>
                  <span style={sans(600, 18, { color: i === 2 ? COLORS.purple : COLORS.green })}>{i === 2 ? c.d : `↑ ${c.d}`}</span>
                </div>
              </div>
            </At>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
