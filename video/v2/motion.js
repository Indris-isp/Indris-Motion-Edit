/* ISP Agency — kinetic typography promo, v2 (reference-aligned)
 * 1080x1920 · 30 fps · 27 s (810 frames)
 * Every frame is a pure function of time: window.renderAt(seconds).
 */
'use strict';

const FPS = 30, DUR = 27, FR = 1 / FPS, W = 1080, H = 1920;
const NS = 'http://www.w3.org/2000/svg';
const RGB = { accent: [255, 130, 28], text: [10, 10, 10], muted: [160, 160, 160], bg: [255, 255, 255] };
const ACC = '#FF821C', TXT = '#0A0A0A', MUT = '#A0A0A0', BG = '#FFFFFF';

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
      const e = at(el('div', A, 'ctr', { width: px(r * 2), height: px(r * 2), borderRadius: '50%', border: `3px solid ${ACC}`, opacity: .4, boxSizing: 'border-box' }), x, y);
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
      s: 1 + .06 * Math.sin(t * .8 + i), o: inP * (.12 + .28 * (1 - P(t, 1.2, 1.8)) + .2 * P(t, 24.2, 24.8)) });
  });
  amb.rings.forEach(({ e, i }) => T(e, { o: .45, x: 40 * Math.sin(t * .25 + i * 2), y: 50 * Math.cos(t * .21 + i), s: 1 + .05 * Math.sin(t * .3 + i) }));
}
/* =====================================================================
   v2 — scene layouts and rhythm modelled on the reference edit
   ===================================================================== */
function personSVG(fill) {
  return `<svg width="120" height="150" viewBox="0 0 100 125"><circle cx="50" cy="30" r="24" fill="${fill}"/>` +
    `<path d="M8 125 C8 84 28 66 50 66 C72 66 92 84 92 125 Z" fill="${fill}"/></svg>`;
}
function corners(g, x0, y0, x1, y1, L, attrs) {
  const d = `M${x0} ${y0 + L}V${y0}H${x0 + L} M${x1 - L} ${y0}H${x1}V${y0 + L} M${x1} ${y1 - L}V${y1}H${x1 - L} M${x0 + L} ${y1}H${x0}V${y1 - L}`;
  return sv('path', g, Object.assign({ d, fill: 'none' }, attrs));
}
function ovalPath(cx, cy, rx, ry, tilt) {
  const pts = [], N = 90, a0 = -200, a1 = 192;
  for (let i = 0; i <= N; i++) {
    const p = i / N, a = (a0 + (a1 - a0) * p) * Math.PI / 180, k = 1.05 - .1 * p + .015 * Math.sin(p * 9);
    const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k, t = tilt * Math.PI / 180;
    pts.push([cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)]);
  }
  return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
}
/* text line placed in a box instead of full width */
const box = (left, width, extra = {}) => Object.assign({ left: px(left), width: px(width) }, extra);

