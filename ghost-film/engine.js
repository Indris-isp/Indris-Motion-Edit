/* SaaS launch video engine.
 * Every frame is a pure function of time: window.renderAt(seconds).
 * Shots (shots.js) register with shot(id, def); timeline.js orders them and sets
 * each one's on-screen duration and playback speed. Copy and colours come from brief.js.
 */
'use strict';
const TL = window.TIMELINE, B = window.BRIEF;
const W = TL.W || 1920, H = TL.H || 1080, FPS = TL.FPS || 30;

/* ---------- math & easing ---------- */
const C = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const P = (t, a, b) => C((t - a) / (b - a));
const L = (a, b, p) => a + (b - a) * p;
const eo = p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);                     // expo out: fast in, long settle
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;  // cubic in-out: camera moves
const ei = p => p * p * p;                                                  // cubic in: exits
const bo = p => { const c1 = 1.5, c3 = c1 + 1; return p <= 0 ? 0 : 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }; // back out: pops
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const vel = (f, t) => Math.abs(f(t + 1 / 60) - f(t - 1 / 60));             // px moved in one 30 fps frame → motion blur

/* ---------- theme: derive the palette from one accent colour ---------- */
function hexRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p));
const rgbS = c => c.join(',');
function applyTheme(br) {
  const a = hexRgb(br.accent), wt = [255, 255, 255], bk = [0, 0, 0], r = document.documentElement.style;
  const acc2 = br.accentLight ? hexRgb(br.accentLight) : mix(a, wt, .28), acc3 = br.accentDark ? hexRgb(br.accentDark) : mix(a, bk, .22);
  r.setProperty('--acc', `rgb(${rgbS(a)})`); r.setProperty('--accRGB', rgbS(a));
  r.setProperty('--acc2', `rgb(${rgbS(acc2)})`); r.setProperty('--acc2RGB', rgbS(acc2));
  r.setProperty('--acc3', `rgb(${rgbS(acc3)})`);
  r.setProperty('--acc4', `rgb(${rgbS(mix(a, wt, .75))})`);
  r.setProperty('--tint', `rgb(${rgbS(mix(a, wt, .91))})`);
  r.setProperty('--blobRGB', rgbS(mix(a, wt, .55)));
  r.setProperty('--night1', `rgb(${rgbS(mix(a, bk, .62))})`); r.setProperty('--night2', `rgb(${rgbS(mix(a, bk, .86))})`);
  if (br.ink) r.setProperty('--ink', br.ink);
  if (br.blob) r.setProperty('--blobRGB', br.blob);
  if (br.font) r.setProperty('--font', br.font);
}

