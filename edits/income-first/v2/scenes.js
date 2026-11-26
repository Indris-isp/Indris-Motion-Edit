// Designed scenes + caption overlays for the "Find income first" v2 edit (client plan, palette A).
// Each scene is a pure function of time: init once, then window.renderAt(t) (scene-local seconds).
// URL params: name, dur, cues (JSON {words: [[t, word], ...]} in scene-local seconds).
const S = document.getElementById('stage');
const P = new URLSearchParams(location.search);
const NAME = P.get('name'), DUR = +P.get('dur'), CUES = JSON.parse(P.get('cues') || '{}');
const WORDS = CUES.words || [];
const ACC = '#5FD8F5', BASE = '#0F1113', TXT = '#F2EEE8', NEG = '#FF5446', ACCD = '#0E6E85';
const LEAD = 3 / 23.976;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = u => 1 - Math.pow(1 - clamp(u), 3);
const eio = u => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const back = (u, s = 1.7) => { u = clamp(u) - 1; return 1 + u * u * ((s + 1) * u + s); };
const lerp = (a, b, u) => a + (b - a) * u;
const norm = w => w.toLowerCase().replace(/[^a-z0-9'%-]/g, '');
function tw(word, n = 0) {           // scene-local time of the n-th occurrence of a word
  let k = 0;
  for (const [t, w] of WORDS) if (norm(w) === word) { if (k === n) return t; k++; }
  throw new Error(`${NAME}: no word "${word}"`);
}
function el(tag, css = {}, parent = S, html = null, cls = '') {
  const e = document.createElement(tag); if (cls) e.className = cls; Object.assign(e.style, css);
  if (html != null) e.innerHTML = html; parent.appendChild(e); return e;
}
// word-by-word rise-in (house caption animation): opacity, blur, rise
function reveal(e, t, t0, rise = 28, d = 0.24) {
  const u = (t - (t0 - LEAD)) / d;
  e.style.opacity = clamp(u * 1.6);
  e.style.filter = `blur(${(10 * (1 - eo(u))).toFixed(2)}px)`;
  e.style.transform = `translateY(${(rise * (1 - eo(u))).toFixed(2)}px)`;
}
// a centred caption line: [{w, t, cls}] -> spans; returns update(t)
function line(parent, y, items, css = {}) {
  const box = el('div', Object.assign({ position: 'absolute', left: '0', width: '1080px', top: y + 'px', textAlign: 'center' }, css), parent);
  const spans = items.map((it, i) => {
    const s = el('span', {}, box, (i ? ' ' : '') + it.w, 'w ' + (it.cls || 'run'));
    if (it.css) Object.assign(s.style, it.css);
    return [s, it.t];
  });
  return t => spans.forEach(([s, t0]) => reveal(s, t, t0));
}
function chunkVis(e, t, t0, t1) {     // whole-chunk visibility with a short blur exit
  if (t < t0 - LEAD - 0.01 || t >= t1) { e.style.display = 'none'; return; }
  e.style.display = 'block';
  const x = clamp((t - (t1 - 0.12)) / 0.12);
  e.style.opacity = 1 - x; e.style.filter = x > 0 ? `blur(${8 * x}px)` : '';
}
const run = (w, extra = {}) => Object.assign({ w, t: tw(norm(w)) }, extra);

const SCENES = {
  // 0.00-1.36  host A-roll: "and what MESSAGE would you give"  (keyword appears big and zooms out, ??? behind)
  cap_q() {
    const q = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1120px', textAlign: 'center', font: '520px/1 Anton', color: 'transparent',
      WebkitTextStroke: '5px rgba(95,216,245,.8)', letterSpacing: '30px', filter: 'drop-shadow(0 0 22px rgba(95,216,245,.45))' }, S, '???');
    const r1 = line(S, 1290, [run('and'), run('what')]);
    const kw = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1345px', textAlign: 'center' }, S, 'message', 'kw');
    kw.style.fontSize = '210px';
    const r2 = line(S, 1590, [run('would'), run('you'), run('give')]);
    const tk = tw('message');
    return t => {
      r1(t); r2(t);
      const u = (t - (tk - 0.1)) / 0.38;
      kw.style.opacity = clamp(u * 2); kw.style.transform = `scale(${lerp(1.9, 1, eo(u)) * (1 - 0.03 * clamp(t - tk))})`;
      kw.style.filter = `blur(${12 * (1 - eo(u))}px)`;
      const v = (t - (tk - 0.2)) / 0.5;
      q.style.opacity = 0.65 * clamp(v * 1.5); q.style.transform = `scale(${lerp(1.45, 1, eo(v))})`;
    };
  },

  // 1.36-3.06  orbit card: host face (composited in python at 540,1060 r=150) with viewers orbiting it
  orbit() {
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 80% 55% at 50% 56%, #15404b 0%, #0d1a1f 45%, #0F1113 75%)' });
    el('div', { position: 'absolute', inset: '0', opacity: '.35', backgroundImage: 'radial-gradient(rgba(95,216,245,.35) 1.5px, transparent 1.6px)', backgroundSize: '44px 44px',
      maskImage: 'radial-gradient(ellipse at 50% 55%, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, black 0%, transparent 70%)' });
    const ring = el('div', { position: 'absolute', left: (540 - 330) + 'px', top: (1060 - 330) + 'px', width: '660px', height: '660px', borderRadius: '50%',
      border: '2px solid rgba(95,216,245,.55)', boxShadow: '0 0 40px rgba(95,216,245,.25), inset 0 0 40px rgba(95,216,245,.12)' });
    const ring2 = el('div', { position: 'absolute', left: (540 - 450) + 'px', top: (1060 - 450) + 'px', width: '900px', height: '900px', borderRadius: '50%',
      border: '1.5px dashed rgba(95,216,245,.22)' });
    const t1 = line(S, 300, [run('people'), run('who'), run('are')], { font: '600 64px Inter, sans-serif' });
    const t2 = line(S, 385, [{ w: 'watching this', t: tw('watching'), cls: 'kw' }]);
    const COLS = [['#5FD8F5', '#1b6f84'], ['#F2EEE8', '#9a948a'], ['#BFEFFB', '#4c8fa0'], ['#5FD8F5', '#0E6E85'], ['#F2EEE8', '#77716a'], ['#9fdcef', '#2f6f80'], ['#e6f7fb', '#5a8f9c']];
    const av = COLS.map(([c1, c2], i) => {
      const a = el('div', { position: 'absolute', width: '128px', height: '128px', borderRadius: '50%', overflow: 'hidden',
        background: `linear-gradient(160deg, ${c1}, ${c2})`, boxShadow: '0 0 0 5px #0F1113, 0 0 0 7px rgba(95,216,245,.7), 0 12px 30px rgba(0,0,0,.5)' });
      el('div', { position: 'absolute', left: '40px', top: '22px', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(15,17,19,.78)' }, a);
      el('div', { position: 'absolute', left: '18px', top: '78px', width: '92px', height: '80px', borderRadius: '46px 46px 0 0', background: 'rgba(15,17,19,.78)' }, a);
      return a;
    });
    return t => {
      t1(t); t2(t);
      ring.style.transform = `rotate(${t * 12}deg) scale(${lerp(0.7, 1, eo(t / 0.45))})`; ring.style.opacity = clamp(t / 0.3);
      ring2.style.transform = `rotate(${-t * 8}deg) scale(${lerp(0.8, 1, eo((t - 0.1) / 0.5))})`; ring2.style.opacity = clamp((t - 0.1) / 0.4);
      av.forEach((a, i) => {
        const ang = -Math.PI / 2 + i * 2 * Math.PI / av.length + t * 0.42;
        const u = (t - (0.32 + i * 0.11)) / 0.32;
        const x = 540 + 330 * Math.cos(ang) - 64, y = 1060 + 330 * Math.sin(ang) - 64;
        a.style.left = x + 'px'; a.style.top = y + 'px'; a.style.opacity = clamp(u * 2); a.style.transform = `scale(${back(u)})`;
      });
    };
  },

  // 3.06-3.98  over the clapperboard B-roll
  cap_clap() {
    const r = line(S, 1420, [run('and'), run('who'), run('want')], { font: '600 60px Inter, sans-serif' });
    return t => r(t);
  },

  // 3.98-5.17  "ACTING?" behind the actor (python keeps only the pixels outside the person matte)
  acting_text() {
    const a = el('div', { position: 'absolute', left: '0', width: '1080px', top: '520px', textAlign: 'center', font: '300px/1 Anton', color: TXT, letterSpacing: '6px',
      textShadow: '0 0 40px rgba(95,216,245,.55), 0 8px 0 #0E6E85, 0 16px 30px rgba(0,0,0,.5)' }, S, 'ACTING?');
    const ta = tw('acting');
    return t => {
      const u = (t - (ta - 0.3)) / 0.45;
      a.style.opacity = clamp(u * 1.8); a.style.transform = `translateY(${260 * (1 - eo(u))}px) scale(${lerp(0.92, 1, eo(u)) + 0.02 * clamp(t - ta)})`;
    };
  },
  cap_acting() {
    const r = line(S, 1420, [run('to'), run('get'), run('into')], { font: '600 60px Inter, sans-serif' });
    return t => r(t);
  },

  // 5.17-8.19  caption appears in the middle, then slides left (30,000ft style: run-in + big serif italic keyword)
  cap_advice() {
    const b1 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const l1 = line(b1, 1250, [run('so'), run('my')]);
    const k1 = line(b1, 1305, [{ w: 'advice', t: tw('advice'), cls: 'kw', css: { fontSize: '200px' } }]);
    const l2 = line(b1, 1510, [run('to'), run('anybody')]);
    const b2 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const l3 = line(b2, 1250, [run('who'), run('wants'), { w: 'to', t: tw('to', 1) }]);
    const k2 = line(b2, 1310, [{ w: 'play this game', t: tw('play'), cls: 'kw', css: { fontSize: '140px' } }]);
    const tS = tw('advice') + 0.55, tB = tw('who');
    return t => {
      const dx = -170 * eio((t - tS) / 0.5);
      chunkVis(b1, t, 0, tB - LEAD); b1.style.transform = `translateX(${dx}px)`;
      chunkVis(b2, t, tB, DUR + 1); b2.style.transform = `translateX(-120px)`;
      l1(t); k1(t); l2(t); l3(t); k2(t);
    };
  },

  // 8.19-9.70
  cap_find() {
    const r = line(S, 1420, [run('is'), run('find'), run('something')]);
    return t => r(t);
  },

  // 9.70-13.19  metallic card + 3D money stack: "that brings you / Income / first."
  money() {
    const bg = el('div', { position: 'absolute', inset: '0', background: 'linear-gradient(118deg, #0a1114 0%, #1c2f36 24%, #6f97a3 40%, #d9eff5 48%, #7fa6b1 56%, #1a2b31 74%, #0a1114 100%)', backgroundSize: '260% 100%' });
    el('div', { position: 'absolute', inset: '0', background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 1px, transparent 1px 4px)' });
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%)' });
    const r1 = line(S, 560, [run('that'), run('brings'), run('you')], { textAlign: 'left', left: '80px', font: '600 56px Inter, sans-serif' });
    const big1 = el('div', { position: 'absolute', left: '72px', top: '640px', font: '400 220px/1 "Instrument Serif", serif', color: TXT, textShadow: '0 6px 30px rgba(0,0,0,.6)' }, S, 'Income');
    const big2 = el('div', { position: 'absolute', left: '80px', top: '840px', font: 'italic 400 220px/1 "Instrument Serif", serif', color: ACC, textShadow: '0 0 30px rgba(95,216,245,.6), 0 6px 30px rgba(0,0,0,.6)' }, S, 'first.');
    // 3D money stack
    const wrap = el('div', { position: 'absolute', left: '300px', top: '1000px', width: '700px', height: '700px', perspective: '1700px', transform: 'scale(1.55)', transformOrigin: '50% 40%' });
    const stack = el('div', { position: 'absolute', left: '120px', top: '220px', width: '460px', height: '200px', transformStyle: 'preserve-3d' }, wrap);
    const bill = (parent, z, top) => {
      const b = el('div', { position: 'absolute', left: '0', top: '0', width: '460px', height: '200px', borderRadius: '8px',
        background: top ? 'linear-gradient(135deg,#e1ecdc,#b3c9b0 60%,#9db79b)' : `linear-gradient(135deg, hsl(110,14%,${70 - z * 0.6}%), hsl(110,14%,${58 - z * 0.6}%))`,
        boxShadow: top ? 'inset 0 0 0 7px #6e8e6c, inset 0 0 0 12px #dfeadb, inset 0 0 0 14px #6e8e6c, 0 2px 3px rgba(0,0,0,.35)' : '0 1px 0 rgba(0,0,0,.35)',
        transform: `translateZ(${z * 6}px)` }, parent);
      if (top) {
        el('div', { position: 'absolute', left: '170px', top: '40px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle at 45% 40%, #a9c2a6, #5f7f5d)', boxShadow: 'inset 0 0 0 4px #6e8e6c' }, b);
        for (const [x, y] of [[22, 16], [370, 16], [22, 140], [370, 140]]) el('div', { position: 'absolute', left: x + 'px', top: y + 'px', font: '40px/1 Anton', color: '#4c6b4a' }, b, '100');
        el('div', { position: 'absolute', left: '60px', top: '85px', width: '90px', height: '6px', background: '#6e8e6c', borderRadius: '3px' }, b);
        el('div', { position: 'absolute', left: '310px', top: '85px', width: '90px', height: '6px', background: '#6e8e6c', borderRadius: '3px' }, b);
      }
      return b;
    };
    for (let i = 0; i < 22; i++) bill(stack, i, i === 21);
    const flyers = [0, 1, 2, 3, 4].map(i => { const f = el('div', { position: 'absolute', left: '0', top: '0', width: '460px', height: '200px', transformStyle: 'preserve-3d' }, stack); bill(f, 0, true); return f; });
    const tI = tw('income');
    return t => {
      bg.style.backgroundPosition = `${lerp(0, 75, t / DUR)}% 0`;
      r1(t);
      const u1 = (t - (tI - 0.1)) / 0.4, u2 = (t - (tw('first') - 0.1)) / 0.4;
      big1.style.opacity = clamp(u1 * 1.8); big1.style.transform = `translateY(${40 * (1 - eo(u1))}px)`; big1.style.filter = `blur(${10 * (1 - eo(u1))}px)`;
      big2.style.opacity = clamp(u2 * 1.8); big2.style.transform = `translateY(${40 * (1 - eo(u2))}px)`; big2.style.filter = `blur(${10 * (1 - eo(u2))}px)`;
      const ur = eo(t / 0.55);
      stack.style.transform = `translateY(${lerp(520, 0, ur)}px) rotateX(58deg) rotateZ(${-26 + t * 7}deg)`;
      flyers.forEach((f, i) => {
        const v = clamp((t - (tI + i * 0.12)) / 1.6);
        if (v <= 0) { f.style.opacity = 0; return; }
        f.style.opacity = 1 - clamp((v - 0.75) / 0.25);
        const dx = (180 + i * 70) * eo(v), dz = 140 + 700 * eo(v), rot = (i % 2 ? 1 : -1) * 160 * v;
        f.style.transform = `translateZ(${dz}px) translateX(${dx}px) translateY(${-60 * v}px) rotateZ(${rot}deg) rotateX(${40 * v}deg)`;
      });
    };
  },

  // 13.19-17.33  puzzle pieces join on a smooth curve at "find a WAY", the bulb lights; camera tilts for "CHECKS ROLLING IN"
  puzzle() {
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #163640 0%, #0e1b20 50%, #0F1113 80%)' });
    const world = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '2600px' });
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', 1080); svg.setAttribute('height', 2600); svg.style.position = 'absolute'; world.appendChild(svg);
    svg.innerHTML = `<defs>
      <linearGradient id="pz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9df0ff"/><stop offset=".45" stop-color="#3fc6e8"/><stop offset="1" stop-color="#0f7d98"/></linearGradient>
      <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="bulb" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d8f7ff"/><stop offset="1" stop-color="#5FD8F5" stop-opacity=".55"/></radialGradient>
      <radialGradient id="halo"><stop offset="0" stop-color="#5FD8F5" stop-opacity=".75"/><stop offset="1" stop-color="#5FD8F5" stop-opacity="0"/></radialGradient>
      <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".55"/></filter></defs>`;
    const s = 280;
    // tab on the right (A) / matching blank on the left (B); radius .15 circles centred at x=1.11 / x=.11
    const A = `M0,0 H${s} V${s * .37} A${s * .15},${s * .15} 0 1 1 ${s},${s * .63} V${s} H0 Z`;
    const B = `M0,0 H${s} V${s} H0 V${s * .63} A${s * .15},${s * .15} 0 1 0 0,${s * .37} Z`;
    const mk = d => { const g = document.createElementNS(NS, 'g'); g.setAttribute('filter', 'url(#sh)');
      g.innerHTML = `<path d="${d}" fill="url(#pz)" stroke="#0b5f73" stroke-width="3"/><path d="${d}" fill="url(#gl)"/>`; svg.appendChild(g); return g; };
    const gA = mk(A), gB = mk(B);
    const bulbG = document.createElementNS(NS, 'g'); svg.appendChild(bulbG);
    bulbG.innerHTML = `<circle cx="0" cy="0" r="260" fill="url(#halo)"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="-4" y="-235" width="8" height="54" rx="4" fill="#5FD8F5" opacity=".8" transform="rotate(${i * 30})"/>`).join('')}
      <circle cx="0" cy="0" r="110" fill="url(#bulb)" stroke="#bff3ff" stroke-width="4"/>
      <path d="M-30,20 Q-15,-25 0,20 Q15,-25 30,20" fill="none" stroke="#ffd9a8" stroke-width="6" stroke-linecap="round"/>
      <path d="M-48,96 L48,96 L40,150 L-40,150 Z" fill="#cfd6da" stroke="#8a969c" stroke-width="3"/>
      <rect x="-42" y="112" width="84" height="8" fill="#8a969c"/><rect x="-40" y="128" width="80" height="8" fill="#8a969c"/>
      <path d="M-24,150 L24,150 L12,172 L-12,172 Z" fill="#5d6a70"/>`;
    const BX = 540, BY = 520;
    // text, in world coordinates
    const r1 = line(world, 1330, [run('if'), run('you'), run('can')]);
    const k1 = line(world, 1395, [{ w: 'find', t: tw('find'), cls: 'kw' }, { w: 'a', t: tw('a'), cls: 'kw' }, { w: 'way', t: tw('way'), cls: 'kw' }], {});
    const r2 = line(world, 1900, [{ w: 'to', t: tw('to') }, run('have'), run('those')]);
    const BIG = { font: '128px/1 Anton', color: TXT, letterSpacing: '2px', textShadow: '0 0 30px rgba(95,216,245,.6), 0 6px 0 #0E6E85' };
    const k2 = line(world, 1975, [{ w: 'CHECKS', t: tw('checks'), css: BIG }, { w: 'ROLLING', t: tw('rolling'), css: BIG }, { w: 'IN', t: tw('in'), css: BIG }]);
    const tJ = tw('way'), tT = tw('to');
    const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
    return t => {
      const u = eio((t - 0.05) / (tJ - 0.05));
      const [ax, ay] = bez([-120, 1500], [120, 1650], [160, 760], [260, 860], u);
      const [bx, by] = bez([980, 420], [1060, 980], [760, 720], [540, 860], u);
      gA.setAttribute('transform', `translate(${ax},${ay}) rotate(${lerp(-38, 0, u)} ${s / 2} ${s / 2})`);
      gB.setAttribute('transform', `translate(${bx},${by}) rotate(${lerp(44, 0, u)} ${s / 2} ${s / 2})`);
      const v = (t - tJ) / 0.45;
      bulbG.setAttribute('transform', `translate(${BX},${BY}) scale(${v <= 0 ? 0.0001 : back(v, 2.2)})`);
      bulbG.style.opacity = clamp(v * 3);
      bulbG.querySelectorAll('rect[height="54"]').forEach((r, i) => r.setAttribute('opacity', (0.35 + 0.45 * Math.abs(Math.sin(t * 3 + i))).toFixed(2)));
      const c = eio((t - tT + 0.05) / 0.5);
      world.style.transform = `translateY(${-560 * c}px)`;
      world.style.filter = c > 0.05 && c < 0.95 ? `blur(${3 * Math.sin(Math.PI * c)}px)` : '';
      r1(t); k1(t); r2(t); k2(t);
    };
  },

  // 17.33-18.57  B&W villa (python) + "GET INTO / REAL ESTATE" rising; python shows it only where the sky is
  house_text() {
    const g = el('div', { position: 'absolute', left: '0', width: '1080px', top: '560px', textAlign: 'center', font: '800 64px Montserrat, sans-serif', color: TXT, letterSpacing: '.28em',
      textShadow: '0 4px 20px rgba(0,0,0,.5)' }, S, 'GET INTO');
    const mk = (txt, top) => el('div', { position: 'absolute', left: '0', width: '1080px', top: top + 'px', textAlign: 'center', font: '270px/1 Anton', color: TXT,
      textShadow: Array.from({ length: 14 }, (_, i) => `${0}px ${i + 1}px 0 ${i < 7 ? '#5FD8F5' : '#0E6E85'}`).join(',') + ', 0 30px 40px rgba(0,0,0,.45)' }, S, txt);
    const a = mk('REAL', 650), b = mk('ESTATE', 900);
    const tG = tw('get'), tR = tw('real'), tE = tw('estate');
    return t => {
      reveal(g, t, tG, 30, 0.3);
      for (const [e, t0] of [[a, tR], [b, tE]]) { const u = (t - (t0 - 0.2)) / 0.5; e.style.opacity = clamp(u * 3); e.style.transform = `translateY(${330 * (1 - eo(u))}px)`; }
    };
  },

  // 18.57-19.96  retro CRT with sticky notes: "THE STOCK MARKET"
  crt() {
    const cam = el('div', { position: 'absolute', inset: '0' });
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 70% 45% at 25% 18%, #3b3428 0%, #1a1815 45%, #0F1113 80%)' }, cam);
    el('div', { position: 'absolute', left: '0', top: '1330px', width: '1080px', height: '600px', background: 'linear-gradient(#3a2a1e, #24190f)', boxShadow: 'inset 0 6px 20px rgba(0,0,0,.6)' }, cam);
    for (const [x, y, r, o] of [[860, 260, 70, .25], [120, 330, 50, .18], [960, 620, 40, .2], [700, 140, 30, .22]])
      el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: 2 * r + 'px', height: 2 * r + 'px', borderRadius: '50%', background: '#ffcf8a', opacity: o, filter: 'blur(10px)' }, cam);
    const mon = el('div', { position: 'absolute', left: '130px', top: '520px', width: '820px', height: '650px', borderRadius: '46px', background: 'linear-gradient(160deg,#ece3cc,#c9bea3 60%,#a99e84)',
      boxShadow: 'inset 0 -10px 20px rgba(0,0,0,.18), inset 0 6px 10px rgba(255,255,255,.5), 0 40px 60px rgba(0,0,0,.6)' }, cam);
    const scr = el('div', { position: 'absolute', left: '62px', top: '56px', width: '696px', height: '480px', borderRadius: '36px', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 45%, #0f3440 0%, #061418 70%, #020708 100%)', boxShadow: 'inset 0 0 40px rgba(0,0,0,.9), 0 0 0 10px #9f957c' }, mon);
    const NS = 'http://www.w3.org/2000/svg'; const sv = document.createElementNS(NS, 'svg'); sv.setAttribute('width', 696); sv.setAttribute('height', 480); sv.style.position = 'absolute'; scr.appendChild(sv);
    const pts = [[30, 400], [110, 370], [170, 385], [240, 320], [300, 340], [370, 260], [430, 285], [500, 200], [560, 215], [640, 110]];
    sv.innerHTML = `<g opacity=".25" stroke="#5FD8F5">${[100, 200, 300, 400].map(y => `<line x1="0" x2="696" y1="${y}" y2="${y}"/>`).join('')}</g>
      <polyline id="ch" points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#5FD8F5" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 8px #5FD8F5)"/>`;
    const ch = sv.querySelector('#ch'); const L = ch.getTotalLength(); ch.style.strokeDasharray = L;
    const s1 = el('div', { position: 'absolute', left: '0', width: '696px', top: '120px', textAlign: 'center', font: '96px/1 Anton', color: '#dff8ff', textShadow: '0 0 18px #5FD8F5' }, scr, 'THE STOCK');
    const s2 = el('div', { position: 'absolute', left: '0', width: '696px', top: '225px', textAlign: 'center', font: '150px/1 Anton', color: ACC, textShadow: '0 0 24px #5FD8F5' }, scr, 'MARKET');
    el('div', { position: 'absolute', inset: '0', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 5px)' }, scr);
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.12), transparent 50%)' }, scr);
    el('div', { position: 'absolute', left: '400px', top: '1170px', width: '280px', height: '90px', background: 'linear-gradient(#cfc4a9,#a99e84)', clipPath: 'polygon(12% 0,88% 0,100% 100%,0 100%)' }, cam);
    el('div', { position: 'absolute', left: '320px', top: '1250px', width: '440px', height: '60px', borderRadius: '50%', background: 'linear-gradient(#d8cdb2,#a2977d)', boxShadow: '0 20px 30px rgba(0,0,0,.5)' }, cam);
    el('div', { position: 'absolute', left: '150px', top: '1430px', width: '780px', height: '170px', borderRadius: '18px', background: 'linear-gradient(#e2d8bf,#b8ad92)',
      backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 54px, rgba(0,0,0,.18) 54px 58px), repeating-linear-gradient(0deg, transparent 0 38px, rgba(0,0,0,.18) 38px 42px), linear-gradient(#e2d8bf,#b8ad92)',
      boxShadow: '0 20px 30px rgba(0,0,0,.5)', transform: 'perspective(900px) rotateX(35deg)' }, cam);
    const NOTES = [['Index funds', 40, 380, -8, ACC], ['Dividends', 830, 400, 7, TXT], ['Buy & hold', 30, 960, 6, '#BFEFFB'], ['Long term', 840, 980, -6, ACC], ['Portfolio', 150, 1620, -4, TXT], ['Compound', 690, 1630, 5, '#BFEFFB']];
    const notes = NOTES.map(([txt, x, y, r, c]) => el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: '210px', height: '200px', background: c, boxShadow: '0 14px 24px rgba(0,0,0,.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '40px/1.05 "Permanent Marker", cursive', color: BASE, padding: '16px', boxSizing: 'border-box', '--r': r + 'deg' }, cam, txt));
    const tS = tw('stock'), tM = tw('market');
    return t => {
      cam.style.transform = `scale(${1 + 0.05 * t / DUR})`;
      notes.forEach((n, i) => { const u = (t - i * 0.06) / 0.3; n.style.opacity = clamp(u * 2); n.style.transform = `rotate(${n.style.getPropertyValue('--r')}) scale(${back(u)})`; });
      ch.style.strokeDashoffset = L * (1 - eo((t - 0.1) / 1.1));
      reveal(s1, t, tS, 30, 0.25); reveal(s2, t, tM, 30, 0.25);
    };
  },

  // 19.96-24.95  offer letter on a cutting mat, then the camera pans to "that brings the money in" + MONEY IN sticker
  offer() {
    const world = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '3600px', transformOrigin: '540px 900px',
      backgroundColor: '#2C6A4A', backgroundImage: 'linear-gradient(rgba(255,255,255,.16) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.16) 2px, transparent 2px), linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)',
      backgroundSize: '250px 250px, 250px 250px, 50px 50px, 50px 50px' });
    for (let i = 1; i < 14; i++) el('div', { position: 'absolute', left: '14px', top: (i * 250 - 14) + 'px', font: '600 22px Inter', color: 'rgba(255,255,255,.45)' }, world, String(i * 5));
    const paper = el('div', { position: 'absolute', left: '140px', top: '230px', width: '800px', height: '1080px', background: '#FBFAF6', transform: 'rotate(-2deg)', boxShadow: '0 30px 50px rgba(0,0,0,.45)', padding: '70px 70px', boxSizing: 'border-box' }, world);
    const head = el('div', { display: 'flex', alignItems: 'center', gap: '22px' }, paper);
    el('div', { width: '70px', height: '70px', borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #9df0ff, ${ACCD})` }, head);
    el('div', { font: '86px/1 Anton', color: BASE, letterSpacing: '1px' }, head, 'OFFER LETTER');
    el('div', { font: '500 30px Inter', color: '#59606a', marginTop: '18px' }, paper, 'Employment offer');
    el('div', { height: '3px', background: BASE, margin: '30px 0 40px' }, paper);
    el('div', { font: '500 34px Inter', color: BASE, marginBottom: '26px' }, paper, 'Dear Candidate,');
    for (const w of [92, 85, 96, 60]) el('div', { height: '16px', width: w + '%', background: '#d9dcdf', borderRadius: '8px', marginBottom: '20px' }, paper);
    const pos = el('div', { position: 'relative', marginTop: '36px', font: '500 32px Inter', color: '#59606a' }, paper, 'Position');
    const posV = el('div', { position: 'relative', display: 'inline-block', font: 'italic 500 88px/1.1 "Playfair Display", serif', color: BASE, marginTop: '8px' }, paper);
    const hl = el('span', { position: 'absolute', left: '-10px', right: '-10px', top: '42%', height: '48%', background: 'rgba(95,216,245,.65)', transformOrigin: 'left', zIndex: '0' }, posV);
    el('span', { position: 'relative', zIndex: '1' }, posV, 'Full-time');
    for (const w of [70, 88, 55]) el('div', { height: '16px', width: w + '%', background: '#d9dcdf', borderRadius: '8px', margin: '22px 0 0' }, paper);
    el('div', { position: 'absolute', left: '70px', bottom: '90px', width: '300px', height: '3px', background: BASE }, paper);
    el('div', { position: 'absolute', left: '70px', bottom: '50px', font: '500 26px Inter', color: '#59606a' }, paper, 'Signature');
    const stamp = el('div', { position: 'absolute', right: '60px', bottom: '70px', width: '270px', height: '270px', borderRadius: '50%', border: `12px solid ${ACCD}`, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center', font: '92px/1 Anton', color: ACCD, opacity: '0' }, paper, 'HIRED');
    const cap = line(world, 1390, [run('you'), run('find'), { w: 'a', t: tw('a') }]);
    const capK = line(world, 1450, [{ w: 'full-time job', t: tw('full-time'), cls: 'kw', css: { fontSize: '140px' } }]);
    const card = el('div', { position: 'absolute', left: '110px', top: '1880px', width: '860px', height: '860px', background: '#FBFAF6', transform: 'rotate(1.5deg)', boxShadow: '0 30px 50px rgba(0,0,0,.45)' }, world);
    const words = [['that', 'that'], ['brings', 'brings'], ['the', 'the'], ['money', 'money'], ['in', 'in']];
    const ln1 = el('div', { position: 'absolute', left: '0', width: '860px', top: '170px', textAlign: 'center', font: '500 128px/1.05 "Playfair Display", serif', color: BASE }, card);
    const ln2 = el('div', { position: 'absolute', left: '0', width: '860px', top: '320px', textAlign: 'center', font: '500 128px/1.05 "Playfair Display", serif', color: BASE }, card);
    const sp = words.map(([w, k], i) => [el('span', {}, i < 2 ? ln1 : ln2, (i % 2 && i < 2) || i === 3 || i === 4 ? ' ' + w : w, 'w'), tw(k)]);
    const sticker = el('div', { position: 'absolute', left: '150px', top: '540px', padding: '18px 40px', background: 'rgba(15,17,19,.88)', borderRadius: '14px', font: '150px/1 Anton', color: ACC,
      textShadow: '0 0 20px rgba(95,216,245,.6)', transform: 'rotate(-6deg)', opacity: '0', boxShadow: '0 14px 30px rgba(0,0,0,.4)' }, card, 'MONEY IN');
    const tF = tw('full-time'), tJ = tw('job'), tTh = tw('that'), tM = tw('money');
    return t => {
      const pan = eio((t - (tTh - 0.42)) / 0.45);
      world.style.transform = `translateY(${-1620 * pan}px) scale(${1 + 0.03 * t / DUR})`;
      world.style.filter = pan > 0.05 && pan < 0.95 ? `blur(${4 * Math.sin(Math.PI * pan)}px)` : '';
      paper.style.transform = `rotate(-2deg) translateY(${60 * (1 - eo(t / 0.5))}px)`;
      hl.style.transform = `scaleX(${eo((t - (tF - 0.05)) / 0.35)})`;
      const us = (t - (tJ - 0.05)) / 0.3; stamp.style.opacity = clamp(us * 3) * 0.92; stamp.style.transform = `rotate(-14deg) scale(${lerp(1.8, 1, eo(us))})`;
      cap(t); capK(t); sp.forEach(([s, t0]) => reveal(s, t, t0, 24, 0.25));
      const um = (t - (tM - 0.05)) / 0.28; sticker.style.opacity = clamp(um * 3); sticker.style.transform = `rotate(-6deg) scale(${lerp(1.7, 1, back(um, 1.4))})`;
    };
  },

  // 24.95-26.61  A-roll: "THEN / PURSUE THIS" (wide uppercase, glow keyword)
  pursue() {
    const a = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1330px', textAlign: 'center', font: '600 52px Montserrat, sans-serif', color: TXT, letterSpacing: '.35em',
      textShadow: '0 3px 14px rgba(0,0,0,.6)' }, S, 'THEN');
    const b = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1400px', textAlign: 'center', font: '800 118px Montserrat, sans-serif', color: ACC, letterSpacing: '.02em',
      textShadow: '0 0 30px rgba(95,216,245,.6), 0 4px 18px rgba(0,0,0,.6)' }, S);
    const p = el('span', {}, b, 'PURSUE', 'w'), th = el('span', {}, b, ' THIS', 'w');
    return t => { reveal(a, t, 0.1); reveal(p, t, tw('pursue')); reveal(th, t, tw('this')); };
  },

  // 26.61-31.61  A-roll captions, "STARVING (red) ACTORS"
  cap_starving() {
    const mk = () => el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const c1 = mk(), c2 = mk(), c3 = mk(), c4 = mk();
    const l1 = line(c1, 1420, [run('because'), run('if'), run('you'), run('are')]);
    const l2 = line(c2, 1420, [run('going'), { w: 'to', t: tw('to') }, run('be')]);
    const l3 = line(c3, 1420, [run('what'), { w: 'I', t: tw('i') }, run('call'), run('one'), run('of'), run('those')]);
    const l4 = line(c4, 1330, [{ w: 'starving', t: tw('starving'), cls: 'kw kwn', css: { fontSize: '180px' } }, { w: 'actors', t: tw('actors'), cls: 'kw', css: { fontSize: '180px' } }]);
    const T = [0, tw('going'), tw('what'), tw('starving'), DUR + 1];
    return t => { [c1, c2, c3, c4].forEach((c, i) => chunkVis(c, t, T[i], T[i + 1] - LEAD)); l1(t); l2(t); l3(t); l4(t); };
  },

  // 31.61-34.39  over the shop-counter B-roll: a lottery ticket slides onto the counter
  lottery() {
    const tk = el('div', { position: 'absolute', left: '170px', top: '700px', width: '740px', height: '370px', borderRadius: '30px',
      background: 'linear-gradient(#fbf2da,#ead6a8)', boxShadow: 'inset 0 0 0 12px #fbf2da, inset 0 0 0 16px #c49a4a, 0 40px 60px rgba(0,0,0,.5)', transformOrigin: '50% 50%' });
    el('div', { position: 'absolute', left: '190px', top: '30px', height: '310px', borderLeft: '4px dashed #b0884a' }, tk);
    el('div', { position: 'absolute', left: '-40px', top: '160px', width: '300px', transform: 'rotate(-90deg)', textAlign: 'center', font: '44px Anton', color: BASE, letterSpacing: '2px' }, tk, 'No. 0451');
    el('div', { position: 'absolute', left: '190px', width: '550px', top: '40px', textAlign: 'center', font: '108px/1 Anton', color: ACCD }, tk, 'LOTTERY');
    el('div', { position: 'absolute', left: '190px', width: '550px', top: '152px', textAlign: 'center', font: '600 30px Inter', color: BASE, letterSpacing: '.5em' }, tk, 'TICKET');
    const balls = el('div', { position: 'absolute', left: '190px', width: '550px', top: '200px', display: 'flex', justifyContent: 'center', gap: '16px' }, tk);
    for (const n of ['07', '14', '23', '38', '41']) el('div', { width: '72px', height: '72px', borderRadius: '50%', background: '#fffdf6', boxShadow: `inset 0 0 0 5px ${ACC}`, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 30px Inter', color: BASE }, balls, n);
    el('div', { position: 'absolute', left: '260px', top: '290px', width: '410px', height: '50px', borderRadius: '14px', background: 'linear-gradient(90deg,#d6d8de,#9fa3ab)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 24px Inter', color: '#5f636b', letterSpacing: '.2em' }, tk, 'SCRATCH HERE');
    const c1 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }), c2 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }), c3 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const l1 = line(c1, 1420, [{ w: 'I', t: tw('mean') - 0.25 }, run('mean,'), run("you're")]);
    const l2 = line(c2, 1420, [run('better'), run('off'), run('buying'), { w: 'a', t: tw('a') }]);
    const l3 = line(c3, 1360, [{ w: 'lottery ticket', t: tw('lottery'), cls: 'kw', css: { fontSize: '170px' } }]);
    const tL = tw('lottery'), T = [0, tw('better'), tL, DUR + 1];
    return t => {
      [c1, c2, c3].forEach((c, i) => chunkVis(c, t, T[i], T[i + 1] - LEAD)); l1(t); l2(t); l3(t);
      const u = (t - (tL - 0.45)) / 0.5;
      tk.style.opacity = clamp(u * 4);
      tk.style.transform = `translateX(${lerp(900, 0, eo(u))}px) rotate(${lerp(22, -5, eo(u)) + 0.8 * Math.sin(t * 2)}deg) scale(${lerp(0.9, 1, eo(u)) + 0.015 * clamp(t - tL)})`;
    };
  },

  // 34.39-34.95  "Yeah." (interviewer, off camera) in bold
  cap_yeah() {
    const y = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1330px', textAlign: 'center', font: '800 170px Inter, sans-serif', color: TXT,
      textShadow: '0 0 30px rgba(95,216,245,.45), 0 6px 22px rgba(0,0,0,.6)' }, S, 'YEAH.');
    return t => { const u = t / 0.22; y.style.opacity = clamp(u * 2); y.style.transform = `scale(${lerp(0.6, 1, back(u))})`; };
  },

  // 34.95-36.69  red-light style: run-in + serif italic in a box (negative = red box)
  cap_dont() {
    const r1 = line(S, 1225, [run('so')]);
    const box = el('div', { position: 'absolute', left: '170px', top: '1300px', width: '740px', height: '180px', borderRadius: '16px', background: NEG, transformOrigin: 'left center',
      boxShadow: '0 14px 30px rgba(0,0,0,.45)' });
    const inner = el('div', { position: 'absolute', left: '170px', width: '740px', top: '1312px', textAlign: 'center', font: 'italic 400 140px/1 "Instrument Serif", serif', color: '#fff' });
    const sp = [['don\'t', 'don\'t'], [' do', 'do'], [' that', 'that']].map(([w, k]) => [el('span', {}, inner, w, 'w'), tw(k)]);
    const r2 = line(S, 1510, [{ w: 'to', t: tw('to') }, run('yourselves.')]);
    const tD = tw("don't");
    return t => {
      r1(t); r2(t);
      const u = (t - (tD - 0.12)) / 0.25; box.style.opacity = clamp(u * 3); box.style.transform = `scaleX(${eo(u)})`;
      sp.forEach(([s, t0]) => reveal(s, t, t0, 20));
    };
  },

  // 36.69-38.17  editorial (skin-slowdown style) over the family B-roll
  family_text() {
    el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', background: 'linear-gradient(rgba(15,17,19,.15), rgba(15,17,19,0) 30%, rgba(15,17,19,.55) 100%)' });
    el('div', { position: 'absolute', left: '60px', top: '120px', font: '600 22px Inter', color: TXT, opacity: '.75', letterSpacing: '.22em' }, S, 'HOW THEY STARTED');
    el('div', { position: 'absolute', right: '60px', top: '120px', font: '600 22px Inter', color: TXT, opacity: '.75', letterSpacing: '.22em' }, S, 'FAMILY FIRST');
    const ghost = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1010px', textAlign: 'center', font: '600 250px/1 "Playfair Display", serif', color: TXT, opacity: '0', letterSpacing: '.04em' }, S, 'FAMILY');
    const NS = 'http://www.w3.org/2000/svg'; const sv = document.createElementNS(NS, 'svg'); sv.setAttribute('width', 1080); sv.setAttribute('height', 1920); sv.style.position = 'absolute'; S.appendChild(sv);
    sv.innerHTML = `<circle cx="540" cy="1360" r="400" fill="none" stroke="#5FD8F5" stroke-width="2.5" opacity=".8" transform="rotate(-90 540 1360)"/>`;
    const circ = sv.querySelector('circle'); const L = 2 * Math.PI * 400; circ.style.strokeDasharray = L;
    const r1 = line(S, 1240, [{ w: "DON'T", t: tw("don't") }, run('do'), run('that'), { w: 'to', t: tw('to') }], { font: '600 44px Montserrat, sans-serif', letterSpacing: '.2em', textTransform: 'uppercase' });
    const big = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1305px', textAlign: 'center', font: 'italic 500 150px/1 "Playfair Display", serif', color: TXT, textShadow: '0 6px 26px rgba(0,0,0,.55)' }, S);
    const s1 = el('span', {}, big, 'your', 'w'), s2 = el('span', { color: ACC }, big, ' families', 'w');
    return t => {
      ghost.style.opacity = 0.2 * eo(t / 0.6); ghost.style.transform = `scale(${1.06 - 0.06 * eo(t / 1.4)})`;
      circ.style.strokeDashoffset = L * (1 - eo(t / 1.3));
      r1(t); reveal(s1, t, tw('your'), 30); reveal(s2, t, tw('families'), 30);
    };
  },
};

let update = null;
document.fonts.ready.then(() => {
  update = SCENES[NAME]();
  window.renderAt = t => update(t);
  update(0);
  window.READY = true;
});
