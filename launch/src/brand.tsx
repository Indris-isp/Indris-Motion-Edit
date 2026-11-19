/* Logo, backdrop and font loading. */
import React from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, COPY } from './config';
import { clamp, drift, prog, pop } from './lib';

/* ---------- fonts: block the first frame until every face is loaded ---------- */
const FACES: [string, string, string, string][] = [
  ['Inter', 'Inter-400.ttf', '400', 'normal'],
  ['Inter', 'Inter-500.ttf', '500', 'normal'],
  ['Inter', 'Inter-600.ttf', '600', 'normal'],
  ['Inter', 'Inter-700.ttf', '700', 'normal'],
  ['Inter', 'Inter-800.ttf', '800', 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Italic.ttf', '400', 'italic'],
  ['Instrument Serif', 'InstrumentSerif-Regular.ttf', '400', 'normal'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(
    FACES.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile('fonts/' + file)})`, { weight, style });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch((e) => {
      throw e; // a fallback font is a bug: fail the render
    });
}

/* ---------- the ISP mark: orange crescent orbit + wordmark ---------- */
export const Logo: React.FC<{ f: number; start: number; size?: number; sub?: boolean; id: string }> = ({ f, start, size = 1, sub = true, id }) => {
  const draw = prog(f, start, 40);
  const word = pop(f, start + 8);
  const subP = prog(f, start + 26, 24);
  return (
    <div style={{ position: 'relative', width: 900 * size, height: 560 * size }}>
      <svg width={900 * size} height={560 * size} viewBox="0 0 900 560" style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 0 30px rgba(255,130,28,.35))' }}>
        <defs>
          <linearGradient id={`${id}-acc`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.accHi} />
            <stop offset=".5" stopColor={C.acc} />
            <stop offset="1" stopColor={C.accLo} />
          </linearGradient>
          <mask id={`${id}-cres`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
            <rect x="-100" y="-100" width="1100" height="760" fill="#000" />
            <ellipse cx="450" cy="280" rx="405" ry="190" fill="#fff" transform="rotate(-14 450 280)" />
            <ellipse cx="478" cy="258" rx="378" ry="158" fill="#000" transform="rotate(-14 450 280)" />
          </mask>
          <mask id={`${id}-rev`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
            <path d="M760.2 157.9 A405 190 0 1 1 755.7 155.3" fill="none" stroke="#fff" strokeWidth="150" pathLength={1} strokeDasharray={`${draw} 1`} transform="rotate(-14 450 280)" />
          </mask>
        </defs>
        <g mask={`url(#${id}-rev)`}>
          <rect x="-100" y="-100" width="1100" height="760" fill={`url(#${id}-acc)`} mask={`url(#${id}-cres)`} />
        </g>
        <text x={450} y={378} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={290} letterSpacing={-10 + 50 * (1 - word)} fill={C.text} stroke={C.bg} strokeWidth={22} paintOrder="stroke" strokeLinejoin="round" opacity={clamp(word * 2)} transform={`translate(0 ${(1 - word) * 70})`}>
          {COPY.brand}
        </text>
      </svg>
      {sub && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 455 * size, textAlign: 'center', fontFamily: FONT.sans, fontWeight: 600, fontSize: 40 * size, letterSpacing: `${0.55 + 0.3 * (1 - subP)}em`, paddingLeft: '0.55em', color: C.text, opacity: subP }}>
          {COPY.brandSub}
        </div>
      )}
    </div>
  );
};

/* ---------- backdrop: dark gradient, drifting warm glow, dot grid with light parallax ---------- */
export const Backdrop: React.FC<{ glowX?: number; glowY?: number; warm?: number }> = ({ glowX = 0.5, glowY = 0.45, warm = 1 }) => {
  const f = useCurrentFrame();
  const d = drift(f, 1, 40);
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: -80, backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1.4px, transparent 1.6px)', backgroundSize: '44px 44px', transform: `translate(${-f * 0.12}px, ${-f * 0.05}px)`, maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 85%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.85 * warm, background: `radial-gradient(ellipse 45% 55% at calc(${glowX * 100}% + ${d.x}px) calc(${glowY * 100}% + ${d.y}px), rgba(255,130,28,.20), rgba(255,130,28,.05) 55%, transparent 75%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,.65) 100%)' }} />
    </div>
  );
};
