/* Premium clip overlay: same visual language as video/motion.js
 * (white-gradient stage, gradient type, orange glow, easy-ease type-on).
 * Every frame is a pure function of time: window.renderAt(seconds).
 *   ?layer=bg  static background: stage, glows, card body + shadow (video is composited into the card)
 *   ?layer=fg  transparent foreground: headline, card rim/vignette, speaker tag, captions, progress thread
 */
'use strict';
const C = window.CLIP, Q = new URLSearchParams(location.search), LAYER = Q.get('layer') || 'fg';
document.body.classList.add(LAYER);

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
const EE = cubicBezier(0.45, 0, 0.2, 1);
const BK = cubicBezier(0.34, 1.45, 0.64, 1);      // soft overshoot for the word pop
const E = (t, a, b) => EE(P(t, a, b));
const px = v => v + 'px';
function el(tag, parent, cls, style, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) Object.assign(e.style, style);
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
const stage = document.getElementById('stage');
const K = C.card;

/* ---------------- background layer ---------------- */
if (LAYER === 'bg') {
  const g1 = el('div', stage, 'glow', { left: px(540), top: px(K.y + K.h * .55), width: px(1500), height: px(1300) });
  const g2 = el('div', stage, 'glow', { left: px(540), top: px(300), width: px(1100), height: px(520), opacity: .55 });
  el('div', stage, 'card shadow', { left: px(K.x), top: px(K.y), width: px(K.w), height: px(K.h) });
  window.renderAt = () => {};
}

/* ---------------- foreground layer ---------------- */
if (LAYER === 'fg') {
  /* headline: one or two lines, each made of segments {t, acc?, serif?} */
  const head = [];
  C.headline.forEach((segs, li) => {
    const line = el('div', stage, 'head', { top: px(C.headTop + li * C.headLead) });
    segs.forEach((s, si) => {
      const g = el('span', line, 'grp ' + (s.serif ? 'serif ' : 'sans ') + (s.acc ? 'gl-acc' : 'gl-dark'));
      for (const ch of s.t) { const c = el('span', g, 'ch ' + (s.acc ? 'tg-acc' : 'tg-dark')); c.textContent = ch; head.push(c); }
    });
  });

  el('div', stage, 'vignette', { left: px(K.x), top: px(K.y), width: px(K.w), height: px(K.h) });
  el('div', stage, 'card rim', { left: px(K.x), top: px(K.y), width: px(K.w), height: px(K.h) });

  const tag = el('div', stage, 'tag', { left: px(K.x + 30), top: px(K.y + K.h - 96) },
    `<span class="dot"></span><span>${C.speaker.name}</span><span class="sub">${C.speaker.sub}</span>`);

  /* progress thread under the card (nod to the glowing thread in the promo) */
  const TY = K.y + K.h + 34, TX0 = K.x + 40, TX1 = K.x + K.w - 40;
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, parent, a = {}) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); parent.appendChild(e); return e; };
  const svg = sv('svg', stage, { width: 1080, height: 1920, style: 'position:absolute;left:0;top:0;overflow:visible' });
  sv('line', svg, { x1: TX0, y1: TY, x2: TX1, y2: TY, stroke: 'rgba(0,0,0,.07)', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const halo = sv('line', svg, { x1: TX0, y1: TY, x2: TX0, y2: TY, stroke: '#FF821C', 'stroke-width': 16, 'stroke-linecap': 'round', opacity: .22, style: 'filter:blur(6px)' });
  const thread = sv('line', svg, { x1: TX0, y1: TY, x2: TX0, y2: TY, stroke: 'url(#gAcc)', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const headDot = sv('circle', svg, { cx: TX0, cy: TY, r: 9, fill: '#FFD2A0', style: 'filter:drop-shadow(0 0 8px #FF821C) drop-shadow(0 0 18px #FF821C)' });
  thread.setAttribute('gradientUnits', 'userSpaceOnUse');

  /* captions: one DOM line per group, built up front */
  const groups = C.groups.map((g, gi) => {
    const line = el('div', stage, 'cap', { top: px(C.capTop) });
    line.style.visibility = 'hidden';
    const words = g.words.map(w => {
      const span = el('span', line, 'w ' + (w.emph ? 'serif tg-acc gl-acc' : 'sans tg-dark gl-dark'));
      span.textContent = w.w;
      return { span, w };
    });
    return { g, line, words };
  });
  const LEAD = 0.04;                      // words land a hair before the audio onset
  const showUntil = gi => {
    const g = C.groups[gi], n = C.groups[gi + 1];
    const end = g.words[g.words.length - 1].e + 0.55;
    return n ? Math.min(end, n.s - LEAD) : end;
  };

  window.renderAt = t => {
    /* headline type-on: each letter rises, sharpens from blur and fades in */
    head.forEach((c, i) => {
      const a = .05 + i * .016, p = E(t, a, a + .42);
      c.style.opacity = p;
      c.style.transform = p < 1 ? `translateY(${((1 - p) * 22).toFixed(2)}px)` : '';
      const b = (1 - p) * 9; c.style.filter = b > .15 ? `blur(${b.toFixed(2)}px)` : '';
    });
    const tp = E(t, .35, .95);
    tag.style.opacity = tp; tag.style.transform = `translateY(${((1 - tp) * 20).toFixed(2)}px)`;

    const pr = clamp(t / C.dur), x = lerp(TX0, TX1, pr);
    [thread, halo].forEach(l => l.setAttribute('x2', x));
    headDot.setAttribute('cx', x); headDot.setAttribute('opacity', pr > .002 && pr < .998 ? 1 : 0);

    groups.forEach(({ g, line, words }, gi) => {
      const a = g.s - LEAD, z = showUntil(gi);
      if (t < a - .001 || t >= z) { line.style.visibility = 'hidden'; return; }
      line.style.visibility = 'visible';
      const out = P(t, z - .09, z);       // quick blur-out at the end of the group
      line.style.opacity = 1 - out;
      line.style.filter = out > 0 ? `blur(${(out * 6).toFixed(2)}px)` : '';
      words.forEach(({ span, w }, wi) => {
        const s0 = w.s - LEAD, p = P(t, s0, s0 + .2), pe = EE(p), pb = BK(p);
        const next = words[wi + 1], active = t >= s0 && (!next || t < next.w.s - LEAD);
        span.style.opacity = pe;
        const sc = lerp(.82, 1, pb) * (active && !w.emph ? 1.04 : 1);
        span.style.transform = `translateY(${((1 - pe) * 26).toFixed(2)}px) scale(${sc.toFixed(4)})`;
        if (!w.emph) {
          span.className = 'w sans ' + (active ? 'tg-acc gl-acc' : 'tg-dark gl-dark');
          const b = (1 - pe) * 8; span.style.filter = b > .15 ? `blur(${b.toFixed(2)}px)` : '';
        } else {
          const b = (1 - pe) * 8; span.style.filter = (b > .15 ? `blur(${b.toFixed(2)}px) ` : '') + 'drop-shadow(0 0 10px rgba(255,130,28,.55)) drop-shadow(0 0 30px rgba(255,130,28,.35))';
        }
      });
    });
  };
}
window.READY = true;
