/* Meet ISP Agency — the reference reel's screen animation, frame-matched, with ISP content.
 * 1920x1080 · 30 fps · 10.333 s (310 frames, the reel's own length) · soundtrack: the reel's own audio.
 * Every time below is the reel's time, measured frame by frame (reference/f15_sheet*.png, grid_*.png).
 * Every frame is a pure function of time: window.renderAt(seconds).
 *
 *  1  0.00–1.78  "M e e t" big letters + dots, echo frames, small "Meet" builds in the centre, dots line up
 *  2  1.78–2.57  mosaic cut, glowing dots, ISP logo + "Agency" on lavender ripples, glitch, tile pops out
 *  3  2.57–3.73  ISP tile, platforms on a 3x3 grid (2 quick steps), flash
 *  4  3.73–4.77  "Let's make your video better" typed from a fixed left edge, tile turns lime
 *  5  4.77–7.38  6 colour screens: ISP ··· Instagram/YouTube/Facebook/TikTok/LinkedIn/X, mosaic switches
 *  6  7.38–8.31  "ISP Agency ✓" + "All in one place, / less pressure." typed every 2 frames
 *  7  8.31–end   "Video is ready / ISP Agency" card + confetti
 */
'use strict';
const W = 1920, H = 1080, CX = 960, CY = 540, FPS = 30, FRAMES = 310, DUR = FRAMES / FPS;
const SEG = { s1: [0, 1.88], s2: [1.76, 2.6], s3: [2.5, 3.86], s4: [3.7, 4.8], s5: [4.72, 7.4], s6: [7.34, 8.42], s7: [8.24, DUR + 1] };
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
   1  MEET
   ===================================================================== */
