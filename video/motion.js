/* ISP Agency — premium kinetic-typography promo
 * 1080x1920 · 30 fps · length from the voiceover timeline (timeline.js)
 * One continuous 3D world: every scene is a panel on a white-gradient stage,
 * a 3D camera flies between them along a glowing orange thread.
 * Every frame is a pure function of time: window.renderAt(seconds).
 */
'use strict';

const FPS = 30, DUR = TL.DUR, FR = 1 / FPS, W = 1080, H = 1920;
const NS = 'http://www.w3.org/2000/svg';

/* ---------- math & easing (all "easy ease") ---------- */
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
const EE = cubicBezier(0.45, 0, 0.2, 1);    // element easy-ease: soft start, long buttery settle
const CE = cubicBezier(0.65, 0, 0.35, 1);   // camera easy-ease in/out
const E = (t, a, b) => EE(P(t, a, b));
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const GLOW = {
  dark: 'drop-shadow(0 0 16px rgba(255,140,40,.22)) drop-shadow(0 8px 14px rgba(0,0,0,.16))',
  acc: 'drop-shadow(0 0 10px rgba(255,130,28,.55)) drop-shadow(0 0 30px rgba(255,130,28,.35))',
};

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
/* centred element transform (3D aware) */
function T(e, o) {
  e.style.transform = `translate(-50%,-50%) translate3d(${o.x || 0}px,${o.y || 0}px,${o.z || 0}px) rotateX(${o.rx || 0}deg) rotateY(${o.ry || 0}deg) rotate(${o.r || 0}deg) scale(${o.s == null ? 1 : o.s})`;
  if (o.o != null) e.style.opacity = o.o;
}
/* full-panel layer transform */
function TT(e, o) {
  e.style.transform = `translate3d(${o.x || 0}px,${o.y || 0}px,${o.z || 0}px) rotateX(${o.rx || 0}deg) rotateY(${o.ry || 0}deg) rotate(${o.r || 0}deg) scale(${o.s == null ? 1 : o.s})`;
  if (o.o != null) e.style.opacity = o.o;
}
const fullLayer = (parent, z = 0, cls = 'abs') => { const d = el('div', parent, cls, { left: 0, top: 0, width: '1080px', height: '1920px' }); d.style.transform = `translateZ(${z}px)`; return d; };
const svgFull = parent => sv('svg', parent, { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible' });
function glow(parent, x, y, w, h, z = 0) { const g = at(el('div', parent, 'glow', { width: px(w), height: px(h) }), x, y); g.style.transform = `translate(-50%,-50%) translateZ(${z}px)`; g.style.opacity = 0; return g; }
/* element centre in its panel's coordinates (measured while the world is flat) */
function rel(e, base) { const r = e.getBoundingClientRect(), s = base.getBoundingClientRect(); return { cx: r.left - s.left + r.width / 2, cy: r.top - s.top + r.height / 2, w: r.width, h: r.height }; }
const dash = (e, p) => { e.setAttribute('stroke-dasharray', `${Math.max(0, p).toFixed(4)} 1.001`); e.style.visibility = p > .002 ? 'visible' : 'hidden'; };

/* gradient text: each character is its own span (for the type-on), tone = dark | acc | gray | white */
function textLine(parent, top, segs, extra = {}) {
  const line = el('div', parent, 'line', Object.assign({ top: px(top) }, extra));
  const chars = [], groups = [];
  for (const s of segs) {
    const tone = s.tone || 'dark';
    const g = el('span', line, (s.cls || 'sans') + ' grp gl-' + tone, s.style || {});
    groups.push(g);
    if (s.whole) { g.classList.add('tg-' + tone); g.textContent = s.t; continue; }
    for (const ch of s.t) { if (ch === '\n') { el('br', g); continue; } const c = el('span', g, 'ch tg-' + tone); c.textContent = ch; chars.push(c); }
  }
  return { line, chars, groups };
}
/* buttery type-on: each letter rises, sharpens from blur and fades in */
function typeIn(chars, lt, t0, per, dur = .38) {
  chars.forEach((c, i) => {
    const a = t0 + i * per, p = E(lt, a, a + dur);
    c.style.opacity = p;
    c.style.transform = p < 1 ? `translateY(${((1 - p) * 18).toFixed(2)}px)` : '';
    const b = (1 - p) * 8;
    c.style.filter = b > .15 ? `blur(${b.toFixed(2)}px)` : '';
  });
}
const HEAD = { fontSize: '66px', fontWeight: 500, letterSpacing: '-0.035em' };

/* =====================================================================
   WORLD: panels laid out as a snake; camera + connecting thread
   ===================================================================== */
const POS = [[0, 0], [1500, 250], [3000, 0], [3000, 2350], [1500, 2600], [0, 2350], [0, 4700], [1500, 4950], [3000, 4700], [3000, 7050], [1500, 7300]];
const CEN = POS.map(([x, y]) => [x + 540, y + 960]);
const TA = .55, TB = .42, PUSH = 70;   // camera leaves TA before a boundary, lands TB after it
const scenes = [];
function addScene(def) {
  const i = scenes.length;
  def.idx = i; def.start = TL.scenes[i][0]; def.end = TL.scenes[i][1];
  def.panel = el('div', $('#world'), 'panel');
  at(def.panel, POS[i][0], POS[i][1]);
  def.build(def.panel, def);
  scenes.push(def);
}

function camPose(t) {
  const S = TL.scenes, n = S.length;
  let k = S.findIndex(s => t < s[1]); if (k < 0) k = n - 1;
  const hold = j => E(t, S[j][0] + (j ? TB : 0), S[j][1] - (j < n - 1 ? TA : 0));
  let f, z, rx = 0, ry = 0, rz = 0, tr = -1;
  for (let j = 0; j < n - 1; j++) { const b = S[j][1]; if (t >= b - TA && t < b + TB) { tr = j; break; } }
  if (tr >= 0) {
    const p = CE(P(t, S[tr][1] - TA, S[tr][1] + TB)), A = CEN[tr], B = CEN[tr + 1], s = Math.sin(Math.PI * p);
    const dx = Math.sign(B[0] - A[0]), dy = Math.sign(B[1] - A[1]);
    f = [lerp(A[0], B[0], p), lerp(A[1], B[1], p)];
    z = lerp(PUSH, 0, p) - 1150 * s;
    ry = -dx * 16 * s; rx = dy * 12 * s; rz = dx * 2.5 * s;
  } else { f = CEN[k]; z = PUSH * hold(k); }
  ry += 2.2 * Math.sin(t * .42); rx += 1.5 * Math.sin(t * .33 + 1.2);   // living, never-static camera
  z -= 420 * (1 - E(t, 0, 1.1));                                         // opening dolly-in
  return { f, z, rx, ry, rz };
}

/* thread: glowing orange line connecting each frame to the next */
const threads = [];
function buildThreads() {
  for (let k = 0; k < POS.length - 1; k++) {
    const A = POS[k], B = POS[k + 1], dx = Math.sign(B[0] - A[0]);
    let a, b, ca, cb;
    if (dx) { a = [A[0] + (dx > 0 ? 1080 : 0), A[1] + 1780]; b = [B[0] + (dx > 0 ? 0 : 1080), B[1] + 1780]; const g = Math.abs(b[0] - a[0]) * .55; ca = [a[0] + dx * g, a[1]]; cb = [b[0] - dx * g, b[1]]; }
    else { a = [A[0] + 900, A[1] + 1920]; b = [B[0] + 900, B[1]]; const g = Math.abs(b[1] - a[1]) * .55; ca = [a[0], a[1] + g]; cb = [b[0], b[1] - g]; }
    const inA = dx ? [a[0] - dx * 120, a[1]] : [a[0], a[1] - 120], inB = dx ? [b[0] + dx * 120, b[1]] : [b[0], b[1] + 120];
    const xs = [inA[0], ca[0], cb[0], inB[0]], ys = [inA[1], ca[1], cb[1], inB[1]];
    const x0 = Math.min(...xs) - 60, y0 = Math.min(...ys) - 60, w = Math.max(...xs) - x0 + 60, h = Math.max(...ys) - y0 + 60;
    const holder = at(el('div', $('#world'), 'abs', { width: px(w), height: px(h) }), x0, y0);
    const s = sv('svg', holder, { width: w, height: h, viewBox: `${x0} ${y0} ${w} ${h}`, style: 'overflow:visible' });
    const d = `M${inA[0]} ${inA[1]} L${a[0]} ${a[1]} C${ca[0]} ${ca[1]} ${cb[0]} ${cb[1]} ${b[0]} ${b[1]} L${inB[0]} ${inB[1]}`;
    const halo = sv('path', s, { d, fill: 'none', stroke: '#FF821C', 'stroke-width': 18, 'stroke-linecap': 'round', opacity: .22, pathLength: 1, style: 'filter:blur(8px)' });
    const line = sv('path', s, { d, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1 });
    const node = (x, y) => { const g = sv('g', s, {}); sv('circle', g, { cx: x, cy: y, r: 26, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 3, opacity: .6 }); sv('circle', g, { cx: x, cy: y, r: 11, fill: 'url(#gCap)' }); return g; };
    const n0 = node(inA[0], inA[1]), n1 = node(inB[0], inB[1]);
    const head = sv('circle', s, { r: 13, fill: '#FFD2A0', style: 'filter:drop-shadow(0 0 10px #FF821C) drop-shadow(0 0 22px #FF821C)' });
    threads.push({ k, line, halo, n0, n1, head });
  }
}
function updateThreads(t) {
  threads.forEach(({ k, line, halo, n0, n1, head }) => {
    const b = TL.scenes[k][1], p = CE(P(t, b - TA - .1, b + TB - .05));
    dash(line, p); dash(halo, p);
    n0.setAttribute('opacity', E(t, b - TA - .3, b - TA));
    n1.setAttribute('opacity', p >= .98 ? 1 : 0);
    if (p > 0 && p < 1) { const L = line.getTotalLength(), pt = line.getPointAtLength(L * p); head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y); head.setAttribute('opacity', 1); }
    else head.setAttribute('opacity', 0);
  });
}

/* =====================================================================
   SCENE 1 — HOOK  "Your brand is always talking."
   ===================================================================== */
addScene({
  build(c, S) {
    S.g = glow(c, 0, 0, 900, 900, -20);
    S.rings = [[60, 170, 300, -1, -1], [1000, 1660, 240, 1, 1], [-20, 1700, 160, -1, 1], [1050, 330, 120, 1, -1]].map(([x, y, r, dx, dy]) => {
      const d = at(el('div', c, 'ctr'), x, y);
      const s = sv('svg', d, { width: 2 * r + 10, height: 2 * r + 10, viewBox: `${-r - 5} ${-r - 5} ${2 * r + 10} ${2 * r + 10}` });
      d._c = sv('circle', s, { r, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 3, pathLength: 1 });
      d._d = [dx, dy]; return d;
    });
    const l = textLine(c, 905, [{ t: 'Your', whole: true }, { t: ' brand is always ' }, { t: 'talking.', tone: 'acc' }], HEAD);
    S.your = l.groups[0]; S.talk = l.groups[2]; S.chars = l.chars;
    S.parts = [0, 1, 2, 3, 4].map(i => { const e = el('div', c, 'ctr tg-acc', { fontSize: px(30 + hash(i) * 24) }); e.textContent = '✦'; e.style.filter = GLOW.acc; return e; });
  },
  measure(S) {
    const y = rel(S.your, S.panel); S.yd = { x: 540 - y.cx, y: 960 - y.cy };
    const tk = rel(S.talk, S.panel); at(S.g, tk.cx, tk.cy);
    S.parts.forEach((e, i) => at(e, tk.cx + (hash(i + 3) - .5) * 300, tk.cy + 30 + hash(i + 9) * 60));
  },
  update(lt) {
    const S = this;
    const b = E(lt, 0, .7), sc = lerp(6.2, 1, b);
    S.your.style.transform = `translate(${S.yd.x * (1 - b)}px,${S.yd.y * (1 - b)}px) scale(${sc})`;
    S.your.style.opacity = E(lt, 0, .18);
    const bl = (1 - b) * 3;
    S.your.style.filter = (bl > .15 ? `blur(${bl.toFixed(2)}px) ` : '') + GLOW.dark;
    typeIn(S.chars, lt, .55, .028);
    S.g.style.opacity = E(lt, 1.05, 1.6);
    S.rings.forEach((d, i) => {
      const r = E(lt, .1 + i * .08, 1.3 + i * .08);
      T(d, { x: d._d[0] * 380 * (1 - r) + 14 * Math.sin(lt * 1.1 + i), y: d._d[1] * 380 * (1 - r) + 14 * Math.cos(lt * .9 + i), z: -160, o: .75 });
      dash(d._c, r);
    });
    S.parts.forEach((e, i) => {
      const s0 = 1.1 + i * .09, p = P(lt, s0, s0 + .8);
      T(e, { y: -130 * EE(p), o: p <= 0 ? 0 : Math.sin(Math.PI * p), s: .6 + .4 * EE(p), z: 40 });
    });
  },
});

/* =====================================================================
   SCENE 2 — 3D WATCH  "But every second a client spends confused"
   ===================================================================== */
function handSVG(fill, stroke, diamond = '#fff') {
  return `<svg width="1000" height="1000" viewBox="0 0 1000 1000" style="position:absolute;left:0;top:0;overflow:visible"><g class="rot">
   <path d="M488 590 L484 500 L493 190 L500 92 L507 190 L516 500 L512 590 Z" fill="${fill}"/>
   <path d="M500 150 L528 238 L500 300 L472 238 Z" fill="${diamond}" stroke="${stroke}" stroke-width="7" stroke-linejoin="round"/></g></svg>`;
}
addScene({
  build(c, S) {
    const cx = 560, cy = 860, R = 440;
    const hold = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', perspective: '1700px', perspectiveOrigin: `${cx}px ${cy}px` });  // own 3D stage: watch can't slice the copy
    S.dw = at(el('div', hold, 'abs p3', { width: '1000px', height: '1000px', transformOrigin: '500px 500px' }), cx - 500, cy - 500);
    const layer = (z, style, html, cls = 'abs') => { const d = el('div', S.dw, cls, Object.assign({ left: 0, top: 0, width: '1000px', height: '1000px' }, style), html); d.style.transform = `translateZ(${z}px)`; return d; };
    const disc = (d, extra) => Object.assign({ left: px(500 - d / 2), top: px(500 - d / 2), width: px(d), height: px(d), borderRadius: '50%' }, extra);
    S.layers = [];
    S.layers.push(layer(-80, disc(860, { background: 'radial-gradient(closest-side, rgba(40,20,0,.32), rgba(40,20,0,0))', filter: 'blur(28px)' })));
    for (let k = 0; k < 12; k++) S.layers.push(layer(k * 3, disc(2 * R, { background: `linear-gradient(135deg, #${k % 2 ? '3a3a3a' : '2a2a2a'}, #050505)` })));
    S.layers.push(layer(36, disc(2 * R, { background: 'conic-gradient(from 210deg, #0c0c0c, #5d5d5d 12%, #121212 30%, #2d2d2d 52%, #090909 74%, #4c4c4c 90%, #0c0c0c)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)' })));
    S.layers.push(layer(39, disc(2 * R - 64, { background: 'radial-gradient(circle at 40% 32%, #FFFFFF 0%, #F9F8F7 50%, #E2E0DE 100%)', boxShadow: 'inset 0 10px 26px rgba(0,0,0,.22)' })));
    const tk = layer(43, {}, '');
    const s = sv('svg', tk, { width: 1000, height: 1000, viewBox: '0 0 1000 1000', style: 'position:absolute;left:0;top:0;overflow:visible' });
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * Math.PI * 2, maj = i % 5 === 0, r1 = R - 52, r2 = r1 - (maj ? 46 : 20);
      sv('line', s, { x1: 500 + Math.cos(a) * r1, y1: 500 + Math.sin(a) * r1, x2: 500 + Math.cos(a) * r2, y2: 500 + Math.sin(a) * r2, stroke: maj ? '#1a1a1a' : '#C4C4C4', 'stroke-width': maj ? 7 : 3, 'stroke-linecap': 'round' });
    }
    [['12', 0], ['3', 90], ['6', 180], ['9', 270]].forEach(([n, d]) => {
      const a = (d - 90) * Math.PI / 180, r = R - 140;
      const tx = sv('text', s, { x: 500 + Math.cos(a) * r, y: 500 + Math.sin(a) * r + 18, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 600, 'font-size': 52, fill: 'url(#gDarkV)' }); tx.textContent = n;
    });
    const brand = sv('text', s, { x: 500, y: 650, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 600, 'font-size': 20, 'letter-spacing': 6, fill: '#A0A0A0' }); brand.textContent = 'ISP · EVERY SECOND';
    const ar = layer(47, {}, '');
    const s2 = sv('svg', ar, { width: 1000, height: 1000, viewBox: '0 0 1000 1000', style: 'position:absolute;left:0;top:0;overflow:visible' });
    S.arcG = sv('circle', s2, { cx: 500, cy: 500, r: R - 78, fill: 'none', stroke: '#FF821C', 'stroke-width': 30, opacity: .45, pathLength: 1, transform: 'rotate(-90 500 500)', style: 'filter:blur(12px)' });
    S.arc = sv('circle', s2, { cx: 500, cy: 500, r: R - 78, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1, transform: 'rotate(-90 500 500)' });
    S.layers.push(tk, ar);
    S.hShadow = layer(46, { filter: 'blur(7px)' }, handSVG('#000', '#000', '#000'));
    S.hShadow.style.transform = 'translate3d(16px,22px,46px)';
    S.hand = layer(92, { filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.25))' }, handSVG('url(#gDarkV)', '#111'));
    S.sec = layer(104, {}, `<svg width="1000" height="1000" viewBox="0 0 1000 1000" style="position:absolute;left:0;top:0;overflow:visible"><g class="rot"><path d="M497 640 L498 500 L500 120 L502 500 L503 640 Z" fill="url(#gAccV)"/><circle cx="500" cy="610" r="14" fill="url(#gAccV)"/></g></svg>`);
    S.cap = layer(112, {}, `<svg width="1000" height="1000" viewBox="0 0 1000 1000" style="position:absolute;left:0;top:0"><circle cx="500" cy="500" r="30" fill="url(#gCap)"/><circle cx="500" cy="500" r="9" fill="#2a1200"/></svg>`);
    S.glass = layer(124, disc(2 * R - 64, { background: 'linear-gradient(150deg, rgba(255,255,255,.7) 0%, rgba(255,255,255,.12) 34%, rgba(255,255,255,0) 52%)' }));
    S.layers.push(S.hand, S.sec, S.cap, S.glass);
    S.rotH = [S.hShadow, S.hand].map(l => l.querySelector('.rot')); S.rotS = S.sec.querySelector('.rot');
    S.l1 = textLine(c, 1430, [{ t: 'Every second' }], HEAD).chars;
    S.g = glow(c, 540, 1560, 640, 300, -10);
    S.l2 = textLine(c, 1490, [{ t: 'confused', cls: 'serif', tone: 'acc' }], { fontSize: '136px' }).chars;
    S.cap2 = textLine(c, 1670, [{ t: 'every second a client spends confused about\nwhat you do is a second you’re losing them.', tone: 'gray' }], { fontSize: '27px', fontWeight: 500, lineHeight: 1.35, letterSpacing: '-0.01em' }).chars;
  },
  update(lt) {
    const S = this, D2 = S.end - S.start;
    const p = E(lt, -.35, 1.0), q = E(lt, 1.0, D2 + .4);
    TT(S.dw, { rx: lerp(60, 26, p) - 6 * q, ry: lerp(-75, -34, p) + 12 * q, r: lerp(-25, -4, p), s: lerp(.5, .96, p), z: lerp(-500, 0, p) });
    const o = E(lt, -.35, .2);
    S.layers.forEach(l => l.style.opacity = o);
    S.hShadow.style.opacity = .3 * o;
    dash(S.arc, .42 * E(lt, .25, 1.5)); dash(S.arcG, .42 * E(lt, .25, 1.5));
    const ah = -70 + 52 * E(lt, -.2, D2), as = -150 + 360 * P(lt, -.2, D2 + .4);
    S.rotH.forEach(g => g.setAttribute('transform', `rotate(${ah} 500 500)`));
    S.rotS.setAttribute('transform', `rotate(${as} 500 500)`);
    typeIn(S.l1, lt, .15, .03);
    typeIn(S.l2, lt, TL.cue.s2_conf - .2, .045);
    S.g.style.opacity = E(lt, TL.cue.s2_conf, TL.cue.s2_conf + .6);
    typeIn(S.cap2, lt, TL.cue.s2_conf - .1, .004, .3);
  },
});

/* =====================================================================
   SCENE 3 — CROWD  "about what you do,"
   ===================================================================== */
function personSVG(grad, w) {
  return `<svg width="${w}" height="${w * 1.2}" viewBox="0 0 100 120" style="overflow:visible"><circle cx="50" cy="28" r="23" fill="url(#${grad})"/>` +
    `<path d="M6 120 C6 80 26 60 50 60 C74 60 94 80 94 120 Z" fill="url(#${grad})"/></svg>`;
}
const cornerPaths = (x0, y0, x1, y1, L) => [`M${x0} ${y0 + L}V${y0}H${x0 + L}`, `M${x1 - L} ${y0}H${x1}V${y0 + L}`, `M${x1} ${y1 - L}V${y1}H${x1 - L}`, `M${x0 + L} ${y1}H${x0}V${y1 - L}`];
addScene({
  build(c, S) {
    const s = svgFull(fullLayer(c, -40));
    S.vf = cornerPaths(110, 330, 970, 1400, 170).map(d => sv('path', s, { d, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }));
    S.h1 = textLine(c, 545, [{ t: 'They can’t see' }], Object.assign({}, HEAD, { fontSize: '78px' })).chars;
    S.g = glow(c, 600, 700, 520, 260, -10);
    S.h2 = textLine(c, 630, [{ t: 'what you do.', cls: 'serif', tone: 'acc' }], { fontSize: '104px', left: '60px' }).chars;
    const P5 = [[245, .62, 0], [385, .86, 45], [540, 1.12, 95], [695, .86, 45], [835, .62, 0]];
    S.ppl = P5.map(([x, k, z], i) => {
      const d = at(el('div', c, 'ctr', { filter: 'drop-shadow(0 18px 18px rgba(80,30,0,.18))' }, personSVG(i === 2 ? 'gDarkV' : 'gAccV', 120 * k)), x, 965 + (1 - k) * 40);
      d._z = z; return d;
    });
    S.focW = at(el('div', c, 'ctr'), 540, 958);
    const fs = sv('svg', S.focW, { width: 200, height: 210, viewBox: '0 0 200 210', style: 'overflow:visible' });
    S.foc = cornerPaths(3, 3, 197, 207, 30).map(d => sv('path', fs, { d, fill: 'none', stroke: 'url(#gDark)', 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1 }));
    S.cap = textLine(c, 1170, [{ t: 'Your ideal client spends seconds\ndeciding if you’re worth their attention.', tone: 'gray' }], { fontSize: '30px', fontWeight: 500, lineHeight: 1.32, letterSpacing: '-0.015em' }).chars;
  },
  update(lt) {
    const S = this;
    S.vf.forEach((v, i) => dash(v, E(lt, -.2 + i * .06, .5 + i * .06)));
    typeIn(S.h1, lt, .0, .026);
    typeIn(S.h2, lt, .3, .03);
    S.g.style.opacity = E(lt, .4, .9);
    S.ppl.forEach((e, i) => {
      const a = -.25 + Math.abs(i - 2) * .12, p = E(lt, a, a + .6);
      T(e, { y: 70 * (1 - p), z: e._z * p - 120 * (1 - p), s: .85 + .15 * p, o: p });
    });
    const f = E(lt, .35, .85);
    T(S.focW, { s: 1.3 - .3 * f, o: f, z: 110 });
    S.foc.forEach(p => dash(p, f));
    typeIn(S.cap, lt, .55, .008, .3);
  },
});

/* =====================================================================
   SCENE 4 — PROBLEM  "is a second you're losing them."
   ===================================================================== */
const STARS = n => `<div style="margin-top:10px;font-size:20px;letter-spacing:3px"><span class="tg-acc" style="filter:drop-shadow(0 0 6px rgba(255,130,28,.5))">${'★'.repeat(n)}</span><span style="color:#E2E2E2">${'★'.repeat(5 - n)}</span><span style="color:#9a9a9a;font-size:15px;letter-spacing:0;margin-left:8px">${n}.0</span></div>`;
const AVATAR = g => `<div style="width:48px;height:48px;flex:none;border-radius:50%;background:${g};display:flex;align-items:flex-end;justify-content:center;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.4)">
  <svg width="40" height="40" viewBox="0 0 100 100"><circle cx="50" cy="38" r="20" fill="rgba(255,255,255,.92)"/><path d="M14 104 C14 72 32 62 50 62 C68 62 86 72 86 104 Z" fill="rgba(255,255,255,.92)"/></svg></div>`;
const review = (g, role, q, n) => `<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">${AVATAR(g)}
  <div><div class="tg-dark" style="font-size:18px;font-weight:600">${role}</div><div style="font-size:14px;color:#9A9A9A">Verified client</div></div></div>
  <div style="color:#3a3a3a">“${q}”</div>${STARS(n)}`;
const CARDS = [
  review('linear-gradient(135deg,#FFB862,#E65000)', 'Founder', 'Loved the visuals, but I’m still not completely sure what they actually do.', 3),
  review('linear-gradient(135deg,#5a5a5a,#000)', 'SaaS CEO', 'Had to read the whole page twice to understand the offer.', 2),
  review('linear-gradient(135deg,#FFC98F,#FF821C)', 'Head of Growth', 'Interested, but confused about how it works and what the next step is.', 3),
];
addScene({
  build(c, S) {
    const s = svgFull(fullLayer(c, -90));
    S.q = [400, 540, 680].map(x => { const t = sv('text', s, { x, y: 1070, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 600, 'font-size': 310, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 4 }); t.textContent = '?'; return t; });
    S.g = glow(c, 640, 960, 420, 240, -10);
    S.h = textLine(c, 922, [{ t: 'Is a second you’re ' }, { t: 'losing', tone: 'acc' }, { t: ' them.' }], HEAD).chars;
    S.cards = [[290, 560, -4, 14, 130], [810, 690, 3, -16, 170], [380, 1350, 2, 12, 110]].map(([x, y, r, ry, z], i) => {
      const e = at(el('div', c, 'card', {}, CARDS[i]), x, y); Object.assign(e, { _r: r, _ry: ry, _z: z }); return e;
    });
  },
  update(lt) {
    const S = this;
    S.q.forEach((t, i) => { const p = E(lt, -.2 + i * .1, .5 + i * .1); t.setAttribute('opacity', .4 * p); t.setAttribute('transform', `translate(0 ${40 * (1 - p) + 6 * Math.sin(lt * 2.4 + i)})`); });
    typeIn(S.h, lt, .0, .02);
    S.g.style.opacity = E(lt, .5, 1.0);
    S.cards.forEach((e, i) => {
      const a = .05 + i * .22, p = E(lt, a, a + .75);
      T(e, { r: e._r, ry: e._ry + 50 * (1 - p), rx: 20 * (1 - p), z: e._z * p - 420 * (1 - p), y: 60 * (1 - p) - 8 * Math.sin(lt * 1.8 + i), o: p });
    });
  },
});

/* =====================================================================
   SCENE 5 — COUNTER  "Sixteen competitors. One scroll away."
   ===================================================================== */
addScene({
  build(c, S) {
    const hold = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', perspective: '1700px', perspectiveOrigin: '540px 900px' });
    S.rw = at(el('div', hold, 'abs p3', { width: '600px', height: '600px', transformOrigin: '300px 300px' }), 240, 600);
    const lay = (z, html, style = {}) => { const d = el('div', S.rw, 'abs', Object.assign({ left: 0, top: 0, width: '600px', height: '600px' }, style), html); d.style.transform = `translateZ(${z}px)`; return d; };
    S.sh = lay(-60, '', { borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,110,0,.30), rgba(255,110,0,0))', filter: 'blur(20px)' });
    const ring = (stroke, w, extra = '') => `<svg width="600" height="600" viewBox="0 0 600 600" style="position:absolute;left:0;top:0;overflow:visible"><circle cx="300" cy="300" r="200" fill="none" stroke="${stroke}" stroke-width="${w}" ${extra}/></svg>`;
    S.track = lay(0, ring('url(#gTrack)', 34));
    S.trackIn = lay(2, ring('rgba(255,255,255,.7)', 2, 'transform="translate(0 -1)"'));
    S.arcGl = lay(14, ring('#FF821C', 54, 'pathLength="1" transform="rotate(-90 300 300)" style="filter:blur(14px)" opacity=".45"'));
    S.arcL = lay(20, ring('url(#gAcc)', 34, 'pathLength="1" stroke-linecap="round" transform="rotate(-90 300 300)"'));
    S.num = at(el('div', S.rw, 'ctr tg-dark', { fontSize: '156px', fontWeight: 600, letterSpacing: '-5px', fontVariantNumeric: 'tabular-nums', filter: GLOW.dark }), 300, 305);
    S.num.style.transform = 'translate(-50%,-50%) translateZ(50px)';
    S.arcs = [S.arcGl, S.arcL].map(l => l.querySelector('circle'));
    S.lab = textLine(c, 1250, [{ t: 'competitors, one ' }, { t: 'scroll', tone: 'acc' }, { t: ' away' }], HEAD).chars;
  },
  update(lt) {
    const S = this;
    const m = E(lt, -.3, .9);
    TT(S.rw, { x: -300 * (1 - m), y: 560 * (1 - m), s: .45 + .55 * m, rx: 62 * (1 - m) + 8 * Math.sin(lt * .8), ry: -30 * (1 - m) + 10 * Math.sin(lt * .6 + 1), z: -200 * (1 - m) });
    [S.sh, S.track, S.trackIn, S.arcGl, S.arcL, S.num].forEach(l => l.style.opacity = E(lt, -.3, .2));
    const cnt = E(lt, .05, 1.0);
    S.num.textContent = Math.round(5 + 11 * cnt);
    S.arcs.forEach(a => dash(a, .12 + .6 * cnt));
    typeIn(S.lab, lt, .55, .02);
  },
});

/* =====================================================================
   SCENE 6 — PAIN ×3  hexagons: outline draws → gradient fill → icon draws → callout → label
   ===================================================================== */
const ICONS = {
  trust: ['M60 6 L102 23 V58 C102 87 83 104 60 114 C37 104 18 87 18 58 V23 Z', 'M60 20 L90 32 V58 C90 79 77 92 60 100 C43 92 30 79 30 58 V32 Z', 'M65 30 L54 53 L69 63 L56 90', 'M100 94 l9 7 M93 107 l5 10'],
  leads: ['M60 14 A46 46 0 1 1 59.9 14', 'M60 27 A33 33 0 1 1 59.9 27', 'M60 2 V16 M60 104 V118 M2 60 H16 M104 60 H118', 'M52 50 a8 8 0 1 1 16 0 a8 8 0 1 1 -16 0 M42 80 a18 14 0 0 1 36 0', 'M98 98 a13 13 0 1 1 0.1 0 M92 98 H104'],
  deals: ['M42 46 C24 60 24 94 46 100 H72 C94 94 94 60 76 46 Z', 'M44 46 H74 M48 46 L42 30 H76 L70 46', 'M60 58 V92 M68 65 C66 60 52 60 52 67 C52 75 68 72 68 80 C68 87 54 87 52 82', 'M92 120 V102 M104 120 V108 M116 120 V114', 'M88 82 L112 100 M112 100 H102 M112 100 V90'],
};
function hexSVG(i, icon) {
  const poly = r => { const p = []; for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); } return p.join(' '); };
  return `<svg width="320" height="330" viewBox="-160 -160 320 330" style="overflow:visible">
   <defs><clipPath id="hc${i}"><circle class="clip" cx="0" cy="0" r="0"/></clipPath></defs>
   <polygon class="ext" points="${poly(130)}" transform="translate(0 16)" fill="url(#gDark)" stroke="url(#gDark)" stroke-width="14" stroke-linejoin="round" opacity="0"/>
   <g clip-path="url(#hc${i})"><polygon points="${poly(130)}" fill="url(#gAcc)" stroke="url(#gAcc)" stroke-width="14" stroke-linejoin="round"/>
     <polygon points="${poly(112)}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/></g>
   <polygon class="out" points="${poly(130)}" fill="none" stroke="url(#gAcc)" stroke-width="7" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 1"/>
   <g transform="translate(-60 -60)" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(255,255,255,.6))">
     ${icon.map(d => `<path class="ic" d="${d}" pathLength="1" stroke-dasharray="0 1"/>`).join('')}</g></svg>`;
}
addScene({
  build(c, S) {
    const hx = [[418, 880, 'trust', 40], [662, 880, 'leads', 40], [540, 1091, 'deals', 80]];
    S.hex = hx.map(([x, y, k, z], i) => {
      const g = glow(c, x, y + 10, 460, 460, z - 30);
      const d = at(el('div', c, 'ctr', { filter: 'drop-shadow(0 24px 22px rgba(120,40,0,.22))' }, hexSVG(i, ICONS[k])), x, y);
      return { d, g, z, clip: d.querySelector('.clip'), ext: d.querySelector('.ext'), out: d.querySelector('.out'), ic: [...d.querySelectorAll('.ic')] };
    });
    const s = svgFull(fullLayer(c, 10));
    S.lines = ['M418 732 L418 690 L345 622', 'M662 732 L662 690 L735 622', 'M540 1245 L540 1288 L613 1356']
      .map(d => sv('path', s, { d, fill: 'none', stroke: 'url(#gDark)', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '0 1' }));
    S.dots = [[345, 622], [735, 622], [613, 1356]].map(([x, y]) => sv('circle', s, { cx: x, cy: y, r: 7, fill: 'url(#gAcc)', opacity: 0 }));
    const lab = (w, st) => textLine(c, 0, [{ t: 'Losing ' }, { t: w, cls: 'serif', tone: 'acc', style: { fontSize: '62px' } }], Object.assign({ fontSize: '42px', fontWeight: 500, letterSpacing: '-0.02em', width: 'auto' }, st)).chars;
    S.labels = [lab('trust', { left: 'auto', right: px(1080 - 330), top: '545px' }), lab('leads', { left: '750px', top: '545px' }), lab('deals', { left: '628px', top: '1330px' })];
  },
  update(lt) {
    const S = this;
    TL.cue.s6_hex.forEach((a, i) => {
      const H = S.hex[i];
      const o = E(lt, a, a + .45), f = E(lt, a + .3, a + .75);
      dash(H.out, o);
      H.clip.setAttribute('r', (175 * f).toFixed(1));
      H.ext.setAttribute('opacity', E(lt, a + .45, a + .8));
      H.ic.forEach((p, j) => dash(p, E(lt, a + .55 + j * .06, a + .95 + j * .06)));
      T(H.d, { z: H.z, s: .9 + .1 * o, o: o > 0 ? 1 : 0, ry: 18 * (1 - f), rx: -10 * (1 - f) });
      H.g.style.opacity = .9 * f;
      dash(S.lines[i], E(lt, a + .8, a + 1.1));
      S.dots[i].setAttribute('opacity', E(lt, a + 1.0, a + 1.15));
      typeIn(S.labels[i], lt, a + .95, .03);
    });
  },
});

