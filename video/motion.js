/* ISP Agency — kinetic typography promo
 * 1080x1920 · 30 fps · 27 s (810 frames)
 * Every frame is a pure function of time: window.renderAt(seconds).
 */
'use strict';

const FPS = 30, DUR = 27, FR = 1 / FPS, W = 1080, H = 1920;
const NS = 'http://www.w3.org/2000/svg';
const RGB = { accent: [255, 130, 28], text: [10, 10, 10], muted: [160, 160, 160], bg: [248, 248, 248] };
const ACC = '#FF821C', TXT = '#0A0A0A', MUT = '#A0A0A0', BG = '#F8F8F8';

/* ---------- math ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, a, b) => clamp((t - a) / (b - a));
function cubicBezier(x1, y1, x2, y2) {
  const B = (u, a, b) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
  return p => {
    if (p <= 0) return 0; if (p >= 1) return 1;
    let lo = 0, hi = 1, u = p;
    for (let i = 0; i < 28; i++) { u = (lo + hi) / 2; if (B(u, x1, x2) < p) lo = u; else hi = u; }
    return B(u, y1, y2);
  };
}
const eo = cubicBezier(0.16, 1, 0.3, 1);          // the house ease-out
const ei = p => p * p * p;                          // accelerate (exits)
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const pop = p => p <= 0 ? 0 : p < .6 ? 1.1 * eo(p / .6) : 1.1 - .1 * eio((p - .6) / .4); // 0 → 110% → 100%
const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * p)).join(',')})`;
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- DOM helpers ---------- */
const $ = s => document.querySelector(s);
function el(tag, parent, cls, style, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) Object.assign(e.style, style);
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
function sv(tag, parent, attrs = {}) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const layer = (parent, z) => sv('svg', parent, { width: W, height: H, viewBox: `0 0 ${W} ${H}`,
  style: `position:absolute;left:0;top:0;overflow:visible${z != null ? ';z-index:' + z : ''}` });
const px = v => v + 'px';
function at(e, x, y) { e.style.left = px(x); e.style.top = px(y); return e; }
/* transform for centred elements */
function T(e, o) {
  e.style.transform = `translate(-50%,-50%) translate(${o.x || 0}px,${o.y || 0}px) rotate(${o.r || 0}deg) scale(${o.s == null ? 1 : o.s})`;
  if (o.o != null) e.style.opacity = o.o;
}
/* transform for full-width / non-centred elements */
function TT(e, o) {
  e.style.transform = `translate(${o.x || 0}px,${o.y || 0}px) rotate(${o.r || 0}deg) scale(${o.s == null ? 1 : o.s})`;
  if (o.o != null) e.style.opacity = o.o;
}

/* directional motion blur via per-element SVG gaussian (stdDeviation X Y) */
let fid = 0;
function mb(e, bx, by = 0) {
  bx = Math.max(0, bx); by = Math.max(0, by);
  if (bx < .3 && by < .3) { if (e._f) e.style.filter = ''; return; }
  if (!e._f) {
    const id = 'mb' + (fid++);
    const f = sv('filter', $('#defs'), { id, x: '-60%', y: '-60%', width: '220%', height: '220%', 'color-interpolation-filters': 'sRGB' });
    e._f = { id, g: sv('feGaussianBlur', f, { stdDeviation: '0 0' }) };
  }
  e._f.g.setAttribute('stdDeviation', bx.toFixed(2) + ' ' + by.toFixed(2));
  e.style.filter = `url(#${e._f.id})`;
}

/* text: build a line from segments, every character its own span */
function textLine(parent, top, segs, extra = {}) {
  const line = el('div', parent, 'line', Object.assign({ top: px(top) }, extra));
  const chars = [], groups = [];
  for (const s of segs) {
    const g = el('span', line, (s.cls || 'sans') + (s.block ? ' ib' : ''), s.style || {});
    groups.push(g);
    if (s.whole) { g.textContent = s.t; continue; }
    for (const ch of s.t) { const c = el('span', g, null, null); c.textContent = ch; chars.push(c); }
  }
  return { line, chars, groups };
}
function typeIn(chars, lt, t0, per, opt = {}) {
  const fade = opt.fade || 2 * FR;
  chars.forEach((c, i) => {
    const a = t0 + i * per, p = P(lt, a, a + fade);
    c.style.opacity = p;
    if (opt.gray) c.style.color = mix(RGB.muted, opt.to || RGB.text, P(lt, a, a + (opt.grayDur || 6 * FR)));
  });
}
function glow(parent, x, y, w, h) { return at(el('div', parent, 'glow', { width: px(w), height: px(h) }), x, y); }
function rel(e) { const r = e.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); return { cx: r.left - s.left + r.width / 2, cy: r.top - s.top + r.height / 2, w: r.width, h: r.height }; }

