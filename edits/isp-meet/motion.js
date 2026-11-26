/* Meet ISP Agency — the reference reel's screen animation with ISP content, with long smooth glides between scenes.
 * 1920x1080 · 30 fps · 10.333 s (310 frames, the reel's length) · soundtrack: the reel's own audio.
 * Every frame is a pure function of time: window.renderAt(seconds).
 *
 * One ISP tile travels through the whole film (0.4–0.5 s eased glides): it forms from the logo's blocks in the
 * centre of the orbit, glides to the typed line's icon, grows into the big lime tile of the platform screens,
 * glides to the "ISP Agency ✓" icon and finally lands as the pink "ready" tile.
 *
 *  1  0.00–1.50  "M e e t" letters drift in and glide together, "Meet" builds in the centre, the dots line up
 *  2  1.50–2.30  left dots glide into the ISP mark, "Meet" glides and becomes "Agency", lavender fades up
 *  3  2.28–3.82  the mark streams into the centre as the green tile, platforms slide out, two beats, flow back in
 *  4  3.60–4.50  glow; the tile glides to the line's icon; "Let's make your video better" eases in word by word
 *  5  4.50–7.20  the tile grows into the big lime tile, colour floods out of it, platforms slide through like a carousel
 *  6  7.20–8.20  the tile glides to the "ISP Agency ✓" icon; "All in one place, less pressure." eases in
 *  7  8.20–end   the tile glides into the pink "ready" tile; the card slides up; confetti
 */
'use strict';
const W = 1920, H = 1080, CX = 960, CY = 540, FPS = 30, FRAMES = 310, DUR = FRAMES / FPS;
const SEG = { s1: [0, 2.1], s2: [1.48, 2.9], s3: [2.3, 4.02], s4: [3.5, 5.1], s5: [4.52, 7.72], s6: [7.2, 8.62], s7: [8.12, DUR + 1] };
window.TIMING = { FPS, DUR, W, H, frames: FRAMES };
const LOGO = 'logos/isp/isp_logo_black.svg';

/* ---------- math ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {
  const B = (u, a, b) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; let lo = 0, hi = 1, u = p; for (let i = 0; i < 24; i++) { u = (lo + hi) / 2; if (B(u, x1, x2) < p) lo = u; else hi = u; } return B(u, y1, y2); };
}
const IO = bez(.65, 0, .35, 1), OUT = bez(.16, .84, .3, 1), INQ = bez(.6, 0, .9, .5), RAMP = bez(.35, .1, .55, 1);
const E = (t, a, b, f = IO) => f(P(t, a, b));
const back = p => { if (p <= 0) return 0; if (p >= 1) return 1; const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2; };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const inWin = (t, a, b) => t >= a && t < b;
const mix = (a, b, p) => { const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
/* keyframes [[t, x, y, o], ...] eased in-out between keys */
function kf(keys, t, f = IO, glide = 0) {
  if (t < keys[0][0]) return { x: keys[0][1], y: keys[0][2], o: 0 };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b[0]) { const p = f(P(t, glide ? Math.max(a[0], b[0] - glide) : a[0], b[0])); return { x: lerp(a[1], b[1], p), y: lerp(a[2], b[2], p), o: lerp(a[3], b[3], p) }; }
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
function show(id, t, a, b) { const L = $('#' + id), v = t >= a && t < b; L.style.visibility = v ? 'visible' : 'hidden'; return v; }
function tileEl(parent, cls, size) { const t = el('div', parent, 'tile ' + cls, { width: px(size), height: px(size), left: 0, top: 0 }); el('img', t).src = LOGO; return t; }
function rectOf(e) { const r = e.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(), k = s.width / W; return { x: (r.left - s.left + r.width / 2) / k, y: (r.top - s.top + r.height / 2) / k, w: r.width / k, h: r.height / k }; }

/* mosaic: grid blocks of a colour flashing over a layer for a couple of frames (the reel's switch glitch) */
function mosaic(parent, cell = 96) {
  const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), b = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) b.push(el('div', parent, 'abs', { left: px(x * cell), top: px(y * cell), width: px(cell), height: px(cell), opacity: 0, zIndex: 5 }));
  return (t, a, b2, colors, dens = .45, op = 1) => {
    const on = inWin(t, a, b2), f = Math.round(t * FPS);
    b.forEach((e, i) => {
      if (!on || hash(i * 1.37 + f * 17.1) > dens) { e.style.opacity = 0; return; }
      e.style.opacity = op * (.6 + .4 * hash(i * 3.1 + f)); e.style.background = colors[(i + f) % colors.length];
    });
  };
}