/* ---------------- 1 · HOOK  0.0–1.4  "Attention is expensive." ---------------- */
addScene({
  start: 0, end: 1.4, exit: 'whipLeft',
  build(c, S) {
    S.g = glow(c, 0, 0, 760, 520); S.g.style.opacity = 0;
    const l = textLine(c, 925, [{ t: 'Attention', block: true, whole: true }, { t: ' is ' }, { t: 'expensive.' }], { fontSize: '68px', fontWeight: 600, letterSpacing: '-1.5px' });
    S.att = l.groups[0]; S.chars = l.chars; S.exp = l.chars.slice(4); S.expG = l.groups[2];
    S.parts = Array.from({ length: 9 }, (_, i) => {
      const e = el('div', c, 'ctr sans', { color: ACC, fontSize: px(30 + hash(i) * 30), fontWeight: 600 });
      e.textContent = i % 3 === 2 ? '✦' : '$'; return e;
    });
  },
  measure(S) {
    const a = rel(S.att); S.d = { x: 540 - a.cx, y: 960 - a.cy };
    const x = rel(S.expG); at(S.g, x.cx, x.cy);
    S.parts.forEach((e, i) => at(e, x.cx + (hash(i + 3) - .5) * 380, x.cy + 10 + (hash(i + 9) - .5) * 60));
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eo(P(lt, 0, 1.4)) });
    const a = P(lt, 0, 4 * FR), b = P(lt, 6 * FR, 12 * FR), sc = lerp(2.6, 1, eo(b));
    T0(S.att, { x: S.d.x * (1 - eo(b)) + 1400 * (1 - eo(a)), y: S.d.y * (1 - eo(b)), s: sc });
    mb(S.att, (120 * (1 - a) ** 2 + 12 * (1 - b) * (b > 0)) / sc, 0);
    typeIn(S.chars, lt, .42, .03);
    const k = eo(P(lt, .7, .9));
    S.exp.forEach(ch => ch.style.color = mix(RGB.text, RGB.accent, k));
    S.g.style.opacity = .9 * eo(P(lt, .72, 1.1));
    S.parts.forEach((e, i) => {
      const s0 = .78 + i * .04, p = P(lt, s0, s0 + .55);
      T(e, { y: -120 * eo(p), s: .6 + .4 * eo(P(lt, s0, s0 + .15)), o: p <= 0 ? 0 : Math.sin(Math.PI * p) });
    });
  },
});
function T0(e, o) { e.style.transform = `translate(${o.x || 0}px,${o.y || 0}px) scale(${o.s == null ? 1 : o.s})`; }

/* ---------------- 2 · DIAL  1.4–2.8  "Because every second…" ---------------- */
addScene({
  start: 1.4, end: 2.8, enter: 'fromRight', exit: 'spinOut',
  build(c, S) {
    const cx = 160, cy = 1480, R = 1180; S.cx = cx; S.cy = cy;
    S.dial = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: `${cx}px ${cy}px` });
    const s = layer(S.dial);
    sv('circle', s, { cx, cy, r: R, fill: '#fff', stroke: '#F0F0F0', 'stroke-width': 3 });
    for (let i = 0; i < 120; i++) {
      const a = -Math.PI / 2 + (i / 120) * Math.PI * 2, maj = i % 10 === 0, r1 = R - 70, r2 = r1 - (maj ? 70 : 34);
      sv('line', s, { x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1, x2: cx + Math.cos(a) * r2, y2: cy + Math.sin(a) * r2,
        stroke: maj ? '#2A2A2A' : '#D4D4D4', 'stroke-width': maj ? 5 : 2.5 });
    }
    const arcR = R - 8, a0 = -100;
    S.arc = sv('circle', s, { cx, cy, r: arcR, fill: 'none', stroke: ACC, 'stroke-width': 9, pathLength: 1, transform: `rotate(${a0} ${cx} ${cy})`, 'stroke-dasharray': '0 1' });
    S.marks = [-84, -66, -48].map(d => {
      const a = d * Math.PI / 180;
      return sv('circle', s, { cx: cx + Math.cos(a) * arcR, cy: cy + Math.sin(a) * arcR, r: 13, fill: '#fff', stroke: TXT, 'stroke-width': 4, opacity: 0, _d: d });
    });
    S.hand = sv('g', s, {});
    sv('path', S.hand, { d: `M${cx - 13} ${cy + 60} L${cx - 5} ${cy - 1060} L${cx} ${cy - 1120} L${cx + 5} ${cy - 1060} L${cx + 13} ${cy + 60} Z`, fill: TXT, style: 'filter:drop-shadow(14px 18px 14px rgba(0,0,0,.18))' });
    sv('path', S.hand, { d: `M${cx} ${cy - 560} L${cx - 38} ${cy - 680} L${cx} ${cy - 800} L${cx + 38} ${cy - 680} Z`, fill: '#fff', stroke: TXT, 'stroke-width': 14, 'stroke-linejoin': 'round' });
    sv('circle', s, { cx, cy, r: 44, fill: TXT });
    sv('circle', s, { cx, cy, r: 20, fill: ACC });
    const l1 = textLine(c, 1380, [{ t: 'Because' }], box(440, 560, { fontSize: '60px', fontWeight: 600, letterSpacing: '-1px' }));
    S.g = glow(c, 720, 1500, 560, 220); S.g.style.opacity = 0;
    const l2 = textLine(c, 1430, [{ t: 'every second', cls: 'serif', style: { color: ACC } }], box(440, 560, { fontSize: '108px' }));
    const l3 = textLine(c, 1560, [{ t: 'Because every second your audience\nspends trying to understand your\nstory…' }], box(440, 560, { fontSize: '26px', fontWeight: 500, color: '#444', lineHeight: 1.25 }));
    S.c1 = l1.chars; S.c2 = l2.chars; S.c3 = l3.chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * eio(P(lt, 0, 1.4)) });
    S.dial.style.transform = `rotate(${6 * eio(P(lt, 0, 1.4))}deg)`;
    const ap = .17 * eo(P(lt, .1, 1.1));
    S.arc.setAttribute('stroke-dasharray', `${ap} 1`);
    S.marks.forEach(m => m.setAttribute('opacity', (+m.getAttribute('_d') + 100) / 360 < ap ? 1 : 0));
    S.hand.setAttribute('transform', `rotate(${20 + 22 * eio(P(lt, 0, 1.4))} ${S.cx} ${S.cy})`);
    typeIn(S.c1, lt, .12, .03);
    typeIn(S.c2, lt, .4, .035, { fade: 3 * FR });
    S.g.style.opacity = .8 * eo(P(lt, .5, .9));
    typeIn(S.c3, lt, .55, .006);
  },
});