/* ---------- transitions (whip / spin / zoom-through, all motion-blurred) ---------- */
const ENTER = {
  fromRight: q => ({ x: 1300 * (1 - eo(q)), bx: 90 * (1 - q) ** 2 }),
  drop: q => ({ y: -1900 * (1 - eo(q)), by: 90 * (1 - q) ** 2 }),
  fromBottom: q => ({ y: 1900 * (1 - eo(q)), by: 90 * (1 - q) ** 2 }),
  zoomIn: q => ({ s: .55 + .45 * eo(q), o: Math.min(1, q * 2.5), b: 18 * (1 - q) ** 2 }),
  spinIn: q => ({ r: -55 * (1 - eo(q)), s: .85 + .15 * eo(q), o: Math.min(1, q * 2.5), b: 22 * (1 - q) ** 2 }),
  bigIn: q => ({ s: 1.9 - .9 * eo(q), o: Math.min(1, q * 2.5), b: 20 * (1 - q) ** 2 }),
  fadeScale: q => ({ s: 1.08 - .08 * eo(q), o: eo(q), b: 10 * (1 - q) ** 2 }),
};
const EXIT = {
  whipLeft: p => ({ x: -1300 * ei(p), bx: 90 * p * p }),
  whipUp: p => ({ y: -1900 * ei(p), by: 90 * p * p }),
  spinOut: p => ({ r: 70 * ei(p), s: 1 + .5 * ei(p), o: 1 - p * p, b: 25 * p * p }),
  zoomThrough: p => ({ s: 1 + 3 * ei(p), o: 1 - Math.pow(p, 1.5), b: 18 * p * p }),
  zoomOut: p => ({ s: 1 - .75 * ei(p), o: 1 - p * p, b: 14 * p * p }),
  zoomAway: p => ({ s: 1 - .88 * ei(p), o: 1 - p * p, b: 10 * p * p }),
};

const scenes = [];
function addScene(def) {
  def.wrap = el('div', $('#scenes'), 'scene');
  def.cam = el('div', def.wrap, 'cam');
  def.build(def.cam, def);
  scenes.push(def);
}

/* =====================================================================
   AMBIENT DECOR — thin accent circles + huge soft rings at the edges
   ===================================================================== */
const amb = { circles: [], rings: [] };
function buildAmbient() {
  const A = $('#ambient');
  [[150, 250, 105, -1, -1], [955, 395, 58, 1, -1], [965, 1690, 150, 1, 1], [120, 1570, 46, -1, 1], [1010, 1080, 30, 1, 0]]
    .forEach(([x, y, r, dx, dy], i) => {
      const e = at(el('div', A, 'ctr', { width: px(r * 2), height: px(r * 2), borderRadius: '50%', border: `3px solid ${ACC}`, opacity: .55, boxSizing: 'border-box' }), x, y);
      amb.circles.push({ e, dx, dy, i });
    });
  [[-40, 980, 860], [1130, 470, 760], [700, 2010, 900]].forEach(([x, y, d], i) => {
    const e = at(el('div', A, 'ctr', { width: px(d), height: px(d), borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,130,28,0) 46%, rgba(255,130,28,.075) 60%, rgba(255,130,28,0) 74%)' }), x, y);
    amb.rings.push({ e, i });
  });
}
function ambient(t) {
  const inP = eo(P(t, 0, .9));
  amb.circles.forEach(({ e, dx, dy, i }) => {
    T(e, { x: 18 * Math.sin(t * .6 + i * 1.7) + dx * 520 * (1 - inP), y: 24 * Math.cos(t * .5 + i * 2.1) + dy * 520 * (1 - inP),
      s: 1 + .06 * Math.sin(t * .8 + i), o: .55 * inP });
  });
  amb.rings.forEach(({ e, i }) => T(e, { x: 40 * Math.sin(t * .25 + i * 2), y: 50 * Math.cos(t * .21 + i), s: 1 + .05 * Math.sin(t * .3 + i) }));
}

/* =====================================================================
   SCENE 1 — HOOK  0.0–1.5  "Your brand is always talking."
   ===================================================================== */
addScene({
  start: 0, end: 1.5, exit: 'whipLeft',
  build(c, S) {
    S.g = glow(c, 0, 0, 620, 360); S.g.style.opacity = 0;
    const l1 = textLine(c, 850, [{ t: 'Your', block: true, whole: true, style: { fontWeight: 700 } }, { t: ' brand is' }], { fontSize: '72px', fontWeight: 500 });
    const l2 = textLine(c, 935, [{ t: 'always ' }, { t: 'talking.', cls: 'serif', block: true, style: { fontSize: '138px' } }], { fontSize: '72px', fontWeight: 500 });
    S.your = l1.groups[0]; S.talk = l2.groups[1];
    S.chars = l1.chars.concat(l2.chars);
    S.talkChars = l2.chars.slice(7);
    S.parts = [];
    const glyphs = ['“', '✦', '→', '”', '✦', '“', '→', '✦', '”', '✦'];
    glyphs.forEach((g, i) => {
      const e = el('div', c, 'ctr ' + (g === '“' || g === '”' ? 'serif' : 'sans'), { color: ACC, fontSize: px(40 + hash(i) * 46), fontWeight: 600 });
      e.textContent = g; S.parts.push(e);
    });
  },
  measure(S) {
    const y = rel(S.your); S.yd = { x: 540 - y.cx, y: 960 - y.cy };
    S.tk = rel(S.talk);
    at(S.g, S.tk.cx, S.tk.cy);
    S.parts.forEach((e, i) => at(e, S.tk.cx + (hash(i + 3) - .5) * 560, S.tk.cy - 10 + (hash(i + 9) - .5) * 80));
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .035 * eo(P(lt, 0, 1.5)) });
    // slam: big word whips in from the right, then shrinks into the line
    const a = P(lt, 0, 4 * FR), b = P(lt, 5 * FR, 11 * FR), sc = lerp(5.2, 1, eo(b));
    T0(S.your, { x: S.yd.x * (1 - eo(b)) + 1500 * (1 - eo(a)), y: S.yd.y * (1 - eo(b)), s: sc });
    mb(S.your, (110 * (1 - a) ** 2 + 10 * (1 - b) * (b > 0 ? 1 : 0)) / sc, 0);
    typeIn(S.chars, lt, .36, .028);
    const k = eo(P(lt, 1.02, 1.2));
    S.talkChars.forEach(ch => ch.style.color = mix(RGB.text, RGB.accent, k));
    S.g.style.opacity = eo(P(lt, 1.02, 1.32));
    S.parts.forEach((e, i) => {
      const s0 = 1.0 + i * .045, p = P(lt, s0, s0 + .62);
      T(e, { y: -150 * eo(p) - 20, r: (hash(i) - .5) * 40, s: .6 + .4 * eo(P(lt, s0, s0 + .15)), o: p <= 0 ? 0 : Math.sin(Math.PI * p) });
    });
  },
});
/* plain transform for inline-block (no centring offset) */
function T0(e, o) { e.style.transform = `translate(${o.x || 0}px,${o.y || 0}px) scale(${o.s == null ? 1 : o.s})`; }

