/* ISP Agency logo reveal, square version: 1080x1920, 30 fps, 9 s, bright orange radial background.
   A square drops and bounces, rolls to the right, splits into three squares while spinning, and those
   "mark" into the logo: the outer two cut into brackets, the middle one rounds into the white core.
   The mark spins fast with an easy-ease-out, then slides left to reveal the wordmark.
   Every frame is a pure function of time: window.renderAt(seconds). */
const W = 1080, H = 1920, FPS = 30, DUR = 9;

/* ---------- brand ---------- */
const INK = [17, 17, 17], CORE = [255, 255, 255];
const R = 52, BL = 98, BT = 34, DG = 69;   // core radius, bracket arm, bracket thickness, bracket offset (mark units)
const SQ = 150;                            // the dropping square, mark units
const KC = 1.2, KL = 0.82;                 // mark scale centre-stage / in the final lockup
const SUB = 'CREATIVE EDITING STUDIO';

/* ---------- timing (seconds) ---------- */
const CUES = {
  drop: 0.30, land: 1.00, land2: 1.40, land3: 1.58,
  roll0: 1.75, roll1: 2.40, spin1: 3.35, split0: 2.55, split1: 3.20,
  mark0: 3.30, mark1: 3.95, fast0: 3.95, fast1: 5.25,
  slide0: 5.45, slide1: 6.35, word: 5.70, sub: 6.40,
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
const easeOut = bezier(0.40, 0, 0.08, 1);   // quick start, long easy-ease-out (the fast spin)
const imp = (x, a, f = 40, d = 13) => x < 0 ? 0 : a * Math.exp(-x * d) * Math.cos(x * f);
const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], p))).join(',')})`;
const D2R = Math.PI / 180;

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

/* ---------- one frame ---------- */
// Background "Option A - orange radial": same formula as bg.png, built once with a light dither against banding.
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
function draw(c, t) {
  if (!LK) layout(c);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.drawImage(bg, 0, 0, W, H);
  const z = 1 + 0.03 * ease(P(t, 6.3, DUR));                       // slow push-in on the hold
  c.setTransform(z, 0, 0, z, 540 * (1 - z), 960 * (1 - z));
  c.fillStyle = mix(INK, INK, 0);

  const h = SQ * KC / 2, Y = 960, x0 = 540 - h;
  if (t < CUES.drop) return;

  /* --- act 1: drop, bounce, roll right (single square) --- */
  if (t < CUES.roll1) {
    let cx = x0, cy, ang = 0, sx = 1, sy = 1;
    if (t < CUES.land) {
      const p = P(t, CUES.drop, CUES.land);
      cy = lerp(-260, Y, p * p); sy = 1 + 0.12 * p; sx = 1 - 0.06 * p;
    } else {
      const u1 = P(t, CUES.land, CUES.land2), u2 = P(t, CUES.land2, CUES.land3);
      cy = Y - 150 * 4 * u1 * (1 - u1) - 34 * 4 * u2 * (1 - u2);
      const q = imp(t - CUES.land, 0.17) + imp(t - CUES.land2, 0.08) + imp(t - CUES.land3, 0.04);
      sx = 1 + q; sy = 1 - q;
    }
    if (t >= CUES.roll0) {                                  // roll over the bottom-right corner
      const a = 90 * ease(P(t, CUES.roll0, CUES.roll1)) * D2R;
      const px = x0 + h, py = Y + h, ox = -h, oy = -h;
      cx = px + ox * Math.cos(a) - oy * Math.sin(a); cy = py + ox * Math.sin(a) + oy * Math.cos(a);
      ang = a; sx = sy = 1;
    }
    c.save(); c.translate(cx, cy + h * (1 - sy)); c.rotate(ang); c.scale(sx * KC, sy * KC);
    c.fillStyle = mix(INK, INK, 0); c.fillRect(-SQ / 2, -SQ / 2, SQ, SQ); c.restore();
    return;
  }

  /* --- act 2-4: spin + split, mark into the logo, fast spin, slide left --- */
  const sp = ease(P(t, CUES.roll1, CUES.spin1));
  let gx = lerp(x0 + 2 * h, 540, sp), gy = Y, k = KC;
  let th = 90 + 180 * sp;                                          // keeps rotating while it splits
  th += -25 * ease(P(t, CUES.mark0, CUES.mark1));                  // small wind-up
  th += 835 * easeOut(P(t, CUES.fast0, CUES.fast1));               // fast spin, easy ease out -> 1080 = upright
  k *= 1 + 0.10 * Math.sin(Math.PI * ease(P(t, CUES.fast0, CUES.fast1)));
  const sl = ease(P(t, CUES.slide0, CUES.slide1));
  gx = lerp(gx, LK.cx, sl); gy = lerp(gy, LK.cy, sl); k = lerp(k, KL, sl);

  const s = ease(P(t, CUES.split0, CUES.split1));                  // split progress
  const m = ease(P(t, CUES.mark0, CUES.mark1));                    // marking (morph) progress
  const spread = lerp(0, 1.6, s) * (1 - m) + m * 1;               // fan out, then pull in to logo spacing

  c.save(); c.translate(gx, gy); c.rotate(th * D2R); c.scale(k, k);
  c.fillStyle = mix(INK, INK, 0);
  [-1, 1].forEach(sd => {                                          // outer squares -> brackets
    if (s <= 0) return;
    c.save(); c.translate(sd * DG * spread, sd * DG * spread); if (sd > 0) c.rotate(Math.PI);
    lshape(c, m * (BL - BT)); c.restore();
  });
  const size = lerp(lerp(SQ, BL, s), 2 * R, m);                    // middle square -> white core
  c.fillStyle = mix(INK, CORE, m); roundSq(c, size, m * size / 2);
  c.restore();

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

Promise.all([...['500 24px Inter', '800 96px Inter', '400 96px Inter'].map(f => document.fonts.load(f))]).then(() => {
  layout(ctx); renderAt(0); window.READY = true;
  if (RENDER) { document.body.classList.add('render'); return; }
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), btn = document.getElementById('play');
  let playing = false, t0 = 0;
  const show = t => { renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2) + 's'; };
  scrub.oninput = () => { playing = false; show(+scrub.value); };
  btn.onclick = () => { playing = !playing; t0 = performance.now() - (+scrub.value % DUR) * 1000; if (playing) loop(); };
  const loop = () => { if (!playing) return; show(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); };
});