const S1 = (() => {
  const L = $('#s1');
  const FONT = '500 190px Inter', COL = '#D7DFF6';
  const letters = [
    { ch: 'M', keys: [[0, 442, 296, 1], [.67, 442, 296, 1], [.73, 440, 385, 1], [.8, 432, 430, 1], [.93, 428, 478, 1], [1.07, 520, 520, 1], [1.1, 560, 530, 0]], echo: [0, 34] },
    { ch: 'e', keys: [[.69, 905, 300, 0], [.71, 905, 300, 1], [.8, 960, 262, 1], [.93, 994, 249, 1], [1.07, 905, 330, 1], [1.13, 905, 330, 1], [1.17, 905, 330, 0]], echo: [-40, 0], blue: true },
    { ch: 'e', keys: [[.77, 560, 690, 0], [.79, 560, 690, 1], [.93, 618, 680, 1], [1.07, 842, 690, 1], [1.14, 842, 690, 1], [1.18, 842, 690, 0]], echo: [0, -36] },
    { ch: 't', keys: [[.85, 1525, 655, 0], [.87, 1525, 655, 1], [.93, 1478, 646, 1], [1.07, 1270, 650, 1], [1.15, 1270, 650, 1], [1.24, 1270, 650, 0]], echo: [36, 0] },
  ];
  letters.forEach(l => {
    l.e = el('div', L, 'c nowrap', { font: FONT, color: COL }); l.e.textContent = l.ch;
    l.g = el('div', L, 'c nowrap', { font: FONT, color: COL, opacity: 0 }); l.g.textContent = l.ch;
  });
  /* small "Meet" built letter by letter in the centre */
  const word = el('div', L, 'c nowrap', { font: '500 70px Inter', color: '#E8ECF8', left: px(CX), top: px(CY), letterSpacing: '-.01em' });
  const wl = 'Meet'.split('').map(ch => { const s = el('span', word, 'word'); s.textContent = ch; return s; });
  const ghost = el('div', L, 'c nowrap', { font: '500 70px Inter', color: '#E8ECF8', opacity: 0, letterSpacing: '-.01em' }); ghost.textContent = 'Mee';
  /* dots: shape c = circle, s = rounded square */
  const D = (sh, col, sz, keys) => ({ sh, col, sz, keys });
  const dots = [
    D('c', '#EEF0F6', 26, [[0, 943, 282, 1], [.67, 943, 282, 1], [.75, 1180, 380, 1], [.93, 1290, 436, 1], [1.27, 1226, 540, 1], [1.45, 1440, 540, 1], [1.6, 1512, 540, 1]]),
    D('s', '#EEF0F6', 30, [[0, 1475, 840, 1], [.67, 1475, 840, 1], [.8, 1560, 760, 1], [.93, 1660, 660, 1], [1.27, 1134, 420, 1], [1.45, 1200, 540, 1], [1.6, 1234, 540, 1]]),
    D('s', '#E59ADF', 26, [[.7, 800, 420, 0], [.72, 800, 420, 1], [.93, 792, 436, 1], [1.27, 798, 420, 1], [1.4, 798, 420, 1], [1.5, 840, 470, 0]]),
    D('c', '#7FB6F5', 26, [[.7, 940, 520, 0], [.72, 940, 520, 1], [.93, 932, 548, 1], [1.27, 677, 540, 1], [1.45, 520, 540, 1], [1.6, 456, 540, 1]]),
    D('s', '#F0704B', 28, [[.77, 1100, 650, 0], [.79, 1100, 650, 1], [.93, 1106, 655, 1], [1.27, 778, 663, 1], [1.45, 778, 663, 1], [1.53, 778, 663, 0]]),
    D('c', '#9C8CF0', 26, [[.75, 380, 700, 0], [.77, 380, 700, 1], [.93, 403, 705, 1], [1.27, 798, 660, 1], [1.45, 720, 540, 1], [1.6, 691, 540, 1]]),
    D('s', '#EEF0F6', 28, [[.79, 823, 708, 0], [.81, 823, 708, 1], [.93, 823, 708, 1], [1.27, 1128, 666, 1], [1.45, 1300, 540, 1], [1.6, 1352, 540, 1]]),
    D('s', '#B9E36A', 28, [[.84, 1660, 660, 0], [.86, 1660, 660, 1], [.93, 1660, 660, 1], [1.27, 1226, 600, 1], [1.4, 1226, 600, .3], [1.47, 1226, 600, 0]]),
    D('s', '#38C6E8', 26, [[1.05, 600, 540, 0], [1.08, 600, 540, 1], [1.27, 600, 540, 1], [1.45, 570, 540, 1], [1.6, 560, 540, 1]]),
    D('c', '#6A6E80', 24, [[1.05, 800, 420, 0], [1.1, 800, 420, 1], [1.27, 798, 420, 1], [1.4, 798, 420, 0]]),
  ];
  dots.forEach(d => d.e = el('div', L, 'abs', { width: px(d.sz), height: px(d.sz), marginLeft: px(-d.sz / 2), marginTop: px(-d.sz / 2), background: d.col, borderRadius: d.sh === 'c' ? '50%' : '28%' }));
  const ring = el('div', L, 'c', { width: '760px', height: '760px', left: px(CX), top: px(CY), borderRadius: '50%', opacity: 0,
    background: 'repeating-radial-gradient(circle, rgba(255,255,255,.08) 0 2px, transparent 2px 24px)', WebkitMaskImage: 'radial-gradient(circle, #000 15%, transparent 68%)' });
  return {
    dots,
    update(t) {
      if (!show('s1', t, ...SEG.s1)) return;
      const echoOn = inWin(t, .867, .9) || inWin(t, 1.0, 1.034);   // the reel's two doubled frames
      letters.forEach(l => {
        const a = kf(l.keys, t, IO, .1), li = letters.indexOf(l);
        a.x += 5 * Math.sin(t * 1.7 + li * 1.3); a.y += 4 * Math.cos(t * 1.4 + li);
        put(l.e, a.x, a.y, 1, a.o);
        l.e.style.color = l.blue && t < .8 ? '#8DB8F2' : COL;
        if (echoOn && a.o > 0) put(l.g, a.x + l.echo[0], a.y + l.echo[1], 1, .55 * a.o); else l.g.style.opacity = 0;
      });
      const sp = E(t, 1.17, 1.27);                        // "M eet" tightens into "Meet"
      wl.forEach((s, i) => {
        const at = i ? 1.17 : 1.07, p = P(t, at, at + .05);
        s.style.opacity = p; s.style.marginLeft = i ? px(lerp(26, 0, sp)) : '0px';
      });
      word.style.transform = `translate(-50%,-50%) translateX(${(-130 * E(t, 1.69, 1.77)).toFixed(2)}px)`;
      dots.forEach((d, i) => { const a = kf(d.keys, t, IO, .07); a.x += 4 * Math.sin(t * 1.9 + i * 2.1); a.y += 4 * Math.cos(t * 1.6 + i * 1.7); d.e.style.left = px(a.x); d.e.style.top = px(a.y); d.e.style.opacity = a.o * (i === 5 ? 1 - P(t, 1.745, 1.77) : 1); });
      const gOn = inWin(t, 1.6, 1.634);
      put(ghost, CX - 58, CY, 1, gOn ? .5 : 0);
      const r = P(t, 1.62, 1.8); ring.style.opacity = r > 0 ? .9 * Math.sin(Math.PI * clamp(r * 1.2)) : 0;
      ring.style.transform = `translate(-50%,-50%) scale(${(.55 + .6 * r).toFixed(3)})`;
    },
  };
})();

