/* ISP Agency logo reveal, square version: 1080x1920, 30 fps, 12 s, bright orange radial background.
   1. A square drops and bounces.
   2. It spins fast to the right and eases down smoothly, leaving three squares in a row.
   3. One by one the squares "mark" into the logo parts, each with a one-word label.
   4. The parts spin fast into the logo with an easy ease out, then the mark slides left to reveal the wordmark.
   Every frame is a pure function of time: window.renderAt(seconds). */
const W = 1080, H = 1920, FPS = 30, DUR = 12;

/* ---------- brand ---------- */
const INK = [17, 17, 17], CORE = [255, 255, 255];
const R = 52, BL = 98, BT = 34, DG = 69;   // core radius, bracket arm, bracket thickness, bracket offset (mark units)
const KR = 1.0, KC = 1.25, KL = 0.82;      // shape scale in the row / logo centre-stage / final lockup
const ROW_Y = 900, ROW_X = [230, 540, 850];
const SUB = 'CREATIVE EDITING STUDIO';
const LABELS = ['Structure', 'Focus', 'Clarity'];   // one word under each part, like the reference

/* ---------- timing (seconds) ---------- */
const CUES = {
  drop: 0.30, land: 1.00, land2: 1.40,
  roll0: 1.60, roll1: 2.90,
  mark: [3.10, 4.60, 6.10], markDur: 0.60, label: [3.45, 4.95, 6.45], labOut: 7.55,
  asm0: 7.85, asm1: 9.25,
  slide0: 9.45, slide1: 10.35, word: 9.70, sub: 10.40,
};

/* ---------- easing ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const P = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
function bezier(x1, y1, x2, y2) {
  const f = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return p => { if (p <= 0) return 0; if (p >= 1) return 1;
    let lo = 0, hi = 1, t = p; for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (f(t, x1, x2) < p) lo = t; else hi = t; }
    return f(t, y1, y2); };
}
const ease = bezier(0.33, 0, 0.67, 1);      // After Effects "Easy Ease"
const fastOut = bezier(0.16, 0.72, 0.24, 1); // starts fast, long smooth ease down
const bump = p => Math.sin(Math.PI * ease(p)); // 0 -> 1 -> 0, smooth
const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], p))).join(',')})`;
const TAU = 2 * Math.PI;

/* ---------- lockup layout ---------- */
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
  LK = { chars, sub, wt, cx: 540 - total / 2 + (DG + BL / 2) * KL, cy: 960 };
  LK.tx = LK.cx + (DG + BL / 2 + 46) * KL;
  LK.base = LK.cy + 35 * KL;
}

/* ---------- shapes (mark units, centred on the origin) ---------- */
function lshape(c, cut) {          // a square with its bottom-right corner cut away -> top-left bracket
  const h = BL / 2;
  c.beginPath(); c.moveTo(-h, -h); c.lineTo(h, -h); c.lineTo(h, h - cut); c.lineTo(h - cut, h - cut);
  c.lineTo(h - cut, h); c.lineTo(-h, h); c.closePath(); c.fill();
}
function roundSq(c, s, r) { c.beginPath(); c.roundRect(-s / 2, -s / 2, s, s, Math.min(r, s / 2)); c.fill(); }

