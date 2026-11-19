/* Scene 6 · You record. We handle the rest. (payoff) */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, COPY, cue } from '../config';
import { At, CAM, Camera, Center, Check, Words, card, drift, enter, lerp, press, prog, useL } from '../lib';

export const S6Record: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const r = cue('record'), h = cue('handle');
  const RX = L.tall ? 0 : -430, RY = L.tall ? -470 : 0;
  const KX = L.tall ? 0 : 400, KY = L.tall ? 330 : 0;
  const k = L.wide ? 1 : L.tall ? 1 : 0.6;
  const pan = prog(f, h - 16, 54, CAM);
  const cx = L.tall ? 0 : lerp(L.wide ? 170 : 15, L.wide ? -60 : 15, pan);
  const cy = L.tall ? lerp(160, -40, pan) : 0;
  const clickAt = r + 10;
  const secs = Math.floor(Math.max(0, f - clickAt) / 60);
  const recOn = f >= clickAt;
  const d1 = drift(f, 8, 4), d2 = drift(f, 9, 4);
  return (
    <Center>
      <Camera s={k} x={cx * k} y={cy * k}>
        <At x={RX + d1.x} y={RY + d1.y} style={enter(f, 0, 60)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
            <div style={{ position: 'relative', width: 230, height: 230, transform: `scale(${press(f, clickAt)})` }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '8px solid rgba(255,255,255,.9)' }} />
              <div style={{ position: 'absolute', inset: lerp(22, 62, prog(f, clickAt, 10)), borderRadius: lerp(115, 18, prog(f, clickAt, 10)), background: C.red, boxShadow: `0 0 ${recOn ? 50 + 20 * Math.sin(f / 9) : 0}px rgba(255,79,69,.7)` }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 600, color: recOn ? C.red : C.mut, fontVariantNumeric: 'tabular-nums', letterSpacing: '.04em' }}>● REC 00:0{secs}:{String(Math.floor((Math.max(0, f - clickAt) % 60) / 2)).padStart(2, '0')}</div>
            <Words segs={[{ t: 'You' }, { t: 'record.', serif: true, acc: true }]} start={r} size={88} />
          </div>
        </At>
        <At x={KX + d2.x} y={KY + d2.y} style={enter(f, h - 8, 70)}>
          <div style={card(560, 560, { padding: '40px 44px' })}>
            <Words segs={[{ t: 'We handle' }, { t: 'the rest.', serif: true, acc: true }]} start={h + 2} size={62} align="left" />
            <div style={{ marginTop: 34 }}>
              {COPY.checklist.map((t, i) => {
                const st = h + 16 + i * 4;
                return (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 64, borderTop: i ? `1px solid ${C.line}` : 'none', fontSize: 30, fontWeight: 600, ...enter(f, st - 6, 20) }}>
                    <Check p={prog(f, st, 18)} size={38} />
                    {t}
                  </div>
                );
              })}
            </div>
          </div>
        </At>
      </Camera>
    </Center>
  );
};