/* =====================================================================
   2  ISP LOGO
   ===================================================================== */
const S2 = (() => {
  const L = $('#s2');
  const rings = el('div', L, 'c', { width: '1700px', height: '1700px', left: px(CX), top: px(CY), borderRadius: '50%',
    background: 'repeating-radial-gradient(circle, rgba(60,70,130,.10) 0 2px, transparent 2px 25px)',
    WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.65) 28%, transparent 60%)' });
  const glows = S1.dots.slice(0, 7).map(() => el('div', L, 'c', { width: '110px', height: '110px', borderRadius: '50%', background: 'radial-gradient(circle,#fff 0%,rgba(230,238,255,.95) 30%,rgba(200,215,255,0) 70%)', opacity: 0 }));
  const lock = el('div', L, 'c nowrap', { left: px(CX), top: px(CY), display: 'flex', alignItems: 'center', gap: '30px' });
  const mark = el('img', lock, '', { height: '205px', display: 'block' }); mark.src = LOGO;
  const word = el('div', lock, 'nowrap', { font: '800 150px Inter', color: '#0E0E13', letterSpacing: '-0.045em', lineHeight: 1 });
  const chars = 'Agency'.split('').map(ch => { const s = el('span', word, 'word'); s.textContent = ch; return s; });
  const ghost = el('div', L, 'c nowrap', { font: '800 150px Inter', color: '#0E0E13', letterSpacing: '-0.045em', lineHeight: 1, opacity: 0 }); ghost.textContent = 'Agency';
  const ghost2 = el('div', L, 'c nowrap', { font: '800 150px Inter', color: '#0E0E13', letterSpacing: '-0.045em', lineHeight: 1, opacity: 0 }); ghost2.textContent = 'Agency';
  const blocks = (window.LOGO_BLOCKS || []).map(([dx, dy], i) => ({ dx, dy, j: [hash(i * 3.7) - .5, hash(i * 5.1) - .5], e: el('div', L, 'abs', { width: '13px', height: '13px', background: '#0E0E13', opacity: 0 }) }));
  return {
    markPos: [CX - 300, CY],
    measure() { const tr = mark.style.transform; mark.style.transform = 'none'; const r = rectOf(mark); this.markPos = [r.x, r.y]; this.markW = r.w; mark.style.transform = tr; this.wordRect = rectOf(word); },
    update(t) {
      if (!show('s2', t, ...SEG.s2)) return;
      rings.style.opacity = E(t, 1.85, 2.0);
      rings.style.transform = `translate(-50%,-50%) scale(${(1 + (t - 1.8) * .09).toFixed(4)})`;
      /* the dot line carries over as soft glows */
      S1.dots.slice(0, 7).forEach((d, i) => { const k = d.keys[d.keys.length - 1]; put(glows[i], k[1], k[2], 1, (1 - E(t, 1.83, 1.98, OUT)) * (k[3] && i !== 5 ? 1 : 0)); });
      /* reveal: mark + letters left to right (1.80–1.95), blur clears */
      const mp = E(t, 1.78, 1.9, OUT);
      mark.style.opacity = P(t, 1.78, 1.82);
      chars.forEach((c, i) => { const p = E(t, 1.79 + i * .028, 1.92 + i * .028, OUT); c.style.opacity = p; blur(c, (1 - p) * 9); });
      blur(lock, 10 * (1 - E(t, 1.78, 1.94, OUT)));
      /* exit: glitch doubling, mark swells, word smears */
      /* exit (2.43–2.56): the mark breaks into blocks that spread out, the word smears sideways */
      const gx = inWin(t, 2.43, 2.54), sm = E(t, 2.43, 2.53);
      put(ghost, this.wordRect.x + 18 * sm, this.wordRect.y, 1, gx ? .4 : 0);
      put(ghost2, this.wordRect.x - 12 * sm, this.wordRect.y, 1, gx ? .3 : 0);
      mark.style.transform = `scale(${lerp(.9, 1, mp).toFixed(4)})`;
      const br = E(t, 2.43, 2.55), bOn = t >= 2.43;
      mark.style.opacity = bOn ? 0 : P(t, 1.78, 1.82);
      blocks.forEach(b => {
        if (!bOn) { b.e.style.opacity = 0; return; }
        const sc = 1 + .9 * br, x = this.markPos[0] + b.dx * sc + b.j[0] * 70 * br, y = this.markPos[1] + b.dy * sc + b.j[1] * 70 * br, z = 13 + 9 * br;
        b.e.style.left = px(x - z / 2); b.e.style.top = px(y - z / 2); b.e.style.width = b.e.style.height = px(z);
        b.e.style.opacity = (1 - E(t, 2.52, 2.56)).toFixed(3);
      });
      word.style.opacity = 1 - P(t, 2.52, 2.56); blur(word, 4 * sm);
      L.style.filter = `brightness(${(1 - .6 * E(t, 2.51, 2.56)).toFixed(3)})`;
      L.style.opacity = E(t, 1.757, 1.87, RAMP);
    },
  };
})();

