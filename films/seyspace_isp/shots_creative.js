/* CREATIVE MOVES — concept-driven scenes. Each takes its words and components from the timeline row:
 *   ['podium', 2.6, 1.3, { headline: ['Make every rep', 'compete.'], entries: [...] }]
 * Components come from B.kit (kit.js, rebuilt in brand tokens). No screenshots.
 * All moves read brand variables and have 9:16 layouts. See references/creative-moves.md.
 */
'use strict';
const PAL = () => [getComputedStyle(document.documentElement).getPropertyValue('--acc').trim(), getComputedStyle(document.documentElement).getPropertyValue('--hi').trim(),
  getComputedStyle(document.documentElement).getPropertyValue('--acc2').trim(), getComputedStyle(document.documentElement).getPropertyValue('--dark').trim()];
const hd = (a, b, accent = true) => `${kesc(a)}${b ? `\n<span style="color:${accent ? 'var(--acc)' : 'var(--mut)'}">${kesc(b)}</span>` : ''}`;
const fitFs = (base, lines, maxW) => Math.min(base, maxW / (Math.max(...lines.map(l => String(l || '').length), 1) * .52));
const HAND_SVG = (fill = '#fff', stroke = 'var(--ink)') => `<svg width="100" height="118" viewBox="0 0 22 26" style="filter:drop-shadow(0 14px 14px rgba(0,0,0,.35))"><path d="M7 1.5c1 0 1.8.8 1.8 1.8v7.2l.6-.1c.9-.1 1.7.4 2 1.2.6-.3 1.4-.3 2 .1.5-.3 1.3-.3 1.9.1.9.6 1.5 1.6 1.5 2.7V19c0 3.3-2.7 6-6 6H9.6c-1.7 0-3.3-.8-4.3-2.1L1.6 18c-.6-.8-.5-1.9.3-2.5.8-.6 1.9-.5 2.5.3l.8 1V3.3C5.2 2.3 6 1.5 7 1.5z" fill="${fill}" stroke="${stroke}" stroke-width="1"/></svg>`;

/* ===== kinetic: one huge line (a time, a word), small accent, label, atmosphere ===== */
shot('kinetic', { hero: 1.6, len: 2.4, bg: 'dark', tout: 'whip',
  sfx: [[0.02, 'swell'], [0.5, 'tick'], [2.25, 'whoosh']],
  build(c, s, sc) {
    const glow = sc.glow || 'hi';
    s.sun = D(c, 'abs', { left: -200, width: W + 400, bottom: lv(-420, -620), height: lv(700, 900), borderRadius: '50%', background: `radial-gradient(closest-side,var(--${glow}) 0%,rgba(var(--accRGB),.18) 55%,transparent)`, filter: 'blur(10px)', opacity: .9 });
    const big = String(sc.big || '6:00'), fs = Math.min(lv(300, 260), W * .86 / (big.length * .56));
    s.big = D(c, 'ctr head', { left: CX, top: CY - lv(70, 120), fontSize: fs + 'px', whiteSpace: 'nowrap' }, `${kesc(big)}${sc.small ? `<span style="color:var(--${glow});font-size:.5em;letter-spacing:-.02em"> ${kesc(sc.small)}</span>` : ''}`);
    s.lab = sc.label ? D(c, 'ctr', { left: CX, top: CY + lv(140, 120), fontSize: lv(32, 36) + 'px', fontWeight: 600, letterSpacing: '.22em', opacity: .75, whiteSpace: 'nowrap', fontFamily: 'var(--font)' }, kesc(sc.label)) : null;
    s.line = D(c, 'abs', { left: 0, top: CY, width: W, height: 2, background: `linear-gradient(90deg,transparent,var(--${glow}),transparent)` });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 2.4) });
    blurIn(s.big, t, 0, .7, { blur: 40, s0: 1.15 });
    if (s.lab) blurIn(s.lab, t, .5, .9, { y: 16, blur: 10 });
    S(s.sun, { y: (1 - eo(P(t, 0, 1.4))) * 260, o: .9 });
    const lp = eio(P(t, .3, 1.2)); s.line.style.transform = `translateX(${L(-W, W, lp).toFixed(0)}px)`; s.line.style.opacity = lp > 0 && lp < 1 ? .8 : 0;
  } });

/* ===== scribbles: the problem drawn as an illustration (whiteboard / paper / sticky) ===== */
shot('scribbles', { hero: 2.4, len: 3.2, bg: 'light', tout: 'zoom',
  sfx: [[0.2, 'type10'], [0.9, 'type10'], [1.6, 'swoop'], [2.2, 'stamp'], [3.0, 'whoosh']],
  build(c, s, sc) {
    const bw = lv(1560, 960), bh = lv(820, 1320), bx = CX - bw / 2, by = lv(90, 260), surf = sc.surface || 'whiteboard';
    c.parentElement.style.background = 'linear-gradient(180deg,#eceff3,#e2e6ec)';
    s.board = D(c, 'abs', { left: bx, top: by, width: bw, height: bh, borderRadius: '14px', background: surf === 'paper' ? '#fffdf7' : surf === 'sticky' ? '#fff3a6' : 'linear-gradient(160deg,#fff,#f6f7f9)',
      boxShadow: surf === 'whiteboard' ? '0 0 0 14px #cfd5de,0 0 0 16px #b8c0cc,0 60px 120px -40px rgba(0,0,0,.45)' : '0 50px 100px -40px rgba(0,0,0,.45)', transformOrigin: '50% 50%' });
    const col = k => ({ ink: '#1f3a8a', blue: '#1f3a8a', red: '#e11d48', black: '#1e212e', acc: 'var(--acc)', hi: 'var(--hi)' }[k] || k || '#1f3a8a');
    s.items = (sc.items || []).map((it, i) => {
      const e = D(s.board, 'abs', { left: it.x * bw, top: it.y * bh, fontFamily: 'var(--font)', fontWeight: 700, fontSize: (it.size || 64) * lv(1, .9) + 'px', color: col(it.color), transform: `rotate(${it.rot || (i % 2 ? 1.5 : -1.5)}deg)`, whiteSpace: 'nowrap', letterSpacing: '-.01em' });
      const T = typed(e, '', {}, [{ t: it.t }], false);
      if (it.strike) { e.style.position = 'absolute'; D(e, 'abs', { left: '-3%', right: '-3%', top: '52%', height: '7px', borderRadius: '4px', background: 'currentColor' }); }
      let ring = null;
      if (it.circle) { ring = D(e, 'abs', { left: '-6%', top: '-18%', width: '112%', height: '136%' }, `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible"><ellipse cx="50" cy="50" rx="50" ry="50" fill="none" stroke="#e11d48" stroke-width="4" vector-effect="non-scaling-stroke" pathLength="1" stroke-dasharray="0 1" transform="rotate(-4 50 50)"/></svg>`); ring = ring.querySelector('ellipse'); }
      return { T, ring, d: .15 + i * .32 };
    });
    s.strokes = (sc.strokes || []).map((st, i) => {
      const sv = D(s.board, 'abs', { left: 0, top: 0, width: bw, height: bh }, `<svg width="${bw}" height="${bh}" viewBox="0 0 1000 1000" preserveAspectRatio="none" style="overflow:visible"><path d="${st.d}" fill="none" stroke="${col(st.color)}" stroke-width="${st.w || 8}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" pathLength="1" stroke-dasharray="0 1"/></svg>`);
      return { p: sv.querySelector('path'), d: .4 + i * .3 };
    });
    if (sc.smear) s.smear = D(s.board, 'abs', { left: bw * .18, top: bh * .74, width: bw * .55, height: 110, borderRadius: '60px', background: 'rgba(255,255,255,.92)', filter: 'blur(14px)' });
    const cap = sc.caption || [];
    s.cap = cap.length ? D(c, V ? 'ctr' : 'abs', V ? { left: CX, top: by + bh + 120 } : { right: 120, top: by + bh - 60 }, `<span style="display:inline-block;padding:22px 34px;border-radius:999px;background:var(--dark);color:#fff;font:800 ${lv(44, 46)}px var(--font);letter-spacing:-.02em;white-space:nowrap;box-shadow:0 20px 40px -10px rgba(0,0,0,.5)">${kesc(cap[0])} <span style="color:var(--hi)">${kesc(cap[1] || '')}</span></span>`) : null;
  },
  update(t, s, c) {
    S(c, { s: L(1.03, 1, eo(P(t, 0, 3))) });
    S(s.board, { r: -1.2, s: L(.96, 1, eo(P(t, 0, .5))), o: C(t * 6) });
    s.items.forEach(it => { typeP(it.T, P(t, it.d, it.d + .45), t, false); if (it.ring) it.ring.setAttribute('stroke-dasharray', `${eio(P(t, it.d + .45, it.d + .8)).toFixed(3)} 1`); });
    s.strokes.forEach(st => st.p.setAttribute('stroke-dasharray', `${eio(P(t, st.d, st.d + .5)).toFixed(3)} 1`));
    if (s.smear) S(s.smear, { o: P(t, 1.8, 2.1), x: L(-200, 0, eo(P(t, 1.8, 2.2))) });
    if (s.cap) { const q = P(t, 2.1, 2.4); S(s.cap, { s: L(.6, 1, bo(q)), o: q * 3 }); }
  } });

