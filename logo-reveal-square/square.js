/* ISP Agency logo reveal, square version: 1080x1920, 30 fps, 12 s, bright orange radial background, all-white mark.
   1. A white square drops in the middle and bounces.
   2. It bounces to the right; at each landing it drops a circle (the last landing turns the square itself into one).
   3. Each circle spins fast (motion blur) and forms its logo part, with a one-word label.
   4. The parts spin fast into the logo with an easy ease out, the mark slides left, and the brand name
      appears letter by letter with an easy-ease blur-in.
   Every frame is a pure function of time: window.renderAt(seconds). */
const W = 1080, H = 1920, FPS = 30, DUR = 12;

/* ---------- brand ---------- */
const WHITE = '#FFFFFF', BLACK = '#111111';   // brackets and "Agency" white; core, "ISP", subline and labels black
const mixHex = p => { const v = Math.round(lerp(255, 17, p)); return `rgb(${v},${v},${v})`; };
const R = 52, BL = 98, BT = 34, DG = 69;   // core radius, bracket arm, bracket thickness, bracket offset (mark units)
const SQ = 100;                            // the dropping square (px)
const KR = 1.0, KC = 1.25, KL = 0.82;      // shape scale in the row / logo centre-stage / final lockup
const ROW_Y = 900, ROW_X = [230, 540, 850];
const LABELS = ['Structure', 'Focus', 'Clarity'];
const SUB = 'CREATIVE EDITING STUDIO';

/* ---------- timing (seconds) ---------- */
const CUES = {
  drop: 0.30, land1: 1.00, land2: 1.55, land3: 2.05, sqMorph: 0.35,
  form: [2.70, 4.10, 5.50], formDur: 0.90, labOut: 6.90,
  asm0: 7.10, asm1: 8.40, slide0: 8.55, slide1: 9.35,
  word: 8.80, wordStep: 0.07, wordDur: 0.65, sub: 9.85, subStep: 0.028, subDur: 0.55,
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
const ease = bezier(0.33, 0, 0.67, 1);       // After Effects "Easy Ease"
const fastOut = bezier(0.16, 0.72, 0.24, 1); // starts fast, long smooth ease down
const bump = p => Math.sin(Math.PI * ease(p));
const TAU = 2 * Math.PI;
const hop = (u, hgt) => 4 * hgt * u * (1 - u);  // parabola 0 -> hgt -> 0

/* ---------- lockup layout ---------- */
let LK = null;
function layout(c) {
  const F = 96, chars = [];
  const word = (s, wt, x0) => {
    c.font = `${wt} ${F}px Inter`;
    for (let i = 0; i < s.length; i++) chars.push({ ch: s[i], x: x0 + c.measureText(s.slice(0, i)).width, w: c.measureText(s[i]).width, font: c.font });
    return x0 + c.measureText(s).width;
  };
  let x = word('ISP', 800, 0);
  c.font = `400 ${F}px Inter`; x += c.measureText(' ').width * 0.9;
  const wt = word('Agency', 400, x);
  c.font = `500 24px Inter`;
  const w0 = c.measureText(SUB).width, sp = (wt - w0) / (SUB.length - 1);
  const sub = [...SUB].map((ch, i) => ({ ch, x: c.measureText(SUB.slice(0, i)).width + i * sp, w: c.measureText(ch).width }));
  const total = (2 * (DG + BL / 2) + 46 + wt) * KL;
  LK = { chars, sub, wt, cx: 540 - total / 2 + (DG + BL / 2) * KL, cy: 960 };
  LK.tx = LK.cx + (DG + BL / 2 + 46) * KL;
  LK.base = LK.cy + 35 * KL;
}

/* ---------- shapes (mark units, centred on the origin) ---------- */
// m: 0 = circle, 0.5 = square, 1 = top-left bracket (square with its bottom-right corner cut away)
function circleToBracket(c, m) {
  const h = BL / 2;
  if (m < 0.5) { c.beginPath(); c.roundRect(-h, -h, BL, BL, h * (1 - ease(m / 0.5))); c.fill(); return; }
  const cut = ease((m - 0.5) / 0.5) * (BL - BT);
  c.beginPath(); c.moveTo(-h, -h); c.lineTo(h, -h); c.lineTo(h, h - cut); c.lineTo(h - cut, h - cut);
  c.lineTo(h - cut, h); c.lineTo(-h, h); c.closePath(); c.fill();
}
function disc(c, r) { c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); }

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

