/* REF STYLE (generic): reference-led film (taste adjustments from the user's reference: one-colour glowing world, slow
 * continuous camera, thin small type built letter by letter, frosted glass cards with real product photos,
 * tilted screen in a glass frame, orbit rings, glowing ring reveal, product on a white table, light network).
 * Brand comes from window.REF = { color: '#hex', mark: html (uses currentColor), markBig: html } set in ref_brand.js. */
'use strict';
const REF = window.REF || {}; if (!REF.font || REF.font === 'var(--font)') REF.font = `"${((window.BRIEF || {}).brand || {}).display || 'Inter'}"`; const ARGB = () => hexRgb(REF.color || 'var(--A)').join(',');
document.documentElement.style.setProperty('--A', REF.color || '#1B3B32'); document.documentElement.style.setProperty('--rf', REF.font); document.documentElement.style.setProperty('--Argb', ARGB());
const BMARK = (col = '#111611') => `<div style="color:${col};width:100%">${REF.mark || ''}</div>`;
const GW = 'radial-gradient(ellipse 90% 80% at 50% 35%,#FFFFFF 0%,#FCFCFA 55%,#F2F4F1 100%)';   /* clean white world (was the green one) */
const MARK = (fill = '#fff') => `<svg viewBox="0 0 295 294" width="100%" style="display:block;overflow:visible"><rect x="0" y="0" width="171" height="130" rx="16" fill="${fill}"/><rect x="124" y="162" width="171" height="132" rx="16" fill="${fill}"/></svg>`;
const THIN = (px, w = 400) => `${w} ${px}px ${(window.REF && window.REF.font) || "'Plus Jakarta Sans'"},Inter,sans-serif`;
(function () { const st = document.createElement('style'); st.textContent = `
  @font-face{font-family:'Plus Jakarta Sans';src:url(fonts/PlusJakartaSans-300.ttf);font-weight:300}
  @font-face{font-family:'Plus Jakarta Sans';src:url(fonts/PlusJakartaSans-400.ttf);font-weight:400}
  @font-face{font-family:'Plus Jakarta Sans';src:url(fonts/PlusJakartaSans-500.ttf);font-weight:500}
  .glass{background:linear-gradient(160deg,rgba(255,255,255,.92),rgba(250,251,249,.78));border:1px solid #E3E8E3;border-radius:26px;
    box-shadow:inset 0 1px 0 #fff,0 40px 90px -36px rgba(var(--Argb),.28),0 8px 24px -12px rgba(var(--Argb),.12);backdrop-filter:blur(18px);color:#111611}
  .gl-line{height:10px;border-radius:5px;background:linear-gradient(90deg,rgba(var(--Argb),.22),rgba(var(--Argb),.06))}
  .gpill{display:inline-flex;align-items:center;justify-content:center;height:84px;padding:0 64px;border-radius:22px;border:1.5px solid rgba(var(--Argb),.35);
    background:#fff;box-shadow:0 20px 50px -20px rgba(var(--Argb),.35),0 0 0 6px rgba(var(--Argb),.04);color:var(--A);font:400 40px var(--rf);letter-spacing:.02em;white-space:nowrap}`; document.head.appendChild(st); })();

/* letters that build one by one out of a soft blur (the reference's type) */
function letters(parent, text, style) {
  const e = D(parent, 'ctr', Object.assign({ whiteSpace: 'pre', color: '#111611', font: THIN(64) }, style));
  const ch = [...text].map(c => { const s = document.createElement('span'); s.textContent = c; s.style.display = 'inline-block'; s.style.whiteSpace = 'pre'; e.appendChild(s); return s; });
  return { el: e, ch };
}
function lettersP(o, t, t0, per = .045, dur = .45, out = null) {
  o.ch.forEach((s, i) => { const k = eo(P(t, t0 + i * per, t0 + i * per + dur)); let a = k, b = (1 - k) * 10;
    if (out) { const q = P(t, out, out + .45); a *= 1 - q; b += q * 10; }
    s.style.opacity = a.toFixed(3); s.style.filter = b > .2 ? `blur(${b.toFixed(1)}px)` : 'none'; s.style.transform = `translateX(${((1 - k) * 18).toFixed(1)}px)`; });
}
const glowDot = (c) => D(c, 'abs', { left: 0, top: 0, width: 44, height: 44, marginLeft: '-22px', marginTop: '-22px', borderRadius: '50%', background: 'radial-gradient(circle,var(--A) 0%,rgba(var(--Argb),.55) 30%,rgba(var(--Argb),0) 70%)', zIndex: 20 });

