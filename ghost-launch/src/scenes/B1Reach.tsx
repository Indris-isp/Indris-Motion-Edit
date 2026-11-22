import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { count, enter, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Badge, Chip, Headline, MotionBlurDefs, mb, whip } from "../components/Fx";
import { FeedCard } from "../components/UI";

// FX02 defocus headline · FX07 badge pill · FX17 motion-blur slide
const STEP = 250;

export const B1Reach: React.FC = () => {
  const f = useCurrentFrame();
  const cardIn = whip(f, 34, 26, 900, "in");
  const out = whip(f, 222, 18, -1400, "out");
  const ins = Array.from({ length: 5 }, (_, k) => enter(f, 100 + 12 * k));
  const sumTo = (k: number) => ins.slice(0, k + 1).reduce((a, b) => a + b, 0);
  const yMine = STEP * sumTo(4) - 60;
  const pill = enter(f, 70);
  const reach = count(f, 96, 100, 6, 70);
  return (
    <AbsoluteFill>
      <Background f={f + START.reach} warm={0} bars={0.5} />
      <MotionBlurDefs id="mbA" x={cardIn.blur} />
      <MotionBlurDefs id="mbOut" x={out.blur} />
      <AbsoluteFill style={{ transform: `translateX(${out.x}px)`, filter: mb("mbOut", out.blur) }}>
        <Camera f={f} push={0.00018}>
          <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)", opacity: Math.min(1, enter(f, 4) * 1.5) }}>
            <Chip text="PROBLEM 1 · RENTED REACH" tone="pink" />
          </At>
          <At x={-420} y={-10}>
            <Headline f={f} start={8} lines={[["Who", "actually"], ["sees", "your"], ["post?"]]} accentLine={2} accent="pink" size={118} align="left" lineHeight={1.0} />
          </At>
          <At x={430 + cardIn.x} y={20} style={{ filter: mb("mbA", cardIn.blur) }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 680, height: 760, borderRadius: 40, background: COLORS.paperInk, boxShadow: "0 40px 90px rgba(17,24,39,.28)", overflow: "hidden", position: "relative" }}>
                <div style={{ height: 70, display: "flex", alignItems: "center", padding: "0 30px", borderBottom: `1.5px solid ${COLORS.line}`, ...sans(700, 22) }}>Feed</div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0 }}>
                  <div style={{ position: "absolute", left: 30, top: 30 + yMine * 0.9, transform: "scale(.99)", transformOrigin: "top left" }}>
                    <FeedCard mine seed={0} />
                  </div>
                  {ins.map((p, k) => (
                    <div key={k} style={{ position: "absolute", left: 30, top: 30 + STEP * 0.9 * (sumTo(k) - 1) - 60 * 0.9, opacity: Math.min(1, p * 1.4), transform: `scale(${0.92 + 0.07 * p})`, transformOrigin: "top left" }}>
                      <FeedCard seed={k + 1} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "absolute", right: -40, top: -36, transform: `rotate(${-14 * (1 - pill)}deg) scale(${Math.min(1.08, pill)})`, opacity: Math.min(1, pill * 1.5) }}>
                <div style={{ background: "#fff", borderRadius: 24, padding: "16px 22px", boxShadow: "0 16px 40px rgba(17,24,39,.16)", display: "grid", gap: 2, minWidth: 210 }}>
                  <div style={sans(600, 16, { color: COLORS.textMute, letterSpacing: "0.14em" })}>REACH</div>
                  <div style={sans(800, 72, { color: reach < 50 ? COLORS.pink : COLORS.text, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 })}>{reach}%</div>
                </div>
              </div>
              <div style={{ position: "absolute", left: -30, bottom: 90, opacity: tw(f, 160, 170, 0, 1), transform: `rotate(-6deg) scale(${Math.min(1.08, enter(f, 160))})` }}>
                <Badge text="Buried by the algorithm" color={COLORS.pink} size={22} />
              </div>
            </div>
          </At>
        </Camera>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
