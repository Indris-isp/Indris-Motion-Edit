/* SeySpace product UI, rebuilt at high fidelity after their real screens (client portal invoice, Secure Download,
 * Your Cart, Order Success). Plus Jakarta for titles, Inter for UI text, forest green #1B3B32, black pill CTAs,
 * hairlines #ECE8E0, 20px radius, line icons. Registered as kit 'html' components (kit.js). */
(function () {
  const css = `
  .ss{font-family:Inter,system-ui,sans-serif;color:#111611;letter-spacing:-.005em}
  .ss .t{font:800 30px/1.15 'Plus Jakarta Sans',Inter,sans-serif;letter-spacing:-.035em}
  .ss .eb{font:700 13px Inter;letter-spacing:.14em;text-transform:uppercase;color:#8C918A}
  .ss .mut{color:#7A7F78}
  .ss .hr{height:1px;background:#ECE8E0}
  .ss .chip{display:inline-flex;align-items:center;gap:6px;font:600 14px Inter;padding:6px 11px;border-radius:999px;white-space:nowrap}
  .ss .ok{background:#E3F1E7;color:#1F6B3A}
  .ss .pend{background:#F3F1EC;color:#6B6F68}
  .ss .cta{display:flex;align-items:center;justify-content:center;gap:10px;height:56px;border-radius:999px;background:#1B1B1D;color:#fff;font:700 18px Inter}
  .ss .cta.g{background:#1B3B32}
  .ss .ic{width:22px;height:22px;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
  .ss .thumb{border-radius:12px;background-size:cover;background-position:center 25%;flex:none}
  .ss .row{display:flex;align-items:center;gap:14px}
  .ss .between{display:flex;align-items:center;justify-content:space-between;gap:14px}
  .ss .day{width:58px;height:70px;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font:600 13px Inter;color:#7A7F78;background:#F6F4EF}
  .ss .day b{font:800 22px 'Plus Jakarta Sans';color:#111611;letter-spacing:-.03em}
  .ss .day.on{background:#1B3B32;color:#C9D6C9}.ss .day.on b{color:#fff}
  .ss .slot{flex:1;height:46px;border-radius:12px;border:1.5px solid #E6E2D8;display:flex;align-items:center;justify-content:center;font:600 16px Inter}
  .ss .slot.on{border-color:#1B3B32;background:#EEF2EC;color:#1B3B32}
  .ss .opt{border:1.5px solid #E6E2D8;border-radius:16px;padding:18px 20px;display:flex;align-items:center;gap:14px}
  .ss .opt.on{border-color:#1B3B32;background:#F4F7F3}
  .ss .radio{width:24px;height:24px;border-radius:50%;border:2px solid #CFCAC0;flex:none;display:flex;align-items:center;justify-content:center}
  .ss .opt.on .radio{border-color:#1B3B32;background:#1B3B32}.ss .opt.on .radio:after{content:"";width:8px;height:8px;border-radius:50%;background:#fff}
  .ss .bar{height:8px;border-radius:4px;background:#ECE8E0;overflow:hidden}.ss .bar i{display:block;height:100%;background:#1B3B32;transform-origin:0 50%;transform:scaleX(0)}
  .ss .doc p{margin:0;font:500 15.5px/1.55 Inter;color:#3C403B}
  .ss .doc h4{margin:0 0 4px;font:700 15px Inter;color:#111611}
  .ss .sig{height:64px;border-bottom:1.5px solid #D9D4CA;position:relative}
  .ss .stamp{opacity:0;transform:scale(.6);transition:none}.ss .stamp.on{opacity:1;transform:scale(1)}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const I = {
    cal: '<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    clock: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    send: '<svg class="ic" viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2-7-8-1z"/></svg>',
    dl: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" style="stroke-width:2.4"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock: '<svg class="ic" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    bag: '<svg class="ic" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  };
  const K = window.BRIEF.kit;

  /* Smart Booking: a session being booked for the Elegance Collection; their own sample fees */
  K.booking = { type: 'html', pad: '30px 32px', html: `<div class="ss" style="display:flex;flex-direction:column;gap:22px">
    <div class="between" data-p><div><div class="eb">Smart booking</div><div class="t" style="margin-top:6px">New session</div></div><span class="chip ok">${I.check}Booked</span></div>
    <div class="row" style="gap:10px" data-p>${[['Wed', 24], ['Thu', 25], ['Fri', 26], ['Sat', 27], ['Sun', 28], ['Mon', 29], ['Tue', 30]].map(([d, n]) => `<div class="day${n === 27 ? ' on' : ''}">${d}<b>${n}</b></div>`).join('')}</div>
    <div class="row" style="gap:10px" data-p><div class="slot">12:00</div><div class="slot">2:00</div><div class="slot on">4:00 PM</div><div class="slot">6:00</div></div>
    <div class="hr"></div>
    <div class="row" data-p><div class="thumb" style="width:72px;height:72px;background-image:url('assets/g2.jpg')"></div><div style="flex:1;min-width:0"><div style="font:700 19px Inter">The Elegance Collection</div><div class="mut" style="font:500 15px Inter;margin-top:3px">Wedding · Session fee + retouching</div></div><div style="font:800 24px 'Plus Jakarta Sans';letter-spacing:-.03em" data-count="$2,450" data-at=".4">$2,450</div></div>
    <div class="cta" data-p>${I.send}Send invoice to client</div></div>` };

  /* Contract: a real-looking agreement; the client's signature draws itself */
  K.contract = { type: 'html', pad: '34px 38px', html: `<div class="ss" style="display:flex;flex-direction:column;gap:18px">
    <div class="between" data-p><div><div class="eb">Contract · The Elegance Collection</div><div class="t" style="margin-top:6px">Wedding Photography Agreement</div></div></div>
    <div class="hr"></div>
    <div class="doc" style="display:grid;grid-template-columns:1fr 1fr;gap:16px 28px" data-p>
      <div><h4>1. Coverage</h4><p>Eight hours of coverage on Saturday, 27 October 2025, from 4:00 PM.</p></div>
      <div><h4>2. Fees</h4><p>Session fee $1,800 and retouching $650. Total $2,450.</p></div>
      <div><h4>3. Delivery</h4><p>Edited images delivered in a private online gallery.</p></div>
      <div><h4>4. Usage</h4><p>Client may print and share images for personal use.</p></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:6px" data-p>
      <div><div class="sig"><svg viewBox="0 0 300 64" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><path data-draw=".9" pathLength="1" stroke-dasharray="0 1" d="M8 46 C 22 10, 40 10, 38 40 S 60 58, 70 30 S 92 8, 96 40 C 99 56, 112 30, 122 34 S 140 50, 150 30 C 160 14, 172 50, 186 38 S 214 22, 236 36" fill="none" stroke="#1B3B32" stroke-width="3" stroke-linecap="round"/></svg></div><div class="between" style="margin-top:8px"><span class="mut" style="font:500 14px Inter">Client signature</span><span class="chip ok stamp" data-on="1.7">${I.check}Signed</span></div></div>
      <div><div class="sig"><svg viewBox="0 0 300 64" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><path data-draw=".3" pathLength="1" stroke-dasharray="0 1" d="M10 40 C 30 12, 44 54, 62 30 S 88 18, 100 40 S 130 46, 150 26 S 180 36, 210 30" fill="none" stroke="#111611" stroke-width="3" stroke-linecap="round"/></svg></div><div class="between" style="margin-top:8px"><span class="mut" style="font:500 14px Inter">Photographer</span><span class="chip ok">${I.check}Signed</span></div></div></div></div>` };

  /* Secure Download: their Digital Delivery panel, with the download running */
  K.download = { type: 'html', pad: '30px 32px', html: `<div class="ss" style="display:flex;flex-direction:column;gap:16px">
    <div data-p><div class="eb">Digital delivery</div><div class="t" style="margin-top:6px">Secure Download.</div><div class="mut" style="font:500 16px Inter;margin-top:4px">Choose your preferred format.</div></div>
    <div class="opt on" data-p><span class="radio"></span><div style="flex:1"><div style="font:700 18px Inter">High Resolution</div><div class="mut" style="font:500 14px Inter;margin-top:2px">Original file (300 DPI)</div></div>${I.lock}</div>
    <div class="opt" data-p><span class="radio"></span><div style="flex:1"><div style="font:700 18px Inter">Web Size</div><div class="mut" style="font:500 14px Inter;margin-top:2px">Social ready (72 DPI)</div></div></div>
    <div data-p><div class="between" style="font:600 14px Inter;margin-bottom:8px"><span>The Elegance Collection · 6 photos</span><span class="mut" data-count="100%" data-at=".6">100%</span></div><div class="bar"><i data-fill=".6"></i></div></div>
    <div class="cta g" data-p>${I.dl}Start Download</div></div>` };

  /* Print orders for the fan: one product card per photo from the job */
  const photos = ['g2', 'g0', 'g1', 'g3', 'g4', 'g5', 'g2'];
  K.order = { type: 'html', pad: '16px', w: 380, items: photos.map((p, i) => `<div class="ss row" style="gap:16px">
    <div class="thumb" style="width:84px;height:104px;background-image:url('assets/${p}.jpg')"></div>
    <div style="min-width:0;flex:1"><div class="eb" style="font-size:11px">Print</div><div style="font:700 19px Inter;margin-top:3px;white-space:nowrap">Fine Art Print</div><div class="mut" style="font:500 15px Inter;margin-top:2px">8 × 10 · $45.00</div><span class="chip ok" style="margin-top:10px;font-size:12px;padding:4px 9px">${I.check}Ordered</span></div></div>`) };

  /* Your Cart: compact version of their cart screen for under the fan; total counts up */
  K.cart = { type: 'html', pad: '20px 24px', w: 620, html: `<div class="ss row" style="gap:18px">
    <div class="row" style="gap:8px" data-p><div class="thumb" style="width:58px;height:58px;background-image:url('assets/g0.jpg')"></div><div class="thumb" style="width:58px;height:58px;background-image:url('assets/g3.jpg')"></div></div>
    <div style="flex:1" data-p><div class="eb" style="font-size:12px">Your cart · 2 items</div><div style="font:800 32px 'Plus Jakarta Sans';letter-spacing:-.03em;margin-top:2px" data-count="$295.00" data-at=".4">$295.00</div></div>
    <div class="cta" style="height:52px;padding:0 24px;font-size:16px" data-p>Checkout</div></div>` };

  /* Studio app shell (sidebar + content), used by the tilted screen and the final screen */
  const side = (on) => `<div style="width:220px;flex:none;background:#F6F4EF;border-right:1px solid #ECE8E0;padding:24px 18px;display:flex;flex-direction:column;gap:6px">
    <div class="row" style="gap:10px;margin-bottom:18px"><svg viewBox="0 0 295 294" style="width:26px;height:26px"><rect x="0" y="0" width="171" height="130" fill="#111611"/><rect x="124" y="162" width="171" height="132" fill="#111611"/></svg><b style="font:800 20px 'Plus Jakarta Sans';letter-spacing:-.03em">SeySpace</b></div>
    ${['Dashboard', 'Bookings', 'Galleries', 'Store', 'Contracts', 'Clients'].map(n => `<div style="font:600 15px Inter;padding:10px 12px;border-radius:10px;${n === on ? 'background:#1B3B32;color:#fff' : 'color:#5F655E'}">${n}</div>`).join('')}</div>`;
  K.galleries = { type: 'html', pad: '0', html: `<div class="ss" style="display:flex;height:100%;background:#fff">${side('Galleries')}
    <div style="flex:1;padding:28px 30px;display:flex;flex-direction:column;gap:18px">
      <div class="between" data-p><div><div class="eb">Client galleries</div><div class="t" style="margin-top:4px">The Elegance Collection</div></div><span class="chip ok">${I.check}Delivered</span></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px" data-p>${['g2', 'g0', 'g1', 'g3', 'g4', 'g5'].map(p => `<div class="thumb" style="height:170px;background-image:url('assets/${p}.jpg')"></div>`).join('')}</div>
      <div class="between" data-p><span class="mut" style="font:500 15px Inter">6 photos · High resolution · Secure download</span><span class="cta g" style="height:46px;padding:0 22px;font-size:15px">${I.dl}Share gallery</span></div></div></div>` };
  K.dash = { type: 'html', pad: '0', html: `<div class="ss" style="display:flex;height:100%;background:#fff">${side('Dashboard')}
    <div style="flex:1;padding:30px 34px;display:flex;flex-direction:column;gap:20px">
      <div class="between" data-p><div><div class="eb">Dashboard</div><div class="t" style="margin-top:4px">Good evening, Studio</div></div><span class="cta" style="height:46px;padding:0 22px;font-size:15px">+ New booking</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px" data-p>
        ${[['Next shoot', 'Sat 27 Oct', '4:00 PM · Wedding'], ['Invoice', '$2,450', 'Paid · Client portal'], ['Gallery', '6 photos', 'Delivered'], ['Store', '$295.00', 'Prints + digital']].map(([a, b, c2]) => `<div style="border:1px solid #ECE8E0;border-radius:16px;padding:18px"><div class="eb" style="font-size:11.5px">${a}</div><div style="font:800 26px 'Plus Jakarta Sans';letter-spacing:-.03em;margin-top:8px">${b}</div><div class="mut" style="font:500 13.5px Inter;margin-top:4px">${c2}</div></div>`).join('')}</div>
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:14px" data-p>
        <div style="border:1px solid #ECE8E0;border-radius:16px;padding:18px"><div class="between"><b style="font:700 16px Inter">Recent gallery</b><span class="mut" style="font:500 13px Inter">The Elegance Collection</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px">${['g2', 'g0', 'g3'].map(p => `<div class="thumb" style="height:110px;background-image:url('assets/${p}.jpg')"></div>`).join('')}</div></div>
        <div style="border:1px solid #ECE8E0;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:12px"><b style="font:700 16px Inter">Today</b>
          ${[['Contract signed', 'ok'], ['Questionnaire done', 'ok'], ['Print order · $45.00', 'ok'], ['Deposit scheduled', 'pend']].map(([n, k]) => `<div class="between"><span style="font:500 14.5px Inter">${n}</span><span class="chip ${k}" style="font-size:12px;padding:3px 9px">${k === 'ok' ? 'Done' : 'Scheduled'}</span></div>`).join('')}</div></div></div></div>` };
})();
