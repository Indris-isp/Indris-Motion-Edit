/* Meet ISP Agency — 7-scene vertical promo
 * 1080x1920 · 30 fps · 19 s · cuts land on the beat of the 120 BPM music bed (audio.py)
 * Every frame is a pure function of time: window.renderAt(seconds).
 */
'use strict';

/* scene boundaries in seconds (every 0.5 s is one beat) */
const SC = [[0, 2.5], [2.5, 5], [5, 8], [8, 10], [10, 13], [13, 15.5], [15.5, 19]];
const FPS = 30, DUR = SC[SC.length - 1][1], W = 1080, H = 1920;
const NS = 'http://www.w3.org/2000/svg';
window.TIMING = { FPS, DUR, frames: Math.round(DUR * FPS), scenes: SC };

/* ---------- math & easing ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, a, b) => clamp((t - a) / (b - a));
function cubicBezier(x1, y1, x2, y2) {
  const B = (u, a, b) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
  return p => {
    if (p <= 0) return 0; if (p >= 1) return 1;
    let lo = 0, hi = 1, u = p;
    for (let i = 0; i < 26; i++) { u = (lo + hi) / 2; if (B(u, x1, x2) < p) lo = u; else hi = u; }
    return B(u, y1, y2);
  };
}
const EE = cubicBezier(0.45, 0, 0.2, 1);      // soft start, long buttery settle
const OUT = cubicBezier(0.2, 0.8, 0.2, 1);    // fast out, gentle land
const INQ = cubicBezier(0.6, 0, 0.9, 0.4);    // accelerate away
const E = (t, a, b) => EE(P(t, a, b));
const back = p => { if (p <= 0) return 0; if (p >= 1) return 1; const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const POP = (t, a, b) => back(P(t, a, b));
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const D2R = Math.PI / 180;

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
const px = v => v + 'px';
const at = (e, x, y) => { e.style.left = px(x); e.style.top = px(y); return e; };
/* centred element transform */
function T(e, o) {
  e.style.transform = `translate(-50%,-50%) translate(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px) rotate(${(o.r || 0).toFixed(3)}deg) scale(${(o.s == null ? 1 : o.s).toFixed(4)})`;
  if (o.o != null) e.style.opacity = clamp(o.o);
  if (o.b != null) e.style.filter = o.b > .15 ? `blur(${o.b.toFixed(2)}px)` : '';
}
const svgFull = parent => sv('svg', parent, { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible' });
function glow(parent, x, y, w, h) { const g = at(el('div', parent, 'glow', { width: px(w), height: px(h) }), x, y); g.style.opacity = 0; return g; }
const dash = (e, p) => { e.setAttribute('stroke-dasharray', `${Math.max(0, p).toFixed(4)} 1.001`); e.style.display = p > .002 ? '' : 'none'; };

/* gradient text line centred on cy; each character is its own span for the type-on */
function textLine(parent, cy, segs, style) {
  const fs = parseFloat(style.fontSize);
  const line = el('div', parent, 'line', Object.assign({ top: px(cy - fs * .56) }, style));
  const chars = [], groups = [];
  for (const s of segs) {
    const tone = s.tone || 'dark';
    const g = el('span', line, (s.cls || 'sans') + ' grp gl-' + tone, s.style || {});
    groups.push(g);
    if (s.whole) { g.classList.add('tg-' + tone); g.textContent = s.t; continue; }
    for (const ch of s.t) { const c = el('span', g, 'ch tg-' + tone); c.textContent = ch; chars.push(c); }
  }
  return { line, chars, groups };
}
/* buttery type-on: each letter rises, sharpens from blur and fades in */
function typeIn(chars, lt, t0, per, dur = .36, rise = 26) {
  chars.forEach((c, i) => {
    const a = t0 + i * per, p = E(lt, a, a + dur);
    c.style.opacity = p;
    c.style.transform = p < 1 ? `translateY(${((1 - p) * rise).toFixed(2)}px)` : '';
    const b = (1 - p) * 9;
    c.style.filter = b > .15 ? `blur(${b.toFixed(2)}px)` : '';
  });
}

/* ---------- ISP logo (vector recreation of the mark; swap for the official SVG if you have one) ---------- */
let LOGO_N = 0;
function logo(parent, x, y) {
  const k = ++LOGO_N;
  const d = at(el('div', parent, 'ctr', { filter: 'drop-shadow(0 18px 24px rgba(120,40,0,.16)) drop-shadow(0 0 30px rgba(255,130,28,.22))' },
`<svg width="900" height="560" viewBox="0 0 900 560" style="overflow:visible;display:block">
<defs>
 <mask id="cres${k}" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
  <rect x="-100" y="-100" width="1100" height="760" fill="#000"/>
  <ellipse cx="450" cy="280" rx="405" ry="190" fill="#fff" transform="rotate(-14 450 280)"/>
  <ellipse cx="478" cy="258" rx="378" ry="158" fill="#000" transform="rotate(-14 450 280)"/>
 </mask>
 <mask id="reveal${k}" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
  <path id="rp${k}" d="M760.2 157.9 A405 190 0 1 1 755.7 155.3" fill="none" stroke="#fff" stroke-width="150" pathLength="1" stroke-dasharray="0 1" transform="rotate(-14 450 280)"/>
 </mask>
</defs>
<g mask="url(#reveal${k})"><rect x="-100" y="-100" width="1100" height="760" fill="url(#gAcc)" mask="url(#cres${k})"/></g>
<text x="450" y="378" text-anchor="middle" font-family="Inter" font-weight="800" font-size="290" letter-spacing="-10"
 fill="url(#gDarkV)" stroke="#FFFFFF" stroke-width="26" paint-order="stroke" stroke-linejoin="round">ISP</text>
</svg>`), x, y);
  d._rp = d.querySelector('#rp' + k);
  d.reveal = p => d._rp.setAttribute('stroke-dasharray', `${p.toFixed(4)} 1.001`);
  return d;
}

/* ---------- platform icons ---------- */
const BRAND = {
  instagram: { fill: 'url(#gIG)', tile: 'radial-gradient(circle at 30% 107%, #FDF497 0%, #FDF497 6%, #FD5949 45%, #D6249F 62%, #285AEB 92%)', tileFill: '#fff', name: 'Instagram' },
  youtube: { fill: '#FF0000', tile: 'linear-gradient(160deg,#FFFFFF,#F1F1F1)', tileFill: '#FF0000', name: 'YouTube' },
  facebook: { fill: '#0866FF', tile: 'linear-gradient(160deg,#FFFFFF,#F1F1F1)', tileFill: '#0866FF', name: 'Facebook' },
  tiktok: { fill: '#000', tile: 'linear-gradient(160deg,#1E1E1E,#000)', tileFill: '#fff', name: 'TikTok', glitch: true },
  x: { fill: '#000' },
  snapchat: { fill: '#fff', stroke: '#000', bg: '#FFFC00' },
  pinterest: { fill: '#E60023' },
  whatsapp: { fill: '#25D366' },
  linkedin: { fill: '#0A66C2' },
  threads: { fill: '#000' },
};
function glyph(name, fill, size) {
  const b = BRAND[name], d = ICONS[name];
  const st = b.stroke ? ` stroke="${b.stroke}" stroke-width=".9" stroke-linejoin="round"` : '';
  let inner = `<path d="${d}" fill="${fill}"${st}/>`;
  if (b.glitch) inner = `<path d="${d}" fill="#25F4EE" transform="translate(-.55 -.45)"/><path d="${d}" fill="#FE2C55" transform="translate(.55 .45)"/>` + inner;
  return `<svg viewBox="0 0 24 24"${size ? ` width="${size}" height="${size}"` : ''}>${inner}</svg>`;
}
/* round white chip with the glyph in brand colour */
function chip(parent, name, size) {
  const b = BRAND[name];
  const c = at(el('div', parent, 'chip', { width: px(size), height: px(size), marginLeft: px(-size / 2), marginTop: px(-size / 2) }, glyph(name, b.fill)), 540, 960);
  if (b.bg) c.style.background = `radial-gradient(circle at 35% 28%, #FFFF8A 0%, ${b.bg} 60%, #E8E400 100%)`;
  c.style.transform = 'none';
  return c;
}
/* app-icon style tile */
function tile(parent, name, size, x, y) {
  const b = BRAND[name];
  const t = at(el('div', parent, 'tile', { width: px(size), height: px(size), background: b.tile }, glyph(name, b.tileFill, Math.round(size * (name === 'youtube' ? .66 : .56)))), x, y);
  return t;
}
/* chip transform (chips are positioned by margin, so translate is absolute from their anchor) */
function TC(e, o) {
  e.style.transform = `translate(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px) rotate(${(o.r || 0).toFixed(3)}deg) scale(${(o.s == null ? 1 : o.s).toFixed(4)})`;
  if (o.o != null) e.style.opacity = clamp(o.o);
}

/* sparkle burst */
function sparks(parent, n, seed, cls = 'tg-acc') {
  return Array.from({ length: n }, (_, i) => {
    const e = el('div', parent, 'ctr ' + cls, { fontSize: px(26 + hash(seed + i) * 26), filter: 'drop-shadow(0 0 8px rgba(255,130,28,.6))' });
    e.textContent = '✦'; e._a = hash(seed + i * 3.1) * 360; e._r = 160 + hash(seed + i * 7.7) * 260; e._d = hash(seed + i * 1.3) * .2;
    return e;
  });
}
function updateSparks(arr, lt, t0, cx, cy) {
  arr.forEach(e => {
    const p = P(lt, t0 + e._d, t0 + e._d + .9), q = OUT(p);
    at(e, cx, cy);
    T(e, { x: Math.cos(e._a * D2R) * e._r * q, y: Math.sin(e._a * D2R) * e._r * q + 120 * p * p, s: .4 + .8 * Math.sin(Math.PI * p), r: 180 * p, o: p <= 0 || p >= 1 ? 0 : Math.sin(Math.PI * p) });
  });
}

/* =====================================================================
   SCENES
   ===================================================================== */
const scenes = [];
function addScene(def) {
  const i = scenes.length;
  def.idx = i; def.start = SC[i][0]; def.end = SC[i][1];
  def.el = el('div', $('#scenes'), 'scene');
  def.build(def.el, def);
  scenes.push(def);
}

/* ---------------- SCENE 1 — "Meet  ISP Agency" ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 930, 1000, 800);
    S.meet = textLine(c, 760, [{ t: 'Meet', cls: 'serif', tone: 'acc' }], { fontSize: '230px' }).chars;
    S.name = textLine(c, 1010, [{ t: 'ISP Agency' }], { fontSize: '150px', fontWeight: 800, letterSpacing: '-0.045em' });
    const svg = svgFull(c);
    S.ovalG = sv('ellipse', svg, { cx: 540, cy: 1012, rx: 505, ry: 150, fill: 'none', stroke: '#FF821C', 'stroke-width': 18, opacity: .25, pathLength: 1, transform: 'rotate(-7 540 1012)', style: 'filter:blur(8px)' });
    S.oval = sv('ellipse', svg, { cx: 540, cy: 1012, rx: 505, ry: 150, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, transform: 'rotate(-7 540 1012) scale(1,1)' });
    S.sp = sparks(c, 7, 11);
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = E(lt, .1, .9);
    typeIn(S.meet, lt, .05, .07, .45, 40);
    typeIn(S.name.chars, lt, .5, .04, .38, 30);
    const o = E(lt, 1.0, 1.75);
    dash(S.oval, o); dash(S.ovalG, o);
    updateSparks(S.sp, lt, 1.3, 1000, 900);
  },
});

/* ---------------- SCENE 2 — brand logos ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 1000, 1100, 1000);
    S.pill = at(el('div', c, 'pill', {}, '<i></i>Brands we’ve worked with'), 540, 470);
    const list = (window.BRANDS || []).slice(0, 9);
    const n = list.length || 6, cols = n <= 6 ? 2 : 3, rows = Math.ceil(n / cols);
    const cw = cols === 2 ? 410 : 290, ch = cols === 2 ? 250 : 200, gap = 36;
    const x0 = 540 - ((cols - 1) * (cw + gap)) / 2, y0 = 1030 - ((rows - 1) * (ch + gap)) / 2;
    S.cards = Array.from({ length: n }, (_, i) => {
      const r = Math.floor(i / cols), k = i % cols;
      const card = at(el('div', c, 'card', { width: px(cw), height: px(ch), marginLeft: px(-cw / 2), marginTop: px(-ch / 2) }), x0 + k * (cw + gap), y0 + r * (ch + gap));
      if (list[i]) { const img = el('img', card); img.src = list[i]; }
      else el('div', card, 'ph', {}, '<i></i><b>LOGO</b>');
      card._k = i; return card;
    });
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = .7 * E(lt, 0, .8);
    const pp = E(lt, .05, .45);
    T(S.pill, { y: 30 * (1 - pp), o: pp, s: .9 + .1 * pp });
    S.cards.forEach((e, i) => {
      const a = .2 + i * .1, p = POP(lt, a, a + .55), q = P(lt, a, a + .2);
      TC(e, { y: 90 * (1 - EE(P(lt, a, a + .5))) + 8 * Math.sin(lt * 2.2 + i), s: .55 + .45 * p, r: (i % 2 ? 4 : -4) * (1 - EE(P(lt, a, a + .6))), o: q });
    });
  },
});

/* ---------------- SCENE 3 — ISP in the middle, social orbit ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 960, 1150, 1150);
    const svg = svgFull(c);
    S.pulses = [0, 1, 2].map(() => sv('circle', svg, { cx: 540, cy: 960, r: 170, fill: 'none', stroke: '#FF821C', 'stroke-width': 3, opacity: 0 }));
    S.rings = [300, 445].map(r => sv('circle', svg, { cx: 540, cy: 960, r, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 3, opacity: .45, pathLength: 1, transform: 'rotate(-90 540 960)', 'stroke-linecap': 'round' }));
    S.inner = ['instagram', 'youtube', 'facebook', 'tiktok'].map((n, i) => ({ a0: -45 + i * 90, R: 300, e: chip(c, n, 160), l: sv('line', svg, { x1: 540, y1: 960, x2: 540, y2: 960, stroke: 'url(#gAcc)', 'stroke-width': 3, opacity: 0, 'stroke-dasharray': '6 10' }) }));
    S.outer = ['x', 'snapchat', 'pinterest', 'whatsapp', 'linkedin', 'threads'].map((n, i) => ({ a0: -90 + i * 60, R: 445, e: chip(c, n, 122) }));
    S.disc = at(el('div', c, 'disc', { width: '330px', height: '330px' }), 540, 960);
    S.logo = logo(c, 540, 962);
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = E(lt, 0, .7);
    const dp = POP(lt, 0, .5);
    T(S.disc, { s: .3 + .7 * dp, o: P(lt, 0, .15) });
    T(S.logo, { s: .31 * (.3 + .7 * dp), o: P(lt, .05, .2) });
    S.logo.reveal(E(lt, .2, .9));
    S.rings.forEach((r, i) => dash(r, E(lt, .25 + i * .15, 1.1 + i * .15)));
    S.pulses.forEach((r, i) => {
      const p = P(lt, .35 + i * .7, 1.75 + i * .7);
      r.setAttribute('r', 170 + 480 * OUT(p)); r.setAttribute('opacity', p <= 0 || p >= 1 ? 0 : .35 * (1 - p));
    });
    const place = (o, i, start, spin) => {
      const p = P(lt, start, start + .6), r = o.R * OUT(p), s = back(P(lt, start, start + .55));
      const a = (o.a0 + spin * lt) * D2R, x = Math.cos(a) * r, y = Math.sin(a) * r;
      TC(o.e, { x, y, s: .2 + .8 * s, o: P(lt, start, start + .12), r: -spin * lt * .4 });
      return [x, y, p];
    };
    S.inner.forEach((o, i) => {
      const [x, y, p] = place(o, i, .3 + i * .09, 10);
      o.l.setAttribute('x2', 540 + x); o.l.setAttribute('y2', 960 + y); o.l.setAttribute('opacity', .55 * p);
    });
    S.outer.forEach((o, i) => place(o, i, .7 + i * .07, -7));
  },
});

/* ---------------- SCENE 4 — "Let's make your video better" ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 1080, 1000, 700);
    S.l1 = textLine(c, 790, [{ t: 'Let’s make' }], { fontSize: '112px', fontWeight: 700, letterSpacing: '-0.04em' }).chars;
    S.l2 = textLine(c, 920, [{ t: 'your video' }], { fontSize: '112px', fontWeight: 700, letterSpacing: '-0.04em' }).chars;
    S.better = textLine(c, 1095, [{ t: 'better.', cls: 'serif', tone: 'acc', whole: true }], { fontSize: '250px' }).groups[0];
    const svg = svgFull(c);
    const d = 'M300 1215 C 430 1180, 640 1175, 790 1200';
    S.swG = sv('path', svg, { d, fill: 'none', stroke: '#FF821C', 'stroke-width': 20, opacity: .25, pathLength: 1, 'stroke-linecap': 'round', style: 'filter:blur(7px)' });
    S.sw = sv('path', svg, { d, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 9, pathLength: 1, 'stroke-linecap': 'round' });
    S.sp = sparks(c, 6, 41);
  },
  update(lt) {
    const S = this;
    typeIn(S.l1, lt, .05, .03, .34);
    typeIn(S.l2, lt, .3, .03, .34);
    const p = E(lt, .62, 1.05);
    S.better.style.opacity = P(lt, .62, .8);
    S.better.style.transform = `scale(${lerp(1.6, 1, p).toFixed(4)})`;
    const b = (1 - p) * 14;
    S.better.style.filter = (b > .15 ? `blur(${b.toFixed(2)}px) ` : '') + 'drop-shadow(0 0 10px rgba(255,130,28,.5)) drop-shadow(0 0 30px rgba(255,130,28,.3))';
    S.g.style.opacity = E(lt, .7, 1.2);
    const s = E(lt, 1.0, 1.45); dash(S.sw, s); dash(S.swG, s);
    updateSparks(S.sp, lt, 1.0, 860, 1040);
  },
});

/* ---------------- SCENE 5 — Instagram · YouTube, then Facebook · TikTok ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 960, 1100, 900);
    const mk = (name, x) => {
      const g = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px' });
      g._t = tile(g, name, 320, x - 160, 760);
      g._n = textLine(g, 1180, [{ t: BRAND[name].name }], { fontSize: '62px', fontWeight: 700, letterSpacing: '-0.03em', left: px(x - 540) });
      g._s = el('div', g, 'glow', { width: '560px', height: '560px', left: px(x), top: '920px' });
      return g;
    };
    S.pairs = [[mk('instagram', 300), mk('youtube', 780)], [mk('facebook', 300), mk('tiktok', 780)]];
    S.amp = [0, 1].map(i => { const e = at(el('div', c, 'ctr tg-acc serif', { fontSize: '120px', filter: 'drop-shadow(0 0 12px rgba(255,130,28,.5))' }), 540, 905); e.textContent = '&'; return e; });
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = .6 * E(lt, 0, .6);
    const OFF = 1.45;                       // second pair takes over
    S.pairs.forEach((pair, k) => {
      const t0 = k ? OFF + .14 : .05;
      const out = k ? 0 : INQ(P(lt, OFF - .2, OFF + .2));
      pair.forEach((g, j) => {
        const a = t0 + j * .12, p = POP(lt, a, a + .55), e = EE(P(lt, a, a + .5));
        const enterX = k ? 520 * (1 - OUT(P(lt, a - .05, a + .45))) : 0;
        g.style.transform = `translateX(${(enterX - 1100 * out).toFixed(2)}px)`;
        g.style.opacity = (k ? P(lt, a - .05, a + .1) : P(lt, a, a + .1)) * (1 - P(out, .6, 1));
        const tl = g._t;
        tl.style.transform = `translateY(${(70 * (1 - e) + 10 * Math.sin(lt * 2.4 + j * 1.7)).toFixed(2)}px) rotate(${((j ? 1 : -1) * 14 * (1 - e)).toFixed(3)}deg) scale(${(.35 + .65 * p).toFixed(4)})`;
        g._s.style.opacity = .7 * e;
        typeIn(g._n.chars, lt, a + .2, .025, .3);
      });
      const am = S.amp[k], ap = E(lt, t0 + .25, t0 + .6);
      T(am, { s: .4 + .6 * back(P(lt, t0 + .25, t0 + .6)), o: ap * (1 - P(out, .3, .8)), x: k ? 0 : -1100 * out, r: -20 * (1 - ap) });
    });
  },
});

/* ---------------- SCENE 6 — ISP Agency · all in one place, less pressure ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 960, 1100, 1000);
    S.head = textLine(c, 640, [{ t: 'ISP Agency' }], { fontSize: '132px', fontWeight: 800, letterSpacing: '-0.045em' }).chars;
    S.box = at(el('div', c, 'card', { width: '640px', height: '200px', marginLeft: '-320px', marginTop: '-100px', borderRadius: '48px' }), 540, 900);
    S.icons = ['instagram', 'youtube', 'facebook', 'tiktok'].map((n, i) => {
      const e = chip(c, n, 124); e._tx = (i - 1.5) * 146; e._ty = -60;
      e._fx = [-700, 700, -700, 700][i]; e._fy = [-900, -900, 900, 900][i];
      return e;
    });
    S.l1 = textLine(c, 1140, [{ t: 'All in one place,' }], { fontSize: '92px', fontWeight: 700, letterSpacing: '-0.035em' }).chars;
    S.l2 = textLine(c, 1290, [{ t: 'less pressure.', cls: 'serif', tone: 'acc' }], { fontSize: '150px' }).chars;
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = .8 * E(lt, 0, .8);
    typeIn(S.head, lt, .02, .035, .36);
    const bp = POP(lt, .3, .8);
    TC(S.box, { s: .6 + .4 * bp, o: P(lt, .3, .45) });
    S.icons.forEach((e, i) => {
      const a = .35 + i * .07, p = OUT(P(lt, a, a + .6));
      TC(e, { x: lerp(e._fx, e._tx, p), y: lerp(e._fy, e._ty, p), r: 220 * (1 - p) * (i % 2 ? 1 : -1), s: lerp(1.5, 1, p) * (1 + .06 * Math.sin(Math.PI * P(lt, a + .55, a + .85))), o: P(lt, a, a + .15) });
    });
    typeIn(S.l1, lt, .95, .025, .34);
    typeIn(S.l2, lt, 1.35, .04, .42, 34);
  },
});

/* ---------------- SCENE 7 — ISP Agency · video is ready ---------------- */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 1000, 1100, 1100);
    S.logo = logo(c, 540, 470);
    S.player = at(el('div', c, 'player', { width: '780px', height: '440px', marginLeft: '-390px', marginTop: '-220px' }), 540, 930);
    el('div', S.player, 'abs', { inset: 0, background: 'radial-gradient(ellipse 70% 80% at 30% 20%, rgba(255,130,28,.28), rgba(255,130,28,0) 60%)' });
    el('div', S.player, 'abs', { left: '34px', top: '28px', font: '500 26px Inter', color: 'rgba(255,255,255,.55)', letterSpacing: '.02em' }, 'your_video_final.mp4');
    S.scrub = el('div', S.player, 'abs', { left: '34px', right: '34px', bottom: '34px', height: '6px', borderRadius: '6px', background: 'rgba(255,255,255,.14)' });
    S.scrubIn = el('div', S.scrub, '', { height: '100%', width: '0%', borderRadius: '6px', background: '#FF821C' });
    S.btn = at(el('div', S.player, 'abs', { width: '150px', height: '150px', marginLeft: '-75px', marginTop: '-75px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFD3A0, #FF821C 45%, #C84400)', boxShadow: '0 0 40px rgba(255,130,28,.6), inset 0 2px 0 rgba(255,255,255,.4)' }), 390, 220);
    const bs = sv('svg', S.btn, { width: 150, height: 150, viewBox: '0 0 150 150', style: 'position:absolute;left:0;top:0' });
    S.tri = sv('path', bs, { d: 'M62 47 L106 75 L62 103 Z', fill: '#fff', 'stroke-linejoin': 'round', stroke: '#fff', 'stroke-width': 6 });
    S.chk = sv('path', bs, { d: 'M48 78 L68 98 L104 56', fill: 'none', stroke: '#fff', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 });
    S.bar = at(el('div', c, 'bar', { width: '780px' }), 150, 1210);
    S.fill = el('div', S.bar, '', { width: '0%' });
    S.pct = at(el('div', c, 'abs', { font: '600 36px Inter', color: '#4E4E4E', letterSpacing: '-.01em', width: '780px', display: 'flex', justifyContent: 'space-between' }), 150, 1250);
    S.pctL = el('span', S.pct); S.pctR = el('span', S.pct);
    S.ready = textLine(c, 1420, [{ t: 'Video is ' }, { t: 'ready.', cls: 'serif', tone: 'acc', style: { fontSize: '150px' } }], { fontSize: '104px', fontWeight: 700, letterSpacing: '-0.04em' }).chars;
    S.sp = sparks(c, 12, 77);
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = .8 * E(lt, 0, .8);
    const lp = E(lt, 0, .5);
    T(S.logo, { s: .42 * (.8 + .2 * lp), o: lp });
    S.logo.reveal(E(lt, .1, .8));
    const pp = POP(lt, .15, .7);
    TC(S.player, { s: .7 + .3 * pp, o: P(lt, .15, .3), y: 6 * Math.sin(lt * 2) });
    const prog = cubicBezier(.3, 0, .2, 1)(P(lt, .45, 1.85)), DONE = 1.9;
    S.fill.style.width = (prog * 100).toFixed(2) + '%';
    S.scrubIn.style.width = (prog * 100).toFixed(2) + '%';
    S.bar.style.opacity = S.pct.style.opacity = P(lt, .35, .5) * (1 - .0 * P(lt, DONE, DONE + .3));
    S.pctL.textContent = lt < DONE ? 'Editing…' : 'Done';
    S.pctR.textContent = Math.round(prog * 100) + '%';
    S.pctL.style.color = lt < DONE ? '#4E4E4E' : '#E65A00';
    const cp = P(lt, DONE, DONE + .35);
    S.tri.style.opacity = 1 - P(lt, DONE - .05, DONE + .08);
    dash(S.chk, E(lt, DONE, DONE + .35));
    const bump = 1 + .18 * Math.sin(Math.PI * cp);
    S.btn.style.transform = `scale(${bump.toFixed(4)})`;
    typeIn(S.ready, lt, DONE + .1, .035, .4, 30);
    updateSparks(S.sp, lt, DONE, 540, 930);
  },
});

