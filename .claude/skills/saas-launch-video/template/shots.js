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
    s.big = D(s.inner, 'ctr head', { left: 960, top: 500, fontSize: '250px' }, `<span class="num">0</span> <span style="font-weight:500">${pn.unit}</span>`);
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
  sfx: [[0.2, 'ticks10'], [1.0, 'pop'], [2.8, 'whoosh']],
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
  sfx: [[0.1, 'reel'], [0.9, 'type10'], [1.5, 'riser']],
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
