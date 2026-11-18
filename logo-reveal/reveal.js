/* ISP Agency logo reveal: 1080x1920, 30 fps, 12 s.
   Every frame is a pure function of time: window.renderAt(seconds).
   Structure follows the reference edit: dot drop -> split -> three shapes with labels ->
   assemble -> dip to black + reshuffle -> back to brand colour with the wordmark. */
const W = 1080, H = 1920, FPS = 30, DUR = 12;

/* ---------- brand ---------- */
const CREAM = [243, 239, 230], INK = [17, 17, 17], NIGHT = [8, 8, 8], ORANGE = '#D9621F';
// Mark geometry in "mark units", measured from the logo artwork:
const R = 52;    // orange core radius
const BL = 98;   // bracket arm length (outer)
const BT = 34;   // bracket thickness
const DG = 69;   // offset of each bracket's box centre from the core, on both axes
const SUB = 'CREATIVE EDITING STUDIO';
const LABELS = ['Structure', 'Focus', 'Clarity'];

/* ---------- timing (seconds) ---------- */
const CUES = {
  drop: 0.30, land: 1.00, split: 1.32, merge0: 2.40, merge1: 2.68, fade: 2.80,
  br1: 3.10, lab1: 3.55, core: 4.55, lab2: 5.05, br2: 6.00, lab3: 6.45, labOut: 7.55,
  asm0: 7.80, asm1: 8.55, vert0: 8.80, vert1: 9.10, dark0: 8.92, dark1: 9.10,
  snaps: [9.22, 9.44, 9.66, 9.88], snapDur: 0.17,
  light0: 10.02, light1: 10.26, slide0: 10.05, slide1: 10.65, word: 10.28, sub: 10.78,
};
const DRAW = 0.60;                    // bracket draw-on duration
const Y0 = 940;                       // row baseline (shape centres)
const ROW_S = 320, ROW_K = 0.85;      // spacing (px) and scale of the shape row
const KL = 0.82;                      // scale of the final lockup

/* ---------- helpers ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const P = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
const io = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const eo = p => 1 - Math.pow(1 - p, 3);
const eo5 = p => 1 - Math.pow(1 - p, 5);
const ei = p => p * p * p;
const back = (p, s = 1.70158) => p <= 0 ? 0 : 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
const imp = (x, a, f = 38, d = 14) => x < 0 ? 0 : a * Math.exp(-x * d) * Math.cos(x * f); // damped wobble
const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], p))).join(',')})`;
const D2R = Math.PI / 180;

/* ---------- lockup layout (needs fonts) ---------- */
let LK = null;
function layout(c) {
  const F = 96, chars = [];
  const word = (s, wt, x0) => {
    c.font = `${wt} ${F}px Inter`;
    for (let i = 0; i < s.length; i++) chars.push({ ch: s[i], x: x0 + c.measureText(s.slice(0, i)).width, font: c.font });
    return x0 + c.measureText(s).width;
  };
  let x = word('ISP', 800, 0);
  c.font = `400 ${F}px Inter`; x += c.measureText(' ').width * 0.9;
  const wt = word('Agency', 400, x);
  c.font = `500 24px Inter`;
  const w0 = c.measureText(SUB).width, sp = (wt - w0) / (SUB.length - 1);
  const sub = [...SUB].map((ch, i) => ({ ch, x: c.measureText(SUB.slice(0, i)).width + i * sp }));
  const total = (2 * (DG + BL / 2) + 46 + wt) * KL;
  const left = 540 - total / 2;
  LK = { chars, sub, wt, cx: left + (DG + BL / 2) * KL, cy: 960 };
  LK.tx = LK.cx + (DG + BL / 2 + 46) * KL;
  LK.base = LK.cy + 35 * KL;
}

/* ---------- shapes ---------- */
function bracket(c, x, y, k, rot, prog, col) {   // top-left orientation at rot=0, box centred on (x,y)
  if (prog <= 0) return;
  const h = BL / 2, m = -h + BT / 2, seg = h - m, l = prog * 2 * seg;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  c.beginPath(); c.moveTo(m, h);
  if (l <= seg) c.lineTo(m, h - l); else { c.lineTo(m, m); c.lineTo(m + (l - seg), m); }
  c.lineWidth = BT; c.lineCap = 'butt'; c.lineJoin = 'miter'; c.strokeStyle = col; c.stroke();
  c.restore();
}
function core(c, x, y, k, wipe) {
  if (wipe <= 0 || k <= 0) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.fillStyle = ORANGE; c.beginPath();
  if (wipe < 1) { c.moveTo(0, 0); c.arc(0, 0, R, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * wipe); c.closePath(); }
  else c.arc(0, 0, R, 0, 2 * Math.PI);
  c.fill(); c.restore();
}
function blob(c, x, y, r, sx = 1, sy = 1) {      // dot anchored at its bottom so squash sits on the "floor"
  if (r <= 0.3) return;
  c.beginPath(); c.ellipse(x, y + r - r * sy, r * sx, r * sy, 0, 0, 2 * Math.PI); c.fill();
}