/* =====================================================================
   AMBIENT DECOR + TRANSITIONS + RENDER
   ===================================================================== */
const blobs = [[200, 400, 900], [900, 1500, 1000], [850, 300, 600]].map(([x, y, s]) => { const b = at(el('div', $('#decor'), 'blob', { width: px(s), height: px(s) }), x, y); b._x = x; b._y = y; return b; });

const IN = .34, OUTD = .22, OVER = .16;   // zoom-through: outgoing scales past camera, incoming settles in
function renderAt(t) {
  blobs.forEach((b, i) => { b.style.transform = `translate(-50%,-50%) translate(${(80 * Math.sin(t * .35 + i * 2)).toFixed(1)}px,${(60 * Math.cos(t * .28 + i)).toFixed(1)}px)`; });
  $('#dots').style.transform = `translateY(${(-t * 12).toFixed(2)}px)`;
  for (const s of scenes) {
    const lt = t - s.start, d = s.end - s.start, last = s.idx === scenes.length - 1;
    const vis = lt >= 0 && (last || lt < d + OVER);
    s.el.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) continue;
    const pin = s.idx === 0 ? 1 : OUT(P(lt, 0, IN));
    const pout = last ? 0 : INQ(P(lt, d - OUTD, d + OVER));
    const drift = 1 + .035 * (lt / d);
    const sc = lerp(.86, 1, pin) * (1 + .55 * pout) * drift;
    const blur = 12 * (1 - pin) + 16 * pout;
    s.el.style.transform = `scale(${sc.toFixed(4)}) rotate(${(-1.5 * (1 - pin) + 1.2 * pout).toFixed(3)}deg)`;
    s.el.style.opacity = Math.min(P(lt, 0, IN * .6) + (s.idx === 0 ? 1 : 0), 1 - pout);
    s.el.style.filter = blur > .2 ? `blur(${blur.toFixed(2)}px)` : '';
    s.update(lt);
  }
  $('#fade').style.opacity = E(t, DUR - .4, DUR - .02);
}
window.renderAt = renderAt;

