/* BRAND SHOTS — built around the client's REAL material: their logo, their screenshots (cut into
 * layers), their copy and their button styles. They read B.launch, B.hero, B.features, B.words,
 * B.split, B.build, B.stat, B.cta (see brief.js) and adapt to the STYLE (device, card, backgrounds).
 * Every shot has a 9:16 layout (V). Override per use in timeline.js, e.g. ['uiFeature', 2.6, 1.3, { feature: 1, flip: true }].
 */
'use strict';

/* overlay that sits exactly on a device screen (layout coords), for layers lifted off the screenshot */
function screenOverlay(dev) {
  const holder = dev.screen.parentElement; if (getComputedStyle(holder).position === 'static') holder.style.position = 'relative';
  const ov = D(holder, 'abs', { pointerEvents: 'none' });
  return { ov, fit() { Object.assign(ov.style, { left: dev.screen.offsetLeft + 'px', top: dev.screen.offsetTop + 'px', width: dev.screen.offsetWidth + 'px', height: dev.screen.offsetHeight + 'px' }); } };
}
/* layers: [{ src, at: [x, y, w] }] in fractions of the screenshot (x, y = top-left, w = width) */
function mkLayers(ov, layers) {
  return (layers || []).map((l, i) => {
    const e = D(ov, 'abs', { left: (l.at[0] * 100) + '%', top: (l.at[1] * 100) + '%', width: (l.at[2] * 100) + '%', transformOrigin: '50% 50%' }, `<img src="${l.src}" style="width:100%;display:block;border-radius:${l.radius != null ? l.radius : 12}px">`);
    const ring = D(e, 'abs', { right: -10, top: -10, width: 22, height: 22, borderRadius: '50%', background: 'var(--hi)', boxShadow: '0 0 0 8px rgba(var(--accRGB),.25)' });
    return { e, ring, l };
  });
}
function liftLayers(Ls, t, t0, gap = .35) {
  Ls.forEach((L_, i) => {
    const a = t0 + i * gap, p = eo(P(t, a, a + .45)), pop = bo(P(t, a, a + .45));
    L_.e.style.transform = `translate(${(-p * 4).toFixed(1)}px,${(-p * 10).toFixed(1)}px) scale(${L(1, L_.l.scale || 1.22, pop).toFixed(3)})`;   // grows in place so it covers its own spot
    L_.e.style.filter = p > .01 ? `drop-shadow(0 ${(30 * p).toFixed(0)}px ${(40 * p).toFixed(0)}px rgba(0,0,0,${(.45 * p).toFixed(2)}))` : 'none';
    L_.e.style.zIndex = 5;
    L_.ring.style.transform = `scale(${bo(P(t, a + .25, a + .5)).toFixed(3)})`;
  });
}

/* ===== turnInk: hard cut to the brand's dark; logo lands, a light line sweeps, the launch pill pops ===== */
shot('turnInk', { hero: 1.6, len: 2.4, bg: 'dark', marker: 'turn', flashOut: false,
  sfx: [[0.0, 'stamp'], [0.3, 'shimmer'], [0.9, 'riser'], [2.35, 'hit']],
  build(c, s) {
    s.glow = D(c, 'abs', { left: -300, top: -300, width: W + 600, height: H + 600, background: 'radial-gradient(closest-side,rgba(255,255,255,.09),transparent)' });
    s.logo = D(c, 'ctr', { left: CX, top: CY - lv(30, 60) }, logoHTML(BR.logoHeight ? BR.logoHeight * 1.6 : lv(190, 150), true));
    s.line = D(c, 'abs', { left: 0, top: CY + lv(150, 170), width: W, height: 2, background: 'linear-gradient(90deg,transparent,var(--hi),transparent)' });
    s.pill = B.launch && B.launch.pill ? D(c, 'ctr', { left: CX, top: CY + lv(110, 110) }, `<span class="btn" style="background:var(--hi);color:var(--ink);border-radius:999px;padding:16px 30px;font-size:${lv(30, 34)}px">${B.launch.pill}</span>`) : null;
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 2.4))) });
    blurIn(s.logo, t, .1, .65, { blur: 30, s0: 1.12 });
    const lp = eio(P(t, .45, 1.3)); s.line.style.transform = `translateX(${L(-W, W, lp).toFixed(0)}px)`; s.line.style.opacity = lp > 0 && lp < 1 ? 1 : 0;
    if (s.pill) { const q = P(t, 1.0, 1.35); S(s.pill, { s: L(.6, 1, bo(q)), o: q * 3, y: (1 - eo(q)) * 20 }); }
    S(s.glow, { o: .6 + .4 * Math.sin(t * 2) });
  } });

