import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, START } from "../config";
import { count, easeIn, easeOut, enter, fmt, tw } from "../anim";
import { At, Background, sans } from "../components/Stage";
import { Avatar, Badge, Chip, Typer } from "../components/Fx";
import { Donut } from "../components/UI";

// FX09 greyscale faces + toggle + circular wipe · FX07 pill · FX03 typewriter
const SP = 150, SZ = 118, COLS = 15, ROWS = 9;
const hash = (k: number) => { const x = Math.sin(k * 91.7 + 13.3) * 9999; return x - Math.floor(x); };
const TOGGLE = 50;

export const D2Paid: React.FC = () => {
  const f = useCurrentFrame();
  const knob = tw(f, TOGGLE, TOGGLE + 10, 0, 1, easeOut);
  const ripple = tw(f, TOGGLE + 4, 118, 0, 1100);
  const wipe = tw(f, 120, 156, 0, 1, easeIn);
  const out = tw(f, 222, 240, 0, 1, easeIn);
  const snap = enter(f, 158);
  const value = count(f, 160, 900, 1000, 50);
  return (
    <AbsoluteFill>
      {/* layer 1: faces wall */}
      <AbsoluteFill style={{ background: "#F7F7FA" }}>
        {Array.from({ length: COLS * ROWS }, (_, n) => {
          const c = n % COLS, r = Math.floor(n / COLS);
          const x = (c - (COLS - 1) / 2) * SP + (r % 2 ? SP / 2 : 0);
          const y = (r - (ROWS - 1) / 2) * (SP * 0.9);
          const d = Math.hypot(x, y);
          const chosen = hash(n) < 0.3 && d > 160;
          const on = chosen ? tw(ripple - d, 0, 120, 0, 1) : 0;
          const p = enter(f, 2 + d / 60);
          return (
            <At key={n} x={x} y={y + (1 - Math.min(1, p)) * 30}>
              <div style={{ position: "relative", opacity: Math.min(1, p * 1.4), transform: `scale(${1 + 0.08 * on})` }}>
                <Avatar i={n} size={SZ} grey={1 - on} ring={on > 0.5} />
                {chosen && hash(n + 7) < 0.55 && on > 0.3 && (
                  <div style={{ position: "absolute", right: -16, bottom: -6, transform: `scale(${Math.min(1.1, on * 1.2)})` }}>
                    <Badge text="$5/mo" color={COLORS.purple} size={15} />
                  </div>
                )}
              </div>
            </At>
          );
        })}
        <At>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 999, padding: "18px 26px", boxShadow: "0 20px 50px rgba(17,24,39,.18)", transform: `scale(${Math.min(1.06, enter(f, 14)) * (f >= TOGGLE && f < TOGGLE + 8 ? 0.96 : 1)})` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.paperInk, display: "grid", placeItems: "center", ...sans(700, 22, { color: "#fff" }) }}>$</div>
            <span style={sans(700, 30, { color: COLORS.text, letterSpacing: "-0.02em" })}>Paid memberships</span>
            <div style={{ width: 76, height: 42, borderRadius: 21, background: knob > 0.5 ? COLORS.purple : "#D6D8DD", position: "relative" }}>
              <div style={{ position: "absolute", top: 4, left: 4 + 34 * knob, width: 34, height: 34, borderRadius: 17, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} />
            </div>
          </div>
        </At>
        <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)" }}>
          <Chip text="FIXES PROBLEM 2" tone="purple" />
        </At>
      </AbsoluteFill>

      {/* layer 2: circular wipe reveal */}
      <AbsoluteFill style={{ clipPath: `circle(${wipe * 1200}px at 50% 50%)`, opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 14}px)` : undefined }}>
        <Background f={f + START.paid} warm={1} bars={0.6} />
        <At x={-800} y={-420} style={{ transform: "translate(0,-50%) translate(-800px,-420px)" }}>
          <Chip text="FIXES PROBLEM 2" tone="purple" />
        </At>
        <At y={-250}>
          <div style={{ display: "flex", gap: 28 }}>
            {[["Free", "$0"], ["Supporter", "$5/mo"], ["Insider", "$12/mo"]].map(([k, v], i) => {
              const p = enter(f, 134 + i * 4);
              const hl = i === 1;
              return (
                <div key={k} style={{ width: 290, padding: "24px 28px", borderRadius: 24, background: "#fff", boxShadow: hl ? `0 0 0 4px ${COLORS.purple}, 0 20px 40px rgba(142,66,255,.2)` : "0 14px 34px rgba(17,24,39,.10)", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px) scale(${hl ? 1.04 : 1})` }}>
                  <div style={sans(600, 22, { color: hl ? COLORS.purple : COLORS.textMute })}>{k}</div>
                  <div style={sans(700, 52, { color: COLORS.text, letterSpacing: "-0.04em" })}>{v}</div>
                </div>
              );
            })}
          </div>
        </At>
        <At y={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Donut size={190} slicePct={10} ringColor={COLORS.paperInk} sliceColor={COLORS.lime} sliceOffset={{ x: (1 - snap) * 40, y: (1 - snap) * 300, r: (1 - snap) * 40 }} sliceOpacity={Math.min(1, snap * 2)} />
            <div style={{ display: "grid", gap: 8 }}>
              <div style={sans(700, 120, { color: COLORS.text, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" })}>${fmt(value)}</div>
              <div style={{ transform: `scale(${Math.min(1.08, enter(f, 184))})`, transformOrigin: "left center", opacity: tw(f, 184, 190, 0, 1) }}>
                <span style={{ ...sans(700, 24, { color: COLORS.paperInk }), background: COLORS.lime, borderRadius: 999, padding: "8px 18px", boxShadow: "0 0 0 1.5px rgba(17,34,32,.12)" }}>0% payment fees</span>
              </div>
            </div>
          </div>
        </At>
        <At y={310}>
          <Typer f={f} start={160} perChar={2} size={92} lines={[[{ t: "You keep " }, { t: "100%.", c: COLORS.purple }]]} />
        </At>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
