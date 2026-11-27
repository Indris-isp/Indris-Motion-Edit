// Dad-interest v5: redesign after the client's Pinterest reference ("Pro Video Editing: 10x your reels", reference/pin_ref.mp4).
// Motion language taken from it:
//  * one airy world: a soft lavender-white gradient with slow drifting colour blooms; clean white UI on top
//  * every element builds in sequence (staggered pops / slide-ins), on soft expo/cubic ease-outs, never linear
//  * the camera never stops: slow push, then an eased pull-back that reveals a huge pale outline word behind the UI
//  * a hand-drawn circle draws itself around the one keyword
//  * over the speaker: small light captions and one glowing neon word/number
// Helpers (el, line, reveal, chunkVis, tw, run, eo, eio, back, lerp, clamp, LEAD, mulberry) come from scenes.js / scenes2.js.
const V = { ink: '#2A2140', soft: '#8D7FA8', faint: '#B9ABD3', violet: '#8B5CF6', violet2: '#B48CFF', lilac: '#E9DCFF', red: '#FF5A78', green: '#22B573', white: '#FFFFFF' };
const ex = u => { u = clamp(u); return u === 1 ? 1 : 1 - Math.pow(2, -10 * u); };          // expo-out: fast start, long soft landing
const sio = u => 0.5 - 0.5 * Math.cos(Math.PI * clamp(u));                               // sine in-out for camera moves