/* =====================================================================
   SCENE 2 — WHY pt.1  1.5–3.0  "But every second a client spends confused…"
   ===================================================================== */
addScene({
  start: 1.5, end: 3.0, enter: 'fromRight', exit: 'spinOut',
  build(c, S) {
    const cx = 760, cy = 1260, R = 640;
    S.cx = cx; S.cy = cy;
    S.dialWrap = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: `${cx}px ${cy}px` });
    const s = layer(S.dialWrap);
    sv('circle', s, { cx, cy, r: R, fill: '#fff', stroke: '#ECECEC', 'stroke-width': 4 });
    sv('circle', s, { cx, cy, r: R - 34, fill: 'none', stroke: '#F0F0F0', 'stroke-width': 2 });
    S.ticks = sv('g', s, {});
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * Math.PI * 2, maj = i % 5 === 0, r1 = R - 50, r2 = r1 - (maj ? 70 : 32);
      sv('line', S.ticks, { x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1, x2: cx + Math.cos(a) * r2, y2: cy + Math.sin(a) * r2,
        stroke: maj ? TXT : '#C9C9C9', 'stroke-width': maj ? 9 : 4, 'stroke-linecap': 'round' });
    }
    const ra = R - 165;
    S.arcG = sv('circle', s, { cx, cy, r: ra, fill: 'none', stroke: ACC, 'stroke-width': 46, opacity: .45, pathLength: 1,
      'stroke-linecap': 'round', transform: `rotate(-90 ${cx} ${cy})`, style: 'filter:blur(18px)' });
    S.arc = sv('circle', s, { cx, cy, r: ra, fill: 'none', stroke: ACC, 'stroke-width': 24, pathLength: 1,
      'stroke-linecap': 'round', transform: `rotate(-90 ${cx} ${cy})` });
    S.hand = sv('g', s, {});
    sv('line', S.hand, { x1: cx, y1: cy + 90, x2: cx, y2: cy - (R - 70), stroke: TXT, 'stroke-width': 14, 'stroke-linecap': 'round' });
    sv('circle', s, { cx, cy, r: 30, fill: TXT });
    sv('circle', s, { cx, cy, r: 11, fill: ACC });
    const l1 = textLine(c, 300, [{ t: 'Every second a client spends' }], { fontSize: '56px', fontWeight: 500, textAlign: 'left', left: '90px' });
    S.g = glow(c, 300, 470, 620, 300); S.g.style.opacity = 0;
    const l2 = textLine(c, 360, [{ t: 'confused…', cls: 'serif', style: { color: ACC } }], { fontSize: '180px', textAlign: 'left', left: '84px' });
    S.c1 = l1.chars; S.c2 = l2.chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * eio(P(lt, 0, 1.5)) });
    S.dialWrap.style.transform = `rotate(${8 * eio(P(lt, 0, 1.5))}deg)`;
    const ap = .42 * eo(P(lt, .12, 1.15));
    [S.arc, S.arcG].forEach(a => a.setAttribute('stroke-dasharray', `${ap} 1`));
    S.hand.setAttribute('transform', `rotate(${-130 + 220 * eio(P(lt, 0, 1.5))} ${S.cx} ${S.cy})`);
    typeIn(S.c1, lt, .12, .02);
    typeIn(S.c2, lt, .7, .04, { fade: 3 * FR });
    S.g.style.opacity = eo(P(lt, .75, 1.1));
  },
});

/* =====================================================================
   SCENE 3 — WHY pt.2  3.0–4.5  "…about what you do…"
   ===================================================================== */