/* ---------------- 3 · AUDIENCE  2.8–4.3  "Your audience spends…" ---------------- */
addScene({
  start: 2.8, end: 4.3, enter: 'drop', exit: 'whipLeft',
  build(c, S) {
    S.vf = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 950px' });
    corners(layer(S.vf), 110, 330, 970, 1570, 180, { stroke: ACC, 'stroke-width': 6 });
    S.t1 = textLine(c, 540, [{ t: 'Your audience' }], { fontSize: '86px', fontWeight: 600, letterSpacing: '-2.5px' }).chars;
    S.g = glow(c, 540, 680, 440, 200); S.g.style.opacity = 0;
    S.t2 = textLine(c, 622, [{ t: 'spends', cls: 'serif', style: { color: ACC } }], { fontSize: '96px', lineHeight: 1 }).chars;
    S.ppl = [[220, .62], [370, .86], [540, 1.12], [710, .86], [860, .62]].map(([x, k], i) => {
      const e = at(el('div', c, 'ctr', {}, personSVG(i === 2 ? TXT : ACC)), x, 980 + (1 - k) * 60); e._k = k; return e;
    });
    S.foc = at(el('div', c, 'ctr', { width: '190px', height: '220px' }), 540, 985);
    corners(sv('svg', S.foc, { width: 190, height: 220, viewBox: '0 0 190 220', style: 'overflow:visible' }), 3, 3, 187, 217, 34, { stroke: ACC, 'stroke-width': 6 });
    S.cap = textLine(c, 1235, [{ t: 'Your audience spends seconds\ndeciding if your brand is worth their time.' }], { fontSize: '30px', fontWeight: 500, color: '#444', lineHeight: 1.25 }).chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .08 * eio(P(lt, 0, 1.5)) });
    const v = P(lt, .05, .4); TT(S.vf, { s: 1.12 - .12 * eo(v), o: eo(v) });
    typeIn(S.t1, lt, .12, .025);
    typeIn(S.t2, lt, .5, .04, { fade: 3 * FR });
    S.g.style.opacity = .8 * eo(P(lt, .55, .85));
    S.ppl.forEach((e, i) => {
      const a = .2 + Math.abs(i - 2) * .08, p = P(lt, a, a + 9 * FR);
      T(e, { s: e._k * pop(p), o: p > 0 ? 1 : 0 }); mb(e, 0, 12 * (1 - p) ** 2 * (p > 0));
    });
    const f = P(lt, .55, .55 + 9 * FR);
    T(S.foc, { s: 1.4 - .4 * eo(f), o: f > 0 ? 1 : 0 });
    typeIn(S.cap, lt, .7, .009);
  },
});

