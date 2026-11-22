import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { easeIn, easyEase, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Headline, Typer } from "../components/Fx";

// FX15 rotary dial (10 → 0) · then the payoff line
const R = 620;
const STEP = 13; // degrees between numbers

export const E2Payoff: React.FC = () => {
  const f = useCurrentFrame();
  const turn = tw(f, 4, 64, 0, 1, easyEase);
  const value = 10 - turn * 10; // which number sits at the pointer
  const dialOut = tw(f, 84, 100, 0, 1, easeIn);
  return (
    <AbsoluteFill>
      <Background f={f + START.payoff} warm={1} bars={0.6} />
      <Camera f={f} push={0.0002}>
        <AbsoluteFill style={{ opacity: 1 - dialOut, filter: dialOut > 0.01 ? `blur(${dialOut * 16}px)` : undefined }}>
          {/* wheel centred off-screen left; numbers ride its right edge */}
          <div style={{ position: "absolute", left: 960 - 290 - R, top: 540, width: 0, height: 0 }}>
            <div style={{ position: "absolute", left: -R, top: -R, width: R * 2, height: R * 2, borderRadius: "50%", border: `2px solid rgba(122,51,239,.14)` }} />
            {Array.from({ length: 11 }, (_, n) => {
              const a = (n - value) * STEP;
              const rad = (a * Math.PI) / 180;
              const near = Math.max(0, 1 - Math.abs(n - value) / 2.2);
              return (
                <div key={n} style={{ position: "absolute", left: Math.cos(rad) * R, top: Math.sin(rad) * R, transform: `translate(-50%,-50%) rotate(${a}deg)` }}>
                  <div style={sans(700, 120 + 90 * near, { color: near > 0.8 ? COLORS.text : "#B7BAC4", letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", opacity: 0.25 + 0.75 * near })}>{n}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: R - 230, top: -8, width: 16, height: 16, borderRadius: 8, background: COLORS.purple }} />
          </div>
          <At x={60} y={-6}>
            <div style={{ display: "grid", gap: 0 }}>
              <Typer f={f} start={22} perChar={3} size={96} lines={[[{ t: "% fees" }]]} caretColor={COLORS.purple} />
              <div style={{ ...sans(600, 34, { color: COLORS.purple }), opacity: tw(f, 60, 72, 0, 1), paddingLeft: 6, marginTop: 18 }}>on what your readers pay</div>
            </div>
          </At>
        </AbsoluteFill>
        <At y={0}>
          <Headline f={f} start={96} size={150} lines={[["Your", "audience."], ["Your", "revenue."]]} accentLine={1} accent="purple" />
        </At>
      </Camera>
    </AbsoluteFill>
  );
};