function personSVG(fill) {
  return `<svg width="120" height="150" viewBox="0 0 100 125"><circle cx="50" cy="30" r="24" fill="${fill}"/>` +
    `<path d="M8 125 C8 84 28 66 50 66 C72 66 92 84 92 125 Z" fill="${fill}"/></svg>`;
}
function corners(g, x0, y0, x1, y1, L, attrs) {
  const d = `M${x0} ${y0 + L}V${y0}H${x0 + L} M${x1 - L} ${y0}H${x1}V${y0 + L} M${x1} ${y1 - L}V${y1}H${x1 - L} M${x0 + L} ${y1}H${x0}V${y1 - L}`;
  return sv('path', g, Object.assign({ d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
}
addScene({
  start: 3.0, end: 4.5, enter: 'drop', exit: 'zoomThrough',
  build(c, S) {
    const l1 = textLine(c, 530, [{ t: 'They can’t see' }], { fontSize: '66px', fontWeight: 500 });
    S.g = glow(c, 760, 700, 380, 260); S.g.style.opacity = 0;
    const l2 = textLine(c, 600, [{ t: 'what you ' }, { t: 'do.', cls: 'serif', style: { color: ACC, fontSize: '128px' } }], { fontSize: '66px', fontWeight: 500 });
    S.chars = l1.chars.concat(l2.chars);
    S.vfW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 1050px' });
    corners(layer(S.vfW), 140, 890, 940, 1215, 80, { stroke: ACC, 'stroke-width': 9 });
    S.ppl = [220, 380, 540, 700, 860].map((x, i) => at(el('div', c, 'ctr', {}, personSVG(i === 2 ? TXT : ACC)), x, 1050));
    S.focW = at(el('div', c, 'ctr', { width: '170px', height: '210px' }), 540, 1050);
    const fs = sv('svg', S.focW, { width: 170, height: 210, viewBox: '0 0 170 210', style: 'overflow:visible' });
    corners(fs, 4, 4, 166, 206, 30, { stroke: TXT, 'stroke-width': 5 });
    S.cap = textLine(c, 1265, [{ t: 'Your ideal client, lost in the crowd' }], { fontSize: '40px', color: MUT, fontWeight: 500 }).chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .08 * eio(P(lt, 0, 1.5)) });
    typeIn(S.chars, lt, .16, .026);
    S.g.style.opacity = eo(P(lt, .62, .9));
    const v = P(lt, .1, .45); TT(S.vfW, { s: 1.15 - .15 * eo(v), o: eo(v) });
    S.ppl.forEach((e, i) => { const p = P(lt, .14 + i * .07, .14 + i * .07 + 9 * FR); T(e, { s: pop(p), o: p > 0 ? 1 : 0 }); mb(e, 0, 10 * (1 - p) ** 2 * (p > 0)); });
    const f = P(lt, .62, .62 + 9 * FR);
    T(S.focW, { s: 1.35 - .35 * eo(f), o: f > 0 ? (lt > 1.0 && lt < 1.1 ? .3 : 1) : 0 });
    typeIn(S.cap, lt, .72, .016);
  },
});

/* =====================================================================
   SCENE 4 — PROBLEM  4.5–6.0  "…is a second you're losing them."
   ===================================================================== */
const CARDS = [
  `<div style="display:flex;gap:16px;align-items:center;margin-bottom:14px"><div style="width:56px;height:56px;border-radius:50%;background:#EDEDED"></div>
   <div><div class="lbl">Client review</div><div style="font-size:30px;letter-spacing:2px"><span style="color:${ACC}">★★</span><span style="color:#DADADA">★★★</span></div></div></div>
   <div style="color:#555">“Still not sure what they actually do.”</div>`,
  `<div class="lbl" style="margin-bottom:12px">New message · now</div>
   <div style="background:#F1F1F1;border-radius:22px 22px 22px 6px;padding:16px 20px;color:#222">Hey… so what exactly do you offer?</div>
   <div style="text-align:right;font-size:22px;color:${MUT};margin-top:10px">Seen</div>`,
  `<div style="display:flex;gap:16px;align-items:center"><svg width="56" height="56" viewBox="0 0 56 56"><rect x="6" y="12" width="44" height="32" rx="6" fill="none" stroke="${TXT}" stroke-width="3.5"/><path d="M8 15 L28 31 L48 15" fill="none" stroke="${TXT}" stroke-width="3.5" stroke-linejoin="round"/></svg>
   <div><div class="lbl">Inbox</div><div class="big">Unsubscribed</div></div></div>
   <div style="color:#555;margin-top:10px">A lead just left your list.</div>`,
  `<div class="lbl">Bounce rate</div>
   <div style="display:flex;align-items:flex-end;justify-content:space-between"><div style="font-size:64px;font-weight:700;line-height:1.1">78%<span style="color:${ACC};font-size:40px"> ↑</span></div>
   <svg width="150" height="70" viewBox="0 0 150 70"><polyline points="4,60 30,52 56,56 82,36 108,30 146,8" fill="none" stroke="${ACC}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`,
];
addScene({
  start: 4.5, end: 6.0, enter: 'zoomIn', exit: 'whipUp',
  build(c, S) {
    S.q = [[190, 930, -12, 560], [540, 1010, 0, 760], [890, 930, 11, 560]].map(([x, y, r, fs]) => {
      const e = at(el('div', c, 'ctr serif', { color: ACC, fontSize: px(fs), opacity: .1, lineHeight: 1 }), x, y); e.textContent = '?'; e._r = r; return e;
    });
    const l1 = textLine(c, 870, [{ t: 'Is a second you’re' }], { fontSize: '64px', fontWeight: 500 });
    S.g = glow(c, 430, 1020, 520, 260); S.g.style.opacity = 0;
    const l2 = textLine(c, 930, [{ t: 'losing', cls: 'serif', style: { color: ACC, fontSize: '136px' } }, { t: ' them.' }], { fontSize: '64px', fontWeight: 500 });
    S.chars = l1.chars.concat(l2.chars);
    S.cards = [[300, 470, -6], [790, 650, 5], [300, 1360, 4], [780, 1540, -5]].map(([x, y, r], i) => {
      const e = at(el('div', c, 'card', {}, CARDS[i]), x, y); e._r = r; return e;
    });
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * eio(P(lt, 0, 1.5)), y: -10 * eio(P(lt, 0, 1.5)) });
    S.q.forEach((e, i) => T(e, { r: e._r + 4 * Math.sin(lt * 2 + i), s: .9 + .1 * eo(P(lt, 0, .5)) + .03 * lt, o: .1 * eo(P(lt, .05 + i * .06, .4 + i * .06)) }));
    typeIn(S.chars, lt, .08, .018);
    S.g.style.opacity = eo(P(lt, .4, .7));
    S.cards.forEach((e, i) => {
      const a = .15 + i * .2, p = P(lt, a, a + 9 * FR);
      T(e, { r: e._r * (p < 1 ? 1.6 - .6 * eo(p) : 1), s: pop(p), o: p > 0 ? 1 : 0, y: -6 * Math.sin(lt * 2 + i) });
      mb(e, 12 * (1 - p) ** 2 * (p > 0), 12 * (1 - p) ** 2 * (p > 0));
    });
  },
});