/* ===== crowd: N people (avatars in brand tints) with questions popping, centre counter card ===== */
shot('crowd', { hero: 2.2, len: 3.0, bg: 'dark', tin: 'zoom', tout: 'whip',
  sfx: [[0.05, 'pops8'], [0.6, 'pops6'], [1.4, 'stamp'], [2.85, 'whoosh']],
  build(c, s, sc) {
    const n = sc.count || 40, cols = lv(8, 5), rows = Math.ceil(n / cols), sx = lv(205, 190), sy = lv(175, 210), ox = CX - (cols - 1) * sx / 2 - 60, oy = CY - (rows - 1) * sy / 2 - 60;
    const tints = [['var(--acc)', 'var(--acc2)'], ['var(--hi)', 'var(--acc2)'], ['var(--acc3)', 'var(--acc)'], ['var(--dark)', 'var(--acc3)']];
    const names = sc.names || 'JS MK AR TB LC DW PM RV KO EH NS BG AT CJ LM QF'.split(' ');
    s.av = []; for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), k = i % cols, tn = tints[(i * 7) % 4];
      s.av.push({ e: D(c, 'abs', { left: ox + k * sx + (r % 2) * lv(50, 0), top: oy + r * sy, width: 120, height: 120, borderRadius: '50%', background: `linear-gradient(135deg,${tn[0]},${tn[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', font: '700 40px var(--font)', boxShadow: '0 0 0 5px rgba(255,255,255,.08)' }, names[i % names.length]), d: .02 + hash(i) * .5, a: .45 + (i * 13 % 10) / 20 }); }
    const qs = sc.questions || []; const spots = lv([[300, 150], [1380, 210], [230, 770], [1420, 780], [820, 900], [1500, 480]], [[90, 330], [600, 420], [80, 1450], [560, 1560], [300, 1700], [620, 760]]);
    s.q = qs.slice(0, 6).map((q, i) => D(c, 'abs', { left: spots[i][0], top: spots[i][1], padding: '12px 20px', borderRadius: '999px', background: '#fff', color: 'var(--ink)', font: '600 22px var(--font-body)', whiteSpace: 'nowrap', boxShadow: '0 14px 30px -12px rgba(0,0,0,.5)' }, kesc(q)));
    s.card = sc.center ? D(c, 'ctr', { left: CX, top: CY, padding: '30px 54px', borderRadius: '28px', background: 'rgba(10,14,24,.86)', backdropFilter: 'blur(8px)', boxShadow: '0 0 0 2px rgba(255,255,255,.08)', textAlign: 'center', color: '#fff' },
      `<div class="head" style="font-size:${lv(120, 130)}px">${kesc(sc.center[0])}</div><div style="font:600 ${lv(30, 34)}px var(--font-body);opacity:.75;margin-top:8px">${kesc(sc.center[1] || '')}</div>`) : null;
  },
  update(t, s, c) {
    S(c, { s: L(1.06, 1, eo(P(t, 0, 3))) });
    s.av.forEach(a => { const k = P(t, a.d, a.d + .35); S(a.e, { s: L(.4, 1, bo(k)), o: k * a.a }); });
    s.q.forEach((e, i) => { const d = .6 + i * .18, k = P(t, d, d + .3); S(e, { s: L(.5, 1, bo(k)), o: k * 3, y: Math.sin(t * 2 + i) * 6 }); });
    if (s.card) { const k = P(t, 1.3, 1.65); S(s.card, { s: L(.7, 1, bo(k)), o: k * 3 }); }
  } });

/* ===== dial: a gauge sweeps to a bad (or good) value beside a headline ===== */
shot('dial', { hero: 2.2, len: 2.8, bg: 'light', tout: 'whip',
  sfx: [[0.1, 'type12'], [0.6, 'ticks12'], [1.7, 'down'], [2.65, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || [''], fs = fitFs(lv(124, 110), h, lv(860, 940));   // any number of lines; lines 2+ are muted (or accent)
    s.h = typed(c, 'abs head', { left: lv(130, 80), top: lv(300, 260), fontSize: fs + 'px' }, h.map((l, i) => ({ t: (i ? '\n' : '') + l, cls: i ? 'l2' : '' })), false);
    s.h.el.querySelectorAll('.l2').forEach(e => e.style.color = sc.accent ? 'var(--acc)' : 'var(--mut)');
    const gx = lv(1060, 160), gy = lv(200, 820);
    s.g = D(c, 'abs', { left: gx, top: gy, width: 760, height: 640 }, `<svg width="760" height="640" viewBox="0 0 760 640">
      <path d="M80 520 A300 300 0 0 1 680 520" fill="none" stroke="var(--line)" stroke-width="56" stroke-linecap="round"/>
      <path class="arc" d="M80 520 A300 300 0 0 1 680 520" fill="none" stroke="var(--ink)" stroke-width="56" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      <line class="ndl" x1="380" y1="520" x2="380" y2="250" stroke="var(--ink)" stroke-width="12" stroke-linecap="round"/><circle cx="380" cy="520" r="26" fill="var(--ink)"/>
      <text class="val" x="380" y="420" text-anchor="middle" style="font:var(--head-weight) 150px var(--font);letter-spacing:-6px" fill="var(--ink)">0</text>
      <text x="380" y="610" text-anchor="middle" style="font:700 30px var(--font-body);letter-spacing:6px" fill="var(--mut)">${kesc(sc.label || '')}</text></svg>`);
    s.arc = s.g.querySelector('.arc'); s.ndl = s.g.querySelector('.ndl'); s.val = s.g.querySelector('.val');
  },
  update(t, s, c, sc) {
    S(c, { s: L(1, 1.04, t / 2.8) });
    typeP(s.h, P(t, .1, .8), t, false);
    S(s.g, { o: C(P(t, .2, .4) * 3), s: L(.9, 1, eo(P(t, .2, .7))) });
    const from = sc.from == null ? 100 : sc.from, to = sc.value == null ? 2 : sc.value;
    const v = L(from, to, eio(P(t, .6, 1.8))), f = v / 100;
    s.arc.setAttribute('stroke-dasharray', `${Math.max(.001, f).toFixed(3)} 1`);
    const ang = Math.PI * (1 - f), r = 270; s.ndl.setAttribute('x2', (380 - Math.cos(ang) * -r * -1 * -1 + 0).toFixed(1));
    s.ndl.setAttribute('x2', (380 - r * Math.cos(Math.PI * f)).toFixed(1)); s.ndl.setAttribute('y2', (520 - r * Math.sin(Math.PI * f)).toFixed(1));
    s.val.textContent = Math.round(v) + (sc.unit || '%');
  } });

/* ===== funnel: a crowd of dots squeezed through a narrow gate; only a few get through ===== */
shot('funnel', { hero: 2.4, len: 3.0, bg: 'light', tin: 'whip', tout: 'zoom',
  sfx: [[0.1, 'swell'], [0.8, 'ticks10'], [2.85, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || ['', ''];
    s.h = D(c, 'ctr head', { left: CX, top: lv(150, 230), fontSize: fitFs(lv(110, 100), [V ? h[0] : h.join(' ')], W * .9) + 'px', textAlign: 'center' }, `${kesc(h[0])}${V ? '\n' : ' '}<span style="color:var(--mut)">${kesc(h[1] || '')}</span>`);
    s.cv = document.createElement('canvas'); s.cv.width = W; s.cv.height = H; s.cv.className = 'abs'; s.cv.style.left = 0; s.cv.style.top = 0; c.appendChild(s.cv);
    s.gx = CX; s.gy = lv(660, CY + 260);
    s.g1 = D(c, 'abs', { left: s.gx - 30, top: s.gy - lv(360, 520), width: 60, height: lv(330, 490), borderRadius: '30px', background: 'var(--ink)' });
    s.g2 = D(c, 'abs', { left: s.gx - 30, top: s.gy + 30, width: 60, height: lv(330, 490), borderRadius: '30px', background: 'var(--ink)' });
    s.gate = D(c, 'ctr', { left: s.gx, top: s.gy, padding: '8px 16px', borderRadius: '999px', background: 'var(--hi)', color: 'var(--ink)', font: '800 22px var(--font)', letterSpacing: '.06em' }, kesc(sc.gate || 'FEED'));
    s.n = sc.count || 1200; s.pass = sc.pass || 24;
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3) });
    blurIn(s.h, t, 0, .45, { y: -16 });
    const x = s.cv.getContext('2d'); x.clearRect(0, 0, W, H);
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(), hi = getComputedStyle(document.documentElement).getPropertyValue('--hi').trim();
    const cx = lv(480, CX), cy = lv(s.gy - 20, s.gy - 560), R = lv(330, 300), app = eo(P(t, 0, .6));
    for (let i = 0; i < s.n; i++) {
      const r = Math.sqrt(hash(i)) * R * app, a = hash(i + 999) * 6.283 + t * .2 * (hash(i + 7) - .5);
      let X = cx + Math.cos(a) * r, Y = cy + Math.sin(a) * r * 1.05;
      const push = eio(P(t, .5, 2.2)) * .25; X += (s.gx - 80 - X) * push * hash(i + 3); if (V) { X = cx + Math.cos(a) * r; Y += (s.gy - 60 - Y) * push * hash(i + 3); }
      x.globalAlpha = (.25 + hash(i + 5) * .5) * C(t * 4); x.fillStyle = i % 9 === 0 ? hi : ink; x.beginPath(); x.arc(X, Y, 5, 0, 7); x.fill();
    }
    for (let i = 0; i < s.pass; i++) {
      const d = .9 + i * .06, k = eio(P(t, d, d + .9));
      const tx = lv(s.gx + 120 + hash(i + 50) * 700, s.gx - 300 + hash(i + 50) * 600), ty = lv(s.gy - 200 + hash(i + 70) * 400, s.gy + 140 + hash(i + 70) * 500);
      const X = k < .5 ? L(lv(s.gx - 90, s.gx), s.gx, k * 2) : L(s.gx, tx, (k - .5) * 2), Y = k < .5 ? L(lv(s.gy, s.gy - 90), s.gy, k * 2) : L(s.gy, ty, (k - .5) * 2);
      x.globalAlpha = k > 0 ? 1 : 0; x.fillStyle = i % 5 === 0 ? hi : ink; x.beginPath(); x.arc(X, Y, 6, 0, 7); x.fill();
    }
    x.globalAlpha = 1;
  } });

/* ===== strokesLogo: coloured strokes from the edges converge; the brand mark forms where they meet ===== */
shot('strokesLogo', { hero: 1.7, len: 2.4, bg: 'dark', marker: 'turn', flashOut: false,
  sfx: [[0.0, 'boom'], [0.2, 'shimmer'], [0.5, 'riser'], [2.35, 'hit']],
  build(c, s, sc) {
    const P_ = PAL(), cols = sc.colors || [P_[0], P_[1], P_[2], '#e11d48', '#1f3a8a'];
    const ends = lv([[120, 200], [1800, 160], [200, 940], [1760, 960], [960, 60], [60, 520], [1860, 560]], [[60, 300], [1020, 260], [80, 1700], [1000, 1660], [540, 80], [40, 960], [1040, 1000]]);
    s.svg = D(c, 'abs', { left: 0, top: 0, width: W, height: H }, `<svg width="${W}" height="${H}">${ends.map((e, i) => { const mx = (e[0] + CX) / 2 + (i % 2 ? 160 : -160), my = (e[1] + CY) / 2 + (i % 3 ? 90 : -90);
      return `<path d="M${e[0]} ${e[1]} Q ${mx} ${my} ${CX + (e[0] < CX ? -40 : 40)} ${CY + (e[1] < CY ? -30 : 30)}" fill="none" stroke="${cols[i % cols.length]}" stroke-width="${i > 4 ? 3 : 6}" stroke-linecap="round" pathLength="1" stroke-dasharray="0 1" opacity="${i > 4 ? .4 : .95}"/>`; }).join('')}</svg>`);
    s.paths = [...s.svg.querySelectorAll('path')];
    s.glow = D(c, 'ctr', { left: CX, top: CY - 20, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(closest-side,var(--hi),transparent)', opacity: 0 });
    s.mark = D(c, 'ctr', { left: CX, top: CY - 20 }, BR.markSvg ? `<div style="width:${lv(250, 240)}px;color:#fff">${BR.markSvg}</div>` : BR.icon ? markHTML(lv(220, 220)) : logoHTML(110, true));
    s.word = D(c, 'ctr', { left: CX, top: CY + lv(220, 240), font: `800 ${lv(44, 48)}px var(--font)`, letterSpacing: '.32em', color: '#fff', whiteSpace: 'nowrap' }, kesc((sc.word || B.product).toUpperCase()));
  },
  update(t, s, c) {
    S(c, { s: L(1.06, 1, eo(P(t, 0, 2.4))) });
    s.paths.forEach((p, i) => { const d = i * .05; p.setAttribute('stroke-dasharray', `${eio(P(t, d, d + .9)).toFixed(3)} 1`); p.style.opacity = (1 - P(t, 1.6, 2.2) * .7) * (i > 4 ? .4 : .95); });
    const m = P(t, .85, 1.3); S(s.mark, { s: L(.3, 1, bo(m)), o: C(m * 3), b: (1 - eo(m)) * 12 });
    S(s.glow, { o: eo(m) * (.55 + .15 * Math.sin(t * 6)), s: L(.5, 1.1, eo(m)) });
    blurIn(s.word, t, 1.25, 1.7, { y: 16, blur: 12 });
  } });

/* ===== inline: a kinetic sentence with a rebuilt component sitting inside it ===== */
shot('inline', { hero: 2.6, len: 3.4, bg: 'light', tin: 'up', tout: 'whip',
  sfx: [[0.1, 'type8'], [0.55, 'whoosh_s'], [0.9, 'pops4'], [1.6, 'type8'], [2.3, 'pop'], [3.2, 'whoosh']],
  build(c, s, sc) {
    const fs = lv(150, 130);
    s.w1 = D(c, 'abs head', { left: lv(140, 80), top: lv(250, 280), fontSize: fs + 'px' }, kesc(sc.before || ''));
    s.w2 = D(c, 'abs head', { left: lv(1520, 80), top: lv(250, 1480), fontSize: fs + 'px', color: 'var(--acc)' }, kesc(sc.after || ''));
    s.w3 = sc.line2 ? D(c, 'abs head', { left: lv(140, 80), top: lv(640, 1640), fontSize: fs + 'px', color: 'var(--acc)' }, kesc(sc.line2)) : null;
    s.comp = renderComponent(c, sc.component, { x: lv(700, 110), y: lv(110, 520), w: lv(680, 860) });
    s.comp.el.style.transformOrigin = '0 0';
    s.btn = sc.button ? D(c, 'abs', { left: lv(1180, 600), top: lv(820, 1380) }, btnHTML(sc.button, 1, 1.25)) : null;
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.4) });
    const k1 = eo(P(t, 0, .45)); S(s.w1, { x: (1 - k1) * -200, o: k1 * 2, b: (1 - k1) * 12 });
    const cp = P(t, .4, .95), cx = tt => L(lv(900, 0), 0, eo(P(tt, .4, .95))), cy = tt => L(lv(0, 900), 0, eo(P(tt, .4, .95)));
    S(s.comp.el, { x: cx(t), y: cy(t), r: L(12, -3, eo(cp)), s: lv(1.18, 1), o: C(cp * 4), bx: Math.min(50, vel(cx, t) * .3), by: Math.min(50, vel(cy, t) * .3) });
    revealParts(s.comp, t, .75); animateComponent(s.comp, t, .75);
    const k2 = eo(P(t, 1.3, 1.7)); S(s.w2, { x: (1 - k2) * lv(200, 0), y: (1 - k2) * lv(0, 120), o: k2 * 2, b: (1 - k2) * 12 });
    if (s.w3) { const k3 = eo(P(t, 1.6, 2.0)); S(s.w3, { y: (1 - k3) * 120, o: k3 * 2, b: (1 - k3) * 12 }); }
    if (s.btn) { const q = P(t, 2.2, 2.5); S(s.btn, { s: L(.6, 1, bo(q)), o: q * 3 }); }
  } });

/* ===== componentHero: one rebuilt component, big, in 3D; it comes alive (typing, toggles, counters) ===== */
shot('componentHero', { hero: 2.8, len: 3.6, bg: 'light', tin: 'zoom', tout: 'whip',
  sfx: [[0.1, 'type8'], [0.5, 'whoosh_s'], [1.0, 'type14'], [2.0, 'click'], [3.4, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || ['', ''], fs = fitFs(lv(118, 110), h, lv(560, 900));
    s.h = typed(c, 'abs head', { left: lv(120, 80), top: lv(360, 250), fontSize: fs + 'px' }, [{ t: h[0] }, { t: h[1] ? '\n' + h[1] : '', cls: sc.accent === false ? '' : 'acc' }], false);
    if (sc.accent === false && s.h.el.lastElementChild) s.h.el.lastElementChild.style.color = 'var(--mut)';
    s.wrap = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '2400px' });
    const z = sc.zoom || lv(1.45, 1.2);   // components are drawn at UI size; the hero shows one big
    s.comp = renderComponent(s.wrap, sc.component, { x: lv(740, 60) / z, y: lv(240, 560) / z, w: lv(1080, 960) / z });
    s.comp.el.style.zoom = z; s.comp.el.style.transformOrigin = '50% 100%';
  },
  update(t, s, c, sc) {
    S(c, { s: L(1, 1.04, t / 3.6) });
    typeP(s.h, P(t, .1, .7), t, false);
    const r = eo(P(t, .2, 1.0)), ry = tt => L(500, 0, eo(P(tt, .2, 1.0)));
    s.comp.el.style.transform = `translateY(${ry(t).toFixed(1)}px) rotateX(${L(28, 0, r).toFixed(2)}deg) rotateY(${L(lv(-14, 0), lv(-4, 0), r).toFixed(2)}deg)`;
    s.comp.el.style.opacity = C(P(t, .2, .35) * 3).toFixed(3);
    revealParts(s.comp, t, .6, .08); animateComponent(s.comp, t, .6);
    if (sc.titleSlide && s.comp.el._title) { typeP(s.comp.el._title, 1, 99, false); const tt = s.comp.el.querySelector('.kedtitle'); tt.style.overflow = 'hidden'; const k = eo(P(t, .8, 1.35)); s.comp.el._title.el.style.transform = `translateY(${((1 - k) * 110).toFixed(1)}%)`; s.comp.el._title.el.style.display = 'block'; }
    if (sc.slideHead) { s.h.el.style.overflow = 'hidden'; typeP(s.h, 1, 99, false); const k = eo(P(t, .05, .6)); s.h.el.style.clipPath = `inset(0 0 ${((1 - k) * 100).toFixed(1)}% 0)`; S(s.h.el, { y: (1 - k) * 60 }); }
  } });

/* ===== podium: ranked entries (a leaderboard) become 3D podium blocks with medals and count-ups ===== */
shot('podium', { hero: 2.4, len: 3.2, bg: 'dark', tin: 'zoom', tout: 'up',
  sfx: [[0.1, 'type8'], [0.5, 'whoosh_s'], [0.7, 'ticks12'], [1.5, 'pops3'], [3.0, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || ['', ''];
    s.h = D(c, 'ctr head', { left: CX, top: lv(150, 330), fontSize: fitFs(lv(110, 100), [h.join(' ')], W * .92) + 'px', textAlign: 'center', whiteSpace: V ? 'pre' : 'nowrap' }, `${kesc(h[0])}${V ? '\n' : ' '}<span style="color:var(--hi)">${kesc(h[1] || '')}</span>`);
    D(c, 'abs', { left: 0, right: 0, top: lv(880, 1420), height: 300, background: 'linear-gradient(180deg,rgba(255,255,255,.06),transparent)' });
    const es = sc.entries || [{ place: 2, value: '205', name: '' }, { place: 1, value: '210', name: '' }, { place: 3, value: '190', name: '' }];
    const bw = lv(300, 290), gap = lv(40, 26), floor = lv(880, 1420), hs = { 1: lv(430, 520), 2: lv(330, 400), 3: lv(250, 300) };
    s.blocks = es.map((e, i) => { const x = CX + (i - (es.length - 1) / 2) * (bw + gap), h0 = hs[e.place] || 280, top = floor - h0;
      const b = D(c, 'abs', { left: x - bw / 2, top, width: bw, height: h0, borderRadius: '14px 14px 0 0', background: 'linear-gradient(180deg,color-mix(in srgb,var(--hi) 85%,#fff),var(--hi) 40%,color-mix(in srgb,var(--hi) 85%,#000))', boxShadow: '0 40px 80px -20px color-mix(in srgb,var(--hi) 55%,transparent)', transformOrigin: '50% 100%' },
        `<div class="ctr head num" style="left:${bw / 2}px;top:${Math.min(110, h0 / 2)}px;font-size:${lv(110, 100)}px;color:#fff">0</div><div class="ctr" style="left:${bw / 2}px;top:${Math.min(110, h0 / 2) + 90}px;font:700 28px var(--font-body);color:#fff;opacity:.9;white-space:nowrap">${kesc(e.name || '')}</div>`);
      const m = D(c, 'ctr', { left: x, top: top - 80, width: 86, height: 86, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%,#fff,${['', '#ffc53d', '#c0c7d1', '#cd7f32'][e.place] || '#c0c7d1'} 45%)`, boxShadow: '0 10px 30px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 40px var(--font)', color: '#1e212e' }, e.place);
      return { b, m, n: b.querySelector('.num'), st: parseStat(e.value), d: .4 + (e.place === 1 ? .25 : e.place === 2 ? .1 : 0) }; });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.2) });
    blurIn(s.h, t, 0, .45, { y: -20 });
    s.blocks.forEach(k => { const g = eo(P(t, k.d, k.d + .6)); k.b.style.transform = `scaleY(${g.toFixed(3)})`; k.n.textContent = fmtStat(k.st, eo(P(t, k.d + .2, k.d + 1.2)));
      const q = P(t, k.d + .6, k.d + .9); S(k.m, { s: L(.3, 1, bo(q)), o: q * 3, y: (1 - eo(q)) * -40 }); });
  } });