/* ---------- act 1-2: the bouncing square and the circles it drops ---------- */
function squarePose(t) {          // centre position, rotation, squash
  const Q = CUES;
  let x = 540, y = ROW_Y, rot = 0;
  if (t < Q.land1) { const p = P(t, Q.drop, Q.land1); y = lerp(-220, ROW_Y, p * p); }
  else if (t < Q.land2) { const u = P(t, Q.land1, Q.land2); x = lerp(540, 695, u); y = ROW_Y - hop(u, 210); rot = 0.5 * Math.PI * ease(u); }
  else if (t < Q.land3) { const u = P(t, Q.land2, Q.land3); x = lerp(695, 850, u); y = ROW_Y - hop(u, 130); rot = 0.5 * Math.PI * (1 + ease(u)); }
  else { x = 850; rot = Math.PI; }
  const q = 0.16 * bump(P(t, Q.land1, Q.land1 + 0.16)) + 0.11 * bump(P(t, Q.land2, Q.land2 + 0.14)) + 0.08 * bump(P(t, Q.land3, Q.land3 + 0.14));
  return { x, y, rot, sx: 1 + q, sy: 1 - q };
}
// circle i: dropped at a landing, then arcs back to its slot. Circle 2 is the square itself.
function droppedCircle(i, t) {
  const Q = CUES;
  const spec = [{ at: Q.land1, from: 540, dur: 0.62, hgt: 240 }, { at: Q.land2, from: 695, dur: 0.50, hgt: 150 }][i];
  if (t < spec.at) return null;
  const u = P(t, spec.at, spec.at + spec.dur);
  const land = spec.at + spec.dur, q = 0.14 * bump(P(t, land, land + 0.15));
  return { x: lerp(spec.from, ROW_X[i], u), y: ROW_Y - hop(u, spec.hgt), s: lerp(0.35, 1, ease(P(t, spec.at, spec.at + 0.22))), sx: 1 + q, sy: 1 - q };
}