/* =====================================================================
   SCENE 5 — COUNTER  6.0–7.0  "Sixteen other options…"
   ===================================================================== */
addScene({
  start: 6.0, end: 7.0, enter: 'fromBottom', exit: 'zoomThrough',
  build(c, S) {
    S.ringW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 900px' });
    S.g = glow(S.ringW, 540, 900, 760, 760); S.g.style.opacity = .7;
    const s = layer(S.ringW);
    sv('circle', s, { cx: 540, cy: 900, r: 240, fill: 'none', stroke: '#E6E6E6', 'stroke-width': 28 });
    const mk = (extra) => sv('circle', s, Object.assign({ cx: 540, cy: 900, r: 240, fill: 'none', stroke: ACC, pathLength: 1, 'stroke-linecap': 'round', transform: 'rotate(-90 540 900)' }, extra));
    S.arcG = mk({ 'stroke-width': 50, opacity: .4, style: 'filter:blur(16px)' });
    S.arc = mk({ 'stroke-width': 28 });
    S.num = at(el('div', S.ringW, 'ctr', { fontSize: '190px', fontWeight: 700, letterSpacing: '-6px', fontVariantNumeric: 'tabular-nums' }), 540, 905);
    S.lab = textLine(c, 1220, [{ t: 'competitors, one ' }, { t: 'scroll', cls: 'serif', style: { color: ACC, fontSize: '76px' } }, { t: ' away' }], { fontSize: '48px', fontWeight: 500 }).chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eio(P(lt, 0, 1)) });
    const m = eo(P(lt, 0, .62));
    TT(S.ringW, { x: -300 * (1 - m), y: 470 * (1 - m), s: .55 + .45 * m });
    mb(S.ringW, 14 * (1 - m) ** 2, 14 * (1 - m) ** 2);
    const c = P(lt, .1, .7), n = Math.round(5 + 11 * eo(c));
    S.num.textContent = n;
    const ap = .2 + .6 * eo(c);
    [S.arc, S.arcG].forEach(a => a.setAttribute('stroke-dasharray', `${ap} 1`));
    typeIn(S.lab, lt, .34, .016);
  },
});

/* =====================================================================
   SCENE 6 — PAIN ×3  7.0–11.0  "Losing trust. Losing leads. Losing deals."
   ===================================================================== */