/* ===== turnGlow: midnight gradient; the brand mark glows in with a light streak, logo below, white flash out ===== */
shot('turnGlow', { hero: 1.5, len: 2.4, bg: 'dark', marker: 'turn', flashOut: true,
  sfx: [[0.0, 'boom'], [0.4, 'shimmer'], [0.6, 'riser'], [2.35, 'hit']],
  build(c, s) {
    s.halo = D(c, 'ctr', { left: CX, top: CY - 40, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--acc2RGB),.55) 0%,rgba(var(--accRGB),0) 62%)' });
    s.mark = D(c, 'ctr', { left: CX, top: CY - 60 }, markHTML(lv(190, 200)));
    s.streak = D(c, 'ctr', { left: CX, top: CY - 60, width: 1400, height: 4, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent)', transform: 'translate(-50%,-50%) rotate(-18deg)' });
    s.logo = D(c, 'ctr', { left: CX, top: CY + lv(140, 170) }, logoHTML(lv(64, 70), true));
  },
  update(t, s, c) {
    S(c, { s: L(1.06, 1, eo(P(t, 0, 2.4))) });
    const ip = P(t, .2, .75); S(s.mark, { s: L(.5, 1, bo(ip)), o: C(ip * 3), b: (1 - eo(ip)) * 14 });
    S(s.halo, { o: eo(P(t, .1, 1.0)) * (.85 + .15 * Math.sin(t * 5)), s: L(.6, 1.1, eo(P(t, .1, 2))) });
    const sp = eio(P(t, .5, 1.1)); S(s.streak, { x: L(-900, 900, sp), r: -18, o: sp > 0 && sp < 1 ? 1 : 0 });
    blurIn(s.logo, t, .9, 1.35, { y: 20 });
    flash(Math.pow(P(t, 2.05, 2.4), 2));
  } });

/* ===== logoReveal: the real logo wipes in (mask + blur), eyebrow pill below ===== */
shot('logoReveal', { hero: 1.9, len: 2.4, bg: 'light', tout: 'up',
  sfx: [[0.1, 'swoop'], [0.9, 'pops2'], [2.2, 'whoosh']],
  build(c, s) {
    D(c, 'blob', { width: 1100, height: 520, left: CX - 550, top: CY - lv(620, 700), opacity: .9 });
    s.logo = D(c, 'ctr', { left: CX, top: CY - 30 }, BR.logo ? logoHTML(lv(150, 120)) : `<div class="row" style="gap:28px">${markHTML(150)}<span class="head" style="font-size:150px">${B.product}</span></div>`);
    s.sub = B.hero && B.hero.eyebrow ? D(c, 'ctr', { left: CX, top: CY + lv(120, 140) }, `<span class="btn" style="background:var(--tint);color:var(--acc);border-radius:999px;padding:14px 26px;font-size:26px">${B.hero.eyebrow}</span>`) : null;
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 2.4) });
    const w = eio(P(t, .1, .8));
    s.logo.style.clipPath = `inset(-20% ${((1 - w) * 100).toFixed(1)}% -20% 0)`;
    S(s.logo, { b: (1 - eo(P(t, .1, .9))) * 12, s: L(1.08, 1, eo(P(t, 0, 1))) });
    if (s.sub) { const q = P(t, .9, 1.25); S(s.sub, { y: (1 - eo(q)) * 30, o: q * 2 }); }
  } });

