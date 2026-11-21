import React from 'react';
import {TYPE} from '../config';
import {useCurrentFrame, interpolate} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {Words} from '../components/Words';
import {COLORS, COPY, LIGHT} from '../config';
import {BODY} from '../fonts';
import {enter, exit, press, drift, tween, pathAt, clamp, easy, outCubic, inOutCubic} from '../anim';
import {Easing} from 'remotion';
import T from '../timing.json';

const XS = [-660, -220, 220, 660];
const TILE = 280, TILE_Y = -60;

const Icon: React.FC<{i: number; color: string}> = ({i, color}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width="96" height="96" viewBox="0 0 48 48">
      {i === 0 && (<g {...p}><path d="M14 18V8h20v10" /><rect x="8" y="18" width="32" height="16" rx="3" /><path d="M14 30h20v10H14z" /><circle cx="34" cy="24" r="1.2" fill={color} /></g>)}
      {i === 1 && (<g {...p}><path d="M10 38c6-10 10 2 15-6s8-2 13-4" /><path d="M30 10l8 8-14 14-9 2 2-9z" /></g>)}
      {i === 2 && (<g {...p}><rect x="8" y="22" width="32" height="14" rx="3" /><path d="M8 28h32" /><path d="M14 22l4-10h18" /><circle cx="34" cy="32" r="1.2" fill={color} /></g>)}
      {i === 3 && (<g {...p}><rect x="8" y="12" width="32" height="24" rx="3" /><path d="M8 14l16 12 16-12" /></g>)}
    </svg>
  );
};

// Scene 2 · The paper loop (problem) — a document crawls through print, sign, scan, email, then loops back.
export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();
  const t = T.s2;
  const out = exit(f, t.match[0]);
  // Match cut: the document accelerates into the lens (ease-in); scene 3 opens on the page and decelerates (ease-out).
  const m = interpolate(f, [t.match[0], t.match[1]], [0, 1], {...clamp, easing: outCubic});

  // Document travels tile to tile on arcs (each move 50 frames ≈ 0.83 s).
  const start = {x: -1100, y: TILE_Y - 20};
  const doc = pathAt(f, start, t.land.map((a, i) => ({a: a - 50, b: a, to: {x: XS[i], y: TILE_Y - 20}, bend: i === 0 ? 0.05 : -0.22})));
  const settle = t.land.reduce((s, a) => s * press(f, a), 1);

  // Camera zooms in and locks onto the document while it hops tile to tile (fast phase),
  // then eases back out to reveal the loop.
  const zf = interpolate(f, [8, 40, 244, 296], [0, 1, 1, 0], {...clamp, easing: inOutCubic});
  const focus = {x: doc.x, y: TILE_Y - 110};
  const panX = 0;

  // Return arrow under the tiles, drawn after the last landing.
  const loop = tween(f, t.loop, t.loop + 50, 0, 1);
  const loopLen = 1500;

  return (
    <Stage>
      <Camera zoom={1 + 0.38 * zf} focus={focus} amount={0.92 * zf} push={tween(f, 0, 360, 1, 1.04)}>
        <div style={{position: 'absolute', inset: 0, opacity: out, transform: `scale(${0.96 + 0.04 * out})`, transformOrigin: '960px 540px', filter: out < 0.99 ? `blur(${(1 - out) * 14}px)` : 'none'}}>
          {COPY.s2.steps.map((label, i) => {
            const pIn = enter(f, 4 + i * 4);
            const lit = interpolate(f, [t.land[i], t.land[i] + 10], [0, 1], clamp);
            const active = f >= t.land[i] && (i === 3 || f < t.land[i + 1]);
            const s = press(f, t.land[i]) * (0.9 + 0.1 * pIn);
            const accent = active ? LIGHT.pain : lit > 0.5 ? '#d5dbe8' : '#e4e9f5';
            return (
              <At key={i} x={XS[i]} y={TILE_Y + (1 - pIn) * 50 + drift(f, 3, 280, i * 50)}>
                <div style={{width: TILE, height: TILE, borderRadius: 32, opacity: Math.min(1, pIn * 1.4), transform: `scale(${s})`,
                  background: active ? '#f3f6ff' : '#ffffff', boxShadow: active ? LIGHT.glowStrong : LIGHT.cardShadow,
                  border: `2px solid ${accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  paddingBottom: 30, gap: 8, fontFamily: BODY, color: LIGHT.ink}}>
                  <div style={{marginBottom: 'auto', marginTop: 40, opacity: 0.6 + 0.4 * lit}}><Icon i={i} color={active ? LIGHT.pain : LIGHT.accent} /></div>
                  <div style={{fontSize: 32, fontWeight: TYPE.subheading}}>{label}</div>
                  <div style={{fontSize: 20, fontWeight: 600, color: LIGHT.pain, opacity: lit}}>{COPY.s2.delays[i]}</div>
                </div>
              </At>
            );
          })}

          {/* Return arrow: Email → back to Print. */}
          <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}} viewBox="-960 -540 1920 1080">
            <path d={`M ${XS[3]} ${TILE_Y + 160} C ${XS[3]} 260, ${XS[0]} 260, ${XS[0]} ${TILE_Y + 170}`} fill="none" stroke={LIGHT.pain} strokeWidth="5"
              strokeLinecap="round" strokeDasharray={loopLen} strokeDashoffset={loopLen * (1 - loop)} />
            <path d={`M ${XS[0] - 18} ${TILE_Y + 196} L ${XS[0]} ${TILE_Y + 170} L ${XS[0] + 18} ${TILE_Y + 196}`} fill="none" stroke={LIGHT.pain} strokeWidth="5"
              strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(loop, [0.9, 1], [0, 1], clamp)} />
          </svg>

        </div>
        {/* The document, riding above the tiles. */}
          <At x={doc.x * (1 - m)} y={(doc.y - 215 + drift(f, 3, 200)) * (1 - m)} style={{zIndex: 20}}>
            <div style={{width: 96, height: 124, borderRadius: 10, background: m > 0 ? '#fff' : f >= t.land[2] ? '#eef0f4' : '#fff', border: LIGHT.cardBorder, transform: `scale(${settle * (1 + 11.7 * m)}) rotate(${drift(f, 3, 300) * (1 - m)}deg)`,
              boxShadow: m > 0 ? 'none' : LIGHT.glowStrong, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8}}>
              {[90, 100, 80, 95].map((w, k) => <div key={k} style={{height: 6, width: `${w}%`, borderRadius: 3, background: COLORS.line, opacity: 1 - Math.min(1, m * 2)}} />)}
              <svg width="68" height="30" viewBox="0 0 68 30" style={{marginTop: 'auto', opacity: f >= t.land[1] ? 1 - Math.min(1, m * 2) : 0}}>
                <path d="M2 22c8-14 12 4 18-6s10-2 14 2 10-8 16-4 8 4 14 0" fill="none" stroke="#14286e" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
          </At>

      </Camera>
      {/* Headline stays steady outside the camera. */}
      <At x={0} y={400} style={{opacity: out}}>
        <Words words={COPY.s2.headline} f={f} starts={t.words} size={80} accent={{3: LIGHT.pain}} />
      </At>
    </Stage>
  );
};