// ------------------------------------------------------------------ world + camera
function world() {
  el('div', { position: 'absolute', inset: '0', background: 'linear-gradient(165deg, #FDFBFF 0%, #F4ECFF 38%, #EADBFF 70%, #E1CCFB 100%)' });
  const blobs = [[200, 420, 520, '#F2E6FF'], [880, 1300, 620, '#E3CFFF'], [300, 1600, 480, '#FFFFFF'], [820, 300, 420, '#EEDCFF']].map(([x, y, r, c]) =>
    el('div', { position: 'absolute', left: x - r + 'px', top: y - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px', borderRadius: '50%', background: c, filter: 'blur(90px)', opacity: '.9' }));
  const cam = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', transformOrigin: '540px 900px' });
  return { cam, drift: t => blobs.forEach((b, i) => { b.style.transform = `translate(${40 * Math.sin(t * 0.5 + i * 1.7)}px, ${30 * Math.cos(t * 0.4 + i)}px)`; }) };
}
function camera(cam, t, keys) {          // keys: [[t, scale, x, y], ...] eased with sine in-out between keys
  let k = keys[0];
  if (t <= keys[0][0]) k = keys[0];
  else if (t >= keys[keys.length - 1][0]) k = keys[keys.length - 1];
  else for (let i = 0; i < keys.length - 1; i++) if (t <= keys[i + 1][0]) {
    const a = keys[i], b = keys[i + 1], u = sio((t - a[0]) / (b[0] - a[0]));
    k = [t, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; break;
  }
  cam.style.transform = `translate(${k[2]}px, ${k[3]}px) scale(${k[1]})`;
}
// ------------------------------------------------------------------ UI pieces
function card(parent, { x = 90, y, w = 900, h, r = 40 }) {
  return el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: r + 'px',
    background: 'linear-gradient(180deg, rgba(255,255,255,.96), rgba(252,249,255,.92))', border: '1.5px solid rgba(255,255,255,.9)',
    boxShadow: '0 40px 80px rgba(110,70,170,.16), 0 8px 22px rgba(110,70,170,.10)' }, parent);
}
function txt(parent, s, x, y, css = {}) { return el('div', Object.assign({ position: 'absolute', left: x + 'px', top: y + 'px', font: '500 40px Inter, sans-serif', color: V.ink, whiteSpace: 'pre' }, css), parent, s); }
function chip(parent, s, x, y, { bg = V.lilac, fg = V.violet, size = 34 } = {}) {
  return el('div', { position: 'absolute', left: x + 'px', top: y + 'px', padding: `${size * 0.3}px ${size * 0.6}px`, borderRadius: '999px', background: bg, color: fg, font: `600 ${size}px Inter`, whiteSpace: 'nowrap' }, parent, s);
}
function icon(parent, glyph, x, y, s = 92, bg = 'linear-gradient(150deg,#F5EEFF,#E4D4FF)') {
  return el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', borderRadius: s * 0.28 + 'px', background: bg,
    display: 'grid', placeItems: 'center', font: `${s * 0.5}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`, boxShadow: '0 8px 18px rgba(110,70,170,.12)' }, parent, glyph);
}
function popIn(e, t, t0, d = 0.45, from = 0.7) { const u = (t - t0) / d; e.style.opacity = clamp(u * 2.2); e.style.transform = `scale(${lerp(from, 1, ex(u))})`; e.style.filter = `blur(${10 * (1 - ex(u))}px)`; }
function rise(e, t, t0, d = 0.55, dy = 70) { const u = (t - t0) / d; e.style.opacity = clamp(u * 2); e.style.transform = `translateY(${dy * (1 - ex(u))}px)`; e.style.filter = `blur(${8 * (1 - ex(u))}px)`; }
function slideX(e, t, t0, d = 0.55, dx = 120) { const u = (t - t0) / d; e.style.opacity = clamp(u * 2); e.style.transform = `translateX(${dx * (1 - ex(u))}px)`; e.style.filter = `blur(${8 * (1 - ex(u))}px)`; }
// pale outline word that the pull-back reveals (the reference's "2025")
function ghost(parent, s, y, size = 300) {
  return el('div', { position: 'absolute', left: '0', width: '1080px', top: y + 'px', textAlign: 'center', font: `600 ${size}px/1 Inter, sans-serif`, letterSpacing: '-8px',
    color: 'rgba(255,255,255,.55)', WebkitTextStroke: '2.5px rgba(180,140,255,.55)', textShadow: '0 0 40px rgba(200,170,255,.45)' }, parent, s);
}
// small elegant line + a keyword with a hand-drawn circle that draws on
function circled(parent, before, kw, y, { size = 64, tKw, color = V.violet } = {}) {
  const box = el('div', { position: 'absolute', left: '0', width: '1080px', top: y + 'px', textAlign: 'center', font: `500 ${size}px Inter, sans-serif`, color: V.ink, whiteSpace: 'pre' }, parent);
  const a = el('span', {}, box, before + ' ');
  const k = el('span', { position: 'relative', display: 'inline-block', color, fontWeight: '600' }, box, kw);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 200 100');
  Object.assign(svg.style, { position: 'absolute', left: '-22%', top: '-38%', width: '144%', height: '176%', overflow: 'visible' });
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', 'M 30 22 C 80 4 170 8 188 40 C 202 70 140 96 80 92 C 26 88 4 66 14 42 C 22 24 60 14 104 12');
  Object.assign(p.style, { fill: 'none', stroke: color, strokeWidth: '4', strokeLinecap: 'round', filter: 'drop-shadow(0 0 6px rgba(139,92,246,.45))' });
  svg.appendChild(p); k.appendChild(svg);
  const L = 560; p.style.strokeDasharray = L;
  return (t, t0) => { rise(box, t, t0 - 0.1, 0.5, 40); p.style.strokeDashoffset = L * (1 - eio((t - tKw) / 0.55)); };
}
// neon glow word/number over the speaker (the reference's glowing "2025")
function neon(parent, s, { y = 1150, size = 330, word }) {
  const e = el('div', { position: 'absolute', left: '0', width: '1080px', top: y + 'px', textAlign: 'center', font: `700 ${size}px/1 Inter, sans-serif`, letterSpacing: '-10px',
    background: 'linear-gradient(180deg,#FFFFFF 0%,#EBDDFF 45%,#C9A4FF 100%)', WebkitBackgroundClip: 'text', color: 'transparent',
    filter: 'drop-shadow(0 0 18px rgba(170,120,255,.85)) drop-shadow(0 0 48px rgba(140,90,255,.55))' }, parent, s);
  const t0 = typeof word === 'number' ? word : tw(word);
  return t => { const u = (t - (t0 - 0.12)) / 0.5; e.style.opacity = clamp(u * 2); e.style.transform = `scale(${lerp(0.82, 1, ex(u)) + 0.02 * clamp((t - t0) / 2)})`; return e; };
}
function countTo(e, text, t, t0, d = 0.6) { const n = +text.replace(/\D/g, ''), v = Math.round(n * ex((t - (t0 - d * 0.6)) / d)); e.textContent = text.replace(/\d+/, String(v)); }
function cutout(parent, src, { x, y, h }) {
  const im = el('img', { position: 'absolute', left: x + 'px', top: y + 'px', height: h + 'px', filter: 'drop-shadow(0 30px 40px rgba(90,50,150,.25))' }, parent); im.src = src; return im;
}
const smallCap = (parent, y, items, kwSize = 120) => line(parent, y, items.map(([w, t, kw]) => ({ w, t, css: kw ? { font: `italic 400 ${kwSize}px/1 "Instrument Serif", serif`, color: V.violet, textShadow: '0 0 18px rgba(170,120,255,.35)' } : { font: '500 54px Inter, sans-serif', color: V.ink, textShadow: 'none' } })));