/* ===== uiHero: their H1 types on, their real product screen rises in its device, layers lift off it ===== */
shot('uiHero', { hero: 3.2, len: 4.0, bg: 'light',
  sfx: [[0.1, 'type14'], [0.5, 'whoosh'], [1.6, 'pops3'], [3.8, 'whoosh']],
  build(c, s, sc) {
    const h = B.hero || {}, kind = sc.device || STYLE.device;
    const longest = Math.max(String(h.l1 || B.product).length, String(h.l2 || '').length);
    const fs = Math.min(lv(h.l2 ? 104 : 112, 104), (W * .9) / (longest * .5));   // shrink long real headlines to fit
    s.h1 = typed(c, 'ctr head', { left: CX, top: lv(150, 330), fontSize: fs + 'px', textAlign: 'center' }, [{ t: h.l1 || B.product }], false);
    s.h2 = h.l2 ? typed(c, 'ctr head', { left: CX, top: lv(150, 330) + fs * 1.02, fontSize: fs + 'px', textAlign: 'center' }, [{ t: h.l2, cls: h.accentLine2 === false ? '' : 'acc' }]) : null;
    const wide = kind === 'none' && V;                                   // a wide screenshot in 9:16 runs edge to edge, tilted
    const dw = lv(kind === 'none' ? 1720 : kind === 'browser' ? 1300 : 1120, wide ? 1900 : 980), dx = CX - dw / 2, dy = lv(h.l2 ? 400 : 330, wide ? 860 : 820);
    s.tilt = wide ? -5 : 0;
    s.wrap = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '2400px' });
    s.dev = device(s.wrap, kind, { x: dx, y: dy, w: dw, h: kind === 'none' ? null : dw * .6, src: h.screen, pos: h.screenPos });
    s.dev.el.style.transformOrigin = '50% 0';
    s.ov = screenOverlay(s.dev); s.layers = mkLayers(s.ov.ov, h.layers);
  },
  measure(s) { s.ov.fit(); },
  update(t, s, c, sc) {
    S(c, { s: L(1, 1.04, t / 4) });
    typeP(s.h1, P(t, .1, .55), t, false); if (s.h2) typeP(s.h2, P(t, .55, 1.0), t, t < 1.6);
    const r = eo(P(t, .35, 1.4)), ry = tt => L(600, 0, eo(P(tt, .35, 1.4)));
    s.dev.el.style.transform = `translateY(${ry(t).toFixed(1)}px) rotateX(${L(32, lv(7, 5), r).toFixed(2)}deg) rotateZ(${s.tilt}deg)`;
    s.dev.el.style.opacity = C(P(t, .35, .55) * 2).toFixed(3);
    s.dev.el.style.filter = vel(ry, t) > 4 ? `blur(${Math.min(12, vel(ry, t) * .1).toFixed(1)}px)` : 'none';
    liftLayers(s.layers, t, 1.55);
  } });

/* ===== uiFeature: section label + 2–3 line headline beside their real feature image; optional hand click ===== */
shot('uiFeature', { hero: 2.8, len: 3.6, bg: 'light', tin: 'whip', tout: 'whip',
  sfx: [[0.1, 'type12'], [0.4, 'whoosh_s'], [2.0, 'click'], [3.4, 'whoosh']],
  build(c, s, sc) {
    const f = (B.features || [])[sc.feature || 0] || {}, flip = !!sc.flip && !V;
    s.f = f;
    const tx = flip ? 1060 : 130;
    if (f.label) s.lab = D(c, 'abs label', { left: lv(tx, 90), top: lv(300, 260) }, f.label);
    const longest = Math.max(String(f.l1 || '').length, String(f.l2 || '').length, 1);
    const hfs = Math.min(lv(108, 104), lv(820, 900) / (longest * .52));                  // fit beside the image
    s.hd = typed(c, 'abs head', { left: lv(tx, 90), top: lv(350, 310), fontSize: hfs + 'px' }, [{ t: f.l1 || '' }, { t: f.l2 ? '\n' + f.l2 : '', cls: f.accentLine2 === false ? '' : 'acc' }]);
    const iw = lv(760, 900), ix = V ? CX - iw / 2 : (flip ? 150 : 1030), iy = lv(160, 760);
    s.card = D(c, 'abs card', { left: ix, top: iy, width: iw, height: lv(760, 900), overflow: 'hidden', padding: 0, background: f.bg || 'var(--tint)' },
      f.image ? `<img src="${f.image}" style="width:100%;height:100%;object-fit:${f.fit || 'cover'};display:block">` : skeletonHTML(lv(760, 900)));
    s.ix = ix; s.iy = iy; s.iw = iw; s.flip = flip;
    if (f.click) { s.hand = mkHand(c); s.tx = ix + iw * f.click[0]; s.ty = iy + lv(760, 900) * f.click[1]; s.rip = D(c, 'ctr', { left: s.tx, top: s.ty, width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(var(--accRGB),.7)' }); }
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.6) });
    if (s.lab) blurIn(s.lab, t, .05, .4, { y: 14, blur: 10 });
    typeP(s.hd, P(t, .15, 1.0), t);
    const cx = tt => L(V ? 0 : (s.flip ? -700 : 700), 0, eo(P(tt, .3, 1.0))), cy = tt => V ? L(500, 0, eo(P(tt, .3, 1.0))) : 0;
    S(s.card, { x: cx(t), y: cy(t), r: L(V ? 0 : (s.flip ? -4 : 4), 0, eo(P(t, .3, 1.1))), o: C(P(t, .3, .45) * 3), bx: Math.min(50, vel(cx, t) * .3), by: Math.min(50, vel(cy, t) * .3) });
    if (s.hand) { moveHand(s.hand, t, s.tx, s.ty, 1.4, 2.0); const ri = P(t, 2.0, 2.55); S(s.rip, { s: L(.2, 1.8, eo(ri)), o: ri > 0 ? 1 - ri : 0 }); }
  } });

