/* UI KIT — the client's product UI, REBUILT (never screenshotted) in their tokens.
 * Claude studies their screenshots, then describes 4–8 key components in brief.js → kit,
 * simplified: fewer rows, bigger type, their colours / radius / icon style. Shots place them with
 * renderComponent(parent, specOrKey, { x, y, w }) and animate the returned parts.
 *
 * Spec types (all optional fields shown):
 *  list    { label, items: [{ title, sub, icon: {kind:'ring'|'avatar'|'dot'|'glyph', color, letter, text, name}, tag: {text, color, bg} }] }
 *  stat    { label, value: '13,041', delta: '+4%', deltaColor }
 *  chart   { title, kind: 'bars'|'line'|'donut', values: [..], labels: [..], colors: [..], highlight: i }
 *  editor  { back: '← Posts', actions: ['Preview','Publish'], cover: css, title, lines: 4, toggle: 'Send as newsletter' }
 *  email   { from, subject, dot: color }
 *  slider  { label, value: 0..1, display: '7.5' }
 *  toggle  { label, on: true }
 *  chat    { messages: [{ me: bool, name, text }] }
 *  toast   { title, sub, icon: '+' , color }
 *  leaderboard { title, entries: [{ place: 1, value: '210', name }] }
 *  table   { columns: [..], rows: [[..]], tagCol: i }
 *  form    { title, fields: ['Email', ..], button }
 *  button  { label, kind: 1|2, size }
 * Every spec also takes: dark (dark surface), w (default width), radius.
 */
'use strict';
const kitSpec = s => (typeof s === 'string' ? (B.kit || {})[s] : s) || { type: 'list', items: [] };
const kesc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function kIcon(ic = {}, i = 0) {
  const c = ic.color || 'var(--acc)';
  if (ic.kind === 'ring') return `<div class="kring" style="border-color:${c};color:${c}"><i class="kdb"><b></b></i>${ic.letter ? `<span class="ktagdot" style="background:${c}">${kesc(ic.letter)}</span>` : ''}</div>`;
  if (ic.kind === 'avatar') return av(ic.name || person(i), 48, i);
  if (ic.kind === 'dot') return `<span style="width:14px;height:14px;border-radius:50%;background:${c};flex:none"></span>`;
  if (ic.kind === 'glyph') return `<span class="kglyph" style="background:${c}">${kesc(ic.text || '•')}</span>`;
  return '';
}

