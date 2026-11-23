/* STORY SHOTS: walkthrough films that follow ONE job / run / request through the product.
 * One generic shot, `beat`, renders a scene from HTML (written per film in beats.js) and animates
 * any element carrying data-* attributes, as a pure function of time. Layout lives in film.css, with
 * `.v` on <body> for the 9:16 layout, so one HTML block serves both formats (or give d.htmlV).
 *
 * Timeline row: ['beat', seconds, speed, { d: BEATS.name }]   (BEATS from beats.js)
 * (camV / cursorV replace cam / cursor in 9:16)
 * d = { html, htmlV?, bg?, cls?, cam?: [[t, scale, fx, fy], ...], cursor?: [[t, '#sel' | [x,y], click?], ...],
 *       drift?: 0.03, copy, note, src: 'real'|'sample'|'placeholder', boards?: [t...], sfx?: [[t, kind]] }
 *
 * Element attributes (times are the shot's authored seconds):
 *   data-in="t[,dur[,mode]]"   modes: blur (default) up down left right fade pop wipe rise
 *   data-out="t[,dur]"         fade/blur out
 *   data-type="t0,t1"          type the element's text on (caret while typing)
 *   data-swap="t[,dur]"        children .sa → .sb crossfade with a focus pull (text replacement)
 *   data-mark="t[,dur]"        highlighter sweep behind inline text (colour: --mark)
 *   data-strike="t[,dur]"      strike-through draws across (colour: --strike)
 *   data-ring="t[,dur]"        annotation ring tightens around the element (colour: --ring)
 *   data-count="t0,t1"         count up to the element's own text ($, %, commas kept)
 *   data-draw="t0,t1"          SVG path/line draws on (give it pathLength="1")
 *   data-zoom="t0,t1,s0,s1,ox,oy"  scale an element (e.g. a screenshot) about ox% oy%
 *   data-pan="t0,t1,x0,y0,x1,y1"   translate an element in px
 *   data-color="t,dur,#from,#to"  text colour change (e.g. a ghost suggestion becoming the writer's ink)
 *   data-fly="t0,t1,x,y,w,h[,r]"   move/resize an absolutely positioned element from its CSS box to this box (match cuts)
 */