/* ---------- platform glyphs ---------- */
const PLAT = {
  instagram: { name: 'Instagram', fill: 'url(#gIG)', bg: 'radial-gradient(circle at 30% 107%,#FDF497 0%,#FDF497 6%,#FD5949 45%,#D6249F 62%,#285AEB 92%)', dot: '#F07FB8' },
  youtube: { name: 'YouTube', fill: '#FF0000', bg: '#FF0000', dot: '#FF6B6B' },
  facebook: { name: 'Facebook', fill: '#0866FF', bg: '#0866FF', dot: '#7FB6F5' },
  tiktok: { name: 'TikTok', fill: '#111', bg: '#111', dot: '#7DF5F1', glitch: true },
  x: { name: 'X', fill: '#111', bg: '#111', dot: '#E6E6EA' },
  linkedin: { name: 'LinkedIn', fill: '#0A66C2', bg: '#0A66C2', dot: '#C9B3F5' },
  snapchat: { name: 'Snapchat', fill: '#fff', stroke: '#111', bg: '#FFFC00', dot: '#E4E33A' },
  whatsapp: { name: 'WhatsApp', fill: '#25D366', bg: '#25D366', dot: '#B9E36A' },
};
function glyph(name, fill, size) {
  const b = PLAT[name], d = ICONS[name];
  const st = b.stroke && fill === '#fff' ? ` stroke="${b.stroke}" stroke-width=".9" stroke-linejoin="round"` : '';
  let inner = `<path d="${d}" fill="${fill}"${st}/>`;
  if (b.glitch) inner = `<path d="${d}" fill="#25F4EE" transform="translate(-.55 -.45)"/><path d="${d}" fill="#FE2C55" transform="translate(.55 .45)"/>` + inner;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${inner}</svg>`;
}
function appIcon(parent, name, size) {
  const t = el('div', parent, 'tile', { width: px(size), height: px(size), background: PLAT[name].bg, left: 0, top: 0 },
    glyph(name, '#fff', Math.round(size * (name === 'youtube' ? .62 : .54))));
  if (PLAT[name].bg === '#111') t.style.boxShadow = 'inset 0 0 0 2px rgba(255,255,255,.22), inset 0 2px 0 rgba(255,255,255,.25)';
  return t;
}

/* =====================================================================
   1  MEET — big letters drift and glide, "Meet" builds in the centre, the dots line up
   ===================================================================== */
const S1 = (() => {
  const L = $('#s1');
  const FONT = '500 190px Inter', COL = '#D7DFF6';
  const letters = [
    { ch: 'M', keys: [[0, 442, 296, 1], [.6, 442, 300, 1], [.95, 428, 478, 1], [1.22, 560, 530, 0]] },
    { ch: 'e', keys: [[.62, 905, 300, 0], [.75, 950, 270, 1], [.95, 994, 249, 1], [1.25, 930, 400, 0]], blue: true },
    { ch: 'e', keys: [[.7, 560, 690, 0], [.83, 590, 685, 1], [.97, 618, 680, 1], [1.27, 842, 640, 0]] },
    { ch: 't', keys: [[.78, 1525, 655, 0], [.9, 1500, 650, 1], [1.0, 1478, 646, 1], [1.3, 1270, 600, 0]] },
  ];
  letters.forEach(l => { l.e = el('div', L, 'c nowrap', { font: FONT, color: COL }); l.e.textContent = l.ch; });
  const word = el('div', L, 'c nowrap', { font: '500 70px Inter', color: '#E8ECF8', left: px(CX), top: px(CY), letterSpacing: '-.01em' });
  const wl = 'Meet'.split('').map(ch => { const s = el('span', word, 'word'); s.textContent = ch; return s; });
  const D = (sh, col, sz, keys) => ({ sh, col, sz, keys });
  const dots = [
    D('c', '#EEF0F6', 26, [[0, 943, 282, 1], [.6, 943, 290, 1], [.95, 1290, 436, 1], [1.3, 1226, 540, 1], [1.62, 1512, 540, 1]]),
    D('s', '#EEF0F6', 30, [[0, 1475, 840, 1], [.6, 1480, 830, 1], [.95, 1660, 660, 1], [1.3, 1134, 430, 1], [1.62, 1234, 540, 1]]),
    D('s', '#E59ADF', 26, [[.66, 800, 420, 0], [.8, 795, 430, 1], [1.3, 798, 420, 1], [1.55, 840, 470, 0]]),
    D('c', '#7FB6F5', 26, [[.66, 940, 520, 0], [.8, 935, 540, 1], [1.3, 677, 540, 1], [1.62, 456, 540, 1]]),
    D('s', '#F0704B', 28, [[.72, 1100, 650, 0], [.86, 1106, 655, 1], [1.3, 778, 663, 1], [1.58, 778, 663, 0]]),
    D('c', '#9C8CF0', 26, [[.7, 380, 700, 0], [.84, 403, 705, 1], [1.3, 798, 660, 1], [1.62, 691, 540, 1]]),
    D('s', '#EEF0F6', 28, [[.74, 823, 708, 0], [.88, 823, 708, 1], [1.3, 1128, 666, 1], [1.62, 1352, 540, 1]]),
    D('s', '#B9E36A', 28, [[.8, 1660, 660, 0], [.92, 1660, 660, 1], [1.3, 1226, 600, 1], [1.52, 1226, 600, 0]]),
    D('s', '#38C6E8', 26, [[1.0, 600, 540, 0], [1.15, 600, 540, 1], [1.4, 570, 540, 1], [1.62, 560, 540, 1]]),
    D('c', '#6A6E80', 24, [[1.0, 800, 420, 0], [1.15, 800, 420, 1], [1.3, 798, 420, 1], [1.45, 798, 420, 0]]),
  ];
  dots.forEach(d => d.e = el('div', L, 'abs', { width: px(d.sz), height: px(d.sz), marginLeft: px(-d.sz / 2), marginTop: px(-d.sz / 2), background: d.col, borderRadius: d.sh === 'c' ? '50%' : '28%' }));
  const ring = el('div', L, 'c', { width: '760px', height: '760px', left: px(CX), top: px(CY), borderRadius: '50%', opacity: 0,
    background: 'repeating-radial-gradient(circle, rgba(255,255,255,.08) 0 2px, transparent 2px 24px)', WebkitMaskImage: 'radial-gradient(circle, #000 15%, transparent 68%)' });
  return {
    dots,
    dotAt(i, t) { const d = dots[i], a = kf(d.keys, t); return { x: a.x + 4 * Math.sin(t * 1.9 + i * 2.1), y: a.y + 4 * Math.cos(t * 1.6 + i * 1.7), o: a.o }; },
    update(t) {
      if (!show('s1', t, ...SEG.s1)) return;
      letters.forEach((l, li) => {
        const a = kf(l.keys, t);
        put(l.e, a.x + 5 * Math.sin(t * 1.7 + li * 1.3), a.y + 4 * Math.cos(t * 1.4 + li), 1 - .25 * E(t, 1.0, 1.3), a.o);
        l.e.style.color = l.blue ? mix('#8DB8F2', '#D7DFF6', E(t, .75, 1.0)) : COL;
        blur(l.e, 6 * E(t, 1.05, 1.3));
      });
      const sp = E(t, 1.12, 1.4);
      wl.forEach((s, i) => { const at = i ? 1.12 : 1.02, p = E(t, at, at + .2, OUT); s.style.opacity = p; s.style.marginLeft = i ? px(lerp(30, 0, sp)) : '0px'; });
      word.style.opacity = t < 1.5 ? 1 : 0;                       // from 1.5 the morph copy in scene 2 takes over
      dots.forEach((d, i) => { const a = this.dotAt(i, t); d.e.style.left = px(a.x); d.e.style.top = px(a.y); d.e.style.opacity = t < 1.5 ? a.o : 0; });
      const r = P(t, 1.3, 1.9); ring.style.opacity = r > 0 ? .8 * Math.sin(Math.PI * r) : 0;
      ring.style.transform = `translate(-50%,-50%) scale(${(.55 + .6 * r).toFixed(3)})`;
    },
  };
})();

/* =====================================================================
   2  ISP LOGO — the left dots glide into the mark, "Meet" glides and becomes "Agency", lavender fades up
   ===================================================================== */
const S2 = (() => {
  const L = $('#s2');
  const bg = el('div', L, 'abs', { inset: 0, background: 'linear-gradient(120deg,#A9B7EE 0%,#BCC7F3 45%,#D3D9F6 100%)', opacity: 0 });
  const rings = el('div', L, 'c', { width: '1700px', height: '1700px', left: px(CX), top: px(CY), borderRadius: '50%',
    background: 'repeating-radial-gradient(circle, rgba(60,70,130,.10) 0 2px, transparent 2px 25px)',
    WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.65) 28%, transparent 60%)' });
  const lock = el('div', L, 'c nowrap', { left: px(CX), top: px(CY), display: 'flex', alignItems: 'center', gap: '30px' });
  const mark = el('img', lock, '', { height: '205px', display: 'block' }); mark.src = LOGO;
  const word = el('div', lock, 'nowrap', { font: '800 150px Inter', color: '#0E0E13', letterSpacing: '-0.045em', lineHeight: 1 });
  const chars = 'Agency'.split('').map(ch => { const s = el('span', word, 'word'); s.textContent = ch; return s; });
  /* morph copies of scene 1's "Meet" and dots */
  const meet = el('div', L, 'c nowrap', { font: '500 70px Inter', letterSpacing: '-.01em' }); meet.textContent = 'Meet';
  const mdots = S1.dots.map(d => el('div', L, 'abs', { width: px(d.sz), height: px(d.sz), marginLeft: px(-d.sz / 2), marginTop: px(-d.sz / 2), background: d.col, borderRadius: d.sh === 'c' ? '50%' : '28%' }));
  const blocks = (window.LOGO_BLOCKS || []).map(([dx, dy], i) => ({ dx, dy, d: hash(i * 2.3) * .08, e: el('div', L, 'abs', { width: '13px', height: '13px', background: '#0E0E13', opacity: 0 }) }));
  return {
    markPos: [CX - 300, CY], wordRect: { x: CX + 140, y: CY },
    measure() { const r = rectOf(mark); this.markPos = [r.x, r.y]; this.wordRect = rectOf(word); },
    update(t) {
      if (!show('s2', t, ...SEG.s2)) return;
      const fade = E(t, 1.7, 2.05);                                  // dark → lavender
      bg.style.opacity = fade;
      rings.style.opacity = E(t, 1.9, 2.2);
      rings.style.transform = `translate(-50%,-50%) scale(${(1 + (t - 1.8) * .09).toFixed(4)})`;
      /* "Meet" glides to where "Agency" sits, grows, darkens as the screen lightens, then hands over */
      const g = E(t, 1.5, 2.05), [wx, wy] = [this.wordRect.x, this.wordRect.y];
      put(meet, lerp(CX, wx - 40, g), lerp(CY, wy, g), lerp(1, 1.55, g), (t >= 1.5 ? 1 : 0) * (1 - E(t, 1.9, 2.08)));
      meet.style.color = mix('#E8ECF8', '#0E0E13', fade);
      blur(meet, 5 * E(t, 1.88, 2.08));
      chars.forEach((c, i) => { const p = E(t, 1.88 + i * .04, 2.1 + i * .04, OUT); c.style.opacity = p; blur(c, (1 - p) * 9); c.style.transform = `translateY(${((1 - p) * 14).toFixed(2)}px)`; });
      /* dots: the left ones glide into the mark and merge, the right ones glide out and fade */
      S1.dots.forEach((d, i) => {
        const a = S1.dotAt(i, Math.min(t, 1.62)), left = a.x < CX, m = E(t, 1.5, 1.95);
        const x = left ? lerp(a.x, this.markPos[0], m) : a.x + 260 * m, y = left ? lerp(a.y, this.markPos[1], m) : a.y;
        const e = mdots[i]; e.style.left = px(x); e.style.top = px(y); e.style.transform = `scale(${(left ? 1 - .6 * m : 1).toFixed(3)})`;
        e.style.opacity = ((t >= 1.5 ? a.o : 0) * (left ? 1 - E(t, 1.8, 1.95) : 1 - E(t, 1.6, 1.95))).toFixed(3);
      });
      /* the mark forms where the dots met */
      const mk = E(t, 1.78, 2.1, OUT);
      mark.style.opacity = t < 2.22 ? mk : 0;
      mark.style.transform = `scale(${lerp(.6, 1, mk).toFixed(4)}) rotate(${lerp(-25, 0, mk).toFixed(2)}deg)`;
      blur(mark, 8 * (1 - mk));
      /* exit (2.28–2.75): the mark breaks into blocks that stream into the centre (they become the tile); the word slides off and fades */
      blocks.forEach(b => {
        if (t < 2.22 || t > 2.86) { b.e.style.opacity = 0; return; }
        const m = E(t, 2.22 + b.d, 2.74 + b.d), x = lerp(this.markPos[0] + b.dx, CX + b.dx * .3, m), y = lerp(this.markPos[1] + b.dy, CY + b.dy * .3, m);
        b.e.style.left = px(x - 6.5); b.e.style.top = px(y - 6.5); b.e.style.opacity = (1 - E(t, 2.55, 2.8)).toFixed(3);
      });
      const wo = E(t, 2.22, 2.6);
      word.style.opacity = 1 - wo; word.style.transform = `translateX(${(60 * wo).toFixed(2)}px)`; blur(word, 8 * wo);
    },
  };
})();

/* =====================================================================
   3  ORBIT — the platforms come out of the tile, two beats, then flow back into it
   ===================================================================== */
const S3 = (() => {
  const L = $('#s3');
  el('div', L, 'c', { width: '1300px', height: '1300px', left: px(CX), top: px(CY), borderRadius: '50%',
    background: 'repeating-radial-gradient(circle, rgba(255,255,255,.05) 0 2px, transparent 2px 24px)', WebkitMaskImage: 'radial-gradient(circle, #000 8%, transparent 55%)' });
  const G = 190, C = { T: [0, -1], TR: [1, -1], R: [1, 0], BR: [1, 1], B: [0, 1], BL: [-1, 1], L: [-1, 0], TL: [-1, -1] };
  const icon = n => { const e = appIcon(L, n, 124); e.style.borderRadius = ['facebook', 'whatsapp', 'x', 'snapchat'].includes(n) ? '50%' : '28%'; return e; };
  const dot = (col, sz) => el('div', L, 'abs', { width: px(sz), height: px(sz), marginLeft: px(-sz / 2), marginTop: px(-sz / 2), borderRadius: '50%', background: col });
  const B1 = [2.95, 3.2], B2 = [3.2, 3.45];
  const items = [
    { e: icon('instagram'), cells: ['T'], out: B2, at: 2.62 },
    { e: icon('youtube'), cells: ['R'], out: B2, at: 2.67 },
    { e: icon('facebook'), cells: ['B'], out: B2, at: 2.72 },
    { e: icon('tiktok'), cells: ['BL', 'L'], move: B1, out: B2, at: 2.77 },
    { e: dot('#B9E36A', 64), cells: ['L', 'BL'], move: B1, shrink: B1, at: 2.65 },
    { e: dot('#38C6E8', 64), cells: ['TR'], shrink: B2, at: 2.7 },
    { e: dot('#E6E6EA', 36), cells: ['TL'], at: 2.75 },
    { e: dot('#C9B3F5', 36), cells: ['BR'], at: 2.8 },
    { e: icon('x'), cells: ['T'], in: B2 },
    { e: icon('linkedin'), cells: ['R'], in: B2 },
    { e: icon('whatsapp'), cells: ['B'], in: B2 },
    { e: icon('snapchat'), cells: ['L'], in: B2 },
  ];
  return {
    update(t) {
      if (!show('s3', t, ...SEG.s3)) return;
      $('#s3').style.opacity = E(t, 2.34, 2.76);
      const back2 = E(t, 3.46, 3.86);                                     // everything flows back into the tile
      items.forEach(o => {
        const m = o.move ? E(t, ...o.move) : 0, a = C[o.cells[0]], b = C[o.cells[1] || o.cells[0]];
        let x = lerp(a[0], b[0], m) * G, y = lerp(a[1], b[1], m) * G, sc = 1, op = 1;
        if (o.at != null) { const p = E(t, o.at, o.at + .38); x *= p; y *= p; sc = .3 + .7 * back(P(t, o.at, o.at + .42)); op = E(t, o.at, o.at + .12); }
        if (o.in) { const p = E(t, o.in[0], o.in[1]); sc = .6 + .4 * p; op = p; }
        if (o.out) op *= 1 - E(t, ...o.out);
        if (o.shrink) sc *= 1 - .45 * E(t, ...o.shrink);
        x *= 1 - back2; y *= 1 - back2; sc *= 1 - .7 * back2; op *= 1 - E(t, 3.72, 3.86);
        put(o.e, CX + x, CY + y, sc, op);
      });
    },
  };
})();

/* =====================================================================
   4  "Let's make your video better"
   ===================================================================== */
const S4 = (() => {
  const L = $('#s4');
  const glow = el('div', L, 'c', { width: '700px', height: '700px', left: px(CX), top: px(CY), borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0))' });
  const ICON = 128, GAP = 36;
  const line = el('div', L, 'abs nowrap', { top: px(CY), font: '400 74px Inter', color: '#3A3E55', letterSpacing: '-.012em', transform: 'translateY(-50%)' });
  const words = [['Let’s ', 400, 3.98], ['make ', 400, 4.07], ['your ', 400, 4.15], ['video ', 400, 4.22], ['better', 700, 4.3]].map(([w, fw, at]) => {
    const s = el('span', line, 'word', { fontWeight: fw, color: fw === 700 ? '#1F2236' : '#3A3E55' }); s.textContent = w; return { s, at };
  });
  return {
    ICON, icon: [CX, CY],
    measure() {
      const tw = words.reduce((s, w) => s + w.s.getBoundingClientRect().width, 0) / ($('#stage').getBoundingClientRect().width / W);
      const left = CX - (ICON + GAP + tw) / 2;
      this.icon = [left + ICON / 2, CY]; line.style.left = px(left + ICON + GAP);
    },
    update(t) {
      if (!show('s4', t, ...SEG.s4)) return;
      $('#s4').style.opacity = E(t, 3.55, 4.0);
      glow.style.opacity = (Math.sin(Math.PI * P(t, 3.6, 4.05)) * .9).toFixed(3);
      const ex = E(t, 4.42, 4.75);
      words.forEach(w => { const p = E(t, w.at, w.at + .22, OUT); w.s.style.opacity = p * (1 - ex); w.s.style.transform = `translateY(${((1 - p) * 16).toFixed(2)}px)`; blur(w.s, (1 - p) * 6 + ex * 10); });
    },
  };
})();

/* =====================================================================
   5  PLATFORMS — the colour floods out from the tile; the platforms slide through the slot like a carousel
   ===================================================================== */
const S5 = (() => {
  const L = $('#s5');
  const LIST = [['instagram', '#0B62F2'], ['youtube', '#BF95F0'], ['facebook', '#0B8E91'], ['tiktok', '#F26E45'], ['linkedin', '#879B5C'], ['x', '#0A8CFF']];
  const AT = [5.2, 5.78, 6.27, 6.72, 7.07];                // beats where the next platform lands
  const HALF = .22;                                          // each slide takes 0.4 s, centred on its beat
  const CIRC_BG = ['#E4E8F2', '#ECE9F3', '#CDBDF3', '#ECE6EC', '#D3E4F5', '#D5E6FA'];
  const DOTC = ['#F2F2F6', '#A6E3A0', '#F0704B', '#E59ADF', '#9C8CF0', '#F2F2F6', '#7FB6F5', '#E4E33A'];
  const dots = [];
  for (const side of [-1, 1]) for (let i = 0; i < 5; i++) dots.push({ side, i, e: el('div', L, 'dot', { width: '25px', height: '25px', marginLeft: '-12.5px', marginTop: '-12.5px', top: px(CY), background: DOTC[(i * 3 + (side > 0 ? 5 : 0)) % DOTC.length] }) });
  const link = [0, 1, 2].map(() => el('div', L, 'dot', { width: '11px', height: '11px', background: '#fff', marginLeft: '-5.5px', marginTop: '-5.5px', top: px(CY) }));
  const circs = LIST.map(([n], i) => { const c = el('div', L, 'circ', { width: '280px', height: '280px', left: 0, top: 0, background: `radial-gradient(circle at 40% 35%, #FFFFFF 0%, ${CIRC_BG[i]} 75%)` }); el('div', c, 'c', { left: '50%', top: '50%' }, glyph(n, PLAT[n].fill, 150)); return c; });
  const labels = LIST.map(([n]) => { const e = el('div', L, 'c nowrap', { left: px(CX + 224), top: px(CY + 220), font: '500 42px Inter', color: 'rgba(255,255,255,.9)', letterSpacing: '-.01em', opacity: 0 }); e.textContent = PLAT[n].name; return e; });
  return {
    TILE: [CX - 224, CY], CIRC: [CX + 224, CY],
    pos(t) { return AT.reduce((s, a) => s + E(t, a - HALF, a + HALF), 0); },
    update(t) {
      if (!show('s5', t, ...SEG.s5)) return;
      /* entry: the first colour floods out of the tile as a growing circle */
      const fl = E(t, 4.6, 5.12);
      const hx = lerp(S4.icon[0], S5.TILE[0], E(t, 4.42, 5.08));          // the flood pours out of the moving tile
      L.style.clipPath = fl < 1 ? `circle(${(fl * 2300).toFixed(1)}px at ${hx.toFixed(1)}px ${CY}px)` : 'none';
      const pos = this.pos(t), k = Math.min(LIST.length - 1, Math.floor(pos)), f = pos - k;
      L.style.background = f > 0 && k + 1 < LIST.length ? mix(LIST[k][1], LIST[k + 1][1], f) : LIST[k][1];
      /* carousel: circle i sits (i - pos) slots to the right; only the slot and its neighbours show */
      const enter = E(t, 4.7, 5.16);
      circs.forEach((c, i) => {
        const d = i - pos, ad = Math.abs(d);
        const x = this.CIRC[0] + d * 330 + (i === 0 ? (1 - enter) * -448 : 0);
        const sc = (1 - .45 * Math.min(1, ad)) * (i === 0 ? .4 + .6 * enter : 1);
        put(c, x, CY, sc, clamp(1 - ad * 1.15) * (d < 0 ? clamp(1 + d * 1.8) : 1) * (i === 0 ? E(t, 4.72, 4.9) : 1));
        c.style.zIndex = d < 0 ? 0 : 2;
      });
      labels.forEach((e, i) => { e.style.opacity = (clamp(1 - Math.abs(i - pos) * 2) * E(t, 4.95, 5.1)).toFixed(3); e.style.transform = `translate(-50%,-50%) translateX(${((i - pos) * 120).toFixed(1)}px)`; });
      /* dot rows drift with the carousel and slide in from the edges */
      const dIn = E(t, 4.8, 5.2);
      dots.forEach(d => { d.e.style.left = px(CX + d.side * (535 + d.i * 215 + (1 - dIn) * 500) - pos * 60); d.e.style.opacity = dIn; });
      const n = Math.min(3, Math.floor(Math.max(0, t - 4.95) / .12));
      link.forEach((d, i) => { d.style.left = px(CX - 22 + i * 22); d.style.opacity = i < n ? .95 : 0; });
      /* exit to scene 6: the circle and dots slide away to the right */
      const ex = E(t, 7.15, 7.55);
      circs.forEach(c => { c.style.opacity = (parseFloat(c.style.opacity) * (1 - ex)).toFixed(3); });
      dots.forEach(d => { d.e.style.opacity = (dIn * (1 - ex)).toFixed(3); });
      labels.forEach(e => { e.style.opacity = (parseFloat(e.style.opacity) * (1 - ex)).toFixed(3); });
      link.forEach(d => { d.style.opacity = (parseFloat(d.style.opacity) * (1 - ex)).toFixed(3); });
    },
  };
})();