/* ---------------- 4 · TRYING TO UNDERSTAND  4.3–5.9 ---------------- */
const REVIEWS = [
  ['Sarah K.', 'Marketing Director', '“We loved the design, but we’re still not sure what the product actually does.”'],
  ['James T.', 'SaaS Founder', '“I read the whole page twice and still couldn’t tell what they offer.”'],
  ['Priya S.', 'Head of Growth', '“Looks great, but the message is a bit unclear.”'],
];
const reviewCard = ([n, r, q]) => `<div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">
  <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#E9E9E9,#CFCFCF)"></div>
  <div><div style="font-size:20px;font-weight:700">${n}</div><div style="font-size:15px;color:${MUT}">${r}</div></div></div>
  <div style="font-size:17px;line-height:1.35;color:#333">${q}</div>
  <div style="margin-top:10px;font-size:20px;color:${ACC};letter-spacing:2px">★★★★★ <span style="font-size:15px;color:#333;letter-spacing:0">5.00</span></div>`;
addScene({
  start: 4.3, end: 5.9, enter: 'fromRight', exit: 'whipUp',
  build(c, S) {
    S.q = [380, 540, 700].map((x, i) => {
      const e = at(el('div', c, 'ctr sans', { fontSize: '260px', fontWeight: 700, color: 'transparent', WebkitTextStroke: `5px ${ACC}`, opacity: .3, lineHeight: 1 }), x, 900);
      e.textContent = '?'; return e;
    });
    S.t = textLine(c, 918, [{ t: 'Trying to understand' }], { fontSize: '76px', fontWeight: 600, letterSpacing: '-2px' }).chars;
    S.cards = [[290, 560, -3], [850, 700, 4], [330, 1360, 2]].map(([x, y, r], i) => {
      const e = at(el('div', c, 'card', { width: '330px', padding: '22px 24px', borderRadius: '24px' }, reviewCard(REVIEWS[i])), x, y); e._r = r; return e;
    });
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * eio(P(lt, 0, 1.6)) });
    typeIn(S.t, lt, .05, .025);
    S.q.forEach((e, i) => T(e, { y: 8 * Math.sin(lt * 2.4 + i), s: .9 + .1 * eo(P(lt, .3 + i * .08, .7 + i * .08)), o: .3 * eo(P(lt, .3 + i * .08, .6 + i * .08)) }));
    S.cards.forEach((e, i) => {
      const a = .3 + i * .28, p = P(lt, a, a + 9 * FR);
      T(e, { r: e._r * (p < 1 ? 1.8 - .8 * eo(p) : 1), s: pop(p), o: p > 0 ? 1 : 0, y: -6 * Math.sin(lt * 2 + i) });
      mb(e, 12 * (1 - p) ** 2 * (p > 0), 12 * (1 - p) ** 2 * (p > 0));
    });
  },
});

/* ---------------- 5 · COUNTER  5.9–6.9  "Is a second" ---------------- */
addScene({
  start: 5.9, end: 6.9, enter: 'fromBottom', exit: 'zoomThrough',
  build(c, S) {
    S.w = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 900px' });
    S.g = glow(S.w, 540, 900, 780, 780); S.g.style.opacity = .55;
    const s = layer(S.w);
    sv('circle', s, { cx: 540, cy: 900, r: 230, fill: 'none', stroke: '#D6D6D6', 'stroke-width': 34 });
    const mk = x => sv('circle', s, Object.assign({ cx: 540, cy: 900, r: 230, fill: 'none', stroke: ACC, pathLength: 1, transform: 'rotate(-90 540 900)' }, x));
    S.arcG = mk({ 'stroke-width': 60, opacity: .35, style: 'filter:blur(18px)' });
    S.arc = mk({ 'stroke-width': 34 });
    S.num = at(el('div', S.w, 'ctr', { fontSize: '180px', fontWeight: 500, letterSpacing: '-4px', fontVariantNumeric: 'tabular-nums' }), 540, 905);
    S.lab = textLine(S.w, 1175, [{ t: 'Is a second' }], { fontSize: '76px', fontWeight: 500, letterSpacing: '-1px' }).chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eio(P(lt, 0, 1)) });
    const m = eo(P(lt, 0, .6));
    TT(S.w, { x: -260 * (1 - m), y: 420 * (1 - m), s: .6 + .4 * m });
    mb(S.w, 14 * (1 - m) ** 2, 14 * (1 - m) ** 2);
    const k = eio(P(lt, .05, .75));
    S.num.textContent = Math.round(6 + 8 * k);
    const ap = .25 + .55 * k;
    [S.arc, S.arcG].forEach(a => a.setAttribute('stroke-dasharray', `${ap} 1`));
    typeIn(S.lab, lt, .3, .03);
  },
});