/* ===== monitorWords (Ref C): monitor with their screen; ✦ keywords pop in around it ===== */
shot('monitorWords', { hero: 2.4, len: 3.0, bg: 'dark', tin: 'zoom', tout: 'zoom',
  sfx: [[0.1, 'whoosh_s'], [0.55, 'pop'], [0.8, 'pop'], [1.05, 'pop'], [2.85, 'whoosh']],
  build(c, s, sc) {
    const wd = B.words || {}, mw = lv(820, 860);
    s.dev = device(c, sc.device || 'monitor', { x: CX - mw / 2, y: lv(190, CY - 330), w: mw, h: mw * .58, src: wd.screen || (B.hero || {}).screen });
    const pos = lv([[300, 330], [1430, 220], [1420, 640], [260, 700]], [[90, 470], [560, 360], [520, 1430], [110, 1540]]);
    s.words = (wd.items || ['Plan', 'Track', 'Ship']).slice(0, 4).map((w, i) => D(c, 'abs spark', { left: pos[i][0], top: pos[i][1], fontSize: lv(56, 70) + 'px' }, `<i></i>${w}`));
    s.bars = D(c, 'abs', { left: 0, right: 0, bottom: 0, height: 110, background: 'repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 3px,transparent 3px 9px)' });
  },
  update(t, s, c) {
    S(c, { s: L(1.02, 1.06, eo(P(t, 0, 3))) });
    const r = eo(P(t, 0, .7)); S(s.dev.el, { y: (1 - r) * 220, s: L(.9, 1, r), o: C(r * 3) });
    s.words.forEach((e, i) => { const a = .5 + i * .25, k = P(t, a, a + .4); S(e, { x: (1 - eo(k)) * (i % 2 ? 60 : -60), o: k * 2, b: (1 - eo(k)) * 14, y: Math.sin(t * 1.4 + i) * 6 }); });
  } });

/* ===== splitWords (Ref C): "Word [device] word." — words slide out from behind the screen ===== */
shot('splitWords', { hero: 2.0, len: 2.6, bg: 'dark', tout: 'zoom',
  sfx: [[0.05, 'whoosh_s'], [0.35, 'swoop'], [0.5, 'pop'], [2.45, 'whoosh']],
  build(c, s, sc) {
    const sp = B.split || {}, mw = lv(640, 700);
    s.left = D(c, 'ctr head', { left: lv(330, CX), top: lv(CY - 20, CY - 470), fontSize: lv(124, 120) + 'px' }, sp.left || 'Work');
    s.right = D(c, 'ctr head', { left: lv(1600, CX), top: lv(CY - 20, CY + 470), fontSize: lv(124, 120) + 'px', color: 'var(--hi)' }, sp.right || 'smarter.');
    s.dev = device(c, sc.device || 'monitor', { x: CX - mw / 2, y: CY - mw * .36, w: mw, h: mw * .58, src: sp.screen || (B.hero || {}).screen });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 2.6) });
    const r = bo(P(t, 0, .5)); S(s.dev.el, { s: L(.7, 1, r), o: C(P(t, 0, .2) * 5) });
    const a = eo(P(t, .3, .8)), b = eo(P(t, .45, .95));
    if (V) { S(s.left, { y: (1 - a) * 380, o: a * 1.6, b: (1 - a) * 10 }); S(s.right, { y: -(1 - b) * 380, o: b * 1.6, b: (1 - b) * 10 }); }
    else { S(s.left, { x: (1 - a) * 560, o: a * 1.6, b: (1 - a) * 10 }); S(s.right, { x: -(1 - b) * 560, o: b * 1.6, b: (1 - b) * 10 }); }
  } });

