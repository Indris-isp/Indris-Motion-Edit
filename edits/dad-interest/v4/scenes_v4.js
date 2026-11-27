// Dad-interest v4: premium redesign from the reference sheets.
//  * Giant condensed type (V04 "I'M 23", "UNIVERSITY", "ENTREPRENEURS"), behind the speaker or the B-roll subject.
//  * Cinematic stock B-roll with one big word each (V04 / V05), an editorial serif for the soft beats (V06).
//  * Clean UI cards on a warm gradient for the loan beats (V13: orange gradient, cards, chips, a red glow on the "no").
// Helpers (el, line, reveal, chunkVis, tw, run, eo, eio, back, lerp, clamp, LEAD) come from scenes.js.
const G = { gold: '#F2C35B', goldDeep: '#B8862B', cream: '#FBF3E2', ink: '#1B1712', inkSoft: '#6B6158', red: '#E5483A', white: '#F7F3EC' };

// ------------------------------------------------------------------ type
function giant(parent, text, { top, size, word, tracking = 2, color = G.white, rise = 160, delay = 0.35, align = 'center', left = 0, width = 1080, lh = 0.9 }) {
  const e = el('div', { position: 'absolute', left: left + 'px', width: width + 'px', top: top + 'px', textAlign: align, font: `${size}px/${lh} Anton, "Bebas Neue", sans-serif`,
    color, letterSpacing: tracking + 'px', whiteSpace: 'pre',
    textShadow: color === G.white ? '0 18px 48px rgba(0,0,0,.35)'            // light glow on the coloured words only
      : '0 0 18px rgba(242,195,91,.55), 0 0 46px rgba(242,195,91,.28), 0 18px 48px rgba(0,0,0,.35)' }, parent, text);
  e.dataset.layer = 'back';
  const t0 = typeof word === 'number' ? word : tw(word);
  return t => {
    const u = (t - (t0 - delay)) / 0.42;
    e.style.opacity = clamp(u * 1.8);
    e.style.transform = `translateY(${rise * (1 - eo(u))}px) scale(${lerp(1.12, 1, eo(u)) + 0.025 * clamp((t - t0) / 2)})`;
    e.style.filter = `blur(${(14 * (1 - eo(u))).toFixed(1)}px)`;
    return e;
  };
}
function serif(parent, text, { top, size = 230, word, color = G.gold, glow = true }) {
  const e = el('div', { position: 'absolute', left: '0', width: '1080px', top: top + 'px', textAlign: 'center', font: `italic 400 ${size}px/0.95 "Instrument Serif", serif`, color,
    textShadow: glow ? (color === G.white ? '0 0 24px rgba(255,240,210,.30), 0 6px 26px rgba(0,0,0,.45)'
      : '0 0 16px rgba(242,195,91,.60), 0 0 44px rgba(242,195,91,.30), 0 6px 26px rgba(0,0,0,.45)') : 'none' }, parent, text);
  e.dataset.layer = 'front';
  const t0 = typeof word === 'number' ? word : tw(word);
  return t => { reveal(e, t, t0, 34, 0.3); return e; };
}
const R = (w, extra = {}) => Object.assign({ w, t: tw(norm(w)) }, { css: Object.assign({ font: '600 62px Inter, sans-serif', color: G.white, textShadow: '0 3px 16px rgba(0,0,0,.6)' }, extra) });
function count(e, text, t, t0, d = 0.5) {           // count-up that lands on the spoken number: "$20" -> "$0".."$20"
  const n = +text.replace(/\D/g, ''), v = Math.round(n * eo((t - (t0 - d)) / d));
  e.textContent = text.replace(/\d+/, String(v));
}

