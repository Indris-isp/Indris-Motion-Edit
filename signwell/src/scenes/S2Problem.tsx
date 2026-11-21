import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {Words} from '../components/Words';
import {COLORS, COPY} from '../config';
import {BODY} from '../fonts';
import {enter, exit, press, drift, tween, pathAt, clamp, easy} from '../anim';
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
  const m = interpolate(f, [t.match[0], t.match[1]], [0, 1], {...clamp, easing: Easing.bezier(0.55, 0, 0.9, 0.45)});

  // Document travels tile to tile on arcs (each move 50 frames ≈ 0.83 s).
  const start = {x: -1100, y: TILE_Y - 20};
  const doc = pathAt(f, start, t.land.map((a, i) => ({a: a - 50, b: a, to: {x: XS[i], y: TILE_Y - 20}, bend: i === 0 ? 0.05 : -0.22})));
  const settle = t.land.reduce((s, a) => s * press(f, a), 1);

  // Camera follows the document, then eases back to center for the loop.
  const follow = interpolate(f, [0, 30, 240, 300], [0.4, 0.35, 0.35, 0], {...clamp, easing: easy});
  const panX = -doc.x * follow;

  // Return arrow under the tiles, drawn after the last landing.
  const loop = tween(f, t.loop, t.loop + 50, 0, 1);
  const loopLen = 1500;

  return (
    <Stage>
      <Camera panX={panX} push={tween(f, 0, 360, 1, 1.04)}>
        <div style={{position: 'absolute', inset: 0, opacity: out, transform: `scale(${0.96 + 0.04 * out})`, transformOrigin: '960px 540px'}}>
          {COPY.s2.steps.map((label, i) => {
            const pIn = enter(f, 4 + i * 4);
            const lit = interpolate(f, [t.land[i], t.land[i] + 10], [0, 1], clamp);
            const active = f >= t.land[i] && (i === 3 || f < t.land[i + 1]);
            const s = press(f, t.land[i]) * (0.9 + 0.1 * pIn);
            const accent = active ? COLORS.amber : `rgba(255,255,255,${0.35 + 0.25 * lit})`;
            return (
              <At key={i} x={XS[i]} y={TILE_Y + (1 - pIn) * 50 + drift(f, 3, 280, i * 50)}>
                <div style={{width: TILE, height: TILE, borderRadius: 32, opacity: Math.min(1, pIn * 1.4), transform: `scale(${s})`,
                  background: active ? 'rgba(240,160,75,.14)' : 'rgba(255,255,255,.06)',
                  border: `2px solid ${accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  paddingBottom: 30, gap: 8, fontFamily: BODY, color: '#fff'}}>
                  <div style={{marginBottom: 'auto', marginTop: 40, opacity: 0.6 + 0.4 * lit}}><Icon i={i} color={active ? COLORS.amber : '#fff'} /></div>
                  <div style={{fontSize: 32, fontWeight: 700}}>{label}</div>
                  <div style={{fontSize: 20, fontWeight: 600, color: COLORS.amber, opacity: lit}}>{COPY.s2.delays[i]}</div>
                </div>
              </At>
            );
          })}

          {/* Return arrow: Email → back to Print. */}
          <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}} viewBox="-960 -540 1920 1080">
            <path d={`M ${XS[3]} ${TILE_Y + 160} C ${XS[3]} 260, ${XS[0]} 260, ${XS[0]} ${TILE_Y + 170}`} fill="none" stroke={COLORS.amber} strokeWidth="5"
              strokeLinecap="round" strokeDasharray={loopLen} strokeDashoffset={loopLen * (1 - loop)} />
            <path d={`M ${XS[0] - 18} ${TILE_Y + 196} L ${XS[0]} ${TILE_Y + 170} L ${XS[0] + 18} ${TILE_Y + 196}`} fill="none" stroke={COLORS.amber} strokeWidth="5"
              strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(loop, [0.9, 1], [0, 1], clamp)} />
          </svg>

          <At x={-panX} y={380}>
            <Words words={COPY.s2.headline} f={f} starts={t.words} size={80} accent={{3: COLORS.amber}} />
          </At>
        </div>
        {/* The document, riding above the tiles. */}
          <At x={doc.x * (1 - m)} y={(doc.y - 215 + drift(f, 3, 200)) * (1 - m)} style={{zIndex: 20}}>
            <div style={{width: 96, height: 124, borderRadius: 10, background: m > 0 ? '#fff' : f >= t.land[2] ? '#e8e9ee' : '#fff', transform: `scale(${settle * (1 + 11.7 * m)}) rotate(${drift(f, 3, 300) * (1 - m)}deg)`,
              boxShadow: '0 16px 30px rgba(0,0,0,.35)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8}}>
              {[90, 100, 80, 95].map((w, k) => <div key={k} style={{height: 6, width: `${w}%`, borderRadius: 3, background: COLORS.line, opacity: 1 - Math.min(1, m * 2)}} />)}
              <svg width="68" height="30" viewBox="0 0 68 30" style={{marginTop: 'auto', opacity: f >= t.land[1] ? 1 - Math.min(1, m * 2) : 0}}>
                <path d="M2 22c8-14 12 4 18-6s10-2 14 2 10-8 16-4 8 4 14 0" fill="none" stroke="#14286e" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
          </At>

      </Camera>
    </Stage>
  );
};