/* 1 ===== logoBloom: the SeySpace mark grows out of the dark in 3D, glowing; then it shrinks to a spark that opens the green world */
shot('logoBloom', { len: 4.2, hero: 2.0, bg: '#FFFFFF', marker: 'turn',
  build(c, s) {
    s.world = D(c, 'abs', { left: 0, top: 0, width: W, height: H, background: GW });
    s.halo = D(c, 'ctr', { left: CX, top: CY, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(var(--Argb),.10),transparent)' });
    s.wrap = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '1400px' });
    s.mark = D(s.wrap, 'ctr', { left: CX, top: CY, width: REF.bigW || 360, color: 'var(--A)', filter: 'drop-shadow(0 30px 40px rgba(var(--Argb),.3))' }, REF.markBig || REF.mark || '');
    s.word = letters(c, REF.noWord ? '' : B.product, { left: CX, top: CY + 260, font: THIN(84, 500), letterSpacing: '-.02em' });
    s.spark = glowDot(c); s.spark.style.width = s.spark.style.height = '90px'; s.spark.style.marginLeft = s.spark.style.marginTop = '-45px';
  },
  update(t, s, c) {
    const k = eo(P(t, 0, 1.4));
    s.mark.style.transform = `translate(-50%,-50%) rotateY(${L(70, 0, k).toFixed(2)}deg) rotateZ(${L(-30, 0, k).toFixed(2)}deg) scale(${(L(.15, 1, k) * L(1, 1.06, P(t, 1.4, 2.6)) * (1 - eio(P(t, 2.6, 3.3)) * .96)).toFixed(4)})`;
    s.mark.style.opacity = C(P(t, 0, .3) * 3) * (1 - P(t, 3.2, 3.35));
    s.mark.style.filter = `blur(${((1 - k) * 22).toFixed(1)}px) drop-shadow(0 30px 40px rgba(var(--Argb),.3))`;
    S(s.halo, { o: eo(P(t, .2, 1.4)) * (1 - P(t, 2.6, 3.2)) * (.8 + .2 * Math.sin(t * 3)), s: L(.5, 1.1, eo(P(t, 0, 2))) });
    lettersP(s.word, t, .9, .06, .5, 2.4);
    // the spark travels right and the world opens from it
    const sp = eio(P(t, 3.0, 3.8)), sx = L(CX, CX + 420, sp), sy = L(CY, CY - 60, sp);
    S(s.spark, { x: sx, y: sy, o: P(t, 3.0, 3.15) * (1 - P(t, 3.9, 4.2)), s: 1 + .3 * Math.sin(t * 20) });
    const R = 2400 * eio(P(t, 3.3, 4.2)); s.world.style.clipPath = `circle(${R.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px)`;
  } });

/* 2 ===== lineToPill: the positioning line builds letter by letter, then condenses into a glowing glass pill */
shot('lineToPill', { len: 5.0, hero: 1.9, bg: GW,
  build(c, s, sc) {
    s.line = letters(c, sc.line || '', { left: CX, top: CY, font: THIN(58, 400), letterSpacing: '.01em' });
    s.pill = D(c, 'ctr', { left: CX, top: CY }, `<span class="gpill"></span>`); s.pt = s.pill.firstChild;
    s.ptxt = letters(s.pt, sc.pill || '', { position: 'static', transform: 'none', font: THIN(40, 400), letterSpacing: '.03em' }); s.ptxt.el.className = '';
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.03, t / 5) });
    lettersP(s.line, t, .1, .035, .5, 2.4);
    s.line.el.style.letterSpacing = `${L(.01, -.04, eio(P(t, 2.0, 2.8))).toFixed(3)}em`;
    const pk = eio(P(t, 2.55, 3.2)), up = eio(P(t, 3.9, 4.8));
    S(s.pill, { o: C(pk * 2), s: L(.4, 1, pk) * L(1, .7, up), y: L(0, -380, up) });
    s.pt.style.width = L(80, 520, pk) + 'px'; s.pt.style.padding = '0';
    lettersP(s.ptxt, t, 3.0, .05, .4);
  } });