/* ---------- one frame ---------- */
function draw(c, t) {
  if (!LK) layout(c);
  c.setTransform(1, 0, 0, 1, 0, 0); c.filter = 'none'; c.globalAlpha = 1;
  c.drawImage(bg, 0, 0, W, H);
  const z = 1 + 0.03 * ease(P(t, 9.3, DUR));                        // slow push-in on the hold
  c.setTransform(z, 0, 0, z, 540 * (1 - z), 960 * (1 - z));
  c.fillStyle = WHITE;
  if (t < CUES.drop) return;
  const Q = CUES, bottomAnchor = (y, r, sy) => y + r * (1 - sy);

  if (t < Q.form[0]) {
    /* --- drop, bounce right, drop circles --- */
    [0, 1].forEach(i => {
      const d = droppedCircle(i, t); if (!d) return;
      const r = BL / 2 * d.s;
      c.save(); c.translate(d.x, bottomAnchor(d.y, r, d.sy)); c.scale(d.sx * d.s, d.sy * d.s); disc(c, BL / 2); c.restore();
    });
    const s = squarePose(t), m = ease(P(t, Q.land3, Q.land3 + Q.sqMorph));
    c.save(); c.translate(s.x, bottomAnchor(s.y, SQ / 2, s.sy)); c.rotate(s.rot); c.scale(s.sx, s.sy);
    const size = lerp(SQ, BL, m); c.beginPath(); c.roundRect(-size / 2, -size / 2, size, size, m * size / 2); c.fill();
    c.restore();
    return;
  }

  /* --- forming (fast spin), then assembly into the logo and slide left --- */
  const a = ease(P(t, Q.asm0, Q.asm1));
  const spin = TAU * fastOut(P(t, Q.asm0, Q.asm1));
  const sl = ease(P(t, Q.slide0, Q.slide1));
  const gx = lerp(540, LK.cx, sl), gy = lerp(lerp(ROW_Y, 960, a), LK.cy, sl);
  const k = lerp(lerp(KR, KC, a), KL, sl);
  const logoOff = [[-DG, -DG], [0, 0], [DG, DG]];
  const cs = Math.cos(spin), sn = Math.sin(spin);
  [0, 1, 2].forEach(i => {
    const ox = lerp(ROW_X[i] - 540, logoOff[i][0] * k, a), oy = lerp(0, logoOff[i][1] * k, a);
    const f0 = Q.form[i], fp = P(t, f0, f0 + Q.formDur);
    const orient = i === 2 ? Math.PI : 0;
    const selfSpin = (orient + 2 * TAU) * fastOut(fp);              // two fast turns, easing down
    const pop = 1 + 0.10 * bump(P(t, f0, f0 + Q.formDur));
    c.save(); c.translate(gx + ox * cs - oy * sn, gy + ox * sn + oy * cs); c.rotate(selfSpin + spin); c.scale(k * pop, k * pop);
    if (i === 1) { c.fillStyle = mixHex(ease(fp)); disc(c, lerp(BL / 2, R, ease(fp))); c.fillStyle = WHITE; }  // white circle turns black as it forms
    else circleToBracket(c, P(t, f0, f0 + 0.6));
    c.restore();
  });

  /* --- one-word labels --- */
  if (t < Q.labOut + 0.5) {
    c.save(); c.textAlign = 'center'; c.font = '500 36px Satoshi'; c.letterSpacing = '-1.4px'; c.fillStyle = BLACK;   // labels: Satoshi Medium, tight tracking, black
    LABELS.forEach((word, i) => {
      const a0 = Q.form[i] + 0.45, p = ease(P(t, a0, a0 + 0.55));
      const o = p * (1 - ease(P(t, Q.labOut, Q.labOut + 0.4)));
      if (o <= 0) return;
      c.globalAlpha = o; c.filter = `blur(${(6 * (1 - p)).toFixed(2)}px)`;
      c.fillText(word, ROW_X[i], ROW_Y + 108 + 14 * (1 - p));
    });
    c.restore();
  }

  /* --- brand name: letter by letter, easy ease + blur --- */
  if (t >= Q.word) {
    c.save(); c.translate(LK.tx, LK.base); c.scale(KL, KL);
    const letter = (ch, font, x, y, p, blurMax, rise, col) => {
      c.fillStyle = col;
      if (p <= 0) return;
      c.font = font; c.globalAlpha = p; c.filter = p < 1 ? `blur(${(blurMax * (1 - p)).toFixed(2)}px)` : 'none';
      c.fillText(ch, x, y + rise * (1 - p));
    };
    LK.chars.forEach((ch, i) => {
      const a0 = Q.word + Q.wordStep * i;
      letter(ch.ch, ch.font, ch.x, 0, ease(P(t, a0, a0 + Q.wordDur)), 18, 36, i < 3 ? BLACK : WHITE);   // "ISP" black, "Agency" white
    });
    LK.sub.forEach((ch, i) => {
      const a0 = Q.sub + Q.subStep * i;
      letter(ch.ch, '500 24px Inter', ch.x, 62, ease(P(t, a0, a0 + Q.subDur)), 8, 12, BLACK);
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

Promise.all(['500 24px Inter', '800 96px Inter', '400 96px Inter', '500 36px Satoshi'].map(f => document.fonts.load(f))).then(() => {
  layout(ctx); renderAt(0); window.READY = true;
  if (RENDER) { document.body.classList.add('render'); return; }
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), btn = document.getElementById('play');
  let playing = false, t0 = 0;
  const show = t => { renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2) + 's'; };
  scrub.oninput = () => { playing = false; show(+scrub.value); };
  btn.onclick = () => { playing = !playing; t0 = performance.now() - (+scrub.value % DUR) * 1000; if (playing) loop(); };
  const loop = () => { if (!playing) return; show(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); };
});
