import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, COPY, START } from "../config";
import { count, easeIn, easyEase, enter, fmt, press, tw } from "../anim";
import { At, Background, sans } from "../components/Stage";
import { AvatarStack, Chip, Laptop, MotionBlurDefs, Typer, mb, whip } from "../components/Fx";
import { GhostEditor } from "../components/GhostEditor";
import { Cursor } from "../components/Cursor";
import { GhostOrb } from "../components/UI";

// FX11 3D laptop + DOF zoom + whip pan · FX10 inline avatars · FX03 typewriter
const CLICK = 116;
const ED_SCALE = 1056 / 1280;
// Publish button in laptop coordinates relative to the laptop centre (see GhostEditor BTN)
const BTN_L = { x: 22 + 528 + (640 - 172) * ED_SCALE - 550, y: 22 + 297 + (-360 + 34) * ED_SCALE - 345 };
const LAP_SCALE = 0.82;

export const D1Publish: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = enter(f, 0);
  const rx = 24 - 15 * tilt, ry = -26 + 18 * tilt;
  const typed = Math.floor(tw(f, 30, 30 + COPY.fix.postTitle.length * 2, 0, COPY.fix.postTitle.length, (t) => t));
  const body = [0, 1, 2, 3].map((i) => Math.min(1, enter(f, 76 + i * 4)));
  const zoom = tw(f, 92, 124, 0, 1, easyEase);
  const dof = zoom * (1 - tw(f, 128, 136, 0, 1));
  const zs = 1 + 0.95 * zoom;
  const lapOut = whip(f, 130, 20, -1900, "out");
  const inbIn = whip(f, 134, 22, 1700, "in");
  const out = tw(f, 222, 240, 0, 1, easeIn);
  const delivered = count(f, 150, 0, 2480, 60);
  // cursor in screen coords (laptop centre at y=-30)
  const bx = BTN_L.x * LAP_SCALE, by = -30 + BTN_L.y * LAP_SCALE;
  const keys = [
    { f: 80, x: 260, y: 330 },
    { f: 112, x: bx + 8, y: by + 6 },
    { f: CLICK, x: bx + 8, y: by + 6, click: true },
    { f: 130, x: bx + 8, y: by + 6 },
  ];
  return (
    <AbsoluteFill>
      <Background f={f + START.publish} warm={1} bars={0.6} />
      <MotionBlurDefs id="mbL" x={lapOut.blur} />
      <MotionBlurDefs id="mbI" x={inbIn.blur} />
      <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)", zIndex: 5 }}>
        <Chip text="FIXES PROBLEM 1" tone="purple" />
      </At>
      {/* laptop group: zooms toward the button, then whips out left */}
      <AbsoluteFill style={{ transform: `translateX(${lapOut.x}px) scale(${zs})`, transformOrigin: `${960 + bx}px ${540 + by}px`, filter: mb("mbL", lapOut.blur) }}>
        <At y={-30 + (1 - tilt) * 220}>
          <div style={{ transform: `scale(${LAP_SCALE})`, opacity: Math.min(1, tilt * 1.5) }}>
            <Laptop rx={rx} ry={ry}>
              <div style={{ width: 1280, height: 720, transform: `scale(${ED_SCALE})`, transformOrigin: "top left" }}>
                <GhostEditor typed={typed} body={body} btnScale={press(f, CLICK)} btnDone={f > CLICK + 6 ? 1 : 0} caret={f < 90 && Math.floor(f / 14) % 2 === 0} />
              </div>
            </Laptop>
          </div>
        </At>
        <Cursor f={f} keys={keys} opacity={tw(f, 80, 88, 0, 1)} />
      </AbsoluteFill>
      {/* depth-of-field: blur everything except the focus point */}
      <AbsoluteFill style={{ backdropFilter: `blur(${dof * 12}px)`, WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 18%, black 55%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 18%, black 55%)", pointerEvents: "none" }} />

      {/* inboxes */}
      <AbsoluteFill style={{ transform: `translateX(${inbIn.x}px) scale(${1 + 0.25 * out})`, filter: [mb("mbI", inbIn.blur), out > 0.01 ? `blur(${out * 14}px)` : ""].filter(Boolean).join(" ") || undefined, opacity: f < 134 ? 0 : 1 - out }}>
        <At y={-250}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "12px 24px", boxShadow: "0 10px 30px rgba(17,24,39,.10)" }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.green }} />
            <span style={sans(600, 26, { color: COLORS.textMute })}>Delivered to</span>
            <span style={sans(700, 28, { color: COLORS.text, fontVariantNumeric: "tabular-nums" })}>{fmt(delivered)}</span>
            <span style={sans(600, 26, { color: COLORS.textMute })}>subscribers</span>
          </div>
        </At>
        {[0, 1, 2].map((k) => {
          const p = enter(f, 146 + k * 6);
          return (
            <At key={k} x={(k - 1) * 40} y={-90 + k * 112}>
              <div style={{ width: 760, display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 22, padding: "18px 24px", boxShadow: "0 16px 40px rgba(17,24,39,.12)", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px) scale(${0.96 + 0.04 * p})` }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: COLORS.paperInk, display: "grid", placeItems: "center" }}><GhostOrb size={36} /></div>
                <div style={{ flex: 1, display: "grid", gap: 2 }}>
                  <div style={sans(700, 22, { color: COLORS.text })}>Riverside Daily</div>
                  <div style={sans(500, 20, { color: COLORS.textMute })}>{COPY.fix.postTitle}</div>
                </div>
                <div style={sans(500, 18, { color: COLORS.textMute })}>now</div>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.purple }} />
              </div>
            </At>
          );
        })}
        <At y={330}>
          <Typer f={f} start={164} perChar={2} size={78} lines={[[{ t: "Straight to" }, { node: <AvatarStack n={4} size={70} from={5} />, w: 3 }, { t: "every inbox.", c: COLORS.purple }]]} />
        </At>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
