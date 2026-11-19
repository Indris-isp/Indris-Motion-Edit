/* ISP Agency — premium kinetic-typography promo ("Posting every day..." script)
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

/* ---------- shared pieces ---------- */
const C = TL.cue, DD = TL.d;
const CHECK = (s = 44, sw = 6) => `<svg width="${s}" height="${s}" viewBox="0 0 44 44"><path d="M10 23 L19 31 L34 13" fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
/* line icons on a 120×120 grid, drawn with pathLength=1 so they can "draw on" */
const ICON = {
  play: ['M60 14 A46 46 0 1 1 59.9 14', 'M50 40 L82 60 L50 80 Z'],
  brand: ['M60 18 a18 18 0 1 1 -0.1 0', 'M24 102 C24 76 40 64 60 64 C80 64 96 76 96 102', 'M100 12 V34 M89 23 H111'],
  growth: ['M14 106 H106', 'M28 98 V80 M52 98 V66 M76 98 V54 M100 98 V40', 'M22 66 L48 42 L64 52 L98 18', 'M98 18 H80 M98 18 V36'],
  cal: ['M18 30 H102 V102 H18 Z', 'M18 52 H102', 'M40 18 V40 M80 18 V40', 'M44 78 L56 89 L78 66'],
};
const iconSVG = (paths, s, sw = 7, stroke = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 120 120" style="overflow:visible" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${paths.map(d => `<path class="ic" d="${d}" pathLength="1"/>`).join('')}</svg>`;
const tile = (parent, paths, s, extra = {}) => { const e = el('div', parent, 'tile', Object.assign({ width: px(s), height: px(s) }, extra), iconSVG(paths, s * .56)); e._ic = [...e.querySelectorAll('.ic')]; return e; };
const blurF = b => b > .15 ? `blur(${b.toFixed(2)}px)` : '';
function personSVG(fill, w) {
  return `<svg width="${w}" height="${w * 1.2}" viewBox="0 0 100 120" style="overflow:visible"><circle cx="50" cy="28" r="23" fill="${fill}"/>` +
    `<path d="M6 120 C6 80 26 60 50 60 C74 60 94 80 94 120 Z" fill="${fill}"/></svg>`;
}
const cornerPaths = (x0, y0, x1, y1, L) => [`M${x0} ${y0 + L}V${y0}H${x0 + L}`, `M${x1 - L} ${y0}H${x1}V${y0 + L}`, `M${x1} ${y1 - L}V${y1}H${x1 - L}`, `M${x0 + L} ${y1}H${x0}V${y1 - L}`];
function ovalPath(cx, cy, rx, ry, tilt) {
  const pts = [], N = 90, a0 = -195, a1 = 185;
  for (let i = 0; i <= N; i++) {
    const p = i / N, a = (a0 + (a1 - a0) * p) * Math.PI / 180, k = 1.03 - .06 * p + .01 * Math.sin(p * 9);
    const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k, t = tilt * Math.PI / 180;
    pts.push([cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)]);
  }
  return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
}
/* the ISP mark (vector recreation); ids are suffixed so it can appear twice */
const LOGO = id => `<svg width="900" height="560" viewBox="0 0 900 560" style="overflow:visible">
<defs>
 <mask id="cres${id}" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
  <rect x="-100" y="-100" width="1100" height="760" fill="#000"/>
  <ellipse cx="450" cy="280" rx="405" ry="190" fill="#fff" transform="rotate(-14 450 280)"/>
  <ellipse cx="478" cy="258" rx="378" ry="158" fill="#000" transform="rotate(-14 450 280)"/>
 </mask>
 <mask id="reveal${id}" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1100" height="760">
  <path class="rp" d="M760.2 157.9 A405 190 0 1 1 755.7 155.3" fill="none" stroke="#fff" stroke-width="150" pathLength="1" stroke-dasharray="0 1" transform="rotate(-14 450 280)"/>
 </mask>
</defs>
<g mask="url(#reveal${id})"><rect x="-100" y="-100" width="1100" height="760" fill="url(#gAcc)" mask="url(#cres${id})"/></g>
<text x="450" y="378" text-anchor="middle" font-family="Inter" font-weight="800" font-size="290" letter-spacing="-10"
 fill="url(#gDarkV)" stroke="#FFFFFF" stroke-width="26" paint-order="stroke" stroke-linejoin="round">ISP</text>
</svg>`;
/* orange outline rings that draw on and drift in from the corners */
function rings(c, list) {
  return list.map(([x, y, r, dx, dy]) => {
    const d = at(el('div', c, 'ctr'), x, y);
    const s = sv('svg', d, { width: 2 * r + 10, height: 2 * r + 10, viewBox: `${-r - 5} ${-r - 5} ${2 * r + 10} ${2 * r + 10}` });
    d._c = sv('circle', s, { r, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 3, pathLength: 1 });
    d._d = [dx, dy]; return d;
  });
}
function updRings(R, lt, t0 = .1) {
  R.forEach((d, i) => {
    const r = E(lt, t0 + i * .08, t0 + 1.2 + i * .08);
    T(d, { x: d._d[0] * 380 * (1 - r) + 14 * Math.sin(lt * 1.1 + i), y: d._d[1] * 380 * (1 - r) + 14 * Math.cos(lt * .9 + i), z: -160, o: .75 });
    dash(d._c, r);
  });
}

