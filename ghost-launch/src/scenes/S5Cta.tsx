import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY } from "../config";
import { drift, easeIn, enter, press, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Dashboard } from "../components/Dashboard";
import { GhostWordmark } from "../components/UI";
import { DB_SCALE, DB_Y } from "./S4Payoff";

const PRESS = 132;

export const S5Cta: React.FC = () => {
  const f = useCurrentFrame();
  const dbOut = tw(f, 0, 18, 0, 1, easeIn); // exit: 60% of a 30f entrance
  const letters = [0, 1, 2, 3, 4].map((i) => enter(f, 16 + i * 3));
  const tag = enter(f, 44);
  const btn = enter(f, 52);
  const glow = tw(f, PRESS, PRESS + 30, 0, 1);
  return (
    <AbsoluteFill>
      <Background f={f + 840} warm={1} />
      {dbOut < 1 && (
        <At y={DB_Y}>
          <div style={{ opacity: 1 - dbOut, transform: `scale(${DB_SCALE * 1.02 * (1 - 0.18 * dbOut)})`, filter: `blur(${dbOut * 8}px)` }}>
            <Dashboard f={359} />
          </div>
        </At>
      )}
      <Camera f={f} push={0.00014}>
        <At y={-70 + drift(f, 4, 280)}>
          <GhostWordmark size={230} letters={letters} />
        </At>
        <At y={90 + drift(f, 3, 280, 1)}>
          <div style={{ ...sans(500, 34, { color: COLORS.mute, letterSpacing: "-0.01em", whiteSpace: "nowrap" }), opacity: Math.min(1, tag * 1.5), transform: `translateY(${(1 - tag) * 24}px)` }}>
            {COPY.cta.tagline}
          </div>
        </At>
        <At y={210 + drift(f, 3, 280, 2)}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 18, background: COLORS.pink, borderRadius: 16, padding: "22px 40px",
              opacity: Math.min(1, btn * 1.5), transform: `translateY(${(1 - btn) * 30}px) scale(${press(f, PRESS)})`,
              boxShadow: `0 16px ${40 + 30 * glow}px rgba(255,61,127,${0.3 + 0.2 * glow})`,
            }}
          >
            <span style={sans(700, 32)}>{COPY.cta.button}</span>
            <span style={sans(500, 32, { opacity: 0.8 })}>· {COPY.cta.url}</span>
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};
