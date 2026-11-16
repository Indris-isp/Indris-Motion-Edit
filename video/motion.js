/* ISP Agency — kinetic typography promo
 * 1080x1920 · 30 fps · 27 s (810 frames)
 * Every frame is a pure function of time: window.renderAt(seconds).
 */
'use strict';

const FPS = 30, DUR = TL.DUR, FR = 1 / FPS, W = 1080, H = 1920;
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

/* reference-matched helpers ------------------------------------------------ */
const LIGHT = [205, 205, 205];
/* typewriter where each letter fades in from light grey to its own colour */
function typeG(chars, lt, t0, per, fade = 3 * FR) {
  chars.forEach((c, i) => {
    const a = t0 + i * per, p = P(lt, a, a + fade);
    c.style.opacity = Math.min(1, p * 2);
    c.style.color = mix(LIGHT, c._to || RGB.text, P(lt, a, a + 7 * FR));
  });
}
/* tag every char of a textLine with its target colour */
function tagColor(l, colorBySeg) { let k = 0; l.groups.forEach((g, gi) => g.querySelectorAll('span').forEach(c => { c._to = colorBySeg[gi] || RGB.text; k++; })); return l; }
function T0(e, o) { e.style.transform = `translate(${o.x || 0}px,${o.y || 0}px) scale(${o.s == null ? 1 : o.s})`; }
function buildAmbient() {}
function ambient() {}
const HEAD = { fontSize: '66px', fontWeight: 500, letterSpacing: '-0.035em' };

/* =====================================================================
   SCENE 1 — HOOK  0.0–1.5  "Your brand is always talking."
   ===================================================================== */
addScene({
  start: TL.scenes[0][0], end: TL.scenes[0][1], exit: 'whipLeft',
  build(c, S) {
    S.g = glow(c, 0, 0, 900, 900); S.g.style.opacity = 0;
    S.rings = [[40, 150, 330, -1, -1], [1010, 1690, 250, 1, 1], [-30, 1720, 170, -1, 1], [1060, 300, 120, 1, -1]].map(([x, y, r, dx, dy]) => {
      const e = at(el('div', c, 'ctr', { width: px(2 * r), height: px(2 * r), borderRadius: '50%', border: `3px solid ${ACC}`, boxSizing: 'border-box' }), x, y);
      e._d = [dx, dy]; return e;
    });
    const l = tagColor(textLine(c, 922, [{ t: 'Your', block: true, whole: true }, { t: ' brand is always ' }, { t: 'talking.', block: true, style: { color: ACC } }], HEAD), [0, RGB.text, RGB.accent]);
    S.your = l.groups[0]; S.talk = l.groups[2]; S.chars = l.chars;
    S.parts = ['✦', '“', '✦', '”', '✦'].map((g, i) => {
      const e = el('div', c, 'ctr ' + (g === '✦' ? 'sans' : 'serif'), { color: ACC, fontSize: px(34 + hash(i) * 22) }); e.textContent = g; return e;
    });
  },
  measure(S) {
    const y = rel(S.your); S.yd = { x: 540 - y.cx, y: 960 - y.cy };
    const tk = rel(S.talk); at(S.g, tk.cx, tk.cy);
    S.parts.forEach((e, i) => at(e, tk.cx + (hash(i + 3) - .5) * 260, tk.cy + 40 + hash(i + 9) * 60));
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eo(P(lt, 0, 1.5)) });
    const a = P(lt, 0, 4 * FR), b = P(lt, 5 * FR, 11 * FR), sc = lerp(6.4, 1, eo(b));
    T0(S.your, { x: S.yd.x * (1 - eo(b)) + 1500 * (1 - eo(a)), y: S.yd.y * (1 - eo(b)), s: sc });
    mb(S.your, (120 * (1 - a) ** 2 + 14 * (1 - b) * (b > 0)) / sc, 0);
    typeG(S.chars, lt, .36, .026);
    S.g.style.opacity = eo(P(lt, .8, 1.2));
    const r = eo(P(lt, .05, .9));
    S.rings.forEach((e, i) => T(e, { x: e._d[0] * 420 * (1 - r) + 14 * Math.sin(lt * 1.3 + i), y: e._d[1] * 420 * (1 - r) + 14 * Math.cos(lt * 1.1 + i), o: .5 * r }));
    S.parts.forEach((e, i) => {
      const s0 = .95 + i * .07, p = P(lt, s0, s0 + .55);
      T(e, { y: -120 * eo(p), o: p <= 0 ? 0 : Math.sin(Math.PI * p), s: .7 + .3 * eo(p) });
    });
  },
});

