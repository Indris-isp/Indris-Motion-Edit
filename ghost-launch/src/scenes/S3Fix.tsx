import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY } from "../config";
import { drift, easeIn, easeOut, enter, exit, press, tw } from "../anim";
import { At, Background, Camera } from "../components/Stage";
import { Kinetic } from "../components/Kinetic";
import { Cursor } from "../components/Cursor";
import { TOOL_X, TOOL_Y, ToolWindow } from "../components/Tools";
import { BTN, Channel, ED_H, GhostEditor } from "../components/GhostEditor";
import { WIDE, jitter } from "./S2Problem";

const CH_X = [-540, -180, 180, 540];
const CH_Y = 250;
const ED_SMALL = 0.62;
const ED_UP = -110;
const CLICK = 236;

export const S3Fix: React.FC = () => {
  const f = useCurrentFrame();

  // merge: the five windows (one parented group) fly to center and collapse
  const m = tw(f, 0, 42, 0, 1, easeIn);
  const winsOut = 1 - tw(f, 30, 44, 0, 1);
  // editor enters during the last 20% of the merge
  const edIn = enter(f, 32);

  // camera: wide (continuing scene 2) → 1.0 → zoom on the button → back
  const shrink = tw(f, 262, 312, 0, 1);
  const edScale = 1 - (1 - ED_SMALL) * shrink;
  const edY = ED_UP * shrink;
  const zoomIn = tw(f, 186, 228, 0, 1);
  const zoomOut = tw(f, 256, 306, 0, 1);
  const zoom = zoomIn * (1 - zoomOut);
  const camS = tw(f, 0, 50, WIDE, 1) * (1 + 0.3 * zoom);
  const camX = BTN.x * zoom;
  const camY = BTN.y * zoom;

  const typed = Math.floor(tw(f, 78, 78 + COPY.fix.postTitle.length * 2, 0, COPY.fix.postTitle.length, (t) => t));
  const body = [0, 1, 2, 3].map((i) => Math.min(1, enter(f, 132 + i * 4)));
  const caret = f < 180 && Math.floor(f / 16) % 2 === 0;

  const cursorKeys = [
    { f: 150, x: 300, y: 330 },
    { f: 212, x: BTN.x + 10, y: BTN.y + 6 },
    { f: CLICK, x: BTN.x + 10, y: BTN.y + 6, click: true },
    { f: 250, x: BTN.x + 10, y: BTN.y + 6 },
  ];

  return (
    <AbsoluteFill>
      <Background f={f} warm={tw(f, 30, 120, 0.2, 1)} />
      <Camera f={f} scale={camS} x={camX} y={camY} push={0.00006}>
        {winsOut > 0 && TOOL_X.map((tx, i) => {
          const j = jitter(f, i, 1 - m);
          return (
            <At key={i} x={tx * (1 - m) + j.x} y={TOOL_Y * (1 - m) + j.y}>
              <div style={{ opacity: winsOut, transform: `rotate(${j.r}deg) scale(${1 - 0.35 * m})` }}>
                <ToolWindow i={i} priceIn={1 - m} st={{ copiedRow: 0.3, pasted: i === 2 ? 1 : 0, revenue: 900, slice: { x: 0, y: 0, r: 0, o: 0 } }} />
              </div>
            </At>
          );
        })}
        <At y={edY + drift(f, 3, 300)}>
          <div style={{ opacity: Math.min(1, edIn * 1.5), transform: `scale(${(0.86 + 0.14 * edIn) * edScale})` }}>
            <GhostEditor typed={typed} body={body} btnScale={press(f, CLICK)} btnDone={f > CLICK + 10 ? 1 : 0} caret={caret} />
          </div>
        </At>
        {/* channels */}
        {CH_X.map((cx, k) => {
          const e = enter(f, 300 + k * 4);
          const fly = tw(f, 322 + k * 10, 346 + k * 10, 0, 1, easeOut);
          const lit = tw(f, 344 + k * 10, 352 + k * 10, 0, 1);
          return (
            <React.Fragment key={k}>
              <At x={cx} y={CH_Y + (1 - e) * 60 + drift(f, 3, 220, k)}>
                <div style={{ opacity: Math.min(1, e * 1.5) }}><Channel label={COPY.fix.channels[k]} lit={lit} /></div>
              </At>
              {fly > 0 && fly < 1 && (
                <At x={cx * fly} y={ED_UP + (CH_Y - ED_UP) * fly - Math.sin(Math.PI * fly) * 80}>
                  <div style={{ width: 120, height: 72, borderRadius: 10, background: "#FBFBFA", boxShadow: "0 10px 30px rgba(255,61,127,.45)", transform: `scale(${1 - 0.5 * fly}) rotate(${(k - 1.5) * 8 * fly}deg)`, borderTop: `10px solid ${COLORS.pink}` }} />
                </At>
              )}
            </React.Fragment>
          );
        })}
        <Cursor f={f} keys={cursorKeys} opacity={tw(f, 150, 160, 0, 1) * tw(f, 262, 276, 1, 0, easeIn)} />
      </Camera>
      <At y={410}>
        <Kinetic f={f} start={344} lines={[COPY.fix.line]} accent={COPY.fix.accent} size={72} offset={5} exitAt={462} />
      </At>
      <AbsoluteFill style={{ background: COLORS.bg, opacity: tw(f, 466, 480, 0, 1) }} />
    </AbsoluteFill>
  );
};