/* =====================================================================
   SCENE 1 — CALENDAR  "Posting every day..."
   ===================================================================== */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 760, 1000, 900, -60);
    S.card = at(el('div', c, 'ctr cal'), 540, 750);
    const head = el('div', S.card, 'abs', { left: '48px', top: '38px', right: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
    el('div', head, 'tg-dark', { fontSize: '38px', fontWeight: 600, letterSpacing: '-0.02em' }, 'Content calendar');
    S.cnt = el('div', head, 'tg-acc', { fontSize: '32px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' });
    const grid = el('div', S.card, 'abs', { left: '48px', top: '118px', display: 'grid', gridTemplateColumns: 'repeat(7, 84px)', columnGap: '14px', rowGap: '14px' });
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(d => el('div', grid, '', { textAlign: 'center', fontSize: '22px', fontWeight: 600, color: '#A8A8A8', height: '26px' }, d));
    S.cells = [];
    for (let i = 0; i < 28; i++) { const cell = el('div', grid, 'cell'); el('span', cell, 'num', {}, String(i + 1)); S.cells.push(el('div', cell, 'ck', {}, CHECK())); }
    const l = textLine(c, 1190, [{ t: 'Posting ' }, { t: 'every day', cls: 'serif', tone: 'acc', style: { fontSize: '112px' } }, { t: '...', tone: 'gray' }], HEAD);
    S.txt = l.chars.slice(0, -3); S.dots = l.chars.slice(-3);
  },
  update(lt) {
    const S = this, m = E(lt, -.1, 1.1);
    T(S.card, { rx: lerp(40, 9, m) + 1.5 * Math.sin(lt * 1.3), ry: lerp(-22, -5, m), z: lerp(-420, 0, m), s: lerp(.85, 1, m), o: E(lt, -.1, .25) });
    let n = 0;
    S.cells.forEach((ck, i) => {
      const a = .15 + i * .03, p = E(lt, a, a + .22);
      if (p > .5) n++;
      ck.style.opacity = p; ck.style.transform = `scale(${(.4 + .6 * p).toFixed(3)})`;
    });
    S.cnt.textContent = n + (n === 1 ? ' post' : ' posts');
    S.g.style.opacity = .8 * E(lt, .2, 1.0);
    typeIn(S.txt, lt, C.hook1 - .05, .03);
    typeIn(S.dots, lt, C.hook1 + DD.hook1 * .7, .1, .3);
  },
});

/* =====================================================================
   SCENE 2 — PHONE  "and still nobody's watching?"
   ===================================================================== */
const EYE = `<svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#9A9A9A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible">
  <path d="M3 24 C10 12 17 8 24 8 C31 8 38 12 45 24 C38 36 31 40 24 40 C17 40 10 36 3 24 Z"/><circle cx="24" cy="24" r="7"/>
  <path class="slash" d="M6 42 L42 6" stroke="#FF821C" stroke-width="5" pathLength="1" stroke-dasharray="0 1"/></svg>`;
