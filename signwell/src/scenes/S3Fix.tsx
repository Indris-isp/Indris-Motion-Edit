import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {Stage, At} from '../components/Stage';
import {Camera} from '../components/Camera';
import {Cursor} from '../components/Cursor';
import {Words} from '../components/Words';
import {Editor, FieldChip, paletteCenter, slotCenter, sendCenter, SLOT_SIG, SLOT_DATE} from '../components/Editor';
import {COPY, LIGHT} from '../config';
import {BODY} from '../fonts';
import {enter, exit, press, tween, pathAt, clamp, drift, Pt, inOutCubic} from '../anim';
import T from '../timing.json';

const t = T.s3;
// Cursor choreography, in world coordinates. Each move eases along an arc.
export const cursorMoves = () => {
  const sigPal = paletteCenter(0), datePal = paletteCenter(2);
  const sigSlot = slotCenter(SLOT_SIG), dateSlot = slotCenter(SLOT_DATE);
  return [
    {a: 40, b: 90, to: sigPal},
    {a: 100, b: 170, to: sigSlot},
    {a: 190, b: 228, to: datePal},
    {a: 240, b: 290, to: dateSlot},
    {a: 360, b: 410, to: sendCenter},
  ];
};
export const CURSOR_START: Pt = {x: 380, y: 470};
export const ZOOM_FOCUS: Pt = {x: -10, y: 170};
// Match-cut target: the page center, framed at 1.9× so it lines up with scene 2's document.
export const PAGE_FOCUS: Pt = {x: 140, y: 113};

// Scene 3 · Place it, send it (fix) — drag fields onto the document, click Send.
export const S3Fix: React.FC = () => {
  const f = useCurrentFrame();
  const cur = pathAt(f, CURSOR_START, cursorMoves());

  // Camera: zoom ≈130% into the signature line during the drags, ease back for Send.
  const z = interpolate(f, [t.zoomIn[0], t.zoomIn[1], t.zoomOut[0], t.zoomOut[1]], [0, 1, 1, 0], {...clamp, easing: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2});
  // Opening: continue the match cut's speed, then decelerate out to the full editor (ease-out).
  const o = interpolate(f, [t.open[0], t.open[1]], [1, 0], {...clamp, easing: inOutCubic});
  const zoom = 1 + 0.9 * o + 0.3 * z;

  const sig = f >= t.drop1 ? enter(f, t.drop1) : 0;
  const date = f >= t.drop2 ? enter(f, t.drop2) : 0;
  const dragging = (f >= t.pick1 && f < t.drop1) ? 'sig' : (f >= t.pick2 && f < t.drop2) ? 'date' : null;
  const hover = f >= 80 && f < t.drop1 ? 0 : f >= 220 && f < t.drop2 ? 2 : -1;
  const sendScale = press(f, t.send);
  const status = f >= t.send + 4 ? 'sent' : 'send';
  const toast = enter(f, t.toast) * exit(f, 500);
  const headOut = exit(f, 522);
  const cursorIn = tween(f, 24, 40, 0, 1);

  return (
    <Stage>
      <Camera zoom={zoom} focus={o > 0 ? PAGE_FOCUS : ZOOM_FOCUS} amount={o > 0 ? o : z} push={tween(f, 0, 540, 1, 1.03)} rotate={1.2 * o + interpolate(z, [0, 1], [0, -0.6])}>
        <div style={{position: 'absolute', inset: 0}}>
          <Editor sig={sig} date={date} status={status} statusScale={sendScale} hoverIndex={hover} />
        </div>

        {/* Dragged field follows the cursor. */}
        {dragging && (
          <At x={cur.x} y={cur.y} style={{zIndex: 40}}>
            <div style={{transform: `rotate(-3deg) scale(${1 + 0.04 * enter(f, dragging === 'sig' ? t.pick1 : t.pick2)})`, boxShadow: '0 20px 40px rgba(20,40,110,.3)', borderRadius: 10}}>
              {dragging === 'sig'
                ? <FieldChip label={`Signature · ${COPY.s3.recipient.split(' ')[0]}`} w={SLOT_SIG.w} h={SLOT_SIG.h} soft="#e4ebfd" />
                : <FieldChip label="Date signed" w={SLOT_DATE.w} h={SLOT_DATE.h} size={18} soft="#e4ebfd" />}
            </div>
          </At>
        )}
        <Cursor x={cur.x} y={cur.y} f={f} opacity={cursorIn} pressAt={[t.pick1, t.drop1, t.pick2, t.drop2, t.send]} />

        {/* Toast after Send. */}
        <At x={120} y={-300 + (1 - toast) * -40} style={{zIndex: 45}}>
          <div style={{opacity: Math.min(1, toast * 1.5), display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px', borderRadius: 16,
            background: '#141b2d', color: '#fff', fontFamily: BODY, fontSize: 22, fontWeight: 600, boxShadow: '0 20px 40px rgba(43,89,232,.30), 0 0 40px rgba(79,124,255,.35)'}}>
            <span style={{width: 30, height: 30, borderRadius: '50%', background: '#1e9e64', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17}}>✓</span>
            {COPY.s3.toast}
          </div>
        </At>
      </Camera>

      {/* Headline sits outside the camera so it stays steady during the zoom. */}
      <At x={0} y={462 + drift(f, 2, 300)} style={{opacity: headOut}}>
        <Words words={COPY.s3.headline} f={f} starts={[t.place, t.place + 4, t.send + 2, t.send + 6]} size={58} accent={{2: LIGHT.accent, 3: LIGHT.accent}} />
      </At>
    </Stage>
  );
};
