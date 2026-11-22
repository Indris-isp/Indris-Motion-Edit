/* SHOT LIBRARY. Each shot: shot(id, { len, tin, tout, bg, under, sfx, build(c, s, sc), update(t, s, c, sc), measure? })
 *   hero — authored time of the shot's best still (used for the storyboard board)
 *   len  — authored length in seconds (t in update() runs 0..len, scaled by the timeline speed)
 *   sfx  — [[t, kind], ...] in authored time; see audio.py for kinds
 *   c    — the shot's camera layer (scale it for a slow push); s — per-shot state
 * Stage is 1920x1080. All copy comes from BRIEF (B), all colours from CSS vars.
 */
'use strict';

/* ===== hook: a real moment — a clock rolls a minute, a message lands ===== */
shot('hook', { hero: 1.9, len: 2.5, tout: 'whip',
  sfx: [[0.02, 'swell'], [1.0, 'tick'], [1.3, 'whoosh_s'], [1.35, 'pop'], [2.32, 'whoosh']],
  build(c, s) {
    const h = B.hook, pre = h.from.slice(0, -1), d1 = h.from.slice(-1), d2 = h.to.slice(-1);
    D(c, 'blob', { width: 900, height: 600, left: -200, top: 730 });
    D(c, 'blob', { width: 700, height: 500, left: 1370, top: -200, opacity: .7 });
    s.clock = D(c, 'ctr head', { left: 960, top: 540, fontSize: '230px', lineHeight: 1.2, display: 'flex', alignItems: 'flex-start' },
      `<span>${pre}</span><span style="display:block;position:relative;width:.62em;height:1.2em;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 18%,#000 82%,transparent 100%)"><span class="dg" style="position:absolute;left:0;top:0;display:block"><span style="display:block;height:1.2em">${d1}</span><span style="display:block;height:1.2em">${d2}</span></span></span><span class="acc" style="font-weight:500">&nbsp;${h.suffix}</span>`);
    s.dg = s.clock.querySelector('.dg');
    s.notif = D(c, 'ctr card row', { left: 1500, top: 215, padding: '16px 22px', borderRadius: '18px' },
      `${av(person(0), 54, 0)}<div><div style="font-size:15px;color:var(--mut);font-weight:600">${h.notifMeta}</div><div style="font-size:22px;font-weight:600;white-space:nowrap">${h.notif}</div></div>`);
    s.dot = D(c, 'ctr', { left: 1500, top: 120, width: 14, height: 14, borderRadius: '50%', background: 'var(--red)' });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 2.5) });
    const p = eo(P(t, 0, .8));
    S(s.clock, { o: C(t / .3), b: (1 - p) * 36, s: L(1.14, 1, p) });
    const r = eio(P(t, .95, 1.25));
    s.dg.style.transform = `translateY(${-r * 1.2}em)`; s.dg.style.filter = `blur(${(Math.sin(r * Math.PI) * 7).toFixed(1)}px)`;
    const nx = tt => L(460, 0, bo(P(tt, 1.3, 1.8))), ny = tt => L(-140, 0, bo(P(tt, 1.3, 1.8)));
    S(s.notif, { x: nx(t), y: ny(t), r: L(10, -3, eo(P(t, 1.3, 1.8))), o: C((t - 1.3) * 6), bx: vel(nx, t) * .25, by: vel(ny, t) * .2 });
    S(s.dot, { x: 250, y: 50, s: bo(P(t, 1.7, 1.95)), o: P(t, 1.7, 1.75) });
  } });

/* ===== chaos: tilted 3D wall of message cards + blur-whip headline ===== */
shot('chaos', { hero: 1.6, len: 3.0, tin: 'whip', tout: 'zoom',
  sfx: [[0.12, 'pops6'], [0.28, 'whoosh_s'], [0.4, 'whoosh_s'], [2.75, 'whoosh']],
  build(c, s) {
    const ch = B.chaos;
    D(c, 'blob', { width: 1200, height: 700, left: 350, top: 200 });
    s.plane = D(c, 'abs', { left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '50% 60%' });
    s.cards = [];
    for (let r = 0; r < 6; r++) for (let k = 0; k < 9; k++) {
      const x = -60 + k * 240, y = -160 + r * 230, n = r * 9 + k, on = (n * 7) % 3 !== 0;
      const e = D(s.plane, 'abs', { left: x, top: y, width: 200, height: 190, borderRadius: '26px', padding: '18px',
        background: on ? '#fff' : 'rgba(255,255,255,.55)', boxShadow: on ? '0 20px 40px -14px rgba(30,50,110,.3)' : 'inset 0 0 0 2px #E3E8F3' });
      let bd = null;
      if (on) {
        const sr = ch.sources[n % ch.sources.length];
        e.innerHTML = `<div class="glyph" style="width:46px;height:46px;font-size:22px;border-radius:12px;background:${sr[1]}">${sr[0]}</div><div style="font-size:17px;font-weight:600;margin-top:14px;line-height:1.2">${ch.messages[n % ch.messages.length]}</div>`;
        if (n % 3 === 1) bd = D(e, 'abs badge', { right: -10, top: -10 }, String((n * 13) % 40 + 3));
      }
      s.cards.push({ e, bd, d: .08 + Math.hypot(x + 100 - 1250, y + 95 - 480) * .00055 + hash(n) * .12 });
    }
    s.wash = D(c, 'abs', { left: -200, top: 0, width: 1300, height: 1080, background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,.97) 55%,rgba(255,255,255,0) 100%)', filter: 'blur(20px)' });
    s.l1 = D(c, 'ctr head', { left: 520, top: 478, fontSize: '124px' }, ch.l1);
    s.l2 = D(c, 'ctr head acc', { left: 520, top: 604, fontSize: '124px' }, ch.l2);
  },
  update(t, s) {
    s.plane.style.transform = `perspective(1800px) rotateX(18deg) rotateZ(-6deg) scale(${(1.15 + t * .03).toFixed(4)}) translateX(${(-t * 30).toFixed(1)}px)`;
    for (const k of s.cards) {
      const p = P(t, k.d, k.d + .4);
      k.e.style.opacity = C(p * 3).toFixed(3); k.e.style.transform = `scale(${L(.5, 1, bo(p)).toFixed(3)}) translateY(${((1 - eo(p)) * 40).toFixed(1)}px)`;
      if (k.bd) k.bd.style.transform = `scale(${bo(P(t, k.d + .45, k.d + .7)).toFixed(3)})`;
    }
    S(s.wash, { o: eo(P(t, .2, .6)) });
    for (const [e, a] of [[s.l1, .3], [s.l2, .44]]) {
      const fx = tt => L(520, 0, eo(P(tt, a, a + .42)));
      S(e, { x: fx(t), o: C((t - a) * 6), bx: Math.min(60, vel(fx, t) * .35) });
    }
  } });

