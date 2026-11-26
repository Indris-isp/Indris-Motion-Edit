/* Meet ISP Agency — screen animation, rebuilt from the reference reel's design with ISP content.
 * 1920x1080 · 30 fps · 10.8 s. Every frame is a pure function of time: window.renderAt(seconds).
 *
 * Segment map (reference → ISP):
 *  1  "M e e t" letters + coloured dots assemble           → Meet
 *  2  "Symphony" logo on lavender ripples                  → ISP logo + "Agency"
 *  3  green app tile, items orbiting on a 3x3 grid         → ISP tile, social platforms orbiting
 *  4  "Let's connect your tools" typed word by word        → "Let's make your video better"
 *  5  colour screens: link tile ··· tool circle + label    → ISP ··· Instagram / YouTube / Facebook / TikTok
 *  6  "Tools Connected ✓" / "Everything is connected…"     → "ISP Agency ✓" / "All in one place, less pressure."
 *  7  "Home screen is ready" card + confetti               → "Video is ready" / "ISP Agency"
 */
'use strict';
const W = 1920, H = 1080, CX = 960, CY = 540, FPS = 30, DUR = 10.8;
const SEG = { s1: [0, 1.85], s2: [1.78, 2.58], s3: [2.5, 3.8], s4: [3.7, 4.92], s5: [4.9, 7.16], s6: [7.06, 8.46], s7: [8.38, DUR] };
window.TIMING = { FPS, DUR, W, H, frames: Math.round(DUR * FPS) };
const LOGO = 'logos/isp/isp_logo_black.svg';

/* ---------- math ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {
  const B = (u, a, b) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; let lo = 0, hi = 1, u = p; for (let i = 0; i < 24; i++) { u = (lo + hi) / 2; if (B(u, x1, x2) < p) lo = u; else hi = u; } return B(u, y1, y2); };
}
const IO = bez(.65, 0, .35, 1), OUT = bez(.16, .84, .3, 1), INQ = bez(.6, 0, .9, .5);
const E = (t, a, b, f = IO) => f(P(t, a, b));
const back = p => { if (p <= 0) return 0; if (p >= 1) return 1; const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2; };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/* keyframes [[t, x, y, o], ...] → {x, y, o}, eased in-out between keys */
function kf(keys, t) {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], o: t < keys[0][0] ? 0 : keys[0][3] };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b[0]) { const p = IO(P(t, a[0], b[0])); return { x: lerp(a[1], b[1], p), y: lerp(a[2], b[2], p), o: lerp(a[3], b[3], p) }; }
  }
  const z = keys[keys.length - 1]; return { x: z[1], y: z[2], o: z[3] };
}

/* ---------- DOM ---------- */
const $ = s => document.querySelector(s);
function el(tag, parent, cls, style, html) {
  const e = document.createElement(tag); if (cls) e.className = cls; if (style) Object.assign(e.style, style);
  if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e;
}
const px = v => v + 'px';
function put(e, x, y, s = 1, o = null, extra = '') {
  e.style.left = px(x); e.style.top = px(y);
  e.style.transform = `translate(-50%,-50%) scale(${s.toFixed(4)}) ${extra}`;
  if (o != null) e.style.opacity = clamp(o);
}
const blur = (e, b) => { e.style.filter = b > .15 ? `blur(${b.toFixed(2)}px)` : ''; };
function show(id, t, a, b, fin = 0, fout = 0) {
  const L = $('#' + id), vis = t >= a && t < b;
  L.style.visibility = vis ? 'visible' : 'hidden';
  if (vis) L.style.opacity = Math.min(fin ? P(t, a, a + fin) : 1, fout ? 1 - P(t, b - fout, b) : 1);
  return vis;
}
function tileEl(parent, cls, size) {
  const t = el('div', parent, 'tile ' + cls, { width: px(size), height: px(size), left: 0, top: 0 });
  el('img', t).src = LOGO; return t;
}
function sizeTile(e, size) { e.style.width = e.style.height = px(size); }

