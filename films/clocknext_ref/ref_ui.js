/* REF UI: clean product screens and glass-card contents in the brand's colour (--A), for shots_ref.js.
 * RUI.app({...}) → a full app screen (sidebar + header + stat tiles + two panels), as a kit 'html' component.
 * RUI.cardHead / RUI.lines / RUI.btn / RUI.tag → glass-card building blocks. Values come from each brand's ref_brand.js. */
(function () {
  const st = document.createElement('style'); st.textContent = `
  .rs{font-family:var(--font-body),Inter,sans-serif;color:#111611}
  .rs .eb{font:700 12.5px Inter;letter-spacing:.14em;text-transform:uppercase;color:#8C918A}
  .rs .t{font:800 28px/1.15 var(--font),Inter,sans-serif;letter-spacing:-.03em}
  .rs .mut{color:#767B76}
  .rs .chip{display:inline-flex;align-items:center;gap:6px;font:600 13px Inter;padding:5px 10px;border-radius:999px;white-space:nowrap}
  .rs .ok{background:rgba(var(--Argb),.1);color:var(--A)} .rs .pend{background:#F2F2EF;color:#6B6F68} .rs .warn{background:#FDECEA;color:#B42318}
  .rs .tile{border:1px solid #EAEAE6;border-radius:16px;padding:16px 18px}
  .rs .between{display:flex;align-items:center;justify-content:space-between;gap:14px}
  .rs .btnA{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 20px;border-radius:999px;background:var(--A);color:#fff;font:600 15px Inter;white-space:nowrap}`;
  document.head.appendChild(st);
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  window.RUI = {
    app(o) {
      return { type: 'html', pad: '0', html: `<div class="rs" style="display:flex;height:100%;background:#fff">
      <div style="width:210px;flex:none;background:#F7F7F4;border-right:1px solid #EDEDE9;padding:24px 16px;display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px"><span style="width:26px;height:26px;display:block;color:var(--A)">${o.mark || ''}</span><b style="font:800 18px var(--font),Inter;letter-spacing:-.02em;white-space:nowrap">${esc(o.name)}</b></div>
        ${(o.nav || []).map(n => `<div style="font:600 14.5px Inter;padding:9px 12px;border-radius:10px;${n === o.active ? 'background:var(--A);color:#fff' : 'color:#5F655E'}">${esc(n)}</div>`).join('')}</div>
      <div style="flex:1;min-width:0;padding:28px 30px;display:flex;flex-direction:column;gap:18px">
        <div class="between" data-p><div><div class="eb">${esc(o.eyebrow)}</div><div class="t" style="margin-top:4px">${esc(o.title)}</div></div>${o.chip ? `<span class="chip ok">${esc(o.chip)}</span>` : ''}</div>
        ${o.stats ? `<div style="display:grid;grid-template-columns:repeat(${o.stats.length},1fr);gap:12px" data-p>${o.stats.map(([a, b, c]) => `<div class="tile"><div class="eb" style="font-size:11px">${esc(a)}</div><div style="font:800 25px var(--font),Inter;letter-spacing:-.03em;margin-top:8px;white-space:nowrap">${esc(b)}</div><div class="mut" style="font:500 13px Inter;margin-top:4px">${esc(c)}</div></div>`).join('')}</div>` : ''}
        <div style="display:grid;grid-template-columns:1.35fr 1fr;gap:12px;flex:1;min-height:0" data-p>
          <div class="tile" style="overflow:hidden"><div class="between"><b style="font:700 16px Inter">${esc(o.left.title)}</b><span class="mut" style="font:500 13px Inter">${esc(o.left.note || '')}</span></div><div style="margin-top:12px">${o.left.html || ''}</div></div>
          <div class="tile" style="display:flex;flex-direction:column;gap:11px;overflow:hidden"><b style="font:700 16px Inter">${esc(o.right.title)}</b>
            ${(o.right.rows || []).map(([n, k, lab]) => `<div class="between"><span style="font:500 14px Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n)}</span><span class="chip ${k}" style="font-size:12px;padding:3px 9px">${esc(lab)}</span></div>`).join('')}</div></div></div></div>` };
    },
    rows(list) { return list.map(([a, b, k]) => `<div class="between" style="padding:10px 0;border-top:1px solid #F0F0EC"><span style="font:500 14.5px Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(a)}</span><span class="chip ${k || 'pend'}" style="font-size:12px;padding:3px 9px">${esc(b)}</span></div>`).join(''); },
    bars(vals, labels) { const mx = Math.max(...vals); return `<div style="display:flex;align-items:flex-end;gap:10px;height:150px">${vals.map((v, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:${(v / mx * 130).toFixed(0)}px;border-radius:8px 8px 3px 3px;background:${i === vals.length - 1 ? 'var(--A)' : 'rgba(var(--Argb),.22)'}"></div><span class="mut" style="font:500 11.5px Inter">${esc((labels || [])[i] || '')}</span></div>`).join('')}</div>`; },
    /* a sheet of paper standing on the table (résumé, invoice, letter, docs page, manuscript) */
    paper(o) { return `<div class="rs" style="height:100%;display:flex;flex-direction:column;gap:12px;font-family:${o.serif ? 'var(--font)' : 'Inter'}">
      <div class="eb" style="font-size:11px">${esc(o.head || '')}</div><div style="font:${o.serif ? '400' : '800'} 26px var(--font),Inter;letter-spacing:-.02em;line-height:1.15">${esc(o.title || '')}</div>
      <div style="height:1px;background:#E8E8E3;margin:4px 0"></div>
      ${(o.lines || []).map(([t, hl]) => `<div style="font:${o.serif ? '400 17px/1.5 var(--font)' : '500 15px/1.45 Inter'};color:#2E322E;${hl ? 'background:rgba(var(--Argb),.14);box-shadow:inset 3px 0 0 var(--A);padding:4px 8px;border-radius:4px;margin:0 -8px' : ''}">${esc(t)}</div>`).join('')}
      <div style="margin-top:auto;font:600 14px Inter;color:var(--A)">${esc(o.foot || '')}</div></div>`; },
    /* glass-card parts */
    cardHead(l, r) { return `<div style="display:flex;justify-content:space-between;align-items:center;font:500 21px var(--rf),Inter;opacity:.9"><span>${esc(l)}</span><span style="display:flex;align-items:center;gap:8px;font:600 21px var(--rf),Inter;color:var(--A)"><span style="width:22px;height:22px;display:block">${(window.REF || {}).mark || ''}</span>${esc(r || '')}</span></div>`; },
    title(a, b) { return `<div style="margin-top:24px;font:500 28px var(--rf),Inter;letter-spacing:-.01em">${esc(a)}</div>${b ? `<div style="margin-top:6px;font:300 21px var(--rf),Inter;opacity:.8">${esc(b)}</div>` : ''}`; },
    lines(n = 3) { return Array.from({ length: n }, (_, i) => `<div class="gl-line" style="width:${[86, 64, 74, 58][i % 4]}%;margin-top:${i ? 14 : 28}px"></div>`).join(''); },
    btn(label, right) { return `<div class="bk" style="position:absolute;left:34px;right:34px;bottom:34px;height:64px;border-radius:16px;background:#F3F5F3;border:1px solid #E1E6E1;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font:500 21px var(--rf),Inter"><span class="lb">${esc(label)}</span><span>${esc(right || '')}</span></div>`; },
    foot(t) { return `<div style="position:absolute;left:30px;bottom:30px;font:400 19px var(--rf),Inter;opacity:.85">${esc(t)}</div>`; },
  };
})();
