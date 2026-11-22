import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { easeOut, easyEase, enter, tw } from "../anim";
import { At, Background, sans } from "../components/Stage";
import { Headline } from "../components/Fx";

// FX08 star-to-logo reveal: navy starfield → sparkle draws a glowing ring → Ghost orb → flash to white → wordmark types in.
const R = 150;
const LETTER_ENDS = [278, 436, 531, 637, 714, 782]; // orb, g, h, o, s, t (px in the 800-wide logo)

const Sparkle: React.FC<{ size: number; glow?: number }> = ({ size, glow = 1 }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${12 * glow}px #B9A4FF) drop-shadow(0 0 ${30 * glow}px #8E42FF)` }}>
    <path d="M0 -46 C4 -8 8 -4 46 0 C8 4 4 8 0 46 C-4 8 -8 4 -46 0 C-8 -4 -4 -8 0 -46 Z" fill="#fff" />
  </svg>
);

const rand = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const C1Meet: React.FC = () => {
  const f = useCurrentFrame();
  // timeline (local frames)
  const travel = tw(f, 6, 40, 0, 1, easeOut); // sparkle flies in
  const trace = tw(f, 40, 80, 0, 1, easyEase); // draws the ring
  const morph = tw(f, 78, 96, 0, 1); // ring → orb
  const flash = tw(f, 92, 100, 0, 1) * (1 - tw(f, 100, 112, 0, 1));
  const white = f >= 100;

  // sparkle position: travels from top-left to ring start (top of circle), then rides the ring
  const ang = -Math.PI / 2 + trace * Math.PI * 2;
  const sx = f < 40 ? -700 + 700 * travel : Math.cos(ang) * R;
  const sy = f < 40 ? -380 + (380 - R) * travel : Math.sin(ang) * R;
  const C = 2 * Math.PI * R;

  // white phase: logo types in (orb first, then letters)
  const lf = f - 104;
  const step = lf < 0 ? 0 : Math.min(LETTER_ENDS.length, 1 + Math.floor(lf / 5));
  const revealPx = step === 0 ? 0 : LETTER_ENDS[step - 1] + 6;
  const logoIn = enter(f, 104);
  const LOGO_W = 640, k = LOGO_W / 800;

  return (
    <AbsoluteFill>
      {!white ? (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 45%, #141B4A 0%, #0A0E2A 45%, #04060F 100%)" }}>
          {Array.from({ length: 140 }, (_, i) => {
            const x = rand(i) * 1920, y = rand(i + 500) * 1080, s = 1 + rand(i + 900) * 2.2;
            const tw2 = 0.35 + 0.65 * Math.abs(Math.sin(f / (14 + rand(i + 77) * 20) + i));
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: "#fff", opacity: tw2 * 0.8 }} />;
          })}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(142,66,255,${0.25 * trace + 0.35 * morph}), transparent 45%)` }} />
          <At>
            <svg width={600} height={600} viewBox="-300 -300 600 600" style={{ overflow: "visible", opacity: 1 - morph }}>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <circle r={R} fill="none" stroke="#B9A4FF" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${C * trace} ${C}`} transform="rotate(-90)" filter="url(#glow)" />
              <circle r={R} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeDasharray={`${C * trace} ${C}`} transform="rotate(-90)" />
            </svg>
          </At>
          {/* orb resolves from the ring, with lens glow and rays */}
          <At>
            <div style={{ opacity: morph, transform: `scale(${0.9 + 0.1 * morph}) rotate(${f * 0.4}deg)`, filter: `drop-shadow(0 0 30px rgba(185,164,255,.9)) drop-shadow(0 0 80px rgba(142,66,255,.8))` }}>
              <Img src={staticFile("brand/ghost-orb.png")} style={{ width: R * 2.3, height: R * 2.3, filter: "invert(1)" }} />
            </div>
          </At>
          <At x={sx} y={sy}>
            <div style={{ opacity: 1 - morph * 0.6, transform: `rotate(${f * 3}deg)` }}><Sparkle size={70 + 30 * Math.sin(f / 5)} glow={1 + trace} /></div>
          </At>
          {/* light streak */}
          <At x={sx} y={sy}><div style={{ width: 600, height: 3, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)", opacity: 0.6 + 0.4 * morph, filter: "blur(1px)" }} /></At>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <Background f={f + START.meet} warm={1} bars={0.75} />
          <At y={-150}>
            <div style={{ position: "relative", width: LOGO_W, height: LOGO_W * (294 / 800), transform: `scale(${0.94 + 0.06 * Math.min(1, logoIn)})` }}>
              <Img src={staticFile("brand/ghost-logo-black.png")} style={{ width: LOGO_W, height: LOGO_W * (294 / 800), clipPath: `inset(0 ${LOGO_W - revealPx * k}px 0 0)` }} />
              {step < LETTER_ENDS.length + 1 && f < 175 && (
                <div style={{ position: "absolute", left: revealPx * k + 6, top: LOGO_W * 0.11, width: 6, height: LOGO_W * 0.2, borderRadius: 3, background: COLORS.purple, opacity: step < LETTER_ENDS.length || Math.floor(f / 18) % 2 === 0 ? 1 : 0 }} />
              )}
            </div>
          </At>
          <At y={90}>
            <Headline f={f} start={142} size={64} lines={[["One", "platform", "to", "publish,", "send", "newsletters"], ["and", "get", "paid", "by", "your", "readers."]]} accentLine={1} accent="purple" offset={2} lineHeight={1.12} />
          </At>
          <At y={250}>
            <div style={{ ...sans(500, 28, { color: COLORS.textMute, letterSpacing: "0.02em" }), opacity: tw(f, 175, 190, 0, 1) }}>Open source · Built for independent creators</div>
          </At>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