/* ---------- group pose: row -> diagonal -> vertical -> snaps -> lockup ---------- */
function pose(t) {
  const a = io(P(t, CUES.asm0, CUES.asm1));
  let k = lerp(ROW_K, 1, a);
  let S = lerp(ROW_S, DG * Math.SQRT2 * k, a);
  let th = 45 * a + 45 * io(P(t, CUES.vert0, CUES.vert1)), phi = 0;
  let cx = 540, cy = lerp(Y0, 960, a);
  const inc = [90, 90, 90, 45];
  CUES.snaps.forEach((s, i) => {
    const p = P(t, s, s + CUES.snapDur);
    th += inc[i] * back(p, 2.2); phi += 90 * back(p, 2.2);
    S *= 1 - 0.32 * Math.sin(Math.PI * p);
  });
  const f = io(P(t, CUES.slide0, CUES.slide1));
  if (LK) { cx = lerp(cx, LK.cx, f); cy = lerp(cy, LK.cy, f); }
  k = lerp(k, KL, f); S = lerp(S, DG * Math.SQRT2 * k, f);
  const ct = Math.cos(th * D2R), st = Math.sin(th * D2R);
  const pts = [-1, 0, 1].map(i => [cx + i * S * ct, cy + i * S * st]);
  return { pts, k, phi: phi * D2R };
}

/* ---------- one frame ---------- */
function draw(c, t) {
  if (!LK) layout(c);
  const d = io(P(t, CUES.dark0, CUES.dark1)) * (1 - io(P(t, CUES.light0, CUES.light1)));
  const ink = mix(INK, CREAM, d);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = mix(CREAM, NIGHT, d); c.fillRect(0, 0, W, H);
  const z = 1 + 0.025 * eo(P(t, 10.6, 12));                  // slow push-in on the hold
  c.setTransform(z, 0, 0, z, 540 * (1 - z), 960 * (1 - z));

  /* --- act 1: the dot --- */
  c.fillStyle = ink;
  const r = 40, side = 160;
  if (t >= CUES.drop && t < CUES.br1 + 0.2) {
    let y, sx = 1, sy = 1;
    if (t < CUES.land) {
      const p = P(t, CUES.drop, CUES.land);
      y = lerp(-140, Y0, p * p); sx = 1 - 0.16 * p; sy = 1 + 0.42 * p;
    } else {
      const u = P(t, CUES.land, CUES.land + 0.30);
      y = Y0 - 60 * 4 * u * (1 - u);
      const q = imp(t - CUES.land, 0.42) + imp(t - CUES.land - 0.30, 0.16) + imp(t - CUES.split, 0.14, 30, 16);
      sx = 1 + q; sy = 1 - q;
      if (u > 0 && u < 1) { const v = Math.abs(1 - 2 * u) * (1 - Math.exp(-(t - CUES.land) * 25)); sy += 0.12 * v; sx -= 0.06 * v; }
    }
    // splash arcs on the split
    const sp = P(t, CUES.split, CUES.split + 0.34);
    if (sp > 0 && sp < 1) {
      c.save(); c.strokeStyle = ink; c.lineCap = 'round'; c.lineWidth = 6 * (1 - sp) + 1;
      for (let i = 0; i < 6; i++) {
        const a0 = i * Math.PI / 3 + 0.5, rr = lerp(62, 150, eo(sp)), len = 0.32 * (1 - sp) + 0.04;
        c.beginPath(); c.arc(540, Y0, rr, a0, a0 + len); c.stroke();
      }
      c.restore();
    }
    const split = back(P(t, CUES.split, CUES.split + 0.38), 2.0);
    const mg = io(P(t, CUES.merge0, CUES.merge1));
    const bump = t > CUES.merge1 ? 0.2 * Math.exp(-(t - CUES.merge1) * 11) : 0;
    const mv = io(P(t, CUES.fade, CUES.fade + 0.36));
    const lr = r * (1 - ei(P(t, CUES.fade + 0.08, CUES.br1 + 0.10)));
    const rr2 = r * (1 - ei(P(t, CUES.fade + 0.02, CUES.fade + 0.30)));
    const lx = lerp(540 - side, 540 - ROW_S, mv);
    if (t >= CUES.split) {
      blob(c, lx, Y0, lr * (1 + bump));                       // left dot (becomes the first bracket)
      blob(c, 540 + side * split, Y0, rr2);                    // right dot
    }
    if (t < CUES.merge1) blob(c, lerp(540, 540 - side * split, mg), y, r, sx, sy); // the falling / middle dot
  }

  /* --- act 2-4: shapes --- */
  const { pts, k, phi } = pose(t);
  const pop = (a) => 1 + 0.07 * Math.sin(Math.PI * P(t, a, a + 0.3));
  bracket(c, pts[0][0], pts[0][1], k * pop(CUES.br1 + DRAW), phi, io(P(t, CUES.br1, CUES.br1 + DRAW)), ink);
  core(c, pts[1][0], pts[1][1], k * Math.max(0, back(P(t, CUES.core, CUES.core + 0.42), 2.6)), eo(P(t, CUES.core, CUES.core + 0.34)));
  bracket(c, pts[2][0], pts[2][1], k * pop(CUES.br2 + DRAW), Math.PI + phi, io(P(t, CUES.br2, CUES.br2 + DRAW)), ink);

  // labels
  if (t < CUES.asm1) {
    c.save(); c.font = '400 32px Inter'; c.textAlign = 'center'; c.fillStyle = ink;
    [CUES.lab1, CUES.lab2, CUES.lab3].forEach((a, i) => {
      const p = eo(P(t, a, a + 0.4)), o = p * (1 - P(t, CUES.labOut, CUES.labOut + 0.3));
      if (o <= 0) return;
      c.globalAlpha = 0.82 * o;
      c.fillText(LABELS[i], 540 + (i - 1) * ROW_S, Y0 + 104 + 14 * (1 - p));
    });
    c.restore();
  }

  /* --- act 5: wordmark --- */
  if (t >= CUES.word) {
    c.save(); c.translate(LK.tx, LK.base); c.scale(KL, KL);
    c.beginPath(); c.rect(-6, -140, LK.wt + 60, 230); c.clip();
    c.fillStyle = ink;
    LK.chars.forEach((ch, i) => {
      const a = CUES.word + 0.045 * i, p = eo5(P(t, a, a + 0.55));
      if (p <= 0) return;
      c.font = ch.font; c.globalAlpha = Math.min(1, p * 1.6);
      c.fillText(ch.ch, ch.x - 120 * (1 - p), 0);
    });
    c.font = '500 24px Inter';
    LK.sub.forEach((ch, i) => {
      const a = CUES.sub + 0.022 * i, p = eo(P(t, a, a + 0.32));
      if (p <= 0) return;
      c.globalAlpha = 0.85 * p; c.fillText(ch.ch, ch.x, 62 + 10 * (1 - p));
    });
    c.restore();
  }
}

