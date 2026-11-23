/* Veryfi — Thinking Mode. One sample invoice (Acme Supply Co. #4471) reads $108.00; the first extraction says 180.00.
 * Figures reconcile: 2 × $30.00 + 4 × $10.00 = $100.00 subtotal, + 8% tax $8.00 = $108.00. */
const INV = (x, y, w, o = {}) => `<div class="paper" style="left:${x}px;top:${y}px;width:${w}px;height:720px" ${o.in || ''}>
  <div class="t" style="top:44px"><span class="tag">Sample invoice</span><span class="tag">#4471</span></div>
  <div class="t" style="top:90px;font:500 40px 'DIN Pro'"><span>Acme Supply Co.</span></div>
  <div class="t" style="top:150px;color:#6B7090;font-size:22px"><span>12 Mar 2026</span><span>Net 30</span></div>
  <div class="t" style="top:230px;color:#6B7090;font-size:20px;letter-spacing:.1em"><span>ITEM</span><span>AMOUNT</span></div>
  <div class="t" style="top:280px"><span>Thermal paper · 2 × $30.00</span><span>$60.00</span></div>
  <div class="t" style="top:330px"><span>Labels 4×6 · 4 × $10.00</span><span>$40.00</span></div>
  <div style="position:absolute;left:44px;right:44px;top:395px;height:2px;background:#D8D2C2"></div>
  <div class="t" style="top:420px"><span>Subtotal</span><span ${o.sub || ''}>$100.00</span></div>
  <div class="t" style="top:470px"><span>Tax 8%</span><span ${o.tax || ''}>$8.00</span></div>
  <div class="t" style="top:540px;font:500 36px 'DIN Pro'"><span>Total</span><span ${o.tot || ''}>$108.00</span></div>
</div>`;
const JSONW = (x, y, w, o = {}) => `<div class="code" style="left:${x}px;top:${y}px;width:${w}px" ${o.in || ''}><div class="bar"><i></i><i></i><i></i>&nbsp;POST /api/v8/partner/documents<b>200</b></div>
<pre>{
  <span class="k">"vendor"</span>: { <span class="k">"name"</span>: "Acme Supply Co." },
  <span class="k">"invoice_number"</span>: "4471",
  <span class="k">"subtotal"</span>: <span class="n">100.00</span>,
  <span class="k">"tax"</span>: <span class="n">8.00</span>,
  <span class="k">"total"</span>: <span class="ln" ${o.tot || ''}>${o.swap ? `<span data-swap="${o.swap}" style="display:inline-grid"><span class="sa n">180.00</span><span class="sb g">108.00</span></span>` : `<span class="n">${o.val || '180.00'}</span>`}</span>,
}</pre></div>`;
/* layout: invoice left / JSON right (16:9); invoice top / JSON below (9:16). Line endpoints follow those boxes. */
const L16 = { ix: 160, iy: 280, iw: 620, jx: 900, jy: 330, jw: 880, a: [744, 846], b: [1140, 727] };
const L9 = { ix: 60, iy: 470, iw: 960, jx: 60, jy: 1250, jw: 960, a: [984, 1032], b: [420, 1622] };
const lineSVG = (Lo, t0, t1, col = '#CDB684', dash = '8 8') => `<svg style="position:absolute;left:0;top:0;overflow:visible" width="10" height="10"><path d="M${Lo.a[0]} ${Lo.a[1]} C ${Lo.a[0] + 120} ${Lo.a[1]}, ${Lo.b[0] - 40} ${Lo.b[1] + 150}, ${Lo.b[0]} ${Lo.b[1]}" pathLength="1" style="fill:none;stroke:${col};stroke-width:3" data-draw="${t0},${t1}"/></svg>`;
const lineSVG9 = (Lo, t0, t1, col = '#CDB684') => `<svg style="position:absolute;left:0;top:0;overflow:visible" width="10" height="10"><path d="M${Lo.a[0]} ${Lo.a[1]} C ${Lo.a[0] + 20} ${Lo.a[1] + 350}, ${Lo.b[0] + 260} ${Lo.b[1] - 60}, ${Lo.b[0]} ${Lo.b[1]}" pathLength="1" style="fill:none;stroke:${col};stroke-width:3" data-draw="${t0},${t1}"/></svg>`;
const SAND = 'style="box-shadow:0 0 0 3px #CDB684"', MINT = 'style="background:rgba(72,255,211,.45)"';
window.BEATS = {
  mismatch: {
    name: 'mismatch', src: 'illus', copy: 'This invoice doesn\'t add up.', boards: [3.0],
    note: 'Navy. A sample invoice reads $108.00. The first extraction, in Veryfi\'s API window style, says "total": 180.00. Both totals get a sand outline (an approved brand colour, used here for "needs review").',
    bg: 'dark', dark: 1, len: 4, hero: 3.0,
    html: `<div class="hd" style="left:160px;top:110px" data-in=".1,.8,up">This invoice doesn't add up.</div>
      ${INV(L16.ix, L16.iy, L16.iw, { in: 'data-in=".3,.8,rise"', tot: 'data-in="1.6,.3,fade" ' + SAND })}
      ${JSONW(L16.jx, L16.jy, L16.jw, { in: 'data-in=".6,.8,rise"' })}<div class="ringbox" style="left:1121px;top:680px;width:120px;height:46px;box-shadow:0 0 0 3px #CDB684" data-in="2.0,.3,fade"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">This invoice
doesn't add up.</div>
      ${INV(L9.ix, L9.iy, L9.iw, { in: 'data-in=".3,.8,rise"', tot: 'data-in="1.6,.3,fade" ' + SAND })}
      ${JSONW(L9.jx, L9.jy, L9.jw, { in: 'data-in=".6,.8,rise"' })}<div class="ringbox" style="left:281px;top:1600px;width:120px;height:46px;box-shadow:0 0 0 3px #CDB684" data-in="2.0,.3,fade"></div>`,
    sfx: [[.3, 'whoosh'], [.6, 'whoosh_s'], [1.6, 'tick'], [2.0, 'tick']],
  },
  check: {
    name: 'check', src: 'illus', copy: 'Give the extraction a second pass.', boards: [5.6],
    note: 'Subtotal, tax and total light up on the invoice one by one (mint). A thin annotation line draws from the invoice total to the extracted field; the sum "100.00 + 8.00 = 108.00" sits on the line; the 180.00 field is outlined.',
    bg: 'dark', dark: 1, len: 9, hero: 5.6,
    html: `<div class="hd" style="left:160px;top:110px" data-in="0,.8,up">Give the extraction a second pass.</div>
      ${INV(L16.ix, L16.iy, L16.iw, { sub: 'data-in="1.0,.3,fade" ' + MINT, tax: 'data-in="1.8,.3,fade" ' + MINT, tot: 'data-in="2.6,.3,fade" ' + MINT })}
      ${JSONW(L16.jx, L16.jy, L16.jw)}<div class="ringbox" style="left:1121px;top:680px;width:120px;height:46px;box-shadow:0 0 0 3px #CDB684" data-in="4.4,.3,fade"></div>
      ${lineSVG(L16, 3.4, 4.3)}
      <div class="chip" style="left:790px;top:890px" data-in="4.8,.5,pop">100.00 + 8.00 = 108.00</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in="0,.8,up">Give the extraction
a second pass.</div>
      ${INV(L9.ix, L9.iy, L9.iw, { sub: 'data-in="1.0,.3,fade" ' + MINT, tax: 'data-in="1.8,.3,fade" ' + MINT, tot: 'data-in="2.6,.3,fade" ' + MINT })}
      ${JSONW(L9.jx, L9.jy, L9.jw)}<div class="ringbox" style="left:281px;top:1600px;width:120px;height:46px;box-shadow:0 0 0 3px #CDB684" data-in="4.4,.3,fade"></div>
      ${lineSVG9(L9, 3.4, 4.3)}
      <div class="chip" style="left:540px;top:1110px" data-in="4.8,.5,pop">100.00 + 8.00 = 108.00</div>`,
    sfx: [[1.0, 'tick'], [1.8, 'tick'], [2.6, 'tick'], [3.4, 'swoop'], [4.8, 'pop']],
  },
  thinking: {
    name: 'thinking', src: 'illus', copy: 'Review. Correct. Recheck.', boards: [1.8, 7.6],
    note: 'The request gains the real Thinking Mode parameter, "thinking": "light" (from the Thinking Mode docs). Agent steps tick in: Review ✓ Correct ✓ Recheck ✓. In the response, 180.00 resolves to 108.00 in green. Labelled "Illustrative API response" unless Veryfi supplies a real API test capture.',
    bg: 'dark', dark: 1, len: 11, hero: 7.6,
    html: `<div class="hd" style="left:160px;top:110px" data-in="0,.8,up">Review. Correct. Recheck.</div>
      <div class="code" style="left:160px;top:300px;width:700px"><div class="bar"><i></i><i></i><i></i>&nbsp;Request</div>
<pre style="font-size:25px;line-height:44px">curl -X POST .../v8/partner/documents
  -d '{
    <span class="k">"file_url"</span>: ".../invoice-4471.pdf",
    <span class="k" data-in=".8,.4,fade">"thinking"</span><span data-in=".8,.4,fade">: <span class="g" data-type="1.0,1.6">"light"</span></span>
  }'</pre></div>
      <div style="position:absolute;left:160px;top:690px;display:flex;flex-direction:column;gap:22px">
        <div class="step" data-in="2.4,.5,up"><i>✓</i>Review</div><div class="step" data-in="3.4,.5,up"><i>✓</i>Correct</div><div class="step" data-in="4.4,.5,up"><i>✓</i>Recheck</div></div>
      ${JSONW(L16.jx, L16.jy, L16.jw, { in: 'data-in="1.8,.7,left"', swap: '4.0,.8' })}
      <div class="lab" style="left:${L16.jx}px;top:840px" data-in="2.2,.5,fade">Illustrative API response · thinking: light</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in="0,.8,up">Review. Correct.
Recheck.</div>
      <div class="code" style="left:60px;top:500px;width:960px"><div class="bar"><i></i><i></i><i></i>&nbsp;Request</div>
<pre style="font-size:25px;line-height:44px">curl -X POST .../v8/partner/documents
  -d '{
    <span class="k">"file_url"</span>: ".../invoice-4471.pdf",
    <span class="k" data-in=".8,.4,fade">"thinking"</span><span data-in=".8,.4,fade">: <span class="g" data-type="1.0,1.6">"light"</span></span>
  }'</pre></div>
      <div style="position:absolute;left:80px;top:870px;display:flex;gap:40px">
        <div class="step" data-in="2.4,.5,up"><i>✓</i>Review</div><div class="step" data-in="3.4,.5,up"><i>✓</i>Correct</div><div class="step" data-in="4.4,.5,up"><i>✓</i>Recheck</div></div>
      ${JSONW(60, 980, 960, { in: 'data-in="1.8,.7,up"', swap: '4.0,.8' })}
      <div class="lab" style="left:60px;top:1490px" data-in="2.2,.5,fade">Illustrative API response · thinking: light</div>`,
    sfx: [[.8, 'type4'], [1.8, 'whoosh_s'], [2.4, 'tick'], [3.4, 'tick'], [4.0, 'swoop'], [4.4, 'tick']],
  },
  match: {
    name: 'match', src: 'illus', copy: '(hold on the matching numbers)', boards: [1.6],
    note: 'Invoice and response side by side again: $108.00 and "total": 108.00, joined by a solid green line. A beat of stillness before the wordmark.',
    bg: 'dark', dark: 1, len: 3.5, hero: 1.6,
    html: `${INV(L16.ix, L16.iy, L16.iw, { tot: 'style="box-shadow:0 0 0 3px #00D181"' })}
      ${JSONW(L16.jx, L16.jy, L16.jw, { val: '108.00' })}<div class="ringbox" style="left:1121px;top:680px;width:120px;height:46px;box-shadow:0 0 0 3px #00D181" ></div>
      ${lineSVG(L16, .2, .9, '#00D181')}`,
    htmlV: `${INV(L9.ix, L9.iy, L9.iw, { tot: 'style="box-shadow:0 0 0 3px #00D181"' })}
      ${JSONW(L9.jx, L9.jy, L9.jw, { val: '108.00' })}<div class="ringbox" style="left:281px;top:1600px;width:120px;height:46px;box-shadow:0 0 0 3px #00D181" ></div>
      ${lineSVG9(L9, .2, .9, '#00D181')}`,
    sfx: [[.2, 'swoop'], [.9, 'shimmer']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'Introducing Veryfi Thinking Mode.', boards: [1.8],
    note: 'Navy. Supplied wordmark in white with clear space ≥ the height of the "v" and well above the 90 px minimum width; no glow, shadow or container. Line below in NB International.',
    bg: 'dark', dark: 1, len: 2.5, hero: 1.8,
    html: `<div class="ctr" style="left:960px;top:440px" data-in=".1,.6,fade"><img src="assets/wordmark_white.svg" style="height:120px;display:block"></div>
      <div class="hd ctr" style="left:960px;top:640px;font-size:64px;font-weight:400" data-in=".5,.7,up">Introducing Veryfi Thinking Mode.</div>`,
    htmlV: `<div class="ctr" style="left:540px;top:820px" data-in=".1,.6,fade"><img src="assets/wordmark_white.svg" style="height:110px;display:block"></div>
      <div class="hd ctr" style="left:540px;top:1040px;font-size:70px;font-weight:400;text-align:center" data-in=".5,.7,up">Introducing Veryfi
Thinking Mode.</div>`,
    sfx: [[.1, 'shimmer']],
  },
};