/* ===== chartSet: their chart becomes the set (giant bars rising from the floor) + optional slider with a hand ===== */
shot('chartSet', { hero: 2.6, len: 3.4, bg: 'light', tin: 'whip', tout: 'whip',
  sfx: [[0.1, 'type8'], [0.4, 'swoop'], [0.7, 'pops2'], [1.6, 'click'], [3.2, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || ['', ''];
    s.h = typed(c, 'abs head', { left: lv(130, 80), top: lv(170, 230), fontSize: lv(120, 110) + 'px' }, [{ t: h[0] }, { t: h[1] ? '\n' + h[1] : '', cls: 'acc' }], false);
    s.pill = sc.pill ? D(c, 'abs', { left: lv(120, 80), top: lv(520, 500), padding: '12px 22px', borderRadius: '999px', background: 'var(--dark)', color: '#fff', font: '700 24px var(--font-body)' }, kesc(sc.pill)) : null;
    const bars = sc.bars || [{ value: '405', label: 'TEAM AVG' }, { value: '365', label: 'ATHLETE' }];
    const mx = Math.max(...bars.map(b => parseStat(b.value).n)), bw = lv(420, 400), gap = lv(60, 40), x0 = lv(900, CX - (bars.length * (bw + gap) - gap) / 2), maxH = lv(780, 900);
    s.bars = bars.map((b, i) => { const st = parseStat(b.value), hgt = maxH * st.n / mx;
      const e = D(c, 'abs', { left: x0 + i * (bw + gap), top: H - hgt, width: bw, height: hgt, borderRadius: '24px 24px 0 0', background: b.color || (i ? 'linear-gradient(180deg,var(--acc2),var(--acc))' : 'linear-gradient(180deg,color-mix(in srgb,var(--acc2) 45%,#fff),color-mix(in srgb,var(--acc2) 60%,#fff))'), transformOrigin: '50% 100%' },
        `<div class="ctr head num" style="left:${bw / 2}px;top:70px;font-size:80px;color:${i ? '#fff' : 'var(--ink)'}">0</div><div class="ctr" style="left:${bw / 2}px;top:${hgt - 40}px;font:700 26px var(--font-body);color:${i ? '#fff' : 'var(--ink)'};white-space:nowrap">${kesc(b.label || '')}</div>`);
      return { e, n: e.querySelector('.num'), st, d: .35 + i * .15 }; });
    if (sc.slider) { s.sl = renderComponent(c, Object.assign({ type: 'slider' }, sc.slider), { x: lv(140, 80), y: lv(700, 1660 - 200), w: lv(620, 600) });
      s.hand = D(c, 'abs', { left: 0, top: 0 }, HAND_SVG()); }
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.4) });
    typeP(s.h, P(t, .05, .6), t, false); if (s.pill) blurIn(s.pill, t, .5, .8, { y: 14, blur: 8 });
    s.bars.forEach(b => { b.e.style.transform = `scaleY(${eo(P(t, b.d, b.d + .7)).toFixed(3)})`; b.n.textContent = fmtStat(b.st, eo(P(t, b.d + .1, b.d + 1.1))); });
    if (s.sl) { const q = P(t, .9, 1.2); S(s.sl.el, { y: (1 - eo(q)) * 60, o: q * 3 }); animateComponent(s.sl, t, 1.0);
      const kn = s.sl.el._knob.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      S(s.hand, { x: kn.left - sr.left + 2, y: kn.top - sr.top + 14, o: P(t, 1.2, 1.4) }); }
  } });

