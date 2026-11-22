import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { easeIn, enter, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Avatar, AvatarStack, Badge, Icon, Tile, Typer } from "../components/Fx";

// FX06 bento grid dolly · FX10 inline avatars · FX03 typewriter
const COLS = 9, ROWS = 5, T = 170, G = 26;
type Cell = { kind: "av" | "icon" | "pub" | "empty"; i?: number; icon?: string; label?: string; badge?: string; bg?: string };
const LAYOUT: Record<string, Cell> = {
  "0,1": { kind: "av", i: 0, label: "Writer" },
  "1,3": { kind: "icon", icon: "news", label: "Local news", badge: "+48" },
  "2,0": { kind: "pub", label: "The Weekly Note" },
  "3,2": { kind: "av", i: 3 },
  "4,4": { kind: "icon", icon: "mic", label: "Podcaster", bg: COLORS.paperInk },
  "5,1": { kind: "av", i: 5, label: "Journalist", badge: "+12" },
  "6,3": { kind: "icon", icon: "palette", label: "Artist" },
  "7,0": { kind: "av", i: 7 },
  "8,2": { kind: "icon", icon: "video", label: "YouTuber", badge: "+9" },
  "1,0": { kind: "icon", icon: "pen" },
  "6,1": { kind: "av", i: 9 },
  "2,4": { kind: "av", i: 2, label: "Newsletter" },
  "7,4": { kind: "pub", label: "Field Notes" },
  "0,3": { kind: "icon", icon: "heart", bg: COLORS.purple },
  "4,0": { kind: "av", i: 4 },
  "8,4": { kind: "av", i: 10 },
};

export const A2Who: React.FC = () => {
  const f = useCurrentFrame();
  const dim = tw(f, 84, 112, 0, 1);
  const out = tw(f, 192, 210, 0, 1, easeIn);
  const gx = tw(f, 0, 210, 160, -160, (t) => t);
  const gs = 1.08 - 0.06 * tw(f, 0, 210, 0, 1, (t) => t) + 0.5 * out;
  const gridW = COLS * T + (COLS - 1) * G, gridH = ROWS * T + (ROWS - 1) * G;
  return (
    <AbsoluteFill>
      <Background f={f + START.who} warm={0.7} bars={0.5} />
      <AbsoluteFill style={{ opacity: 1 - 0.65 * dim, filter: `blur(${dim * 7 + out * 10}px)`, transform: `translateX(${gx}px) scale(${gs})` }}>
        <At>
          <div style={{ position: "relative", width: gridW, height: gridH }}>
            {Array.from({ length: COLS * ROWS }, (_, n) => {
              const c = n % COLS, r = Math.floor(n / COLS);
              const cell = LAYOUT[`${c},${r}`];
              const d = Math.hypot(c - (COLS - 1) / 2, r - (ROWS - 1) / 2);
              const p = enter(f, 2 + d * 5);
              const filled = !!cell;
              return (
                <div key={n} style={{ position: "absolute", left: c * (T + G), top: r * (T + G), opacity: Math.min(1, p * 1.5), transform: `scale(${0.7 + 0.3 * p})` }}>
                  <Tile size={T} filled={filled} bg={cell?.bg}>
                    {cell?.kind === "av" && <Avatar i={cell.i ?? 0} size={T * 0.72} ring={false} />}
                    {cell?.kind === "icon" && <Icon name={cell.icon!} size={T * 0.42} color={cell.bg ? "#fff" : COLORS.text} />}
                    {cell?.kind === "pub" && (
                      <div style={{ width: T * 0.8, display: "grid", gap: 8 }}>
                        <div style={sans(700, 18, { color: COLORS.text, letterSpacing: "-0.02em" })}>{cell.label}</div>
                        <div style={{ height: 8, borderRadius: 4, background: "#E5E7EB" }} />
                        <div style={{ height: 8, width: "70%", borderRadius: 4, background: "#E5E7EB" }} />
                        <div style={{ height: 30, borderRadius: 8, background: COLORS.paperInk, ...sans(600, 13, { color: "#fff" }), display: "grid", placeItems: "center" }}>Subscribe</div>
                      </div>
                    )}
                  </Tile>
                  {cell?.label && cell.kind !== "pub" && (
                    <div style={{ position: "absolute", left: T * 0.5, bottom: -14, transform: `translateX(-50%) scale(${Math.min(1, enter(f, 30 + d * 5))})` }}>
                      <div style={{ ...sans(600, 15, { color: "#fff" }), background: COLORS.paperInk, borderRadius: 999, padding: "5px 12px", whiteSpace: "nowrap" }}>{cell.label}</div>
                    </div>
                  )}
                  {cell?.badge && (
                    <div style={{ position: "absolute", right: -10, top: -10, transform: `scale(${Math.min(1.1, enter(f, 40 + d * 6))})` }}>
                      <Badge text={cell.badge} color={COLORS.purple} size={17} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </At>
      </AbsoluteFill>
      <Camera f={f} push={0.0002}>
        <At y={0}>
          <Typer
            f={f} start={96} perChar={2} size={112} exitAt={192}
            lines={[[{ t: "You’re building" }], [{ t: "an" }, { node: <AvatarStack n={4} size={92} from={2} />, w: 3 }, { t: "audience.", c: COLORS.purple }]]}
          />
        </At>
      </Camera>
    </AbsoluteFill>
  );
};
