import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { easeIn, enter, fmt, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Avatar, Bubble, Float, Headline, Rings, Typer } from "../components/Fx";

// FX01 aura · FX03 typewriter · FX04 live ticker · FX05 orbiting avatars + rings
const ORBIT: { x: number; y: number; text: string; side: "l" | "r" }[] = [
  { x: -640, y: -300, text: "Subscribed", side: "r" },
  { x: 610, y: -320, text: "Loved this", side: "l" },
  { x: -720, y: 60, text: "Shared it", side: "r" },
  { x: 700, y: 40, text: "New reader", side: "l" },
  { x: -470, y: 330, text: "More please!", side: "r" },
  { x: 500, y: 330, text: "Upgraded", side: "l" },
];

export const A1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const out = tw(f, 192, 210, 0, 1, easeIn);
  // live ticker: increments one reader at a time
  const readers = 2476 + (f >= 96 ? 1 : 0) + (f >= 128 ? 1 : 0) + (f >= 156 ? 1 : 0) + (f >= 180 ? 1 : 0);
  const tickPulse = [96, 128, 156, 180].reduce((a, t) => a + (f >= t && f < t + 10 ? Math.sin(((f - t) / 10) * Math.PI) : 0), 0);
  const pill = enter(f, 84);
  return (
    <AbsoluteFill>
      <Background f={f + START.hook} warm={0.75} bars={0.55} />
      <Rings f={f} opacity={tw(f, 30, 70, 0, 1) * (1 - out)} />
      <Camera f={f} push={0.00022}>
        <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 14}px)` : undefined }}>
          {ORBIT.map((o, k) => {
            const p = enter(f, 58 + k * 6);
            return (
              <At key={k} x={o.x} y={o.y}>
                <Float f={f} seed={k} amp={10}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flexDirection: o.side === "l" ? "row-reverse" : "row", opacity: Math.min(1, p * 1.4), transform: `scale(${0.6 + 0.4 * p})`, filter: p < 0.9 ? `blur(${(1 - p) * 8}px)` : undefined }}>
                    <Avatar i={k} size={78} />
                    <div style={{ marginTop: -8 }}><Bubble text={o.text} /></div>
                  </div>
                </Float>
              </At>
            );
          })}
        </AbsoluteFill>
        <At y={-70}>
          <Typer f={f} start={6} perChar={3} size={150} lines={[[{ t: "You write." }]]} exitAt={192} />
        </At>
        <At y={95}>
          <Headline f={f} start={44} lines={[["People", "read."]]} accentLine={0} accent="purple" size={150} exitAt={192} />
        </At>
        <At y={250}>
          <div style={{ opacity: Math.min(1, pill * 1.5) * (1 - out), transform: `translateY(${(1 - pill) * 20}px) scale(${1 + 0.04 * tickPulse})`, display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 999, padding: "12px 22px", boxShadow: "0 10px 30px rgba(17,24,39,.10)" }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.green, boxShadow: `0 0 0 ${4 + 4 * tickPulse}px rgba(48,207,67,.2)` }} />
            <span style={sans(700, 28, { color: COLORS.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" })}>{fmt(readers)}</span>
            <span style={sans(500, 24, { color: COLORS.textMute })}>readers</span>
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};