/* 3 ===== glassCards: under the pill, two frosted cards: a booking and the job's photo popping out of its card; a light taps "Confirm" */
shot('glassCards', { len: 5.4, hero: 3.6, bg: GW,
  build(c, s, sc) {
    s.pill = D(c, 'ctr', { left: CX, top: CY - 300 }, `<span class="gpill">${kesc(sc.pill || '')}</span>`);
    s.wrap = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '1800px', transformOrigin: '50% 60%', transform: 'scale(1.15)' });
    s.a = D(s.wrap, 'abs glass', { left: 470, top: 380, width: 470, height: 380, padding: '34px 34px' }, sc.cardA || '');
    s.b = D(s.wrap, 'abs glass', { left: 1010, top: 380, width: 440, height: 380, padding: '30px' }, sc.cardB || '');
    s.photo = D(s.wrap, 'abs', Object.assign({ left: 1150, top: 190, width: 330, height: 420, borderRadius: '18px', boxShadow: '0 40px 80px -24px rgba(0,0,0,.45)', overflow: 'hidden' }, sc.photoBox || {}), sc.photo || ''); if (!sc.photo) s.photo.style.display = 'none';
    s.dot = glowDot(c); s.lb = s.a.querySelector('.lb'); s.bk = s.a.querySelector('.bk');
  },
  update(t, s, c, sc) {
    S(c, { s: L(1, 1.04, t / 5.4) });
    const ka = eo(P(t, .1, .9)), kb = eo(P(t, .3, 1.1)), kp = eo(P(t, .6, 1.4)), tilt = eio(P(t, 4.2, 5.2));
    s.a.style.transform = `translateY(${((1 - ka) * 80).toFixed(1)}px) rotateY(${L(0, 16, tilt).toFixed(2)}deg) scale(${L(1, 1.08, tilt).toFixed(3)})`; s.a.style.opacity = C(ka * 2);
    s.b.style.transform = `translateY(${((1 - kb) * 80).toFixed(1)}px) rotateY(${L(0, -16, tilt).toFixed(2)}deg) scale(${L(1, 1.08, tilt).toFixed(3)})`; s.b.style.opacity = C(kb * 2);
    s.photo.style.transform = `translate(${((1 - kp) * 60).toFixed(1)}px,${((1 - kp) * 40).toFixed(1)}px) rotate(${L(8, 4, kp).toFixed(2)}deg) rotateY(${L(0, -16, tilt).toFixed(2)}deg)`; s.photo.style.opacity = C(kp * 2);
    if (!s.bk) return;
    const bp = centerOf(s.bk), dk = eio(P(t, 1.8, 2.6));
    S(s.dot, { x: L(CX + 300, bp.x - 60, dk), y: L(CY + 360, bp.y, dk), o: P(t, 1.7, 1.9) * (1 - P(t, 3.4, 3.7)), s: t > 2.7 && t < 2.95 ? 1.5 : 1 });
    const done = t > 2.8; if (s.lb) { if (!s.lb0) s.lb0 = s.lb.textContent; s.lb.textContent = done ? (sc.done || '✓') : s.lb0; } s.bk.style.background = done ? 'var(--A)' : '#F3F6F3'; s.bk.style.color = done ? '#fff' : '#111611';
    s.wrap.style.filter = tilt > .5 ? `blur(${((tilt - .5) * 10).toFixed(1)}px)` : 'none';
  } });

