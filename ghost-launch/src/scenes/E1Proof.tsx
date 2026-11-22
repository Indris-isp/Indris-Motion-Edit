import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { easeIn, easeOut, enter, fmt, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Headline } from "../components/Fx";

// FX14 big counter + chips sliding through a highlight lens
const CHIPS = ["Open source", "0% payment fees", "Funded by its users", "You own your data", "Built for independent creators", "No investors"];
const CW = 420;

export const E1Proof: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(tw(f, 6, 66, 0, 100_000_000, easeOut) / 1000) * 1000;
  const out = tw(f, 164, 180, 0, 1, easeIn);
  const lensIn = enter(f, 40);
  const scroll = f * 4.2;
  const total = CHIPS.length * CW;
  return (
    <AbsoluteFill>
      <Background f={f + START.proof} warm={1} bars={0.6} />
      <Camera f={f} push={0.0002}>
        <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 14}px)` : undefined }}>
          <At y={-170}>
            <div style={sans(700, 180, { color: COLORS.text, letterSpacing: "-0.055em", fontVariantNumeric: "tabular-nums", lineHeight: 1, opacity: Math.min(1, enter(f, 2) * 1.4) })}>${fmt(n)}+</div>
          </At>
          <At y={-30}>
            <Headline f={f} start={30} size={50} lines={[["earned", "each", "year", "by", "publications", "on", "Ghost"]]} color={COLORS.textMute} offset={2} />
          </At>
          {/* lens */}
          <At y={190}>
            <div style={{ width: 520, height: 120, borderRadius: 30, background: "rgba(255,255,255,.85)", boxShadow: `0 0 0 2px ${COLORS.purple}33, 0 20px 50px rgba(142,66,255,.18)`, transform: `scale(${Math.min(1.04, lensIn)})`, opacity: Math.min(1, lensIn * 1.4) }} />
          </At>
          <AbsoluteFill style={{ maskImage: "linear-gradient(90deg, transparent 4%, black 22%, black 78%, transparent 96%)", WebkitMaskImage: "linear-gradient(90deg, transparent 4%, black 22%, black 78%, transparent 96%)", opacity: tw(f, 40, 56, 0, 1) }}>
            {Array.from({ length: CHIPS.length * 2 }, (_, k) => {
              let x = ((k * CW - scroll) % (total * 2) + total * 2) % (total * 2) - total + 300;
              const d = Math.abs(x) / 260;
              const inLens = Math.max(0, 1 - d);
              return (
                <At key={k} x={x} y={190}>
                  <div style={{ ...sans(700, 34, { color: inLens > 0.4 ? COLORS.purple : "#475569", letterSpacing: "-0.02em", whiteSpace: "nowrap" }), transform: `scale(${0.9 + 0.25 * inLens})`, opacity: 0.7 + 0.3 * inLens }}>
                    {CHIPS[k % CHIPS.length]}
                  </div>
                </At>
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