// Background "Option A - orange radial", built once with a light dither against banding.
const bg = new OffscreenCanvas(W, H);
(() => {
  const g = bg.getContext('2d'), im = g.createImageData(W, H), d = im.data;
  const A = [255, 158, 64], B = [226, 84, 22]; let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = Math.pow(Math.min(1, Math.hypot((x - 540) / 780, (y - 940) / 1150)), 1.3), i = (y * W + x) * 4;
    for (let c = 0; c < 3; c++) d[i + c] = A[c] + (B[c] - A[c]) * p + rnd() * 1.2;
    d[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
})();

/* Rolling: each square travels from slot 0 to its own slot, all on the same fast-out curve. Its spin is
   proportional to the distance (like rolling) and lands on its final orientation:
   0 for the top-left bracket, 180° for the bottom-right one. */
const ORIENT = [0, 0, Math.PI];
const SPIN = ROW_X.map((x, i) => {
  const roll = (x - ROW_X[0]) / (BL * KR * 0.36) + (i === 0 ? TAU : 0);   // square 0 spins once in place
  return ORIENT[i] + TAU * Math.max(1, Math.round((roll - ORIENT[i]) / TAU));
});

/* ---------- one frame ---------- */
function draw(c, t) {
  if (!LK) layout(c);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.drawImage(bg, 0, 0, W, H);
  const z = 1 + 0.03 * ease(P(t, 10.3, DUR));                      // slow push-in on the hold
  c.setTransform(z, 0, 0, z, 540 * (1 - z), 960 * (1 - z));
  if (t < CUES.drop) return;

  const h = BL * KR / 2;
  /* --- act 1: drop + bounce (one square at slot 0) --- */
  let dropY = ROW_Y, sx = 1, sy = 1;
  if (t < CUES.land) {
    const p = P(t, CUES.drop, CUES.land);
    dropY = lerp(-200, ROW_Y, p * p); sy = 1 + 0.10 * p; sx = 1 - 0.05 * p;
  } else if (t < CUES.roll0) {
    const u1 = P(t, CUES.land, CUES.land2), u2 = P(t, CUES.land2, CUES.land2 + 0.16);
    dropY = ROW_Y - 120 * 4 * u1 * (1 - u1) - 16 * 4 * u2 * (1 - u2);
    const q = 0.14 * bump(P(t, CUES.land, CUES.land + 0.16)) + 0.05 * bump(P(t, CUES.land2, CUES.land2 + 0.12));
    sx = 1 + q; sy = 1 - q;
  }

  /* --- poses of the three parts --- */
  const r = fastOut(P(t, CUES.roll0, CUES.roll1));
  const a = ease(P(t, CUES.asm0, CUES.asm1));                       // row -> logo
  const spin = TAU * fastOut(P(t, CUES.asm0, CUES.asm1));           // fast spin, easy ease out (one full turn)
  const sl = ease(P(t, CUES.slide0, CUES.slide1));
  let gx = lerp(540, LK.cx, sl), gy = lerp(lerp(ROW_Y, 960, a), LK.cy, sl);
  let k = lerp(lerp(KR, KC, a), KL, sl);
  const logoOff = [[-DG, -DG], [0, 0], [DG, DG]];

  const parts = [0, 1, 2].map(i => {
    const rowX = lerp(ROW_X[0], ROW_X[i], r) - 540, rowY = (t < CUES.roll0 ? dropY : ROW_Y) - ROW_Y;
    const ox = lerp(rowX, logoOff[i][0] * k, a), oy = lerp(rowY, logoOff[i][1] * k, a);
    const cs = Math.cos(spin), sn = Math.sin(spin);
    const m = ease(P(t, CUES.mark[i], CUES.mark[i] + CUES.markDur));
    return {
      x: gx + ox * cs - oy * sn, y: gy + ox * sn + oy * cs,
      rot: SPIN[i] * r + spin, m, pop: 1 + 0.08 * bump(P(t, CUES.mark[i], CUES.mark[i] + CUES.markDur + 0.1)),
    };
  });

  // squares 1 and 2 hide behind square 0 until the roll starts
  [2, 1, 0].forEach(i => {
    const p = parts[i];
    if (i > 0 && t < CUES.roll0) return;
    c.save();
    c.translate(p.x, p.y + (i === 0 ? h * (1 - sy) : 0));
    c.rotate(p.rot); c.scale(k * p.pop * (i === 0 ? sx : 1), k * p.pop * (i === 0 ? sy : 1));
    if (i === 1) { const s = lerp(BL, 2 * R, p.m); c.fillStyle = mix(INK, CORE, p.m); roundSq(c, s, p.m * s / 2); }
    else { c.fillStyle = mix(INK, INK, 0); lshape(c, p.m * (BL - BT)); }
    c.restore();
  });

  /* --- one-word label under each part --- */
  if (t < CUES.asm0 + 0.2) {
    c.save(); c.textAlign = 'center'; c.fillStyle = mix(INK, INK, 0);
    LABELS.forEach((word, i) => {
      const p = ease(P(t, CUES.label[i], CUES.label[i] + 0.55));
      const o = p * (1 - ease(P(t, CUES.labOut, CUES.labOut + 0.4)));
      if (o <= 0) return;
      c.globalAlpha = 0.9 * o; c.font = '500 34px Inter';
      c.fillText(word, ROW_X[i], ROW_Y + 108 + 14 * (1 - p));
    });
    c.restore();
  }

  /* --- wordmark --- */
  if (t >= CUES.word) {
    c.save(); c.translate(LK.tx, LK.base); c.scale(KL, KL);
    c.beginPath(); c.rect(-6, -140, LK.wt + 60, 230); c.clip();
    c.fillStyle = mix(INK, INK, 0);
    LK.chars.forEach((ch, i) => {
      const a = CUES.word + 0.045 * i, p = ease(P(t, a, a + 0.7));
      if (p <= 0) return;
      c.font = ch.font; c.globalAlpha = Math.min(1, p * 1.6);
      c.fillText(ch.ch, ch.x - 140 * (1 - p), 0);
    });
    c.font = '500 24px Inter';
    LK.sub.forEach((ch, i) => {
      const a = CUES.sub + 0.022 * i, p = ease(P(t, a, a + 0.45));
      if (p <= 0) return;
      c.globalAlpha = 0.9 * p; c.fillText(ch.ch, ch.x, 62 + 10 * (1 - p));
    });
    c.restore();
  }
}

/* ---------- output: motion blur by sub-frame accumulation ---------- */
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
const RENDER = location.search.includes('render');
const SAMPLES = RENDER ? 10 : 1, SHUTTER = 0.5;
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

Promise.all(['500 24px Inter', '800 96px Inter', '400 96px Inter', '500 34px Inter'].map(f => document.fonts.load(f))).then(() => {
  layout(ctx); renderAt(0); window.READY = true;
  if (RENDER) { document.body.classList.add('render'); return; }
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), btn = document.getElementById('play');
  let playing = false, t0 = 0;
  const show = t => { renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2) + 's'; };
  scrub.oninput = () => { playing = false; show(+scrub.value); };
  btn.onclick = () => { playing = !playing; t0 = performance.now() - (+scrub.value % DUR) * 1000; if (playing) loop(); };
  const loop = () => { if (!playing) return; show(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); };
});