/* card geometry shared by frameCard → uiBuild so the hand-off is seamless */
const BUILD_CARD = () => ({ w: lv(840, 920), h: lv(620, 860), x: CX, y: lv(540, CY + 40) });

/* ===== frameCard (Ref C): the dark scene shrinks into a glass frame, squashes to a line, opens into a glass card ===== */
shot('frameCard', { hero: 1.0, len: 2.6, bg: 'light',
  sfx: [[0.05, 'whoosh_s'], [0.9, 'swoop'], [1.45, 'pop'], [1.9, 'type10']],
  build(c, s, sc) {
    const g = BUILD_CARD();
    s.frame = D(c, 'ctr glass', { left: CX, top: CY, width: W, height: H, borderRadius: '0px' });
    s.inner = D(c, 'ctr', { left: CX, top: CY, width: W, height: H, background: STYLE.bg.dark, overflow: 'hidden' });
    const mw = lv(760, 820);
    s.dev = device(s.inner, sc.device || 'monitor', { x: 0, y: 0, w: mw, h: mw * .58, src: (B.words || {}).screen || (B.hero || {}).screen });
    s.devW = mw;
    s.card = D(c, 'ctr glass', { left: g.x, top: g.y, width: g.w, height: g.h });
    s.title = D(s.card, 'abs row', { left: 34, top: 30, gap: '14px', fontSize: lv(40, 46) + 'px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden' }, `<span class="spark" style="color:var(--acc)"><i></i></span><span class="tt">${(B.build || {}).title || 'New project'}</span>`);
    s.tt = s.title.querySelector('.tt'); s.g = g;
  },
  update(t, s, c) {
    const g = s.g, a = eio(P(t, 0, .9)), sq = eio(P(t, .9, 1.35)), op = eio(P(t, 1.35, 1.9));
    // A: full-bleed dark scene → inset card inside a glass frame
    const fw = L(W, g.w + 120, a), fh = L(H, g.h + 120, a), iw = L(W, g.w + 40, a), ih = L(H, g.h + 40, a);
    Object.assign(s.frame.style, { width: fw + 'px', height: fh + 'px', borderRadius: L(0, 44, a) + 'px', opacity: (1 - op).toFixed(3), left: g.x + 'px', top: L(CY, g.y, a) + 'px' });
    // B: inner squashes to a line
    const ih2 = L(ih, 6, sq), iw2 = L(iw, g.w * .9, sq);
    Object.assign(s.inner.style, { width: iw2 + 'px', height: ih2 + 'px', borderRadius: L(0, 26, a) + 'px', left: g.x + 'px', top: L(CY, g.y, a) + 'px', opacity: (1 - P(t, 1.3, 1.45)).toFixed(3) });
    s.dev.el.style.left = (iw2 / 2 - s.devW / 2) + 'px'; s.dev.el.style.top = (ih2 / 2 - s.devW * .36) + 'px';
    s.dev.el.style.transform = `scale(${L(1, .9, a).toFixed(3)})`;
    // C: the line opens into the glass card, title slides up
    Object.assign(s.card.style, { height: L(6, g.h, op) + 'px', width: L(g.w * .9, g.w, op) + 'px', opacity: C(P(t, 1.3, 1.45) * 5).toFixed(3) });
    const tp = eo(P(t, 1.85, 2.3)); s.tt.style.transform = `translateY(${((1 - tp) * 60).toFixed(1)}px)`; s.tt.style.opacity = tp.toFixed(3);
    s.title.firstElementChild.style.transform = `scale(${bo(P(t, 1.8, 2.1)).toFixed(3)})`;
  } });