/* ===== fan: many cards (emails, notifications) fly out into a fan; a stat tile counts up ===== */
shot('fan', { hero: 2.6, len: 3.4, bg: 'dark', tin: 'zoom', tout: 'fade',
  sfx: [[0.1, 'type8'], [0.5, 'swoop'], [0.6, 'pops6'], [1.5, 'ticks10'], [3.2, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || ['', ''];
    s.h = D(c, 'ctr head', { left: CX, top: lv(140, 300), fontSize: fitFs(lv(100, 96), [h.join(' ')], W * .9) + 'px', textAlign: 'center', whiteSpace: V ? 'pre' : 'nowrap' }, `${kesc(h[0])}${V ? '\n' : ' '}<span style="color:var(--hi)">${kesc(h[1] || '')}</span>`);
    const n = sc.count || 7, base = kitSpec(sc.card || { type: 'email', from: B.product, subject: 'New issue' });
    s.cards = []; for (let i = 0; i < n; i++) { const sp = Object.assign({}, base, sc.subjects ? { subject: sc.subjects[i % sc.subjects.length] } : {}, i % 2 && base.type === 'email' ? { dot: 'var(--hi)' } : {});
      const k = renderComponent(c, sp, { x: CX - 210, y: lv(400, 760), w: 420 }); k.el.style.gap = '10px'; k.el.style.padding = '22px 24px';
      s.cards.push({ k, i: i - (n - 1) / 2, d: .45 + Math.abs(i - (n - 1) / 2) * .06 }); }
    s.stat = sc.stat ? renderComponent(c, sc.stat, { x: CX - lv(230, 260), y: lv(760, 1360), w: lv(460, 520) }) : null;
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.4) });
    blurIn(s.h, t, 0, .45, { y: -16 });
    s.cards.forEach(({ k, i, d }) => { const p = eio(P(t, d, d + .7));
      S(k.el, { x: i * lv(230, 120) * p, y: lv(Math.abs(i) * 40, Math.abs(i) * 60) * p + (1 - eo(P(t, d - .1, d + .3))) * 200, r: i * lv(14, 9) * p, o: C(P(t, d - .1, d + .1) * 5) }); });
    if (s.stat) { const q = P(t, 1.3, 1.6); S(s.stat.el, { y: (1 - eo(q)) * 80, o: q * 3 }); animateComponent(s.stat, t, 1.3); }
  } });

/* ===== dotNumber: hundreds of dots fly in and assemble into the number ===== */
shot('dotNumber', { hero: 2.2, len: 3.0, bg: 'dark', tin: 'fade', tout: 'zoom',
  sfx: [[0.1, 'shimmer'], [0.3, 'ticks12'], [1.5, 'pop'], [2.85, 'whoosh']],
  build(c, s, sc) {
    s.cv = document.createElement('canvas'); s.cv.width = W; s.cv.height = H; s.cv.className = 'abs'; s.cv.style.left = 0; s.cv.style.top = 0; c.appendChild(s.cv);
    s.cap = D(c, 'ctr', { left: CX, top: CY + lv(280, 330), font: `600 ${lv(42, 44)}px var(--font-body)`, textAlign: 'center', opacity: .85, width: W * .9 }, `${kesc((sc.caption || [])[0] || '')}${(sc.caption || [])[1] ? ` <span style="color:var(--hi)">${kesc(sc.caption[1])}</span>` : ''}`);
    s.value = String(sc.value || '100+'); s.pts = null;
  },
  measure(s) { // sample the number's glyphs (fonts are ready now)
    const o = document.createElement('canvas'); o.width = W; o.height = H; const x = o.getContext('2d');
    const fam = getComputedStyle(document.documentElement).getPropertyValue('--font').trim(), fs = Math.min(lv(360, 300), W * .9 / (s.value.length * .6));
    x.font = `800 ${fs}px ${fam}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s.value, CX, CY - lv(70, 80));
    const d = x.getImageData(0, 0, W, H).data, pts = [], step = lv(11, 9);
    for (let y = 0; y < H; y += step) for (let X = 0; X < W; X += step) if (d[(y * W + X) * 4 + 3] > 128) pts.push([X, y]);
    s.pts = pts;
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 3))) });
    const x = s.cv.getContext('2d'); x.clearRect(0, 0, W, H); if (!s.pts) return;
    const pal = PAL(); const cs = ['#ffffff', '#ffffff', '#ffffff', pal[1], pal[2]];
    s.pts.forEach(([tx, ty], i) => { const d = hash(i) * .5, k = eio(P(t, .15 + d, .95 + d));
      const sx = hash(i + 11) * W, sy = hash(i + 23) * H; x.globalAlpha = C(P(t, d * .5, d * .5 + .2) * 3) * (.8 + .2 * hash(i + 3));
      x.fillStyle = cs[(i * 37) % cs.length]; x.beginPath(); x.arc(L(sx, tx, k), L(sy, ty, k), 3.4 + hash(i + 5) * 1.4, 0, 7); x.fill(); });
    x.globalAlpha = 1;
    blurIn(s.cap, t, 1.5, 1.9, { y: 18 });
  } });

/* ===== statLine: their real number, big, over a growth line drawn in their chart colour ===== */
shot('statLine', { hero: 2.4, len: 3.0, bg: 'dark', tin: 'zoom', tout: 'fade',
  sfx: [[0.1, 'swoop'], [0.3, 'ticks12'], [1.4, 'pop'], [2.85, 'whoosh']],
  build(c, s, sc) {
    const col = sc.color || 'var(--hi)';
    const pts = lv('M0 900 C 300 880, 420 800, 620 780 S 980 720, 1180 560 S 1600 380, 1920 300', 'M0 1620 C 200 1600, 300 1500, 420 1460 S 640 1380, 760 1200 S 960 1000, 1080 900');
    s.svg = D(c, 'abs', { left: 0, top: 0, width: W, height: H }, `<svg width="${W}" height="${H}"><defs><linearGradient id="slf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:.45"/><stop offset="1" style="stop-color:${col};stop-opacity:0"/></linearGradient></defs>
      <path class="ar" d="${pts} L${W} ${H} L0 ${H}Z" fill="url(#slf)" opacity="0"/><path class="ln" d="${pts}" fill="none" style="stroke:${col}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="0 1"/></svg>`);
    s.ln = s.svg.querySelector('.ln'); s.ar = s.svg.querySelector('.ar');
    s.chip = sc.chip ? D(c, 'abs', { left: lv(1100, 560), top: lv(440, 1080), padding: '12px 20px', borderRadius: '12px', background: '#fff', color: 'var(--ink)', font: '800 32px var(--font)' }, kesc(sc.chip)) : null;
    const v = V && sc.valueShort ? sc.valueShort : String(sc.value || ''); s.st = parseStat(v);
    s.num = D(c, 'abs head num', { left: lv(120, 80), top: lv(150, 330), fontSize: Math.min(lv(180, 190), W * .86 / (v.length * .56)) + 'px' }, v);
    s.bar = D(c, 'abs', { left: lv(130, 86), top: lv(350, 540), width: lv(640, 600), height: 12, borderRadius: '6px', background: 'var(--hi)', transformOrigin: '0 50%' });
    s.cap = D(c, 'abs', { left: lv(130, 86), top: lv(400, 590), width: lv(760, 900), font: `500 ${lv(38, 42)}px/1.35 var(--font-body)`, opacity: .85 }, `${kesc(sc.caption || '')}${sc.bold ? ` <b style="opacity:1">${kesc(sc.bold)}</b>` : ''}`);
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3) });
    s.ln.setAttribute('stroke-dasharray', `${eio(P(t, .1, 1.3)).toFixed(3)} 1`); s.ar.style.opacity = eo(P(t, .8, 1.5)).toFixed(3);
    s.num.textContent = fmtStat(s.st, eo(P(t, .1, 1.2))); S(s.num, { o: C(t * 6), b: (1 - eo(P(t, 0, .3))) * 14 });
    s.bar.style.transform = `scaleX(${eio(P(t, 1.0, 1.4)).toFixed(3)})`;
    blurIn(s.cap, t, 1.2, 1.6, { y: 16 });
    if (s.chip) { const q = P(t, 1.3, 1.6); S(s.chip, { s: L(.5, 1, bo(q)), o: q * 3 }); }
  } });