/* =====================================================================
   3  ORBIT
   ===================================================================== */
const S3 = (() => {
  const L = $('#s3');
  el('div', L, 'c', { width: '1300px', height: '1300px', left: px(CX), top: px(CY), borderRadius: '50%',
    background: 'repeating-radial-gradient(circle, rgba(255,255,255,.05) 0 2px, transparent 2px 24px)', WebkitMaskImage: 'radial-gradient(circle, #000 8%, transparent 55%)' });
  const G = 190, C = { T: [0, -1], TR: [1, -1], R: [1, 0], BR: [1, 1], B: [0, 1], BL: [-1, 1], L: [-1, 0], TL: [-1, -1] };
  const halo = () => el('div', L, 'c', { width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.75), rgba(255,255,255,0) 65%)', opacity: 0 });
  const icon = n => { const e = appIcon(L, n, 124); e.style.borderRadius = ['facebook', 'whatsapp', 'x', 'snapchat'].includes(n) ? '50%' : '28%'; return e; };
  const dot = (col, sz) => el('div', L, 'abs', { width: px(sz), height: px(sz), marginLeft: px(-sz / 2), marginTop: px(-sz / 2), borderRadius: '50%', background: col });
  /* As in the reel: items mostly hold their cells. Beat 1 (2.97): the left dot and the bottom-left icon swap.
     Beat 2 (3.27): the four side icons dissolve into the next four platforms; the big corner dot shrinks. */
  const B1 = [2.96, 3.03], B2 = [3.25, 3.32];
  const items = [
    { e: icon('instagram'), cells: ['T'], out: B2, wave: 0 },
    { e: icon('youtube'), cells: ['R'], out: B2, wave: 1 },
    { e: icon('facebook'), cells: ['B'], out: B2, wave: 1 },
    { e: icon('tiktok'), cells: ['BL', 'L'], move: B1, out: B2, wave: 0 },
    { e: dot('#B9E36A', 64), cells: ['L', 'BL'], move: B1, shrink: B1, wave: 1 },
    { e: dot('#38C6E8', 64), cells: ['TR'], shrink: B2, wave: 1 },
    { e: dot('#E6E6EA', 36), cells: ['TL'], wave: 0 },
    { e: dot('#C9B3F5', 36), cells: ['BR'], wave: 0 },
    { e: icon('x'), cells: ['T'], in: B2 },
    { e: icon('linkedin'), cells: ['R'], in: B2 },
    { e: icon('whatsapp'), cells: ['B'], in: B2 },
    { e: icon('snapchat'), cells: ['L'], in: B2 },
  ];
  items.forEach(o => { o.h = halo(); });
  return {
    update(t) {
      if (!show('s3', t, ...SEG.s3)) return;
      $('#s3').style.opacity = P(t, 2.535, 2.556);
      const flash = E(t, 3.7, 3.76);
      items.forEach(o => {
        const m = o.move ? E(t, ...o.move) : 0, a = C[o.cells[0]], b = C[o.cells[1] || o.cells[0]];
        const x = lerp(a[0], b[0], m) * G, y = lerp(a[1], b[1], m) * G;
        let sc = 1, op = 1;
        if (o.wave != null) { const at = o.wave ? 2.63 : 2.57; sc = back(P(t, at, at + .18)); op = E(t, at, at + .08); }
        if (o.in) { const p = E(t, o.in[0], o.in[1] + .04); sc = .7 + .3 * back(P(t, o.in[0], o.in[1] + .1)); op = p; }
        if (o.out) op *= 1 - E(t, ...o.out);
        if (o.shrink) sc *= 1 - .45 * E(t, ...o.shrink);
        put(o.e, CX + x, CY + y, sc, op);
        put(o.h, CX + x, CY + y, 1, op * .9 * Math.sin(Math.PI * flash));
      });
    },
  };
})();

