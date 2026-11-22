import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY } from "../config";
import { count, drift, easeIn, enter, exit, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Kinetic } from "../components/Kinetic";
import { Cursor } from "../components/Cursor";
import { TOOL_X, TOOL_Y, ToolWindow } from "../components/Tools";
import { Pill } from "../components/UI";

export const WIDE = 0.56;

/** Camera path: wide → Members → Email → Payments → wide. All easy-ease. */
const cam = (f: number) => {
  const keys: [number, number, number][] = [
    [0, WIDE, 0], [45, WIDE, 0], [95, 1, TOOL_X[1]], [115, 1, TOOL_X[1]], [172, 1, TOOL_X[2]], [190, 1, TOOL_X[2]], [242, 1, TOOL_X[3]], [305, 1, TOOL_X[3]], [355, WIDE, 0],
  ];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, s0, x0] = keys[i], [f1, s1, x1] = keys[i + 1];
    if (f <= f1) return { s: tw(f, f0, f1, s0, s1), x: tw(f, f0, f1, x0, x1) };
  }
  return { s: WIDE, x: 0 };
};

/** Jitter once the stack is shown whole: tangled, stressed. */
export const jitter = (f: number, i: number, amt: number) => ({
  x: amt * 6 * Math.sin(f * 0.9 + i * 2.1), y: amt * 5 * Math.cos(f * 1.1 + i), r: amt * (i % 2 ? 2.2 : -2.6) + amt * 0.6 * Math.sin(f * 0.7 + i),
});

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();
  const { s, x } = cam(f);
  const stress = tw(f, 300, 350, 0, 1);

  const copied = tw(f, 104, 112, 0, 1) * tw(f, 200, 230, 1, 0.3);
  const pasted = enter(f, 180);
  const revenue = count(f, 252, COPY.problem.revenue, COPY.problem.revenue * (1 - COPY.problem.feePct / 100));
  const fall = tw(f, 252, 300, 0, 1, easeIn);
  const slice = { x: 40 * fall, y: 420 * fall, r: 40 * fall, o: 1 - tw(f, 285, 300, 0, 1) };

  // cursor (world coords, relative to canvas center)
  const keys = [
    { f: 55, x: -380, y: 260 },
    { f: 100, x: TOOL_X[1] - 120, y: TOOL_Y - 92 },
    { f: 104, x: TOOL_X[1] - 120, y: TOOL_Y - 92, click: true },
    { f: 120, x: TOOL_X[1] - 120, y: TOOL_Y - 92 },
    { f: 174, x: TOOL_X[2] - 60, y: TOOL_Y + 50 },
    { f: 178, x: TOOL_X[2] - 60, y: TOOL_Y + 50, click: true },
    { f: 194, x: TOOL_X[2] - 60, y: TOOL_Y + 50 },
    { f: 246, x: TOOL_X[3] - 70, y: TOOL_Y + 60 },
    { f: 250, x: TOOL_X[3] - 70, y: TOOL_Y + 60, click: true },
  ];
  const cursorOut = tw(f, 300, 318, 1, 0, easeIn);
  const copiedTip = tw(f, 106, 114, 0, 1) * tw(f, 150, 162, 1, 0);

  return (
    <AbsoluteFill>
      <Background f={f} warm={0} parallax={x} />
      <Camera f={f} scale={s} x={x} push={0.00008}>
        {/* tangled lines between tools */}
        <svg width={3200} height={1400} viewBox="-1600 -700 3200 1400" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -1600, marginTop: -700, opacity: stress * 0.9 }}>
          {[[0, 2], [1, 3], [2, 4], [0, 3], [1, 4], [0, 4]].map(([a, b], k) => {
            const xa = TOOL_X[a], xb = TOOL_X[b];
            const bend = (k % 2 ? 1 : -1) * (260 + k * 40);
            const len = 4000;
            return (
              <path key={k} d={`M ${xa} ${TOOL_Y} Q ${(xa + xb) / 2} ${TOOL_Y + bend} ${xb} ${TOOL_Y}`} fill="none" stroke={k === 3 ? COLORS.pink : COLORS.faint} strokeWidth={4} strokeDasharray={len} strokeDashoffset={len * (1 - tw(f, 300 + k * 4, 345 + k * 4, 0, 1))} />
            );
          })}
        </svg>
        {TOOL_X.map((tx, i) => {
          const e = enter(f, 4 + i * 4);
          const j = jitter(f, i, stress);
          return (
            <At key={i} x={tx + j.x} y={TOOL_Y + (1 - e) * -260 + j.y + drift(f, 4, 260, i)}>
              <div style={{ opacity: Math.min(1, e * 1.5), transform: `rotate(${j.r}deg)` }}>
                <ToolWindow i={i} priceIn={enter(f, 30 + i * 4)} st={{ copiedRow: copied, pasted: i === 2 ? pasted : 0, revenue, slice }} />
              </div>
            </At>
          );
        })}
        <At x={TOOL_X[1] - 120} y={TOOL_Y - 232} style={{ opacity: copiedTip }}>
          <Pill bg={COLORS.pink} size={18}>Copied</Pill>
        </At>
        <Cursor f={f} keys={keys} opacity={tw(f, 55, 65, 0, 1) * cursorOut} />
      </Camera>
      <At y={370}>
        <Kinetic f={f} start={315} lines={[COPY.problem.line.slice(0, 4), COPY.problem.line.slice(4)]} accent={COPY.problem.accent} size={76} offset={4} lineGap={2} exitAt={402} />
      </At>
      <At y={-170} style={{ opacity: tw(f, 300, 320, 0, 1) * exit(f, 402) }}>
        <div style={sans(600, 20, { color: COLORS.mute, letterSpacing: "0.16em" })}>$121 / MONTH · BEFORE THE {COPY.problem.feePct}% CUT</div>
      </At>
    </AbsoluteFill>
  );
};
