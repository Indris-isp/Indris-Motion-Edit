import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { enter, press, tw } from "../anim";
import { At, Background, Camera, sans } from "../components/Stage";
import { Typer } from "../components/Fx";

// FX16 end card: logo, typed tagline with accent word, two pills, URL, light bars
const LETTER_ENDS = [278, 436, 531, 637, 714, 782];
const PRESS = 120;

export const E3Cta: React.FC = () => {
  const f = useCurrentFrame();
  const LOGO_W = 520, k = LOGO_W / 800;
  const step = Math.min(LETTER_ENDS.length, Math.max(0, 1 + Math.floor((f - 4) / 4)));
  const revealPx = f < 4 ? 0 : LETTER_ENDS[step - 1] + 6;
  const b1 = enter(f, 78), b2 = enter(f, 82), url = enter(f, 90);
  return (
    <AbsoluteFill>
      <Background f={f + START.cta} warm={1} bars={1} />
      <Camera f={f} push={0.00018}>
        <At y={-210}>
          <Img src={staticFile("brand/ghost-logo-black.png")} style={{ width: LOGO_W, height: LOGO_W * (294 / 800), clipPath: `inset(0 ${LOGO_W - revealPx * k}px 0 0)` }} />
        </At>
        <At y={-20}>
          <Typer f={f} start={28} perChar={1.4} size={82} lines={[[{ t: "Turn your audience into a " }, { t: "business.", c: COLORS.purple }]]} />
        </At>
        <At y={140}>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ ...sans(700, 32, { color: COLORS.paperInk, letterSpacing: "-0.01em" }), background: COLORS.lime, borderRadius: 999, padding: "20px 38px", boxShadow: `0 0 0 1.5px rgba(17,34,32,.12), 0 16px 36px rgba(120,160,0,${0.25 + 0.15 * tw(f, PRESS, PRESS + 20, 0, 1)})`, opacity: Math.min(1, b1 * 1.4), transform: `translateY(${(1 - b1) * 30}px) scale(${press(f, PRESS)})`, whiteSpace: "nowrap" }}>Start publishing now →</div>
            <div style={{ ...sans(700, 32, { color: COLORS.text, letterSpacing: "-0.01em" }), background: "#fff", borderRadius: 999, padding: "20px 38px", boxShadow: "0 0 0 1.5px rgba(17,34,32,.14), 0 12px 30px rgba(17,24,39,.08)", opacity: Math.min(1, b2 * 1.4), transform: `translateY(${(1 - b2) * 30}px)`, whiteSpace: "nowrap" }}>Try free for 14 days</div>
          </div>
        </At>
        <At y={240}>
          <div style={{ ...sans(600, 28, { color: COLORS.textMute, letterSpacing: "0.02em" }), opacity: Math.min(1, url * 1.4) }}>ghost.org</div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};