/* =====================================================================
   SCENE 7 — WORD BEATS  "The · best · brands"
   ===================================================================== */
addScene({
  build(c, S) {
    S.words = ['The', 'best', 'brands'].map(w => {
      const g = glow(c, 540, 960, 560, 560, -20);
      const e = at(el('div', c, 'ctr sans tg-acc', { fontSize: '98px', fontWeight: 500, letterSpacing: '-0.035em', whiteSpace: 'nowrap' }), 540, 960);
      e.textContent = w; return { e, g };
    });
  },
  update(lt) {
    const S = this, A = [...TL.cue.s7_words, 99];
    S.words.forEach(({ e, g }, i) => {
      const a = A[i] - .12, q = E(lt, a, a + .4), x = E(lt, A[i + 1] - .3, A[i + 1] + .02);
      const vis = q > 0 && x < 1, b = 9 * (1 - q) + 6 * x;
      T(e, { s: (1.14 - .14 * q) * (1 - .12 * x) * (1 + .04 * P(lt, a, a + 1.2)), z: 60 * x, o: vis ? q * (1 - x) : 0 });
      e.style.filter = (b > .15 ? `blur(${b.toFixed(2)}px) ` : '') + GLOW.acc;
      g.style.opacity = vis ? q * (1 - x) : 0;
    });
  },
});