// ------------------------------------------------------------------ warm gradient world for the UI cards (V13)
function uiWorld() {
  el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(120% 80% at 50% 18%, #FFF8EA 0%, #F8E3B8 38%, #EDB95E 72%, #C98A2E 100%)' });
  el('div', { position: 'absolute', inset: '0', opacity: '.09', backgroundImage: 'radial-gradient(rgba(60,40,10,.9) 1px, transparent 1.2px)', backgroundSize: '6px 6px', mixBlendMode: 'multiply' });
}
function card(parent, { top, h, w = 860 }) {
  return el('div', { position: 'absolute', left: (1080 - w) / 2 + 'px', top: top + 'px', width: w + 'px', height: h + 'px', borderRadius: '44px', background: 'linear-gradient(180deg,#FFFFFF,#FFF9EE)',
    boxShadow: '0 50px 90px rgba(120,70,10,.30), 0 10px 24px rgba(120,70,10,.18), inset 0 1px 0 rgba(255,255,255,.9)', overflow: 'hidden' }, parent);
}
function avatar(parent, x, y, s, letter, hue) {
  const a = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', borderRadius: '50%', background: `linear-gradient(150deg, hsl(${hue},55%,62%), hsl(${hue},45%,38%))`,
    display: 'grid', placeItems: 'center', font: `700 ${s * 0.42}px Inter`, color: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,.18)' }, parent, letter);
  return a;
}
function chip(parent, text, { x, y, bg = G.gold, fg = '#2A1C06', size = 40 }) {
  return el('div', { position: 'absolute', left: x + 'px', top: y + 'px', padding: `${size * 0.32}px ${size * 0.62}px`, borderRadius: '999px', background: bg, color: fg, font: `700 ${size}px Inter`,
    boxShadow: '0 10px 26px rgba(184,134,43,.35)', whiteSpace: 'nowrap' }, parent, text);
}
function pop(e, t, t0, d = 0.32) { const u = (t - t0) / d; e.style.opacity = clamp(u * 2); e.style.transform = `scale(${0.6 + 0.4 * back(u)})`; e.style.filter = `blur(${8 * (1 - eo(u))}px)`; }
function slideUp(e, t, t0, d = 0.5, dy = 120) { const u = (t - t0) / d; e.style.opacity = clamp(u * 2); e.style.transform = `translateY(${dy * (1 - eo(u))}px)`; }
// dark-ink captions inside the light UI world (run-in Inter + serif keyword in deep gold)
function uiCaption(parent, y, items) {
  return line(parent, y, items.map(([w, t, kw]) => ({ w, t, css: kw ? { font: 'italic 400 150px/1 "Instrument Serif", serif', color: G.goldDeep, textShadow: '0 0 14px rgba(242,195,91,.55), 0 0 34px rgba(255,214,140,.35)' } : { font: '600 60px Inter, sans-serif', color: G.ink, textShadow: 'none' } })));
}