/* =====================================================================
   SCENE 2 — WHY pt.1  1.5–3.0  macro watch  "Every second / confused"
   ===================================================================== */
addScene({
  start: TL.scenes[1][0], end: TL.scenes[1][1], enter: 'fromRight', exit: 'spinOut',
  build(c, S) {
    const cx = 70, cy = 1500, R = 1060;
    S.cx = cx; S.cy = cy;
    S.dialW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: `${cx}px ${cy}px` });
    const s = layer(S.dialW);
    const pt = (deg, r) => { const a = deg * Math.PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    for (let d = -100; d <= -22; d += 1.5) {
      const maj = Math.abs((d + 100) % 7.5) < .01, [x1, y1] = pt(d, R - 40), [x2, y2] = pt(d, R - (maj ? 120 : 75));
      sv('line', s, { x1, y1, x2, y2, stroke: maj ? TXT : '#CFCFCF', 'stroke-width': maj ? 5 : 3, 'stroke-linecap': 'round' });
    }
    [[-82, 'ISP · 01'], [-56, 'VISUALS'], [-34, 'STORY']].forEach(([d, t]) => {
      const [x, y] = pt(d, R - 190);
      const tx = sv('text', s, { x, y, fill: '#BDBDBD', 'font-size': 26, 'font-family': 'Inter', 'font-weight': 500, 'letter-spacing': 3, 'text-anchor': 'middle', transform: `rotate(${d + 90} ${x} ${y})` }); tx.textContent = t;
    });
    const arcD = (() => { const [x0, y0] = pt(-100, R), [x1, y1] = pt(-12, R); return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`; })();
    S.arc = sv('path', s, { d: arcD, fill: 'none', stroke: ACC, 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0 1' });
    S.dots = [-84, -60, -36].map(d => { const [x, y] = pt(d, R); return sv('circle', s, { cx: x, cy: y, r: 11, fill: '#fff', stroke: ACC, 'stroke-width': 5 }); });
    S.hand = sv('g', s, { style: 'filter:drop-shadow(6px 10px 10px rgba(0,0,0,.18))' });
    sv('path', S.hand, { d: `M${cx - 16} ${cy + 140} L${cx - 22} ${cy} L${cx - 9} ${cy - 600} L${cx} ${cy - 1010} L${cx + 9} ${cy - 600} L${cx + 22} ${cy} L${cx + 16} ${cy + 140} Z`, fill: TXT });
    sv('path', S.hand, { d: `M${cx} ${cy - 820} L${cx + 34} ${cy - 700} L${cx} ${cy - 600} L${cx - 34} ${cy - 700} Z`, fill: '#fff', stroke: TXT, 'stroke-width': 9, 'stroke-linejoin': 'round' });
    sv('circle', S.hand, { cx, cy, r: 46, fill: TXT });
    sv('circle', S.hand, { cx, cy, r: 24, fill: ACC });
    const tx = 740;
    S.l1 = tagColor(textLine(c, 1350, [{ t: 'Every second' }], Object.assign({}, HEAD, { left: px(tx - 540) })), []).chars;
    S.l2 = tagColor(textLine(c, 1410, [{ t: 'confused', cls: 'serif' }], { fontSize: '128px', left: px(tx - 540) }), [RGB.accent]).chars;
    S.cap = tagColor(textLine(c, 1570, [{ t: 'a client spends confused about\nwhat you actually do' }], { fontSize: '27px', fontWeight: 500, left: px(tx - 540), lineHeight: 1.3, color: '#3A3A3A' }), [[58, 58, 58]]).chars;
  },
  update(lt) {
    const S = this;
    const D2 = S.end - S.start;
    TT(S.cam, { s: 1 + .05 * eio(P(lt, 0, D2)) });
    S.dialW.style.transform = `rotate(${-4 + 6 * eio(P(lt, 0, D2))}deg)`;
    S.arc.setAttribute('stroke-dasharray', `${eo(P(lt, .05, .9))} 1`);
    S.dots.forEach((d, i) => d.setAttribute('opacity', P(lt, .2 + i * .2, .3 + i * .2)));
    S.hand.setAttribute('transform', `rotate(${-6 + 40 * eio(P(lt, 0, D2))} ${S.cx} ${S.cy})`);
    typeG(S.l1, lt, .15, .03);
    typeG(S.l2, lt, TL.cue.s2_conf, .04);
    typeG(S.cap, lt, TL.cue.s2_conf + .3, .008);
  },
});

/* =====================================================================
   SCENE 3 — WHY pt.2  3.0–4.5  "They can't see / what you do."
   ===================================================================== */
function personSVG(fill, w) {
  return `<svg width="${w}" height="${w * 1.2}" viewBox="0 0 100 120"><circle cx="50" cy="28" r="23" fill="${fill}"/>` +
    `<path d="M6 120 C6 80 26 60 50 60 C74 60 94 80 94 120 Z" fill="${fill}"/></svg>`;
}
function corners(g, x0, y0, x1, y1, L, attrs) {
  const d = `M${x0} ${y0 + L}V${y0}H${x0 + L} M${x1 - L} ${y0}H${x1}V${y0 + L} M${x1} ${y1 - L}V${y1}H${x1 - L} M${x0 + L} ${y1}H${x0}V${y1 - L}`;
  return sv('path', g, Object.assign({ d, fill: 'none', 'stroke-linecap': 'square' }, attrs));
}
addScene({
  start: TL.scenes[2][0], end: TL.scenes[2][1], enter: 'drop', exit: 'zoomThrough',
  build(c, S) {
    S.vf = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 960px' });
    corners(layer(S.vf), 110, 330, 970, 1400, 170, { stroke: ACC, 'stroke-width': 6 });
    S.h1 = tagColor(textLine(c, 560, [{ t: 'They can’t see' }], Object.assign({}, HEAD, { fontSize: '76px' })), []).chars;
    S.h2 = tagColor(textLine(c, 630, [{ t: 'what you do.', cls: 'serif' }], { fontSize: '96px', left: '60px' }), [RGB.accent]).chars;
    const P5 = [[250, .62], [385, .86], [540, 1.12], [695, .86], [830, .62]];
    S.ppl = P5.map(([x, k], i) => at(el('div', c, 'ctr', {}, personSVG(i === 2 ? TXT : ACC, 120 * k)), x, 960 + (1 - k) * 40));
    S.foc = at(el('div', c, 'ctr', { width: '190px', height: '200px' }), 540, 958);
    corners(sv('svg', S.foc, { width: 190, height: 200, viewBox: '0 0 190 200', style: 'overflow:visible' }), 3, 3, 187, 197, 30, { stroke: TXT, 'stroke-width': 5 });
    S.cap = tagColor(textLine(c, 1160, [{ t: 'Your ideal client spends seconds\ndeciding if you’re worth their attention.' }], { fontSize: '30px', fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.02em' }), [[40, 40, 40]]).chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .08 * eio(P(lt, 0, 1.5)) });
    const v = P(lt, .05, .45); TT(S.vf, { s: 1.12 - .12 * eo(v), o: eo(v) });
    typeG(S.h1, lt, .1, .028);
    typeG(S.h2, lt, .45, .03);
    S.ppl.forEach((e, i) => { const p = P(lt, .12 + Math.abs(i - 2) * .08, .12 + Math.abs(i - 2) * .08 + 9 * FR); T(e, { s: pop(p), o: p > 0 ? 1 : 0 }); mb(e, 0, 10 * (1 - p) ** 2 * (p > 0)); });
    const f = P(lt, .55, .55 + 9 * FR);
    T(S.foc, { s: 1.4 - .4 * eo(f), o: f > 0 ? 1 : 0 });
    typeG(S.cap, lt, .75, .009);
  },
});

/* =====================================================================
   SCENE 4 — PROBLEM  4.5–6.0  "Is a second you're losing them."
   ===================================================================== */
const STARS = n => `<div style="color:${ACC};font-size:20px;letter-spacing:3px;margin-top:10px">${'★'.repeat(n)}<span style="color:#DDD">${'★'.repeat(5 - n)}</span><span style="color:#999;font-size:15px;letter-spacing:0;margin-left:8px">${n}.0</span></div>`;
const review = (ini, role, q, n) => `<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
  <div style="width:46px;height:46px;border-radius:50%;background:#F1F1F1;color:#777;font-size:17px;font-weight:600;display:flex;align-items:center;justify-content:center">${ini}</div>
  <div><div style="font-size:18px;font-weight:600">${role}</div><div style="font-size:14px;color:#9A9A9A">Verified client</div></div></div>
  <div style="font-size:17px;line-height:1.35;color:#333">“${q}”</div>${STARS(n)}`;
const CARDS = [
  review('SK', 'Founder', 'Loved the visuals, but I’m still not completely sure what they actually do.', 3),
  review('JT', 'SaaS CEO', 'Had to read the whole page twice to understand the offer.', 2),
  review('PS', 'Head of Growth', 'Interested, but confused about how it works and what the next step is.', 3),
];
addScene({
  start: TL.scenes[3][0], end: TL.scenes[3][1], enter: 'zoomIn', exit: 'whipUp',
  build(c, S) {
    const s = layer(c);
    S.q = [400, 540, 680].map((x, i) => {
      const t = sv('text', s, { x, y: 1060, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 600, 'font-size': 300, fill: 'none', stroke: ACC, 'stroke-width': 3.5 });
      t.textContent = '?'; return t;
    });
    S.h = tagColor(textLine(c, 922, [{ t: 'Is a second you’re ' }, { t: 'losing', style: { color: ACC } }, { t: ' them.' }], HEAD), [RGB.text, RGB.accent, RGB.text]).chars;
    S.cards = [[290, 560, -3], [810, 690, 3], [380, 1340, 2]].map(([x, y, r], i) => {
      const e = at(el('div', c, 'card', { width: '320px', padding: '22px 24px', borderRadius: '22px', boxShadow: '0 16px 44px rgba(10,10,10,.08), 0 1px 4px rgba(10,10,10,.05)' }, CARDS[i]), x, y); e._r = r; return e;
    });
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .06 * eio(P(lt, 0, 1.5)) });
    S.q.forEach((t, i) => {
      const p = eo(P(lt, .05 + i * .07, .45 + i * .07));
      t.setAttribute('opacity', .32 * p);
      t.setAttribute('transform', `translate(0 ${30 * (1 - p) + 6 * Math.sin(lt * 3 + i)})`);
    });
    typeG(S.h, lt, .08, .02);
    S.cards.forEach((e, i) => {
      const a = .3 + i * .22, p = P(lt, a, a + 9 * FR);
      T(e, { r: e._r, s: pop(p), o: p > 0 ? 1 : 0, y: -5 * Math.sin(lt * 2 + i) });
      mb(e, 12 * (1 - p) ** 2 * (p > 0), 12 * (1 - p) ** 2 * (p > 0));
    });
  },
});

/* =====================================================================
   SCENE 5 — COUNTER  6.0–7.0
   ===================================================================== */
addScene({
  start: TL.scenes[4][0], end: TL.scenes[4][1], enter: 'fromBottom', exit: 'zoomThrough',
  build(c, S) {
    S.ringW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 920px' });
    S.g = glow(S.ringW, 640, 920, 760, 760); S.g.style.opacity = .9;
    const s = layer(S.ringW);
    sv('circle', s, { cx: 540, cy: 920, r: 190, fill: 'none', stroke: '#D4D4D4', 'stroke-width': 30 });
    const mk = (extra) => sv('circle', s, Object.assign({ cx: 540, cy: 920, r: 190, fill: 'none', stroke: ACC, pathLength: 1, 'stroke-linecap': 'butt', transform: 'rotate(-90 540 920)' }, extra));
    S.arcG = mk({ 'stroke-width': 54, opacity: .35, style: 'filter:blur(16px)' });
    S.arc = mk({ 'stroke-width': 30 });
    S.num = at(el('div', S.ringW, 'ctr', { fontSize: '150px', fontWeight: 600, letterSpacing: '-4px', fontVariantNumeric: 'tabular-nums' }), 540, 925);
    S.lab = tagColor(textLine(c, 1150, [{ t: 'competitors, one ' }, { t: 'scroll', style: { color: ACC } }, { t: ' away' }], HEAD), [RGB.text, RGB.accent, RGB.text]).chars;
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eio(P(lt, 0, S.end - S.start)) });
    const m = eo(P(lt, 0, .6));
    TT(S.ringW, { x: -280 * (1 - m), y: 560 * (1 - m), s: .5 + .5 * m });
    mb(S.ringW, 12 * (1 - m) ** 2, 12 * (1 - m) ** 2);
    const c = P(lt, .1, .7);
    S.num.textContent = Math.round(5 + 11 * eo(c));
    const ap = .15 + .55 * eo(c);
    [S.arc, S.arcG].forEach(a => a.setAttribute('stroke-dasharray', `${ap} 1`));
    typeG(S.lab, lt, .3, .018);
  },
});

/* =====================================================================
   SCENE 6 — PAIN ×3  7.0–11.0  extruded hexagon honeycomb
   ===================================================================== */
const ICONS = {
  trust: `<path d="M60 10 L98 25 V58 C98 84 80 100 60 108 C40 100 22 84 22 58 V25 Z"/><path d="M60 26 V92" stroke-width="5" opacity=".9"/><path d="M62 30 L52 56 L68 66 L56 92"/>`,
  leads: `<circle cx="60" cy="58" r="44"/><circle cx="60" cy="58" r="28"/><circle cx="60" cy="58" r="10"/><path d="M60 4 V24 M60 92 V112 M6 58 H26 M94 58 H114"/>`,
  deals: `<path d="M30 12 H74 L92 30 V108 H30 Z"/><path d="M74 12 V30 H92"/><path d="M44 56 H78 M44 72 H78 M44 88 H62"/><circle cx="84" cy="94" r="16" fill="${ACC}"/><path d="M78 88 L90 100 M90 88 L78 100"/>`,
};
function hexSVG(icon) {
  const poly = r => { const p = []; for (let i = 0; i < 6; i++) { const a = (-90 + i * 60) * Math.PI / 180; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); } return p.join(' '); };
  return `<svg width="320" height="320" viewBox="-160 -160 320 320" style="overflow:visible">` +
    `<polygon points="${poly(128)}" transform="translate(0 12)" fill="${TXT}" stroke="${TXT}" stroke-width="16" stroke-linejoin="round"/>` +
    `<polygon points="${poly(128)}" fill="${ACC}" stroke="${ACC}" stroke-width="16" stroke-linejoin="round"/>` +
    `<g transform="translate(-60 -60)" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${icon}</g></svg>`;
}
addScene({
  start: TL.scenes[5][0], end: TL.scenes[5][1], enter: 'zoomIn', exit: 'spinOut',
  build(c, S) {
    const hx = [[418, 880, 'trust'], [662, 880, 'leads'], [540, 1091, 'deals']];
    S.hex = hx.map(([x, y, k]) => at(el('div', c, 'ctr', {}, hexSVG(ICONS[k])), x, y));
    const s = layer(c);
    S.lines = ['M418 738 L418 690 L345 622', 'M662 738 L662 690 L735 622', 'M540 1240 L540 1288 L613 1356']
      .map(d => sv('path', s, { d, fill: 'none', stroke: TXT, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '0 1' }));
    const lab = (t, st) => tagColor(textLine(c, 0, [{ t }], Object.assign({ fontSize: '40px', fontWeight: 500, letterSpacing: '-0.02em', width: 'auto' }, st)), []).chars;
    S.labels = [lab('Losing trust', { left: 'auto', right: px(1080 - 360), top: '560px' }), lab('Losing leads', { left: '720px', top: '560px' }), lab('Losing deals', { left: '598px', top: '1366px' })];
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1.22 - .22 * eio(P(lt, 0, 4)), y: 20 * (1 - eio(P(lt, 0, 4))) });
    TL.cue.s6_hex.forEach((a, i) => {
      const p = P(lt, a, a + 9 * FR);
      T(S.hex[i], { s: pop(p), o: p > 0 ? 1 : 0 });
      mb(S.hex[i], 14 * (1 - p) ** 2 * (p > 0), 14 * (1 - p) ** 2 * (p > 0));
      S.lines[i].setAttribute('stroke-dasharray', `${eo(P(lt, a + .2, a + .5))} 1`);
      typeG(S.labels[i], lt, a + .42, .028);
    });
  },
});

/* =====================================================================
   SCENE 7 — ONE-WORD BEATS  11.0–13.0  "The · best · brands"
   ===================================================================== */
addScene({
  start: TL.scenes[6][0], end: TL.scenes[6][1], enter: 'spinIn', exit: 'zoomOut',
  build(c, S) {
    S.words = ['The', 'best', 'brands'].map(w => {
      const g = glow(c, 540, 960, 520, 520);
      const e = at(el('div', c, 'ctr', { color: ACC, fontSize: '92px', fontWeight: 500, letterSpacing: '-0.035em', whiteSpace: 'nowrap' }), 540, 960);
      e.textContent = w; return { e, g };
    });
  },
  update(lt) {
    const S = this, A = [...TL.cue.s7_words, 99];
    TT(S.cam, { s: 1 + .04 * lt });
    S.words.forEach(({ e, g }, i) => {
      const a = A[i], q = P(lt, a, a + 6 * FR), x = P(lt, A[i + 1] - 4 * FR, A[i + 1]);
      const vis = q > 0 && x < 1;
      T(e, { s: (1.3 - .3 * eo(q)) * (1 - .4 * eo(x)) * (1 + .06 * P(lt, a, a + .7)), o: vis ? Math.min(1, q * 2) * (1 - x) : 0 });
      mb(e, 12 * (1 - q) ** 2 + 8 * x * x, 12 * (1 - q) ** 2 + 8 * x * x);
      g.style.opacity = vis ? eo(P(lt, a, a + 10 * FR)) * (1 - x) : 0;
    });
  },
});

/* =====================================================================
   SCENE 8 — CONTRAST  13.0–14.0  "don't say more."
   ===================================================================== */
addScene({
  start: TL.scenes[7][0], end: TL.scenes[7][1], enter: 'bigIn', exit: 'zoomAway',
  build(c, S) {
    const l = textLine(c, 905, [{ t: 'don’t say more.', cls: 'serif' }], { fontSize: '128px' });
    S.chars = l.chars; S.chars.forEach(ch => ch.style.display = 'inline-block');
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * lt });
    S.chars.forEach((ch, i) => {
      const a = .03 + i * .03, p = P(lt, a, a + 6 * FR);
      ch.style.opacity = eo(p);
      ch.style.color = mix(LIGHT, RGB.text, eo(p));
      const b = 12 * (1 - eo(p));
      ch.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    });
  },
});

/* =====================================================================
   SCENE 9 — BENEFITS  14.0–21.0  pill word-cloud
   ===================================================================== */
addScene({
  start: TL.scenes[8][0], end: TL.scenes[8][1], enter: 'fadeScale', exit: 'whipLeft',
  build(c, S) {
    S.rings = [[540, 80], [560, 1880], [80, 1250]].map(([x, y], i) => at(el('div', c, 'ctr', {
      width: px(i === 2 ? 560 : 820), height: px(i === 2 ? 560 : 820), borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,130,28,0) 47%, rgba(255,130,28,.16) 59%, rgba(255,130,28,0) 71%)' }), x, y));
    const rows = [
      [['They’re focused.', 'f', 0], ['Sharper', 'o', 1]],
      [['Strategic', 'o', 2], ['They simplify the message', 'f', 3]],
      [['They build trust instantly', 'f', 4]],
      [['They make choosing easy', 'o', 5]],
    ];
    S.pills = [];
    rows.forEach((r, ri) => {
      const row = el('div', c, 'abs', { left: '0', width: '1080px', top: px(790 + ri * 116), display: 'flex', justifyContent: 'center', gap: '16px',
        paddingLeft: ri === 3 ? '170px' : ri === 2 ? '0' : '0', boxSizing: 'border-box' });
      r.forEach(([t, k, a], j) => {
        const e = el('div', row, 'pill ' + k, { position: 'relative', transform: 'none', fontSize: '38px', fontWeight: 500, padding: '18px 38px', letterSpacing: '-0.02em' });
        e.textContent = t;
        S.pills.push({ e, a: TL.cue.s9_pills[a] - S.start, side: (ri + j) % 2 ? -1 : 1 });
      });
    });
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .05 * eio(P(lt, 0, S.end - S.start)) });
    S.rings.forEach((e, i) => {
      const q = eo(P(lt, -.05, .8));
      T(e, { s: (2 - 1 * q) * (1 + .05 * Math.sin(lt * .5 + i)), x: 40 * Math.sin(lt * .35 + i * 2), y: 30 * Math.cos(lt * .3 + i), o: q });
      mb(e, 26 * (1 - q), 26 * (1 - q));
    });
    S.pills.forEach(({ e, a, side }) => {
      const q = P(lt, a, a + 8 * FR);
      e.style.transform = `translateX(${side * 900 * (1 - eo(q))}px)`;
      e.style.opacity = q > 0 ? 1 : 0;
      mb(e, 60 * (1 - q) ** 2 * (q > 0), 0);
    });
  },
});

/* =====================================================================
   SCENE 10 — PUNCHLINE  21.0–24.5  "Design isn't decoration —  It's strategy."
   ===================================================================== */
function ovalPath(cx, cy, rx, ry, tilt) {
  const pts = [], N = 90, a0 = -195, a1 = 185;
  for (let i = 0; i <= N; i++) {
    const p = i / N, a = (a0 + (a1 - a0) * p) * Math.PI / 180, k = 1.03 - .06 * p + .01 * Math.sin(p * 9);
    const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k, t = tilt * Math.PI / 180;
    pts.push([cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)]);
  }
  return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
}
addScene({
  start: TL.scenes[9][0], end: TL.scenes[9][1], enter: 'fromRight', exit: 'zoomThrough',
  build(c, S) {
    S.setW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' });
    const sl = tagColor(textLine(S.setW, 925, [{ t: 'Design isn’t decoration —' }], { fontSize: '54px', fontWeight: 500, letterSpacing: '-0.03em' }), []);
    S.set = sl.chars; S.setG = sl.groups[0];
    S.punW = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '540px 960px' });
    S.g = glow(S.punW, 540, 960, 1000, 640); S.g.style.opacity = 0;
    const pl = textLine(S.punW, 898, [{ t: 'It’s strategy.', whole: true, block: true }], { fontSize: '108px', fontWeight: 600, letterSpacing: '-0.045em' });
    S.punG = pl.groups[0];
    const s = layer(S.punW);
    S.oval = sv('path', s, { d: ovalPath(540, 962, 400, 108, -2), fill: 'none', stroke: ACC, 'stroke-width': 5.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0 1' });
  },
  measure(S) {
    const a = rel(S.setG), b = rel(S.punG);
    S.shift = (540 - b.w / 2 - 34 - a.w / 2) - 540;  // setup ends just left of the punchline
  },
  update(lt) {
    const S = this;
    const p0 = TL.cue.s10_punch, [s0, per] = TL.cue.s10_set;
    const pan = eo(P(lt, p0 - .12, p0 + .38));
    TT(S.cam, { x: 0, s: 1 + .03 * eio(P(lt, 0, p0)) + .07 * eio(P(lt, p0, S.end - S.start)) });
    typeG(S.set, lt, s0, per);
    TT(S.setW, { x: (S.shift - 1080 * 0) * pan });
    mb(S.setW, 36 * Math.sin(Math.PI * pan) * (pan < 1), 0);
    if (pan > 0) S.set.forEach(ch => ch.style.color = mix(RGB.text, [175, 175, 175], pan));
    const q = P(lt, p0 - .06, p0 - .06 + 9 * FR);
    TT(S.punW, { x: 900 * (1 - eo(q)), o: q > 0 ? 1 : 0 });
    mb(S.punW, 80 * (1 - q) ** 2 * (q > 0), 0);
    S.g.style.opacity = eo(P(lt, p0 + .3, p0 + .8));
    S.oval.setAttribute('stroke-dasharray', `${eo(P(lt, p0 + .45, p0 + .95))} 1`);
  },
});

/* =====================================================================
   SCENE 11 — OUTRO  24.5–27.0  logo · handle scramble
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
  start: TL.scenes[10][0], end: TL.scenes[10][1], enter: 'fadeScale',
  build(c, S) {
    S.cta = tagColor(textLine(c, 700, [{ t: 'Let’s build ' }, { t: 'yours.', cls: 'serif', style: { fontSize: '76px' } }], { fontSize: '50px', fontWeight: 500, letterSpacing: '-0.03em' }), [RGB.text, RGB.accent]).chars;
    S.logo = at(el('div', c, 'ctr', {}, LOGO), 540, 945);
    S.handle = at(el('div', c, 'ctr', { fontSize: '34px', fontWeight: 500, letterSpacing: '0px', whiteSpace: 'pre' }), 540, 1100);
  },
  update(lt) {
    const S = this;
    TT(S.cam, { s: 1 + .04 * eio(P(lt, 0, 2.5)) });
    const p = P(lt, .08, .08 + 10 * FR);
    T(S.logo, { s: pop(p) * .4, o: p > 0 ? 1 : 0 });
    mb(S.logo, 16 * (1 - p) ** 2 * (p > 0), 16 * (1 - p) ** 2 * (p > 0));
    if (!S.rp) S.rp = document.getElementById('revealPath');
    S.rp.setAttribute('stroke-dasharray', `${eo(P(lt, .18, .8))} 1`);
    typeG(S.cta, lt, TL.cue.s11_cta, .035);
    const target = '@isp_agency_', pool = 'abcdefghijklmnopqrstuvwxyz0123456789#$%&?_';
    const sp = P(lt, .3, 1.0), f = Math.floor(lt * FPS);
    let out = '';
    for (let i = 0; i < target.length; i++) out += (i + 1) / target.length <= sp ? target[i] : pool[Math.floor(hash(f * 31 + i * 7) * pool.length)];
    S.handle.textContent = out;
    S.handle.style.opacity = eo(P(lt, .25, .4));
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
  $('#fade').style.opacity = eio(P(t, DUR - .45, DUR - .03));
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
  scrub.max = TL.frames - 1;
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