/* ---------- DOM ---------- */
const stage = document.getElementById('stage'), fdefs = document.getElementById('fdefs');
const NOPX = /opacity|zIndex|flex|fontWeight|lineHeight/;
function D(parent, cls, style, html) {
  const e = document.createElement('div'); if (cls) e.className = cls;
  if (style) for (const k in style) e.style[k] = typeof style[k] === 'number' && !NOPX.test(k) ? style[k] + 'px' : style[k];
  if (html != null) e.innerHTML = html; parent.appendChild(e); return e;
}
let fid = 0;
function mkBlur() { // directional (SVG) blur: real-looking horizontal/vertical motion blur
  const id = 'mb' + (fid++);
  fdefs.insertAdjacentHTML('beforeend', `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>`);
  const g = fdefs.lastElementChild.firstElementChild;
  return { url: `url(#${id})`, set(bx, by) { g.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`); } };
}
/* S(el, {x y s r rx ry o b bx by f}): transform + opacity + blur (iso b, or directional bx/by). .ctr elements are centred on left/top. */
function S(e, o) {
  const c = e.classList.contains('ctr') ? 'translate(-50%,-50%) ' : '';
  e.style.transform = `${c}translate(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px) rotateX(${o.rx || 0}deg) rotateY(${o.ry || 0}deg) rotate(${(o.r || 0).toFixed(2)}deg) scale(${(o.s == null ? 1 : o.s).toFixed(4)})`;
  if (o.o != null) { e.style.opacity = C(o.o).toFixed(3); e.style.visibility = o.o <= 0.001 ? 'hidden' : 'visible'; }
  let f = o.f || '';
  if (o.bx != null || o.by != null) {
    const bx = o.bx || 0, by = o.by || 0;
    if (bx > .15 || by > .15) { if (!e._mb) e._mb = mkBlur(); e._mb.set(bx, by); f += ' ' + e._mb.url; }
  } else if (o.b > .1) f += ` blur(${o.b.toFixed(2)}px)`;
  e.style.filter = f.trim() || 'none';
}
const AVC = [['#FFB86B', '#F06A2A'], ['#7C5CFF', '#4B2FD6'], ['#3DD6A0', '#139B6E'], ['#FF7AA8', '#D63C77'], ['#6FC3FF', '#2386D6'], ['#FFD36B', '#E09A12']];
/* avatar: initials on a gradient, or an image if `n` looks like a path */
const av = (n, s, i) => /\.(png|jpe?g|webp|svg)$/i.test(n)
  ? `<div class="av" style="width:${s}px;height:${s}px;background:url('${n}') center/cover"></div>`
  : `<div class="av" style="width:${s}px;height:${s}px;font-size:${s * .36}px;background:linear-gradient(135deg,${AVC[i % 6][0]},${AVC[i % 6][1]})">${n}</div>`;
const person = i => (B.people || ['MK', 'JL', 'AS', 'TR', 'BN', 'EO'])[i % (B.people || [1, 2, 3, 4, 5, 6]).length];
/* app icon: brief logo image, or a generated glossy ring icon */
// Ghost: the logo mark stands on its own (no app-icon tile). dark=true renders it white with a soft glow for dark scenes.
const iconHTML = (s, dark) => B.brand.logo
  ? `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center"><img src="${B.brand.logo}" style="width:100%;height:100%;object-fit:contain;${dark ? 'filter:invert(1) drop-shadow(0 0 18px rgba(255,255,255,.55)) drop-shadow(0 0 50px rgba(var(--acc2RGB),.8))' : ''}"></div>`
  : `<div class="icon" style="width:${s}px;height:${s}px;border-radius:${s * .25}px;--s:${s}px"><i></i></div>`;
/* 3D-looking hand pointer (fingertip at 35,8 inside the 110x130 box) */
const handHTML = () => `<svg width="110" height="130" viewBox="0 0 22 26"><defs><linearGradient id="hg${fid++}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc2)"/><stop offset="1" style="stop-color:var(--acc3)"/></linearGradient></defs><path d="M7 1.5c1 0 1.8.8 1.8 1.8v7.2l.6-.1c.9-.1 1.7.4 2 1.2.6-.3 1.4-.3 2 .1.5-.3 1.3-.3 1.9.1.9.6 1.5 1.6 1.5 2.7V19c0 3.3-2.7 6-6 6H9.6c-1.7 0-3.3-.8-4.3-2.1L1.6 18c-.6-.8-.5-1.9.3-2.5.8-.6 1.9-.5 2.5.3l.8 1V3.3C5.2 2.3 6 1.5 7 1.5z" fill="url(#hg${fid - 1})" stroke="#fff" stroke-width="1"/></svg>`;
function mkHand(c) { const h = D(c, 'abs', { left: 0, top: 0, width: 110, height: 130, filter: 'drop-shadow(0 18px 18px rgba(20,40,110,.45))' }, handHTML()); h.style.transformOrigin = '35px 8px'; return h; }
/* animate a hand from off-frame (dx,dy) to the target tip position (tx,ty), arriving at t1, pressing at t1..t1+.3 */
function moveHand(h, t, tx, ty, t0, t1, dx = 420, dy = 520) {
  const hp = eio(P(t, t0, t1)), press = t > t1 && t < t1 + .3 ? 1 - .12 * Math.sin(P(t, t1, t1 + .3) * Math.PI) : 1;
  S(h, { x: L(tx - 35 + dx, tx - 35, hp) - Math.sin(hp * Math.PI) * 60, y: L(ty - 8 + dy, ty - 8, hp), s: press, o: P(t, t0 - .05, t0 + .15), r: L(18, 0, hp) });
}
/* centre of an element in stage coordinates */
function centerOf(e) { const r = e.getBoundingClientRect(), sr = stage.getBoundingClientRect(); return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 }; }
const glyphHTML = (g, col, s = 26) => `<span class="glyph" style="width:${s}px;height:${s}px;border-radius:${s * .27}px;font-size:${s * .54}px;background:${col}">${g}</span>`;

/* typed text. segs: [{t, cls}] → {el, chars, cur}; typeP(T, p, t) reveals p∈[0,1] with blur-in per char + blinking cursor */
function typed(parent, cls, style, segs, cursor = true) {
  const e = D(parent, cls, style); const chars = [];
  for (const s of segs) {
    const g = document.createElement('span'); if (s.cls) g.className = s.cls; e.appendChild(g);
    for (const ch of s.t) { if (ch === '\n') { g.appendChild(document.createElement('br')); continue; } const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; g.appendChild(c); chars.push(c); }
  }
  let cur = null; if (cursor) { cur = document.createElement('span'); cur.className = 'cur'; e.appendChild(cur); }
  return { el: e, chars, cur };
}
function typeP(T, p, t, curOn = true) {
  const n = p * T.chars.length;
  T.chars.forEach((c, i) => {
    const k = C(n - i);
    c.style.display = k > 0 ? 'inline-block' : 'none';
    c.style.opacity = (.25 + .75 * k).toFixed(3);
    c.style.filter = k < 1 ? `blur(${((1 - k) * 6).toFixed(2)}px)` : 'none';
    c.style.transform = `translateY(${((1 - k) * 8).toFixed(1)}px)`;
  });
  if (T.cur) T.cur.style.opacity = !curOn || p <= 0 ? 0 : (p < 1 ? 1 : (Math.floor(t * 2.6) % 2 ? 0 : 1));
}
/* whole-element focus-pull reveal */
function blurIn(e, t, a, b, o = {}) {
  const p = eo(P(t, a, b));
  S(e, { o: C((t - a) / ((b - a) * .4)), b: (1 - p) * (o.blur || 24), s: L(o.s0 || 1.06, 1, p), y: (1 - p) * (o.y || 0), x: (1 - p) * (o.x || 0) });
}
const flash = v => { document.getElementById('flash').style.opacity = C(v).toFixed(3); };

/* ---------- shot registry + timeline ---------- */
const SHOTS = {};
function shot(id, def) { SHOTS[id] = def; }
const scenes = [];
function buildTimeline() {
  let a = 0;
  TL.shots.forEach((row, i) => {
    const [id, dur, k = 1, over = {}] = row, def = SHOTS[id];
    if (!def) throw new Error('unknown shot ' + id);
    const sc = Object.assign({ id, i, a, b: a + dur, dur, k, vd: dur * k }, def, over);
    sc.root = D(stage, 'scene', { background: sc.bg || 'linear-gradient(180deg,#fff 0%,#F4F4F5 100%)', zIndex: i + 1 });
    sc.cam = D(sc.root, 'cam'); sc.st = {};
    sc.build(sc.cam, sc.st, sc);
    scenes.push(sc); a += dur;
  });
  window.DUR = a; window.TOTAL = Math.round(a * FPS);
}
/* scene-level transitions (tin/tout): whip, up, zoom, fade */
function applyTr(sc, lt) {
  const d = sc.dur; const o = { x: 0, y: 0, s: 1, o: 1, bx: 0, by: 0 };
  const I = sc.tin, O = sc.tout, ti = .3, to = .24;
  if (I && lt < ti) {
    const p = eo(lt / ti), q = 1 - p;
    if (I === 'whip') { o.x = q * 700; o.bx = q * 60; }
    if (I === 'up') { o.y = q * 500; o.by = q * 50; }
    if (I === 'zoom') { o.s = L(.82, 1, p); o.bx = o.by = q * 24; }
    if (I === 'fade') { o.o = C(lt / .2); o.bx = o.by = q * 30; o.s = L(1.06, 1, p); }
  }
  if (O && lt > d - to) {
    const p = ei(P(lt, d - to, d));
    if (O === 'whip') { o.x += -p * 800; o.bx += p * 70; }
    if (O === 'up') { o.y += -p * 600; o.by += p * 60; }
    if (O === 'zoom') { o.s *= L(1, 1.6, p); o.bx += p * 30; o.by += p * 30; o.o = 1 - p * .6; }
    if (O === 'fade') { o.o = 1 - p; o.bx += p * 30; o.by += p * 30; }
  }
  S(sc.root, o);
}
function show(sc, lt) { sc.root.style.display = 'block'; applyTr(sc, lt); sc.update(lt * sc.k, sc.st, sc.cam, sc); }
window.renderAt = function (t) {
  flash(0);
  for (const sc of scenes) sc.root.style.display = 'none';
  scenes.forEach((sc, i) => {
    const lt = t - sc.a;
    if (lt >= 0 && lt < sc.dur) {
      if (sc.under && i > 0 && lt < sc.under) { const pv = scenes[i - 1]; show(pv, pv.dur - 0.001); }
      show(sc, lt);
    }
  });
};
/* sound cues in real time. Shot sfx are [authoredTime, kind]; cues within .3 s of the shot's authored end stick to the cut. */
window.exportCues = function () {
  const sfx = [];
  for (const sc of scenes) for (const [lt, kind] of (sc.sfx || [])) {
    const fromEnd = (sc.len || sc.vd) - lt;
    let at;
    if (fromEnd <= .3) at = sc.b - fromEnd;
    else if (lt <= sc.vd + .05) at = sc.a + lt / sc.k;
    else continue; // that part of the shot was trimmed
    sfx.push([+at.toFixed(3), kind, sc.k]);
  }
  sfx.sort((x, y) => x[0] - y[0]);
  const find = id => { const s = scenes.find(s => s.id === id); return s ? s : null; };
  const turn = find('turn'), cta = find('cta');
  return { FPS, BPM: TL.BPM || 128, DUR: window.DUR, W, H, sfx,
    markers: { turn: turn ? turn.a : null, drop: turn ? turn.b : 0, cta: cta ? cta.a : window.DUR },
    scenes: scenes.map(s => ({ id: s.id, a: s.a, b: s.b, k: s.k, hero: s.hero })) };
};
function boot() {
  applyTheme(B.brand);
  buildTimeline();
  document.fonts.ready.then(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })))).then(() => {
    for (const sc of scenes) if (sc.measure) { sc.root.style.display = 'block'; sc.measure(sc.st, sc); sc.root.style.display = 'none'; }
    window.renderAt(0); window.READY = true;
  });
}