/* ---------- platform glyphs ---------- */
const PLAT = {
  instagram: { name: 'Instagram', fill: 'url(#gIG)', bg: 'radial-gradient(circle at 30% 107%,#FDF497 0%,#FDF497 6%,#FD5949 45%,#D6249F 62%,#285AEB 92%)', dot: '#F07FB8' },
  youtube: { name: 'YouTube', fill: '#FF0000', bg: '#FF0000', dot: '#FF6B6B' },
  facebook: { name: 'Facebook', fill: '#0866FF', bg: '#0866FF', dot: '#6EA2FF' },
  tiktok: { name: 'TikTok', fill: '#111', bg: '#111', dot: '#7DF5F1', glitch: true },
  x: { name: 'X', fill: '#111', bg: '#111', dot: '#E6E6EA' },
  linkedin: { name: 'LinkedIn', fill: '#0A66C2', bg: '#0A66C2', dot: '#8EC2F2' },
  snapchat: { name: 'Snapchat', fill: '#fff', stroke: '#111', bg: '#FFFC00', dot: '#F4F07A' },
  whatsapp: { name: 'WhatsApp', fill: '#25D366', bg: '#25D366', dot: '#A6E3A0' },
};
function glyph(name, fill, size) {
  const b = PLAT[name], d = ICONS[name];
  const st = b.stroke && fill === '#fff' ? ` stroke="${b.stroke}" stroke-width=".9" stroke-linejoin="round"` : '';
  let inner = `<path d="${d}" fill="${fill}"${st}/>`;
  if (b.glitch) inner = `<path d="${d}" fill="#25F4EE" transform="translate(-.55 -.45)"/><path d="${d}" fill="#FE2C55" transform="translate(.55 .45)"/>` + inner;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${inner}</svg>`;
}
function appIcon(parent, name, size) {   // small app-tile: brand background, white glyph
  const b = PLAT[name];
  const t = el('div', parent, 'tile', { width: px(size), height: px(size), background: b.bg, left: 0, top: 0 },
    glyph(name, name === 'snapchat' ? '#fff' : (name === 'tiktok' ? '#fff' : '#fff'), Math.round(size * (name === 'youtube' ? .62 : .54))));
  if (name === 'youtube') t.querySelector('path').setAttribute('fill', '#fff');
  return t;
}

/* =====================================================================
   1  MEET — letters and dots assemble
   ===================================================================== */
const S1 = (() => {
  const L = $('#s1');
  const letters = [
    { ch: 'M', keys: [[0, 330, 395, 1], [.6, 340, 400, 1], [1.0, 640, 500, 1]], col: '#D9E1F8' },
    { ch: 'e', keys: [[.62, 905, 345, 0], [.7, 905, 345, 1], [1.0, 1010, 335, 1]], col: '#8DB8F2' },
    { ch: 'e', keys: [[.74, 570, 660, 0], [.82, 570, 660, 1], [1.0, 880, 650, 1]], col: '#D9E1F8' },
    { ch: 't', keys: [[.84, 1330, 640, 0], [.92, 1330, 640, 1], [1.0, 1220, 625, 1]], col: '#D9E1F8' },
  ];
  letters.forEach(l => { l.e = el('div', L, 'c nowrap', { font: '500 120px Inter', color: l.col, letterSpacing: '-.01em' }); l.e.textContent = l.ch; });
  const word = el('div', L, 'c nowrap', { font: '500 40px Inter', color: '#E6EAF7', left: px(CX), top: px(CY), opacity: 0 }); word.textContent = 'Meet';
  const ghost = el('div', L, 'c nowrap', { font: '500 40px Inter', color: '#E6EAF7', opacity: 0 }); ghost.textContent = 'Meet';
  const dots = [
    { c: '#EDEDF2', k: [[0, 700, 372, 1], [.9, 1215, 330, 1], [1.28, 1110, 470, 1], [1.62, 1110, 545, 1]] },
    { c: '#EDEDF2', k: [[0, 1450, 770, 1], [.9, 1445, 765, 1], [1.28, 1170, 545, 1], [1.62, 1165, 545, 1]] },
    { c: '#E59ADF', k: [[.74, 1000, 425, 0], [.84, 1000, 425, 1], [1.28, 1060, 470, 1], [1.45, 1150, 545, 1], [1.62, 1220, 545, 1]] },
    { c: '#9C8CF0', k: [[.68, 610, 625, 0], [.78, 610, 625, 1], [1.28, 865, 470, 1], [1.62, 810, 545, 1]] },
    { c: '#F0704B', k: [[.8, 1150, 600, 0], [.9, 1150, 600, 1], [1.28, 890, 615, 1], [1.5, 890, 615, 1], [1.62, 890, 615, 0]] },
    { c: '#A6E3A0', k: [[.86, 1420, 640, 0], [.96, 1420, 640, 1], [1.28, 1265, 545, 1], [1.62, 1275, 545, 0]] },
    { c: '#5AA9F5', k: [[1.0, 520, 470, 0], [1.12, 560, 470, 1], [1.32, 760, 545, 1], [1.62, 700, 545, 1]] },
    { c: '#4C8FEA', k: [[1.0, 700, 470, 0], [1.12, 720, 470, 1], [1.32, 820, 545, 1], [1.62, 755, 545, 1]] },
    { c: '#8B8F9C', k: [[.9, 750, 700, 0], [1.0, 750, 700, 1], [1.28, 860, 615, 1], [1.45, 860, 615, 0]] },
    { c: '#7FB6F5', k: [[1.15, 1045, 470, 0], [1.25, 1045, 470, 1], [1.45, 1045, 470, 1], [1.62, 1045, 470, 0]] },
  ];
  dots.forEach(d => d.e = el('div', L, 'sq', { width: '13px', height: '13px', background: d.c, marginLeft: '-6.5px', marginTop: '-6.5px' }));
  const ring = el('div', L, 'c', { width: '620px', height: '620px', left: px(CX), top: px(CY), borderRadius: '50%', opacity: 0,
    background: 'repeating-radial-gradient(circle, rgba(255,255,255,.07) 0 2px, transparent 2px 22px)', WebkitMaskImage: 'radial-gradient(circle, #000 20%, transparent 70%)' });
  let fin = null;
  return {
    measure() {   // final letter centres inside the small "Meet"
      const c = document.createElement('canvas').getContext('2d'); c.font = '500 40px Inter';
      const total = c.measureText('Meet').width; let x = CX - total / 2;
      fin = 'Meet'.split('').map(ch => { const w = c.measureText(ch).width; const cx = x + w / 2; x += w; return cx; });
    },
    update(t) {
      if (!show('s1', t, ...SEG.s1)) return;
      const conv = E(t, 1.0, 1.3);
      letters.forEach((l, i) => {
        const a = kf(l.keys, Math.min(t, 1.0)), pop = back(P(t, l.keys[0][0], l.keys[0][0] + .18));
        const x = lerp(a.x, fin[i], conv), y = lerp(a.y, CY, conv), s = lerp(1, 40 / 120, conv) * (i ? .7 + .3 * pop : 1);
        put(l.e, x, y, s, a.o * (1 - P(t, 1.24, 1.32)));
        l.e.style.color = l.col; blur(l.e, 6 * Math.sin(Math.PI * conv));
      });
      word.style.opacity = P(t, 1.22, 1.32);
      dots.forEach(d => { const a = kf(d.k, t); d.e.style.left = px(a.x); d.e.style.top = px(a.y); d.e.style.opacity = a.o; });
      const r = P(t, 1.62, 1.85); ring.style.opacity = .9 * Math.sin(Math.PI * clamp(r * 1.3)); ring.style.transform = `translate(-50%,-50%) scale(${(.6 + .6 * r).toFixed(3)})`;
      const g = P(t, 1.66, 1.8); put(ghost, CX - 52 * g, CY, 1, g > 0 && g < 1 ? .45 : 0);
    },
  };
})();

/* =====================================================================
   2  LOGO — ISP mark + "Agency" on lavender ripples
   ===================================================================== */
const S2 = (() => {
  const L = $('#s2');
  const rings = el('div', L, 'c', { width: '1500px', height: '1500px', left: px(CX), top: px(CY), borderRadius: '50%',
    WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.6) 30%, transparent 62%)' });
  const lock = el('div', L, 'c nowrap', { left: px(CX), top: px(CY), display: 'flex', alignItems: 'center', gap: '26px' });
  const mark = el('img', lock, '', { height: '170px', display: 'block' }); mark.src = LOGO;
  const word = el('div', lock, 'nowrap', { font: '800 124px Inter', color: '#101016', letterSpacing: '-0.045em', lineHeight: 1 });
  const chars = 'Agency'.split('').map(ch => { const s = el('span', word, 'word'); s.textContent = ch; return s; });
  return {
    markPos: null,
    measure() { const r = mark.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(), k = s.width / W; this.markPos = [(r.left - s.left + r.width / 2) / k, (r.top - s.top + r.height / 2) / k]; },
    update(t) {
      if (!show('s2', t, ...SEG.s2)) return;
      const lt = t - SEG.s2[0];
      rings.style.background = `repeating-radial-gradient(circle, rgba(70,80,140,.11) 0 2px, transparent 2px ${24}px)`;
      rings.style.backgroundPosition = 'center'; rings.style.transform = `translate(-50%,-50%) scale(${(1 + lt * .12).toFixed(4)})`;
      rings.style.opacity = E(t, 1.85, 2.15);
      const mp = E(t, 1.8, 2.1, OUT);
      mark.style.transform = `scale(${lerp(.82, 1, mp).toFixed(4)}) rotate(${lerp(-16, 0, mp).toFixed(3)}deg)`;
      const exit = P(t, 2.42, 2.55);
      mark.style.opacity = P(t, 1.8, 1.86) * (1 - P(t, 2.47, 2.55));
      chars.forEach((c, i) => {
        const p = E(t, 1.82 + i * .035, 1.97 + i * .035, OUT);
        c.style.opacity = p * (1 - exit);
        c.style.transform = `translateX(${((1 - p) * 14 + exit * (i % 2 ? 9 : -6)).toFixed(2)}px)`;
        blur(c, (1 - p) * 10 + exit * 7);
      });
      blur(lock, 14 * (1 - P(t, 1.8, 1.92)));
      if (t >= 2.4) { const tr = mark.style.transform; mark.style.transform = 'none'; this.measure(); mark.style.transform = tr; }
    },
  };
})();

/* =====================================================================
   3  ORBIT — ISP tile in the middle, platforms on a rotating 3x3 grid
   ===================================================================== */
const S3 = (() => {
  const L = $('#s3');
  el('div', L, 'c', { width: '1300px', height: '1300px', left: px(CX), top: px(CY), borderRadius: '50%',
    background: 'repeating-radial-gradient(circle, rgba(255,255,255,.055) 0 2px, transparent 2px 26px)',
    WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 60%)' });
  const glow = el('div', L, 'c', { width: '700px', height: '700px', left: px(CX), top: px(CY), borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(140,225,120,.10), transparent)' });
  const G = 262, CELLS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const order = ['instagram', 'x', 'youtube', 'linkedin', 'facebook', 'snapchat', 'tiktok', 'whatsapp'];
  const items = order.map((n, j) => {
    const icon = appIcon(L, n, 150); icon.style.borderRadius = n === 'facebook' || n === 'whatsapp' ? '50%' : '28%';
    const dot = el('div', L, 'dot', { width: '40px', height: '40px', background: PLAT[n].dot, left: 0, top: 0 });
    return { n, j, icon, dot };
  });
  const STEPS = [2.98, 3.3];
  return {
    update(t) {
      const vis = show('s3', t, ...SEG.s3, .07, 0);
      if (!vis) return;
      const flash = P(t, 3.6, 3.8);
      glow.style.opacity = 1 - flash;
      const steps = STEPS.reduce((s, a) => s + E(t, a, a + .26), 0);
      const collapse = E(t, 3.6, 3.74, INQ);
      items.forEach(o => {
        const c = o.j + steps, i0 = Math.floor(c) % 8, i1 = (i0 + 1) % 8, f = c - Math.floor(c);
        let x = lerp(CELLS[i0][0], CELLS[i1][0], f) * G, y = lerp(CELLS[i0][1], CELLS[i1][1], f) * G;
        const m = c % 2, iconness = m <= 1 ? 1 - m : m - 1;   // 1 on a side cell, 0 on a corner
        const a = 2.6 + o.j * .035, pin = back(P(t, a, a + .3));
        x *= (.25 + .75 * OUT(P(t, a, a + .3))) * (1 - collapse); y *= (.25 + .75 * OUT(P(t, a, a + .3))) * (1 - collapse);
        const s = pin * (1 - .6 * collapse), o0 = P(t, a, a + .08) * (1 - P(t, 3.66, 3.76));
        put(o.icon, CX + x, CY + y, s * lerp(.3, 1, iconness), o0 * clamp(iconness * 1.6 - .2));
        put(o.dot, CX + x, CY + y, s * lerp(1, 2.4, iconness), o0 * clamp(1.4 - iconness * 1.8));
      });
    },
  };
})();

/* =====================================================================
   4  "Let's make your video better" — typed word by word, recentring
   ===================================================================== */
const S4 = (() => {
  const L = $('#s4');
  const flash = el('div', L, 'c', { width: '2400px', height: '2400px', left: px(CX), top: px(CY), borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,.9), rgba(255,255,255,0))' });
  const line = el('div', L, 'abs nowrap', { top: px(CY), font: '400 78px Inter', color: '#3A3E55', letterSpacing: '-.01em', transform: 'translateY(-50%)' });
  const words = [['Let’s ', 400, 3.8], ['make ', 400, 3.93], ['your ', 400, 4.05], ['video ', 400, 4.17], ['better', 700, 4.31]].map(([w, fw, at]) => {
    const s = el('span', line, 'word', { fontWeight: fw, color: fw === 700 ? '#1F2236' : '#3A3E55' }); s.textContent = w; return { s, at };
  });
  const ICON = 96, GAP = 32;
  return {
    measure() { words.forEach(w => { w.w = w.s.getBoundingClientRect().width; }); },
    iconPos(t) {
      const tw = words.reduce((s, w) => s + w.w * E(t, w.at, w.at + .16, OUT), 0);
      const left = CX - (ICON + GAP + tw) / 2;
      return { left, x: left + ICON / 2, textX: left + ICON + GAP };
    },
    update(t) {
      if (!show('s4', t, ...SEG.s4, .1, 0)) return;
      flash.style.opacity = 1 - E(t, 3.72, 3.95);
      const g = this.iconPos(Math.min(t, 4.6));
      line.style.left = px(g.textX);
      const ex = P(t, 4.74, 4.9);
      words.forEach(w => {
        const p = E(t, w.at, w.at + .16, OUT);
        w.s.style.opacity = p * (1 - ex); w.s.style.transform = `translateX(${((1 - p) * 14).toFixed(2)}px)`; blur(w.s, (1 - p) * 8 + ex * 8);
      });
    },
  };
})();

/* =====================================================================
   5  PLATFORMS — ISP tile ··· platform circle on full-colour screens
   ===================================================================== */
const S5 = (() => {
  const L = $('#s5');
  const LIST = [['instagram', '#F06A3B'], ['youtube', '#C39AEA'], ['facebook', '#1463F3'], ['tiktok', '#129E99']], STEP = .56, T0 = 4.9;
  const DOTC = ['#F2F2F6', '#A6E3A0', '#F0704B', '#E59ADF', '#9C8CF0', '#F2F2F6', '#7FB6F5', '#E4E33A'];
  const dots = [];
  for (const side of [-1, 1]) for (let i = 0; i < 9; i++) dots.push({ side, i, e: el('div', L, 'dot', { width: '13px', height: '13px', background: DOTC[(i * 3 + (side > 0 ? 5 : 0)) % DOTC.length], marginLeft: '-6.5px', marginTop: '-6.5px', top: px(CY) }) });
  const link = [0, 1, 2].map(() => el('div', L, 'dot', { width: '8px', height: '8px', background: '#fff', marginLeft: '-4px', marginTop: '-4px', top: px(CY) }));
  const circ = el('div', L, 'circ', { width: '176px', height: '176px', left: 0, top: 0 });
  const glyphs = LIST.map(([n]) => { const d = el('div', circ, 'c', { left: '50%', top: '50%' }, glyph(n, PLAT[n].fill, 94)); return d; });
  const label = el('div', L, 'c nowrap', { left: px(CX), top: px(CY + 148), font: '500 26px Inter', color: 'rgba(255,255,255,.92)', letterSpacing: '-.01em' });
  return {
    TILE: [CX - 135, CY], CIRC: [CX + 135, CY],
    idx(t) { return clamp(Math.floor((t - T0) / STEP), 0, LIST.length - 1); },
    update(t) {
      if (!show('s5', t, ...SEG.s5)) return;
      const k = this.idx(t), ks = T0 + k * STEP;
      L.style.background = LIST[k][1];
      const drift = (t - T0) * 18;
      dots.forEach(d => { d.e.style.left = px(CX + d.side * (330 + d.i * 112) - drift * d.side * -1); d.e.style.opacity = .9; });
      link.forEach((d, i) => { d.style.left = px(CX - 17 + i * 17); d.style.opacity = .55 + .45 * Math.max(0, Math.sin((t * 7 - i) )); });
      const enter = back(P(t, 4.88, 5.08)), sw = k ? back(P(t, ks, ks + .2)) : 1, ex = E(t, 7.0, 7.14);
      put(circ, this.CIRC[0], this.CIRC[1], (.55 + .45 * enter) * (k ? .9 + .1 * sw : 1) * (1 - .4 * ex), P(t, 4.88, 4.96) * (1 - ex));
      glyphs.forEach((g, i) => { g.style.opacity = i === k ? 1 : 0; g.style.transform = `translate(-50%,-50%) scale(${(i === k ? .7 + .3 * sw : 1).toFixed(3)})`; });
      label.textContent = PLAT[LIST[k][0]].name;
      label.style.opacity = P(t, 4.98, 5.1) * (1 - ex);
    },
  };
})();

/* =====================================================================
   6  "ISP Agency ✓" / "All in one place, less pressure."
   ===================================================================== */
const S6 = (() => {
  const L = $('#s6');
  const ICON = 104, GAP = 32;
  const block = el('div', L, 'abs', { top: px(CY), transform: 'translateY(-50%)' });
  const pill = el('div', block, 'pill', {}, 'ISP Agency <svg width="17" height="17" viewBox="0 0 12 12"><path d="M2 6.3l2.5 2.4L10 3.3" fill="none" stroke="#474B60" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  const mk = (txt, times) => {
    const d = el('div', block, 'nowrap', { font: '400 60px Inter', letterSpacing: '-.025em', lineHeight: 1.12 });
    return txt.split(/(?<= )/).map((w, i) => { const s = el('span', d, 'word'); s.textContent = w; return { s, at: times[i] }; });
  };
  const l1 = mk('All in one place,', [7.24, 7.31, 7.38, 7.45]);
  const l2 = mk('less pressure.', [7.7, 7.8]);
  pill.style.marginBottom = '10px';
  return {
    ICON, pos: null,
    measure() {
      const bw = block.getBoundingClientRect().width;
      const left = CX - (ICON + GAP + bw) / 2;
      block.style.left = px(left + ICON + GAP);
      this.pos = [left + ICON / 2, CY];
    },
    update(t) {
      if (!show('s6', t, ...SEG.s6, .1, 0)) return;
      const pp = E(t, 7.14, 7.3, OUT);
      pill.style.opacity = pp; pill.style.transform = `translateY(${((1 - pp) * 8).toFixed(2)}px)`;
      const ex = P(t, 8.38, 8.46);
      [...l1, ...l2].forEach(w => {
        const p = E(t, w.at, w.at + .14, OUT), dk = E(t, w.at + .05, w.at + .35);
        w.s.style.opacity = p; blur(w.s, (1 - p) * 7);
        w.s.style.color = `rgb(${lerp(160, 47, dk) | 0},${lerp(164, 51, dk) | 0},${lerp(182, 71, dk) | 0})`;
      });
      block.style.opacity = 1 - ex;
    },
  };
})();

/* =====================================================================
   7  "Video is ready" card + confetti
   ===================================================================== */
const S7 = (() => {
  const L = $('#s7');
  const grp = el('div', L, 'c nowrap', { left: px(CX), top: px(CY), display: 'flex', alignItems: 'center', gap: '36px' });
  const tile = tileEl(grp, 'pink', 132); tile.style.position = 'relative';
  const card = el('div', grp, 'card');
  el('div', card, '', { font: '600 60px Inter', color: '#23263A', letterSpacing: '-.025em' }, 'Video is ready');
  el('div', card, '', { font: '400 36px Inter', color: '#4B4E62', marginTop: '6px', letterSpacing: '-.015em' }, 'ISP Agency');
  const COL = ['#111114', '#D63B2F', '#1F7A55', '#E58FD6', '#E4E33A', '#A78BFA', '#A9C7F5', '#2E9E6B', '#C02E25', '#111114'];
  const conf = [];
  for (let i = 0; conf.length < 30 && i < 400; i++) {
    const x0 = 80 + hash(i * 9.2) * 1760, y0 = 60 + hash(i * 4.4) * 860;
    if (Math.abs(x0 - CX) < 460 && Math.abs(y0 - CY) < 150) continue;          // keep the card clear
    const sz = 20 + hash(i * 3.3) * 14, n = conf.length;
    conf.push({ e: el('div', L, 'dot', { width: px(sz), height: px(sz), background: COL[n % COL.length], marginLeft: px(-sz / 2), marginTop: px(-sz / 2) }),
      x0, y0, vx: (hash(i * 7.1) - .5) * 260, vy: -150 - hash(i * 1.7) * 250, d: hash(i * 2.9) * .32 });
  }
  return {
    tilePos() { const r = tile.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2]; },
    update(t) {
      if (!show('s7', t, ...SEG.s7, .1, 0)) return;
      const p = E(t, 8.4, 8.62, OUT);
      card.style.opacity = p; card.style.transform = `translateX(${((1 - p) * 16).toFixed(2)}px)`; blur(card, (1 - p) * 8);
      const tp = back(P(t, 8.4, 8.66)); tile.style.transform = `scale(${(.75 + .25 * tp).toFixed(4)})`; tile.style.opacity = P(t, 8.4, 8.5);
      conf.forEach(c => {
        const tau = t - 8.4 - c.d;
        if (tau <= 0) { c.e.style.opacity = 0; return; }
        c.e.style.left = px(c.x0 + c.vx * tau); c.e.style.top = px(c.y0 + c.vy * tau + 1500 * tau * tau);
        c.e.style.opacity = 1; c.e.style.transform = `scale(${back(Math.min(1, tau / .14)).toFixed(3)})`;
      });
    },
  };
})();

/* =====================================================================
   HERO TILE — the one green tile that travels 2 → 3 → 4 → 5 → 6
   ===================================================================== */
const hero = tileEl($('#hero'), 'green', 150);
const heroLime = el('div', hero, 'abs', { inset: 0, borderRadius: 'inherit', background: 'linear-gradient(160deg,#DCEB62 0%,#CEE04A 55%,#BFD43C 100%)', opacity: 0, zIndex: -1 });
hero.style.zIndex = 0; hero.querySelector('img').style.position = 'relative';
function updateHero(t) {
  let x, y, s, o = 1, lime = 0;
  const s4 = S4.iconPos(Math.min(t, 4.6)), [x6, y6] = S6.pos;
  if (t < 2.42 || t >= 8.46) { hero.style.visibility = 'hidden'; return; }
  hero.style.visibility = 'visible';
  if (t < 2.62) { const g = back(P(t, 2.42, 2.52)), m = E(t, 2.5, 2.62); [x, y] = [lerp(S2.markPos[0], CX, m), lerp(S2.markPos[1], CY, m)]; s = lerp(150 * g, 210, m); o = P(t, 2.42, 2.45); }
  else if (t < 3.62) { x = CX; y = CY; s = 210 * (1 + .03 * Math.sin((t - 2.6) * 3)); }
  else if (t < 4.74) { const p = E(t, 3.62, 3.82); x = lerp(CX, s4.x, p); y = CY; s = lerp(210, 96, p); }
  else if (t < 7.02) { const p = E(t, 4.74, 4.92); x = lerp(s4.x, S5.TILE[0], p); y = CY; s = lerp(96, 176, p); lime = p; }
  else { const p = E(t, 7.02, 7.2); x = lerp(S5.TILE[0], x6, p); y = lerp(CY, y6, p); s = lerp(176, S6.ICON, p); lime = 1 - p; o = 1 - P(t, 8.38, 8.46); }
  sizeTile(hero, s); put(hero, x, y, 1, o);
  heroLime.style.opacity = lime;
}

/* glitch blocks for the cut from 1 → 2 */
const blocks = [];
for (let gy = 0; gy < 17; gy++) for (let gx = 0; gx < 30; gx++) blocks.push(el('div', $('#fx'), 'abs', { left: px(gx * 64), top: px(gy * 64), width: '64px', height: '64px', background: ['#9FB0EA', '#C4CDF3', '#8090D0', '#B3C0F0'][(gx * 7 + gy * 3) % 4], opacity: 0 }));
function updateFx(t) {
  const f = Math.round(t * FPS), dens = t >= 1.76 && t < 1.92 ? .32 * Math.sin(Math.PI * P(t, 1.76, 1.92)) : 0;
  blocks.forEach((b, i) => { b.style.opacity = dens && hash(i * 1.37 + f * 17.1) < dens ? .85 : 0; });
}

/* ---------- render ---------- */
function renderAt(t) {
  S1.update(t); S2.update(t); S3.update(t); S4.update(t); S5.update(t); S6.update(t); S7.update(t);
  updateHero(t); updateFx(t);
}
window.renderAt = renderAt;

(async function init() {
  await document.fonts.ready;
  await Promise.all([...document.fonts].map(f => f.load().catch(() => {})));
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  ['s2', 's4', 's6', 's7'].forEach(id => { $('#' + id).style.visibility = 'visible'; });
  S1.measure(); S2.measure(); S4.measure(); S6.measure();
  ['s2', 's4', 's6', 's7'].forEach(id => { $('#' + id).style.visibility = 'hidden'; });
  if (/render/.test(location.search)) { document.body.classList.add('render'); renderAt(0); window.READY = true; return; }
  const vp = $('#viewport'), aud = $('#aud'), scrub = $('#scrub'), tc = $('#tc'), btn = $('#play');
  scrub.max = TIMING.frames - 1;
  const fit = () => { const k = Math.min((innerHeight - 44) / H, innerWidth / W); vp.style.transform = `translateX(${-W * k / 2}px) scale(${k})`; };
  fit(); addEventListener('resize', fit);
  let playing = true, t0 = performance.now(), cur = 0;
  const startAudio = () => { try { aud.currentTime = cur; aud.play().catch(() => {}); } catch (e) {} };
  btn.onclick = () => { playing = !playing; btn.textContent = playing ? 'Pause' : 'Play'; if (playing) { t0 = performance.now() - cur * 1000; startAudio(); } else aud.pause(); };
  scrub.oninput = () => { cur = scrub.value / FPS; t0 = performance.now() - cur * 1000; if (playing) startAudio(); };
  (function loop() {
    if (playing) { cur = (performance.now() - t0) / 1000; if (cur >= DUR) { cur = 0; t0 = performance.now(); startAudio(); } }
    renderAt(cur); scrub.value = Math.floor(cur * FPS); tc.textContent = cur.toFixed(2) + 's';
    requestAnimationFrame(loop);
  })();
})();