/* =====================================================================
   6  "ISP Agency ✓" / "All in one place, less pressure."
   ===================================================================== */
const S6 = (() => {
  const L = $('#s6');
  const ICON = 150, GAP = 40;
  const block = el('div', L, 'abs', { top: px(CY - 50), transform: 'translateY(-50%)' });
  const pill = el('div', block, 'pill', {}, 'ISP Agency <svg width="20" height="20" viewBox="0 0 12 12"><path d="M2 6.3l2.5 2.4L10 3.3" fill="none" stroke="#474B60" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  pill.style.marginBottom = '12px';
  const mk = (txt, times) => {
    const d = el('div', block, 'nowrap', { font: '400 52px Inter', letterSpacing: '-.03em', lineHeight: '63px' });
    return txt.split(/(?<= )/).map((w, i) => { const s = el('span', d, 'word'); s.textContent = w; return { s, at: times[i] }; });
  };
  const words = [...mk('All in one place,', [7.6, 7.67, 7.74, 7.82]), ...mk('less pressure.', [7.92, 8.02])];
  return {
    ICON, pos: [CX, CY],
    measure() {
      const r = rectOf(block), left = CX - (ICON + GAP + r.w) / 2;
      block.style.left = px(left + ICON + GAP); this.pos = [left + ICON / 2, CY - 50];
    },
    update(t) {
      if (!show('s6', t, ...SEG.s6)) return;
      $('#s6').style.opacity = E(t, 7.22, 7.7);
      const pp = E(t, 7.5, 7.72, OUT);
      pill.style.opacity = pp; pill.style.transform = `translateY(${((1 - pp) * 12).toFixed(2)}px)`;
      const ex = E(t, 8.12, 8.45);
      block.style.opacity = 1 - ex; block.style.transform = `translateY(calc(-50% - ${(30 * ex).toFixed(1)}px))`;
      words.forEach(w => {
        const p = E(t, w.at, w.at + .2, OUT), dk = E(t, w.at + .05, w.at + .5);
        w.s.style.opacity = p; w.s.style.transform = `translateY(${((1 - p) * 12).toFixed(2)}px)`;
        w.s.style.color = `rgb(${lerp(168, 46, dk) | 0},${lerp(172, 50, dk) | 0},${lerp(192, 70, dk) | 0})`;
      });
    },
  };
})();

/* =====================================================================
   7  "Video is ready" + confetti
   ===================================================================== */
const S7 = (() => {
  const L = $('#s7');
  const grp = el('div', L, 'c nowrap', { left: px(CX - 30), top: px(CY - 40), display: 'flex', alignItems: 'center', gap: '66px' });
  const tile = el('div', grp, 'tile', { width: '150px', height: '150px', position: 'relative', visibility: 'hidden' });   // place-holder: the travelling tile lands here
  const card = el('div', grp, 'card');
  el('div', card, '', { font: '600 52px Inter', color: '#23263A', letterSpacing: '-.025em' }, 'Video is ready');
  el('div', card, '', { font: '400 40px Inter', color: '#4B4E62', marginTop: '10px', letterSpacing: '-.02em' }, 'ISP Agency');
  const COL = ['#111114', '#B3262E', '#1F7A55', '#E58FD6', '#E4E33A', '#A78BFA', '#A9C7F5', '#2E8B6B', '#C02E25', '#111114', '#B9E36A', '#E9A0E3'];
  const conf = [];
  for (let i = 0; conf.length < 22 && i < 600; i++) {
    const x0 = 60 + hash(i * 9.2) * 1800, y0 = 40 + hash(i * 4.4) * 960;
    if (Math.abs(x0 - (CX - 30)) < 600 && Math.abs(y0 - (CY - 40)) < 170) continue;
    const sz = 48 + hash(i * 3.3) * 16, n = conf.length, on = 8.45 + Math.pow(hash(i * 2.9), .9) * .45;
    conf.push({ e: el('div', L, 'dot', { width: px(sz), height: px(sz), background: COL[n % COL.length], marginLeft: px(-sz / 2), marginTop: px(-sz / 2) }),
      x0, y0, vx: (hash(i * 7.1) - .5) * 40, vy: 30 + hash(i * 1.7) * 60, on, off: Math.min(9.45, on + .45 + hash(i * 5.3) * .5) });
  }
  return {
    pos: [CX - 300, CY - 40],
    measure() { const r = rectOf(tile); this.pos = [r.x, r.y]; },
    update(t) {
      if (!show('s7', t, ...SEG.s7)) return;
      $('#s7').style.opacity = E(t, 8.14, 8.6);
      const p = E(t, 8.3, 8.8, OUT);
      card.style.opacity = p; card.style.transform = `translateY(${((1 - p) * 30).toFixed(2)}px)`; blur(card, (1 - p) * 8);
      conf.forEach(c => {
        const tau = t - c.on;
        if (tau <= 0 || t >= c.off) { c.e.style.opacity = 0; return; }
        c.e.style.left = px(c.x0 + c.vx * tau); c.e.style.top = px(c.y0 + c.vy * tau);
        c.e.style.opacity = 1; c.e.style.transform = `scale(${(back(Math.min(1, tau / .2)) * (1 - E(t, c.off - .16, c.off))).toFixed(3)})`;
      });
    },
  };
})();

/* =====================================================================
   THE ISP TILE — one tile that glides through the whole film:
   centre of the orbit → the typed line's icon → the big lime tile → the "ISP Agency ✓" icon → the pink "ready" tile
   ===================================================================== */
const hero = (() => {
  const t = el('div', $('#hero'), 'tile', { width: '200px', height: '200px', left: 0, top: 0, background: 'transparent' });
  t.g = el('div', t, 'abs green', { inset: 0, borderRadius: 'inherit' });
  t.l = el('div', t, 'abs lime', { inset: 0, borderRadius: 'inherit', opacity: 0 });
  t.p = el('div', t, 'abs pink', { inset: 0, borderRadius: 'inherit', opacity: 0 });
  t.i = el('img', t, '', { position: 'relative' }); t.i.src = LOGO;
  return t;
})();
const halo = el('div', null, 'c', { width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,.9), rgba(255,255,255,0))', opacity: 0 });
$('#hero').insertBefore(halo, hero);                                  // the glow sits behind the tile
function updateHero(t) {
  if (t < 2.4) { hero.style.visibility = 'hidden'; halo.style.opacity = 0; return; }
  hero.style.visibility = 'visible';
  const A = [CX, CY], B = S4.icon, C = S5.TILE, D = S6.pos, F = S7.pos;
  const seg = (a, b, t0, t1, sa, sb) => { const p = E(t, t0, t1); return [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(sa, sb, p)]; };
  let x, y, s;
  if (t < 3.55) { [x, y, s] = [CX, CY, 200 * (.25 + .75 * back(P(t, 2.4, 2.95)))]; hero.style.opacity = E(t, 2.4, 2.6); }
  else if (t < 4.42) { [x, y, s] = seg(A, B, 3.55, 4.18, 200, S4.ICON); hero.style.opacity = 1; }
  else if (t < 7.15) { [x, y, s] = seg(B, C, 4.42, 5.08, S4.ICON, 280); hero.style.opacity = 1; }
  else if (t < 8.12) { [x, y, s] = seg(C, D, 7.15, 7.85, 280, S6.ICON); hero.style.opacity = 1; }
  else { [x, y, s] = seg(D, F, 8.12, 8.82, S6.ICON, 150); hero.style.opacity = 1; }
  hero.style.width = hero.style.height = px(s); put(hero, x, y, 1);
  const lime = E(t, 4.38, 4.6) * (1 - E(t, 7.25, 7.7)), pink = E(t, 8.2, 8.72);
  hero.l.style.opacity = lime; hero.p.style.opacity = pink; hero.g.style.opacity = 1 - pink;
  put(halo, x, y, 1, Math.sin(Math.PI * P(t, 3.5, 4.12)) * .85);
}

/* ---------- camera + render ---------- */
function camera(t) {
  const s = 1.014 + .055 * (t / DUR), x = 7 * Math.sin(t * .62) + 3 * Math.sin(t * 1.37 + 1), y = 5 * Math.sin(t * .81 + 2) + 2 * Math.sin(t * 1.9);
  $('#cam').style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${s.toFixed(5)})`;
}
function renderAt(t) { camera(t); S1.update(t); S2.update(t); S3.update(t); S4.update(t); S5.update(t); S6.update(t); S7.update(t); updateHero(t); }
window.renderAt = renderAt;

(async function init() {
  await document.fonts.ready;
  await Promise.all([...document.fonts].map(f => f.load().catch(() => {})));
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  const ids = ['s2', 's4', 's6', 's7'];
  ids.forEach(id => { $('#' + id).style.visibility = 'visible'; });
  S2.measure(); S4.measure(); S6.measure(); S7.measure();
  ids.forEach(id => { $('#' + id).style.visibility = 'hidden'; });
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