const ICONS = {
  trust: `<path d="M60 12 L100 28 V60 C100 86 82 102 60 110 C38 102 20 86 20 60 V28 Z"/><path d="M62 30 L52 56 L68 66 L56 92"/>`,
  leads: `<path d="M32 18 V62 A28 28 0 0 0 88 62 V18"/><path d="M22 36 H42 M78 36 H98"/><path d="M16 100 l10 -8 M104 100 l-10 -8 M60 112 v-10"/>`,
  deals: `<path d="M30 12 H74 L92 30 V108 H30 Z"/><path d="M74 12 V30 H92"/><path d="M47 54 L77 86 M77 54 L47 86"/>`,
};
function hexSVG(icon) {
  const pts = []; for (let i = 0; i < 6; i++) { const a = (-90 + i * 60) * Math.PI / 180; pts.push((Math.cos(a) * 150).toFixed(1) + ',' + (Math.sin(a) * 150).toFixed(1)); }
  return `<svg width="340" height="340" viewBox="-170 -170 340 340" style="overflow:visible">` +
    `<polygon points="${pts.join(' ')}" fill="${ACC}" stroke="${ACC}" stroke-width="22" stroke-linejoin="round"/>` +
    `<g transform="translate(-66 -66) scale(1.1)" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">${icon}</g></svg>`;
}
addScene({
  start: 7.0, end: 11.0, enter: 'zoomIn', exit: 'spinOut',
  build(c, S) {
    S.gl = glow(c, 540, 980, 900, 800); S.gl.style.opacity = 0;
    const hx = [[396, 860, 'trust'], [684, 860, 'leads'], [540, 1109, 'deals']];
    S.hex = hx.map(([x, y, k]) => at(el('div', c, 'ctr', {}, hexSVG(ICONS[k])), x, y));
    const s = layer(c);
    S.lines = [
      'M274 790 L190 640 L70 640', 'M806 790 L890 640 L1010 640', 'M540 1282 L540 1420',
    ].map(d => sv('path', s, { d, fill: 'none', stroke: TXT, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '0 1' }));
    const mkLabel = (word, style) => {
      const l = textLine(c, 0, [{ t: 'Losing ' }, { t: word, cls: 'serif', style: { color: ACC, fontSize: '84px' } }], Object.assign({ fontSize: '54px', fontWeight: 500, width: 'auto' }, style));
      return l.chars;
    };
    S.labels = [
      mkLabel('trust', { left: '70px', top: '540px' }),
      mkLabel('leads', { left: 'auto', right: '70px', top: '540px' }),
      mkLabel('deals', { left: '0', width: '1080px', top: '1430px' }),
    ];
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1.2 - .2 * eio(P(lt, 0, 4)), y: 30 * (1 - eio(P(lt, 0, 4))) });
    S.gl.style.opacity = .55 * eo(P(lt, .2, 2.8));
    [.15, 1.35, 2.55].forEach((a, i) => {
      const p = P(lt, a, a + 9 * FR);
      T(S.hex[i], { s: pop(p), o: p > 0 ? 1 : 0, r: 0 });
      mb(S.hex[i], 14 * (1 - p) ** 2 * (p > 0), 14 * (1 - p) ** 2 * (p > 0));
      S.lines[i].setAttribute('stroke-dasharray', `${eo(P(lt, a + .2, a + .55))} 1`);
      typeIn(S.labels[i], lt, a + .45, .03);
    });
  },
});

/* =====================================================================
   SCENE 7 — ONE-WORD BEATS  11.0–13.0  "Louder. Busier. Forgotten."
   ===================================================================== */
addScene({
  start: 11.0, end: 13.0, enter: 'spinIn', exit: 'zoomOut',
  build(c, S) {
    S.words = ['Louder.', 'Busier.', 'Forgotten.'].map(w => {
      const g = glow(c, 540, 960, 900, 420);
      const e = at(el('div', c, 'ctr', { color: ACC, fontSize: '170px', fontWeight: 800, letterSpacing: '-5px', whiteSpace: 'nowrap' }), 540, 960);
      e.textContent = w; return { e, g };
    });
  },
  update(lt) {
    const S = this, A = [0, .65, 1.3, 9];
    TT(S.cam, { s: 1 + .04 * lt });
    S.words.forEach(({ e, g }, i) => {
      const a = A[i], q = P(lt, a, a + 6 * FR), x = P(lt, A[i + 1] - 4 * FR, A[i + 1]);
      const vis = q > 0 && x < 1;
      const s = (1.4 - .4 * eo(q)) * (1 - .35 * eo(x)) * (1 + .05 * P(lt, a, a + .7));
      T(e, { s, o: vis ? Math.min(1, q * 2) * (1 - x) : 0 });
      mb(e, 16 * (1 - q) ** 2 + 8 * x * x, 16 * (1 - q) ** 2 + 8 * x * x);
      g.style.opacity = vis ? .9 * eo(P(lt, a + 2 * FR, a + 10 * FR)) * (1 - x) : 0;
    });
  },
});

/* =====================================================================
   SCENE 8 — CONTRAST  13.0–14.0  "The best brands don't say more."
   ===================================================================== */
addScene({
  start: 13.0, end: 14.0, enter: 'bigIn', exit: 'zoomAway',
  build(c, S) {
    const l1 = textLine(c, 810, [{ t: 'The best brands' }], { fontSize: '150px' });
    const l2 = textLine(c, 965, [{ t: 'don’t say more.' }], { fontSize: '150px' });
    l1.line.classList.add('serif'); l2.line.classList.add('serif');
    [l1, l2].forEach(l => l.groups.forEach(g => g.className = 'serif'));
    S.chars = l1.chars.concat(l2.chars);
    S.chars.forEach(ch => ch.style.display = 'inline-block');
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * lt });
    S.chars.forEach((ch, i) => {
      const a = .03 + i * .018, p = P(lt, a, a + 5 * FR);
      ch.style.opacity = eo(p);
      const b = 14 * (1 - eo(p));
      ch.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    });
  },
});

/* =====================================================================
   SCENE 9 — BENEFITS  14.0–21.0  pills
   ===================================================================== */
