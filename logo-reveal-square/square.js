/* ISP Agency logo reveal, square version: 1080x1920, 30 fps, 12 s, bright orange radial background, all-white mark.
   1. A white square drops in the middle and bounces.
   2. It bounces to the right; at each landing it drops a circle (the last landing turns the square itself into one).
   3. Each circle spins fast (motion blur) and forms its logo part, with a one-word label.
   4. The parts spin fast into the logo with an easy ease out, the mark slides left, and the brand name
      appears letter by letter with a counter effect: each letter flickers through random characters, then locks in.
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
  word: 9.28, wordStep: 0.08, wordDur: 0.42, sub: 10.25, subStep: 0.03, subDur: 0.30,   // dur = how long each letter 'counts'
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

// Background, built once with a light dither against banding. Pick a style with ?bg=<name> (preview) or BG_DEFAULT.
const BG_DEFAULT = 'orange';
const BG_STYLE = new URLSearchParams(location.search).get('bg') || BG_DEFAULT;
const BG_BLUR_DEFAULT = 0;                                          // background blur in px (1080-wide frame); preview with ?blur=<px>
const BG_BLUR = +(new URLSearchParams(location.search).get('blur') ?? BG_BLUR_DEFAULT);
const RAMP = [[0, [255, 138, 46]], [0.42, [228, 92, 20]], [0.78, [74, 24, 6]], [1, [7, 6, 6]]];  // orange -> ember -> black
const ramp = p => {
  p = Math.min(1, Math.max(0, p));
  for (let k = 1; k < RAMP.length; k++) if (p <= RAMP[k][0]) {
    const [p0, c0] = RAMP[k - 1], [p1, c1] = RAMP[k], u = (p - p0) / (p1 - p0), e = u * u * (3 - 2 * u);
    return c0.map((v, i) => v + (c1[i] - v) * e);
  }
  return RAMP[RAMP.length - 1][1];
};
const BG_STYLES = {
  orange: (x, y) => { const p = Math.pow(Math.min(1, Math.hypot((x - 540) / 780, (y - 940) / 1150)), 1.3);
    return [255, 158, 64].map((a, i) => a + ([226, 84, 22][i] - a) * p); },
  A: (x, y) => ramp(Math.hypot((x - 540) / 700, (y - 930) / 1000)),                                   // radial orange glow, black edges
  B: (x, y) => ramp(Math.abs(y - 930) / 640 + 0.25 * ((x - 540) / 540) ** 2),                          // horizontal orange band, black top and bottom
  C: (x, y) => { const d = Math.abs((x - 540) * 0.574 - (y - 930) * 0.819) / 470, r = Math.hypot((x - 540) / 900, (y - 930) / 1300);
    return ramp(0.75 * d + 0.45 * r); },                                                               // diagonal orange sweep through the centre
};
/* ---------- animated backgrounds (black + orange), modelled on the three reference clips ----------
   silk   : soft drifting smoke with thin glowing silk streaks
   liquid : big soft orange blobs flowing over black, like a liquid mesh gradient
   bands  : soft horizontal gradient bands rolling down in a loop
   Computed at quarter resolution once per video frame, upscaled smoothly, then a fine film grain on top. */