/* =====================================================================
   SCENE 8 — CONTRAST  "don't say more."
   ===================================================================== */
addScene({
  build(c, S) { S.chars = textLine(c, 900, [{ t: 'don’t say more.', cls: 'serif' }], { fontSize: '134px' }).chars; },
  update(lt) { typeIn(this.chars, lt, -.05, .035, .5); },
});

/* =====================================================================
   SCENE 9 — BENEFITS  gradient pill cloud
   ===================================================================== */
addScene({
  build(c, S) {
    S.rings = [[540, 90, 840, -260], [570, 1860, 860, -260], [70, 1240, 560, -180]].map(([x, y, d, z]) => {
      const e = at(el('div', c, 'ctr', { width: px(d), height: px(d), borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,130,28,0) 46%, rgba(255,150,60,.18) 57%, rgba(255,110,10,.10) 62%, rgba(255,130,28,0) 72%)' }), x, y);
      e._z = z; return e;
    });
    const rows = [[['They’re focused.', 'f', 0], ['Sharper', 'o', 1]], [['Strategic', 'o', 2], ['They simplify the message', 'f', 3]], [['They build trust instantly', 'f', 4]], [['They make choosing easy', 'o', 5]]];
    S.pills = [];
    rows.forEach((r, ri) => {
      const row = el('div', c, 'abs p3', { left: '0', width: '1080px', top: px(780 + ri * 120), display: 'flex', justifyContent: 'center', gap: '18px', paddingLeft: ri === 3 ? '170px' : '0', boxSizing: 'border-box' });
      r.forEach(([t, k, idx], j) => {
        const e = el('div', row, 'pill ' + k);
        el('span', e, k === 'f' ? 'tg-white gl-white grp' : 'tg-dark grp', {}, t);
        S.pills.push({ e, a: TL.cue.s9_pills[idx] - S.start, side: (ri + j) % 2 ? -1 : 1 });
      });
    });
  },
  update(lt) {
    const S = this;
    S.rings.forEach((e, i) => { const q = E(lt, -.5, .9); T(e, { s: (1.6 - .6 * q) * (1 + .05 * Math.sin(lt * .5 + i)), x: 40 * Math.sin(lt * .35 + i * 2), y: 30 * Math.cos(lt * .3 + i), z: e._z, o: q }); });
    S.pills.forEach(({ e, a, side }) => {
      const q = E(lt, a - .12, a + .45);
      e.style.transform = `translate3d(${side * 700 * (1 - q)}px,0,${-200 * (1 - q)}px) rotateY(${side * -35 * (1 - q)}deg)`;
      e.style.opacity = q;
      const b = 10 * (1 - q);
      e.style.filter = b > .15 ? `blur(${b.toFixed(2)}px)` : '';
    });
  },
});

/* =====================================================================
   SCENE 10 — PUNCHLINE  "Design isn't decoration. — It's strategy."
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
  build(c, S) {
    S.setW = fullLayer(c, 0);
    const sl = textLine(S.setW, 925, [{ t: 'Design isn’t decoration —' }], { fontSize: '54px', fontWeight: 500, letterSpacing: '-0.03em' });
    S.set = sl.chars; S.setG = sl.groups[0];
    S.punW = fullLayer(c, 40, 'abs p3');
    S.g = glow(S.punW, 540, 962, 1000, 600, -20);
    const pl = textLine(S.punW, 896, [{ t: 'It’s strategy.', whole: true }], { fontSize: '110px', fontWeight: 600, letterSpacing: '-0.045em' });
    S.punG = pl.groups[0];
    const s = svgFull(el('div', S.punW, 'abs', { left: 0, top: 0 }));
    S.ovalG = sv('path', s, { d: ovalPath(540, 962, 400, 112, -2), fill: 'none', stroke: '#FF821C', 'stroke-width': 18, opacity: .35, pathLength: 1, style: 'filter:blur(8px)' });
    S.oval = sv('path', s, { d: ovalPath(540, 962, 400, 112, -2), fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 });
  },
  measure(S) { const a = rel(S.setG, S.panel), b = rel(S.punG, S.panel); S.shift = (540 - b.w / 2 - 34 - a.w / 2) - 540; },
  update(lt) {
    const S = this, p0 = TL.cue.s10_punch, [s0, per] = TL.cue.s10_set;
    typeIn(S.set, lt, s0, per);
    const pan = CE(P(lt, p0 - .25, p0 + .45));
    TT(S.setW, { x: S.shift * pan, o: 1 - .62 * pan });
    const q = E(lt, p0 - .15, p0 + .45);
    TT(S.punW, { x: 760 * (1 - q), z: 40 - 200 * (1 - q), ry: -25 * (1 - q), o: q });
    const b = 10 * (1 - q); S.punG.style.filter = (b > .15 ? `blur(${b.toFixed(2)}px) ` : '') + GLOW.dark;
    S.g.style.opacity = E(lt, p0 + .2, p0 + .8);
    dash(S.oval, E(lt, p0 + .4, p0 + 1.05)); dash(S.ovalG, E(lt, p0 + .4, p0 + 1.05));
  },
});

/* =====================================================================
   SCENE 11 — OUTRO  logo · CTA · handle scramble
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
<g mask="url(#reveal)"><rect x="-100" y="-100" width="1100" height="760" fill="url(#gAcc)" mask="url(#cres)"/></g>
<text x="450" y="378" text-anchor="middle" font-family="Inter" font-weight="800" font-size="290" letter-spacing="-10"
 fill="url(#gDarkV)" stroke="#FFFFFF" stroke-width="26" paint-order="stroke" stroke-linejoin="round">ISP</text>
</svg>`;
addScene({
  build(c, S) {
    S.g = glow(c, 540, 960, 900, 700, -40);
    S.cta = textLine(c, 700, [{ t: 'Let’s build ' }, { t: 'yours.', cls: 'serif', tone: 'acc', style: { fontSize: '78px' } }], { fontSize: '50px', fontWeight: 500, letterSpacing: '-0.03em' }).chars;
    S.logo = at(el('div', c, 'ctr', { filter: 'drop-shadow(0 18px 24px rgba(120,40,0,.18)) drop-shadow(0 0 30px rgba(255,130,28,.25))' }, LOGO), 540, 945);
    S.handle = at(el('div', c, 'ctr tg-dark', { fontSize: '34px', fontWeight: 500, whiteSpace: 'pre', filter: GLOW.dark }), 540, 1100);
  },
  update(lt) {
    const S = this;
    const p = E(lt, -.2, .55);
    T(S.logo, { s: .4 * (.75 + .25 * p), o: p, z: -150 * (1 - p), ry: -30 * (1 - p) });
    S.g.style.opacity = .8 * E(lt, 0, .8);
    if (!S.rp) S.rp = document.getElementById('revealPath');
    dash(S.rp, E(lt, .05, .85));
    typeIn(S.cta, lt, TL.cue.s11_cta, .035);
    const target = '@isp_agency_', pool = 'abcdefghijklmnopqrstuvwxyz0123456789#$%&?_';
    const sp = P(lt, .35, 1.1), f = Math.floor(lt * FPS);
    let out = '';
    for (let i = 0; i < target.length; i++) out += (i + 1) / target.length <= sp ? target[i] : pool[Math.floor(hash(f * 31 + i * 7) * pool.length)];
    S.handle.textContent = out;
    S.handle.style.opacity = E(lt, .3, .55);
  },
});

/* =====================================================================
   RENDER
   ===================================================================== */
function renderAt(t) {
  const c = camPose(t);
  $('#world').style.transform = `translateZ(${c.z.toFixed(2)}px) rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg) rotateZ(${c.rz.toFixed(3)}deg) translate3d(${(-c.f[0]).toFixed(2)}px,${(-c.f[1]).toFixed(2)}px,0)`;
  for (const s of scenes) {
    const vis = t >= s.start - 1.3 && t < s.end + 1.3;
    s.panel.style.visibility = vis ? 'visible' : 'hidden';
    if (vis) s.update(t - s.start, t);
  }
  updateThreads(t);
  $('#fade').style.opacity = E(t, DUR - .5, DUR - .03);
}
window.renderAt = renderAt;

(async function init() {
  buildThreads();
  await document.fonts.ready;
  await Promise.all([...document.fonts].map(f => f.load().catch(() => {})));
  $('#world').style.transform = 'none';          // measure while the world is flat
  scenes.forEach(s => s.measure && s.measure(s));
  const render = /render/.test(location.search);
  if (render) { document.body.classList.add('render'); renderAt(0); window.READY = true; return; }
  const vp = $('#viewport'), aud = $('#aud'), scrub = $('#scrub'), tc = $('#tc'), btn = $('#play');
  scrub.max = TL.frames - 1;
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