Object.assign(SCENES, {
  // ------------------------------------------------------------------ overlays on the speaker
  n20a() { const n = neon(S, '$20', { word: '20', y: 1080 }); const t0 = tw('20'); return t => countTo(n(t), '$20', t, t0, 0.55); },
  n15() { const n = neon(S, '15', { word: '15', y: 1060, size: 380 }); const t0 = tw('15'); return t => countTo(n(t), '15', t, t0, 0.5); },
  n20b() { const n = neon(S, '$20', { word: '20', y: 1080 }); return t => n(t); },
  nent() { const n = neon(S, 'entrepreneurship', { word: 'entrepreneurship', y: 1180, size: 112 }); n(0).style.letterSpacing = '-3px'; return t => n(t); },

  // ------------------------------------------------------------------ 1.85-4.45  "you gotta pay me back with $5 interest": request card builds, pull back reveals INTEREST
  v_request() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'interest', 300, 250);
    const c = card(C, { y: 640, h: 560 });
    icon(c, '💵', 56, 56, 110);
    txt(c, 'Loan to Dad', 196, 62, { font: '600 50px Inter' }); txt(c, 'request · Latoya, 15', 196, 128, { font: '500 32px Inter', color: V.soft });
    const r1 = el('div', { position: 'absolute', left: '56px', right: '56px', top: '230px', height: '90px' }, c);
    txt(r1, 'Loan', 0, 18, { font: '500 44px Inter' }); txt(r1, '$20', 0, 10, { font: '700 56px Inter', left: 'auto', right: '0' });
    const r2 = el('div', { position: 'absolute', left: '56px', right: '56px', top: '340px', height: '90px' }, c);
    txt(r2, 'Interest', 0, 18, { font: '500 44px Inter' }); const five = txt(r2, '+$5', 0, 10, { font: '700 56px Inter', color: V.violet, left: 'auto', right: '0' });
    const ch = chip(c, 'pay me back', 56, 460, { size: 32 });
    const cap = circled(C, 'with', 'interest', 1300, { tKw: tw('interest'), size: 68 });
    const t5 = tw('5'), ti = tw('interest');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.06, 0, 30], [ti - 0.2, 1.0, 0, 0], [DUR, 0.88, 0, 60]]);
      rise(c, t, -0.1, 0.6, 140); slideX(r1, t, 0.15, 0.5, 80); slideX(r2, t, t5 - 0.15, 0.5, 80); popIn(ch, t, t5 + 0.2);
      five.style.textShadow = t > t5 ? `0 0 ${18 * clamp((t - t5) / 0.3)}px rgba(139,92,246,.45)` : 'none';
      cap(t, ti - 0.35);
      const u = (t - (ti - 0.1)) / 0.9; g.style.opacity = 0.9 * clamp(u); g.style.transform = `scale(${lerp(1.25, 1, ex(u))})`;
    };
  },
  // ------------------------------------------------------------------ 7.64-9.23  "my dad, he would give me": dad + daughter cut out on the gradient, "dad" circled
  v_dad() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'Dad', 520, 420);
    const im = cutout(C, 'assets/cut_dad_allowance.png', { x: 70, y: 560, h: 1140 });
    const cap = circled(C, 'my', 'dad', 250, { tKw: tw('dad'), size: 72 });
    const r = smallCap(C, 360, [['he', tw('he')], ['would', tw('would')], ['give', tw('give')], ['me', tw('me')]]);
    return t => { W0.drift(t); camera(C, t, [[0, 1.08, 0, 40], [DUR, 1.0, 0, 0]]); rise(im, t, -0.05, 0.7, 160); popIn(g, t, 0.05, 0.8, 1.2); g.style.opacity = 0.85 * clamp(t / 0.6); cap(t, tw('my')); r(t); };
  },
  // ------------------------------------------------------------------ 9.23-12.77  "allowance / I wasn't into shopping / I would just buy books": checklist rows
  v_list() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'books', 1270, 280);
    const h = txt(C, 'MY ALLOWANCE WENT ON', 0, 360, { width: '1080px', textAlign: 'center', font: '600 34px Inter', letterSpacing: '8px', color: V.soft });
    const rows = [['🛍️', 'Shopping', 'clothes · makeup', false, tw('shopping')], ['💄', 'Girly stuff', 'not really', false, tw('shopping') + 0.35], ['📚', 'Books', 'Barnes & Noble', true, tw('books') - 0.1]]
      .map(([g1, n, sub, ok, t0], i) => {
        const c = card(C, { y: 470 + i * 200, h: 170, x: 110, w: 860, r: 34 });
        icon(c, g1, 34, 36, 98);
        txt(c, n, 164, 34, { font: '600 46px Inter' }); txt(c, sub, 164, 96, { font: '500 30px Inter', color: V.soft });
        const mark = el('div', { position: 'absolute', right: '36px', top: '50px', width: '70px', height: '70px', borderRadius: '50%', display: 'grid', placeItems: 'center', font: '700 40px Inter',
          background: ok ? V.violet : '#F1ECF7', color: ok ? '#fff' : '#B8AFC8', boxShadow: ok ? '0 0 26px rgba(139,92,246,.55)' : 'none' }, c, ok ? '✓' : '✕');
        return [c, mark, t0, ok];
      });
    const cap = circled(C, 'I would just buy', 'books', 1120, { tKw: tw('books'), size: 60 });
    const ta = 0, tB = tw('books');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.1, 0, 120], [tw('shopping'), 1.04, 0, 60], [tB, 1.0, 0, 0], [DUR, 0.9, 0, 80]]);
      rise(h, t, ta, 0.5, 30);
      rows.forEach(([c, m, t0, ok], i) => { slideX(c, t, t0 - 0.3, 0.6, i % 2 ? -140 : 140); popIn(m, t, t0 + 0.15, 0.35, 0.4); if (!ok) c.style.opacity = Math.min(+c.style.opacity || 1, t > tB - 0.2 ? 0.55 : 1); });
      cap(t, tB - 0.4);
      const u = (t - (tB - 0.05)) / 0.9; g.style.opacity = 0.8 * clamp(u); g.style.transform = `scale(${lerp(1.2, 1, ex(u))})`;
    };
  },
  // ------------------------------------------------------------------ 18.11-21.71  "they ran out of money / in the middle of the month": calendar (the reference's own move)
  v_calendar() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'Nov 15', 300, 230);
    const c = card(C, { y: 620, h: 700, x: 110, w: 860 });
    txt(c, 'November', 0, 44, { width: '860px', textAlign: 'center', font: '600 46px Inter' });
    const cells = [];
    'SMTWTFS'.split('').forEach((d, i) => txt(c, d, 60 + i * 110, 124, { width: '80px', textAlign: 'center', font: '600 28px Inter', color: V.soft }));
    for (let d = 1; d <= 30; d++) {
      const k = d - 1 + 5, x = 60 + (k % 7) * 110, y = 180 + Math.floor(k / 7) * 96;
      cells.push(txt(c, String(d), x, y, { width: '80px', height: '72px', lineHeight: '72px', textAlign: 'center', font: '500 36px Inter', borderRadius: '20px' }));
    }
    const ring = el('div', { position: 'absolute', width: '96px', height: '96px', borderRadius: '50%', border: `5px solid ${V.violet}`, boxShadow: '0 0 30px rgba(139,92,246,.55)' }, c);
    const k15 = 19; ring.style.left = (60 + (k15 % 7) * 110 - 8) + 'px'; ring.style.top = (180 + Math.floor(k15 / 7) * 96 - 12) + 'px';
    const wallet = chip(C, '👛  wallet: $0', 330, 1380, { bg: '#FFE6EC', fg: V.red, size: 40 });
    const tR = tw('ran'), tM = tw('middle');
    const cap = circled(C, 'in the', 'middle', 1500, { tKw: tM, size: 64 });
    const cap0 = smallCap(C, 1500, [['they', tw('they')], ['ran', tR], ['out', tw('out'), 1], ['of', tw('of')], ['money', tw('money')]]);
    const box0 = C.lastChild;
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.12, 0, 60], [tM - 0.3, 1.04, 0, 20], [DUR, 0.86, 0, 40]]);
      rise(c, t, -0.1, 0.6, 120);
      cells.forEach((e, i) => { const d = i + 1; const u = (t - 0.05 - i * 0.025) / 0.3; e.style.opacity = clamp(u * 2); e.style.transform = `translateY(${16 * (1 - ex(u))}px)`;
        const x = clamp((t - tR - d * 0.06) / 0.2); if (d < 15) { e.style.color = x > 0.5 ? '#C4B9D8' : V.ink; e.style.textDecoration = x > 0.5 ? 'line-through' : 'none'; e.style.background = `rgba(255,90,120,${0.08 * x})`; } });
      popIn(ring, t, tM - 0.05, 0.4, 1.6); popIn(wallet, t, tR + 0.3, 0.4);
      chunkVis(box0, t, 0, tw('in') - LEAD); cap0(t);
      if (t > tw('in') - LEAD) cap(t, tw('in')); else cap(-9, 99);
      const u = (t - (tM + 0.1)) / 1.0; g.style.opacity = 0.85 * clamp(u); g.style.transform = `scale(${lerp(1.25, 1, ex(u))})`;
    };
  },
  // ------------------------------------------------------------------ 21.71-23.89  "they came to me for money": friends' messages float in at depth
  v_msgs() {
    const W0 = world(), C = W0.cam;
    const msgs = [['Jada', 'can I borrow $10 till friday? 🙏', 120, 420, 0.0, 1.0], ['Marcus', 'lend me $5 for lunch pls', 260, 640, 0.35, 0.9], ['Aunt Pam', 'baby you got $20? 😅', 90, 860, 0.7, 1.05],
      ['Kev', 'I\'ll pay you back I swear', 300, 1080, 1.0, 0.95], ['Tasha', 'girl you rich?? 👀', 150, 1290, 1.3, 1.0]]
      .map(([n, m, x, y, d, s], i) => {
        const b = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', maxWidth: '700px', padding: '26px 34px', borderRadius: '36px 36px 36px 10px', background: 'rgba(255,255,255,.95)',
          boxShadow: '0 24px 50px rgba(110,70,170,.16)', transformOrigin: 'left bottom' }, C);
        avatar5(b, n[0], 210 + i * 33);
        txt(b, n, 96, 0, { position: 'relative', left: '0', top: '0', font: '600 30px Inter', color: V.soft, paddingLeft: '84px' });
        txt(b, m, 0, 0, { position: 'relative', left: '0', top: '0', font: '500 44px Inter', paddingLeft: '84px', whiteSpace: 'normal' });
        return [b, d, s];
      });
    const cap = smallCap(C, 1560, [['they', tw('they')], ['came', tw('came')], ['to', tw('to')], ['me', tw('me')], ['for', tw('for')]]);
    const k = smallCap(C, 1640, [['money', tw('money'), 1]]);
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.0, 0, 80], [DUR, 1.06, 0, -40]]);
      msgs.forEach(([b, d, s], i) => { const u = (t - d) / 0.5; b.style.opacity = clamp(u * 2); b.style.transform = `translateY(${(1 - ex(u)) * 60 - t * 12 * s}px) scale(${lerp(0.8, 1, ex(u)) * s})`; b.style.filter = `blur(${8 * (1 - ex(u))}px)`; });
      cap(t); k(t);
    };
  },
  // ------------------------------------------------------------------ 26.79-28.57  "but they had to pay INTEREST": each loan gets an +interest chip
  v_loans() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'interest', 300, 240);
    const rows = [['Jada', '$10', 210], ['Marcus', '$5', 40], ['Aunt Pam', '$20', 330], ['Kev', '$8', 160]].map(([n, a, hue], i) => {
      const c = card(C, { y: 620 + i * 170, h: 140, x: 140, w: 800, r: 32 });
      avatar5(c, n[0], hue, 30, 28, 84);
      txt(c, n, 136, 26, { font: '600 42px Inter' }); txt(c, 'borrowed ' + a, 136, 78, { font: '500 28px Inter', color: V.soft });
      const ch = chip(c, '+ interest', 540, 40, { size: 34, bg: V.violet, fg: '#fff' }); ch.style.boxShadow = '0 0 26px rgba(139,92,246,.5)';
      return [c, ch];
    });
    const cap = circled(C, 'but they had to pay', 'interest', 1380, { tKw: tw('interest'), size: 56 });
    const ti = tw('interest');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.08, 0, 40], [ti, 1.0, 0, 0], [DUR, 0.92, 0, 30]]);
      rows.forEach(([c, ch], i) => { rise(c, t, -0.05 + i * 0.1, 0.55, 90); popIn(ch, t, ti - 0.1 + i * 0.09, 0.35, 0.5); });
      cap(t, tw('but'));
      const u = (t - ti) / 0.9; g.style.opacity = 0.8 * clamp(u); g.style.transform = `scale(${lerp(1.2, 1, ex(u))})`;
    };
  },
  // ------------------------------------------------------------------ 30.50-32.27  "he knocked on my room door": dad cut out, knock knock
  v_knock() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'knock knock', 300, 160);
    const im = cutout(C, 'assets/cut_dad_door.png', { x: 370, y: 470, h: 1080 });
    const k1 = chip(C, 'knock', 120, 760, { size: 56, bg: '#fff', fg: V.violet }), k2 = chip(C, 'knock', 640, 980, { size: 56, bg: '#fff', fg: V.violet });
    [k1, k2].forEach(k => k.style.boxShadow = '0 20px 40px rgba(110,70,170,.2)');
    const cap = smallCap(C, 1600, [['he', tw('he')], ['knocked', tw('knocked')], ['on', tw('on')], ['my', tw('my')], ['room', tw('room')], ['door', tw('door'), 1]]);
    const tk = tw('knocked'), td = tw('door');
    return t => {
      W0.drift(t);
      const shake = (tt) => (t > tt && t < tt + 0.25) ? 8 * Math.sin((t - tt) * 70) * (1 - (t - tt) / 0.25) : 0;
      camera(C, t, [[0, 1.1, 0, 50], [DUR, 1.0, 0, 0]]); C.style.transform += ` translateX(${shake(tk) + shake(td)}px)`;
      rise(im, t, -0.05, 0.7, 180); popIn(k1, t, tk - 0.05, 0.35, 0.4); popIn(k2, t, td - 0.05, 0.35, 0.4);
      const u = (t - 0.1) / 0.9; g.style.opacity = 0.75 * clamp(u); g.style.transform = `scale(${lerp(1.2, 1, ex(u))})`;
      cap(t);
    };
  },
  // ------------------------------------------------------------------ 34.49-38.52  "I went in my drawer and I started counting all my money": real money photos fly in as cards
  v_drawer() {
    const W0 = world(), C = W0.cam;
    const cards = [['assets/card_stash.jpg', 150, 360, -8, 0.0], ['assets/card_count.jpg', 520, 520, 7, 0.25], ['assets/card_allow.jpg', 230, 900, 4, 1.9], ['assets/card_cash_hand.jpg', 600, 1060, -6, 2.25]]
      .map(([src, x, y, r, d]) => { const f = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: '360px', height: '480px', borderRadius: '28px', overflow: 'hidden', border: '10px solid #fff',
        boxShadow: '0 40px 70px rgba(90,50,150,.25)' }, C); const im = el('img', { width: '100%', height: '100%', objectFit: 'cover' }, f); im.src = src; return [f, r, d]; });
    const total = { style: {} };
    const cap = circled(C, 'I went in my', 'drawer', 1660, { tKw: tw('drawer'), size: 56 });
    const cap2 = smallCap(C, 1660, [['and', tw('and')], ['I', tw('i', 1)], ['started', tw('started')], ['counting', tw('counting'), 1]]);
    const b2 = C.lastChild;
    const tc = tw('counting'), ta = tw('and');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.06, 0, 0], [ta, 1.0, 0, -40], [DUR, 0.95, 0, -120]]);
      cards.forEach(([f, r, d], i) => { const u = (t - d) / 0.6; f.style.opacity = clamp(u * 2); f.style.transform = `translateY(${200 * (1 - ex(u))}px) rotate(${r * ex(u) + (1 - ex(u)) * r * 3}deg) scale(${lerp(0.85, 1, ex(u))})`; });
      if (t < ta - LEAD) cap(t, tw('i')); else { cap(-9, 99); }
      chunkVis(b2, t, ta, DUR + 1); cap2(t);
    };
  },
  // ------------------------------------------------------------------ 45.31-49.66  "I said daddy, remember you owe me $20 + $5 for interest": invoice builds, total counts to $25, pull back reveals $25
  v_invoice() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, '$25', 230, 330);
    const c = card(C, { y: 620, h: 660 });
    avatar5(c, 'D', 25, 56, 56, 120);
    txt(c, 'Daddy', 200, 64, { font: '600 54px Inter' }); txt(c, 'payday · payment request', 200, 134, { font: '500 32px Inter', color: V.soft });
    const r1 = el('div', { position: 'absolute', left: '56px', right: '56px', top: '240px', height: '90px' }, c);
    txt(r1, 'Loan', 0, 18, { font: '500 46px Inter' }); txt(r1, '$20', 0, 10, { font: '700 58px Inter', left: 'auto', right: '0' });
    const r2 = el('div', { position: 'absolute', left: '56px', right: '56px', top: '350px', height: '90px' }, c);
    txt(r2, 'Interest', 0, 18, { font: '500 46px Inter' }); txt(r2, '+$5', 0, 10, { font: '700 58px Inter', color: V.violet, left: 'auto', right: '0' });
    el('div', { position: 'absolute', left: '56px', right: '56px', top: '470px', height: '2px', background: '#EFE8F8' }, c);
    txt(c, 'Total due', 56, 520, { font: '600 40px Inter', color: V.soft });
    const tot = txt(c, '$0', 0, 498, { font: '700 92px Inter', left: 'auto', right: '56px', color: V.ink });
    const W1 = el('div', { position: 'absolute', inset: '0' }, C), W2 = el('div', { position: 'absolute', inset: '0' }, C), W3 = el('div', { position: 'absolute', inset: '0' }, C);
    const c1 = circled(W1, 'I said', 'daddy', 1420, { tKw: tw('daddy'), size: 60 });
    const c2 = smallCap(W2, 1420, [['remember', tw('remember')], ['you', tw('you')], ['owe', tw('owe')], ['me', tw('me')], ['$20', tw('20'), 1]]);
    const c3 = smallCap(W3, 1420, [['and', tw('and')], ['plus', tw('plus')], ['$5', tw('5'), 1], ['for', tw('for')], ['interest', tw('interest'), 1]]);
    const t20 = tw('20'), t5 = tw('5'), tr = tw('remember'), tA = tw('and'), tI = tw('interest');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.08, 0, 60], [t5, 1.0, 0, 0], [DUR, 0.86, 0, 40]]);
      rise(c, t, -0.1, 0.6, 160); slideX(r1, t, t20 - 0.2, 0.5, 90); slideX(r2, t, t5 - 0.2, 0.5, 90);
      const v = t < t5 - 0.1 ? 20 * ex((t - (t20 - 0.3)) / 0.5) : 20 + 5 * ex((t - (t5 - 0.1)) / 0.4); tot.textContent = '$' + Math.round(Math.max(0, v));
      chunkVis(W1, t, -1, tr - LEAD); chunkVis(W2, t, tr, tA - LEAD); chunkVis(W3, t, tA, DUR + 1); c1(t, tw('i')); c2(t); c3(t);
      const u = (t - tI) / 1.0; g.style.opacity = 0.8 * clamp(u); g.style.transform = `scale(${lerp(1.25, 1, ex(u))})`;
    };
  },
  // ------------------------------------------------------------------ 52.58-54.48  "but he didn't give me back my interest": $20 ticked, interest declined (soft red glow)
  v_declined() {
    const W0 = world(), C = W0.cam;
    const c = card(C, { y: 560, h: 520 });
    avatar5(c, 'D', 25, 56, 56, 120);
    txt(c, 'Daddy', 200, 64, { font: '600 54px Inter' }); txt(c, 'paid back · payday', 200, 134, { font: '500 32px Inter', color: V.soft });
    txt(c, 'Loan', 56, 258, { font: '500 46px Inter' }); txt(c, '$20', 0, 250, { font: '700 58px Inter', left: 'auto', right: '56px' });
    const ok = chip(c, '✓ paid', 330, 256, { size: 32, bg: '#E2F7EC', fg: V.green });
    txt(c, 'Interest', 56, 368, { font: '500 46px Inter' }); const five = txt(c, '+$5', 0, 360, { font: '700 58px Inter', left: 'auto', right: '56px', color: V.violet });
    const st = el('div', { position: 'absolute', right: '44px', top: '398px', width: '150px', height: '8px', borderRadius: '4px', background: V.red, transformOrigin: 'left center' }, c);
    const n = el('div', { position: 'absolute', left: '120px', top: '1150px', width: '840px', padding: '30px 40px', boxSizing: 'border-box', borderRadius: '40px', background: 'rgba(255,255,255,.97)',
      boxShadow: '0 0 0 2px rgba(255,90,120,.25), 0 0 60px rgba(255,90,120,.35), 0 24px 50px rgba(110,70,170,.18)', display: 'flex', gap: '26px', alignItems: 'center' }, C);
    el('div', { width: '86px', height: '86px', borderRadius: '50%', background: '#FFE6EC', color: V.red, display: 'grid', placeItems: 'center', font: '700 48px Inter', flex: 'none' }, n, '✕');
    const nt = el('div', {}, n); el('div', { font: '700 46px Inter', color: V.ink }, nt, 'Interest declined'); el('div', { font: '500 32px Inter', color: V.soft }, nt, 'Daddy kept your $5');
    const W1 = el('div', { position: 'absolute', inset: '0' }, C), W2 = el('div', { position: 'absolute', inset: '0' }, C);
    const c1 = smallCap(W1, 1520, [['but', tw('but')], ['he', tw('he')], ["didn't", tw("didn't"), 1]]);
    const c2 = smallCap(W2, 1520, [['give', tw('give')], ['me', tw('me')], ['back', tw('back')], ['my', tw('my')], ['interest', tw('interest'), 1]]);
    W1.querySelectorAll('.w').forEach((e, i) => { if (i === 2) e.style.color = V.red; }); W2.querySelectorAll('.w').forEach((e, i) => { if (i === 4) e.style.color = V.red; });
    const ti = tw('interest'), tg = tw('give');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.04, 0, 20], [ti, 1.0, 0, 0], [DUR, 1.03, 0, -20]]);
      rise(c, t, -0.1, 0.5, 100); popIn(ok, t, 0.2, 0.35, 0.5);
      st.style.transform = `scaleX(${ex((t - ti) / 0.3)})`; five.style.opacity = t > ti + 0.1 ? 0.4 : 1;
      popIn(n, t, ti + 0.1, 0.4, 0.8);
      const sh = (t > ti + 0.4 && t < ti + 0.8) ? 10 * Math.sin((t - ti) * 60) * (1 - (t - ti - 0.4) / 0.4) : 0; if (t > ti + 0.5) n.style.transform = `translateX(${sh}px)`;
      chunkVis(W1, t, -1, tg - LEAD); chunkVis(W2, t, tg, DUR + 1); c1(t); c2(t);
    };
  },
  // ------------------------------------------------------------------ 55.74-58.94  "so that was my first entrepreneurial business": her cut out, chips, pull back reveals FIRST BUSINESS
  v_first() {
    const W0 = world(), C = W0.cam;
    const g = ghost(C, 'first', 560, 330);
    const g2 = ghost(C, 'business', 880, 210);
    const im = cutout(C, 'assets/cut_teen_boss.png', { x: 300, y: 480, h: 1300 });
    const chips = [['💸  Loans with interest', 70, 860, 0.5], ['📈  Est. age 15', 640, 1010, 0.8], ['🤝  Clients: friends + family', 60, 1170, 1.1]].map(([s, x, y, d]) => { const c = chip(C, s, x, y, { size: 36, bg: '#fff', fg: V.ink }); c.style.boxShadow = '0 18px 40px rgba(110,70,170,.18)'; return [c, d]; });
    const cap = circled(C, 'so that was my', 'first', 230, { tKw: tw('first'), size: 58 });
    const k = smallCap(C, 330, [['entrepreneurial', tw('entrepreneur'), 1], ['business', tw('business'), 1]], 92);
    const tf = tw('first');
    return t => {
      W0.drift(t);
      camera(C, t, [[0, 1.1, 0, 60], [tf, 1.03, 0, 20], [DUR, 0.94, 0, 30]]);
      rise(im, t, -0.05, 0.8, 200);
      chips.forEach(([c, d]) => popIn(c, t, d + tf - 0.2, 0.4, 0.6));
      const u = (t - (tf - 0.2)) / 0.9; g.style.opacity = 0.85 * clamp(u); g.style.transform = `scale(${lerp(1.25, 1, ex(u))})`;
      const v = (t - tw('business')) / 0.9; g2.style.opacity = 0.75 * clamp(v); g2.style.transform = `scale(${lerp(1.25, 1, ex(v))})`;
      cap(t, tw('so')); k(t);
    };
  },

  // ------------------------------------------------------------------ house captions over the A-roll: small, light, one glowing violet keyword (v5 look)
  caps() {
    const chunks = (CUES.chunks || []).map(c => {
      const box = layer(); box.style.display = 'none';
      const words = c.words.filter(([, , m]) => m !== '~');
      const lines = []; let cur = null;
      for (const [t, w, m] of words) { const kw = m === '*' || m === '!' || m === '^'; if (!cur || cur.kw !== kw) { cur = { kw, items: [] }; lines.push(cur); } cur.items.push([t, w, m]); }
      const out = [];
      for (const L of lines) {
        if (L.kw) out.push(L);
        else { let row = { kw: false, items: [] }, len = 0; for (const it of L.items) { if (len + it[1].length > 26 && row.items.length) { out.push(row); row = { kw: false, items: [] }; len = 0; } row.items.push(it); len += it[1].length + 1; } out.push(row); }
      }
      let y = 1470; const ups = [];
      for (const L of out.reverse()) {
        const size = L.kw ? Math.min(140, Math.floor(1600 / Math.max(6, L.items.map(i => i[1]).join(' ').length))) : 58;
        y -= L.kw ? size * 0.98 : 72;
        ups.push(line(box, y, L.items.map(([t, w, m]) => ({ w, t, cls: L.kw ? 'kw' + (m === '!' ? ' kwn' : '') : 'run', css: L.kw ? { fontSize: size + 'px' } : {} }))));
      }
      return { box, ups, t0: c.t0, t1: c.t1 };
    });
    return t => chunks.forEach(c => { chunkVis(c.box, t, c.t0, c.t1); if (c.box.style.display !== 'none') c.ups.forEach(f => f(t)); });
  },
});

function layer() { return el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }); }
function avatar5(parent, letter, hue, x = 0, y = 0, s = 72) {
  const a = el('div', { position: parent.style.display === 'flex' ? 'relative' : 'absolute', left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', borderRadius: '50%',
    background: `linear-gradient(150deg, hsl(${hue},70%,72%), hsl(${hue + 30},60%,52%))`, display: 'grid', placeItems: 'center', font: `700 ${s * 0.42}px Inter`, color: '#fff', flex: 'none' }, parent, letter);
  if (parent.style.display !== 'flex' && x === 0 && y === 0) Object.assign(a.style, { position: 'absolute', left: '34px', top: '26px' });
  return a;
}
function neonDark(parent, s, y) {
  return el('div', { position: 'absolute', left: '0', width: '1080px', top: y + 'px', textAlign: 'center', font: '700 150px/1 Inter, sans-serif', letterSpacing: '-6px',
    color: V.violet, textShadow: '0 0 24px rgba(139,92,246,.45)' }, parent, s);
}