const fract = x => x - Math.floor(x);
const h2 = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) { let s = 0, a = 0.5; for (let o = 0; o < 4; o++) { s += a * vnoise(x, y); x = x * 2.02 + 1.7; y = y * 2.03 + 9.2; a *= 0.5; } return s; }
const HOT = [[0, [5, 4, 5]], [0.32, [62, 17, 3]], [0.62, [212, 78, 12]], [0.84, [255, 128, 36]], [1, [255, 196, 128]]];
const hot = p => {
  p = Math.min(1, Math.max(0, p));
  for (let k = 1; k < HOT.length; k++) if (p <= HOT[k][0]) {
    const [p0, c0] = HOT[k - 1], [p1, c1] = HOT[k], u = (p - p0) / (p1 - p0), e = u * u * (3 - 2 * u);
    return c0.map((v, i) => v + (c1[i] - v) * e);
  }
  return HOT[HOT.length - 1][1];
};
const centre = (X, Y) => Math.exp(-(((X - 0.5) ** 2) / 0.16 + ((Y - 0.86) ** 2) / 0.30));  // keeps orange behind the logo row
const sstep = (e0, e1, x) => { const u = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return u * u * (3 - 2 * u); };
const rowGlow = (X, Y) => Math.exp(-((Y - 0.9) ** 2) / 0.10 - ((X - 0.5) ** 2) / 0.40);   // soft wide light behind the logo + labels
const lift = (b, X, Y, k = 0.62) => 1 - (1 - b) * (1 - k * rowGlow(X, Y));               // soft 'screen' blend, no hard edge
const SILK_STOPS = [[0, [6, 5, 6]], [0.3, [40, 12, 4]], [0.5, [130, 40, 8]], [0.68, [214, 84, 16]], [0.86, [250, 132, 46]], [1.0, [255, 186, 120]], [1.1, [255, 214, 170]]];
const SILK = p => {                                  // light = orange -> warm white, shadow = black
  for (let k = 1; k < SILK_STOPS.length; k++) if (p <= SILK_STOPS[k][0]) {
    const [p0, c0] = SILK_STOPS[k - 1], [p1, c1] = SILK_STOPS[k], u = (p - p0) / (p1 - p0), e = u * u * (3 - 2 * u);
    return c0.map((v, i) => v + (c1[i] - v) * e);
  }
  return SILK_STOPS[SILK_STOPS.length - 1][1];
};
const ANIM = {
  silk(X, Y, t) {                                   // soft drifting smoke + a few thin silk wisps
    const qx = fbm(X * 0.9 + t * 0.05, Y * 0.9), qy = fbm(X * 0.9 + 5.2, Y * 0.9 - t * 0.04);
    const f = fbm(X * 0.8 + 1.4 * qx + t * 0.03, Y * 0.8 + 1.4 * qy - t * 0.015);
    let b = 0.04 + 0.9 * sstep(0.32, 0.74, f);
    b = b * 0.68 + 0.42 * centre(X, Y);
    const s = fract(f * 2.2 + qx * 0.8 + t * 0.04);
    b += 0.30 * Math.exp(-((s - 0.5) ** 2) / 0.0006) * sstep(0.42, 0.66, f);
    return hot(lift(b, X, Y));
  },
  liquid(X, Y, t) {                                 // several soft blobs flowing, with dark valleys between them
    const wx = X + 0.16 * (fbm(X * 1.1 + t * 0.08, Y * 1.1) - 0.5), wy = Y + 0.16 * (fbm(X * 1.1 + 3.1, Y * 1.1 - t * 0.08) - 0.5);
    const blobs = [[0.55, 0.36, 0.26, 1.0, 0.0], [0.42, 0.30, 0.30, 0.85, 1.7], [0.48, 0.42, 0.24, 0.9, 3.4], [0.63, 0.34, 0.28, 0.7, 5.1], [0.36, 0.40, 0.22, 0.8, 2.6]];
    let b = 0;
    blobs.forEach(([w, ax, r, a, ph], i) => {
      const cx = 0.5 + ax * Math.sin(t * w + ph), cy = 0.89 + 0.7 * Math.sin(t * w * 0.77 + ph * 1.3 + i);
      b += a * Math.exp(-(((wx - cx) ** 2) + ((wy - cy) ** 2) * 0.6) / (r * r));
    });
    b = 0.03 + 0.88 * (1 - Math.exp(-b * 1.5));
    return hot(lift(b * 0.85, X, Y));
  },
  silkref(X, Y, t) {                                // closely modelled on the reference: soft light from the top-left,
    const tt = t * 0.022;                           // soft smoky clouds, a few thin silky light lines, slow drift
    const lx = X, ly = Y / 1.778;
    const dd = Math.hypot(lx * 0.75, ly) / 1.25;                                      // 0 at top-left -> 1 at bottom-right
    let L = 0.98 - 0.62 * Math.pow(dd, 1.15);                                          // gentle diagonal falloff
    L += 0.13 * Math.exp(-((lx + 0.10) ** 2) / 0.12 - ((ly - 0.05) ** 2) / 0.30);     // broad soft light from the top-left, spilling down the left side
    const qx = fbm(X * 1.0 + tt, Y * 1.0 - tt * 0.6), qy = fbm(X * 1.0 + 4.3 - tt * 0.5, Y * 1.0 + 1.1);
    const f = fbm(X * 1.15 + 1.7 * qx + tt, Y * 1.15 + 1.7 * qy);
    L += 0.30 * (sstep(0.3, 0.72, f) - 0.5);                                           // soft smoky clouds
    const g = fbm(X * 0.6 + 1.3 * qx + 3.0 + tt * 0.8, Y * 0.6 + 1.3 * qy);
    const s = fract(g * 7.0 + 0.15);
    L += 0.20 * Math.exp(-((s - 0.5) ** 2) / 0.0012) * Math.exp(-((ly - 0.25) ** 2) / 0.07) * sstep(0.35, 0.6, f);   // thin silk lines
    L -= 0.26 * sstep(0.70, 1.05, dd);                                                 // black only in the bottom-right corner; orange stays dominant
    return SILK(Math.min(1.1, Math.max(0, L)));
  },
  bands(X, Y, t) {                                  // soft gradient bands rolling down in a loop
    const ph = Y * 1.05 - t * 0.21 + 0.05 * Math.sin(X * 3.2 + t * 0.4);
    const band = 0.5 + 0.5 * Math.sin(2 * Math.PI * ph);
    let b = 0.05 + 0.88 * Math.pow(band, 1.3);
    const cy = Math.exp(-((Y - 0.86) ** 2) / 0.05);                             // never fully black behind the logo row
    b = lift(Math.max(b, 0.4 * cy), X, Y, 0.5);
    const edge = Math.min(1, Y / 0.18, (1.778 - Y) / 0.18);
    return hot(b * (0.55 + 0.45 * edge));
  },
};
const BW = 360, BH = 640;
const bgLow = new OffscreenCanvas(BW, BH), bgLowCtx = bgLow.getContext('2d'), bgImg = bgLowCtx.createImageData(BW, BH);
const bgFull = new OffscreenCanvas(W, H), bgFullCtx = bgFull.getContext('2d');
const grain = new OffscreenCanvas(512, 512);
(() => { const g = grain.getContext('2d'), im = g.createImageData(512, 512); let sd = 3;
  for (let i = 0; i < im.data.length; i += 4) { sd = (sd * 16807) % 2147483647; const v = 128 + (sd / 2147483647 - 0.5) * 70; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); })();
