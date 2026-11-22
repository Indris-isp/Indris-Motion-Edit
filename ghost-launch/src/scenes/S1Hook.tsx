import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY } from "../config";
import { count, drift, enter, exit, tw, easeOut } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Kinetic } from "../components/Kinetic";
import { FeedCard } from "../components/UI";

const STEP = 250; // card height + gap
const INSERTS = 7;

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  // new posts drop in above yours and push it down, out of sight
  const p = Array.from({ length: INSERTS }, (_, k) => enter(f, 22 + 12 * k));
  const sumTo = (k: number) => p.slice(0, k + 1).reduce((a, b) => a + b, 0);
  const yMine = STEP * sumTo(INSERTS - 1) - 40;
  const feedDim = tw(f, 96, 130, 1, 0.22);
  const feedBlur = tw(f, 96, 130, 0, 6);
  const out = exit(f, 222);

  const reachIn = enter(f, 34);
  const reach = count(f, 40, COPY.hook.reachFrom, COPY.hook.reachTo);

  return (
    <AbsoluteFill>
      <Background f={f} warm={0} />
      <Camera f={f} scale={1} push={0.00025}>
        <AbsoluteFill style={{ opacity: feedDim * out, filter: `blur(${feedBlur}px) saturate(.6)` }}>
          <At y={yMine + drift(f, 3, 200)}>
            <FeedCard mine seed={0} />
          </At>
          {p.map((pk, k) => (
            <At key={k} y={STEP * (sumTo(k) - 1) - 40 + drift(f, 3, 200)}>
              <div style={{ opacity: Math.min(1, pk * 1.4), transform: `scale(${0.9 + 0.1 * pk})` }}>
                <FeedCard seed={k + 1} />
              </div>
            </At>
          ))}
        </AbsoluteFill>
        <At y={0}>
          <Kinetic f={f} start={108} lines={[COPY.hook.l1, COPY.hook.l2]} accent={COPY.hook.accent} size={150} offset={5} dimLine={1} exitAt={222} />
        </At>
      </Camera>
      {/* reach counter, top-right, inside the 5% title-safe area */}
      <At x={650} y={-420} style={{ opacity: Math.min(1, reachIn) * out, transform: `translate(-50%,-50%) translate(650px, ${-420 + (1 - reachIn) * 20}px)` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, width: 300 }}>
          <div style={sans(600, 18, { color: COLORS.mute, letterSpacing: "0.14em" })}>REACH</div>
          <div style={sans(800, 64, { letterSpacing: "-0.04em", color: reach < 50 ? COLORS.pink : COLORS.ink, fontVariantNumeric: "tabular-nums" })}>{reach}%</div>
          <div style={{ width: 300, height: 8, borderRadius: 4, background: COLORS.panel2, overflow: "hidden" }}>
            <div style={{ width: `${tw(f, 40, 100, 100, 6, easeOut)}%`, height: "100%", background: COLORS.pink, marginLeft: "auto" }} />
          </div>
        </div>
      </At>
    </AbsoluteFill>
  );
};
