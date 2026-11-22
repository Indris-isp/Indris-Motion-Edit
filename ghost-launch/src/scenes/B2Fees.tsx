import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { count, easeIn, enter, fmt, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Badge, Chip, MotionBlurDefs, Typer, mb, whip } from "../components/Fx";
import { Donut } from "../components/UI";

// FX07 tilted badge pill · FX03 typewriter · whip in/out
export const B2Fees: React.FC = () => {
  const f = useCurrentFrame();
  const inn = whip(f, 0, 20, 1400, "in");
  const out = whip(f, 222, 18, -1400, "out");
  const pill = enter(f, 44);
  const value = count(f, 92, 1000, 900, 60);
  const fall = tw(f, 92, 140, 0, 1, easeIn);
  return (
    <AbsoluteFill>
      <Background f={f + START.fees} warm={0} bars={0.5} />
      <MotionBlurDefs id="mbF" x={inn.blur + out.blur} />
      <AbsoluteFill style={{ transform: `translateX(${inn.x + out.x}px)`, filter: mb("mbF", inn.blur + out.blur) }}>
        <Camera f={f} push={0.00022}>
          <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)" }}>
            <Chip text="PROBLEM 2 · PLATFORM FEES" tone="pink" />
          </At>
          <At x={-470} y={-40}>
            <div style={{ background: COLORS.paperInk, borderRadius: 44, padding: 44, boxShadow: "0 40px 90px rgba(17,24,39,.25)" }}>
              <Donut size={320} slicePct={10} ringColor="#FFFFFF" sliceColor={COLORS.pink} sliceOffset={{ x: 60 * fall, y: 520 * fall, r: 50 * fall }} sliceOpacity={1 - tw(f, 128, 140, 0, 1)} />
            </div>
          </At>
          <At x={300} y={-60}>
            <div style={{ position: "relative", display: "grid", gap: 4 }}>
              <div style={sans(600, 24, { color: COLORS.textMute, letterSpacing: "0.16em", opacity: tw(f, 10, 24, 0, 1) })}>YOUR READERS PAY</div>
              <div style={sans(700, 230, { color: value < 1000 ? COLORS.pink : COLORS.text, letterSpacing: "-0.055em", lineHeight: 1, fontVariantNumeric: "tabular-nums", opacity: Math.min(1, enter(f, 14) * 1.4), filter: enter(f, 14) < 0.9 ? `blur(${(1 - enter(f, 14)) * 14}px)` : undefined })}>${fmt(value)}</div>
              <div style={{ position: "absolute", right: -110, top: -50, transform: `rotate(${-16 * (1 - pill) + 6}deg) scale(${Math.min(1.08, pill)})`, opacity: Math.min(1, pill * 1.5) }}>
                <Badge text="−10% platform fee" color={COLORS.pink} size={30} />
              </div>
              <div style={{ position: "absolute", right: 0, bottom: -50, opacity: tw(f, 150, 160, 0, 1), transform: `scale(${Math.min(1.06, enter(f, 150))})`, transformOrigin: "right center" }}>
                <div style={sans(700, 30, { color: COLORS.pink })}>−$100 every month</div>
              </div>
            </div>
          </At>
          <At y={330}>
            <Typer f={f} start={146} perChar={2} size={66} color={COLORS.text} caretColor={COLORS.pink} lines={[[{ t: "Many platforms take a cut. " }, { t: "Forever.", c: COLORS.pink }]]} />
          </At>
        </Camera>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