/* ===== uiBuild (Ref C): the glass card fills with their real UI; a hand drags a second piece in, it snaps ✓ ===== */
shot('uiBuild', { hero: 3.0, len: 3.6, bg: 'light', tout: 'up',
  sfx: [[0.3, 'pops3'], [1.0, 'whoosh_s'], [2.05, 'click'], [2.15, 'pop'], [3.4, 'whoosh']],
  build(c, s) {
    const b = B.build || {}, g = BUILD_CARD(); s.g = g;
    s.card = D(c, 'ctr glass', { left: g.x, top: g.y, width: g.w, height: g.h });
    D(s.card, 'abs row', { left: 34, top: 30, gap: '14px', fontSize: lv(40, 46) + 'px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font)' }, `<span class="spark" style="color:var(--acc)"><i></i></span>${b.title || 'New project'}`);
    s.lab = b.label ? D(s.card, 'abs label', { left: 36, top: 100, fontSize: '17px' }, b.label) : null;
    s.base = D(s.card, 'abs', { left: 34, top: 140, width: g.w - 68, height: g.h - 174, borderRadius: '18px', overflow: 'hidden', background: 'rgba(255,255,255,.7)', boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,.06)' },
      b.base ? `<img src="${b.base}" style="width:100%;height:100%;object-fit:${b.baseFit || 'contain'};display:block">` : skeletonHTML(g.h - 174));
    const dw = lv(520, 600);
    s.drag = D(c, 'ctr', { left: g.x + lv(170, 60), top: g.y + lv(150, 260), width: dw }, b.drag ? `<img src="${b.drag}" style="width:100%;display:block;border-radius:16px">` : `<div class="card" style="height:${dw * .4}px"></div>`);
    s.drag.style.borderRadius = '16px';
    s.hand = mkHand(c);
    s.ok = D(c, 'ctr', { left: g.x + g.w / 2 - 20, top: g.y - g.h / 2 + 20, width: 56, height: 56, borderRadius: '50%', background: '#19B36B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 800, boxShadow: '0 0 0 6px #fff' }, '✓');
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 3.6) });
    const bp = eo(P(t, .2, .7)); S(s.base, { y: (1 - bp) * 40, o: bp * 1.4, s: L(.96, 1, bp) });
    if (s.lab) blurIn(s.lab, t, .1, .4, { y: 10, blur: 8 });
    const fly = eio(P(t, .9, 1.9)), snap = bo(P(t, 1.95, 2.35));
    const dx = L(lv(700, 300), 0, fly), dy = L(lv(520, 700), 0, fly);
    S(s.drag, { x: dx, y: dy, r: L(-14, -5, fly) * (1 - snap) , s: L(1.08, 1, snap), o: C(P(t, .85, 1.0) * 5) });
    s.drag.style.boxShadow = `0 0 0 ${t > 1.95 ? 3 : 0}px var(--acc2), 0 ${L(60, 20, snap).toFixed(0)}px 80px -20px rgba(20,20,80,.5)`;
    const hx = s.g.x + lv(170, 60) + dx + lv(150, 170), hy = s.g.y + lv(150, 260) + dy + lv(30, 40);
    S(s.hand, { x: hx - 35, y: hy - 8, o: P(t, .85, 1.0) * (1 - P(t, 2.4, 2.7)), s: t > 1.9 && t < 2.15 ? .9 : 1 });
    S(s.ok, { s: bo(P(t, 2.15, 2.45)), o: P(t, 2.15, 2.2) });
  } });

/* ===== statBig: their real number counts up huge, accent underline draws, caption focus-pulls ===== */
shot('statBig', { hero: 2.4, len: 3.0, bg: 'dark', tin: 'zoom', tout: 'fade',
  sfx: [[0.1, 'ticks12'], [1.2, 'swoop'], [1.5, 'pop'], [2.85, 'whoosh']],
  build(c, s) {
    const st = B.stat || { value: '100+', caption: '' }, val = V && st.valueShort ? st.valueShort : st.value;
    s.st = parseStat(val);
    const fs = Math.min(lv(230, 200), (W * .86) / (val.length * .58));
    s.num = D(c, 'ctr head num', { left: CX, top: CY - lv(70, 120), fontSize: fs + 'px' }, val);
    s.bar = D(c, 'abs', { left: CX - lv(400, 300), top: CY - lv(70, 120) + fs * .62, width: lv(800, 600), height: 12, borderRadius: '6px', background: 'var(--hi)', transformOrigin: '0 50%' });
    s.cap = D(c, 'ctr', { left: CX, top: CY + lv(170, 200), width: lv(1300, 900), textAlign: 'center', fontSize: lv(40, 46) + 'px', fontWeight: 500, lineHeight: 1.35, opacity: .85 }, `${st.caption || ''}${st.bold ? ` <b style="opacity:1">${st.bold}</b>` : ''}`);
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 3) });
    s.num.textContent = fmtStat(s.st, eo(P(t, .1, 1.3)));
    S(s.num, { o: C(t * 6), b: (1 - eo(P(t, 0, .3))) * 16 });
    s.bar.style.transform = `scaleX(${eio(P(t, 1.1, 1.6)).toFixed(3)})`;
    blurIn(s.cap, t, 1.3, 1.8, { y: 20 });
  } });