/* ---------------- 6 · PAIN ×3  6.9–10.8  hexagons + callouts ---------------- */
const HEX_ICONS = {
  prospects: `<circle cx="60" cy="60" r="46"/><path d="M60 6v14M60 100v14M6 60h14M100 60h14"/>
    <circle cx="44" cy="50" r="8"/><circle cx="76" cy="50" r="8"/><circle cx="60" cy="44" r="9"/>
    <path d="M30 80c0-12 6-18 14-18s14 6 14 18M62 80c0-12 6-18 14-18s14 6 14 18M44 76c0-14 7-20 16-20s16 6 16 20"/>
    <circle cx="60" cy="92" r="10" fill="${ACC}"/><path d="M55 92l4 4 7-8"/>`,
  momentum: `<circle cx="60" cy="60" r="50"/><circle cx="60" cy="60" r="38"/>
    <path d="M60 20c12 10 16 26 12 46H48c-4-20 0-36 12-46z"/><circle cx="60" cy="44" r="6"/>
    <path d="M48 58l-10 12v8l12-6M72 58l10 12v8l-12-6M54 72v14M60 72v18M66 72v14"/>`,
  deals: `<path d="M24 46c-8 12-10 26-4 36 6 8 22 10 38 8"/><path d="M30 46h28M36 34l-4-12 10 6 6-8 6 8 10-6-6 12"/>
    <circle cx="74" cy="32" r="12"/><path d="M74 25v14M70 29h6a3 3 0 010 6h-4"/>
    <path d="M60 100V70h12v30M80 100V56h12v44M100 100V44"/><path d="M54 100h56"/>`,
};
function hexEl(icon) {
  const poly = r => { const p = []; for (let i = 0; i < 6; i++) { const a = (-90 + i * 60) * Math.PI / 180; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); } return p.join(' '); };
  return `<svg width="380" height="380" viewBox="-190 -190 380 380" style="overflow:visible">
    <polygon points="${poly(168)}" transform="translate(0 9)" fill="${TXT}" stroke="${TXT}" stroke-width="10" stroke-linejoin="round"/>
    <polygon points="${poly(165)}" fill="${ACC}" stroke="${ACC}" stroke-width="10" stroke-linejoin="round"/>
    <g transform="translate(-78 -78) scale(1.3)" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${icon}</g></svg>`;
}
addScene({
  start: 6.9, end: 10.8, enter: 'zoomIn', exit: 'zoomOut',
  build(c, S) {
    const H = [[340, 830, 'prospects'], [700, 830, 'momentum'], [520, 1150, 'deals']];
    S.hex = H.map(([x, y, k]) => at(el('div', c, 'ctr', {}, hexEl(HEX_ICONS[k])), x, y));
    const s = layer(c);
    S.lines = ['M340 665 V560 L235 470', 'M700 665 V560 L805 470', 'M520 1315 V1410 L620 1500']
      .map(d => sv('path', s, { d, fill: 'none', stroke: TXT, 'stroke-width': 3.5, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '0 1' }));
    const lab = (t, x, y) => textLine(c, y, [{ t }], box(x - 260, 520, { fontSize: '40px', fontWeight: 500, letterSpacing: '-.5px' })).chars;
    S.labels = [lab('Losing prospects', 245, 410), lab('Losing momentum', 820, 410), lab('Losing deals', 690, 1512)];
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1.3 - .3 * eio(P(lt, 0, 3.9)), y: 60 * (1 - eio(P(lt, 0, 3.9))) });
    [.15, 1.35, 2.55].forEach((a, i) => {
      const p = P(lt, a, a + 9 * FR);
      T(S.hex[i], { s: pop(p), o: p > 0 ? 1 : 0 });
      mb(S.hex[i], 14 * (1 - p) ** 2 * (p > 0), 14 * (1 - p) ** 2 * (p > 0));
      S.lines[i].setAttribute('stroke-dasharray', `${eo(P(lt, a + .22, a + .6))} 1`);
      typeIn(S.labels[i], lt, a + .5, .03);
    });
  },
});