/* ---------- output: optional motion blur by sub-frame accumulation ---------- */
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
const RENDER = location.search.includes('render');
const SAMPLES = RENDER ? 8 : 1, SHUTTER = 0.5;               // 180° shutter
let off, octx, acc, img;
function renderAt(t) {
  if (SAMPLES === 1) { draw(ctx, t); return; }
  if (!off) {
    off = new OffscreenCanvas(W, H); octx = off.getContext('2d', { willReadFrequently: true });
    acc = new Float32Array(W * H * 4); img = ctx.createImageData(W, H);
  }
  acc.fill(0);
  for (let s = 0; s < SAMPLES; s++) {
    draw(octx, t + ((s + 0.5) / SAMPLES - 0.5) * SHUTTER / FPS);
    const px = octx.getImageData(0, 0, W, H).data;
    for (let j = 0; j < px.length; j++) acc[j] += px[j];
  }
  const out = img.data, inv = 1 / SAMPLES;
  for (let j = 0; j < out.length; j++) out[j] = acc[j] * inv + 0.5;
  ctx.putImageData(img, 0, 0);
}
window.renderAt = renderAt; window.CUES = CUES; window.DUR = DUR; window.FPS = FPS;

Promise.all(['400 32px Inter', '500 24px Inter', '800 96px Inter', '400 96px Inter'].map(f => document.fonts.load(f))).then(() => {
  layout(ctx); renderAt(0); window.READY = true;
  if (RENDER) { document.body.classList.add('render'); return; }
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), btn = document.getElementById('play');
  let playing = false, t0 = 0;
  const show = t => { renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2) + 's'; };
  scrub.oninput = () => { playing = false; show(+scrub.value); };
  btn.onclick = () => { playing = !playing; t0 = performance.now() - (+scrub.value % DUR) * 1000; if (playing) loop(); };
  const loop = () => { if (!playing) return; show(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); };
});