(async function init() {
  await document.fonts.ready;
  await Promise.all([...document.fonts].map(f => f.load().catch(() => {})));
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  if (/render/.test(location.search)) { document.body.classList.add('render'); renderAt(0); window.READY = true; return; }
  const vp = $('#viewport'), aud = $('#aud'), scrub = $('#scrub'), tc = $('#tc'), btn = $('#play');
  scrub.max = TIMING.frames - 1;
  const fit = () => { const k = Math.min((innerHeight - 44) / H, innerWidth / W); vp.style.transform = `translateX(${-W * k / 2}px) scale(${k})`; };
  fit(); addEventListener('resize', fit);
  let playing = true, t0 = performance.now(), cur = 0;
  const startAudio = () => { try { aud.currentTime = cur; aud.play().catch(() => {}); } catch (e) {} };
  btn.onclick = () => { playing = !playing; btn.textContent = playing ? 'Pause' : 'Play'; if (playing) { t0 = performance.now() - cur * 1000; startAudio(); } else aud.pause(); };
  scrub.oninput = () => { cur = scrub.value / FPS; t0 = performance.now() - cur * 1000; if (playing) startAudio(); };
  document.addEventListener('click', e => { if (e.target.closest('#viewport')) startAudio(); }, { once: true });
  (function loop() {
    if (playing) { cur = (performance.now() - t0) / 1000; if (cur >= DUR) { cur = 0; t0 = performance.now(); startAudio(); } }
    renderAt(cur); scrub.value = Math.floor(cur * FPS); tc.textContent = cur.toFixed(2) + 's';
    requestAnimationFrame(loop);
  })();
})();