/* ===== pain: the problem as a number, then desaturate + dip to black ===== */
shot('pain', { hero: 1.6, len: 3.0, tin: 'zoom', bg: '#000',
  sfx: [[0.1, 'ticks10'], [0.45, 'pops4'], [1.2, 'stamp'], [2.1, 'down']],
  build(c, s) {
    const pn = B.pain;
    s.inner = D(c, 'abs', { inset: 0, background: '#fff' });
    D(s.inner, 'blob', { width: 900, height: 600, left: 500, top: 250 });
    const pos = [[260, 200], [1480, 180], [230, 780], [1520, 800], [840, 880], [1100, 130]];
    s.bub = pn.complaints.slice(0, 6).map((q, i) => D(s.inner, 'abs row', { left: pos[i][0], top: pos[i][1], gap: '10px' }, `${av(person(i), 58, i)}<span class="pill" style="font-size:19px;padding:9px 15px">${q}</span>`));
    const pfs = Math.min(250, Math.round(1640 / ((pn.value.toLocaleString('en-US').length + pn.unit.length + 1) * .56)));
    s.big = D(s.inner, 'ctr head', { left: 960, top: 500, fontSize: pfs + 'px' }, `<span class="num">0</span> <span style="font-weight:500">${pn.unit}</span>`);
    s.num = s.big.querySelector('.num');
    s.pill = D(s.inner, 'ctr badge', { left: 1230, top: 655, fontSize: '40px', padding: '12px 30px', boxShadow: '0 20px 40px -10px rgba(255,77,79,.6)' }, pn.pill);
    s.dim = D(c, 'abs', { inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(6,12,34,.55),rgba(2,4,12,1))', opacity: 0 });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.06, t / 3) });
    s.num.textContent = Math.round(B.pain.value * eo(P(t, .1, 1.15))).toLocaleString('en-US');
    S(s.big, { o: C(t * 8), b: (1 - eo(P(t, 0, .3))) * 20 });
    const q = P(t, 1.2, 1.45);
    S(s.pill, { s: L(2.4, 1, bo(q)), r: L(-22, -6, eo(q)), o: C(q * 4) });
    s.bub.forEach((e, i) => { const d = .45 + i * .17, k = P(t, d, d + .35); S(e, { s: L(.4, 1, bo(k)), o: C(k * 4), x: Math.sin(t * 1.3 + i) * 10, y: Math.cos(t * 1.1 + i * 2) * 8 }); });
    const g = P(t, 2.0, 3.0);
    s.inner.style.filter = `grayscale(${eio(C(g * 1.6)).toFixed(2)})`;
    s.dim.style.opacity = eio(g).toFixed(3);
  } });

/* ===== turn: dark starfield, a light flare draws a ring that becomes the app icon, white flash out ===== */
shot('turn', { hero: 2.1, len: 2.5, bg: '#000',
  sfx: [[0.0, 'boom'], [0.45, 'shimmer'], [0.5, 'riser']],
  build(c, s) {
    s.sky = D(c, 'abs', { inset: 0, background: 'radial-gradient(ellipse at 50% 50%,var(--night1) 0%,var(--night2) 55%,#020611 100%)' });
    s.stars = []; for (let i = 0; i < 170; i++) { const z = (i % 5) / 3 + 1; s.stars.push({ e: D(c, 'abs', { left: (i * 137.5) % 1920, top: (i * 91.7) % 1080, width: z, height: z, borderRadius: '50%', background: '#fff' }), k: i }); }
    s.halo = D(c, 'ctr', { left: 960, top: 540, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--acc2RGB),.45) 0%,rgba(var(--accRGB),0) 65%)' });
    c.insertAdjacentHTML('beforeend', `<svg class="abs" style="left:0;top:0" width="1920" height="1080"><defs>
      <filter id="rglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <circle class="ring" cx="960" cy="540" r="120" fill="none" style="stroke:var(--acc4)" stroke-width="24" stroke-linecap="round" filter="url(#rglow)"/></svg>`);
    s.ring = c.querySelector('.ring');
    s.icon = D(c, 'ctr', { left: 960, top: 540 }, iconHTML(230));
    s.fl = D(c, 'abs', { left: 0, top: 0, width: 0, height: 0 });
    s.fh = D(s.fl, 'ctr', { left: 0, top: 0, width: 900, height: 3, background: 'linear-gradient(90deg,transparent,rgba(220,232,255,.95),transparent)' });
    s.fv = D(s.fl, 'ctr', { left: 0, top: 0, width: 3, height: 240, background: 'linear-gradient(0deg,transparent,rgba(220,232,255,.95),transparent)' });
    s.fc = D(s.fl, 'ctr', { left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle,#fff 0%,rgba(var(--acc2RGB),.85) 25%,rgba(var(--accRGB),0) 70%)' });
  },
  update(t, s, c) {
    s.sky.style.opacity = eo(P(t, 0, .5)).toFixed(3);
    S(c, { s: L(1.06, 1, eo(P(t, 0, 2.6))) });
    for (const st of s.stars) st.e.style.opacity = (P(t, .1, .7) * (.25 + .45 * (.5 + .5 * Math.sin(t * (1.5 + hash(st.k) * 3) + st.k)))).toFixed(3);
    const R = 120, CIRC = 2 * Math.PI * R, dp = eio(P(t, .55, 1.6)), rot = -200 + 150 * eo(P(t, .55, 2.0));
    s.ring.setAttribute('stroke-dasharray', `${(CIRC * dp).toFixed(1)} 2000`);
    s.ring.setAttribute('transform', `rotate(${rot.toFixed(2)} 960 540)`);
    const m = P(t, 1.55, 2.0);
    s.ring.style.opacity = (dp > 0 ? 1 - eo(m) : 0).toFixed(3);
    s.ring.setAttribute('r', (R * L(1, 1.3, eo(m))).toFixed(1));
    const ang = (rot + dp * 360) * Math.PI / 180, corner = eio(P(t, 1.6, 2.0));
    const hx = L(960 + R * Math.cos(ang), 1055, corner), hy = L(540 + R * Math.sin(ang), 445, corner);
    const pre = eo(P(t, .3, .55)), pulse = .85 + .15 * Math.sin(t * 9);
    s.fl.style.transform = `translate(${hx.toFixed(1)}px,${hy.toFixed(1)}px)`;
    s.fl.style.opacity = (pre * (1 - .35 * P(t, 2.1, 2.5))).toFixed(3);
    S(s.fh, { s: L(.2, 1, pre) * pulse }); S(s.fv, { s: L(.2, 1, pre) * pulse }); S(s.fc, { s: pulse });
    const ip = P(t, 1.6, 2.05);
    S(s.icon, { s: L(.45, 1, bo(ip)), o: C(ip * 3), b: (1 - eo(ip)) * 10 });
    S(s.halo, { o: eo(P(t, .5, 1.8)) * .9, s: L(.6, 1.1, eo(P(t, .5, 2.4))) });
    flash(Math.pow(P(t, 2.15, 2.5), 2));
  } });

/* ===== brand: icon lands, slides left, wordmark types on, channel pills rise ===== */
shot('brand', { hero: 1.9, len: 2.5, bg: '#fff', tout: 'up',
  sfx: [[0.0, 'hit'], [0.7, 'type6'], [1.4, 'pops3'], [2.3, 'whoosh']],
  build(c, s) {
    D(c, 'blob', { width: 1100, height: 520, left: 410, top: -330, opacity: .9 });
    const fs = 170, wmW = B.product.length * fs * .52, total = 150 + 34 + wmW;
    s.ix = 960 - total / 2 + 75;
    s.icon = D(c, 'ctr', { left: s.ix, top: 500 }, iconHTML(150));
    s.wm = typed(c, 'abs head', { left: s.ix + 75 + 34, top: 500, fontSize: fs + 'px', fontWeight: 700, letterSpacing: '-.06em', transform: 'translateY(-50%)' }, [{ t: B.product }]);
    s.wm.cur.style.background = 'var(--ink)';
    s.pills = D(c, 'ctr row', { left: 960, top: 668, gap: '16px' }, B.channels.map(x => `<span class="pill" style="font-size:18px">${glyphHTML(x[0], x[1])}${x[2]}</span>`).join(''));
    s.pl = [...s.pills.children];
  },
  update(t, s, c) {
    flash(1 - eo(P(t, 0, .4)));
    S(c, { s: L(1, 1.05, t / 2.5) });
    const sl = eio(P(t, .5, .9));
    S(s.icon, { x: L(960 - s.ix, 0, sl), s: L(1.5, 1, eo(P(t, 0, .45))) });
    s.wm.el.style.opacity = sl > .2 ? 1 : 0;
    typeP(s.wm, P(t, .65, 1.25), t);
    s.pl.forEach((e, i) => { const k = P(t, 1.35 + i * .12, 1.7 + i * .12); S(e, { y: (1 - eo(k)) * 40, o: k * 2, b: (1 - eo(k)) * 8 }); });
  } });

/* ===== laptop: benefit headline types on, 3D laptop swings in with the UI, a hand clicks the action ===== */
shot('laptop', { hero: 3.4, len: 5.0, tin: 'up',
  sfx: [[0.1, 'type14'], [0.45, 'whoosh'], [1.0, 'pops5'], [2.0, 'whoosh_s'], [3.0, 'click']],
  build(c, s) {
    const ib = B.inbox;
    s.rays = D(c, 'rays', { height: 1080, opacity: .55 });
    s.h1 = typed(c, 'abs head', { left: 110, top: 330, fontSize: '104px' }, [{ t: ib.l1 }], false);
    s.h2 = typed(c, 'abs head acc', { left: 110, top: 436, fontSize: '104px' }, [{ t: ib.l2 }]);
    s.lap = D(c, 'abs', { left: 880, top: 120, width: 960, height: 860, perspective: '2200px' });
    s.scr = D(s.lap, 'abs', { left: 40, top: 40, width: 880, height: 560, transformOrigin: '50% 100%' });
    const bez = D(s.scr, 'abs', { inset: 0, borderRadius: '28px', background: '#1a1c22', padding: '18px', boxShadow: '0 60px 120px -30px rgba(20,40,110,.55)' });
    const app = D(bez, '', { width: '100%', height: '100%', borderRadius: '12px', background: '#fff', overflow: 'hidden', display: 'flex', position: 'relative' });
    s.base = D(s.lap, 'abs', { left: -20, top: 600, width: 1000, height: 46, transformOrigin: '50% 0', borderRadius: '0 0 30px 30px', background: 'linear-gradient(180deg,#d9dde6,#aeb4c2)', boxShadow: '0 40px 60px -20px rgba(20,40,110,.4)' });
    s.rows = [];
    if (ib.screenshot) {
      app.innerHTML = `<img src="${ib.screenshot}" style="width:100%;height:100%;object-fit:cover;object-position:top left">`;
      s.res = D(app, 'abs', { left: (ib.click[0] * 100) + '%', top: (ib.click[1] * 100) + '%', width: 34, height: 34, margin: '-17px 0 0 -17px', borderRadius: '50%', boxShadow: '0 0 0 4px var(--acc), 0 0 0 14px rgba(var(--accRGB),.25)' });
    } else {
      D(app, '', { width: 170, background: '#F6F8FC', padding: '18px 14px' }, ib.nav.map((x, i) => `<div style="font-size:14px;font-weight:600;padding:9px 10px;border-radius:8px;${i == 0 ? 'background:var(--tint);color:var(--acc)' : 'color:#6B7180'}">${x}</div>`).join(''));
      const main = D(app, '', { flex: 1, padding: '20px 22px' }, `<div style="font-size:20px;font-weight:700;margin-bottom:12px">${ib.title} <span class="badge" style="font-size:12px;padding:2px 8px;background:var(--acc)">${ib.badge}</span></div>`);
      s.rows = ib.items.slice(0, 5).map((it, i) => { const cl = ib.tags[it[1]] || ['var(--tint)', 'var(--acc)'];
        return D(main, 'row', { padding: '11px 12px', marginBottom: '8px', borderRadius: '12px', background: '#fff', boxShadow: 'inset 0 0 0 1px #EDF0F6' },
          `${av(person(i), 34, i)}<div style="flex:1;font-size:15px;font-weight:600">${it[0]}</div><span class="tag" style="background:${cl[0]};color:${cl[1]}">${it[1]}</span>`); });
      s.res = document.createElement('span'); s.res.className = 'tag'; s.res.style.cssText = 'background:var(--acc);color:#fff;display:inline-block'; s.res.textContent = ib.action;
      s.rows[0].appendChild(s.res);
    }
    s.hand = D(c, 'abs', { left: 0, top: 0, width: 110, height: 130, filter: 'drop-shadow(0 18px 18px rgba(20,40,110,.45))' },
      `<svg width="110" height="130" viewBox="0 0 22 26"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc2)"/><stop offset="1" style="stop-color:var(--acc3)"/></linearGradient></defs><path d="M7 1.5c1 0 1.8.8 1.8 1.8v7.2l.6-.1c.9-.1 1.7.4 2 1.2.6-.3 1.4-.3 2 .1.5-.3 1.3-.3 1.9.1.9.6 1.5 1.6 1.5 2.7V19c0 3.3-2.7 6-6 6H9.6c-1.7 0-3.3-.8-4.3-2.1L1.6 18c-.6-.8-.5-1.9.3-2.5.8-.6 1.9-.5 2.5.3l.8 1V3.3C5.2 2.3 6 1.5 7 1.5z" fill="url(#hg)" stroke="#fff" stroke-width="1"/></svg>`);
    s.hand.style.transformOrigin = '35px 8px';
    s.rip = D(c, 'ctr', { left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(var(--accRGB),.7)' });
  },
  measure(s, sc) { // locate the click target with the laptop in its final pose; s.focus feeds the next shot's circle reveal
    sc.update(4.0, s, sc.cam, sc, true);
    const r = s.res.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    s.tx = r.left - sr.left + r.width * .45; s.ty = r.top - sr.top + r.height * .55;
    s.focus = { x: 960 + (s.tx - 960) * 1.07, y: 540 + (s.ty - 540) * 1.07 };
  },
  update(t, s, c, sc, noCam) {
    S(c, { s: noCam ? 1 : L(1, 1.07, eio(C(t / sc.vd))) });
    S(s.rays, { o: .55 * eo(P(t, 0, .6)) });
    typeP(s.h1, P(t, .15, .6), t, false); typeP(s.h2, P(t, .6, 1.0), t);
    const lp = P(t, .35, 1.25), lx = tt => L(760, 0, eo(P(tt, .35, 1.25)));
    s.lap.style.transform = `translateX(${lx(t).toFixed(1)}px) translateY(${(Math.sin(t * 1.2) * 6).toFixed(1)}px)`;
    s.lap.style.opacity = C(lp * 4).toFixed(3);
    s.lap.style.filter = vel(lx, t) > 3 ? `blur(${Math.min(14, vel(lx, t) * .12).toFixed(1)}px)` : 'none';
    const ry = L(-60, -24, eo(lp)) + Math.sin(t * .8) * 1.5;
    s.scr.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(8deg) rotateZ(2deg)`;
    s.base.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(62deg)`;
    s.rows.forEach((e, i) => { const k = P(t, 1.0 + i * .1, 1.35 + i * .1); e.style.opacity = k.toFixed(3); e.style.transform = `translateY(${((1 - eo(k)) * 18).toFixed(1)}px)`; });
    const clicked = t >= 3.02, rp = P(t, 3.02, 3.25);
    if (s.rows.length) {
      s.rows[0].style.background = clicked ? 'var(--tint)' : '#fff';
      s.rows[0].style.boxShadow = clicked ? 'inset 0 0 0 2px var(--acc)' : 'inset 0 0 0 1px #EDF0F6';
    }
    s.res.style.transform = `scale(${(clicked || noCam ? L(.6, 1, bo(noCam ? 1 : rp)) : .001).toFixed(3)})`; s.res.style.opacity = clicked || noCam ? 1 : 0;
    if (noCam || s.tx == null) return;
    const hp = eio(P(t, 1.9, 2.9)), tipX = s.tx - 35, tipY = s.ty - 8;
    const press = t > 2.9 && t < 3.2 ? 1 - .12 * Math.sin(P(t, 2.9, 3.2) * Math.PI) : 1;
    S(s.hand, { x: L(tipX + 420, tipX, hp) - Math.sin(hp * Math.PI) * 60, y: L(tipY + 520, tipY, hp), s: press, o: P(t, 1.85, 2.05), r: L(18, 0, hp) });
    const ri = P(t, 3.0, 3.55);
    s.rip.style.left = s.tx + 'px'; s.rip.style.top = s.ty + 'px';
    S(s.rip, { s: L(.2, 1.8, eo(ri)), o: ri > 0 ? 1 - ri : 0 });
  } });

/* ===== circle: accent circle grows from the previous shot's focus point; items fly into sorted columns ===== */
shot('circle', { hero: 3.0, len: 4.0, under: 0.75, tout: 'zoom', bg: 'transparent',
  sfx: [[0.0, 'hit_s'], [0.02, 'whoosh'], [1.25, 'pops9'], [3.7, 'whoosh']],
  build(c, s) {
    const so = B.sort;
    s.blue = D(c, 'abs', { inset: 0, background: 'radial-gradient(ellipse at 50% 30%,var(--acc2) 0%,var(--acc) 45%,var(--acc3) 100%)' });
    s.pat = D(s.blue, 'abs', { left: -300, top: -40, width: 2600, color: 'rgba(255,255,255,.07)', fontWeight: 600, fontSize: '64px', letterSpacing: '-.03em', lineHeight: 1.15, whiteSpace: 'nowrap' });
    let p = ''; for (let i = 0; i < 10; i++) p += Array(10).fill(so.pattern[i % so.pattern.length]).join(' · ') + '<br>';
    s.pat.innerHTML = p;
    s.h1 = D(s.blue, 'ctr head', { left: 960, top: 250, fontSize: '104px', color: '#fff' }, so.l1);
    s.h2 = D(s.blue, 'ctr head', { left: 960, top: 360, fontSize: '104px', color: 'var(--acc4)' }, so.l2);
    const xs = [560, 960, 1360];
    s.cols = so.columns.slice(0, 3).map((n, i) => {
      const e = D(s.blue, 'abs', { left: xs[i] - 170, top: 480, width: 340, height: 500, borderRadius: '26px', background: 'rgba(255,255,255,.12)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.35)', padding: '20px' },
        `<div class="row" style="justify-content:space-between;color:#fff;font-weight:600;font-size:24px">${n}<span class="cnt num" style="background:rgba(255,255,255,.22);border-radius:999px;padding:2px 12px;font-size:18px">0</span></div>`);
      return { e, cnt: e.querySelector('.cnt') };
    });
    const slot = [0, 0, 0];
    s.chips = so.chips.slice(0, 9).map(([txt, ci], i) => {
      const k = slot[ci]++, a = hash(i + 3) * Math.PI * 2;
      const e = D(s.blue, 'abs row', { left: xs[ci] - 150, top: 560 + k * 96, width: 300, height: 80, borderRadius: '18px', background: '#fff', padding: '0 16px', gap: '12px', boxShadow: '0 18px 36px -14px rgba(0,20,80,.5)' },
        `${av(person(i), 40, i)}<div style="font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${txt}</div>`);
      return { e, ci, d: 1.15 + i * .14, fx: Math.cos(a) * 1100, fy: Math.sin(a) * 700 - 200, r0: (hash(i) - .5) * 50 };
    });
    s.ring = D(c, 'ctr', { left: 0, top: 0, width: 100, height: 100, borderRadius: '50%', boxShadow: '0 0 0 14px rgba(var(--accRGB),.18), 0 0 0 36px rgba(var(--accRGB),.08)' });
  },
  update(t, s, c, sc) {
    const pv = scenes[sc.i - 1], f = (pv && pv.st.focus) || { x: 960, y: 540 };
    const R = 2300 * eio(P(t, 0, .7));
    s.blue.style.clipPath = `circle(${R.toFixed(1)}px at ${f.x.toFixed(1)}px ${f.y.toFixed(1)}px)`;
    s.ring.style.left = f.x + 'px'; s.ring.style.top = f.y + 'px';
    S(s.ring, { s: R / 50, o: R > 1 && t < .7 ? 1 - P(t, .4, .7) : 0 });
    S(c, { s: L(1, 1.04, t / 4) });
    s.pat.style.transform = `translateX(${(-t * 40).toFixed(1)}px)`;
    blurIn(s.h1, t, .35, .8, { y: 30 }); blurIn(s.h2, t, .5, .95, { y: 30 });
    s.cols.forEach((k, i) => { const q = P(t, .8 + i * .1, 1.2 + i * .1); S(k.e, { y: (1 - eo(q)) * 120, o: q * 2 }); });
    const cnt = [0, 0, 0];
    for (const k of s.chips) {
      const q = P(t, k.d, k.d + .5);
      const fx = tt => L(k.fx, 0, eio(P(tt, k.d, k.d + .5))), fy = tt => L(k.fy, 0, eio(P(tt, k.d, k.d + .5)));
      S(k.e, { x: fx(t), y: fy(t), r: L(k.r0, 0, eo(q)), s: L(.7, 1, eio(q)), o: C(q * 5), bx: Math.min(40, vel(fx, t) * .2), by: Math.min(40, vel(fy, t) * .2) });
      if (q >= 1) cnt[k.ci]++;
    }
    s.cols.forEach((k, i) => k.cnt.textContent = cnt[i]);
  } });

/* ===== fanout: a message types and sends; lines draw out to each channel, which ticks ===== */
shot('fanout', { hero: 3.3, len: 4.0, tin: 'zoom', tout: 'whip',
  sfx: [[0.15, 'type10'], [0.9, 'type26'], [2.15, 'click'], [2.3, 'swoop'], [2.6, 'pops3'], [3.8, 'whoosh']],
  build(c, s) {
    const rp = B.reply;
    D(c, 'blob', { width: 900, height: 600, left: -250, top: 600 }); D(c, 'blob', { width: 800, height: 600, left: 1350, top: -250, opacity: .7 });
    s.h1 = typed(c, 'ctr head', { left: 960, top: 175, fontSize: '96px' }, [{ t: rp.l1 }], false);
    s.h2 = typed(c, 'ctr head acc', { left: 960, top: 275, fontSize: '96px' }, [{ t: rp.l2 }]);
    s.card = D(c, 'ctr card row', { left: 960, top: 520, width: 1000, height: 140, padding: '0 34px', gap: '22px', borderRadius: '32px' });
    s.card.innerHTML = av(rp.avatar, 70, 4) + '<div class="ttxt" style="flex:1;font-size:30px;font-weight:500"></div>';
    s.msg = typed(s.card.querySelector('.ttxt'), '', {}, [{ t: rp.message }]);
    s.send = D(s.card, '', { width: 76, height: 76, borderRadius: '50%', background: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '34px', fontWeight: 700, boxShadow: '0 14px 30px -8px rgba(var(--accRGB),.6)', flex: 'none' }, '↑');
    const ch = B.channels.slice(0, 3), xs = ch.length === 3 ? [520, 960, 1400] : ch.length === 2 ? [700, 1220] : [960], ys = ch.map((_, i) => (i === 1 && ch.length === 3) ? 900 : 880);
    c.insertAdjacentHTML('beforeend', `<svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080">${ch.map((n, i) => `<path class="lk" d="M960 592 C 960 720, ${xs[i]} 700, ${xs[i]} ${ys[i] - 52}" fill="none" style="stroke:var(--acc)" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="0 1"/>`).join('')}</svg>`);
    s.links = [...c.querySelectorAll('.lk')];
    s.nodes = ch.map((n, i) => {
      const e = D(c, 'ctr card row', { left: xs[i], top: ys[i], padding: '16px 26px 16px 16px', borderRadius: '22px', gap: '14px' }, `<div class="glyph" style="background:${n[1]}">${n[0]}</div><div style="font-size:26px;font-weight:600">${n[2]}</div>`);
      const ck = D(e, 'abs', { right: -14, top: -14, width: 40, height: 40, borderRadius: '50%', background: '#19B36B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, border: '3px solid #fff' }, '✓');
      return { e, ck };
    });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 4) });
    typeP(s.h1, P(t, .1, .5), t, false); typeP(s.h2, P(t, .5, 1.0), t, t < 1.6);
    const cp = P(t, .3, .75); S(s.card, { y: (1 - eo(cp)) * 80, o: cp * 2, s: L(.94, 1, eo(cp)) });
    typeP(s.msg, P(t, .9, 2.0), t, t <= 2.3);
    S(s.send, { s: 1 - .16 * Math.sin(P(t, 2.15, 2.35) * Math.PI), o: 1 });
    s.links.forEach((l, i) => { const k = eio(P(t, 2.35 + i * .08, 2.8 + i * .08)); l.setAttribute('stroke-dasharray', `${k.toFixed(3)} 1`); l.style.opacity = k > 0 ? 1 : 0; });
    s.nodes.forEach((n, i) => {
      const a = P(t, .7 + i * .1, 1.05 + i * .1), hit = P(t, 2.75 + i * .1, 3.0 + i * .1);
      S(n.e, { y: (1 - eo(a)) * 60, o: a * .5 + hit * .5, s: 1 + .06 * Math.sin(hit * Math.PI) });
      S(n.ck, { s: bo(hit), o: hit > 0 ? 1 : 0 });
    });
  } });

/* ===== dashboard: dashboard rises on an accent dome, numbers count up, side cards fan out ===== */
shot('dashboard', { hero: 2.6, len: 4.0, tin: 'whip', tout: 'up',
  sfx: [[0.4, 'whoosh_s'], [0.7, 'ticks12'], [1.0, 'pops3'], [1.9, 'pop'], [3.82, 'whoosh']],
  build(c, s) {
    const pr = B.proof;
    s.dome = D(c, 'abs', { left: -300, top: 640, width: 2520, height: 1400, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 0%,var(--acc2) 0%,var(--acc) 30%,var(--acc3) 70%)', boxShadow: '0 -40px 120px rgba(var(--accRGB),.45)' });
    s.h = D(c, 'ctr head', { left: 960, top: 118, fontSize: '84px' }, `${pr.pre}<span class="acc">${pr.accent}</span>`);
    s.side1 = D(c, 'ctr card', { left: 350, top: 420, width: 300, padding: '24px' }, `<div style="color:var(--mut);font-size:16px;font-weight:600">${pr.left.label}</div><div class="num v" style="font-size:60px;font-weight:700;letter-spacing:-.04em">0</div><div class="row" style="gap:0">${[0, 1, 2, 3].map(i => `<div style="margin-left:${i ? -12 : 0}px">${av(i === 3 ? '+9' : person(i), 40, i)}</div>`).join('')}</div>`);
    s.side2 = D(c, 'ctr card', { left: 1570, top: 370, width: 300, padding: '24px' }, `<div style="color:var(--mut);font-size:16px;font-weight:600">${pr.right.label}</div><div style="font-size:60px;font-weight:700;letter-spacing:-.04em"><span class="num v">0.0</span> <span style="font-size:30px;color:#FFB020">★★★★★</span></div>`);
    s.main = D(c, 'ctr card', { left: 960, top: 495, width: 800, height: 470, padding: '34px' },
      `<div class="row" style="justify-content:space-between"><b style="font-size:22px">${pr.panel}</b><span class="tag" style="background:var(--tint);color:var(--acc)">${pr.period}</span></div>
       <div class="row" style="margin-top:26px;gap:60px"><div><div style="color:var(--mut);font-size:17px;font-weight:600">${pr.m1.label}</div><div class="num r" style="font-size:72px;font-weight:700;letter-spacing:-.04em">0</div></div>
       <div><div style="color:var(--mut);font-size:17px;font-weight:600">${pr.m2.label}</div><div style="font-size:72px;font-weight:700;letter-spacing:-.04em"><span class="num m">0</span><span style="font-size:36px;color:var(--mut)">${pr.m2.unit}</span></div></div></div>
       <div class="row bars" style="align-items:flex-end;gap:22px;height:170px;margin-top:22px"></div>`);
    const n = pr.bars.length;
    s.bars = pr.bars.map((h, i) => D(s.main.querySelector('.bars'), '', { flex: 1, height: h, borderRadius: '10px 10px 4px 4px', background: i >= n - 2 ? 'linear-gradient(180deg,var(--acc2),var(--acc))' : 'var(--tint)', transformOrigin: '50% 100%' }));
    s.r = s.main.querySelector('.r'); s.m = s.main.querySelector('.m'); s.v1 = s.side1.querySelector('.v'); s.v2 = s.side2.querySelector('.v');
    s.quote = D(c, 'ctr pill', { left: 1450, top: 735 }, `${av(person(1), 36, 1)}${pr.quote}`);
  },
  update(t, s, c) {
    const pr = B.proof;
    S(c, { s: L(1, 1.05, t / 4) });
    S(s.dome, { y: (1 - eo(P(t, 0, .8))) * 500 });
    blurIn(s.h, t, .1, .55, { y: -20 });
    const mp = P(t, .25, .85); S(s.main, { y: (1 - eo(mp)) * 260 + Math.sin(t * 1.4) * 5, s: L(.85, 1, eo(mp)), o: mp * 2, b: (1 - eo(mp)) * 10 });
    const k = eo(P(t, .7, 2.0));
    s.r.textContent = Math.round(pr.m1.to * k).toLocaleString('en-US');
    s.m.textContent = Math.round(L(pr.m2.from, pr.m2.to, k));
    s.bars.forEach((b, i) => b.style.transform = `scaleY(${bo(P(t, .8 + i * .07, 1.2 + i * .07)).toFixed(3)})`);
    const f1 = bo(P(t, 1.0, 1.45)), f2 = bo(P(t, 1.1, 1.55));
    S(s.side1, { x: L(610, 0, f1), y: L(75, 0, f1) + Math.sin(t * 1.7) * 6, r: L(0, -4, f1), o: P(t, 1.0, 1.15) });
    S(s.side2, { x: L(-610, 0, f2), y: L(125, 0, f2) + Math.cos(t * 1.5) * 6, r: L(0, 4, f2), o: P(t, 1.1, 1.25) });
    s.v1.textContent = Math.round(pr.left.to * eo(P(t, 1.2, 2.2))) + (pr.left.suffix || '');
    s.v2.textContent = (pr.right.to * eo(P(t, 1.3, 2.3))).toFixed(1);
    const q = P(t, 1.9, 2.2); S(s.quote, { s: bo(q), o: q * 3 });
  } });

/* ===== social: "Trusted by N+" count-up, logo marquee, rating ticks up ===== */
shot('social', { hero: 2.0, len: 3.0, tin: 'up', tout: 'fade',
  sfx: [[0.2, 'ticks10'], [1.0, 'pop'], [1.9, 'riser'], [2.8, 'whoosh']],
  build(c, s) {
    const so = B.social;
    D(c, 'blob', { width: 1200, height: 500, left: 360, top: -260, opacity: .8 });
    s.h1 = D(c, 'ctr head', { left: 960, top: 330, fontSize: '104px' }, so.l1);
    s.h2 = D(c, 'ctr head acc', { left: 960, top: 440, fontSize: '104px' }, `<span class="num n">${so.from}</span>${so.suffix}`);
    s.n = s.h2.querySelector('.n');
    const wrap = D(c, 'abs', { left: 0, top: 600, width: 1920, height: 120, WebkitMaskImage: 'linear-gradient(90deg,transparent 10%,#000 30%,#000 70%,transparent 90%)' });
    s.strip = D(wrap, 'abs row', { left: 0, top: 30, gap: '90px' });
    const sty = ['font-weight:800;letter-spacing:-.03em', 'font-weight:500;font-style:italic', 'font-weight:700;letter-spacing:.12em;font-size:30px', 'font-weight:600', 'font-weight:800', 'font-weight:400;letter-spacing:-.02em', 'font-weight:800;letter-spacing:.2em;font-size:28px', 'font-weight:700;font-style:italic'];
    const one = so.logos.map((l, i) => /\.(png|jpe?g|webp|svg)$/i.test(l) ? `<img src="${l}" style="height:44px;opacity:.55;filter:grayscale(1)">` : `<span style="font-size:40px;color:#9AA0AE;white-space:nowrap;${sty[i % sty.length]}">${l}</span>`).join('');
    s.strip.innerHTML = one + one + one;
    s.line = D(c, 'abs', { left: 560, top: 590, width: 4, height: 140, borderRadius: '2px', background: 'var(--acc)', boxShadow: '0 0 20px rgba(var(--accRGB),.7)' });
    s.rate = D(c, 'ctr card row', { left: 960, top: 860, padding: '16px 28px', borderRadius: '20px', gap: '14px' }, `<span style="font-size:44px;font-weight:700;letter-spacing:-.03em" class="num rv">${so.rating.from}</span><span style="color:#FFB020;font-size:28px">★★★★★</span><span style="color:var(--mut);font-size:18px;font-weight:600">${so.rating.note}</span>`);
    s.rv = s.rate.querySelector('.rv');
  },
  update(t, s, c) {
    const so = B.social;
    S(c, { s: L(1, 1.04, t / 3) });
    blurIn(s.h1, t, .05, .45, { y: 20 }); blurIn(s.h2, t, .18, .6, { y: 20 });
    s.n.textContent = Math.round(L(so.from, so.to, eo(P(t, .2, 1.4)))).toLocaleString('en-US');
    s.strip.style.transform = `translateX(${(-200 - t * 160).toFixed(1)}px)`;
    s.strip.style.opacity = P(t, .3, .7).toFixed(3);
    S(s.line, { o: P(t, .4, .6) });
    const rp = P(t, .9, 1.3); S(s.rate, { y: (1 - eo(rp)) * 60, o: rp * 2 });
    s.rv.textContent = L(so.rating.from, so.rating.to, eo(P(t, 1.0, 1.9))).toFixed(1);
  } });

/* ===== reel: slot-machine number rolls to the answer ("02 minutes to set up") ===== */
shot('reel', { hero: 1.9, len: 2.5, tin: 'fade', tout: 'fade',
  sfx: [[0.1, 'reel'], [0.9, 'type10']],
  build(c, s) {
    const su = B.setup, step = su.to < su.from ? -1 : 1, list = [];
    for (let n = su.from; step < 0 ? n >= su.to : n <= su.to; n += step) list.push(n);
    s.count = list.length - 1;
    D(c, 'blob', { width: 900, height: 600, left: 1200, top: 600, opacity: .8 });
    D(c, 'ctr', { left: 1230, top: 540, width: 1400, height: 1400, borderRadius: '50%', border: '2px solid #E3E8F3' });
    s.dot = D(c, 'ctr', { left: 560, top: 540, width: 14, height: 14, borderRadius: '50%', background: 'var(--acc)', boxShadow: '0 0 0 10px rgba(var(--accRGB),.15)' });
    s.items = list.map(n => D(c, 'ctr head num', { left: 760, top: 540, fontSize: '240px', fontWeight: 700 }, String(n).padStart(2, '0')));
    s.t1 = typed(c, 'abs head', { left: 960, top: 445, fontSize: '84px' }, [{ t: su.l1 }], false);
    s.t2 = typed(c, 'abs head acc', { left: 960, top: 535, fontSize: '84px' }, [{ t: su.l2 }]);
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 2.5) });
    const pos = tt => s.count * eo(P(tt, .1, 1.3)), p = pos(t), v = vel(pos, t);
    s.items.forEach((e, i) => {
      const d = i - p, ad = Math.abs(d);
      S(e, { x: -ad * ad * 26, y: d * 190, s: 1 - Math.min(ad, 2.5) * .28, o: C(1 - ad * .62) * P(t, 0, .2), by: Math.min(30, v * 10) });
      e.style.color = ad < .5 ? 'var(--ink)' : '#B9BFCC';
    });
    typeP(s.t1, P(t, .9, 1.25), t, false); typeP(s.t2, P(t, 1.25, 1.7), t);
    S(s.dot, { s: bo(P(t, 1.2, 1.5)), o: P(t, 1.2, 1.3) });
  } });

/* ===== cta: icon pops, wordmark types, tagline + buttons + URL, light-equalizer glow ===== */
shot('cta', { hero: 2.6, len: 4.0, bg: '#fff', tin: 'zoom',
  sfx: [[0.0, 'hit'], [0.4, 'type6'], [1.0, 'whoosh_s'], [1.4, 'pops2']],
  build(c, s) {
    const ct = B.cta;
    s.eq = D(c, 'abs', { left: 0, top: 540, width: 1920, height: 600, filter: 'blur(22px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 100% at 50% 100%,#000 30%,transparent 75%)' });
    s.bars = []; for (let i = 0; i < 40; i++) s.bars.push(D(s.eq, 'abs', { left: 20 + i * 48, bottom: 0, width: 28, height: 300, background: 'linear-gradient(0deg,var(--acc),rgba(var(--acc2RGB),.4))', transformOrigin: '50% 100%' }));
    const fs = 140, wmW = B.product.length * fs * .52, total = 120 + 30 + wmW, ix = 960 - total / 2 + 60;
    s.icon = D(c, 'ctr', { left: ix, top: 380 }, iconHTML(120));
    s.wm = typed(c, 'abs head', { left: ix + 60 + 30, top: 380, fontSize: fs + 'px', fontWeight: 700, letterSpacing: '-.06em', transform: 'translateY(-50%)' }, [{ t: B.product }]);
    s.wm.cur.style.background = 'var(--ink)';
    s.tag = D(c, 'ctr head', { left: 960, top: 522, fontSize: '56px', fontWeight: 500 }, `${ct.tagline[0]}<span class="acc">${ct.tagline[1] || ''}</span>`);
    s.btns = D(c, 'ctr row', { left: 960, top: 642, gap: '20px' }, `<span class="pill" style="background:var(--acc);color:#fff;padding:18px 34px;font-size:24px;font-weight:600">${ct.primary}</span>` + (ct.secondary ? `<span class="pill" style="padding:18px 34px;font-size:24px">${ct.secondary}</span>` : ''));
    s.bl = [...s.btns.children];
    s.url = D(c, 'ctr', { left: 960, top: 735, color: 'var(--mut)', fontSize: '22px', fontWeight: 500 }, B.url);
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 3))) });
    const lvl = eo(P(t, 0, .8));
    s.bars.forEach((b, i) => { const d = Math.abs(i - 19.5) / 20, h = (1 - d * .8) * (.55 + .45 * Math.abs(Math.sin(t * 4.2 + i * .7) * Math.cos(t * 2.1 + i * .3))); b.style.transform = `scaleY(${(h * lvl).toFixed(3)})`; });
    const ip = P(t, .1, .5); S(s.icon, { s: L(.3, 1, bo(ip)), o: ip * 3, r: L(-30, 0, eo(ip)) });
    typeP(s.wm, P(t, .4, .9), t, t < 1.4);
    blurIn(s.tag, t, 1.0, 1.4, { y: 24 });
    s.bl.forEach((e, i) => { const a = 1.35 + i * .15, k = P(t, a, a + .35); S(e, { y: (1 - eo(k)) * 40, o: k * 2, s: L(.9, 1, bo(k)) }); });
    blurIn(s.url, t, 1.85, 2.2, { y: 12, blur: 10 });
  } });