/* ===== ctaBrand: real logo, tagline, their buttons, URL; style-specific glow ===== */
shot('ctaBrand', { hero: 2.6, len: 4.0, bg: 'light', marker: 'cta', tin: 'zoom',
  sfx: [[0.0, 'hit'], [0.6, 'whoosh_s'], [1.3, 'pops2']],
  build(c, s) {
    const ct = B.cta || {};
    const st = Object.keys(window.STYLES).find(k => window.STYLES[k] === STYLE);
    if (st === 'airy') { s.eq = D(c, 'abs', { left: 0, top: H - lv(540, 760), width: W, height: lv(600, 760), filter: 'blur(22px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 100% at 50% 100%,#000 30%,transparent 75%)' });
      s.nb = Math.ceil(W / 48); s.bars = []; for (let i = 0; i < s.nb; i++) s.bars.push(D(s.eq, 'abs', { left: 20 + i * 48, bottom: 0, width: 28, height: 300, background: 'linear-gradient(0deg,var(--acc),rgba(var(--acc2RGB),.4))', transformOrigin: '50% 100%' })); }
    if (st === 'midnight') s.glow = D(c, 'abs', { left: CX - 900, top: H - lv(360, 520), width: 1800, height: 900, borderRadius: '50%', background: 'radial-gradient(closest-side,var(--gradA),rgba(var(--accRGB),0))', opacity: .55 });
    s.logo = D(c, 'ctr', { left: CX, top: CY - lv(240, 340) }, BR.logo ? logoHTML(BR.logoHeight || lv(130, 120)) : `<div class="row" style="gap:24px">${markHTML(110)}<span class="head" style="font-size:120px">${B.product}</span></div>`);
    const tg = ct.tagline || [B.product, ''];
    s.tag = D(c, 'ctr head', { left: CX, top: CY - lv(60, 80), fontSize: lv(64, 72) + 'px', textAlign: 'center' }, `${V ? String(tg[0]).trim() + '\n' : tg[0]}<span class="acc">${tg[1] || ''}</span>`);
    s.btns = D(c, 'ctr row', { left: CX, top: CY + lv(110, 170), gap: '22px', flexDirection: V ? 'column' : 'row' }, (ct.primary ? btnHTML(ct.primary, 1, lv(1.15, 1.45)) : '') + (ct.secondary ? btnHTML(ct.secondary, 2, lv(1.15, 1.45)) : ''));
    s.bl = [...s.btns.children];
    s.url = D(c, 'ctr', { left: CX, top: CY + lv(230, 400), fontSize: lv(26, 32) + 'px', fontWeight: 500, color: 'var(--mut)' }, B.url || '');
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 3))) });
    if (s.bars) { const lvl = eo(P(t, 0, .8)); s.bars.forEach((b, i) => { const d = Math.abs(i - (s.nb - 1) / 2) / (s.nb / 2), h = (1 - d * .8) * (.55 + .45 * Math.abs(Math.sin(t * 4.2 + i * .7) * Math.cos(t * 2.1 + i * .3))); b.style.transform = `scaleY(${(h * lvl).toFixed(3)})`; }); }
    if (s.glow) S(s.glow, { o: .45 + .15 * Math.sin(t * 3), s: L(.8, 1, eo(P(t, 0, 1.5))) });
    blurIn(s.logo, t, .05, .5, { blur: 20, s0: 1.1 });
    blurIn(s.tag, t, .5, .95, { y: 24 });
    s.bl.forEach((e, i) => { const a = 1.0 + i * .15, k = P(t, a, a + .35); S(e, { y: (1 - eo(k)) * 40, o: k * 2, s: L(.9, 1, bo(k)) }); });
    blurIn(s.url, t, 1.5, 1.9, { y: 12, blur: 10 });
  } });