const HEART = `<svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="#9A9A9A" stroke-width="4" stroke-linejoin="round"><path d="M24 42 C10 32 4 25 4 16 C4 9 9 5 15 5 C19 5 22 7 24 11 C26 7 29 5 33 5 C39 5 44 9 44 16 C44 25 38 32 24 42 Z"/></svg>`;
addScene({
  build(c, S) {
    const hold = el('div', c, 'abs', { left: 0, top: 0, width: '1080px', height: '1920px', perspective: '1800px', perspectiveOrigin: '540px 760px' });
    S.ph = at(el('div', hold, 'abs p3', { width: '480px', height: '960px', transformOrigin: '240px 480px' }), 300, 250);
    const lay = (z, style, html = '') => { const d = el('div', S.ph, 'abs', Object.assign({ left: 0, top: 0, width: '480px', height: '960px', borderRadius: '74px' }, style), html); d.style.transform = `translateZ(${z}px)`; return d; };
    S.layers = [];
    S.layers.push(lay(-70, { left: '-140px', top: '-60px', width: '760px', height: '1080px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,120,20,.34), rgba(255,140,40,.12) 55%, rgba(255,130,28,0))', filter: 'blur(26px)' }));
    for (let k = 0; k < 10; k++) S.layers.push(lay(k * 2.4, { background: `linear-gradient(${96 + k * 4}deg, #0b0b0b, #727272 14%, #141414 30%, #bdbdbd 48%, #1a1a1a 62%, #050505 80%, #5a5a5a 100%)` }));
    S.layers.push(lay(24, { background: 'linear-gradient(150deg,#3a3a3a,#060606 35%,#1e1e1e 70%,#000)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.4), inset 0 0 0 3px #111' }));
    S.screen = lay(25, { left: '18px', top: '18px', width: '444px', height: '924px', borderRadius: '58px', background: 'linear-gradient(180deg,#FFFFFF,#F3F2F0)', overflow: 'hidden' }, `
      <div class="abs" style="left:162px;top:16px;width:120px;height:34px;border-radius:20px;background:#0a0a0a"></div>
      <div class="abs" style="left:28px;top:84px;display:flex;gap:16px;align-items:center">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#FFB862,#E65000)"></div>
        <div><div style="width:150px;height:16px;border-radius:8px;background:#DCDAD7"></div><div style="margin-top:10px;width:96px;height:12px;border-radius:6px;background:#E8E6E3"></div></div></div>
      <div class="abs" style="left:24px;top:170px;width:396px;height:520px;border-radius:30px;background:linear-gradient(165deg,#DEDCD8,#BAB6B1);overflow:hidden">
        <div class="abs" style="left:118px;top:150px;opacity:.55">${personSVG('#9C9893', 160)}</div>
        <div class="ctr" style="left:198px;top:260px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center">
          <svg width="44" height="44" viewBox="0 0 44 44"><path d="M14 8 L36 22 L14 36 Z" fill="#fff"/></svg></div></div>
      <div class="abs" style="left:30px;top:716px;display:flex;gap:44px;align-items:center;font-weight:600">
        <div style="display:flex;gap:12px;align-items:center">${EYE}<span class="vnum tg-dark" style="font-size:52px;display:inline-block">0</span><span style="font-size:28px;color:#9A9A9A">views</span></div>
        <div style="display:flex;gap:10px;align-items:center">${HEART}<span class="tg-dark" style="font-size:40px">0</span></div></div>
      <div class="abs" style="left:30px;top:810px;width:330px;height:16px;border-radius:8px;background:#E4E2DF"></div>
      <div class="abs" style="left:30px;top:842px;width:230px;height:16px;border-radius:8px;background:#ECEAE7"></div>`);
    S.layers.push(S.screen);
    S.layers.push(lay(27, { background: 'linear-gradient(140deg, rgba(255,255,255,.5) 0%, rgba(255,255,255,.1) 26%, rgba(255,255,255,0) 40%)' }));
    S.slash = S.screen.querySelector('.slash'); S.vnum = S.screen.querySelector('.vnum');
    S.l1 = textLine(c, 1300, [{ t: 'and still' }], HEAD).chars;
    S.g = glow(c, 430, 1460, 620, 280, -10);
    S.l2 = textLine(c, 1372, [{ t: 'nobody’s ', cls: 'serif', tone: 'acc', style: { fontSize: '124px' } }, { t: 'watching?' }], HEAD).chars;
  },
  update(lt) {
    const S = this, m = E(lt, -.45, 1.0);
    TT(S.ph, { rx: lerp(34, 8, m) + 2 * Math.sin(lt * .9), ry: lerp(-46, -14, m) + 4 * Math.sin(lt * .7), r: lerp(-14, -3, m), s: lerp(.5, .74, m), z: lerp(-320, 0, m) });
    const o = E(lt, -.45, .05);
    S.layers.forEach(l => l.style.opacity = o);
    const n0 = C.hook2 + DD.hook2 * .28;          // "nobody's"
    dash(S.slash, E(lt, n0, n0 + .35));
    const sh = P(lt, n0, n0 + .5);
    S.vnum.style.transform = `translateX(${(9 * Math.sin(sh * 40) * (1 - sh) * (sh > 0)).toFixed(2)}px)`;
    typeIn(S.l1, lt, C.hook2 - .05, .03);
    typeIn(S.l2, lt, n0 - .1, .035);
    S.g.style.opacity = E(lt, n0, n0 + .6);
  },
});

/* =====================================================================
   SCENE 3 — PAIN ×3  hexagons: outline draws → gradient fill → icon draws → label
   ===================================================================== */