/* returns { el, parts: [elements to stagger], spec } */
function renderComponent(parent, specOrKey, o = {}) {
  const sp = kitSpec(specOrKey), w = o.w || sp.w || 600;
  const el = D(parent, 'abs kitc' + (sp.dark ? ' kd' : '') + (o.ctr ? ' ctr' : ''), { left: o.x || 0, top: o.y || 0, width: w });
  if (sp.radius != null) el.style.borderRadius = sp.radius + 'px';
  const parts = [];
  const add = (html, cls = '') => { const d = D(el, cls, null, html); parts.push(d); return d; };
  switch (sp.type) {
    case 'list':
      if (sp.label) add(kesc(sp.label), 'klab');
      (sp.items || []).forEach((it, i) => add(`${kIcon(it.icon, i)}<div style="flex:1;min-width:0"><div class="kttl">${kesc(it.title)}</div>${it.sub ? `<div class="ksub">${kesc(it.sub)}</div>` : ''}</div>${it.tag ? `<span class="ktag" style="color:${it.tag.color || 'var(--acc)'};background:${it.tag.bg || 'var(--tint)'}">${kesc(it.tag.text)}</span>` : ''}`, 'krow'));
      break;
    case 'stat':
      if (sp.label) add(kesc(sp.label), 'klab');
      add(`<span class="kbig num">${kesc(sp.value)}</span>${sp.delta ? `<span class="kdelta" style="color:${sp.deltaColor || '#30cf43'}">↑ ${kesc(sp.delta)}</span>` : ''}`, 'krowb');
      break;
    case 'chart': {
      if (sp.title) add(kesc(sp.title), 'kttl');
      const vals = sp.values || [3, 5, 4, 7, 6, 9], mx = Math.max(...vals), cols = sp.colors || ['var(--acc)'];
      if ((sp.kind || 'bars') === 'bars') {
        const box = add('', 'kbars');
        vals.forEach((v, i) => { const b = D(box, 'kbar', { height: (v / mx * 100) + '%', background: cols[i % cols.length], opacity: sp.highlight == null || sp.highlight === i ? 1 : .35 }); b.dataset.v = v; });
        if (sp.labels) add(sp.labels.map(l => `<span>${kesc(l)}</span>`).join(''), 'kxl');
      } else if (sp.kind === 'line') {
        const pts = vals.map((v, i) => `${(i / (vals.length - 1) * 100).toFixed(1)},${(100 - v / mx * 88).toFixed(1)}`).join(' ');
        add(`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:220px;display:block;overflow:visible"><polyline class="kline" points="${pts}" fill="none" stroke="${cols[0]}" stroke-width="2.6" vector-effect="non-scaling-stroke" pathLength="1" stroke-dasharray="1 1"/></svg>`, 'kchart');
      } else {
        let acc = 0; const tot = vals.reduce((a, b) => a + b, 0);
        const segs = vals.map((v, i) => { const a = acc / tot, b = (acc += v) / tot; return `<circle r="15.9" cx="20" cy="20" fill="none" stroke="${cols[i % cols.length]}" stroke-width="6" pathLength="100" stroke-dasharray="${((b - a) * 100).toFixed(2)} 100" stroke-dashoffset="${(-a * 100).toFixed(2)}" transform="rotate(-90 20 20)"/>`; }).join('');
        add(`<svg viewBox="0 0 40 40" style="width:220px;height:220px;display:block;margin:0 auto">${segs}</svg>`, 'kchart');
        if (sp.labels) add(sp.labels.map((l, i) => `<span><i style="background:${cols[i % cols.length]}"></i>${kesc(l)}</span>`).join(''), 'klegend');
      }
      break; }
    case 'editor':
      el.style.padding = '0';
      add(`<span>${kesc(sp.back || '← Back')}</span><span style="display:flex;gap:14px;align-items:center">${(sp.actions || ['Publish']).map((a, i, A) => i === A.length - 1 ? `<span class="btn b1" style="font-size:18px;padding:10px 18px;box-shadow:none">${kesc(a)}</span>` : `<span>${kesc(a)}</span>`).join('')}</span>`, 'kbar-top');
      add('', 'kcover').style.background = sp.cover || 'linear-gradient(135deg,var(--tint),var(--acc2))';
      { const t = add('', 'kedtitle'); el._title = typed(t, '', {}, [{ t: sp.title || 'Untitled' }]); }
      add(Array.from({ length: sp.lines || 4 }, (_, i) => `<div class="ln" style="width:${[96, 88, 92, 60, 80][i % 5]}%;margin-top:${i ? 16 : 0}px"></div>`).join(''), 'kbody');
      if (sp.toggle) { const tg = add(`${kesc(sp.toggle)}<span class="ksw"><i></i></span>`, 'ktoggle kdarkpill'); el._toggle = tg.querySelector('.ksw'); }
      break;
    case 'email':
      add(`<span class="kdot" style="background:${sp.dot || 'var(--ink)'}"></span><b>${kesc(sp.from)}</b>`, 'krow kemail');
      add(kesc(sp.subject), 'kttl');
      add('<div class="ln"></div><div class="ln" style="width:70%;margin-top:10px"></div>', '');
      break;
    case 'slider':
      add(`<span>${kesc(sp.label)}</span><span class="kval" style="color:var(--acc)">${kesc(sp.display || '')}</span>`, 'krowb kttl');
      { const tr = add('<div class="kfill"></div><div class="kknob"></div>', 'ktrack'); el._knob = tr.querySelector('.kknob'); el._fill = tr.querySelector('.kfill'); el._val = sp.value == null ? .7 : sp.value; }
      break;
    case 'toggle':
      { const tg = add(`<span class="kttl" style="flex:1">${kesc(sp.label)}</span><span class="ksw${sp.on ? ' on' : ''}"><i></i></span>`, 'krow'); el._toggle = tg.querySelector('.ksw'); }
      break;
    case 'chat':
      (sp.messages || []).forEach((m, i) => add(`${m.me ? '' : av(m.name || person(i), 40, i)}<span class="kmsg${m.me ? ' me' : ''}">${kesc(m.text)}</span>`, 'krow' + (m.me ? ' kme' : '')));
      break;
    case 'toast':
      add(`<span class="kglyph" style="background:${sp.color || '#30cf43'}">${kesc(sp.icon || '+')}</span><div><div class="kttl">${kesc(sp.title)}</div>${sp.sub ? `<div class="ksub">${kesc(sp.sub)}</div>` : ''}</div>`, 'krow');
      break;
    case 'leaderboard':
      if (sp.title) add(kesc(sp.title), 'kttl');
      add((sp.entries || []).map(e => `<div class="klb${e.place === 1 ? ' first' : ''}"><span class="kmedal m${e.place}">${e.place}</span><b class="num">${kesc(e.value)}</b><small>${kesc(e.name)}</small></div>`).join(''), 'klbrow');
      break;
    case 'table':
      add((sp.columns || []).map(c => `<span>${kesc(c)}</span>`).join(''), 'ktr kth');
      (sp.rows || []).forEach(r => add(r.map((c, i) => `<span>${i === sp.tagCol ? `<span class="ktag">${kesc(c)}</span>` : kesc(c)}</span>`).join(''), 'ktr'));
      break;
    case 'form':
      if (sp.title) add(kesc(sp.title), 'kttl');
      (sp.fields || []).forEach(f => add(kesc(f), 'kfield'));
      if (sp.button) add(`<span class="btn b1" style="font-size:20px;padding:14px 24px">${kesc(sp.button)}</span>`, '');
      break;
    case 'html':   /* a bespoke, high-fidelity component: sp.html is markup in brand tokens; [data-p] children stagger in,
                      [data-count] count up, [data-draw] SVG paths draw, [data-fill] bars fill */
      el.classList.add('khtml'); if (sp.pad != null) el.style.padding = sp.pad; el.innerHTML = sp.html;
      el.querySelectorAll('[data-p]').forEach(e => parts.push(e));
      break;
    case 'button':
      el.className = 'abs' + (o.ctr ? ' ctr' : ''); el.style.width = 'auto';
      el.innerHTML = btnHTML(sp.label, sp.kind || 1, sp.size || 1.3); parts.push(el.firstElementChild);
      break;
  }
  return { el, parts, spec: sp };
}