/* ===== colorize: a grey wall of faces; a toggle flips on and faces light up with channel badges ===== */
shot('colorize', { hero: 2.6, len: 3.2, tin: 'up', tout: 'whip',
  sfx: [[0.05, 'pops6'], [0.3, 'type12'], [1.2, 'click'], [1.45, 'pops8'], [1.9, 'pops6'], [2.25, 'pop'], [2.95, 'whoosh']],
  build(c, s) {
    const cz = B.colorize, ch = B.channels;
    s.grid = D(c, 'abs', { left: 0, top: 0, width: 1920, height: 1080 });
    s.faces = [];
    for (let r = 0; r < 9; r++) for (let k = 0; k < 15; k++) {
      const x = -30 + k * 138 + (r % 2) * 69, y = -40 + r * 132, i = r * 15 + k;
      const w = D(s.grid, 'abs', { left: x, top: y, width: 100, height: 100 }, av(person(i), 100, i));
      const dx = x + 50 - 960, dy = y + 50 - 540, d = Math.hypot(dx, dy * 1.6);
      const centre = Math.abs(dx) < 560 && Math.abs(dy) < 230;               // keep the middle clear for the copy
      const lit = !centre && hash(i * 3.7) < .32;
      let bd = null;
      if (lit) { const g = ch[i % ch.length]; bd = D(w, 'abs', { right: -4, bottom: -4 }, glyphHTML(g[0], g[1], 34)); }
      s.faces.push({ w, bd, lit, d0: .02 + d * .00045, d1: 1.35 + d * .0009 + hash(i) * .35 });
    }
    s.wash = D(c, 'ctr', { left: 960, top: 560, width: 1500, height: 720, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.97) 35%,rgba(255,255,255,0) 70%)' });
    s.h1 = typed(c, 'ctr head', { left: 960, top: 410, fontSize: '96px' }, [{ t: cz.l1 }], false);
    s.h2 = typed(c, 'ctr head acc', { left: 960, top: 505, fontSize: '96px' }, [{ t: cz.l2 }]);
    s.tog = D(c, 'ctr card row', { left: 960, top: 650, padding: '14px 18px 14px 22px', borderRadius: '999px', gap: '16px' },
      `${iconHTML(40)}<span style="font-size:24px;font-weight:600;white-space:nowrap">${cz.toggle}</span><span class="sw" style="position:relative;width:74px;height:42px;border-radius:999px;background:#D9DEE8;display:block"><span class="kn" style="position:absolute;left:4px;top:4px;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.25);display:block"></span></span>`);
    s.sw = s.tog.querySelector('.sw'); s.kn = s.tog.querySelector('.kn');
    s.pill = D(c, 'ctr pill', { left: 960, top: 745, fontSize: '20px', fontWeight: 600, color: 'var(--acc)' }, `<span style="width:10px;height:10px;border-radius:50%;background:#19B36B;display:inline-block"></span>${cz.pill}`);
  },
  update(t, s, c) {
    S(c, { s: L(1.08, 1, eo(P(t, 0, 3.2))) });
    s.grid.style.transform = `translateY(${(-t * 14).toFixed(1)}px)`;
    for (const f of s.faces) {
      const a = P(t, f.d0, f.d0 + .35), on = f.lit ? P(t, f.d1, f.d1 + .3) : 0;
      f.w.style.opacity = (C(a * 3) * (.5 + .5 * on)).toFixed(3);
      f.w.style.filter = `grayscale(${(1 - on).toFixed(2)})`;
      f.w.style.transform = `scale(${(L(.6, 1, bo(a)) * (1 + .18 * Math.sin(on * Math.PI))).toFixed(3)})`;
      if (f.bd) f.bd.style.transform = `scale(${bo(P(t, f.d1 + .12, f.d1 + .4)).toFixed(3)})`;
    }
    S(s.wash, { o: eo(P(t, .1, .5)) });
    typeP(s.h1, P(t, .3, .7), t, false); typeP(s.h2, P(t, .7, 1.05), t, t < 1.3);
    const tp = P(t, .55, .9); S(s.tog, { y: (1 - eo(tp)) * 50, o: tp * 2, s: L(.9, 1, bo(tp)) });
    const k = eio(P(t, 1.15, 1.4));
    s.kn.style.transform = `translateX(${(k * 32).toFixed(1)}px)`;
    s.sw.style.background = k > .5 ? 'var(--acc)' : '#D9DEE8';
    const q = P(t, 2.2, 2.5); S(s.pill, { y: (1 - eo(q)) * 30, o: q * 2, s: L(.8, 1, bo(q)) });
  } });