/* =====================================================================
   4  "Let's make your video better"
   ===================================================================== */
const S4 = (() => {
  const L = $('#s4');
  const bloom = [[0, 0, 300], [0, -1, 210], [1, 0, 210], [0, 1, 210], [-1, 0, 210], [1, -1, 130], [1, 1, 130], [-1, 1, 130], [-1, -1, 130]].map(([gx, gy, z]) =>
    ({ gx, gy, e: el('div', L, 'c', { width: px(z), height: px(z), left: px(CX + gx * 190), top: px(CY + gy * 190), borderRadius: '30%', background: '#fff', filter: 'blur(26px)' }) }));
  const ICON = 128, GAP = 36;
  const line = el('div', L, 'abs nowrap', { top: px(CY), font: '400 74px Inter', color: '#3A3E55', letterSpacing: '-.012em', transform: 'translateY(-50%)' });
  const words = [['Let’s ', 400, 3.76], ['make ', 400, 3.89], ['your ', 400, 3.99], ['video ', 400, 4.06], ['better', 700, 4.16]].map(([w, fw, at]) => {
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
      $('#s4').style.opacity = E(t, 3.698, 3.842, RAMP);
      bloom.forEach(b => { b.e.style.opacity = (.95 * (1 - E(t, 3.77, 3.91, OUT))).toFixed(3); b.e.style.transform = `translate(-50%,-50%) scale(${(1 + .25 * E(t, 3.72, 3.9)).toFixed(3)})`; });
      const ex = E(t, 4.7, 4.76);
      words.forEach(w => { const p = E(t, w.at, w.at + .13, OUT); w.s.style.opacity = p * (1 - ex); w.s.style.transform = `translateY(${((1 - p) * 10).toFixed(2)}px)`; blur(w.s, (1 - p) * 6 + ex * 10); });
    },
  };
})();

/* =====================================================================
   5  PLATFORM SCREENS
   ===================================================================== */