/* ===== flood: CTA — their button is clicked; its colour floods the frame; logo, tagline, buttons ===== */
shot('flood', { hero: 3.0, len: 4.0, bg: 'light', marker: 'cta', tin: 'zoom',
  sfx: [[0.6, 'click'], [0.65, 'hit'], [1.4, 'whoosh_s'], [1.9, 'pops2']],
  build(c, s, sc) {
    const ct = B.cta || {};
    s.btn = D(c, 'ctr', { left: CX, top: CY }, btnHTML(sc.button || ct.primary || 'Get started', 1, lv(1.6, 1.8)));
    s.hand = D(c, 'abs', { left: 0, top: 0 }, HAND_SVG());
    s.flood = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: sc.fill || 'var(--b1-bg)' });
    s.flood2 = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: 'var(--bgAccent)', opacity: sc.fill ? 0 : 0 });
    s.logo = D(c, 'ctr', { left: CX, top: CY - lv(150, 260) }, logoHTML(BR.logoHeight || lv(120, 110), true));
    const tg = ct.tagline || [B.product, ''];
    s.tag = D(c, 'ctr head', { left: CX, top: CY + lv(10, -60), fontSize: lv(80, 84) + 'px', color: '#fff', textAlign: 'center' }, `${kesc(V ? String(tg[0]).trim() + '\n' : tg[0])}${kesc(tg[1] || '')}`);
    s.btns = D(c, 'ctr row', { left: CX, top: CY + lv(160, 180), gap: '22px', flexDirection: V ? 'column' : 'row' },
      `<span class="btn" style="background:#fff;color:var(--acc);border-radius:var(--b1-radius);font-size:${lv(32, 40)}px;padding:${lv(24, 30)}px ${lv(44, 60)}px">${kesc(ct.primary || '')}</span>` + (ct.secondary ? `<span class="btn" style="color:#fff;border:2px solid #fff;border-radius:var(--b2-radius);font-size:${lv(32, 40)}px;padding:${lv(22, 28)}px ${lv(44, 60)}px">${kesc(ct.secondary)}</span>` : ''));
    s.bl = [...s.btns.children];
    s.url = D(c, 'ctr', { left: CX, top: CY + lv(270, 420), color: '#fff', opacity: .8, font: `500 ${lv(26, 32)}px var(--font-body)` }, kesc(B.url || ''));
  },
  measure(s) { const p = centerOf(s.btn); s.bx = p.x; s.by = p.y; },
  update(t, s, c) {
    S(c, { s: L(1.02, 1, eo(P(t, 0, 4))) });
    const bp = P(t, 0, .3); S(s.btn, { s: L(.7, 1, bo(bp)) * (t > .55 && t < .75 ? .93 : 1), o: C(bp * 3) * (1 - P(t, .9, 1.1)) });
    if (s.bx != null) S(s.hand, { x: L(s.bx + 300, s.bx - 30, eio(P(t, .1, .55))), y: L(s.by + 300, s.by - 4, eio(P(t, .1, .55))), o: P(t, .1, .2) * (1 - P(t, .8, 1.0)) });
    const R = 2400 * eio(P(t, .6, 1.3)); s.flood.style.clipPath = `circle(${R.toFixed(0)}px at ${(s.bx || CX).toFixed(0)}px ${(s.by || CY).toFixed(0)}px)`;
    blurIn(s.logo, t, 1.1, 1.5, { blur: 20, s0: 1.1 }); blurIn(s.tag, t, 1.35, 1.75, { y: 24 });
    s.bl.forEach((e, i) => { const a = 1.7 + i * .15, k = P(t, a, a + .35); S(e, { y: (1 - eo(k)) * 40, o: k * 2, s: L(.9, 1, bo(k)) }); });
    blurIn(s.url, t, 2.1, 2.4, { y: 12, blur: 10 });
  } });

/* ===== viewfinder: the problem seen through a camera that can't focus (photo/video brands) =====
 * params: photo (atmosphere image), headline: [a, b], items: [..messages popping in the frame], readout: '1/250  f/2.8  ISO 1600' */
shot('viewfinder', { hero: 2.4, len: 3.0, bg: 'dark', tin: 'fade', tout: 'zoom',
  sfx: [[0.05, 'swell'], [0.4, 'pops4'], [1.1, 'pops4'], [1.6, 'tick'], [2.85, 'whoosh']],
  build(c, s, sc) {
    s.ph = D(c, 'abs', { left: -40, top: -40, width: W + 80, height: H + 80, background: `url('${sc.photo}') center 30%/cover` });
    s.dim = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 45%,rgba(0,0,0,.25),rgba(0,0,0,.78))' });
    const ix = lv(110, 70), iy = lv(80, 200), bl = 90;
    s.br = [[ix, iy, 'tl'], [W - ix, iy, 'tr'], [ix, H - iy, 'bl'], [W - ix, H - iy, 'br']].map(([x, y, k]) => D(c, 'abs', { left: x - (k[1] === 'r' ? bl : 0), top: y - (k[0] === 'b' ? bl : 0), width: bl, height: bl,
      borderTop: k[0] === 't' ? '5px solid #fff' : 'none', borderBottom: k[0] === 'b' ? '5px solid #fff' : 'none', borderLeft: k[1] === 'l' ? '5px solid #fff' : 'none', borderRight: k[1] === 'r' ? '5px solid #fff' : 'none', opacity: .9 }));
    s.rec = D(c, 'abs', { left: ix + 30, top: iy + 26, font: '700 26px var(--font-body)', color: '#fff', letterSpacing: '.12em' }, '<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:#ff3b30;margin-right:12px;vertical-align:-2px"></span>REC');
    s.ro = D(c, 'abs', { left: ix + 30, top: H - iy - 60, font: '600 26px var(--font-body)', color: 'rgba(255,255,255,.85)', letterSpacing: '.14em', whiteSpace: 'nowrap' }, kesc(sc.readout || '1/250   f/2.8   ISO 1600'));
    s.af = D(c, 'ctr', { left: CX, top: CY - lv(40, 120), width: 150, height: 110, border: '4px solid #ff453a', borderRadius: '6px' });
    s.afl = D(c, 'abs', { right: ix + 30, top: iy + 26, font: '800 26px var(--font-body)', color: '#ff453a', letterSpacing: '.12em' }, 'AF ✕');
    const spots = lv([[300, 200], [1180, 250], [260, 640], [1240, 600], [700, 120], [1300, 800]], [[110, 380], [520, 520], [90, 1080], [500, 1240], [140, 760], [560, 880]]);
    s.msgs = (sc.items || []).slice(0, 6).map((m, i) => D(c, 'abs', { left: spots[i][0], top: spots[i][1], padding: '16px 24px', borderRadius: '22px 22px 22px 6px', background: 'rgba(255,255,255,.94)', color: 'var(--ink)', font: `600 ${lv(26, 30)}px var(--font-body)`, whiteSpace: 'nowrap', boxShadow: '0 20px 40px -14px rgba(0,0,0,.6)' }, kesc(m)));
    const h = sc.headline || ['', ''];
    s.h = D(c, 'ctr head', { left: CX, top: lv(H - 250, H - 420), fontSize: fitFs(lv(104, 96), h, W * .86) + 'px', color: '#fff', textAlign: 'center', whiteSpace: 'pre', textShadow: '0 4px 40px rgba(0,0,0,.6)' }, `${kesc(h[0])}\n<span style="color:var(--hi)">${kesc(h[1] || '')}</span>`);
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 3))) });
    const hunt = 5 + 4 * Math.abs(Math.sin(t * 3.1)) + 3 * Math.abs(Math.sin(t * 7.3));   // focus keeps hunting
    s.ph.style.filter = `blur(${hunt.toFixed(1)}px) saturate(.75)`;
    S(s.ph, { s: L(1.08, 1.02, eo(P(t, 0, 3))) });
    s.br.forEach((b, i) => { const k = eo(P(t, .05 + i * .04, .45 + i * .04)); S(b, { s: L(1.3, 1, k), o: k * .9 }); });
    S(s.rec, { o: P(t, .2, .4) * (Math.floor(t * 2.2) % 2 ? .35 : 1) }); S(s.ro, { o: P(t, .3, .5) * .85 }); S(s.afl, { o: P(t, .5, .7) * (Math.floor(t * 3) % 2 ? .4 : 1) });
    S(s.af, { x: Math.sin(t * 2.3) * lv(90, 60) + Math.sin(t * 5.1) * 30, y: Math.cos(t * 1.9) * 50, s: 1 + .12 * Math.sin(t * 6), o: P(t, .3, .5) });
    s.msgs.forEach((m, i) => { const a = .4 + i * .22, q = P(t, a, a + .3); S(m, { s: L(.5, 1, bo(q)), o: C(q * 3), y: Math.sin(t * 2 + i) * 6, b: i % 3 === 2 ? 2.5 : 0 }); });
    blurIn(s.h, t, 1.5, 1.95, { y: 20, blur: 18 });
  } });

/* ===== tape: the cause as an object: separate tools held together with duct tape; one strip gives way =====
 * params: headline: [a, b], tools: [[glyph, label, color], ..up to 7], links: [[i, j], ..], peel: index of the link that fails */