'use strict';
document.body.classList.toggle('v', V);
const parseT = (s, n) => (s || '').split(',').map((x, i) => i < n ? parseFloat(x) : x.trim());
function camAt(keys, t) { // [[t, s, fx, fy]...] eased between keys
  if (!keys || !keys.length) return [1, .5, .5];
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const a = keys[i - 1], b = keys[i], p = eio(P(t, a[0], b[0]));
    return [L(a[1], b[1], p), L(a[2], b[2], p), L(a[3], b[3], p)];
  }
  return keys[keys.length - 1].slice(1);
}
const arrowHTML = () => `<svg width="44" height="54" viewBox="0 0 22 27"><path d="M2 1.5v20.2l5.2-4.9 3.4 7.7 3.6-1.6-3.4-7.6 7.1-.4z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

shot('beat', {
  len: 4, hero: 2.4,
  build(c, s, sc) {
    const d = sc.d || {};
    if (d.bg) { const k = ['light', 'dark', 'accent'].includes(d.bg) ? STYLE.bg[d.bg] : d.bg; sc.root.style.background = k; sc.root.className = 'scene ' + (d.dark ? 'k-dark' : 'k-light'); }
    if (d.len) sc.len = d.len; if (d.hero != null) sc.hero = d.hero; if (d.sfx) sc.sfx = d.sfx;
    s.box = D(c, 'beat ' + (d.cls || ''), { position: 'absolute', left: 0, top: 0, width: W, height: H }, (V && d.htmlV) || d.html || '');
    const q = a => [...s.box.querySelectorAll('[' + a + ']')];
    s.ins = q('data-in').map(e => ({ e, a: parseT(e.dataset.in, 2) }));
    s.outs = q('data-out').map(e => ({ e, a: parseT(e.dataset.out, 2) }));
    s.types = q('data-type').map(e => { const full = e.textContent; e.textContent = ''; const tx = document.createElement('span'), cr = document.createElement('span'); cr.className = 'caret'; e.append(tx, cr); return { e, tx, cr, full, a: parseT(e.dataset.type, 2) }; });
    s.swaps = q('data-swap').map(e => ({ e, a: parseT(e.dataset.swap, 2), sa: e.querySelector('.sa'), sb: e.querySelector('.sb') }));
    s.marks = q('data-mark').map(e => ({ e, a: parseT(e.dataset.mark, 2) }));
    s.strikes = q('data-strike').map(e => ({ e, a: parseT(e.dataset.strike, 2) }));
    s.rings = q('data-ring').map(e => ({ e, a: parseT(e.dataset.ring, 2) }));
    s.counts = q('data-count').map(e => ({ e, a: parseT(e.dataset.count, 2), st: parseStat(e.textContent.trim()) }));
    s.draws = q('data-draw').map(e => ({ e, a: parseT(e.dataset.draw, 2) }));
    s.zooms = q('data-zoom').map(e => ({ e, a: parseT(e.dataset.zoom, 6) }));
    s.flys = q('data-fly').map(e => ({ e, a: parseT(V && e.dataset.flyV ? e.dataset.flyV : e.dataset.fly, 7).map(Number), r0: null }));
    s.cols = q('data-color').map(e => { const a = parseT(e.dataset.color, 2); return { e, t0: a[0], dur: a[1], c0: hexRgb(a[2]), c1: hexRgb(a[3]) }; });
    s.pans = q('data-pan').map(e => ({ e, a: parseT(e.dataset.pan, 6) }));
    if (V && d.camV) d.cam = d.camV; if (V && d.cursorV) d.cursor = d.cursorV;
    if (d.cursor) { s.cur = D(c, 'abs', { left: 0, top: 0, width: 44, height: 54, zIndex: 60, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.3))' }, arrowHTML()); s.rip = D(c, 'abs ripple', { left: 0, top: 0, width: 60, height: 60, zIndex: 59 }); }
  },
  measure(s, sc) {
    for (const f of s.flys) { const e = f.e; f.r0 = [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight, parseFloat(getComputedStyle(e).borderRadius) || 0]; }
    const d = sc.d || {}; if (!d.cursor) return;
    s.pts = d.cursor.map(([t, tg, click]) => { let x, y; if (Array.isArray(tg)) [x, y] = [tg[0] * W, tg[1] * H]; else { const e = s.box.querySelector(tg); const p = e ? centerOf(e) : { x: CX, y: CY }; x = p.x; y = p.y; } return { t, x, y, click }; });
  },
  update(t, s, c, sc) {
    const d = sc.d || {}, len = sc.len || 4;
    const [cs, fx, fy] = camAt(d.cam, t), drift = 1 + (d.drift == null ? .025 : d.drift) * P(t, 0, len);
    c.style.transformOrigin = `${fx * W}px ${fy * H}px`; S(c, { s: cs * drift });
    for (const { e, a: [t0, dur = .55, mode = 'blur'] } of s.ins) {
      const p = P(t, t0, t0 + dur), k = eo(p), q = 1 - k;
      if (p <= 0) { S(e, { o: 0 }); continue; }
      const o = { o: C(p * 2.2) };
      if (mode === 'blur') Object.assign(o, { b: q * 18, s: L(1.04, 1, k) });
      if (mode === 'up') Object.assign(o, { y: q * 60, b: q * 8 });
      if (mode === 'rise') Object.assign(o, { y: q * 220, by: q * 20 });
      if (mode === 'down') Object.assign(o, { y: -q * 60, b: q * 8 });
      if (mode === 'left') Object.assign(o, { x: q * 120, bx: q * 30 });
      if (mode === 'right') Object.assign(o, { x: -q * 120, bx: q * 30 });
      if (mode === 'pop') Object.assign(o, { s: L(.6, 1, bo(p)), o: C(p * 4) });
      if (mode === 'fade') o.o = k;
      if (mode === 'wipe') { o.o = 1; e.style.clipPath = `inset(0 ${(q * 100).toFixed(2)}% 0 0)`; }
      S(e, o);
    }
    for (const { e, a: [t0, dur = .4] } of s.outs) { const p = P(t, t0, t0 + dur); if (p > 0) { e.style.opacity = (1 - p).toFixed(3); e.style.filter = `blur(${(p * 10).toFixed(1)}px)`; if (p >= 1) e.style.visibility = 'hidden'; } }
    for (const T of s.types) { const [t0, t1] = T.a, p = P(t, t0, t1), n = Math.round(p * T.full.length); T.tx.textContent = T.full.slice(0, n); T.cr.style.opacity = p <= 0 || (p >= 1 && t > t1 + .9) ? 0 : (p < 1 ? 1 : (Math.floor(t * 2.6) % 2 ? 0 : 1)); }
    for (const { sa, sb, a: [t0, dur = .7] } of s.swaps) {
      const p = eo(P(t, t0, t0 + dur));
      if (sa) { sa.style.opacity = (1 - p).toFixed(3); sa.style.filter = `blur(${(p * 12).toFixed(1)}px)`; sa.style.transform = `translateY(${(-p * 18).toFixed(1)}px)`; }
      if (sb) { sb.style.opacity = p.toFixed(3); sb.style.filter = `blur(${((1 - p) * 12).toFixed(1)}px)`; sb.style.transform = `translateY(${((1 - p) * 18).toFixed(1)}px)`; }
    }
    for (const { e, a: [t0, dur = .5] } of s.marks) e.style.backgroundSize = `${(eio(P(t, t0, t0 + dur)) * 100).toFixed(2)}% 100%`;
    for (const { e, a: [t0, dur = .45] } of s.strikes) e.style.backgroundSize = `${(eio(P(t, t0, t0 + dur)) * 100).toFixed(2)}% 100%`;
    for (const { e, a: [t0, dur = .5] } of s.rings) { const p = P(t, t0, t0 + dur), k = eo(p); e.style.outlineOffset = L(26, 6, k).toFixed(1) + 'px'; e.style.outlineColor = `rgba(var(--ringRGB),${C(p * 3).toFixed(3)})`; }
    for (const { e, a: [t0, t1], st } of s.counts) e.textContent = fmtStat(st, eo(P(t, t0, t1)));
    for (const { e, a: [t0, t1] } of s.draws) e.style.strokeDashoffset = (1 - eio(P(t, t0, t1))).toFixed(4);
    for (const { e, a: [t0, t1, s0, s1, ox, oy] } of s.zooms) { e.style.transformOrigin = `${ox}% ${oy}%`; e.style.transform = `scale(${L(s0, s1, eio(P(t, t0, t1))).toFixed(4)})`; }
    for (const { e, a: [t0, t1, x0, y0, x1, y1] } of s.pans) { const p = eio(P(t, t0, t1)); e.style.transform = `translate(${L(x0, x1, p).toFixed(1)}px,${L(y0, y1, p).toFixed(1)}px)`; }
    for (const { e, a: [t0, t1, x, y, w, h, r], r0 } of s.flys) { const p = eio(P(t, t0, t1)); e.style.left = L(r0[0], x, p) + 'px'; e.style.top = L(r0[1], y, p) + 'px'; e.style.width = L(r0[2], w, p) + 'px'; e.style.height = L(r0[3], h, p) + 'px'; if (!isNaN(r)) e.style.borderRadius = L(r0[4], r, p) + 'px'; }
    for (const k of s.cols) { const p = eio(P(t, k.t0, k.t0 + k.dur)); k.e.style.color = `rgb(${mix(k.c0, k.c1, p).join(',')})`; }
    if (s.pts && s.pts.length) { // arrow cursor glides point to point; clicks ripple
      const pts = s.pts; let x = pts[0].x, y = pts[0].y, o = P(t, pts[0].t - .3, pts[0].t), press = 1, rip = -1;
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], p = eio(P(t, a.t + .15, b.t)); if (t > a.t) { x = L(a.x, b.x, p); y = L(a.y, b.y, p); } }
      for (const pt of pts) if (pt.click && t >= pt.t && t < pt.t + .5) { rip = P(t, pt.t, pt.t + .5); if (t < pt.t + .18) press = .86; S(s.rip, { x: pt.x - 30, y: pt.y - 30, s: L(.3, 1.6, eo(rip)), o: 1 - rip }); }
      if (rip < 0) S(s.rip, { o: 0 });
      S(s.cur, { x: x - 4, y: y - 3, s: press, o });
    }
  },
});
