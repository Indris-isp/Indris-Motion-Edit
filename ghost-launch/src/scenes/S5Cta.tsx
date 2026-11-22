import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY } from "../config";
import { drift, easeIn, easeOut, enter, press, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Dashboard } from "../components/Dashboard";
import { GhostLogo } from "../components/UI";
import { DB_SCALE, DB_Y } from "./S4Payoff";

const PRESS = 132;

export const S5Cta: React.FC = () => {
  const f = useCurrentFrame();
  const dbOut = tw(f, 0, 18, 0, 1, easeIn); // exit: 60% of a 30f entrance
  const logoIn = enter(f, 14);
  const wipe = tw(f, 14, 44, 0, 1, easeOut);
  const tag = enter(f, 40);
  const btn = enter(f, 48);
  const sub = enter(f, 54);
  const glow = tw(f, PRESS, PRESS + 30, 0, 1);
  return (
    <AbsoluteFill>
      <Background f={f + 1500} warm={1} />
      {dbOut < 1 && (
        <At y={DB_Y}>
          <div style={{ opacity: 1 - dbOut, transform: `scale(${DB_SCALE * 1.02 * (1 - 0.18 * dbOut)})`, filter: `blur(${dbOut * 8}px)` }}>
            <Dashboard f={359} />
          </div>
        </At>
      )}
      <Camera f={f} push={0.00014}>
        <At y={-190 + drift(f, 4, 280)}>
          <div style={{ opacity: Math.min(1, logoIn * 1.5), transform: `scale(${0.94 + 0.06 * logoIn})` }}>
            <GhostLogo width={560} reveal={wipe} variant="black" />
          </div>
        </At>
        <At y={10 + drift(f, 3, 280, 1)}>
          <div style={{ ...sans(700, 66, { letterSpacing: "-0.035em", whiteSpace: "nowrap", color: COLORS.text }), opacity: Math.min(1, tag * 1.5), transform: `translateY(${(1 - tag) * 28}px)` }}>
            {COPY.cta.tagline}
          </div>
        </At>
        <At y={160 + drift(f, 3, 280, 2)}>
          <div
            style={{
              ...sans(700, 32, { color: COLORS.paperInk, letterSpacing: "-0.01em" }), background: COLORS.lime, borderRadius: 12, padding: "22px 40px",
              opacity: Math.min(1, btn * 1.5), transform: `translateY(${(1 - btn) * 30}px) scale(${press(f, PRESS)})`,
              boxShadow: `0 0 0 1.5px rgba(17,34,32,.12), 0 16px ${36 + 24 * glow}px rgba(120,160,0,${0.22 + 0.15 * glow})`, whiteSpace: "nowrap",
            }}
          >
            {COPY.cta.button} →
          </div>
        </At>
        <At y={262 + drift(f, 3, 280, 3)}>
          <div style={{ ...sans(500, 24, { color: COLORS.textMute, whiteSpace: "nowrap" }), opacity: Math.min(1, sub * 1.5) }}>{COPY.cta.sub}</div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};