shot('tape', { hero: 2.4, len: 3.2, bg: 'dark', tin: 'zoom', tout: 'fade',
  sfx: [[0.1, 'pops6'], [0.9, 'stamp'], [1.15, 'stamp'], [1.4, 'stamp'], [1.65, 'stamp'], [2.3, 'down'], [3.05, 'whoosh']],
  build(c, s, sc) {
    const tools = sc.tools || [], pos = lv([[560, 420], [880, 340], [1210, 410], [1440, 600], [1110, 690], [760, 720], [470, 650]], [[230, 760], [560, 700], [850, 820], [800, 1120], [500, 1240], [210, 1110], [520, 960]]);
    s.glow = D(c, 'ctr', { left: CX, top: lv(560, 960), width: lv(1300, 1000), height: lv(700, 900), borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(var(--acc2RGB),.45),transparent)', filter: 'blur(30px)' });
    s.tiles = tools.slice(0, 7).map((tl, i) => { const [x, y] = pos[i];
      const e = D(c, 'ctr', { left: x, top: y, width: lv(200, 190), padding: '26px 0 20px', borderRadius: '26px', background: 'rgba(255,255,255,.96)', textAlign: 'center', boxShadow: '0 30px 60px -20px rgba(0,0,0,.7)', zIndex: 2 },
        `<span class="kglyph" style="margin:0 auto 14px;width:72px;height:72px;border-radius:20px;font-size:34px;background:${tl[2] || 'var(--acc)'}">${kesc(tl[0])}</span><div style="font:700 24px var(--font);color:var(--ink);letter-spacing:-.01em">${kesc(tl[1])}</div>`);
      return { e, x, y, r: (hash(i + 4) - .5) * 14, d: .05 + i * .07 }; });
    s.tapes = (sc.links || []).map(([a, b], k) => { const A = pos[a], Bp = pos[b], mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2, ang = Math.atan2(Bp[1] - A[1], Bp[0] - A[0]) * 180 / Math.PI;
      const len = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]) * .55 + 60;
      const e = D(c, 'ctr', { left: mx, top: my, width: len, height: 54, zIndex: 3, background: 'linear-gradient(180deg,#d9cfbd,#c8b9a7 55%,#b9a993)', opacity: .95,
        clipPath: 'polygon(0 6%,3% 0,6% 10%,9% 2%,91% 0,94% 9%,97% 1%,100% 8%,100% 92%,97% 100%,94% 90%,91% 99%,9% 100%,6% 91%,3% 99%,0 93%)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' },
        '<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 3px,transparent 3px 9px)"></div>');
      return { e, ang, d: .9 + k * .25, peel: k === sc.peel }; });
    const h = sc.headline || ['', ''];
    s.h = D(c, 'ctr head', { left: CX, top: lv(150, 340), fontSize: fitFs(lv(100, 96), [h.join(' ')], W * .9) + 'px', color: '#fff', textAlign: 'center', whiteSpace: V ? 'pre' : 'nowrap' }, `${kesc(h[0])}${V ? '\n' : ' '}<span style="color:var(--hi)">${kesc(h[1] || '')}</span>`);
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 3.2) });
    blurIn(s.h, t, 0, .5, { y: -18 }); S(s.glow, { o: .6 + .2 * Math.sin(t * 2) });
    s.tiles.forEach((tl, i) => { const k = P(t, tl.d, tl.d + .4), fall = i === 6 ? eio(P(t, 2.25, 2.9)) : 0;
      S(tl.e, { s: L(.6, 1, bo(k)), o: C(k * 3), r: tl.r + fall * 24, y: Math.sin(t * 1.6 + i) * 5 + fall * 260 }); });
    s.tapes.forEach(tp => { const k = P(t, tp.d, tp.d + .18), pl = tp.peel ? eio(P(t, 2.15, 2.8)) : 0;
      S(tp.e, { r: tp.ang + pl * 38, s: L(1.25, 1, eo(k)), o: C(k * 4) * (1 - pl * .7), y: pl * 160, x: pl * 40 }); });
  } });

/* ===== aperture: the turn. A camera iris closes on the mess and opens on the brand mark (dark → light) =====
 * params: blades (default 8), word (wordmark under the mark) */
shot('aperture', { hero: 1.9, len: 2.6, bg: 'dark', marker: 'turn', tin: 'fade', flashOut: false,
  sfx: [[0.0, 'swell'], [0.75, 'click'], [0.8, 'boom'], [1.2, 'shimmer'], [2.4, 'hit']],
  build(c, s, sc) {
    s.inA = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: sc.photo ? `radial-gradient(ellipse at 50% 50%,rgba(0,0,0,.15),rgba(0,0,0,.75)),url('${sc.photo}') center 30%/cover` : 'radial-gradient(ellipse at 50% 50%,rgba(var(--acc2RGB),.5),var(--dark) 70%)', filter: sc.photo ? 'blur(6px) saturate(.7)' : 'none' });
    s.inB = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: 'linear-gradient(180deg,var(--bg),var(--bg2))' });
    s.mark = D(c, 'ctr', { left: CX, top: CY - lv(40, 60), width: lv(230, 230), color: 'var(--ink)' }, BR.markSvg || markHTML(220));
    s.word = D(c, 'ctr head', { left: CX, top: CY + lv(170, 190), fontSize: lv(96, 100) + 'px', color: 'var(--ink)', whiteSpace: 'nowrap' }, kesc(sc.word || B.product));
    s.n = sc.blades || 8;
    s.svg = D(c, 'abs', { left: 0, top: 0, width: W, height: H }, `<svg width="${W}" height="${H}"><defs><linearGradient id="apg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc2)"/><stop offset="1" style="stop-color:var(--acc3)"/></linearGradient></defs>${Array.from({ length: s.n }, () => '<polygon fill="url(#apg)" stroke="rgba(255,255,255,.18)" stroke-width="2"/>').join('')}</svg>`);
    s.bl = [...s.svg.querySelectorAll('polygon')];
  },
  update(t, s, c) {
    // radius of the opening: open → closed at .8 (click) → reopens wide by 2.3
    const R0 = Math.hypot(W, H) * .6, r = t < .8 ? L(R0, 0, eio(P(t, 0, .8))) : L(0, R0, eio(P(t, .95, 2.3)) ** 1.3);
    const rot = t < .8 ? L(0, 50, eio(P(t, 0, .8))) : L(50, 110, eio(P(t, .95, 2.3)));
    s.bl.forEach((p, i) => { const th = (i * 360 / s.n + rot) * Math.PI / 180, u = [Math.cos(th), Math.sin(th)], d = [-Math.sin(th), Math.cos(th)], F = 4000;
      const A = [CX + u[0] * r, CY + u[1] * r], Bq = [A[0] + d[0] * F, A[1] + d[1] * F], Cq = [Bq[0] + u[0] * F, Bq[1] + u[1] * F], Dq = [A[0] - d[0] * r * .9 + u[0] * F, A[1] - d[1] * r * .9 + u[1] * F];
      p.setAttribute('points', [A, Bq, Cq, Dq].map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ')); });
    const after = t >= .8; s.inA.style.display = after ? 'none' : 'block'; s.inB.style.display = after ? 'block' : 'none';
    const m = P(t, 1.0, 1.5); S(s.mark, { s: L(.6, 1, bo(m)) * (1 + .03 * Math.sin(t * 5) * P(t, 1.5, 2.6)), o: after ? C(m * 3) : 0 });
    blurIn(s.word, t, 1.45, 1.9, { y: 16, blur: 12 }); if (!after) S(s.word, { o: 0 });
  } });

/* ===== photoRing: the gallery as an object: the job's photos curve into a slowly turning 3D ring; a rebuilt
 * component rises in front and the viewfinder brackets lock onto it (green AF).
 * params: headline: [a, b], photos: [..urls], component (kit key), af: 'AF ✓' */
shot('photoRing', { hero: 2.4, len: 3.2, bg: 'light', tin: 'zoom', tout: 'whip',
  sfx: [[0.1, 'swoop'], [0.3, 'pops6'], [1.1, 'whoosh_s'], [1.7, 'click'], [1.75, 'pop'], [3.05, 'whoosh']],
  build(c, s, sc) {
    const h = sc.headline || ['', ''];
    s.h = D(c, 'ctr head', { left: CX, top: lv(130, 300), fontSize: fitFs(lv(100, 104), V ? h : [h.join(' ')], W * .9) + 'px', textAlign: 'center', whiteSpace: V ? 'pre' : 'nowrap' }, `${kesc(h[0])}${V ? '\n' : ' '}<span style="color:var(--acc)">${kesc(h[1] || '')}</span>`);
    s.stage3 = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '1800px', perspectiveOrigin: `50% ${lv(30, 40)}%` });
    s.ring = D(s.stage3, 'abs', { left: CX, top: lv(470, 860), width: 0, height: 0, transformStyle: 'preserve-3d' });
    const ph = sc.photos || [], n = Math.max(12, ph.length), R = lv(700, 520), cw = lv(200, 190), chh = lv(270, 250);
    s.cards = Array.from({ length: n }, (_, i) => D(s.ring, 'abs', { left: -cw / 2, top: -chh / 2, width: cw, height: chh, borderRadius: '16px', background: `url('${ph[i % ph.length]}') center 25%/cover`,
      transform: `rotateY(${i * 360 / n}deg) translateZ(${R}px)`, boxShadow: '0 30px 60px -20px rgba(0,0,0,.4)', backfaceVisibility: 'hidden' }));
    s.comp = sc.component ? renderComponent(c, sc.component, { x: CX - lv(300, 380), y: lv(690, 1300), w: lv(600, 760) }) : null;
    if (s.comp) s.comp.el.style.zIndex = 5;
    const bx = lv(CX - 340, CX - 420), by = lv(660, 1270), bw = lv(680, 840), bh = lv(330, 380), bl = 70;
    s.af = [[bx, by, 'tl'], [bx + bw, by, 'tr'], [bx, by + bh, 'bl'], [bx + bw, by + bh, 'br']].map(([x, y, k]) => { const e = D(c, 'abs', { left: x - (k[1] === 'r' ? bl : 0), top: y - (k[0] === 'b' ? bl : 0), width: bl, height: bl, zIndex: 6,
      borderTop: k[0] === 't' ? '6px solid #30c26a' : 'none', borderBottom: k[0] === 'b' ? '6px solid #30c26a' : 'none', borderLeft: k[1] === 'l' ? '6px solid #30c26a' : 'none', borderRight: k[1] === 'r' ? '6px solid #30c26a' : 'none' }); e._k = k; return e; });
    s.afl = D(c, 'abs', { left: bx + bw - 60, top: by - 54, zIndex: 6, font: '800 26px var(--font-body)', color: '#30c26a', letterSpacing: '.12em' }, kesc(sc.af || 'AF ✓'));
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.2) });
    blurIn(s.h, t, 0, .45, { y: -16 });
    const k = eo(P(t, 0, .9)); s.ring.style.transform = `translateY(${((1 - k) * 300).toFixed(1)}px) rotateX(-8deg) rotateY(${(t * 34 + (1 - k) * 90).toFixed(2)}deg) scale(${L(.7, 1, k).toFixed(3)})`;
    s.cards.forEach((e, i) => e.style.opacity = C(P(t, .1 + i * .04, .35 + i * .04) * 2).toFixed(3));
    if (s.comp) { const q = P(t, .9, 1.3); S(s.comp.el, { y: (1 - eo(q)) * 120, o: C(q * 3), s: L(.92, 1, eo(q)) }); revealParts(s.comp, t, 1.0); animateComponent(s.comp, t, 1.0); }
    const lk = eo(P(t, 1.5, 1.8)); s.af.forEach(e => { const dx = e._k[1] === 'l' ? -1 : 1, dy = e._k[0] === 't' ? -1 : 1; S(e, { x: dx * (1 - lk) * 90, y: dy * (1 - lk) * 70, o: C(P(t, 1.45, 1.6) * 3) }); });
    S(s.afl, { o: P(t, 1.75, 1.9), s: L(.6, 1, bo(P(t, 1.75, 2.0))) });
  } });

