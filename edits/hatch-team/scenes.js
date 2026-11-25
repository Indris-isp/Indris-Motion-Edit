/* Designed scenes + overlays for the Hatch clip (house style: .claude/skills/premium-short-form).
 * scenes.html?name=<scene>&dur=<s>&cues=<json>  ->  window.renderAt(localSeconds)
 * Cues are scene-local word onsets from edit.py (out/plan.json), so every element lands on its word.
 */
'use strict';
const Q = new URLSearchParams(location.search);
const NAME = Q.get('name'), DUR = +Q.get('dur'), CU = JSON.parse(Q.get('cues') || '{}');
const stage = document.getElementById('stage');
const NS = 'http://www.w3.org/2000/svg';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, a, b) => clamp((t - a) / (b - a));
function bez(x1, y1, x2, y2) {
  const B = (u, a, b) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; let lo = 0, hi = 1, u = p;
    for (let i = 0; i < 26; i++) { u = (lo + hi) / 2; if (B(u, x1, x2) < p) lo = u; else hi = u; } return B(u, y1, y2); };
}
const EO = bez(.16, 1, .3, 1);            // ease-out (entrances)
const EE = bez(.45, 0, .2, 1);            // easy-ease
const OS = bez(.34, 1.56, .64, 1);        // overshoot pop (0 -> 112 -> 100 %)
const E = (t, a, b) => EO(P(t, a, b));
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const px = v => v + 'px';
function el(tag, parent, cls, style, html) {
  const e = document.createElement(tag); if (cls) e.className = cls; if (style) Object.assign(e.style, style);
  if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e;
}
function sv(tag, parent, a = {}) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); parent.appendChild(e); return e; }
const dash = (e, p) => { e.setAttribute('stroke-dasharray', `${Math.max(0, p).toFixed(4)} 1.001`); e.style.visibility = p > .002 ? 'visible' : 'hidden'; };
/* word made of per-letter spans (for blur-to-sharp / scatter / assemble) */
function letters(parent, text, cls, style) {
  const w = el('div', parent, cls, Object.assign({ whiteSpace: 'nowrap' }, style || {}));
  const ch = [...text].map(c => { const s = el('span', w, 'ch'); s.textContent = c === ' ' ? ' ' : c; return s; });
  return { w, ch };
}
function blurIn(e, p, rise = 30, blur = 14) {      // house word reveal: rise + fade + sharpen
  const q = EO(clamp(p));
  e.style.opacity = clamp(p * 1.6);
  e.style.transform = (e._base || '') + ` translateY(${((1 - q) * rise).toFixed(2)}px)`;
  const b = (1 - q) * blur; e.style.filter = b > .2 ? `blur(${b.toFixed(2)}px)` : '';
}
const camera = (t, from = 1, to = 1.06) => `scale(${lerp(from, to, EE(P(t, 0, DUR))).toFixed(5)})`;   // constant push-in
const exitAt = (t, d = .22) => 1 - EE(P(t, DUR - d, DUR));

const S = {};