const S5 = (() => {
  const L = $('#s5');
  const LIST = [['instagram', '#0B62F2'], ['youtube', '#BF95F0'], ['facebook', '#0B8E91'], ['tiktok', '#F26E45'], ['linkedin', '#879B5C'], ['x', '#0A8CFF']];
  const AT = [4.77, 5.2, 5.78, 6.27, 6.72, 7.07];
  const XF = [.045, .05];
  const CIRC_BG = ['#E4E8F2', '#ECE9F3', '#CDBDF3', '#ECE6EC', '#D3E4F5', '#D5E6FA'];   // the circle picks up a tint per screen, as in the reel                                   // dissolve: starts 1.5 frames before the beat, done 1.5 after
  const DOTC = ['#F2F2F6', '#A6E3A0', '#F0704B', '#E59ADF', '#9C8CF0', '#F2F2F6', '#7FB6F5', '#E4E33A'];
  const dots = [];
  for (const side of [-1, 1]) for (let i = 0; i < 5; i++) dots.push({ side, i, e: el('div', L, 'dot', { width: '25px', height: '25px', marginLeft: '-12.5px', marginTop: '-12.5px', top: px(CY) }) });
  const link = [0, 1, 2].map(() => el('div', L, 'dot', { width: '11px', height: '11px', background: '#fff', marginLeft: '-5.5px', marginTop: '-5.5px', top: px(CY) }));
  const circ = el('div', L, 'circ', { width: '280px', height: '280px', left: 0, top: 0 });
  const glyphs = LIST.map(([n]) => el('div', circ, 'c', { left: '50%', top: '50%' }, glyph(n, PLAT[n].fill, 150)));
  const labels = LIST.map(([n]) => { const e = el('div', L, 'c nowrap', { left: px(CX), top: px(CY + 246), font: '500 42px Inter', color: 'rgba(255,255,255,.9)', letterSpacing: '-.01em', opacity: 0 }); e.textContent = PLAT[n].name; return e; });
  /* weight of screen i at time t: 1 while it is on, cross-fading over XF around each beat */
  const w = (i, t) => {
    const on = i === 0 ? 1 : E(t, AT[i] - XF[0], AT[i] + XF[1]);
    const off = i === AT.length - 1 ? 0 : E(t, AT[i + 1] - XF[0], AT[i + 1] + XF[1]);
    return on * (1 - off);
  };
  return {
    TILE: [CX - 224, CY], CIRC: [CX + 224, CY],
    update(t) {
      if (!show('s5', t, ...SEG.s5)) return;
      /* entry: the whole screen dissolves in over the typed line, tile and circle fade in where they sit */
      L.style.opacity = E(t, 4.72, 4.78);
      blur(circ, 10 * (1 - E(t, 4.72, 4.8)));
      let k = 0; AT.forEach((a, i) => { if (t >= a) k = i; });
      /* background: blend of the two screens while a dissolve runs */
      let bg = LIST[0][1];
      for (let i = 1; i < AT.length; i++) { const p = E(t, AT[i] - XF[0], AT[i] + XF[1]); if (p > 0) bg = mix(bg, LIST[i][1], p); }
      L.style.background = bg;
      glyphs.forEach((g, i) => { g.style.opacity = w(i, t).toFixed(3); });
      let cb = CIRC_BG[0];
      for (let i = 1; i < AT.length; i++) { const p = E(t, AT[i] - XF[0], AT[i] + XF[1]); if (p > 0) cb = mix(cb, CIRC_BG[i], p); }
      circ.style.background = `radial-gradient(circle at 40% 35%, #FFFFFF 0%, ${cb} 75%)`;
      labels.forEach((e, i) => { e.style.opacity = (w(i, t) * P(t, 4.8, 4.84)).toFixed(3); });
      /* the dot rows sit still and change colour with each screen */
      dots.forEach(d => { d.e.style.left = px(CX + d.side * (535 + d.i * 215)); d.e.style.background = DOTC[(d.i * 3 + (d.side > 0 ? 5 : 0) + k * 2) % DOTC.length]; d.e.style.opacity = P(t, 4.79, 4.81); });
      /* "···" between the tiles builds up one dot at a time, then stays */
      const n = Math.min(3, 1 + Math.floor(Math.max(0, t - 4.83) / .13));
      link.forEach((d, i) => { d.style.left = px(CX - 22 + i * 22); d.style.opacity = t >= 4.8 && i < n ? .95 : 0; });
      put(circ, this.CIRC[0], this.CIRC[1], 1);
    },
  };
})();