/* 4 ===== tiltScreen: the rebuilt product screen in a glass frame, tilted in 3D, with two thin words beside it */
shot('tiltScreen', { len: 5.4, hero: 3.4, bg: GW,
  build(c, s, sc) {
    s.wrap = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '2200px' });
    s.frame = D(s.wrap, 'abs glass', { left: 130, top: 190, width: 1060, height: 700, padding: '16px', borderRadius: '30px' });
    const Z1 = 1.45; s.comp = renderComponent(s.frame, sc.component, { x: 16 / Z1, y: 16 / Z1, w: 1028 / Z1 }); s.comp.el.style.zoom = Z1; s.comp.el.style.position = 'absolute'; s.comp.el.style.height = (668 / Z1) + 'px'; s.comp.el.style.overflow = 'hidden'; s.comp.el.style.borderRadius = '18px'; s.comp.el.style.boxShadow = 'none';
    s.w1 = letters(c, (sc.words || [])[0] || '', { left: 1420, top: CY - 50, font: THIN(64, 400), transform: 'translate(0,-50%)' });
    s.w2 = letters(c, (sc.words || [])[1] || '', { left: 1420, top: CY + 40, font: THIN(64, 400), transform: 'translate(0,-50%)' });
    s.w1.el.className = s.w2.el.className = 'abs';
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 5.4) });
    const k = eo(P(t, 0, 1.2));
    s.frame.style.transform = `translateX(${((1 - k) * -500).toFixed(1)}px) rotateY(${L(40, 22, k).toFixed(2)}deg) rotateX(${L(8, 4, k).toFixed(2)}deg)`; s.frame.style.opacity = C(k * 2);
    revealParts(s.comp, t, .6, .07); animateComponent(s.comp, t, .6);
    lettersP(s.w1, t, 1.0, .06); lettersP(s.w2, t, 1.35, .06);
  } });