/* ---------------- 7 · ONE-WORD BEATS  10.8–12.8 ---------------- */
addScene({
  start: 10.8, end: 12.8, enter: 'fadeScale', exit: 'zoomOut',
  build(c, S) {
    S.words = ['The', 'brands', 'people', 'remember'].map(w => {
      const g = glow(c, 540, 960, 620, 300);
      const e = at(el('div', c, 'ctr', { color: ACC, fontSize: '76px', fontWeight: 600, letterSpacing: '-1.5px', whiteSpace: 'nowrap' }), 540, 960);
      e.textContent = w; return { e, g };
    });
  },
  update(lt) {
    const S = this, A = [0, .45, .9, 1.35, 9];
    TT(S.cam, { s: 1 + .04 * lt });
    S.words.forEach(({ e, g }, i) => {
      const a = A[i], q = P(lt, a, a + 6 * FR), x = P(lt, A[i + 1] - 4 * FR, A[i + 1]);
      const vis = q > 0 && x < 1;
      T(e, { s: (1.35 - .35 * eo(q)) * (1 - .35 * eo(x)) * (1 + .05 * P(lt, a, a + .6)), o: vis ? Math.min(1, q * 2) * (1 - x) : 0 });
      mb(e, 14 * (1 - q) ** 2 + 8 * x * x, 14 * (1 - q) ** 2 + 8 * x * x);
      g.style.opacity = vis ? .8 * eo(P(lt, a + 2 * FR, a + 10 * FR)) * (1 - x) : 0;
    });
  },
});

/* ---------------- 8 · CONTRAST  12.8–13.9  "Aren't louder." ---------------- */
addScene({
  start: 12.8, end: 13.9, enter: 'bigIn', exit: 'zoomAway',
  build(c, S) {
    const l = textLine(c, 900, [{ t: 'Aren’t louder.', cls: 'serif' }], { fontSize: '124px' });
    S.chars = l.chars; S.chars.forEach(ch => ch.style.display = 'inline-block');
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * lt });
    S.chars.forEach((ch, i) => {
      const a = .04 + i * .03, p = P(lt, a, a + 6 * FR);
      ch.style.opacity = eo(p);
      const b = 16 * (1 - eo(p)); ch.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    });
  },
});

/* ---------------- 9 · BENEFITS  13.9–21.0  pill cloud ---------------- */
addScene({
  start: 13.9, end: 21.0, enter: 'fadeScale', exit: 'whipLeft',
  build(c, S) {
    S.rings = [[260, 120, 760], [760, 1880, 820], [1120, 980, 520]].map(([x, y, d]) => at(el('div', c, 'ctr', {
      width: px(d), height: px(d), borderRadius: '50%', border: `${Math.round(d * .11)}px solid ${ACC}`, boxSizing: 'border-box', filter: 'blur(26px)', opacity: .16 }), x, y));
    const PL = [
      ['They’re clearer.', 'f', 330, 740, .25], ['Sharper', 'o', 790, 740, 1.2],
      ['More visual', 'o', 250, 900, 2.15], ['They tell one story', 'f', 730, 900, 3.1],
      ['They build trust faster', 'f', 430, 1056, 4.1], ['They make choosing effortless', 'o', 600, 1200, 5.1],
    ];
    S.pills = PL.map(([t, k, x, y, a], i) => {
      const e = at(el('div', c, 'pill ' + k, { fontSize: '44px', fontWeight: 500, padding: '22px 44px', letterSpacing: '-.5px', borderWidth: '3px' }), x, y);
      e.textContent = t; return { e, a, side: i % 2 ? 1 : -1 };
    });
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .06 * eio(P(lt, 0, 7.1)) });
    S.rings.forEach((e, i) => {
      const q = eo(P(lt, -.1, .8));
      T(e, { s: (2.2 - 1.2 * q) * (1 + .04 * Math.sin(lt * .6 + i)), x: 30 * Math.sin(lt * .4 + i * 2), y: 30 * Math.cos(lt * .35 + i), o: .16 * Math.min(1, .3 + q) });
    });
    S.pills.forEach(({ e, a, side }) => {
      const q = P(lt, a, a + 9 * FR);
      T(e, { x: side * 1000 * (1 - eo(q)), o: q > 0 ? 1 : 0, y: -4 * Math.sin(lt * 1.3 + a) });
      mb(e, 70 * (1 - q) ** 2 * (q > 0), 0);
    });
  },
});