/* =====================================================================
   6  "ISP Agency ✓" / "All in one place, less pressure."
   ===================================================================== */
const S6 = (() => {
  const L = $('#s6');
  const ICON = 150, GAP = 40;
  const icon = tileEl(L, 'green', ICON);
  const block = el('div', L, 'abs', { top: px(CY - 50), transform: 'translateY(-50%)' });
  const pill = el('div', block, 'pill', {}, 'ISP Agency <svg width="20" height="20" viewBox="0 0 12 12"><path d="M2 6.3l2.5 2.4L10 3.3" fill="none" stroke="#474B60" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  pill.style.marginBottom = '12px';
  const mk = (txt, times) => {
    const d = el('div', block, 'nowrap', { font: '400 52px Inter', letterSpacing: '-.03em', lineHeight: '63px' });
    return txt.split(/(?<= )/).map((w, i) => { const s = el('span', d, 'word'); s.textContent = w; return { s, at: times[i] }; });
  };
  const words = [...mk('All in one place,', [7.47, 7.5, 7.53, 7.6]), ...mk('less pressure.', [7.7, 7.8])];
  return {
    ICON, pos: [CX, CY],
    measure() {
      const r = rectOf(block), left = CX - (ICON + GAP + r.w) / 2;
      block.style.left = px(left + ICON + GAP); this.pos = [left + ICON / 2, CY - 50]; put(icon, ...this.pos, 1);
    },
    update(t) {
      if (!show('s6', t, ...SEG.s6)) return;
      $('#s6').style.opacity = E(t, 7.345, 7.39);
      blur(icon.querySelector('img'), inWin(t, 7.39, 7.42) || inWin(t, 8.255, 8.285) ? 4 : 0);
      pill.style.opacity = P(t, 7.36, 7.4);
      words.forEach(w => {
        const p = E(t, w.at, w.at + .1, OUT), dk = E(t, w.at + .03, w.at + .45);
        w.s.style.opacity = p;
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
  const tile = tileEl(grp, 'pink', 150); tile.style.position = 'relative';
  const card = el('div', grp, 'card');
  el('div', card, '', { font: '600 52px Inter', color: '#23263A', letterSpacing: '-.025em' }, 'Video is ready');
  el('div', card, '', { font: '400 40px Inter', color: '#4B4E62', marginTop: '10px', letterSpacing: '-.02em' }, 'ISP Agency');
  const COL = ['#111114', '#B3262E', '#1F7A55', '#E58FD6', '#E4E33A', '#A78BFA', '#A9C7F5', '#2E8B6B', '#C02E25', '#111114', '#B9E36A', '#E9A0E3'];
  const conf = [];
  for (let i = 0; conf.length < 22 && i < 600; i++) {
    const x0 = 60 + hash(i * 9.2) * 1800, y0 = 40 + hash(i * 4.4) * 960;
    if (Math.abs(x0 - (CX - 30)) < 600 && Math.abs(y0 - (CY - 40)) < 170) continue;   // keep the card clear
    const sz = 48 + hash(i * 3.3) * 16, n = conf.length, on = 8.31 + Math.pow(hash(i * 2.9), .9) * .42;
    conf.push({ e: el('div', L, 'dot', { width: px(sz), height: px(sz), background: COL[n % COL.length], marginLeft: px(-sz / 2), marginTop: px(-sz / 2) }),
      x0, y0, vx: (hash(i * 7.1) - .5) * 40, vy: 20 + hash(i * 1.7) * 60, on, off: Math.min(9.27, on + .4 + hash(i * 5.3) * .55) });
  }
  return {
    update(t) {
      if (!show('s7', t, ...SEG.s7)) return;
      $('#s7').style.opacity = E(t, 8.24, 8.4);
      blur(grp, 6 * (1 - E(t, 8.26, 8.43, OUT)));
      conf.forEach(c => {
        const tau = t - c.on;
        if (tau <= 0 || t >= c.off) { c.e.style.opacity = 0; return; }
        c.e.style.left = px(c.x0 + c.vx * tau); c.e.style.top = px(c.y0 + c.vy * tau);
        const sc = back(Math.min(1, tau / .16)) * (1 - E(t, c.off - .1, c.off));
        c.e.style.opacity = 1; c.e.style.transform = `scale(${sc.toFixed(3)})`;
      });
    },
  };
})();

/* =====================================================================
   TRAVELLING TILES
   hero  — the green ISP tile: pops in at the centre as the logo shatters (2.52), sits in the orbit, blooms away (3.72)
   hero2 — the typed line's icon (appears in place at 3.73), turns lime (4.45), then grows and glides into the
           big lime tile of the colour screens (4.70–4.77, the reel's move), and dissolves into scene 6 (7.35)
   ===================================================================== */
const hero = tileEl($('#hero'), 'green', 200);
function mkTile2() {
  const t = el('div', $('#hero'), 'tile', { width: '128px', height: '128px', left: 0, top: 0, boxShadow: 'none', background: 'transparent' });
  t.g = el('div', t, 'abs green', { inset: 0, borderRadius: 'inherit' });
  t.l = el('div', t, 'abs lime', { inset: 0, borderRadius: 'inherit', opacity: 0 });
  t.i = el('img', t, '', { position: 'relative' }); t.i.src = LOGO;
  return t;
}
const hero2 = mkTile2();
function updateHero(t) {
  if (t >= 2.515 && t < 3.77) {
    hero.style.visibility = 'visible';
    const pop = back(P(t, 2.515, 2.63)), sh = -12 * E(t, 3.69, 3.73);
    hero.style.width = hero.style.height = '200px';
    put(hero, CX - 18 * (1 - E(t, 2.515, 2.56)) + sh, CY, .55 + .45 * pop, P(t, 2.515, 2.535) * (1 - E(t, 3.73, 3.77)));
    hero.style.filter = t > 3.7 ? `brightness(${(1 + 1.2 * E(t, 3.7, 3.76)).toFixed(3)}) blur(${(10 * E(t, 3.72, 3.77)).toFixed(2)}px)` : '';
  } else hero.style.visibility = 'hidden';
  if (t >= 3.72 && t < 7.39) {
    hero2.style.visibility = 'visible';
    const s4 = S4.icon, m = E(t, 4.69, 4.75);
    const x = lerp(s4[0], S5.TILE[0], m), sz = lerp(S4.ICON, 280, m);
    hero2.style.width = hero2.style.height = px(sz);
    put(hero2, x, CY, 1, P(t, 3.72, 3.74) * (1 - E(t, 7.345, 7.39)));
    const bgOn = E(t, 3.77, 3.82);
    hero2.g.style.opacity = bgOn * (1 - E(t, 4.43, 4.47)); hero2.l.style.opacity = E(t, 4.43, 4.47);
    blur(hero2.i, inWin(t, 4.43, 4.467) ? 5 : 0);
    hero2.style.boxShadow = bgOn > .5 ? '' : 'none';
  } else hero2.style.visibility = 'hidden';
}

/* ---------- render ---------- */
const CAM = () => $('#cam');
function camera(t) {
  const s = 1.014 + .055 * (t / DUR), x = 7 * Math.sin(t * .62) + 3 * Math.sin(t * 1.37 + 1), y = 5 * Math.sin(t * .81 + 2) + 2 * Math.sin(t * 1.9);
  CAM().style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${s.toFixed(5)})`;
}
function renderAt(t) { camera(t); S1.update(t); S2.update(t); S3.update(t); S4.update(t); S5.update(t); S6.update(t); S7.update(t); updateHero(t); }
window.renderAt = renderAt;

(async function init() {
  await document.fonts.ready;
  await Promise.all([...document.fonts].map(f => f.load().catch(() => {})));
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  const ids = ['s2', 's4', 's6'];
  ids.forEach(id => { $('#' + id).style.visibility = 'visible'; });
  S2.measure(); S4.measure(); S6.measure();
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
