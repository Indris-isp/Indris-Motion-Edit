import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY } from "../config";
import { enter, exit, tw } from "../anim";
import { At, Background, Camera } from "../components/Stage";
import { Kinetic } from "../components/Kinetic";
import { Dashboard, REV } from "../components/Dashboard";

export const DB_Y = -70;
export const DB_SCALE = 0.92;

export const S4Payoff: React.FC = () => {
  const f = useCurrentFrame();
  const pull = tw(f, 20, 95, 0, 1);
  const camS = 1.15 + (1 - 1.15) * pull;
  const camX = REV.x * DB_SCALE * (1 - pull);
  const camY = (DB_Y + REV.y * DB_SCALE) * (1 - pull);
  const inA = tw(f, 0, 14, 0, 1);
  const hold = 1 + 0.02 * tw(f, 0, 360, 0, 1, (t) => t); // slow drift 1 → 1.02
  return (
    <AbsoluteFill>
      <Background f={f + 480} warm={1} />
      <Camera f={f} scale={camS} x={camX} y={camY} push={0.00004}>
        <At y={DB_Y}>
          <div style={{ opacity: inA, transform: `scale(${DB_SCALE * hold})` }}>
            <Dashboard f={f} />
          </div>
        </At>
      </Camera>
      <At y={415}>
        <Kinetic f={f} start={150} lines={[COPY.payoff.line]} accent={COPY.payoff.accent} size={72} offset={5} exitAt={342} />
      </At>
    </AbsoluteFill>
  );
};