let bgFrame = -1;
function animatedBg(t) {
  const f = Math.round(t * FPS);
  if (f === bgFrame) return bgFull;                                              // motion-blur sub-samples reuse the frame's background
  bgFrame = f; const tt = f / FPS, fn = ANIM[BG_STYLE], d = bgImg.data;
  for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
    const c = fn(x / BW, (y / BH) * 1.778, tt), i = (y * BW + x) * 4;
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
  }
  bgLowCtx.putImageData(bgImg, 0, 0);
  bgFullCtx.imageSmoothingEnabled = true; bgFullCtx.imageSmoothingQuality = 'high';
  bgFullCtx.globalCompositeOperation = 'source-over'; bgFullCtx.globalAlpha = 1;
  if (BG_BLUR > 0) {                                                             // overscan so the blur doesn't darken the edges
    const m = BG_BLUR * 3; bgFullCtx.filter = `blur(${BG_BLUR}px)`;
    bgFullCtx.drawImage(bgLow, -m, -m * H / W, W + 2 * m, H + 2 * m * H / W); bgFullCtx.filter = 'none';
  } else bgFullCtx.drawImage(bgLow, 0, 0, W, H);
  bgFullCtx.globalCompositeOperation = 'overlay'; bgFullCtx.globalAlpha = 0.07;   // fine film grain (also hides banding)
  const ox = (f * 137) % 512, oy = (f * 251) % 512;
  for (let y = -oy; y < H; y += 512) for (let x = -ox; x < W; x += 512) bgFullCtx.drawImage(grain, x, y);
  bgFullCtx.globalCompositeOperation = 'source-over'; bgFullCtx.globalAlpha = 1;
  return bgFull;
}
const bg = new OffscreenCanvas(W, H);
(() => {
  if (ANIM[BG_STYLE]) return;
  const g = bg.getContext('2d'), im = g.createImageData(W, H), d = im.data, fn = BG_STYLES[BG_STYLE] || BG_STYLES.orange;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = fn(x, y), i = (y * W + x) * 4;
    for (let k = 0; k < 3; k++) d[i + k] = c[k] + rnd() * 1.2;
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
  c.drawImage(ANIM[BG_STYLE] ? animatedBg(t) : bg, 0, 0, W, H);
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
    c.save(); c.textAlign = 'center'; c.font = '700 36px Satoshi'; c.letterSpacing = '-1.4px'; c.fillStyle = BLACK;   // labels: Satoshi Bold, tight tracking, black
    LABELS.forEach((word, i) => {
      const a0 = Q.form[i] + 0.45, p = ease(P(t, a0, a0 + 0.55));
      const o = p * (1 - ease(P(t, Q.labOut, Q.labOut + 0.4)));
      if (o <= 0) return;
      c.globalAlpha = o; c.filter = `blur(${(6 * (1 - p)).toFixed(2)}px)`;
      c.fillText(word, ROW_X[i], ROW_Y + 108 + 14 * (1 - p));
    });
    c.restore();
  }

  /* --- brand name: letter by letter, counter / scramble effect --- */
  if (t >= Q.word) {
    c.save(); c.translate(LK.tx, LK.base); c.scale(KL, KL); c.filter = 'none';
    const frame = Math.round(t * FPS);                      // all motion-blur sub-samples of a frame show the same glyph
    const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', LO = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    const letter = (ch, font, x, w, y, a0, dur, col, idx) => {
      if (t < a0) return;
      c.font = font; c.fillStyle = col; c.globalAlpha = ease(P(t, a0, a0 + 0.12));
      if (t < a0 + dur && ch !== ' ') {                     // counting: a new random glyph every 2 frames
        const pool = ch === ch.toUpperCase() ? UP : LO;
        let g = pool[Math.floor(hash(Math.floor(frame / 2) * 13 + idx * 7) * pool.length)];
        if (g === ch) g = pool[(pool.indexOf(g) + 5) % pool.length];
        c.textAlign = 'center'; c.fillText(g, x + w / 2, y); c.textAlign = 'left';
      } else c.fillText(ch, x, y);
    };
    LK.chars.forEach((ch, i) => letter(ch.ch, ch.font, ch.x, ch.w, 0, Q.word + Q.wordStep * i, Q.wordDur, i < 3 ? BLACK : WHITE, i));   // "ISP" black, "Agency" white
    LK.sub.forEach((ch, i) => letter(ch.ch, '500 24px Inter', ch.x, ch.w, 62, Q.sub + Q.subStep * i, Q.subDur, BLACK, 100 + i));
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

Promise.all(['500 24px Inter', '800 96px Inter', '400 96px Inter', '700 36px Satoshi'].map(f => document.fonts.load(f))).then(() => {
  layout(ctx); renderAt(0); window.READY = true;
  if (RENDER) { document.body.classList.add('render'); return; }
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), btn = document.getElementById('play');
  let playing = false, t0 = 0;
  const show = t => { renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2) + 's'; };
  scrub.oninput = () => { playing = false; show(+scrub.value); };
  btn.onclick = () => { playing = !playing; t0 = performance.now() - (+scrub.value % DUR) * 1000; if (playing) loop(); };
  const loop = () => { if (!playing) return; show(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); };
});