/* ================= SeySpace v2 moves (review fixes) ================= */
/* lines that slide up out of a mask, one after another (premium type reveal) */
function maskLines(parent, cls, style, lines, accent = [1], accCol = 'var(--acc)') {
  const e = D(parent, cls, Object.assign({ whiteSpace: 'nowrap' }, style));
  const spans = lines.map((l, i) => { const w = D(e, '', { overflow: 'hidden', paddingBottom: '.08em', marginBottom: '-.08em' }); const s = D(w, '', { display: 'block', color: accent.includes(i) ? accCol : '' }, kesc(l)); return s; });
  return { el: e, spans };
}
function maskP(m, t, t0, gap = .12, dur = .55) { m.spans.forEach((s, i) => { const k = eo(P(t, t0 + i * gap, t0 + i * gap + dur)); s.style.transform = `translateY(${((1 - k) * 105).toFixed(1)}%)`; }); }

/* ===== clockHook: the evening races past; notifications pile up ===== */
shot('clockHook', { hero: 1.7, len: 2.4, bg: 'dark',
  sfx: [],
  build(c, s, sc) {
    s.glow = D(c, 'abs', { left: -200, width: W + 400, bottom: -520, height: 820, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(var(--acc2RGB),.75),transparent)', filter: 'blur(20px)' });
    s.clock = D(c, 'abs head', { left: 150, top: 280, fontSize: '260px', color: '#fff', whiteSpace: 'nowrap' }, '<span class="num" style="font-variant-numeric:tabular-nums">6:00</span><span style="font-size:.3em;color:var(--hi);margin-left:.15em">pm</span>');
    s.time = s.clock.firstChild; s.pm = s.clock.lastChild;
    s.lab = D(c, 'abs', { left: 160, top: 600, font: '700 28px var(--font-body)', color: 'rgba(255,255,255,.7)', letterSpacing: '.22em' }, kesc(sc.label || 'THE SHOOT ENDED AT SIX'));
    const N = sc.notes || [];
    s.notes = N.map((n, i) => D(c, 'abs', { left: 1080, top: 150 + i * 118, width: 680, padding: '20px 24px', borderRadius: '20px', background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(14px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14)', color: '#fff', display: 'flex', gap: '16px', alignItems: 'center' },
      `<span style="width:44px;height:44px;border-radius:12px;background:${['#E8B4A0', '#9CC5B0', '#C9B8E8', '#E8D49C', '#A0C4E8', '#E8A0B8'][i % 6]};flex:none"></span><div style="min-width:0"><div style="font:700 20px var(--font-body);opacity:.65">${kesc(n[0])}</div><div style="font:600 26px var(--font-body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${kesc(n[1])}</div></div>`));
    s.badge = D(c, 'abs', { left: 1720, top: 112, minWidth: '64px', height: '64px', padding: '0 14px', borderRadius: '32px', background: '#ff3b30', color: '#fff', font: '800 32px var(--font)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px -6px rgba(255,59,48,.7)' }, '0');
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 2.4))) });
    const m = Math.round(L(18 * 60, 23 * 60 + 48, eo(P(t, 0, 1.0)))), h = Math.floor(m / 60) - 12, mm = m % 60;
    s.time.textContent = `${h}:${String(mm).padStart(2, '0')}`;
    S(s.clock, { o: C(t * 8) });
    const lk = eo(P(t, .95, 1.35)); S(s.lab, { o: lk, y: (1 - lk) * 14 });
    S(s.glow, { o: .55 + .25 * Math.sin(t * 3) });
    let n = 0; s.notes.forEach((e, i) => { const a = .15 + i * .16, k = P(t, a, a + .3); if (k > 0) n++; S(e, { x: (1 - eo(k)) * 120, o: C(k * 3), s: L(.96, 1, eo(k)) }); });
    s.badge.textContent = String(Math.min(23, Math.round(L(0, 23, eo(P(t, .15, 1.4))))));
    const bq = P(t, .15, .35); S(s.badge, { s: L(.4, 1, bo(bq)) * (1 + .08 * Math.max(0, Math.sin(t * 14)) * (1 - P(t, 1.2, 1.4))), o: C(bq * 3) });
  } });

/* ===== linked: the cause as an object. Seven tools as glass tiles, joined by thin lit lines; one link fails ===== */
shot('linked', { hero: 2.5, len: 3.2, bg: 'dark',
  sfx: [],
  build(c, s, sc) {
    const tools = sc.tools || [], pos = [[560, 470], [860, 380], [1180, 420], [1400, 600], [1150, 780], [820, 800], [520, 690]];
    s.glow = D(c, 'ctr', { left: CX, top: 600, width: 1500, height: 800, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(var(--acc2RGB),.38),transparent)', filter: 'blur(30px)' });
    const links = sc.links || [];
    s.svg = D(c, 'abs', { left: 0, top: 0, width: W, height: H }, `<svg width="${W}" height="${H}"><defs><linearGradient id="lkg" x1="0" x2="1"><stop offset="0" stop-color="#E4EBD8" stop-opacity=".15"/><stop offset=".5" stop-color="#E4EBD8" stop-opacity=".9"/><stop offset="1" stop-color="#E4EBD8" stop-opacity=".15"/></linearGradient></defs>${links.map(([a, b]) => `<path d="M${pos[a][0]} ${pos[a][1]} Q ${(pos[a][0] + pos[b][0]) / 2} ${(pos[a][1] + pos[b][1]) / 2 - 40} ${pos[b][0]} ${pos[b][1]}" fill="none" stroke="url(#lkg)" stroke-width="2.5" pathLength="1" stroke-dasharray="0 1"/>`).join('')}${links.map(() => '<circle r="6" fill="#fff" opacity="0"/>').join('')}</svg>`);
    s.paths = [...s.svg.querySelectorAll('path')]; s.dots = [...s.svg.querySelectorAll('circle')]; s.fail = sc.fail;
    s.tiles = tools.map((tl, i) => { const [x, y] = pos[i];
      const e = D(c, 'ctr', { left: x, top: y, width: 176, padding: '22px 0 18px', borderRadius: '24px', background: 'linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.05))', backdropFilter: 'blur(16px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18),0 30px 60px -24px rgba(0,0,0,.8)', textAlign: 'center', color: '#fff' },
        `<div style="font:500 40px var(--font-body);line-height:1;margin-bottom:12px;opacity:.95">${kesc(tl[0])}</div><div style="font:600 21px var(--font);letter-spacing:-.01em;opacity:.85">${kesc(tl[1])}</div>`);
      return { e, d: .05 + i * .06 }; });
    s.h = maskLines(c, 'abs head', { left: 150, top: 110, fontSize: '92px', color: '#fff' }, sc.headline || [], [1], 'var(--hi)');
    s.err = D(c, 'ctr', { left: 0, top: 0, padding: '8px 14px', borderRadius: '999px', background: '#ff453a', color: '#fff', font: '700 20px var(--font-body)', whiteSpace: 'nowrap' }, kesc(sc.error || 'Sync failed'));
  },
  measure(s) { const p = s.paths[s.fail]; if (!p) return; const pt = p.getPointAtLength(p.getTotalLength() / 2); s.ex = pt.x - 60; s.ey = pt.y - 95; },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.2) });
    maskP(s.h, t, .05);
    s.tiles.forEach((tl, i) => { const k = eo(P(t, tl.d, tl.d + .5)); const off = i === s.fail + 1 ? eio(P(t, 2.0, 2.8)) : 0; S(tl.e, { o: C(k * 2) * (1 - off * .6), s: L(.9, 1, k), y: Math.sin(t * 1.4 + i) * 4 + off * 30 }); });
    s.paths.forEach((p, i) => { const k = eio(P(t, .45 + i * .1, .85 + i * .1)); const broke = i === s.fail && t > 1.9;
      p.setAttribute('stroke-dasharray', broke ? '.42 .16 .42 1' : `${k.toFixed(3)} 1`); p.style.stroke = broke ? '#ff453a' : ''; p.style.opacity = broke ? (Math.floor(t * 12) % 2 ? .35 : 1) : 1; });
    s.dots.forEach((d, i) => { const p = s.paths[i], ph = ((t * .9 + i * .23) % 1); if (t < 1.0 || (i === s.fail && t > 1.9)) { d.setAttribute('opacity', 0); return; }
      const pt = p.getPointAtLength(p.getTotalLength() * ph); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); d.setAttribute('opacity', (.9 * Math.sin(ph * Math.PI)).toFixed(2)); });
    if (s.ex != null) { const q = P(t, 2.0, 2.25); S(s.err, { x: s.ex, y: s.ey, s: L(.6, 1, bo(q)), o: C(q * 3) }); }
  } });