/* 5 ===== orbit: the mark in a glowing ring, its products orbiting on thin rings */
shot('orbit', { len: 6.0, hero: 3.6, bg: GW,
  build(c, s, sc) {
    s.rings = [300, 440, 600].map(r => D(c, 'ctr', { left: CX, top: CY, width: r * 2, height: r * 2, borderRadius: '50%', border: '1.5px solid rgba(var(--Argb),.14)' }));
    s.core = D(c, 'ctr', { left: CX, top: CY, width: 260, height: 260, borderRadius: '50%', background: '#fff', border: '2px solid rgba(var(--Argb),.25)', boxShadow: '0 30px 70px -24px rgba(var(--Argb),.35),0 0 0 14px rgba(var(--Argb),.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      `<div style="width:110px">${BMARK()}</div>`);
    s.word = letters(c, sc.text || '', { left: CX, top: CY + 410, font: THIN(52, 400), color: '#111611' });
    s.items = (sc.items || []).map((n, i) => ({ e: D(c, 'ctr', { left: 0, top: 0, height: 70, padding: '0 26px', borderRadius: '35px', background: '#fff', border: '1px solid #E1E7E1', color: '#111611', font: THIN(24, 500), display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', boxShadow: '0 16px 34px -16px rgba(var(--Argb),.35)' }, kesc(n)),
      r: [440, 600, 440, 600, 440, 600][i % 6], a: i * Math.PI / 3 + .3, sp: .14, d: .9 + i * .14 }));
  },
  update(t, s, c) {
    S(c, { s: L(1.05, 1, eo(P(t, 0, 6))) });
    const k = eo(P(t, 0, .8)); S(s.core, { s: L(.5, 1, k) * (1 + .02 * Math.sin(t * 3)), o: C(k * 2) });
    s.rings.forEach((r, i) => S(r, { s: L(.6, 1, eo(P(t, .2 + i * .12, 1.0 + i * .12))), o: eo(P(t, .2 + i * .12, .8 + i * .12)) }));
    lettersP(s.word, t, .5, .045);
    s.items.forEach(it => { const a = it.a + t * it.sp, q = eo(P(t, it.d, it.d + .5)); S(it.e, { x: CX + Math.cos(a) * it.r, y: CY + Math.sin(a) * it.r * .55, o: C(q * 2), s: L(.6, 1, q) }); });
  } });

/* 6 ===== ringWord: a big glowing ring fills the frame; the next idea builds inside it */
shot('ringWord', { len: 3.4, hero: 2.4, bg: GW,
  build(c, s, sc) {
    s.ring = D(c, 'ctr', { left: CX, top: CY, width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%,#FFFFFF,#F1F5F2 72%)', border: '3px solid rgba(var(--Argb),.55)', boxShadow: '0 50px 100px -40px rgba(var(--Argb),.35),inset 0 0 60px rgba(var(--Argb),.05)' });
    s.halo = D(c, 'ctr', { left: CX, top: CY, width: 1100, height: 1100, borderRadius: '50%', border: '1.5px solid rgba(var(--Argb),.14)' });
    s.word = letters(c, sc.text || '', { left: CX, top: CY, font: THIN(64, 400) });
  },
  update(t, s, c) {
    const k = eo(P(t, 0, 1.0)); S(s.ring, { s: L(.35, 1, k) * (1 + .015 * Math.sin(t * 4)), o: C(k * 2) }); S(s.halo, { s: L(.5, 1.05, eo(P(t, .2, 1.4))), o: .9 * eo(P(t, .2, 1)) });
    s.ring.style.borderColor = `rgba(${ARGB()},${(.45 + .15 * Math.sin(t * 3)).toFixed(2)})`;
    lettersP(s.word, t, .8, .055);
  } });

/* 7 ===== printStage: the product as an object: the client's framed print on a white table, glass order cards floating over it */
shot('printStage', { len: 5.4, hero: 3.6, bg: GW,
  build(c, s, sc) {
    s.ring = D(c, 'ctr', { left: CX, top: 380, width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%,#FFFFFF,#EEF3EF 72%)', border: '3px solid rgba(var(--Argb),.45)', boxShadow: '0 50px 100px -40px rgba(var(--Argb),.3)' });
    s.table = D(c, 'abs', { left: -100, top: 760, width: W + 200, height: 420, background: 'linear-gradient(180deg,#EEF1EC 0%,#E2E7E1 55%,#D2D9D2 100%)', boxShadow: '0 -1px 0 #fff' });
    s.wrap = D(c, 'abs', { left: 0, top: 0, width: W, height: H, perspective: '1600px' });
    s.frame = D(s.wrap, 'abs', Object.assign({ left: CX - 230, top: 250, width: 460, height: 560, background: '#fbfaf7', padding: '34px', boxShadow: '0 0 0 14px #1d1d1b,0 60px 80px -20px rgba(0,0,0,.55)', transformOrigin: '50% 100%' }, sc.objBox || {}), sc.object || '');
    s.shadow = D(c, 'ctr', { left: CX + 40, top: 815, width: 560, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,.35)', filter: 'blur(18px)' });
    const cards = sc.cards || [];
    s.cards = cards.map((cd, i) => D(s.wrap, 'abs glass', { left: [240, 1300, 1290][i], top: [300, 270, 560][i], width: 380, padding: '24px 26px' },
      `<div style="display:flex;justify-content:space-between;font:${THIN(20, 500)};opacity:.85"><span>${kesc(cd[0])}</span><span style="width:20px;height:20px">${BMARK()}</span></div><div style="margin-top:14px;font:${THIN(26, 500)}">${kesc(cd[1])}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px"><span style="font:${THIN(20, 300)};opacity:.85">${kesc(cd[2])}</span><span style="height:40px;padding:0 16px;border-radius:12px;background:var(--A);color:#fff;display:flex;align-items:center;font:${THIN(20, 500)}">${kesc(cd[3])}</span></div>`));
    s.word = letters(c, sc.text || '', { left: CX, top: 950, font: THIN(52, 400), color: '#111611' });
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 5.4))) });
    const k = eo(P(t, 0, 1.0)); S(s.ring, { o: .9, s: L(1.3, 1, k) });
    S(s.table, { y: (1 - k) * 300 }); S(s.shadow, { o: k, y: (1 - k) * 300 });
    s.frame.style.transform = `translateY(${((1 - eo(P(t, .3, 1.3))) * 400).toFixed(1)}px) rotateY(${L(-22, -8, eo(P(t, .3, 5))).toFixed(2)}deg)`; s.frame.style.opacity = C(P(t, .3, .6) * 3);
    s.cards.forEach((e, i) => { const q = eo(P(t, 1.4 + i * .3, 2.1 + i * .3)); e.style.opacity = C(q * 2); e.style.transform = `translateY(${((1 - q) * 60 + Math.sin(t * 1.6 + i) * 6).toFixed(1)}px) rotateY(${(i ? -14 : 14)}deg)`; });
    lettersP(s.word, t, .2, .05, .45, 4.6);
  } });

/* 8 ===== network: a glowing network of clients forms the SeySpace mark; two thin words beside it */
shot('network', { len: 5.0, hero: 3.2, bg: GW,
  build(c, s, sc) {
    s.cv = document.createElement('canvas'); s.cv.width = W; s.cv.height = H; s.cv.className = 'abs'; s.cv.style.left = 0; s.cv.style.top = 0; c.appendChild(s.cv);
    s.pts = []; s.links = [];
    const src = REF.netSrc || (REF.mark && REF.mark.trim().startsWith('<svg') ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(REF.mark.replace(/currentColor/g, '#000').replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"')) : ((REF.mark || '').match(/src="([^"]+)"/) || [])[1]);
    s.img = document.createElement('img'); s.img.src = src || ''; s.img.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0'; c.appendChild(s.img);
    s.w1 = letters(c, (sc.words || [])[0] || '', { left: 1230, top: CY - 50, font: THIN(64, 400), transform: 'translate(0,-50%)' });
    s.w2 = letters(c, (sc.words || [])[1] || '', { left: 1230, top: CY + 40, font: THIN(64, 400), transform: 'translate(0,-50%)' });
    s.w1.el.className = s.w2.el.className = 'abs';
  },
  measure(s) { // sample the brand mark into ~90 points inside a 560px box left of centre
    const o = document.createElement('canvas'), N = 560; o.width = o.height = N; const x = o.getContext('2d');
    const ch = REF.netText || String(B.product || '?')[0]; x.fillStyle = '#000'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `800 520px ${REF.font}`; x.fillText(ch, N / 2, N / 2 + 20);
    let d; try { d = x.getImageData(0, 0, N, N).data; } catch (e) { d = null; }
    const cand = []; if (d) for (let y = 0; y < N; y += 11) for (let X = 0; X < N; X += 11) if (d[(y * N + X) * 4 + 3] > 120) cand.push([X, y]);
    const pick = cand.filter((_, i) => hash(i + 1) < Math.min(1, 150 / Math.max(cand.length, 1)));
    s.pts = (pick.length > 12 ? pick : Array.from({ length: 80 }, (_, i) => [N / 2 + Math.cos(i) * 220 * hash(i), N / 2 + Math.sin(i) * 220 * hash(i + 3)])).map(([px, py]) => [260 + px, 260 + py]);
    s.links = []; s.pts.forEach((p, i) => s.pts.forEach((q, j) => { if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 46) s.links.push([i, j]); }));
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 5) });
    const x = s.cv.getContext('2d'); x.clearRect(0, 0, W, H);
    const pos = s.pts.map(([px, py], i) => { const k = eio(P(t, hash(i) * .6, .9 + hash(i) * .6)); return [L(px + (hash(i + 4) - .5) * 900, px, k), L(py + (hash(i + 8) - .5) * 700, py, k), k]; });
    x.lineWidth = 1.2; s.links.forEach(([i, j], n) => { const a = Math.min(pos[i][2], pos[j][2]) * eo(P(t, 1.0, 2.0)); if (a <= 0) return; x.strokeStyle = `rgba(${ARGB()},${(a * .28).toFixed(3)})`; x.beginPath(); x.moveTo(pos[i][0], pos[i][1]); x.lineTo(pos[j][0], pos[j][1]); x.stroke(); });
    pos.forEach(([px, py, k], i) => { const g = x.createRadialGradient(px, py, 0, px, py, 14); g.addColorStop(0, `rgba(${ARGB()},${(k * .35).toFixed(3)})`); g.addColorStop(1, `rgba(${ARGB()},0)`); x.fillStyle = g; x.beginPath(); x.arc(px, py, 14, 0, 7); x.fill();
      const tw = .5 + .5 * Math.sin(t * 4 + i); x.fillStyle = `rgba(${ARGB()},${(k * (.7 + .3 * tw)).toFixed(3)})`; x.beginPath(); x.arc(px, py, 3.2, 0, 7); x.fill(); });
    lettersP(s.w1, t, 1.2, .06); lettersP(s.w2, t, 1.55, .06);
  } });

/* 9 ===== finalScreen: the product screen straight on, in its glass frame, title building above */
shot('finalScreen', { len: 5.2, hero: 3.4, bg: GW,
  build(c, s, sc) {
    s.title = letters(c, sc.title || '', { left: CX, top: 120, font: THIN(56, 400) });
    s.frame = D(c, 'abs glass', { left: CX - 620, top: 210, width: 1240, height: 790, padding: '16px', borderRadius: '30px', boxShadow: '0 60px 120px -50px rgba(var(--Argb),.4),0 0 0 1px #E3E8E3' });
    const Z2 = 1.5; s.comp = renderComponent(s.frame, sc.component, { x: 16 / Z2, y: 16 / Z2, w: 1208 / Z2 }); s.comp.el.style.zoom = Z2; s.comp.el.style.position = 'absolute'; s.comp.el.style.height = (758 / Z2) + 'px'; s.comp.el.style.overflow = 'hidden'; s.comp.el.style.borderRadius = '18px'; s.comp.el.style.boxShadow = 'none';
  },
  update(t, s, c) {
    S(c, { s: L(1.06, 1, eo(P(t, 0, 5.2))) });
    const k = eo(P(t, 0, 1.0)); S(s.frame, { y: (1 - k) * 260, o: C(k * 2), s: L(.92, 1, k) });
    revealParts(s.comp, t, .5, .06); animateComponent(s.comp, t, .5);
    lettersP(s.title, t, .6, .06);
  } });

/* 10 ===== endMark: mark, wordmark, line, URL */
shot('endMark', { len: 3.6, hero: 2.6, bg: GW, marker: 'cta',
  build(c, s, sc) {
    s.halo = D(c, 'ctr', { left: CX, top: CY - 70, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(var(--Argb),.07),transparent)' });
    s.mark = D(c, 'ctr', { left: CX, top: CY - 110, width: 170, filter: 'drop-shadow(0 20px 30px rgba(var(--Argb),.25))' }, BMARK());
    if (REF.endLogo) { s.mark.innerHTML = REF.endLogo; s.mark.style.width = (REF.endW || 420) + 'px'; s.mark.style.top = (CY - 40) + 'px'; }
    s.word = letters(c, REF.endLogo ? '' : B.product, { left: CX, top: CY + 60, font: THIN(96, 500), letterSpacing: '-.03em' });
    s.line = letters(c, sc.line || '', { left: CX, top: CY + 160, font: THIN(36, 300), color: '#5F655E' });
    s.url = letters(c, B.url || '', { left: CX, top: CY + 300, font: THIN(26, 400), color: '#7A7F78', letterSpacing: '.12em' });
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 3.6))) });
    const k = eo(P(t, 0, .9)); s.mark.style.opacity = C(k * 2); s.mark.style.transform = `translate(-50%,-50%) scale(${L(.6, 1, k).toFixed(3)}) rotate(${L(-20, 0, k).toFixed(2)}deg)`; s.mark.style.filter = `blur(${((1 - k) * 16).toFixed(1)}px) drop-shadow(0 20px 30px rgba(var(--Argb),.25))`;
    S(s.halo, { o: k * (.8 + .2 * Math.sin(t * 3)) });
    lettersP(s.word, t, .5, .06); lettersP(s.line, t, 1.1, .03); lettersP(s.url, t, 1.7, .03);
  } });