addScene({
  start: 14.0, end: 21.0, enter: 'fadeScale', exit: 'whipLeft',
  build(c, S) {
    S.rings = [[150, 330, 980], [960, 1640, 1100], [1000, 520, 520]].map(([x, y, d], i) => at(el('div', c, 'ctr', {
      width: px(d), height: px(d), borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,130,28,0) 44%, rgba(255,130,28,.12) 58%, rgba(255,130,28,0) 72%)' }), x, y));
    S.head = textLine(c, 470, [{ t: 'The best brands are' }], { fontSize: '44px', color: MUT, fontWeight: 500 }).chars;
    const P_ = [
      ['Focused', 'f', 365, 660, -3, 14.3], ['Sharper', 'o', 735, 672, 3, 15.2], ['Strategic', 'f', 560, 822, -2, 16.1],
      ['Simple message', 'o', 520, 984, 2, 17.1], ['Instant trust', 'f', 590, 1146, -3, 18.3], ['Easy to choose', 'o', 500, 1308, 2, 19.5],
    ];
    S.pills = P_.map(([t, k, x, y, r, at_], i) => {
      const e = at(el('div', c, 'pill ' + k), x, y); e.textContent = t;
      return { e, r, a: at_ - 14, side: i % 2 ? 1 : -1 };
    });
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .06 * eio(P(lt, 0, 7)) });
    S.rings.forEach((e, i) => {
      const q = eo(P(lt, -.05, .7));
      T(e, { s: (2.3 - 1.3 * q) * (1 + .04 * Math.sin(lt * .6 + i)), r: 40 * (1 - q), x: 30 * Math.sin(lt * .4 + i * 2), y: 30 * Math.cos(lt * .35 + i), o: .45 + .55 * q });
      mb(e, 30 * (1 - q), 30 * (1 - q));
    });
    typeIn(S.head, lt, .1, .02);
    S.pills.forEach(({ e, r, a, side }) => {
      const q = P(lt, a, a + 8 * FR);
      T(e, { x: side * 1000 * (1 - eo(q)), r: r * eo(q), o: q > 0 ? 1 : 0, y: -4 * Math.sin(lt * 1.3 + a) });
      mb(e, 70 * (1 - q) ** 2 * (q > 0), 0);
    });
  },
});

/* =====================================================================
   SCENE 10 — PUNCHLINE  21.0–24.5  "Design isn't decoration — it's strategy."
   ===================================================================== */
function ovalPath(cx, cy, rx, ry, tilt) {
  const pts = [], N = 90, a0 = -200, a1 = 192;
  for (let i = 0; i <= N; i++) {
    const p = i / N, a = (a0 + (a1 - a0) * p) * Math.PI / 180, k = 1.05 - .1 * p + .015 * Math.sin(p * 9);
    let x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
    const t = tilt * Math.PI / 180;
    pts.push([cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)]);
  }
  return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
}
addScene({
  start: 21.0, end: 24.5, enter: 'fromRight', exit: 'zoomThrough',
  build(c, S) {
    S.setW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' });
    S.set = textLine(S.setW, 925, [{ t: 'Design isn’t decoration —' }], { fontSize: '62px', fontWeight: 500 }).chars;
    S.punW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 1000px' });
    S.g = glow(S.punW, 540, 1010, 1000, 520); S.g.style.opacity = 0;
    textLine(S.punW, 830, [{ t: 'it’s', whole: true }], { fontSize: '64px', fontWeight: 500 });
    textLine(S.punW, 905, [{ t: 'strategy.', whole: true }], { fontSize: '156px', fontWeight: 800, letterSpacing: '-5px' });
    const s = layer(S.punW);
    S.oval = sv('path', s, { d: ovalPath(540, 1000, 490, 175, -4), fill: 'none', stroke: ACC, 'stroke-width': 9, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0 1' });
  },
  update(lt) {
    const S = this;
    const pan = eo(P(lt, 1.45, 1.95));
    TT(S.cam, { s: 1 + .03 * eio(P(lt, 0, 1.4)) + .06 * eio(P(lt, 1.6, 3.5)) });
    typeIn(S.set, lt, .1, .045, { gray: true, fade: 3 * FR });
    TT(S.setW, { x: -620 * pan, o: 1 - .7 * pan });
    mb(S.setW, 40 * Math.sin(Math.PI * pan) * (pan < 1), 0);
    if (pan > .01) S.set.forEach(ch => ch.style.color = mix(RGB.text, RGB.muted, pan));
    const q = P(lt, 1.52, 1.52 + 9 * FR);
    TT(S.punW, { x: 760 * (1 - eo(q)), o: q > 0 ? 1 : 0, s: 1 + .25 * (1 - eo(q)) });
    mb(S.punW, 80 * (1 - q) ** 2 * (q > 0), 0);
    S.g.style.opacity = eo(P(lt, 1.85, 2.4));
    S.oval.setAttribute('stroke-dasharray', `${eo(P(lt, 2.0, 2.55))} 1`);
  },
});

/* =====================================================================
   SCENE 11 — OUTRO  24.5–27.0  logo · CTA · handle scramble
   ===================================================================== */
const LOGO = `<svg width="900" height="560" viewBox="0 0 900 560" style="overflow:visible">
<defs>
 <mask id="cres" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
  <rect x="-100" y="-100" width="1100" height="760" fill="#000"/>
  <ellipse cx="450" cy="280" rx="405" ry="190" fill="#fff" transform="rotate(-14 450 280)"/>
  <ellipse cx="478" cy="258" rx="378" ry="158" fill="#000" transform="rotate(-14 450 280)"/>
 </mask>
 <mask id="reveal" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
  <path id="revealPath" d="M760.2 157.9 A405 190 0 1 1 755.7 155.3" fill="none" stroke="#fff" stroke-width="150" pathLength="1" stroke-dasharray="0 1" transform="rotate(-14 450 280)"/>
 </mask>
</defs>
<g mask="url(#reveal)"><rect x="-100" y="-100" width="1100" height="760" fill="${ACC}" mask="url(#cres)"/></g>
<text x="450" y="378" text-anchor="middle" font-family="Inter" font-weight="800" font-size="290" letter-spacing="-10"
 fill="${TXT}" stroke="${BG}" stroke-width="26" paint-order="stroke" stroke-linejoin="round">ISP</text>
</svg>`;
addScene({
  start: 24.5, end: 27.0, enter: 'fadeScale',
  build(c, S) {
    S.cta = textLine(c, 520, [{ t: 'Let’s build ' }, { t: 'yours.', cls: 'serif', style: { color: ACC, fontSize: '104px' } }], { fontSize: '64px', fontWeight: 500 }).chars;
    S.g = glow(c, 540, 1000, 1000, 640); S.g.style.opacity = 0;
    S.logo = at(el('div', c, 'ctr', {}, LOGO), 540, 990);
    S.handle = at(el('div', c, 'ctr', { fontSize: '50px', fontWeight: 600, letterSpacing: '1px', whiteSpace: 'pre', fontVariantNumeric: 'tabular-nums' }), 540, 1335);
    S.bio = at(el('div', c, 'ctr', { fontSize: '36px', fontWeight: 500, color: MUT }), 540, 1415); S.bio.textContent = 'Link in bio';
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eio(P(lt, 0, 2.5)) });
    const p = P(lt, .08, .08 + 10 * FR);
    T(S.logo, { s: pop(p) * .9, o: p > 0 ? 1 : 0 });
    mb(S.logo, 16 * (1 - p) ** 2 * (p > 0), 16 * (1 - p) ** 2 * (p > 0));
    if (!S.rp) S.rp = document.getElementById('revealPath');
    S.rp.setAttribute('stroke-dasharray', `${eo(P(lt, .18, .8))} 1`);
    S.g.style.opacity = .8 * eo(P(lt, .3, .9));
    typeIn(S.cta, lt, .45, .035);
    // scramble @handle into place
    const target = '@isp_agency_', pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@_';
    const sp = P(lt, .7, 1.35), f = Math.floor(lt * FPS);
    let out = '';
    for (let i = 0; i < target.length; i++) {
      const lock = (i + 1) / target.length <= sp;
      out += lock ? target[i] : pool[Math.floor(hash(f * 31 + i * 7) * pool.length)];
    }
    S.handle.textContent = out;
    S.handle.style.opacity = eo(P(lt, .66, .8));
    S.handle.style.color = sp >= 1 ? TXT : mix(RGB.muted, RGB.text, sp);
    S.bio.style.opacity = eo(P(lt, 1.3, 1.6));
  },
});