/* ---------------- 10 · PUNCHLINE  21.0–24.3 ---------------- */
addScene({
  start: 21.0, end: 24.3, enter: 'fromRight', exit: 'zoomThrough',
  build(c, S) {
    S.setW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' });
    S.set = textLine(S.setW, 935, [{ t: 'Because your story isn’t decoration' }], { fontSize: '46px', fontWeight: 500, letterSpacing: '-.5px' }).chars;
    S.punW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 975px' });
    S.g = glow(S.punW, 540, 975, 860, 380); S.g.style.opacity = 0;
    textLine(S.punW, 925, [{ t: 'It’s leverage.', whole: true }], { fontSize: '92px', fontWeight: 600, letterSpacing: '-3px' });
    S.oval = sv('path', layer(S.punW), { d: ovalPath(540, 978, 345, 92, -2), fill: 'none', stroke: ACC, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0 1' });
  },
  update(lt) {
    const S = this;
    const pan = eo(P(lt, 1.55, 2.05));
    TT(S.cam, { s: 1 + .02 * eio(P(lt, 0, 1.5)) + .08 * eio(P(lt, 1.7, 3.3)) });
    typeIn(S.set, lt, .1, .04, { gray: true, fade: 3 * FR });
    TT(S.setW, { x: -760 * pan, o: 1 - .45 * pan });
    mb(S.setW, 40 * Math.sin(Math.PI * pan) * (pan < 1), 0);
    if (pan > .01) S.set.forEach(ch => ch.style.color = mix(RGB.text, RGB.muted, pan));
    const q = P(lt, 1.62, 1.62 + 9 * FR);
    TT(S.punW, { x: 760 * (1 - eo(q)), o: q > 0 ? 1 : 0, s: 1 + .2 * (1 - eo(q)) });
    mb(S.punW, 80 * (1 - q) ** 2 * (q > 0), 0);
    S.g.style.opacity = .9 * eo(P(lt, 1.95, 2.5));
    S.oval.setAttribute('stroke-dasharray', `${eo(P(lt, 2.05, 2.6))} 1`);
  },
});

/* ---------------- 11 · OUTRO  24.3–27.0  logo + handle ---------------- */
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
  start: 24.3, end: 27.0, enter: 'fadeScale',
  build(c, S) {
    S.logo = at(el('div', c, 'ctr', {}, LOGO), 540, 925);
    S.handle = at(el('div', c, 'ctr', { fontSize: '34px', fontWeight: 500, whiteSpace: 'pre', fontVariantNumeric: 'tabular-nums' }), 540, 1085);
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eio(P(lt, 0, 2.7)) });
    const p = P(lt, .1, .1 + 10 * FR);
    T(S.logo, { s: .38 * pop(p), o: p > 0 ? 1 : 0 });
    mb(S.logo, 6 * (1 - p) ** 2 * (p > 0), 6 * (1 - p) ** 2 * (p > 0));
    if (!S.rp) S.rp = document.getElementById('revealPath');
    S.rp.setAttribute('stroke-dasharray', `${eo(P(lt, .2, .8))} 1`);
    const target = '@isp_agency_', pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@_';
    const sp = P(lt, .55, 1.2), f = Math.floor(lt * FPS);
    let out = '';
    for (let i = 0; i < target.length; i++) out += (i + 1) / target.length <= sp ? target[i] : pool[Math.floor(hash(f * 31 + i * 7) * pool.length)];
    S.handle.textContent = out;
    S.handle.style.opacity = eo(P(lt, .5, .65));
    S.handle.style.color = sp >= 1 ? TXT : mix(RGB.muted, RGB.text, sp);
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