/* ===== morph: an accent card with a headline morphs into a folder, then into a UI panel; a hand approves ===== */
shot('morph', { hero: 3.4, len: 4.0, tin: 'zoom', tout: 'up',
  sfx: [[0.0, 'pop'], [0.9, 'whoosh_s'], [1.3, 'swoop'], [1.6, 'pops6'], [2.0, 'whoosh_s'], [2.95, 'click'], [3.02, 'pop'], [3.78, 'whoosh']],
  build(c, s) {
    const m = B.morph;
    D(c, 'blob', { width: 1100, height: 700, left: 410, top: 200 });
    s.tab = D(c, 'abs', { borderRadius: '22px 22px 0 0' });
    s.card = D(c, 'abs', { overflow: 'hidden', boxShadow: '0 40px 90px -20px rgba(var(--accRGB),.45)' });
    s.white = D(s.card, 'abs', { inset: 0, background: '#fff' });
    s.fill = D(s.card, 'abs', { inset: 0, background: 'linear-gradient(150deg,var(--acc2),var(--acc) 55%,var(--acc3))' });
    s.h = D(s.card, 'ctr head', { left: '50%', top: '50%', fontSize: '92px', color: '#fff', textAlign: 'center' }, `${m.l1}\n<span style="color:var(--acc4)">${m.l2}</span>`);
    s.hdr = D(s.card, 'abs row', { left: 0, top: 0, right: 0, height: 76, padding: '0 30px', background: 'var(--acc)', color: '#fff', fontSize: '24px', fontWeight: 600, justifyContent: 'space-between' },
      `<span class="row" style="gap:12px">${iconHTML(36)}${m.title}</span><span class="row" style="gap:8px">${['All', 'Mine', 'Done'].map((x, i) => `<span style="font-size:15px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,${i ? .18 : .95});color:${i ? '#fff' : 'var(--acc)'}">${x}</span>`).join('')}</span>`);
    s.tiles = []; for (let i = 0; i < 6; i++) s.tiles.push(D(s.card, 'abs', { left: 34 + (i % 3) * 228, top: 110 + Math.floor(i / 3) * 250, width: 206, height: 228, borderRadius: '16px', background: '#fff', boxShadow: 'inset 0 0 0 1.5px #E6EAF2', padding: '12px' },
      `<div style="height:120px;border-radius:10px;background:linear-gradient(135deg,var(--tint),rgba(var(--acc2RGB),${.15 + (i % 3) * .12}))"></div><div class="ln" style="width:70%;margin-top:14px"></div><div class="ln" style="width:45%;margin-top:10px"></div><div class="row" style="margin-top:12px;gap:0">${av(person(i), 28, i)}${av(person(i + 2), 28, i + 2)}</div>`));
    s.panel = D(s.card, 'abs', { top: 100, width: 340, borderRadius: '20px', background: '#F7F9FD', boxShadow: 'inset 0 0 0 1.5px #E6EAF2', padding: '24px' },
      `<div style="font-size:26px;font-weight:700;letter-spacing:-.02em">${m.panelTitle}</div>` + m.meta.map(r => `<div class="row" style="justify-content:space-between;margin-top:16px;font-size:18px"><span style="color:var(--mut);font-weight:500">${r[0]}</span><b>${r[1]}</b></div>`).join('') +
      `<div class="btn" style="margin-top:34px;height:60px;border-radius:16px;background:var(--ink);color:#fff;font-size:22px;font-weight:600;display:flex;align-items:center;justify-content:center"></div>`);
    s.btn = s.panel.querySelector('.btn'); s.btn.textContent = m.button;
    s.hand = mkHand(c);
    s.rip = D(c, 'ctr', { left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(var(--accRGB),.7)' });
  },
  layout(t, s) { // returns the card box for time t (the morph keyframes)
    const a = eio(P(t, .9, 1.3)), b = eio(P(t, 1.3, 1.75));
    const w = L(L(560, 1000, a), 1100, b), h = L(L(560, 600, a), 640, b);
    return { w, h, x: 960 - w / 2, y: 585 - h / 2, r: L(L(90, 34, a), 30, b), a, b };
  },
  measure(s, sc) { sc.update(3.6, s, sc.cam, sc, true); const p = centerOf(s.btn); s.tx = p.x; s.ty = p.y; },
  update(t, s, c, sc, noCam) {
    S(c, { s: noCam ? 1 : L(1, 1.05, t / 4) });
    const k = sc.layout(t, s), pop = bo(P(t, 0, .35));
    Object.assign(s.card.style, { left: k.x + 'px', top: k.y + 'px', width: k.w + 'px', height: k.h + 'px', borderRadius: k.r + 'px', transform: `scale(${L(.6, 1, pop).toFixed(3)})`, opacity: C(t * 6).toFixed(3) });
    s.fill.style.opacity = (1 - k.b).toFixed(3);
    s.fill.style.filter = `brightness(${L(1, 1.12, k.a).toFixed(3)})`;
    blurIn(s.h, t, .1, .5, { y: 20 });
    if (t > .85) S(s.h, { o: 1 - P(t, .85, 1.1), b: P(t, .85, 1.1) * 16, s: L(1, .9, P(t, .85, 1.1)) });
    // folder tab grows from the card's top-left, then widens into the header bar
    const ta = P(t, .95, 1.2);
    const tw = L(300, k.w, k.b), th = L(64, 0, k.b);
    Object.assign(s.tab.style, { left: (k.x + L(46, 0, k.b)) + 'px', top: (k.y - th + 2) + 'px', width: tw + 'px', height: th + 'px', background: 'var(--acc2)', opacity: (ta * (1 - k.b)).toFixed(3) });
    s.hdr.style.opacity = P(t, 1.45, 1.75).toFixed(3);
    s.h.style.display = t > 1.2 ? 'none' : 'block';
    s.tiles.forEach((e, i) => { const q = P(t, 1.6 + i * .06, 1.9 + i * .06); S(e, { y: (1 - eo(q)) * 40, o: q * 2, s: L(.9, 1, eo(q)) }); });
    const pp = eo(P(t, 2.0, 2.4)); s.panel.style.left = (k.w - 24 - 340 + (1 - pp) * 420) + 'px'; s.panel.style.height = (k.h - 124) + 'px'; s.panel.style.opacity = C(pp * 3).toFixed(3);
    const done = t >= 2.98 || noCam;
    s.btn.textContent = done && !noCam ? B.morph.done : B.morph.button;
    s.btn.style.background = done && !noCam ? '#19B36B' : 'var(--ink)';
    s.btn.style.transform = `scale(${(done && !noCam ? L(.9, 1, bo(P(t, 2.98, 3.2))) : 1).toFixed(3)})`;
    if (noCam || s.tx == null) return;
    moveHand(s.hand, t, s.tx, s.ty, 2.3, 2.95);
    const ri = P(t, 2.95, 3.5); s.rip.style.left = s.tx + 'px'; s.rip.style.top = s.ty + 'px'; S(s.rip, { s: L(.2, 1.8, eo(ri)), o: ri > 0 ? 1 - ri : 0 });
  } });

/* ===== rackfocus: laptop whips in, a request types and sends, camera pushes onto the button as the screen falls out of focus ===== */
shot('rackfocus', { hero: 2.7, len: 3.0, tout: 'fade',
  sfx: [[0.0, 'whoosh'], [0.5, 'type16'], [1.0, 'whoosh_s'], [1.55, 'click'], [1.6, 'pop'], [1.7, 'swoop'], [2.78, 'whoosh']],
  build(c, s) {
    const rk = B.rack, ib = B.inbox;
    s.rays = D(c, 'rays', { height: 1080, opacity: .5 });
    s.lap = D(c, 'abs', { left: 360, top: 130, width: 1200, height: 860, perspective: '2400px' });
    s.scr = D(s.lap, 'abs', { left: 50, top: 0, width: 1100, height: 690, transformOrigin: '50% 100%' });
    const bez = D(s.scr, 'abs', { inset: 0, borderRadius: '32px', background: '#1a1c22', padding: '20px', boxShadow: '0 70px 130px -30px rgba(20,40,110,.55)' });
    const app = D(bez, '', { width: '100%', height: '100%', borderRadius: '14px', background: '#fff', overflow: 'hidden', position: 'relative' });
    s.base = D(s.lap, 'abs', { left: -10, top: 690, width: 1220, height: 50, transformOrigin: '50% 0', borderRadius: '0 0 34px 34px', background: 'linear-gradient(180deg,#d9dde6,#aeb4c2)' });
    s.soft = D(app, 'abs', { inset: 0 });                         // everything that goes out of focus
    if (rk.screenshot) s.soft.innerHTML = `<img src="${rk.screenshot}" style="width:100%;height:100%;object-fit:cover;object-position:top left">`;
    else {
      D(s.soft, 'abs', { left: 0, top: 0, bottom: 0, width: 190, background: '#F6F8FC', padding: '22px 14px' }, ib.nav.map((x, i) => `<div style="font-size:15px;font-weight:600;padding:10px 12px;border-radius:8px;${i == 1 ? 'background:var(--tint);color:var(--acc)' : 'color:#6B7180'}">${x}</div>`).join(''));
      D(s.soft, 'abs', { left: 220, top: 130, right: 30 }, ib.items.slice(0, 5).map((it, i) => `<div class="row" style="padding:13px 14px;margin-bottom:9px;border-radius:12px;box-shadow:inset 0 0 0 1px #EDF0F6">${av(person(i), 36, i)}<div style="flex:1;font-size:17px;font-weight:600">${it[0]}</div><div class="ln" style="width:90px"></div></div>`).join(''));
    }
    s.bar = D(s.soft, 'abs row', { left: 220, top: 34, right: 230, height: 70, borderRadius: '16px', background: '#fff', boxShadow: '0 10px 30px -10px rgba(30,50,110,.3), inset 0 0 0 1.5px #E3E8F3', padding: '0 20px', fontSize: '22px', fontWeight: 500 });
    s.req = typed(s.bar, '', {}, [{ t: rk.request }]);
    s.btn = D(app, 'abs', { right: 30, top: 34, width: 186, height: 70, borderRadius: '16px', background: 'var(--acc)', color: '#fff', fontSize: '21px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px -10px rgba(var(--accRGB),.7)' });
    s.btn.textContent = rk.button;
    s.fg = D(c, 'ctr pill', { left: 600, top: 930, fontSize: '40px', padding: '24px 40px' }, `${av(person(2), 70, 2)}${rk.request}`); // out-of-focus foreground element
    s.hand = mkHand(c);
  },
  measure(s, sc) { sc.update(1.5, s, sc.cam, sc, true); const p = centerOf(s.btn); s.bx = p.x; s.by = p.y; s.focus = { x: s.bx + (960 - s.bx) * .6, y: s.by + (540 - s.by) * .6 }; },
  update(t, s, c, sc, noCam) {
    const push = noCam ? 0 : eio(P(t, 1.65, 2.6));
    if (!noCam && s.bx != null) { c.style.transformOrigin = `${s.bx}px ${s.by}px`; S(c, { s: L(1, 2.0, push), x: (960 - s.bx) * .6 * push, y: (540 - s.by) * .6 * push }); }
    else S(c, {});
    S(s.rays, { o: .5 * eo(P(t, 0, .4)) });
    const lx = tt => L(1300, 0, eo(P(tt, 0, .55)));
    const ry = L(-50, -10, eo(P(t, 0, .7))) + Math.sin(t * 1.1);
    S(s.lap, { x: lx(t), bx: Math.min(80, vel(lx, t) * .4), o: C(t * 8) });
    s.scr.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(7deg)`;
    s.base.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(64deg)`;
    typeP(s.req, P(t, .5, 1.35), t, t < 1.55);
    const sent = t >= 1.57 && !noCam;
    s.btn.textContent = sent ? B.rack.done : B.rack.button;
    s.btn.style.background = sent ? '#19B36B' : 'var(--acc)';
    s.btn.style.transform = `scale(${(t > 1.5 && t < 1.75 ? 1 - .1 * Math.sin(P(t, 1.5, 1.75) * Math.PI) : 1).toFixed(3)})`;
    s.btn.style.boxShadow = sent ? `0 0 0 ${(push * 14).toFixed(1)}px rgba(25,179,107,.18), 0 14px 30px -10px rgba(25,179,107,.6)` : '0 14px 30px -10px rgba(var(--accRGB),.7)';
    s.soft.style.filter = push > .01 ? `blur(${(push * 7).toFixed(2)}px)` : 'none';                  // depth of field: background falls away
    s.base.style.filter = push > .01 ? `blur(${(push * 10).toFixed(2)}px)` : 'none';
    const fp = P(t, 1.7, 3.0); S(s.fg, { x: L(-200, 900, fp), o: fp > 0 ? Math.min(1, fp * 4) * .9 : 0, b: 26, s: 1.6 });    // foreground blur sells the depth
    if (noCam || s.bx == null) return;
    moveHand(s.hand, t, s.bx - 20, s.by + 10, .95, 1.5);
    if (t > 1.9) s.hand.style.opacity = (1 - P(t, 1.9, 2.2)).toFixed(3);
  } });

/* ===== dive: a laptop rises, the camera flies into its screen until the screen IS the frame (no cut), then the headline lands ===== */
shot('dive', { hero: 2.9, len: 3.2, tin: 'fade', tout: 'whip',
  sfx: [[0.0, 'whoosh_s'], [0.55, 'shimmer'], [0.95, 'whoosh'], [1.85, 'hit_s'], [2.0, 'whoosh_s'], [2.98, 'whoosh']],
  build(c, s) {
    const dv = B.dive, SW = 880, SH = 495, sc0 = SW / 1920;
    s.k = 1920 / SW;
    D(c, 'blob', { width: 1100, height: 600, left: 410, top: 600 });
    s.lap = D(c, 'abs', { left: 960 - SW / 2 - 22, top: 540 - SH / 2 - 22, width: SW + 44, height: SH + 120 });
    s.bez = D(s.lap, 'abs', { left: 0, top: 0, width: SW + 44, height: SH + 44, borderRadius: '30px', background: '#1a1c22', boxShadow: '0 60px 120px -30px rgba(20,40,110,.55)' });
    s.base = D(s.lap, 'abs', { left: -60, top: SH + 44, width: SW + 164, height: 30, borderRadius: '0 0 26px 26px', background: 'linear-gradient(180deg,#d9dde6,#aeb4c2)' });
    s.scrn = D(c, 'abs', { left: 960 - SW / 2, top: 540 - SH / 2, width: SW, height: SH, overflow: 'hidden', borderRadius: '12px' });
    s.world = D(s.scrn, 'abs', { left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${sc0})` });   // authored at full-frame size
    s.bg = D(s.world, 'abs', { inset: 0, background: dv.screenshot ? `url('${dv.screenshot}') top left/cover` : 'radial-gradient(ellipse at 30% 20%,var(--acc2) 0%,var(--acc) 45%,var(--acc3) 100%)' });
    s.tintL = D(s.world, 'abs', { inset: 0, background: 'linear-gradient(180deg,rgba(var(--accRGB),.55),rgba(var(--accRGB),.8))', opacity: 0 });
    const pos = [[330, 260], [1600, 300], [420, 820], [1520, 830]];
    s.cards = B.channels.concat(B.channels).slice(0, 4).map((g, i) => D(s.world, 'ctr card row', { left: pos[i][0], top: pos[i][1], padding: '20px 30px 20px 20px', borderRadius: '26px', gap: '16px' }, `<div class="glyph" style="width:74px;height:74px;font-size:34px;background:${g[1]}">${g[0]}</div><div style="font-size:32px;font-weight:600">${g[2]}</div>`));
    s.glass = D(s.world, 'ctr', { left: 960, top: 540, width: 1180, height: 380, borderRadius: '44px', background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(22px)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.4), 0 40px 80px -30px rgba(0,0,40,.4)' });
    s.h1 = D(s.world, 'ctr head', { left: 960, top: 488, fontSize: '112px', color: '#fff' }, dv.l1);
    s.h2 = D(s.world, 'ctr head', { left: 960, top: 600, fontSize: '112px', color: 'var(--acc4)' }, dv.l2);
    s.grid = D(s.world, 'abs', { inset: 0, background: 'linear-gradient(90deg,transparent 559px,rgba(255,255,255,.28) 559px 561px,transparent 561px 1359px,rgba(255,255,255,.28) 1359px 1361px,transparent 1361px),linear-gradient(0deg,transparent 179px,rgba(255,255,255,.28) 179px 181px,transparent 181px 899px,rgba(255,255,255,.28) 899px 901px,transparent 901px)', opacity: 0 });
  },
  update(t, s, c) {
    const rise = eo(P(t, 0, .6)), dive = eio(P(t, .95, 1.9));
    S(c, { s: L(1, s.k, dive) * L(.9, 1, rise), y: (1 - rise) * 160 });
    s.lap.style.opacity = C(rise * 2).toFixed(3); s.scrn.style.opacity = C(rise * 2).toFixed(3);
    s.lap.style.filter = dive > .01 ? `blur(${(dive * 8).toFixed(1)}px)` : 'none';
    s.scrn.style.borderRadius = L(12, 0, P(t, 1.6, 1.9)) + 'px';
    s.cards.forEach((e, i) => { const a = P(t, .4 + i * .1, .75 + i * .1), out = eio(P(t, 1.9, 2.5)), dx = (i % 2 ? 1 : -1) * 260 * out, dy = (i < 2 ? -1 : 1) * 120 * out;
      S(e, { x: dx, y: dy + Math.sin(t * 1.6 + i) * 10 + (1 - eo(a)) * 60, o: C(a * 2), s: L(.8, 1, bo(a)), r: (i % 2 ? 3 : -3) * out }); });
    const settle = P(t, 1.9, 2.4);
    if (B.dive.screenshot) { s.bg.style.filter = `blur(${(eo(settle) * 14).toFixed(1)}px)`; s.tintL.style.opacity = (eo(settle) * .9).toFixed(3); }
    S(s.glass, { o: eo(settle), s: L(.92, 1, eo(settle)) });
    s.grid.style.opacity = (eo(settle) * .8).toFixed(3);
    blurIn(s.h1, t, 2.0, 2.4, { y: 26 }); blurIn(s.h2, t, 2.15, 2.55, { y: 26 });
  } });

/* ===== journey (new): a visitor's comet-trail path through the site's pages, then it vanishes ===== */
shot('journey', { hero: 2.75, len: 3.2, tin: 'whip', tout: 'whip',
  sfx: [[0.05, 'pops3'], [0.35, 'whoosh_s'], [0.6, 'pop'], [0.9, 'whoosh_s'], [1.1, 'pop'], [1.15, 'ticks8'], [1.7, 'whoosh_s'], [1.9, 'pop'], [2.15, 'whoosh_s'], [2.4, 'down'], [2.5, 'stamp'], [2.95, 'whoosh']],
  build(c, s) {
    const j = B.journey;
    D(c, 'blob', { width: 1000, height: 600, left: -250, top: 600 });
    D(c, 'blob', { width: 900, height: 600, left: 1300, top: -260, opacity: .7 });
    s.h1 = D(c, 'ctr head', { left: 960, top: 150, fontSize: '100px' }, j.l1);
    s.h2 = D(c, 'ctr head acc', { left: 960, top: 255, fontSize: '100px' }, j.l2);
    s.P = [[-140, 820], [420, 640], [960, 600], [1500, 640], [2080, 470]];      // path waypoints (stage px)
    s.T = [[.3, .6], [.62, 1.0], [1.65, 1.95], [2.15, 2.55]];                    // [leave, arrive] for each leg
    s.pages = j.pages.map((pg, i) => {
      const [x, y] = s.P[i + 1], pricing = i === 1;
      const body = pricing
        ? `<div class="row" style="gap:10px;margin-top:16px">${[0, 1, 2].map(k => `<div style="flex:1;height:118px;border-radius:12px;padding:10px;background:${k === 1 ? 'linear-gradient(180deg,var(--acc2),var(--acc))' : '#F3F5FA'}"><div class="ln" style="width:60%;${k === 1 ? 'background:rgba(255,255,255,.6)' : ''}"></div><div style="font-size:26px;font-weight:700;margin-top:10px;color:${k === 1 ? '#fff' : 'var(--ink)'}">$${[49, 149, 399][k]}</div></div>`).join('')}</div>`
        : `<div style="height:78px;border-radius:12px;margin-top:16px;background:linear-gradient(135deg,var(--tint),rgba(var(--acc2RGB),.25))"></div><div class="ln" style="width:80%;margin-top:14px"></div><div class="ln" style="width:55%;margin-top:10px"></div>`;
      const e = D(c, 'ctr card', { left: x, top: y + 70, width: 380, height: 260, padding: '14px 18px', borderRadius: '22px' },
        `<div class="row" style="gap:7px">${['#FF5F57', '#FEBC2E', '#28C840'].map(cl => `<span style="width:11px;height:11px;border-radius:50%;background:${cl};display:block"></span>`).join('')}<span style="margin-left:10px;font-size:15px;font-weight:600;color:var(--mut);background:#F3F5FA;border-radius:999px;padding:4px 12px">${pg[0]}</span></div>${body}`);
      const lab = D(c, 'ctr', { left: x, top: y + 230, fontSize: '22px', fontWeight: 600, color: 'var(--mut)' }, pg[1]);
      return { e, lab, i };
    });
    s.timer = D(c, 'ctr pill num', { left: 960, top: 470, fontSize: '22px', fontWeight: 600, padding: '9px 18px' }, `<span style="width:10px;height:10px;border-radius:50%;background:var(--red);display:inline-block"></span><span class="tv">0m 00s</span>`);
    s.tv = s.timer.querySelector('.tv');
    s.ghosts = []; for (let k = 7; k >= 1; k--) s.ghosts.push({ k, e: D(c, 'ctr', { left: 0, top: 0, width: 46, height: 46, borderRadius: '50%', background: 'rgba(var(--accRGB),.9)' }) });
    s.dot = D(c, 'ctr', { left: 0, top: 0 }, `<div class="av" style="width:64px;height:64px;font-size:30px;background:linear-gradient(135deg,#B4BBC9,#7C8496);box-shadow:0 0 0 8px rgba(var(--accRGB),.25),0 0 40px rgba(var(--accRGB),.8)">?</div>`);
    s.puff = D(c, 'ctr', { left: 1820, top: 520, width: 120, height: 120, borderRadius: '50%', border: '4px solid rgba(var(--accRGB),.6)' });
    s.exit = D(c, 'ctr badge', { left: 1600, top: 430, fontSize: '26px', padding: '10px 22px', whiteSpace: 'nowrap', boxShadow: '0 20px 40px -10px rgba(255,77,79,.6)' }, B.journey.exit);
  },
  pos(t, s) { // visitor position: dwell on each page, eased legs with an arc
    let i = 0; while (i < s.T.length && t > s.T[i][1]) i++;
    if (i >= s.T.length) return { x: s.P[4][0], y: s.P[4][1], leg: 4 };
    const [a, b] = s.T[i], p = eio(P(t, a, b)), A = s.P[i], Bp = s.P[i + 1];
    return { x: L(A[0], Bp[0], p), y: L(A[1], Bp[1], p) - Math.sin(p * Math.PI) * 90, leg: i + p };
  },
  update(t, s, c, sc) {
    S(c, { s: L(1, 1.05, t / 3.2), x: L(40, -40, eio(C(t / 3.2))) });
    blurIn(s.h1, t, .05, .5, { y: 24 });
    S(s.h2, { o: 0 }); if (t > 2.35) blurIn(s.h2, t, 2.35, 2.75, { y: 24, blur: 30 });
    s.pages.forEach(pg => {
      const a = P(t, .02 + pg.i * .1, .4 + pg.i * .1), here = sc.pos(t, s), on = Math.abs(here.leg - (pg.i + 1)) < .02 && t < 2.2;
      const vis = t > s.T[pg.i][1] - .02;
      S(pg.e, { y: (1 - eo(a)) * 80 + Math.sin(t * 1.4 + pg.i) * 5, o: C(a * 3) * (t > 2.4 ? L(1, .45, P(t, 2.4, 2.8)) : 1), s: L(.85, 1, bo(a)) * (on ? 1.05 : 1), r: (pg.i - 1) * 3 });
      pg.e.style.boxShadow = vis && t < 2.4 ? '0 0 0 4px var(--acc), 0 30px 80px -20px rgba(var(--accRGB),.45)' : '';
      S(pg.lab, { o: C(a * 3) * (vis ? 1 : .6) });
      pg.lab.style.color = vis && t < 2.4 ? 'var(--acc)' : 'var(--mut)';
    });
    const tp = P(t, 1.0, 1.65); S(s.timer, { s: bo(P(t, 1.0, 1.25)), o: tp > 0 && t < 2.0 ? 1 : 0, y: Math.sin(t * 3) * 3 });
    const secs = Math.round((B.journey.timer[0] * 60 + B.journey.timer[1]) * eo(tp)); s.tv.textContent = `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}s`;
    const gone = P(t, 2.35, 2.55), here = sc.pos(t, s);
    S(s.dot, { x: here.x, y: here.y, s: L(1, 0, eo(gone)) * L(.4, 1, bo(P(t, .2, .45))), o: P(t, .2, .3) * (1 - gone) });
    for (const g of s.ghosts) { const q = sc.pos(t - g.k * .03, s), sp = Math.hypot(q.x - here.x, q.y - here.y); S(g.e, { x: q.x, y: q.y, s: 1 - g.k * .09, o: sp > 4 ? (1 - g.k / 8) * .45 * (1 - gone) : 0, b: g.k * 2 }); }
    const pf = P(t, 2.4, 2.9); s.puff.style.left = s.P[4][0] - 260 + 'px'; S(s.puff, { s: L(.2, 2.2, eo(pf)), o: pf > 0 ? 1 - pf : 0 });
    const ex = P(t, 2.5, 2.75); S(s.exit, { s: L(2.2, 1, bo(ex)), r: L(-18, -5, eo(ex)), o: C(ex * 4) });
  } });

/* ===== unmask (new): a scan line sweeps an anonymous visitor card; the text decodes into a named lead ===== */
shot('unmask', { hero: 3.1, len: 3.6, tin: 'up', tout: 'whip',
  sfx: [[0.05, 'whoosh_s'], [0.15, 'type12'], [0.75, 'pop'], [1.0, 'swoop'], [1.05, 'ticks12'], [1.8, 'hit_s'], [1.85, 'pop'], [2.1, 'pops4'], [3.38, 'whoosh']],
  build(c, s) {
    const u = B.unmask;
    D(c, 'blob', { width: 1100, height: 650, left: 410, top: 380 });
    s.dots = D(c, 'abs', { inset: 0, backgroundImage: 'radial-gradient(rgba(var(--accRGB),.22) 1.6px,transparent 1.8px)', backgroundSize: '36px 36px', WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 60%,#000 20%,transparent 75%)' });
    s.h1 = typed(c, 'ctr head', { left: 960, top: 150, fontSize: '100px' }, [{ t: u.l1 }], false);
    s.h2 = typed(c, 'ctr head acc', { left: 960, top: 255, fontSize: '100px' }, [{ t: u.l2 }]);
    // ghost cards behind, out of focus, for depth
    s.ghost = [[-560, 30, -6], [560, 50, 6]].map(([dx, dy, r], i) => D(c, 'ctr card row', { left: 960 + dx, top: 640 + dy, width: 520, height: 200, padding: '0 30px', gap: '22px', borderRadius: '28px' },
      `${av(i ? 'MR' : 'JP', 100, i + 1)}<div style="flex:1"><div class="ln" style="width:80%;height:22px"></div><div class="ln" style="width:55%;margin-top:14px"></div></div>`)).map((e, i) => ({ e, i, r: [-6, 6][i] }));
    s.card = D(c, 'ctr card', { left: 960, top: 640, width: 940, height: 300, borderRadius: '34px', overflow: 'hidden' });
    s.avA = D(s.card, 'abs', { left: 50, top: 75 }, `<div class="av" style="width:150px;height:150px;font-size:64px;background:linear-gradient(135deg,#C9CED9,#8E96A8)">?</div>`);
    s.avB = D(s.card, 'abs', { left: 50, top: 75 }, av(person(0), 150, 0));
    s.name = D(s.card, 'abs', { left: 240, top: 70, fontSize: '58px', fontWeight: 700, letterSpacing: '-.035em', whiteSpace: 'nowrap' });
    s.role = D(s.card, 'abs', { left: 242, top: 148, fontSize: '28px', fontWeight: 500, color: 'var(--mut)', whiteSpace: 'nowrap' });
    s.red1 = D(s.card, 'abs ln', { left: 240, top: 160, width: 420, height: 22 });
    s.red2 = D(s.card, 'abs ln', { left: 240, top: 204, width: 300, height: 18 });
    s.ip = D(s.card, 'abs', { left: 242, top: 232, fontSize: '20px', fontWeight: 600, color: '#A4ABBA', fontFamily: 'monospace' }, u.ip);
    s.st = D(s.card, 'abs pill', { right: 34, top: 30, fontSize: '18px', fontWeight: 700, padding: '8px 16px', boxShadow: 'none' });
    s.scan = D(s.card, 'abs', { top: -20, width: 6, height: 340, borderRadius: '3px', background: 'var(--acc)', boxShadow: '0 0 24px 6px rgba(var(--accRGB),.7), 0 0 90px 30px rgba(var(--accRGB),.25)' });
    s.sweep = D(s.card, 'abs', { top: 0, height: 300, width: 260, background: 'linear-gradient(90deg,rgba(var(--accRGB),0),rgba(var(--accRGB),.14))' });
    const cp = [[520, 470], [1400, 470], [560, 830], [1380, 830]];
    s.chips = u.chips.slice(0, 4).map((x, i) => D(c, 'ctr pill', { left: cp[i][0], top: cp[i][1], fontSize: '22px', fontWeight: 600, padding: '12px 20px' }, `<span style="width:10px;height:10px;border-radius:50%;background:${i ? 'var(--acc)' : '#19B36B'};display:inline-block"></span>${x}`));
  },
  // scramble text that resolves left to right as the scan passes: pure function of t
  decode(str, t, a, b) {
    const G = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789#$%&@';
    let out = ''; const n = str.length;
    for (let i = 0; i < n; i++) {
      const at = L(a, b, i / n), ch = str[i];
      if (ch === ' ' || t >= at) out += ch;
      else if (t >= a - .25) out += G[Math.floor(hash(i * 13 + Math.floor(t * 28)) * G.length)];
      else out += ' ';
    }
    return out;
  },
  update(t, s, c, sc) {
    const u = B.unmask;
    S(c, { s: L(1, 1.06, eio(C(t / 3.6))) });
    typeP(s.h1, P(t, .12, .55), t, false); typeP(s.h2, P(t, 1.75, 2.15), t);
    s.h2.el.style.visibility = t < 1.75 ? 'hidden' : 'visible';
    S(s.dots, { o: eo(P(t, 0, .5)), y: -t * 12 });
    const cp = P(t, .05, .5); S(s.card, { y: (1 - eo(cp)) * 120 + Math.sin(t * 1.3) * 4, s: L(.88, 1, eo(cp)) * (1 + .03 * Math.sin(P(t, 1.75, 2.05) * Math.PI)), o: C(cp * 3), b: (1 - eo(cp)) * 12 });
    s.ghost.forEach(g => { const q = P(t, .25 + g.i * .1, .7 + g.i * .1); S(g.e, { s: .82, o: q * .75, b: 7, r: g.r, x: (g.i ? 1 : -1) * (1 - eo(q)) * 80, y: Math.sin(t * 1.2 + g.i * 2) * 8 }); g.e.style.filter += ` grayscale(${(1 - P(t, 1.9 + g.i * .15, 2.2 + g.i * .15)).toFixed(2)})`; });
    // scan sweep 1.0 → 1.8 across the card
    const sx = L(-40, 980, eio(P(t, 1.0, 1.8))), scanOn = t > .95 && t < 1.9;
    s.scan.style.left = sx + 'px'; s.scan.style.opacity = scanOn ? 1 : 0;
    s.sweep.style.left = (sx - 260) + 'px'; s.sweep.style.opacity = scanOn ? 1 : 0;
    const passAv = P(t, 1.05, 1.25);
    s.avA.style.opacity = (1 - passAv).toFixed(3); s.avB.style.opacity = passAv.toFixed(3);
    S(s.avB, { s: L(.85, 1, bo(passAv)) });
    const pre = t < 1.05;
    s.name.textContent = pre ? u.anon.slice(0, Math.round(u.anon.length * eo(P(t, .15, .7)))) : sc.decode(u.name, t, 1.15, 1.55);
    s.name.style.color = pre ? '#A4ABBA' : 'var(--ink)';
    s.role.textContent = pre ? '' : sc.decode(`${u.title} · ${u.company}`, t, 1.3, 1.75);
    const rr = P(t, 1.2, 1.5); s.red1.style.opacity = s.red2.style.opacity = (1 - rr).toFixed(3); s.ip.style.opacity = (1 - P(t, 1.4, 1.6)).toFixed(3);
    const done = t >= 1.8;
    s.st.textContent = done ? u.after : u.before;
    s.st.style.background = done ? '#E8FBF2' : '#FFECEC'; s.st.style.color = done ? '#139B6E' : '#D63C3C';
    S(s.st, { s: done ? L(1.4, 1, bo(P(t, 1.8, 2.05))) : bo(P(t, .5, .8)), o: P(t, .5, .6) });
    s.chips.forEach((e, i) => { const d = 2.05 + i * .1, k = P(t, d, d + .35); S(e, { s: L(.4, 1, bo(k)), o: C(k * 4), x: (i % 2 ? -1 : 1) * (1 - eo(k)) * 160 + Math.sin(t * 1.5 + i) * 6, y: (i < 2 ? 1 : -1) * (1 - eo(k)) * 90 + Math.cos(t * 1.3 + i) * 5 }); });
  } });

/* ===== monitor (new, ref C): dark blue→violet stage, desktop monitor with a live chart, ✦ keywords pop around it,
 *       big words flank the screen, then the scene pulls back into an iridescent frame and collapses into a line ===== */
shot('monitor', { hero: 2.3, len: 3.5, tin: 'up', bg: 'linear-gradient(135deg,#F4E9FF,#E3E6FF 50%,#DCEBFF)',
  sfx: [[0.0, 'boom'], [0.15, 'swell'], [0.5, 'ticks12'], [0.85, 'shimmer'], [0.9, 'pops3'], [1.85, 'whoosh_s'], [1.95, 'hit_s'], [2.5, 'whoosh'], [3.0, 'swoop'], [3.3, 'whoosh']],
  build(c, s) {
    const m = B.monitor;
    D(c, 'blob', { width: 900, height: 700, left: -200, top: 500, background: 'radial-gradient(circle,rgba(243,184,255,1) 0%,rgba(243,184,255,0) 70%)' });
    D(c, 'blob', { width: 900, height: 700, left: 1250, top: -200, background: 'radial-gradient(circle,rgba(159,216,255,1) 0%,rgba(159,216,255,0) 70%)' });
    s.frame = D(c, 'ctr', { left: 960, top: 540, width: 1920, height: 1080, background: 'linear-gradient(135deg,#F3B8FF,#C9B8FF 45%,#9FD8FF)', boxShadow: '0 40px 120px -20px rgba(123,77,255,.55)' });
    s.world = D(s.frame, 'abs', { inset: 0, overflow: 'hidden', background: `radial-gradient(ellipse 70% 60% at 50% 88%,var(--acc) 0%,${m.violet} 38%,#120c4a 72%,#060825 100%)` });
    s.wcam = D(s.world, 'abs', { inset: 0, transformOrigin: '960px 540px' });
    D(s.wcam, 'abs', { left: 1100, top: -200, width: 1100, height: 900, borderRadius: '50%', filter: 'blur(120px)', background: `radial-gradient(circle,${m.violet} 0%,rgba(0,0,0,0) 70%)`, opacity: .8 });
    s.floor = D(s.wcam, 'abs', { left: -100, top: 905, width: 2120, height: 200, background: 'linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.35))', boxShadow: 'inset 0 2px 0 rgba(160,190,255,.5)' });
    D(s.floor, 'abs', { inset: 0, opacity: .35, background: 'repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 3px,transparent 3px 14px)', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent 70%)' });
    // monitor
    s.mon = D(s.wcam, 'abs', { left: 960 - 470, top: 150, width: 940, height: 760 });
    s.glow = D(s.mon, 'abs', { left: -120, top: -80, width: 1180, height: 760, borderRadius: '50%', filter: 'blur(90px)', background: 'radial-gradient(circle,rgba(var(--acc2RGB),.75) 0%,rgba(0,0,0,0) 65%)' });
    D(s.mon, 'abs', { left: 400, top: 590, width: 140, height: 200, background: 'linear-gradient(90deg,#0d1a4a,#1c3480 50%,#0d1a4a)' });
    D(s.mon, 'abs', { left: 300, top: 740, width: 340, height: 22, borderRadius: '10px 10px 4px 4px', background: 'linear-gradient(180deg,#2a3f8f,#0d1a4a)' });
    const bez = D(s.mon, 'abs', { left: 0, top: 0, width: 940, height: 600, borderRadius: '26px', background: '#070b22', padding: '22px', boxShadow: '0 0 0 2px rgba(140,170,255,.35), 0 50px 120px -20px rgba(0,0,0,.7), 0 0 120px rgba(var(--accRGB),.55)' });
    const scr = D(bez, '', { position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(160deg,#3a5cff,#5b3fe0 60%,#3a2bb8)' });
    s.panel = D(scr, 'abs', { left: 60, top: 50, width: 776, height: 456, borderRadius: '20px', background: 'linear-gradient(180deg,#fff,#F1EEFF)', padding: '26px 30px', boxShadow: '0 30px 60px -20px rgba(0,0,40,.6)' },
      `<div class="row" style="justify-content:space-between"><b style="font-size:24px;letter-spacing:-.02em">${m.panel}</b><span class="tag" style="background:#E8FBF2;color:#139B6E">● Live</span></div>`);
    const PW = 716, PH = 300, pts = [];
    for (let i = 0; i <= 40; i++) { const x = i / 40; pts.push([x * PW, PH - (40 + 210 * (x * x * .55 + x * .25) + 26 * Math.sin(x * 9) * (1 - x * .5))]); }
    s.pts = pts; s.PW = PW;
    const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
    s.panel.insertAdjacentHTML('beforeend', `<svg class="abs" style="left:30px;top:110px;overflow:visible" width="${PW}" height="${PH}"><defs><linearGradient id="mfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9B7BFF" stop-opacity=".45"/><stop offset="1" stop-color="#9B7BFF" stop-opacity="0"/></linearGradient><clipPath id="mclip"><rect class="mcr" x="0" y="-20" width="0" height="${PH + 40}"/></clipPath></defs>
      ${[1, 2, 3].map(k => `<line x1="0" x2="${PW}" y1="${k * PH / 4}" y2="${k * PH / 4}" stroke="#E6E2F5" stroke-width="1.5"/>`).join('')}
      <g clip-path="url(#mclip)"><path d="${d} L${PW} ${PH} L0 ${PH}Z" fill="url(#mfill)"/><path d="${d}" fill="none" stroke="#7B4DFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`);
    s.clip = s.panel.querySelector('.mcr');
    s.head = D(s.panel, 'ctr', { left: 0, top: 0, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '5px solid var(--acc)', boxShadow: '0 0 0 8px rgba(var(--accRGB),.2)' });
    s.tip = D(s.panel, 'ctr num', { left: 0, top: 0, background: 'var(--acc)', color: '#fff', fontSize: '18px', fontWeight: 700, padding: '6px 12px', borderRadius: '10px', boxShadow: '0 10px 20px -6px rgba(var(--accRGB),.7)', whiteSpace: 'nowrap' });
    // ✦ keywords and flanking words
    const kp = [[300, 330], [1560, 250], [1540, 760]];
    s.kw = m.keywords.slice(0, 3).map((w, i) => D(s.wcam, 'ctr row', { left: kp[i][0], top: kp[i][1], gap: '14px', color: '#fff', fontSize: '58px', fontWeight: 500, letterSpacing: '-.03em', whiteSpace: 'nowrap', textShadow: '0 0 30px rgba(180,200,255,.6)' }, `<span class="spk" style="display:inline-block;font-size:44px">✦</span>${w}`));
    s.fl = m.flank.map((w, i) => D(s.wcam, 'ctr', { left: 960, top: 470, color: '#fff', fontSize: '92px', fontWeight: 600, letterSpacing: '-.045em', whiteSpace: 'nowrap', textShadow: '0 0 50px rgba(180,200,255,.5)', zIndex: 0 }, w));
    s.mon.style.zIndex = 1;
    s.line = D(c, 'ctr', { left: 960, top: 540, width: 1200, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg,transparent,#7B4DFF 20%,var(--acc) 80%,transparent)', boxShadow: '0 0 24px rgba(123,77,255,.8)' });
  },
  update(t, s, c) {
    const m = B.monitor;
    // camera: rises in from close, settles
    const rise = eo(P(t, 0, 1.0));
    S(s.wcam, { s: L(1.3, 1, rise) * L(1, 1.04, P(t, 1, 2.5)), y: (1 - rise) * 160 });
    S(s.glow, { o: .7 + .3 * Math.sin(t * 3) });
    // chart draws, tooltip rides the head
    const cp = eio(P(t, .35, 2.2)), i = Math.min(40, Math.floor(cp * 40)), f = cp * 40 - i, a = s.pts[i], b = s.pts[Math.min(40, i + 1)];
    const hx = L(a[0], b[0], f), hy = L(a[1], b[1], f);
    s.clip.setAttribute('width', (cp * s.PW + 4).toFixed(1));
    s.head.style.left = (30 + hx) + 'px'; s.head.style.top = (110 + hy) + 'px'; s.tip.style.left = (30 + hx) + 'px'; s.tip.style.top = (110 + hy - 44) + 'px';
    S(s.head, { o: P(t, .35, .45) }); S(s.tip, { o: P(t, .4, .55), s: 1 + .05 * Math.sin(t * 8) });
    s.tip.textContent = Math.round(m.value * cp).toLocaleString('en-US') + ' ' + m.unit;
    // keywords: blur in staggered, sparkle spins, exit before the flank words
    s.kw.forEach((e, k) => { const a0 = .8 + k * .17; blurIn(e, t, a0, a0 + .4, { x: (k ? 40 : -40), blur: 26 });
      const out = P(t, 1.8, 2.0); if (out > 0) S(e, { o: 1 - out, b: out * 20, x: (k ? 1 : -1) * out * 60 });
      e.querySelector('.spk').style.transform = `rotate(${(t * 140 + k * 40).toFixed(1)}deg) scale(${(1 + .15 * Math.sin(t * 6 + k)).toFixed(3)})`; });
    s.fl.forEach((e, k) => { const p = eo(P(t, 1.9, 2.45)), dx = (k ? 1 : -1) * L(0, 705, p); S(e, { x: dx, o: P(t, 1.9, 2.05), bx: (1 - p) * 40 }); });
    // pull back into an iridescent frame, then collapse to a line
    const pb = eio(P(t, 2.5, 3.0)), col = eio(P(t, 2.95, 3.3));
    const sc = L(1, .64, pb), pad = L(0, 24, pb);
    s.world.style.inset = pad + 'px'; s.world.style.borderRadius = L(0, 40, pb) + 'px';
    s.frame.style.borderRadius = L(0, 54, pb) + 'px';
    s.frame.style.transform = `translate(-50%,-50%) scale(${(sc * L(1, 1.12, col)).toFixed(4)},${(sc * L(1, .006, col)).toFixed(4)})`;
    s.frame.style.opacity = col > .97 ? 0 : 1;
    S(s.line, { o: col > .9 ? 1 - P(t, 3.3, 3.5) : 0, s: L(.6, 1.25, P(t, 3.2, 3.5)) });
    S(c, {});
  } });

/* ===== dropzone (new, ref C): pastel glass world; a hand drags the pixel file into the website slot, which goes live ===== */
shot('dropzone', { hero: 2.75, len: 3.2, tin: 'fade', tout: 'zoom', bg: 'linear-gradient(135deg,#F4E9FF,#E3E6FF 50%,#DCEBFF)',
  sfx: [[0.0, 'whoosh_s'], [0.15, 'type10'], [0.55, 'type12'], [0.85, 'whoosh_s'], [1.55, 'click'], [1.6, 'pop'], [1.9, 'hit_s'], [2.0, 'pops3'], [2.98, 'whoosh']],
  build(c, s) {
    const z = B.dropzone;
    D(c, 'blob', { width: 1000, height: 700, left: -250, top: 450, background: 'radial-gradient(circle,rgba(243,184,255,1) 0%,rgba(243,184,255,0) 70%)' });
    D(c, 'blob', { width: 1000, height: 700, left: 1200, top: -250, background: 'radial-gradient(circle,rgba(159,216,255,1) 0%,rgba(159,216,255,0) 70%)' });
    s.h1 = typed(c, 'ctr head', { left: 960, top: 150, fontSize: '96px' }, [{ t: z.l1 }], false);
    s.h2 = typed(c, 'ctr head', { left: 960, top: 250, fontSize: '96px', color: '#7B4DFF' }, [{ t: z.l2 }]);
    s.card = D(c, 'ctr', { left: 960, top: 640, width: 820, height: 420, borderRadius: '34px', background: 'rgba(255,255,255,.62)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.9), 0 40px 90px -30px rgba(90,60,200,.45)', padding: '34px 40px' });
    s.title = typed(s.card, 'row', { fontSize: '34px', fontWeight: 600, letterSpacing: '-.02em', gap: '0' }, [{ t: z.title }]);
    s.title.el.insertAdjacentHTML('afterbegin', `<span style="color:#7B4DFF;font-size:30px;margin-right:16px">✦</span>`);
    D(s.card, '', { fontSize: '15px', fontWeight: 700, letterSpacing: '.14em', color: '#9A93B8', marginTop: '26px' }, z.label);
    s.zone = D(s.card, 'abs', { left: 40, top: 160, width: 740, height: 200, borderRadius: '22px', border: '2.5px dashed #C9C1EA', background: 'rgba(255,255,255,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#8C85AA', fontSize: '22px', fontWeight: 500 },
      `<div style="width:56px;height:56px;border-radius:14px;border:2.5px solid #C9C1EA;display:flex;align-items:center;justify-content:center;font-size:28px">↑</div><div>${z.hint}</div>`);
    s.file = D(c, 'ctr row', { left: 960, top: 700, width: 600, height: 128, borderRadius: '24px', background: 'rgba(255,255,255,.95)', padding: '0 34px', gap: '24px', boxShadow: 'inset 0 0 0 2px rgba(123,77,255,.0), 0 40px 70px -24px rgba(70,40,170,.5)' },
      `<div style="width:62px;height:76px;border-radius:10px;border:3px solid #3a3360;position:relative;flex:none"><div style="position:absolute;right:-3px;top:-3px;width:22px;height:22px;background:#EFEAFF;border-left:3px solid #3a3360;border-bottom:3px solid #3a3360;border-radius:0 8px 0 6px"></div><div style="position:absolute;left:10px;bottom:12px;font-size:15px;font-weight:800;color:#7B4DFF">JS</div></div><div><div style="font-size:32px;font-weight:600;letter-spacing:-.02em">${z.file}</div><div style="font-size:18px;color:#9A93B8;font-weight:500;margin-top:4px">${z.size}</div></div>`);
    s.live = D(c, 'ctr pill', { left: 960, top: 905, fontSize: '24px', fontWeight: 600, padding: '14px 26px', color: '#139B6E' }, `<span style="width:12px;height:12px;border-radius:50%;background:#19B36B;display:inline-block;box-shadow:0 0 0 6px rgba(25,179,107,.2)"></span>${z.live}`);
    s.rip = D(c, 'ctr', { left: 960, top: 700, width: 600, height: 128, borderRadius: '26px', border: '3px solid #7B4DFF' });
    s.hand = mkHand(c);
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 3.2) });
    typeP(s.h1, P(t, .1, .45), t, false); typeP(s.h2, P(t, .5, .9), t, t < 1.4);
    const cp = P(t, 0, .45); S(s.card, { y: (1 - eo(cp)) * 90, s: L(.92, 1, eo(cp)), o: C(cp * 3), b: (1 - eo(cp)) * 14 });
    typeP(s.title, P(t, .2, .6), t, false);
    // file flies in tilted with the hand, wobbles, then drops into the zone
    const fx = tt => L(760, 0, eio(P(tt, .75, 1.5))), fy = tt => L(420, -30, eio(P(tt, .75, 1.5))) + L(0, 30, eo(P(tt, 1.55, 1.85)));
    const drop = eo(P(t, 1.55, 1.85));
    S(s.file, { x: fx(t), y: fy(t), r: L(-14, 0, eo(P(t, .75, 1.6))) + Math.sin(t * 7) * 2 * (1 - drop), s: L(1.1, .96, drop) * (t > 1.85 ? 1 + .04 * Math.sin(P(t, 1.85, 2.1) * Math.PI) : 1), o: P(t, .75, .85), bx: Math.min(40, vel(fx, t) * .25), by: Math.min(30, vel(fy, t) * .25) });
    const dropped = t >= 1.85;
    s.file.style.boxShadow = dropped ? 'inset 0 0 0 3px #7B4DFF, 0 20px 40px -20px rgba(70,40,170,.4)' : '0 40px 70px -24px rgba(70,40,170,.5)';
    s.zone.style.opacity = (1 - P(t, 1.6, 1.85) * .7).toFixed(3);
    s.zone.style.borderColor = t > 1.3 && !dropped ? '#7B4DFF' : '#C9C1EA';
    const rp = P(t, 1.85, 2.4); S(s.rip, { s: L(1, 1.25, eo(rp)), o: rp > 0 ? 1 - rp : 0 });
    S(s.hand, { x: 960 + fx(t) + 170 - 35, y: 700 + fy(t) + 10 - 8, o: P(t, .75, .85) * (1 - P(t, 2.0, 2.3)), s: t > 1.5 && t < 1.85 ? .92 : 1, r: L(14, 0, eio(P(t, .75, 1.5))) + P(t, 1.9, 2.3) * 10 });
    const lp = P(t, 2.0, 2.3); S(s.live, { s: L(.6, 1, bo(lp)), o: C(lp * 4), y: (1 - eo(lp)) * 30 });
  } });