/* ===== note3d: a real sticky note on a desk, in perspective, writing itself ===== */
shot('note3d', { hero: 2.4, len: 3.0, bg: '#2a2622',
  sfx: [],
  build(c, s, sc) {
    s.desk = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 40%,#5a4c3e 0%,#3a3129 55%,#211c17 100%)' });
    D(c, 'abs', { left: 0, top: 0, width: W, height: H, opacity: .22, background: 'repeating-linear-gradient(93deg,rgba(255,255,255,.05) 0 2px,transparent 2px 9px),repeating-linear-gradient(88deg,rgba(0,0,0,.25) 0 1px,transparent 1px 23px)' });
    s.scene3 = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '1600px', perspectiveOrigin: '50% 20%' });
    s.shadow = D(s.scene3, 'abs', { left: 640, top: 250, width: 720, height: 640, background: 'rgba(0,0,0,.55)', filter: 'blur(36px)', transform: 'rotateX(46deg) rotateZ(-7deg) translateY(70px) translateX(30px)' });
    s.note = D(s.scene3, 'abs', { left: 620, top: 160, width: 700, height: 700, transformOrigin: '50% 100%', borderRadius: '4px',
      background: 'linear-gradient(180deg,#fff3a0 0%,#fbe783 58%,#f2d65e 100%)', boxShadow: 'inset 0 -40px 60px -30px rgba(160,120,0,.35),inset 0 1px 0 rgba(255,255,255,.6)' });
    D(s.note, 'abs', { left: 0, top: 0, width: '100%', height: 90, background: 'linear-gradient(180deg,rgba(0,0,0,.08),transparent)' });   // adhesive strip
    D(s.note, 'abs', { left: 0, top: 0, width: '100%', height: '100%', opacity: .35, mixBlendMode: 'multiply', background: 'repeating-radial-gradient(circle at 30% 20%,rgba(120,90,0,.08) 0 1px,transparent 1px 3px)' });   // paper grain
    D(s.note, 'abs', { right: 0, bottom: 0, width: 120, height: 120, background: 'linear-gradient(135deg,#f6dd6a 0%,#e9c94a 48%,rgba(0,0,0,0) 50%)', boxShadow: '-6px -6px 14px rgba(0,0,0,.12)', borderTopLeftRadius: '6px' });   // curled corner
    s.items = (sc.items || []).map((it, i) => { const e = D(s.note, 'abs', { left: 70, top: 120 + i * 120, font: `600 ${it.size || 54}px var(--font)`, color: it.red ? '#c8202f' : '#1c2a55', letterSpacing: '-.01em', transform: `rotate(${i % 2 ? .8 : -.8}deg)`, whiteSpace: 'nowrap' });
      const T = typed(e, '', {}, [{ t: it.t }], false); let line = null, ring = null;
      if (it.strike) line = D(e, 'abs', { left: '-2%', top: '50%', width: '104%', height: '5px', borderRadius: '3px', background: '#1c2a55', transformOrigin: '0 50%' });
      if (it.circle) ring = D(e, 'abs', { left: '-6%', top: '-22%', width: '112%', height: '144%' }, `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible"><ellipse cx="50" cy="50" rx="50" ry="50" fill="none" stroke="#c8202f" stroke-width="3.5" vector-effect="non-scaling-stroke" pathLength="1" stroke-dasharray="0 1"/></svg>`).querySelector('ellipse');
      return { T, line, ring, d: .3 + i * .38 }; });
    const cap = sc.caption || ['', ''];
    s.cap = maskLines(c, 'abs head', { left: 150, top: 760, fontSize: '84px', color: '#fff' }, cap, [1], 'var(--hi)');
  },
  update(t, s, c) {
    const k = eo(P(t, 0, .8));
    s.note.style.transform = `rotateX(${L(58, 40, k).toFixed(2)}deg) rotateZ(${L(-10, -7, k).toFixed(2)}deg) translateY(${L(80, 0, k).toFixed(1)}px)`;
    s.note.style.opacity = C(t * 5).toFixed(3); s.shadow.style.opacity = C(t * 5).toFixed(3);
    S(c, { s: L(1.0, 1.07, eio(P(t, 0, 3))) });
    s.items.forEach(it => { typeP(it.T, P(t, it.d, it.d + .35), t, false); if (it.line) it.line.style.transform = `scaleX(${eio(P(t, it.d + .38, it.d + .58)).toFixed(3)})`; if (it.ring) it.ring.setAttribute('stroke-dasharray', `${eio(P(t, it.d + .38, it.d + .7)).toFixed(3)} 1`); });
    maskP(s.cap, t, 1.8);
  } });

/* ===== focusLogo: a lens racks focus; soft bokeh gathers into the SeySpace mark, which snaps sharp ===== */
shot('focusLogo', { hero: 2.0, len: 2.6, bg: 'light', marker: 'turn',
  sfx: [],
  build(c, s, sc) {
    s.cv = document.createElement('canvas'); s.cv.width = W; s.cv.height = H; s.cv.className = 'abs'; s.cv.style.left = 0; s.cv.style.top = 0; c.appendChild(s.cv);
    s.mark = D(c, 'ctr', { left: CX, top: CY - 60, width: 230, color: 'var(--ink)' }, BR.markSvg || markHTML(220));
    s.af = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy]) => D(c, 'abs', { left: CX + dx * 190 - (dx > 0 ? 54 : 0), top: CY - 60 + dy * 170 - (dy > 0 ? 54 : 0), width: 54, height: 54,
      borderTop: dy < 0 ? '4px solid var(--acc)' : 'none', borderBottom: dy > 0 ? '4px solid var(--acc)' : 'none', borderLeft: dx < 0 ? '4px solid var(--acc)' : 'none', borderRight: dx > 0 ? '4px solid var(--acc)' : 'none' }));
    s.af.forEach((e, i) => { e._d = [[-1, -1], [1, -1], [-1, 1], [1, 1]][i]; });
    s.word = maskLines(c, 'ctr head', { left: CX, top: CY + 190, fontSize: '108px', textAlign: 'center' }, [sc.word || B.product], []);
    s.tag = D(c, 'ctr', { left: CX, top: CY + 290, font: '600 26px var(--font-body)', color: 'var(--mut)', letterSpacing: '.18em', whiteSpace: 'nowrap' }, kesc(sc.tag || ''));
  },
  update(t, s, c) {
    S(c, { s: L(1.06, 1, eo(P(t, 0, 2.6))) });
    const x = s.cv.getContext('2d'); x.clearRect(0, 0, W, H);
    const g = eio(P(t, 0, 1.0));
    for (let i = 0; i < 46; i++) { const sx = hash(i) * W, sy = hash(i + 9) * H, r0 = 40 + hash(i + 3) * 110;
      const X = L(sx, CX + (hash(i + 5) - .5) * 160, g), Y = L(sy, CY - 60 + (hash(i + 7) - .5) * 140, g), r = L(r0, 10, g);
      x.globalAlpha = (.18 + hash(i + 2) * .22) * (1 - P(t, .9, 1.2)); x.fillStyle = ['#1B3B32', '#485949', '#C8B9A7', '#E4EBD8'][i % 4];
      x.beginPath(); x.arc(X, Y, r, 0, 7); x.fill(); }
    x.globalAlpha = 1;
    const f = P(t, .7, 1.25); S(s.mark, { o: C(f * 2.5), b: (1 - eo(f)) * 26, s: L(1.18, 1, eo(f)) });
    const a = eo(P(t, 1.15, 1.45)); s.af.forEach(e => S(e, { x: e._d[0] * (1 - a) * 80, y: e._d[1] * (1 - a) * 70, o: C(P(t, 1.1, 1.2) * 4) * (1 - P(t, 2.0, 2.3)) }));
    maskP(s.word, t, 1.35); blurIn(s.tag, t, 1.7, 2.0, { y: 10, blur: 6 });
  } });

/* ===== splitHero: headline left, product card right, both on one centre line (clean grid) ===== */
shot('splitHero', { hero: 2.4, len: 3.0, bg: 'light',
  sfx: [],
  build(c, s, sc) {
    s.h = maskLines(c, 'abs head', { left: 150, top: 0, fontSize: (sc.size || 124) + 'px' }, sc.headline || []);
    const z = sc.zoom || 1.45, w = 860;
    s.comp = renderComponent(c, sc.component, { x: 980 / z, y: 0, w: w / z }); s.comp.el.style.zoom = z;
  },
  measure(s) { const hh = s.h.el.offsetHeight, ch = s.comp.el.offsetHeight * (parseFloat(s.comp.el.style.zoom) || 1); s.h.el.style.top = (CY - hh / 2) + 'px'; s.comp.el.style.top = ((CY - ch / 2) / (parseFloat(s.comp.el.style.zoom) || 1)) + 'px'; },
  update(t, s, c) {
    S(c, { s: L(1, 1.03, t / 3) });
    maskP(s.h, t, .05, .14);
    const k = eo(P(t, .25, .8)); s.comp.el.style.clipPath = `inset(${((1 - k) * 100).toFixed(1)}% 0 0 0 round var(--radius))`; S(s.comp.el, { y: (1 - k) * 40 / (parseFloat(s.comp.el.style.zoom) || 1), o: 1 });
    revealParts(s.comp, t, .5, .1); animateComponent(s.comp, t, .5);
  } });

/* ===== keep: the proof as a receipt. 0% on the left, the sale on the right, aligned on one box ===== */
shot('keep', { hero: 2.6, len: 3.2, bg: 'dark',
  sfx: [],
  build(c, s, sc) {
    const top = 300, hgt = 480;
    s.glow = D(c, 'abs', { left: -200, width: W + 400, bottom: -560, height: 860, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(var(--acc2RGB),.6),transparent)', filter: 'blur(20px)' });
    s.big = maskLines(c, 'abs head', { left: 170, top: top - 40, fontSize: '300px', color: '#fff', lineHeight: 1 }, [sc.value || '0%'], []);
    s.cap = maskLines(c, 'abs', { left: 180, top: top + 300, font: '600 40px/1.25 var(--font-body)', color: 'rgba(255,255,255,.8)' }, sc.caption || [], [1]);
    s.cap.spans.forEach((e, i) => { if (i) e.style.color = 'var(--hi)'; });
    const rows = sc.rows || [];
    s.card = D(c, 'abs', { left: 1010, top, width: 740, height: hgt, borderRadius: '28px', background: 'rgba(255,255,255,.96)', color: 'var(--ink)', padding: '44px 48px', boxShadow: '0 50px 100px -40px rgba(0,0,0,.8)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' });
    D(s.card, '', { font: '700 20px var(--font-body)', letterSpacing: '.16em', color: 'var(--mut)' }, kesc(sc.label || 'ORDER · THE ELEGANCE COLLECTION'));
    s.rows = rows.map((r, i) => { const last = i === rows.length - 1;
      const e = D(s.card, '', { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: last ? '26px' : '0', borderTop: last ? '2px solid var(--line)' : 'none', font: `${last ? 800 : 600} ${last ? 44 : 32}px var(--font)`, letterSpacing: '-.02em' },
        `<span>${kesc(r[0])}</span><span class="num" style="color:${last ? 'var(--acc)' : r[2] || 'inherit'}">${kesc(r[1])}</span>`);
      return { e, n: e.querySelector('.num'), st: parseStat(r[1]), d: .7 + i * .22 }; });
  },
  update(t, s, c) {
    S(c, { s: L(1.03, 1, eo(P(t, 0, 3.2))) });
    S(s.glow, { o: .55 + .2 * Math.sin(t * 2.4) });
    maskP(s.big, t, .1, 0, .7); maskP(s.cap, t, .5);
    const k = eo(P(t, .35, .9)); s.card.style.clipPath = `inset(${((1 - k) * 100).toFixed(1)}% 0 0 0 round 28px)`;
    s.rows.forEach(r => { const q = P(t, r.d, r.d + .35); S(r.e, { o: C(q * 3), y: (1 - eo(q)) * 16 }); r.n.textContent = fmtStat(r.st, eo(P(t, r.d, r.d + .7))); });
  } });