const PICON = {
  footage: ['M16 52 H104 V106 H16 Z', 'M16 52 L12 30 L98 14 L102 36', 'M34 26 L44 46 M58 22 L68 42 M82 18 L92 38', 'M30 84 L46 72 L58 88 L74 74 L90 84'],
  brand: ['M60 18 a17 17 0 1 1 -0.1 0', 'M26 100 C26 74 42 62 60 62 C78 62 94 74 94 100', 'M18 18 L102 102'],
  strategy: ['M58 16 A44 44 0 1 1 57.9 16', 'M58 36 A24 24 0 1 1 57.9 36', 'M58 54 a6 6 0 1 1 -0.1 0', 'M84 34 L108 10 M108 10 H94 M108 10 V24'],
};
function hexSVG(i, icon) {
  const poly = r => { const p = []; for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); } return p.join(' '); };
  return `<svg width="320" height="330" viewBox="-160 -160 320 330" style="overflow:visible">
   <defs><clipPath id="hc${i}"><circle class="clip" cx="0" cy="0" r="0"/></clipPath>
     <clipPath id="hs${i}"><polygon points="${poly(137)}"/></clipPath></defs>
   <polygon class="ext" points="${poly(130)}" transform="translate(0 18)" fill="url(#gGun)" stroke="url(#gGun)" stroke-width="14" stroke-linejoin="round" opacity="0"/>
   <g clip-path="url(#hc${i})">
     <polygon points="${poly(130)}" fill="url(#gMetalAcc)" stroke="url(#gMetalAcc)" stroke-width="14" stroke-linejoin="round"/>
     <polygon points="${poly(131)}" fill="none" stroke="url(#gBevel)" stroke-width="12" stroke-linejoin="round"/>
     <polygon points="${poly(114)}" fill="none" stroke="rgba(255,240,225,.55)" stroke-width="2"/>
     <polygon points="${poly(108)}" fill="none" stroke="rgba(120,35,0,.35)" stroke-width="2"/>
     <g clip-path="url(#hs${i})"><rect class="sheen" x="-60" y="-220" width="120" height="440" fill="url(#gSheen)" transform="rotate(25) translate(-400 0)"/></g></g>
   <polygon class="out" points="${poly(130)}" fill="none" stroke="url(#gMetalStroke)" stroke-width="8" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 1" style="filter:drop-shadow(0 0 6px rgba(255,130,28,.9))"/>
   <g transform="translate(-60 -60)" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 1px rgba(90,25,0,.55)) drop-shadow(0 0 6px rgba(255,255,255,.9)) drop-shadow(0 0 14px rgba(255,220,180,.7))">
     ${icon.map(d => `<path class="ic" d="${d}" pathLength="1" stroke-dasharray="0 1"/>`).join('')}</g></svg>`;
}
addScene({
  build(c, S) {
    const hx = [[300, 620, 'footage', 40], [300, 960, 'brand', 60], [300, 1300, 'strategy', 40]];
    S.hex = hx.map(([x, y, k, z], i) => {
      const g = glow(c, x, y + 10, 600, 600, z - 30);
      g.style.background = 'radial-gradient(closest-side, rgba(255,120,20,.40), rgba(255,140,40,.15) 50%, rgba(255,130,28,0))';
      const d = at(el('div', c, 'ctr', { padding: '110px', filter: 'drop-shadow(0 0 16px rgba(255,125,25,.55)) drop-shadow(0 0 46px rgba(255,125,25,.32)) drop-shadow(0 26px 24px rgba(110,35,0,.25))' }, hexSVG(i, PICON[k])), x, y);
      return { d, g, z, clip: d.querySelector('.clip'), ext: d.querySelector('.ext'), out: d.querySelector('.out'), sheen: d.querySelector('.sheen'), ic: [...d.querySelectorAll('.ic')] };
    });
    const lab = (a, b, y) => textLine(c, y, [{ t: a }, { t: b, cls: 'serif', tone: 'acc', style: { fontSize: '76px' } }], { fontSize: '46px', fontWeight: 500, letterSpacing: '-0.025em', width: 'auto', left: '478px', textAlign: 'left' }).chars;
    S.labels = [lab('Unedited ', 'footage.', 572), lab('No personal ', 'brand.', 912), lab('No ', 'strategy.', 1252)];
    S.keys = ['p1', 'p2', 'p3'];
  },
  update(lt) {
    const S = this;
    S.keys.forEach((key, i) => {
      const H = S.hex[i], a = C[key] - .38;
      const o = E(lt, a, a + .42), f = E(lt, a + .25, a + .7);
      dash(H.out, o);
      H.clip.setAttribute('r', (175 * f).toFixed(1));
      H.ext.setAttribute('opacity', E(lt, a + .4, a + .75));
      H.ic.forEach((p, j) => dash(p, E(lt, a + .45 + j * .06, a + .85 + j * .06)));
      T(H.d, { z: H.z, s: .9 + .1 * o, o: o > 0 ? 1 : 0, ry: 18 * (1 - f), rx: -10 * (1 - f) });
      H.g.style.opacity = f;
      H.sheen.setAttribute('transform', `rotate(25) translate(${(-400 + 800 * E(lt, a + .65, a + 1.3)).toFixed(1)} 0)`);
      typeIn(S.labels[i], lt, C[key] - .02, .028);
    });
  },
});

/* =====================================================================
   SCENE 4 — MEET  "Meet I.S.P. Agency."
   ===================================================================== */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 960, 1000, 800, -40);
    S.rings = rings(c, [[60, 300, 260, -1, -1], [1010, 1600, 240, 1, 1], [-10, 1640, 150, -1, 1], [1050, 420, 120, 1, -1]]);
    S.meet = textLine(c, 600, [{ t: 'Meet' }], { fontSize: '70px', fontWeight: 500, letterSpacing: '-0.035em' }).chars;
    S.logo = at(el('div', c, 'ctr', { filter: 'drop-shadow(0 18px 24px rgba(120,40,0,.18)) drop-shadow(0 0 30px rgba(255,130,28,.25))' }, LOGO('a')), 540, 930);
    S.rp = S.logo.querySelector('.rp');
    S.ag = textLine(c, 1130, [{ t: 'Agency.', cls: 'serif', tone: 'acc' }], { fontSize: '150px' }).chars;
    S.parts = [0, 1, 2, 3, 4, 5].map(i => { const e = el('div', c, 'ctr tg-acc', { fontSize: px(28 + hash(i) * 24) }); e.textContent = '✦'; e.style.filter = GLOW.acc; at(e, 540 + (hash(i + 3) - .5) * 700, 930 + (hash(i + 9) - .5) * 360); return e; });
  },
  update(lt) {
    const S = this, a = C.meet;
    updRings(S.rings, lt, -.1);
    typeIn(S.meet, lt, a - .05, .04);
    const p = E(lt, a + .05, a + .75);
    T(S.logo, { s: .62 * (.7 + .3 * p), o: p, z: -200 * (1 - p), ry: -32 * (1 - p), rx: 8 * Math.sin(lt * .9) });
    dash(S.rp, E(lt, a + .15, a + 1.0));
    typeIn(S.ag, lt, a + DD.meet * .45, .03, .38);
    S.g.style.opacity = .9 * E(lt, a + .2, a + .9);
    S.parts.forEach((e, i) => {
      const s0 = a + .6 + i * .08, q = P(lt, s0, s0 + .9);
      e.style.transform = `translate(-50%,-50%) translate3d(0,${(-120 * EE(q)).toFixed(1)}px,40px) scale(${(.6 + .4 * EE(q)).toFixed(3)})`;
      e.style.opacity = q <= 0 ? 0 : Math.sin(Math.PI * q);
    });
  },
});