/* ===================== BLUEPRINT: "that EGO has to be transformed into a BLUEPRINT" ===================== */
S.blueprint = () => {
  stage.classList.add('bp');
  const world = el('div', stage, 'abs', { inset: 0, transformOrigin: '50% 45%' });
  const grid = el('div', world, 'grid');
  const runA = el('div', world, 'abs', { left: 0, width: '1080px', top: '560px', textAlign: 'center', fontSize: '56px', fontWeight: 500, color: 'rgba(255,255,255,.78)' }, 'that ego has to be');
  const runB = el('div', world, 'abs', { left: 0, width: '1080px', top: '560px', textAlign: 'center', fontSize: '56px', fontWeight: 500, color: 'rgba(255,255,255,.78)' }, 'transformed into a');
  const ego = letters(world, 'EGO', 'abs', { left: 0, width: '1080px', top: '640px', textAlign: 'center', fontSize: '330px', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1,
    color: '#fff', textShadow: '0 0 30px rgba(255,255,255,.25),0 20px 60px rgba(0,0,0,.6)' });
  const bp = letters(world, 'blueprint', 'abs serif amber', { left: 0, width: '1080px', top: '650px', textAlign: 'center', fontSize: '230px', lineHeight: 1 });
  /* org-chart drawing (the team blueprint) */
  const svg = sv('svg', world, { width: 1080, height: 1920, style: 'position:absolute;left:0;top:0;overflow:visible' });
  const defs = sv('defs', svg); const gl = sv('filter', defs, { id: 'gl', x: '-50%', y: '-50%', width: '200%', height: '200%' });
  sv('feGaussianBlur', gl, { stdDeviation: 5, result: 'b' }); const mg = sv('feMerge', gl); sv('feMergeNode', mg, { in: 'b' }); sv('feMergeNode', mg, { in: 'SourceGraphic' });
  const st = { fill: 'none', stroke: '#8C7F74', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, filter: 'url(#gl)' };
  const paths = [
    'M410 1000 H670 V1110 H410 Z',                                   // leader box
    'M540 1110 V1190', 'M250 1190 H830', 'M250 1190 V1260', 'M540 1190 V1260', 'M830 1190 V1260',
    'M160 1260 H340 V1360 H160 Z', 'M450 1260 H630 V1360 H450 Z', 'M740 1260 H920 V1360 H740 Z',
    'M160 1420 H920', 'M160 1405 V1435', 'M920 1405 V1435',          // dimension line
  ].map(d => sv('path', svg, Object.assign({ d }, st)));
  const labels = [['LEADER', 540, 1066], ['AGENT', 250, 1322], ['AGENT', 540, 1322], ['AGENT', 830, 1322], ['ONE PLAN · EVERY AGENT · EVERY DAY', 540, 1478]]
    .map(([s, x, y]) => { const e = el('div', world, 'ctr label', { left: px(x), top: px(y), whiteSpace: 'nowrap' }); e.textContent = s; return e; });
  const tEgo = CU.ego ?? 0, tTr = CU.transformed, tBp = CU.blueprint;
  return t => {
    world.style.transform = camera(t, 1.0, 1.07);
    grid.style.opacity = .35 + .65 * E(t, tBp - .2, tBp + .5);
    grid.style.transform = `translateY(${(-t * 14).toFixed(2)}px)`;
    blurIn(runA, (t - tEgo + .25) / .25); runA.style.opacity = clamp((t - tEgo + .25) / .15) * (1 - P(t, tTr - .12, tTr));
    blurIn(runB, (t - tTr) / .22); runB.style.opacity = clamp((t - tTr) / .14) * (1 - P(t, tBp + .4, tBp + .6));
    /* EGO: blur-to-sharp in (tracking 30 -> 0), then shatters apart on "transformed" */
    const pin = E(t, tEgo - .05, tEgo + .35), brk = P(t, tTr, tTr + .45);
    ego.w.style.letterSpacing = `${lerp(.3, -.04, pin).toFixed(3)}em`;
    ego.ch.forEach((c, i) => {
      const dx = (i - 1) * 260 * EE(brk) + (hash(i) - .5) * 90 * brk, dy = (hash(i + 5) - .5) * 260 * EE(brk), r = (hash(i + 9) - .5) * 50 * brk;
      c.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) rotate(${r.toFixed(1)}deg) scale(${lerp(1.06, 1, pin) * (1 - .3 * brk)})`;
      c.style.opacity = pin * (1 - EE(brk));
      const b = (1 - pin) * 26 + brk * 22; c.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    });
    /* blueprint: letters assemble in random order (house letter effect) */
    bp.ch.forEach((c, i) => {
      const d = tBp - .06 + .34 * hash(i * 3 + 1), p = P(t, d, d + .2), q = EO(p);
      c.style.opacity = clamp(p * 1.5);
      c.style.transform = `translate(${((1 - q) * (hash(i) - .5) * 120).toFixed(1)}px,${((1 - q) * (hash(i + 7) - .5) * 140).toFixed(1)}px)`;
      const b = (1 - q) * 16; c.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    });
    paths.forEach((p, i) => dash(p, E(t, tBp + .1 + i * .045, tBp + .5 + i * .045)));
    labels.forEach((l, i) => { const p = E(t, tBp + .35 + i * .06, tBp + .6 + i * .06); l.style.opacity = p; });
    stage.style.opacity = 1;
  };
};

/* ===================== TEXTS: "every 25 people on the team text that person: hey, are you alive? ..." ===================== */
S.texts = () => {
  stage.classList.add('warm');
  const world = el('div', stage, 'abs', { inset: 0, transformOrigin: '50% 55%' });
  const glow = el('div', world, 'ctr', { left: '540px', top: '1100px', width: '1200px', height: '1200px', borderRadius: '50%',
    background: 'radial-gradient(closest-side,rgba(255,140,50,.20),rgba(255,140,50,0))' });
  const top = el('div', world, 'abs', { left: 0, width: '1080px', top: '250px', textAlign: 'center' });
  const miss = el('div', top, '', { fontSize: '50px', fontWeight: 500, color: 'rgba(255,255,255,.75)', letterSpacing: '-.01em' }, 'miss one meeting and');
  const row = el('div', top, '', { display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '26px', marginTop: '-6px' });
  const num = el('div', row, 'amber', { fontSize: '230px', fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1.0, fontVariantNumeric: 'tabular-nums' }, '0');
  const lab = el('div', row, 'serif', { fontSize: '120px', color: '#fff' }, 'texts');
  const phone = el('div', world, 'phone', { left: '240px', top: '600px', transformOrigin: '50% 50%' });
  const scr = el('div', phone, 'screen');
  const hdr = el('div', scr, 'hdr');
  const cols = ['#E2725B', '#5B8DE2', '#53B07A', '#C76BD6', '#E2B05B', '#5BC7D6', '#D6915B', '#8A7BE2'];
  ['JM', 'AK', 'TR', 'SL'].forEach((s, i) => el('div', hdr, 'av', { left: px(176 + i * 40), top: '30px', width: '58px', height: '58px', fontSize: '20px', background: cols[i], boxShadow: '0 0 0 4px #1e1e20' }, s));
  el('div', hdr, 'abs', { left: 0, right: 0, top: '100px', textAlign: 'center', fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,.88)' }, 'The Team');
  const badge = el('div', phone, 'badge', { right: '-14px', top: '-14px' }, '0');
  const msgs = [
    ['you good?', 0], ['hello??', 1], ['meeting started', 2], ['where are you', 3], ['?', 4], ['call me', 5], ['you ok??', 6], ['...', 7],
  ];
  const tE = CU.every, tN = CU.n25, tT = CU.text, tA = CU.alive, tS = CU.still;
  const sched = msgs.map((m, i) => lerp(tE - .1, tA - .25, i / (msgs.length - 1)));
  const bubbles = msgs.map(([s, c], i) => {
    const b = el('div', scr, 'bub', { top: '0px' }, s);
    el('div', b, 'av', { left: '-80px', top: '50%', transform: 'translateY(-50%)', width: '54px', height: '54px', fontSize: '20px', background: cols[c % cols.length] },
      ['JM', 'AK', 'TR', 'SL', 'DB', 'KP', 'RN', 'MW'][c]);
    return { b, t: sched[i], h: 82 };
  });
  const big1 = el('div', scr, 'bub big', { top: '0px' }, 'Hey, are you alive?'); el('div', big1, 'av', { left: '-80px', top: '50%', transform: 'translateY(-50%)', width: '54px', height: '54px', fontSize: '20px', background: cols[1] }, 'AK');
  const big2 = el('div', scr, 'bub big', { top: '0px', whiteSpace: 'normal', width: '330px' }, 'Are you still in real estate?'); el('div', big2, 'av', { left: '-80px', top: '50%', transform: 'translateY(-50%)', width: '54px', height: '54px', fontSize: '20px', background: cols[3] }, 'SL');
  const all = bubbles.concat([{ b: big1, t: tA - .05, h: 94 }, { b: big2, t: tS - .05, h: 136 }]);
  const BOTTOM = 940;                       // newest bubble's baseline inside the screen
  return t => {
    world.style.transform = camera(t, 1.0, 1.06);
    blurIn(miss, t / .22);
    blurIn(row, (t - (tE - .1)) / .25, 30, 16);
    /* count-up 0 -> 25, lands on "text" */
    const c = Math.round(25 * EE(P(t, tN - .05, tT)));
    num.textContent = String(c); badge.textContent = String(c);
    badge.style.transform = `scale(${(1 + .25 * Math.max(0, Math.sin(P(t, tN, tT) * Math.PI * 8)) * (1 - P(t, tT, tT + .2))).toFixed(3)})`;
    badge.style.opacity = E(t, tE - .1, tE + .1);
    const pp = E(t, 0, .45);
    phone.style.transform = `translateY(${((1 - pp) * 260).toFixed(1)}px) rotate(${lerp(-7, -2.5, EE(P(t, 0, DUR))).toFixed(2)}deg) scale(${lerp(.92, 1, pp).toFixed(4)})`;
    phone.style.opacity = clamp(t / .15);
    /* stack: each arrival pushes the older bubbles up */
    let y = BOTTOM;
    for (let i = all.length - 1; i >= 0; i--) {
      const m = all[i], p = P(t, m.t, m.t + .2);
      if (p <= 0) { m.b.style.opacity = 0; continue; }
      const s = lerp(.6, 1, OS(p));
      m.y = y - m.h * EO(p); y = m.y - 14 * EO(p);
    }
    all.forEach(m => {
      const p = P(t, m.t, m.t + .2); if (p <= 0) return;
      m.b.style.opacity = clamp(p * 2) * (m.y < 190 ? clamp((m.y - 120) / 70) : 1);
      m.b.style.top = px(m.y);
      m.b.style.transform = `scale(${lerp(.6, 1, OS(p)).toFixed(4)})`; m.b.style.transformOrigin = '0% 100%';
    });
    stage.style.opacity = 1;
  };
};

/* ===================== BOARD: the team's blueprint, built rule by rule ===================== */
function buildBoard(world, opts = {}) {
  const head = el('div', world, 'abs', { left: 0, width: '1080px', top: '330px', textAlign: 'center' });
  const lab = el('div', head, 'label', { fontSize: '30px' }, 'MATT’S TEAM');
  const ttl = el('div', head, '', { fontSize: '96px', fontWeight: 800, letterSpacing: '-.04em', marginTop: '10px' }, 'The <span class="serif amber" style="font-size:118px;letter-spacing:-.01em">blueprint</span>');
  const rule = el('div', world, 'abs', { left: '240px', width: '600px', top: '560px', height: '2px', background: 'linear-gradient(90deg,transparent,rgba(140,127,116,.85),transparent)' });
  const data = [['1', 'Show up.', 'Every meeting. Everyone.'], ['2', 'X conversations', 'every single week'], ['3', 'Add friends', 'to the database']];
  const rows = data.map(([n, a, b], i) => {
    const r = el('div', world, 'row', { top: px(650 + i * 240) });
    el('div', r, 'num', {}, n);
    const tx = el('div', r, ''); el('div', tx, 't', {}, a); el('div', tx, 's', {}, b);
    const s = sv('svg', el('div', r, 'chk'), { width: 74, height: 74, viewBox: '0 0 74 74' });
    const ring = sv('circle', s, { cx: 37, cy: 37, r: 33, fill: 'none', stroke: '#F05B33', 'stroke-width': 3.5, pathLength: 1, opacity: .9 });
    const tick = sv('path', s, { d: 'M22 38 L33 49 L53 27', fill: 'none', stroke: '#F05B33', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1,
      style: 'filter:drop-shadow(0 0 6px rgba(240,91,51,.8))' });
    return { r, ring, tick };
  });
  return { head, rule, rows };
}
function setRow(R, pin, chk, active) {
  R.r.style.opacity = clamp(pin * 1.5);
  const q = EO(pin);
  R.r.style.transform = `translateX(${((1 - q) * -80).toFixed(1)}px) scale(${lerp(.94, 1, OS(pin)).toFixed(4)})`;
  const b = (1 - q) * 12; R.r.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
  dash(R.ring, chk); dash(R.tick, P(chk, .4, 1));
  R.r.style.boxShadow = `inset 0 0 0 1.5px rgba(240,91,51,${(.22 + .45 * active).toFixed(3)}), 0 0 ${(60 * active).toFixed(0)}px rgba(240,91,51,${(.22 * active).toFixed(3)})`;
  R.r.style.background = `rgba(37,32,27,${(.82 + .15 * active).toFixed(3)})`;
}
S.board = () => {
  stage.classList.add('bp');
  const world = el('div', stage, 'abs', { inset: 0, transformOrigin: '50% 50%' });
  el('div', world, 'grid');
  const B = buildBoard(world);
  const { x: tX, week: tW, add: tA, database: tD } = CU;
  return t => {
    world.style.transform = camera(t, 1.0, 1.05);
    blurIn(B.head, t / .25, 30, 14);
    B.rule.style.transform = `scaleX(${E(t, .05, .45)})`;
    setRow(B.rows[0], P(t, 0, .25), 1, 0);
    setRow(B.rows[1], P(t, tX - .1, tX + .18), P(t, tW - .1, tW + .3), E(t, tX - .1, tX + .2) * (1 - E(t, tA - .2, tA)));
    setRow(B.rows[2], P(t, tA - .1, tA + .18), P(t, tD - .05, tD + .35), E(t, tA - .1, tA + .2));
    stage.style.opacity = 1;
  };
};

/* ===================== FINAL: "This is the blueprint." (callback to the board) ===================== */
S.final = () => {
  stage.classList.add('bp');
  const world = el('div', stage, 'abs', { inset: 0, transformOrigin: '50% 50%' });
  el('div', world, 'grid');
  const B = buildBoard(world);
  const veil = el('div', world, 'abs', { inset: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 50%,rgba(6,9,13,.86),rgba(6,9,13,.55))', opacity: 0 });
  const stamp = el('div', world, 'abs', { left: 0, width: '1080px', top: '760px', textAlign: 'center', lineHeight: 1 });
  const s1 = el('div', stamp, '', { fontSize: '64px', fontWeight: 500, color: 'rgba(255,255,255,.85)' }, 'this is');
  const s2 = el('div', stamp, 'serif amber', { fontSize: '250px', marginTop: '6px' }, 'the blueprint.');
  const tB = CU.blueprint;
  return t => {
    world.style.transform = camera(t, 1.04, 1.12);
    const v = E(t, tB - .25, tB + .05);
    B.rows.forEach(R => { setRow(R, 1, 1, 0); R.r.style.filter = v > .02 ? `blur(${(10 * v).toFixed(1)}px)` : ''; R.r.style.opacity = 1 - .55 * v; });
    B.head.style.filter = v > .02 ? `blur(${(10 * v).toFixed(1)}px)` : ''; B.head.style.opacity = 1 - .7 * v;
    veil.style.opacity = .95 * v;
    blurIn(s1, (t - (CU.this ?? 0) + .05) / .2, 24, 10);
    const p = P(t, tB - .08, tB + .22);
    s2.style.opacity = clamp(p * 1.6);
    s2.style.transform = `scale(${lerp(1.35, 1, EO(p)).toFixed(4)})`;
    const b = (1 - EO(p)) * 30; s2.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    stage.style.opacity = 1;
  };
};

/* ===================== WARM WORLD (client plan, beats 3 and 5): orange gradient, editorial left type,
   drifting line-art elements at the edges (reference: golden gradient + objects bleeding off-frame) ===================== */
function warmWorld() {
  stage.classList.add('og');
  const world = el('div', stage, 'abs', { inset: 0, transformOrigin: '50% 50%' });
  const streaks = [0, 1].map(i => el('div', world, 'streak', { left: px(-200 + i * 620), top: '-400px', width: '520px', height: '2800px' }));
  return { world, streaks };
}
const ART = {   // simple line illustrations (stroke only) for the drifting elements
  house: '<svg viewBox="0 0 200 180" width="100%" height="100%"><path d="M20 90 L100 20 L180 90 M40 74 V170 H160 V74 M84 170 V118 H116 V170 M56 104 H76 V124 H56 Z M124 104 H144 V124 H124 Z M140 40 V18 H158 V56"/></svg>',
  roll: '<svg viewBox="0 0 240 140" width="100%" height="100%"><path d="M30 30 H200 A20 20 0 0 1 200 70 H30 A20 20 0 0 1 30 30 Z M30 30 A20 20 0 0 0 30 70 M50 70 V120 H220 V70 M70 88 H120 M70 102 H150 M160 82 H200 V110 H160 Z"/></svg>',
  compass: '<svg viewBox="0 0 160 200" width="100%" height="100%"><path d="M80 14 A12 12 0 1 1 79.9 14 M74 36 L30 186 M86 36 L130 186 M46 132 Q80 150 114 132 M30 186 L26 196 M130 186 L132 196"/></svg>',
  ruler: '<svg viewBox="0 0 260 60" width="100%" height="100%"><path d="M6 10 H254 V50 H6 Z M26 10 V26 M46 10 V20 M66 10 V26 M86 10 V20 M106 10 V30 M126 10 V20 M146 10 V26 M166 10 V20 M186 10 V26 M206 10 V20 M226 10 V30"/></svg>',
};
function drifters(world, list) {
  return list.map(([k, x, y, w, rot, dx, dy, dr, op]) => {
    const d = el('div', world, 'art', { left: px(x), top: px(y), width: px(w), height: px(w * .8), opacity: op });
    d.innerHTML = ART[k]; d._m = [x, y, rot, dx, dy, dr]; return d;
  });
}
function drift(els, t, inP) {
  els.forEach((d, i) => {
    const [x, y, r, dx, dy, dr] = d._m, p = EO(clamp(inP - i * .08));
    d.style.transform = `translate(${(dx * t + (1 - p) * (x < 540 ? -160 : 160)).toFixed(1)}px,${(dy * t + 6 * Math.sin(t * 1.3 + i)).toFixed(1)}px) rotate(${(r + dr * t).toFixed(2)}deg)`;
  });
}

S.reel = () => {          // beat 3: "that ego has to be transformed into a ... blueprint"
  const { world, streaks } = warmWorld();
  const arts = drifters(world, [['house', 720, 170, 330, 8, -6, 4, 1.2, .55], ['roll', 640, 1390, 400, -10, -9, -5, -1.5, .5],
    ['compass', -40, 1330, 220, 18, 7, -4, 2, .45], ['ruler', -60, 210, 330, -14, 10, 3, -1, .4]]);
  const runA = el('div', world, 'run', { top: '470px' }, 'that ego has to be');
  const runB = el('div', world, 'run', { top: '540px' }, 'transformed into a');
  const win = el('div', world, 'reelwin', { top: '620px' });
  const strip = el('div', win, 'reelstrip');
  const WORDS = ['title', 'following', 'brand', 'a crowd', 'vision', 'a boss', 'help', 'system', 'a plan', 'habit', 'a team', 'blueprint.'];
  const ROW = 210;
  const LIST = [...WORDS].reverse();                     // top -> bottom: "blueprint." ... "title"; the strip slides DOWN
  const rows = LIST.map((w, i) => { const r = el('div', strip, 'reelword', { top: px(i * ROW) }); r.textContent = w; return r; });
  const ul = el('div', world, 'uline', { top: '925px' });
  const tE = CU.ego ?? .2, tT = CU.transformed, tB = CU.blueprint;
  const N = WORDS.length - 1;
  return t => {
    world.style.transform = camera(t, 1.0, 1.05);
    streaks.forEach((s, i) => s.style.transform = `translateX(${(t * (40 + i * 18)).toFixed(1)}px) rotate(18deg)`);
    drift(arts, t, t / .7);
    blurIn(runA, (t - tE + .25) / .25, 24, 10);
    blurIn(runB, (t - tT) / .22, 24, 10);
    /* a long run of options: slow start, fast middle, soft landing on "blueprint." exactly on the word */
    const p = clamp((t - (tE + .05)) / (tB - (tE + .05)));
    const q = p < .45 ? .22 * EE(p / .45) : .22 + .78 * (1 - Math.pow(1 - (p - .45) / .55, 3));
    const pos = q * N;                                    // how many words have passed
    strip.style.transform = `translateY(${(-(N - pos) * ROW).toFixed(1)}px)`;
    const speed = p > 0 && p < 1 ? Math.min(1, (p < .45 ? .4 : 1.8 * (1 - (p - .45) / .55))) : 0;
    rows.forEach((r, i) => {
      const d = Math.abs(i - (N - pos));
      r.style.opacity = (clamp(1 - d * .5) * .85 + (d < .5 ? .15 : 0)) * clamp((t - tE + .1) / .2) * (i === 0 ? 1 : 1 - E(t, tB + .1, tB + .5));
      const blur = speed * 7 * clamp(d * 1.5 + .4);
      r.style.filter = blur > .3 ? `blur(${blur.toFixed(1)}px)` : '';
      r.classList.toggle('land', i === 0 && p >= .999);
    });
    ul.style.transform = `scaleX(${E(t, tB + .05, tB + .4)})`;
    stage.style.opacity = 1;
  };
};

S.secret = () => {        // beat 5 background + question type (Erik's cut-out is composited in edit.py)
  const { world, streaks } = warmWorld();
  const arts = drifters(world, [['ruler', -80, 1460, 300, 12, 8, -3, 1, .35], ['house', -60, 160, 230, -8, 6, 3, -1, .35]]);
  const box = el('div', world, 'abs', { left: '70px', top: '470px', width: '470px' });
  const a = el('div', box, 'qrun', {}, 'Hey, what’s the');
  const b = el('div', box, 'qkey', {}, 'secret');
  const c = el('div', box, 'qrun', { marginTop: '6px' }, 'to your<br>success?');
  const { hey: tH, secret: tS, to: tTo } = CU;
  return t => {
    world.style.transform = camera(t, 1.0, 1.05);
    streaks.forEach((s, i) => s.style.transform = `translateX(${(t * (40 + i * 18)).toFixed(1)}px) rotate(18deg)`);
    drift(arts, t, t / .6);
    blurIn(a, (t - tH + .06) / .2, 24, 10);
    const p = P(t, tS - .06, tS + .22);
    b.style.opacity = clamp(p * 1.6);
    b.style.transform = `translateY(${((1 - EO(p)) * 36).toFixed(1)}px) scale(${lerp(.86, 1, OS(p)).toFixed(4)})`;
    const bl = (1 - EO(p)) * 14; b.style.filter = bl > .3 ? `blur(${bl.toFixed(1)}px)` : '';
    blurIn(c, (t - tTo + .06) / .2, 24, 10);
    stage.style.opacity = 1;
  };
};

/* ===================== OVERLAYS (transparent, on top of the speaker) ===================== */
S.title = () => {           // A8 title banner for the first beat
  const box = el('div', stage, 'abs glass', { left: '90px', width: '900px', top: '262px', borderRadius: '40px', padding: '30px 0 34px', textAlign: 'center' });
  const a = el('div', box, '', { fontSize: '52px', fontWeight: 600, letterSpacing: '-.02em' }, 'Why do real estate teams');
  const b = el('div', box, '', { fontSize: '52px', fontWeight: 600, letterSpacing: '-.02em', marginTop: '4px' }, 'actually <span class="serif amber" style="font-size:88px">exist?</span>');
  return t => {
    const p = P(t, 0, .3), x = exitAt(t, .2);
    box.style.opacity = clamp(p * 1.6) * x;
    box.style.transform = `translateY(${((1 - EO(p)) * 40).toFixed(1)}px) scale(${(lerp(.9, 1, OS(p)) * (1 + .03 * (1 - x))).toFixed(4)})`;
    const bl = (1 - EO(p)) * 12 + (1 - x) * 8; box.style.filter = bl > .3 ? `blur(${bl.toFixed(1)}px)` : '';
    blurIn(a, (t - .08) / .2, 20, 8); blurIn(b, (t - .2) / .22, 20, 8);
    b.style.opacity = clamp((t - .2) / .14) * 1;
  };
};

const ICON = {
  pin: '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#3A1A00"/></svg>',
  money: '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M12.5 3v2.1c2 .3 3.4 1.6 3.5 3.4h-2.3c-.1-.9-.9-1.5-2.2-1.5-1.3 0-2.1.6-2.1 1.4 0 .8.6 1.2 2.4 1.6 2.6.6 4.4 1.4 4.4 3.8 0 1.9-1.5 3.2-3.7 3.5V19h-1.6v-2.1c-2.3-.3-3.9-1.7-4-3.8h2.3c.1 1.1 1.1 1.8 2.5 1.8 1.5 0 2.3-.7 2.3-1.6 0-.9-.7-1.3-2.6-1.7-2.4-.5-4.1-1.4-4.1-3.6 0-1.8 1.4-3.1 3.5-3.4V3z" fill="#3A1A00"/></svg>',
  up: '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 7-8" stroke="#3A1A00" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h5v5" stroke="#3A1A00" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
S.tags = () => {            // A5 stacked tag list in the headroom of the wide shot
  const items = [['pin', 'Connecticut', CU.ct], ['money', 'Great money', CU.money], ['up', 'High per-agent productivity', CU.prod]];
  const pills = items.map(([ic, s, tc], i) => {
    const p = el('div', stage, 'pill glass', { top: px(282 + i * 118) });
    el('div', p, 'ic', {}, ICON[ic]); el('span', p, '', {}, s);
    return { p, tc };
  });
  return t => {
    const x = exitAt(t, .2);
    pills.forEach(({ p, tc }) => {
      const q = P(t, tc - .1, tc + .14);
      p.style.opacity = clamp(q * 1.8) * x;
      p.style.transform = `translateX(${((1 - EO(q)) * -60).toFixed(1)}px) scale(${lerp(.6, 1, OS(q)).toFixed(4)})`;
      p.style.transformOrigin = '0% 50%';
      const b = (1 - EO(q)) * 10 + (1 - x) * 8; p.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
    });
  };
};

S.rule1 = () => {           // "#1" in the headroom for "number one, everybody agrees to show up"
  const box = el('div', stage, 'abs', { left: 0, width: '1080px', top: '250px', textAlign: 'center' });
  const lab = el('div', box, 'label', { fontSize: '30px', color: 'rgba(255,255,255,.85)', textShadow: '0 2px 12px rgba(0,0,0,.6)' }, 'RULE');
  const n = el('div', box, 'serif amber', { fontSize: '230px', lineHeight: .95, marginTop: '-4px' }, '#1');
  return t => {
    const x = exitAt(t, .2);
    blurIn(lab, t / .2, 16, 8); lab.style.opacity = clamp(t / .12) * x;
    const p = P(t, .02, .3);
    n.style.opacity = clamp(p * 1.6) * x;
    n.style.transform = `scale(${(lerp(0, 1, OS(p)) * (1 + .04 * P(t, 0, DUR))).toFixed(4)})`;
    const b = (1 - EO(p)) * 14 + (1 - x) * 8; n.style.filter = b > .3 ? `blur(${b.toFixed(1)}px)` : '';
  };
};

window.renderAt = (S[NAME] || (() => () => {}))();
document.fonts.ready.then(() => { window.READY = true; });
