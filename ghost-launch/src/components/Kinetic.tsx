import React from "react";
import { COLORS, FONTS } from "../config";
import { enter, exit } from "../anim";

/**
 * Kinetic headline in the ghost.org style: Inter Bold, tight tracking.
 * The accent word is set in Inter Bold Italic (as on ghost.org) and colored: pink for problems, lime for Ghost's answer.
 */
export const Kinetic: React.FC<{
  f: number;
  lines: string[][];
  start: number;
  accent?: string;
  accentColor?: "pink" | "lime" | "purple";
  size?: number;
  offset?: number;
  lineGap?: number;
  exitAt?: number;
  dimLine?: number;
}> = ({ f, lines, start, accent, accentColor = "lime", size = 120, offset = 4, lineGap = 0, exitAt, dimLine }) => {
  let i = 0;
  const out = exitAt !== undefined ? exit(f, exitAt) : 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: lineGap, opacity: out, transform: `translateY(${(1 - out) * -20}px)` }}>
      {lines.map((words, li) => (
        <div key={li} style={{ display: "flex", gap: size * 0.24, whiteSpace: "nowrap" }}>
          {words.map((w) => {
            const p = enter(f, start + offset * i++);
            const isAcc = w === accent;
            return (
              <span
                key={w + i}
                style={{
                  display: "inline-block",
                  fontFamily: FONTS.sans,
                  fontStyle: isAcc ? "italic" : "normal",
                  fontWeight: 700,
                  fontSize: size,
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                  paddingRight: isAcc ? size * 0.04 : 0,
                  color: isAcc ? COLORS[accentColor] : li === dimLine ? COLORS.textMute : COLORS.text,
                  opacity: Math.min(1, Math.max(0, p * 1.6)),
                  transform: `translateY(${(1 - p) * size * 0.55}px) scale(${0.92 + 0.08 * p})`,
                  filter: `blur(${Math.max(0, (1 - p) * 10)}px)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