/* =====================================================================
   SCENE 5 — SERVICES  "Video editing. Personal branding. Social media growth."
   ===================================================================== */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 960, 1000, 1000, -60);
    const items = [['01', 'Video editing', ICON.play, 's1'], ['02', 'Personal branding', ICON.brand, 's2'], ['03', 'Social media growth', ICON.growth, 's3']];
    S.cards = items.map(([n, label, ic, key], i) => {
      const e = at(el('div', c, 'ctr svc'), 540, 680 + i * 280);
      const tl = tile(e, ic, 140);
      const tx = el('div', e, '');
      el('div', tx, '', { fontSize: '24px', fontWeight: 600, letterSpacing: '.14em', color: '#A8A8A8', marginBottom: '6px' }, n);
      el('div', tx, 'tg-dark', { fontSize: '54px', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.1, paddingBottom: '4px' }, label);
      return { e, tl, key, side: i % 2 ? 1 : -1 };
    });
  },
  update(lt) {
    const S = this;
    S.g.style.opacity = .7 * E(lt, -.3, .6);
    S.cards.forEach(({ e, tl, key, side }, i) => {
      const a = C[key] - .2, q = E(lt, a, a + .55);
      T(e, { x: side * 760 * (1 - q), y: -5 * Math.sin(lt * 1.6 + i), z: -260 * (1 - q), ry: side * -38 * (1 - q), rx: 4 * Math.sin(lt * .8 + i), o: q });
      e.style.filter = blurF(10 * (1 - q));
      tl._ic.forEach((p, j) => dash(p, E(lt, a + .3 + j * .07, a + .75 + j * .07)));
    });
  },
});

/* =====================================================================
   SCENE 6 — TEAM  "All in one team."
   ===================================================================== */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 860, 900, 600, -40);
    const s = svgFull(fullLayer(c, -20));
    S.ovalG = sv('path', s, { d: ovalPath(540, 860, 350, 165, -4), fill: 'none', stroke: '#FF821C', 'stroke-width': 18, opacity: .3, pathLength: 1, style: 'filter:blur(8px)' });
    S.oval = sv('path', s, { d: ovalPath(540, 860, 350, 165, -4), fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 });
    S.tiles = [[ICON.play, 395, -520, -260], [ICON.growth, 685, 520, -260], [ICON.brand, 540, 0, 520]].map(([ic, x, fx, fy], i) => {
      const e = at(tile(c, ic, 180, { border: '8px solid #fff', position: 'absolute' }), x, 860);
      e._ic.forEach(p => p.setAttribute('stroke-dasharray', '1 0'));
      Object.assign(e, { _f: [fx, fy], _z: i === 2 ? 40 : 0 }); return e;
    });
    S.txt = textLine(c, 1110, [{ t: 'All in ' }, { t: 'one team.', cls: 'serif', tone: 'acc', style: { fontSize: '128px' } }], Object.assign({}, HEAD, { fontSize: '72px' })).chars;
  },
  update(lt) {
    const S = this;
    S.tiles.forEach((e, i) => {
      const p = E(lt, -.4 + i * .07, .45 + i * .07);
      T(e, { x: e._f[0] * (1 - p), y: e._f[1] * (1 - p) - 6 * Math.sin(lt * 2 + i), z: e._z - 300 * (1 - p), r: (i - 1) * 6 * (1 - p), s: .8 + .2 * p, o: E(lt, -.4 + i * .07, -.1 + i * .07) });
    });
    const o = E(lt, C.team + .1, C.team + .8);
    dash(S.oval, o); dash(S.ovalG, o);
    S.g.style.opacity = E(lt, .1, .7);
    typeIn(S.txt, lt, C.team - .05, .035);
  },
});

/* =====================================================================
   SCENE 7 — RAW → EDITED  "We turn your raw footage into content that actually grows you."
   ===================================================================== */