/* stagger the parts of a component in (rise + fade + blur) */
function revealParts(c, t, t0, gap = .09, dur = .35) {
  c.parts.forEach((p, i) => { const k = P(t, t0 + i * gap, t0 + i * gap + dur); p.style.opacity = C(k * 1.6).toFixed(3); p.style.transform = `translateY(${((1 - eo(k)) * 22).toFixed(1)}px)`; p.style.filter = k < 1 ? `blur(${((1 - eo(k)) * 6).toFixed(1)}px)` : 'none'; });
}
/* component-specific life: typing titles, toggles, sliders, bars, lines, counters */
function animateComponent(c, t, t0) {
  const sp = c.spec, el = c.el;
  if (el._title) typeP(el._title, P(t, t0 + .3, t0 + 1.1), t, true);
  if (el._toggle) el._toggle.classList.toggle('on', sp.on !== false && t > t0 + 1.1);
  if (el._knob) { const v = L(.15, el._val, eio(P(t, t0 + .5, t0 + 1.3))); el._knob.style.left = (v * 100) + '%'; el._fill.style.width = (v * 100) + '%'; }
  el.querySelectorAll('.kbar').forEach((b, i) => b.style.transform = `scaleY(${bo(P(t, t0 + .25 + i * .06, t0 + .6 + i * .06)).toFixed(3)})`);
  el.querySelectorAll('.kline').forEach(l => l.setAttribute('stroke-dasharray', `${eio(P(t, t0 + .2, t0 + 1.2)).toFixed(3)} 1`));
  el.querySelectorAll('[data-count]').forEach(n => { const st = parseStat(n.dataset.count), d = +(n.dataset.at || 0); n.textContent = fmtStat(st, eo(P(t, t0 + d, t0 + d + .9))); });
  el.querySelectorAll('[data-draw]').forEach(pth => { const d = +(pth.dataset.draw || 0); pth.setAttribute('stroke-dasharray', `${eio(P(t, t0 + d, t0 + d + .7)).toFixed(3)} 1`); });
  el.querySelectorAll('[data-fill]').forEach(b => { const d = +(b.dataset.fill || 0); b.style.transform = `scaleX(${eio(P(t, t0 + d, t0 + d + .8)).toFixed(3)})`; });
  el.querySelectorAll('[data-on]').forEach(b => b.classList.toggle('on', t > t0 + +(b.dataset.on || 0)));
  if (sp.type === 'stat') { const n = el.querySelector('.kbig'), st = parseStat(sp.value); n.textContent = fmtStat(st, eo(P(t, t0 + .1, t0 + 1.1))); }
  if (sp.type === 'leaderboard') el.querySelectorAll('.klb b').forEach((b, i) => { const st = parseStat(sp.entries[i].value); b.textContent = fmtStat(st, eo(P(t, t0 + .2 + i * .1, t0 + 1 + i * .1))); });
}