/* =====================================================================
   RENDER LOOP
   ===================================================================== */
function renderAt(t) {
  ambient(t);
  for (const s of scenes) {
    const vis = t >= s.start - FR - 1e-6 && t < s.end + FR;
    s.wrap.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) continue;
    let o = { x: 0, y: 0, s: 1, r: 0, o: 1, bx: 0, by: 0, b: 0 };
    if (s.enter) { const q = P(t, s.start - FR, s.start + 6 * FR); if (q < 1) Object.assign(o, ENTER[s.enter](q)); }
    if (s.exit) { const p = P(t, s.end - 5 * FR, s.end + FR); if (p > 0) Object.assign(o, EXIT[s.exit](p)); }
    TT(s.wrap, o);
    mb(s.wrap, o.bx + o.b, o.by + o.b);
    s.update(t - s.start, t);
  }
  $('#fade').style.opacity = eio(P(t, 26.55, 26.97));
}
window.renderAt = renderAt;
window.SFX_BOUNDARIES = scenes.filter(s => s.exit).map(s => s.end);

(async function init() {
  buildAmbient();
  await document.fonts.ready;
  await Promise.all([...document.fonts].map(f => f.load().catch(() => {})));
  scenes.forEach(s => s.measure && s.measure(s));
  const render = /render/.test(location.search);
  if (render) {
    document.body.classList.add('render');
    renderAt(0);
    window.READY = true;
    return;
  }
  // ---- interactive preview ----
  const vp = $('#viewport'), aud = $('#aud'), scrub = $('#scrub'), tc = $('#tc'), btn = $('#play');
  const fit = () => { const k = Math.min((innerHeight - 44) / H, innerWidth / W); vp.style.transform = `translateX(${-W * k / 2}px) scale(${k})`; };
  fit(); addEventListener('resize', fit);
  let playing = true, t0 = performance.now(), cur = 0;
  const startAudio = () => { try { aud.currentTime = cur; aud.play().catch(() => {}); } catch (e) {} };
  btn.onclick = () => { playing = !playing; btn.textContent = playing ? 'Pause' : 'Play'; if (playing) { t0 = performance.now() - cur * 1000; startAudio(); } else aud.pause(); };
  scrub.oninput = () => { cur = scrub.value / FPS; t0 = performance.now() - cur * 1000; if (playing) startAudio(); };
  document.addEventListener('click', e => { if (e.target === document.body || e.target.closest('#viewport')) startAudio(); }, { once: true });
  (function loop() {
    if (playing) { cur = ((performance.now() - t0) / 1000); if (cur >= DUR) { cur = 0; t0 = performance.now(); startAudio(); } }
    renderAt(cur); scrub.value = Math.floor(cur * FPS); tc.textContent = cur.toFixed(2) + 's';
    requestAnimationFrame(loop);
  })();
})();