addScene({
  build(c, S) {
    const st = { fontSize: '60px', fontWeight: 500, letterSpacing: '-0.035em' };
    S.lines = [
      textLine(c, 300, [{ t: 'We turn your ' }, { t: 'raw footage', tone: 'gray' }], st).chars,
      textLine(c, 376, [{ t: 'into content that' }], st).chars,
      textLine(c, 446, [{ t: 'actually ' }, { t: 'grows you.', cls: 'serif', tone: 'acc', style: { fontSize: '120px' } }], st).chars,
    ];
    S.g = glow(c, 640, 520, 700, 300, -10);
    // video frame: raw underneath, edited version wiped over it
    S.fr = at(el('div', c, 'ctr frame'), 400, 1170);
    S.raw = el('div', S.fr, 'abs fill', { background: 'linear-gradient(160deg,#D2D0CC,#9D9A96)' }, `
      <div class="abs rawin" style="left:0;top:0;width:420px;height:680px">
        <div class="abs" style="left:110px;top:250px">${personSVG('#86827E', 200)}</div></div>
      <div class="abs chip" style="left:24px;top:24px;background:rgba(0,0,0,.35);color:#fff">RAW</div>
      <div class="abs tc" style="right:26px;bottom:24px;font-size:24px;font-weight:600;color:rgba(255,255,255,.85);font-variant-numeric:tabular-nums"></div>`);
    S.rawIn = S.raw.querySelector('.rawin'); S.tc = S.raw.querySelector('.tc');
    S.pol = el('div', S.fr, 'abs fill', { background: 'radial-gradient(circle at 50% 30%, #FFD9AE 0%, #FF9A40 42%, #D65200 80%, #8E2E00 100%)' }, `
      <div class="abs" style="left:110px;top:230px;filter:drop-shadow(0 20px 30px rgba(80,20,0,.35))">${personSVG('url(#gDarkV)', 200)}</div>
      <div class="abs chip" style="left:24px;top:24px;background:#fff"><span class="tg-acc">EDITED</span></div>
      <div class="ctr" style="left:210px;top:560px;padding:12px 22px;border-radius:16px;background:rgba(10,10,10,.78);color:#fff;font-size:30px;font-weight:700;letter-spacing:-.01em;white-space:nowrap">content that <span style="color:#FFB862">grows</span></div>
      <div class="abs" style="left:28px;right:28px;bottom:26px;height:8px;border-radius:4px;background:rgba(255,255,255,.35)"><div style="width:62%;height:100%;border-radius:4px;background:#fff"></div></div>`);
    S.edge = el('div', S.fr, 'abs', { left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg,#FFE2BC,#FF821C,#FFE2BC)', boxShadow: '0 0 18px 6px rgba(255,130,28,.7)' });
    // growth bars + arrow
    S.bars = [150, 250, 360, 500].map((h, i) => { const b = el('div', c, 'abs bar', { left: px(690 + i * 74), bottom: px(1920 - 1510), width: '54px', height: px(h) }); b._h = h; return b; });
    const s = svgFull(fullLayer(c, 30));
    const d = 'M676 1330 C760 1300 800 1240 850 1160 S940 1010 980 940';
    S.arG = sv('path', s, { d, fill: 'none', stroke: '#FF821C', 'stroke-width': 22, opacity: .35, pathLength: 1, 'stroke-linecap': 'round', style: 'filter:blur(8px)' });
    S.ar = sv('path', s, { d, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 9, pathLength: 1, 'stroke-linecap': 'round' });
    S.head = sv('path', s, { d: 'M944 936 L986 930 L984 974', fill: 'none', stroke: '#E65000', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 });
    const full = 'We turn your raw footage into content that actually grows you.';
    S.L = full.length; S.off = [0, full.indexOf('into'), full.indexOf('actually')];
    S.wipeAt = full.indexOf('into') / S.L; S.growAt = full.indexOf('grows') / S.L;
  },
  update(lt) {
    const S = this, a = C.turn, d = DD.turn * .88, per = d / S.L;
    S.lines.forEach((ch, i) => typeIn(ch, lt, a - .05 + S.off[i] * per, per, .34));
    S.g.style.opacity = E(lt, a + d * S.growAt, a + d * S.growAt + .5);
    const m = E(lt, -.4, .8);
    T(S.fr, { rx: 6 * (1 - m) + 2 * Math.sin(lt * .9), ry: lerp(34, 10, m) - 6 * E(lt, .8, 3.5), z: -300 * (1 - m), y: 80 * (1 - m), o: E(lt, -.4, 0) });
    const w0 = a + d * S.wipeAt - .1, w = E(lt, w0, w0 + .7);
    S.pol.style.clipPath = `inset(0 0 ${(100 - 100 * w).toFixed(2)}% 0)`;
    S.edge.style.top = px(680 * w - 3); S.edge.style.opacity = w > 0 && w < 1 ? 1 : 0;
    const j = 1 - w;   // handheld shake on the raw clip until it's edited
    S.rawIn.style.transform = `rotate(${(-4 + 1.2 * Math.sin(lt * 7)).toFixed(2)}deg) translate(${(6 * Math.sin(lt * 11) * j).toFixed(1)}px,${(5 * Math.cos(lt * 9) * j).toFixed(1)}px) scale(1.08)`;
    const f = Math.floor((lt + 3) * FPS); S.tc.textContent = `00:14:${String(Math.floor(f / 30) % 60).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`;
    const g0 = a + d * S.growAt - .35;
    S.bars.forEach((b, i) => { const q = E(lt, g0 + i * .08, g0 + .55 + i * .08); b.style.height = px(b._h * q); b.style.opacity = q > 0 ? 1 : 0; });
    const ap = E(lt, g0 + .2, g0 + .8);
    dash(S.ar, ap); dash(S.arG, ap); S.head.setAttribute('opacity', E(lt, g0 + .7, g0 + .85));
  },
});

/* =====================================================================
   SCENE 8 — REC  "You record."
   ===================================================================== */
addScene({
  build(c, S) {
    const s = svgFull(fullLayer(c, -40));
    S.vf = cornerPaths(130, 420, 950, 1480, 150).map(d => sv('path', s, { d, fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }));
    S.top = at(el('div', c, 'ctr', { display: 'flex', gap: '18px', alignItems: 'center', fontSize: '34px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }), 540, 540);
    S.dot = el('div', S.top, '', { width: '22px', height: '22px', borderRadius: '50%', background: '#FF5A1C', boxShadow: '0 0 12px rgba(255,90,28,.8)' });
    el('span', S.top, 'tg-dark', {}, 'REC');
    S.tc = el('span', S.top, 'tg-gray', {});
    S.btn = at(el('div', c, 'ctr recbtn'), 540, 870);
    S.core = el('div', S.btn, 'ctr reccore', { left: '50%', top: '50%' });
    S.g = glow(c, 540, 870, 640, 640, -20);
    S.pulse = at(el('div', c, 'ctr', { width: '320px', height: '320px', borderRadius: '50%', border: '4px solid #FF821C' }), 540, 870);
    S.txt = textLine(c, 1160, [{ t: 'You ' }, { t: 'record.', cls: 'serif', tone: 'acc', style: { fontSize: '160px' } }], Object.assign({}, HEAD, { fontSize: '84px' })).chars;
  },
  update(lt) {
    const S = this, a = C.you1;
    S.vf.forEach((v, i) => dash(v, E(lt, -.35 + i * .05, .3 + i * .05)));
    const p = E(lt, -.3, .4);
    T(S.btn, { s: .6 + .4 * p, z: -200 * (1 - p), o: p });
    const press = Math.sin(Math.PI * P(lt, a - .05, a + .3));
    T(S.core, { s: 1 - .14 * press });
    S.g.style.opacity = E(lt, a, a + .4);
    const q = P(lt, a, a + .9);
    T(S.pulse, { s: 1 + .55 * EE(q), o: q > 0 ? .7 * (1 - q) : 0, z: 10 });
    S.top.style.opacity = E(lt, -.2, .2);
    S.dot.style.opacity = Math.floor(lt * 2.5) % 2 ? .25 : 1;
    const f = Math.max(0, Math.floor((lt - a) * FPS));
    S.tc.textContent = `00:00:${String(Math.floor(f / 30)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`;
    typeIn(S.txt, lt, a - .05, .045);
  },
});

/* =====================================================================
   SCENE 9 — CHECKLIST  "We handle the rest."
   ===================================================================== */
addScene({
  build(c, S) {
    S.txt = textLine(c, 540, [{ t: 'We handle ' }, { t: 'the rest.', cls: 'serif', tone: 'acc', style: { fontSize: '120px' } }], HEAD).chars;
    S.g = glow(c, 640, 610, 700, 280, -10);
    const rows = [['Editing', 'Captions'], ['Thumbnails', 'Posting'], ['Strategy', 'Analytics']];
    S.items = [];
    rows.forEach((r, ri) => {
      const row = el('div', c, 'abs p3', { left: 0, width: '1080px', top: px(790 + ri * 140), display: 'flex', justifyContent: 'center', gap: '22px' });
      r.forEach((t, j) => {
        const e = el('div', row, 'pill o', { display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '20px' });
        const ck = el('span', e, 'chk', {}, CHECK(34, 6));
        el('span', e, 'tg-dark', { fontWeight: 600 }, t);
        S.items.push({ e, ck, k: ri * 2 + j, side: j ? 1 : -1 });
      });
    });
  },
  update(lt) {
    const S = this, a = C.you2;
    typeIn(S.txt, lt, a - .05, .035);
    S.g.style.opacity = E(lt, a + .3, a + .8);
    S.items.forEach(({ e, ck, k, side }) => {
      const s0 = a + .05 + k * .1, q = E(lt, s0, s0 + .45), c2 = E(lt, s0 + .25, s0 + .5);
      e.style.transform = `translate3d(${(side * 90 * (1 - q)).toFixed(1)}px,${(50 * (1 - q)).toFixed(1)}px,${(-260 * (1 - q)).toFixed(1)}px)`;
      e.style.opacity = q; e.style.filter = blurF(8 * (1 - q));
      ck.style.transform = `scale(${(.3 + .7 * c2 + .15 * Math.sin(Math.PI * c2)).toFixed(3)})`;
    });
  },
});

/* =====================================================================
   SCENE 10 — BOOKING  "Book your free strategy call today."
   ===================================================================== */
const CURSOR = `<svg width="64" height="64" viewBox="0 0 64 64" style="overflow:visible;filter:drop-shadow(0 6px 8px rgba(0,0,0,.3))"><path d="M6 4 L6 50 L18 39 L27 58 L36 54 L27 35 L44 35 Z" fill="#111" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>`;
addScene({
  build(c, S) {
    S.g = glow(c, 540, 800, 1000, 900, -60);
    S.card = at(el('div', c, 'ctr cal', { width: '780px', height: '640px' }), 540, 800);
    const hd = el('div', S.card, 'abs', { left: '48px', top: '44px', display: 'flex', gap: '26px', alignItems: 'center' });
    tile(hd, ICON.cal, 100)._ic.forEach(p => p.setAttribute('stroke-dasharray', '1 0'));
    const tt = el('div', hd, '');
    el('div', tt, 'tg-dark', { fontSize: '44px', fontWeight: 600, letterSpacing: '-0.03em', paddingBottom: '4px' }, 'Free strategy call');
    el('div', tt, '', { fontSize: '26px', fontWeight: 500, color: '#9A9A9A', marginTop: '4px' }, 'Video call · ISP Agency');
    el('div', S.card, 'abs', { left: '48px', top: '200px', fontSize: '22px', fontWeight: 600, letterSpacing: '.16em', color: '#A8A8A8' }, 'TODAY');
    const sl = el('div', S.card, 'abs', { left: '48px', top: '244px', display: 'flex', gap: '24px' });
    S.slots = ['10:00', '13:30', '16:00'].map(t => el('div', sl, 'slot', {}, t));
    S.btn = el('div', S.card, 'abs bookbtn', { left: '48px', top: '440px' });
    S.bA = el('span', S.btn, 'tg-white', {}, 'Book free call');
    S.bB = el('span', S.btn, 'abs', { display: 'flex', gap: '14px', alignItems: 'center', color: '#fff' }, CHECK(40, 6) + '<span class="tg-white">Booked</span>');
    S.cur = el('div', c, 'abs', { left: 0, top: 0 }, CURSOR);
    S.l1 = textLine(c, 1190, [{ t: 'Book your ' }, { t: 'free', tone: 'acc' }, { t: ' strategy call' }], { fontSize: '60px', fontWeight: 500, letterSpacing: '-0.035em' }).chars;
    S.l2 = textLine(c, 1262, [{ t: 'today.', cls: 'serif', tone: 'acc' }], { fontSize: '150px' }).chars;
  },
  update(lt) {
    const S = this, a = C.cta1, d = DD.cta1;
    const m = E(lt, -.35, .8);
    T(S.card, { rx: lerp(34, 8, m) + 1.5 * Math.sin(lt * 1.2), ry: lerp(24, 4, m), z: lerp(-380, 0, m), o: E(lt, -.35, .05) });
    S.g.style.opacity = .7 * E(lt, 0, .8);
    // cursor: enters → picks 13:30 → presses Book
    const k1 = a + .35, k2 = a + 1.05, P0 = [930, 1150], P1 = [555, 790], P2 = [560, 1040];
    const u = CE(P(lt, k1 - .45, k1)), v = CE(P(lt, k2 - .45, k2));
    const x = lerp(lerp(P0[0], P1[0], u), P2[0], v), y = lerp(lerp(P0[1], P1[1], u), P2[1], v);
    const click = Math.max(Math.sin(Math.PI * P(lt, k1, k1 + .2)), Math.sin(Math.PI * P(lt, k2, k2 + .2)));
    S.cur.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,80px) scale(${(1 - .15 * click).toFixed(3)})`;
    S.cur.style.opacity = E(lt, k1 - .5, k1 - .3);
    const sel = E(lt, k1 + .05, k1 + .25);
    S.slots.forEach((s, i) => { s.classList.toggle('on', i === 1 && sel > .5); s.style.transform = i === 1 ? `scale(${(1 + .06 * Math.sin(Math.PI * sel)).toFixed(3)})` : ''; });
    const pr = Math.sin(Math.PI * P(lt, k2, k2 + .2)), dn = E(lt, k2 + .1, k2 + .35);
    S.btn.style.transform = `scale(${(1 - .04 * pr).toFixed(3)})`;
    S.bA.style.opacity = 1 - dn; S.bB.style.opacity = dn;
    typeIn(S.l1, lt, a - .05, d * .55 / 27);
    typeIn(S.l2, lt, a + d * .7, .035, .4);
  },
});

/* =====================================================================
   SCENE 11 — OUTRO  logo · "Link in bio." · handle scramble
   ===================================================================== */
addScene({
  build(c, S) {
    S.g = glow(c, 540, 900, 900, 800, -40);
    S.rings = rings(c, [[80, 260, 240, -1, -1], [1000, 1640, 220, 1, 1]]);
    const s = svgFull(fullLayer(c, 20));
    S.arrow = sv('g', s, {});
    sv('path', S.arrow, { d: 'M540 610 V470 M490 520 L540 470 L590 520', fill: 'none', stroke: 'url(#gAcc)', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', style: 'filter:drop-shadow(0 0 10px rgba(255,130,28,.6))' });
    S.logo = at(el('div', c, 'ctr', { filter: 'drop-shadow(0 18px 24px rgba(120,40,0,.18)) drop-shadow(0 0 30px rgba(255,130,28,.25))' }, LOGO('b')), 540, 820);
    S.rp = S.logo.querySelector('.rp');
    S.cta = textLine(c, 1010, [{ t: 'Link in ' }, { t: 'bio.', cls: 'serif', tone: 'acc', style: { fontSize: '150px' } }], { fontSize: '80px', fontWeight: 500, letterSpacing: '-0.035em' }).chars;
    S.handle = at(el('div', c, 'ctr tg-dark', { fontSize: '38px', fontWeight: 500, whiteSpace: 'pre', filter: GLOW.dark }), 540, 1260);
  },
  update(lt) {
    const S = this, a = C.cta2;
    updRings(S.rings, lt, -.2);
    const p = E(lt, -.3, .5);
    T(S.logo, { s: .46 * (.75 + .25 * p), o: p, z: -150 * (1 - p), ry: -30 * (1 - p) });
    dash(S.rp, E(lt, -.1, .75));
    S.g.style.opacity = .8 * E(lt, 0, .8);
    typeIn(S.cta, lt, a - .05, .04);
    const ar = E(lt, a + .3, a + .7);
    S.arrow.setAttribute('opacity', ar);
    S.arrow.setAttribute('transform', `translate(0 ${(30 * (1 - ar) - 16 * Math.abs(Math.sin(lt * 3.2))).toFixed(1)})`);
    const target = '@isp_agency_', pool = 'abcdefghijklmnopqrstuvwxyz0123456789#$%&?_';
    const sp = P(lt, a + .2, a + .95), f = Math.floor(lt * FPS);
    let out = '';
    for (let i = 0; i < target.length; i++) out += (i + 1) / target.length <= sp ? target[i] : pool[Math.floor(hash(f * 31 + i * 7) * pool.length)];
    S.handle.textContent = out;
    S.handle.style.opacity = E(lt, a + .15, a + .4);
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