Object.assign(SCENES, {
  // ------------------------------------------------------------------ text behind the speaker (python masks it with her matte)
  r20a() {
    const g = giant(S, '$20', { top: 40, size: 640, word: '20', delay: 0.5, tracking: 0 });
    const t0 = tw('20');
    return t => { const e = g(t); count(e, '$20', t, t0, 0.5); };
  },
  r20b() { const g = giant(S, '$20', { top: 40, size: 640, word: '20', tracking: 0 }); return t => g(t); },
  r15() {
    const a = giant(S, 'AGE', { top: 120, size: 300, word: '15', delay: 0.6, tracking: 8, align: 'left', left: 70, width: 520 });
    const b = giant(S, '15', { top: 120, size: 300, word: '15', delay: 0.45, tracking: 0, align: 'right', left: 520, width: 490, color: G.gold });
    const t0 = tw('15');
    return t => { a(t); count(b(t), '15', t, t0, 0.45); };
  },
  rent() { const g = giant(S, 'ENTREPRENEURSHIP', { top: 150, size: 132, word: 'entrepreneurship', delay: 0.3, tracking: 1 }); return t => g(t); },
  // over the young-entrepreneur B-roll, behind her
  rfirst() {
    const r = line(S, 1390, [R('so'), R('that'), R('was'), R('my')]);
    const a = giant(S, 'FIRST', { top: 330, size: 420, word: 'first', tracking: 6 });
    const b = giant(S, 'BUSINESS', { top: 700, size: 250, word: 'business', tracking: 4, color: G.gold });
    const s1 = el('div', { position: 'absolute', left: '0', width: '1080px', top: '1500px', textAlign: 'center', font: 'italic 400 96px "Instrument Serif"', color: G.white, textShadow: '0 4px 20px rgba(0,0,0,.6)' }, S, 'entrepreneurial');
    s1.dataset.layer = 'front';
    const te = tw('entrepreneur');
    return t => { r(t); a(t); b(t); reveal(s1, t, te, 30); };
  },

  // ------------------------------------------------------------------ B-roll overlays
  o_interest() {                                  // cash changes hands: "you gotta pay me back with +$5 INTEREST"
    const r1 = line(S, 230, [R('you'), R('gotta'), R('pay'), R('me'), R('back'), R('with')]);
    const n = giant(S, '+$5', { top: 330, size: 520, word: '5', delay: 0.3, tracking: 0, color: G.white });
    const k = serif(S, 'interest', { top: 1300, size: 250, word: 'interest' });
    return t => { r1(t); n(t); k(t); };
  },
  o_dad() {                                       // AI: dad hands her the allowance. Text in the open top-left, clear of both faces
    const box = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const l1 = el('div', { position: 'absolute', left: '76px', top: '250px', font: '600 40px Inter', letterSpacing: '14px', color: 'rgba(247,243,236,.9)', textShadow: '0 3px 14px rgba(0,0,0,.55)' }, box, 'MY');
    const k = el('div', { position: 'absolute', left: '64px', top: '290px', font: 'italic 400 280px/0.95 "Instrument Serif", serif', color: G.white,
      textShadow: '0 0 30px rgba(242,195,91,.35), 0 6px 26px rgba(0,0,0,.55)' }, box, 'dad');
    const r = el('div', { position: 'absolute', left: '76px', top: '590px', font: '600 62px Inter', color: G.white, textShadow: '0 3px 16px rgba(0,0,0,.6)' }, box);
    const ws = ['he', 'would', 'give', 'me'].map((w, i) => [el('span', { display: 'inline-block', whiteSpace: 'pre' }, r, (i ? ' ' : '') + w), tw(w)]);
    [l1, k, r].forEach(e => e.dataset.layer = 'front');
    const tm = tw('my'), td = tw('dad');
    return t => { reveal(l1, t, tm, 20); reveal(k, t, td, 34, 0.3); ws.forEach(([e, t0]) => reveal(e, t, t0)); };
  },
  o_allow() { const g = giant(S, 'ALLOWANCE', { top: 220, size: 232, word: 'allowance', delay: 0.2, tracking: 3 }); return t => g(t); },
  o_shop() {
    const r = line(S, 300, [R('I'), R("wasn't"), R('into')]);
    const g = giant(S, 'SHOPPING', { top: 390, size: 270, word: 'shopping', tracking: 3 });
    const st = el('div', { position: 'absolute', left: '80px', top: '505px', width: '920px', height: '18px', background: G.red, borderRadius: '9px', transformOrigin: 'left center', boxShadow: '0 8px 22px rgba(229,72,58,.45)' }, S);
    const ts = tw('shopping');
    return t => { r(t); g(t); st.style.transform = `scaleX(${eo((t - ts - 0.35) / 0.25)}) rotate(-3deg)`; };
  },
  o_books() {
    const r = line(S, 230, [R('I'), R('would'), R('just'), R('buy')]);
    const g = giant(S, 'BOOKS', { top: 320, size: 420, word: 'books', delay: 0.25, tracking: 6, color: G.white });
    return t => { r(t); g(t); };
  },
  o_broke() {
    const r = line(S, 240, [R('they'), R('ran')]);
    const a = giant(S, 'OUT OF', { top: 330, size: 250, word: 'out', tracking: 4 });
    const b = giant(S, 'MONEY', { top: 560, size: 330, word: 'money', tracking: 4, color: G.gold });
    return t => { r(t); a(t); b(t); };
  },
  o_knock() {                                    // the bedroom door: knock... knock
    const r = line(S, 1450, [R('he'), R('knocked'), R('on'), R('my'), R('room'), R('door')]);
    const k1 = giant(S, 'KNOCK', { top: 260, size: 300, word: 'knocked', delay: 0.15, tracking: 6, rise: 0 });
    const k2 = giant(S, 'KNOCK', { top: 560, size: 300, word: 'door', delay: 0.15, tracking: 6, rise: 0, color: G.gold });
    return t => { r(t); k1(t); k2(t); };
  },
  o_friends() {                                  // AI: friends at the lockers, "they came to me for MONEY"
    const r = line(S, 1230, [R('they'), R('came'), R('to'), R('me'), R('for')]);
    const k = serif(S, 'money', { top: 1300, size: 260, word: 'money' });
    return t => { r(t); k(t); };
  },
  o_stash() {
    const r = line(S, 1240, [R('I'), R('went'), R('in'), R('my')]);
    const k = serif(S, 'drawer', { top: 1310, size: 260, word: 'drawer' });
    return t => { r(t); k(t); };
  },
  o_count() {
    const r = line(S, 230, [R('started')]);
    const g = giant(S, 'COUNTING', { top: 320, size: 270, word: 'counting', delay: 0.25, tracking: 4 });
    const r2 = line(S, 1520, [R('all'), R('my'), R('money')]);
    return t => { r(t); g(t); r2(t); };
  },

  // ------------------------------------------------------------------ UI worlds
  ui_mid() {                                      // "in the middle of the month": calendar card, days crossed, the 15th circled
    uiWorld();
    const c = card(S, { top: 330, h: 900 });
    el('div', { position: 'absolute', left: '64px', top: '56px', font: '700 30px Inter', letterSpacing: '6px', color: G.inkSoft }, c, 'NOVEMBER');
    el('div', { position: 'absolute', right: '64px', top: '50px', font: '600 30px Inter', color: G.goldDeep, background: '#FFF1D2', padding: '8px 20px', borderRadius: '999px' }, c, 'allowance: the 1st');
    const days = [];
    for (let d = 1; d <= 30; d++) {
      const k = d - 1 + 5, x = 64 + (k % 7) * 104, y = 150 + Math.floor(k / 7) * 118;
      const cell = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: '96px', height: '96px', borderRadius: '24px', display: 'grid', placeItems: 'center',
        font: '600 40px Inter', color: G.ink, background: '#F6F0E4' }, c, String(d));
      days.push(cell);
    }
    const ring = el('div', { position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', border: `8px solid ${G.red}`, boxShadow: `0 0 30px rgba(229,72,58,.55)` }, c);
    const k15 = 14 + 5; ring.style.left = (64 + (k15 % 7) * 104 - 12) + 'px'; ring.style.top = (150 + Math.floor(k15 / 7) * 118 - 12) + 'px';
    const cap = uiCaption(S, 1340, [['in', tw('in')], ['the', tw('the')], ['middle', tw('middle'), 1]]);
    const cap2 = uiCaption(S, 1500, [['of', tw('of')], ['the', tw('the', 1)], ['month', tw('month')]]);
    const tm = tw('middle');
    return t => {
      slideUp(c, t, -0.05, 0.45, 160);
      days.forEach((e, i) => { const dd = i + 1, u = clamp((t - 0.05 - dd * 0.045) / 0.12);
        if (dd < 15) { e.style.background = `rgba(229,72,58,${0.10 * u})`; e.style.color = u > 0.5 ? 'rgba(27,23,18,.35)' : G.ink; e.style.textDecoration = u > 0.5 ? 'line-through' : 'none'; } });
      pop(ring, t, tm - 0.05, 0.3);
      cap(t); cap2(t);
    };
  },
  ui_loan1() {                                    // "but they had to pay INTEREST": two loan cards, +interest chips pop
    uiWorld();
    const h = el('div', { position: 'absolute', left: '0', width: '1080px', top: '230px', textAlign: 'center', font: '700 34px Inter', letterSpacing: '8px', color: G.inkSoft }, S, 'LOANS · AGE 15');
    const rows = [['Friends', 'F', 210, 330], ['Family', 'M', 30, 640]].map(([name, l, hue, y]) => {
      const c = card(S, { top: y, h: 250, w: 900 });
      avatar(c, 48, 65, 120, l, hue);
      el('div', { position: 'absolute', left: '200px', top: '62px', font: '700 54px Inter', color: G.ink }, c, name);
      el('div', { position: 'absolute', left: '200px', top: '136px', font: '500 36px Inter', color: G.inkSoft }, c, 'borrowed · mid-month');
      const ch = chip(c, '+ interest', { x: 560, y: 80, size: 44 });
      return [c, ch];
    });
    const cap = uiCaption(S, 1100, [['but', tw('but')], ['they', tw('they')], ['had', tw('had')], ['to', tw('to', 1)], ['pay', tw('pay')]]);
    const k = uiCaption(S, 1190, [['interest', tw('interest'), 1]]);
    const ti = tw('interest');
    return t => {
      slideUp(h, t, 0, 0.4, 40);
      rows.forEach(([c, ch], i) => { slideUp(c, t, 0.05 + i * 0.12, 0.5, 200); pop(ch, t, ti - 0.05 + i * 0.12, 0.32); });
      cap(t); k(t);
    };
  },
  ui_loan2() {                                    // "daddy, remember you owe me $20 and plus $5 for interest": invoice, total counts to $25
    uiWorld();
    const c = card(S, { top: 300, h: 930, w: 880 });
    avatar(c, 56, 60, 130, 'D', 25);
    el('div', { position: 'absolute', left: '214px', top: '66px', font: '700 58px Inter', color: G.ink }, c, 'Daddy');
    el('div', { position: 'absolute', left: '214px', top: '140px', font: '500 36px Inter', color: G.inkSoft }, c, 'payment request · payday');
    el('div', { position: 'absolute', left: '56px', right: '56px', top: '240px', height: '2px', background: '#EFE5D3' }, c);
    const row = (y, label, amt, gold) => {
      const r = el('div', { position: 'absolute', left: '56px', right: '56px', top: y + 'px', height: '110px' }, c);
      el('div', { position: 'absolute', left: '0', top: '22px', font: '600 50px Inter', color: G.ink }, r, label);
      const a = el('div', { position: 'absolute', right: '0', top: '14px', font: '800 64px Inter', color: gold ? G.goldDeep : G.ink }, r, amt);
      return [r, a];
    };
    const [r1] = row(290, 'Loan', '$20', false), [r2] = row(420, 'Interest', '+$5', true);
    el('div', { position: 'absolute', left: '56px', right: '56px', top: '580px', height: '2px', background: '#EFE5D3' }, c);
    el('div', { position: 'absolute', left: '56px', top: '640px', font: '700 40px Inter', letterSpacing: '6px', color: G.inkSoft }, c, 'TOTAL DUE');
    const tot = el('div', { position: 'absolute', right: '56px', top: '600px', font: '400 180px/1 Anton', color: G.ink }, c, '$0');
    const btn = el('div', { position: 'absolute', left: '56px', right: '56px', bottom: '56px', height: '110px', borderRadius: '30px', background: `linear-gradient(180deg, ${G.gold}, ${G.goldDeep})`,
      display: 'grid', placeItems: 'center', font: '700 46px Inter', color: '#2A1C06', boxShadow: '0 14px 30px rgba(184,134,43,.4)' }, c, 'Request $25');
    const W1 = el('div', { position: 'absolute', inset: '0' }), W2 = el('div', { position: 'absolute', inset: '0' }), W3 = el('div', { position: 'absolute', inset: '0' });
    const cap = uiCaption(W1, 1330, [['I', tw('i')], ['said', tw('said')], ['daddy', tw('daddy'), 1]]);
    const cap2 = uiCaption(W2, 1330, [['you', tw('you')], ['owe', tw('owe')], ['me', tw('me')], ['$20', tw('20'), 1]]);
    const cap3 = uiCaption(W3, 1330, [['and', tw('and')], ['plus', tw('plus')], ['$5', tw('5'), 1], ['for', tw('for')], ['interest', tw('interest'), 1]]);
    const t20 = tw('20'), t5 = tw('5'), tYou = tw('you'), tAnd = tw('and');
    return t => {
      slideUp(c, t, -0.05, 0.5, 200);
      slideUp(r1, t, t20 - 0.2, 0.35, 40); slideUp(r2, t, t5 - 0.2, 0.35, 40);
      const v = t < t5 - 0.1 ? 20 * eo((t - (t20 - 0.3)) / 0.4) : 20 + 5 * eo((t - (t5 - 0.1)) / 0.35);
      tot.textContent = '$' + Math.round(Math.max(0, v)); pop(btn, t, t5 + 0.4, 0.35);
      chunkVis(W1, t, -1, tYou - LEAD); chunkVis(W2, t, tYou, tAnd - LEAD); chunkVis(W3, t, tAnd, DUR + 1);
      cap(t); cap2(t); cap3(t);
    };
  },
  ui_loan3() {                                    // "but he DIDN'T give me back my INTEREST": the $5 is declined, red glow (V13)
    uiWorld();
    const c = card(S, { top: 300, h: 760, w: 880 });
    avatar(c, 56, 60, 130, 'D', 25);
    el('div', { position: 'absolute', left: '214px', top: '66px', font: '700 58px Inter', color: G.ink }, c, 'Daddy');
    el('div', { position: 'absolute', left: '214px', top: '140px', font: '500 36px Inter', color: G.inkSoft }, c, 'paid back · payday');
    el('div', { position: 'absolute', left: '56px', right: '56px', top: '240px', height: '2px', background: '#EFE5D3' }, c);
    el('div', { position: 'absolute', left: '56px', top: '312px', font: '600 50px Inter', color: G.ink }, c, 'Loan');
    el('div', { position: 'absolute', right: '56px', top: '304px', font: '800 64px Inter', color: G.ink }, c, '$20');
    const tick = chip(c, '✓ paid', { x: 300, y: 312, bg: '#DFF3E5', fg: '#1F7A44', size: 36 });
    el('div', { position: 'absolute', left: '56px', top: '442px', font: '600 50px Inter', color: G.ink }, c, 'Interest');
    const five = el('div', { position: 'absolute', right: '56px', top: '434px', font: '800 64px Inter', color: G.goldDeep }, c, '+$5');
    const strike = el('div', { position: 'absolute', right: '46px', top: '472px', width: '150px', height: '10px', background: G.red, borderRadius: '5px', transformOrigin: 'left center' }, c);
    const bubble = el('div', { position: 'absolute', left: '90px', top: '1110px', width: '900px', height: '170px', borderRadius: '40px', background: 'linear-gradient(180deg,#FF6B5C,#E5483A)',
      boxShadow: '0 0 80px rgba(229,72,58,.75), 0 24px 50px rgba(150,30,20,.35)', display: 'flex', alignItems: 'center', gap: '28px', padding: '0 44px', boxSizing: 'border-box', color: '#fff' }, S);
    el('div', { width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'grid', placeItems: 'center', font: '800 60px Inter' }, bubble, '✕');
    const bt = el('div', {}, bubble); el('div', { font: '800 52px Inter' }, bt, 'Interest declined'); el('div', { font: '500 34px Inter', opacity: '.9' }, bt, 'Daddy kept your $5');
    const W1 = el('div', { position: 'absolute', inset: '0' }), W2 = el('div', { position: 'absolute', inset: '0' });
    const cap = uiCaption(W1, 1400, [['but', tw('but')], ['he', tw('he')], ["didn't", tw("didn't"), 1]]);
    const cap2 = uiCaption(W2, 1400, [['give', tw('give')], ['me', tw('me')], ['back', tw('back')], ['my', tw('my')], ['interest', tw('interest'), 1]]);
    const td = tw("didn't"), ti = tw('interest'), tg = tw('give');
    return t => {
      slideUp(c, t, -0.1, 0.4, 120); pop(tick, t, 0.15, 0.3);
      strike.style.transform = `scaleX(${eo((t - ti) / 0.22)})`; five.style.opacity = t > ti + 0.1 ? 0.45 : 1;
      pop(bubble, t, ti + 0.12, 0.35);
      const shake = t > ti + 0.12 && t < ti + 0.6 ? 10 * Math.sin((t - ti) * 70) * (1 - (t - ti - 0.12) / 0.48) : 0;
      if (t > ti + 0.44) bubble.style.transform = `translateX(${shake}px)`;
      chunkVis(W1, t, -1, tg - LEAD); chunkVis(W2, t, tg, DUR + 1); cap(t); cap2(t);
    };
  },
});
