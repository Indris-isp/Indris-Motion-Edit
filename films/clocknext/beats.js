/* Clocknext — follow ONE example agent run (run_4821, Acme Inc., one voice call) from usage → charge → margin.
 * Example figures, labelled on screen, reconcile: provider cost $0.11, charge $0.45 (Clocknext's own "Voice call" composite price), kept $0.34 = 75.6%. */
const RUN = 'run_4821';
window.BEATS = {
  run: {
    name: 'run', src: 'illus', copy: 'Your AI ran. Did it make money?', boards: [3.2],
    note: 'Navy. One agent run lands (support agent · Acme Inc. · 1 voice call · completed). The provider cost ticks in. A "?" hangs where the revenue should be. All figures tagged EXAMPLE.',
    bg: 'dark', dark: 1, len: 4, hero: 3.2,
    html: `<div class="hd" style="left:120px;top:150px" data-in=".2,.8,up">Your AI ran.</div>
      <div class="hd" style="left:120px;top:260px;color:#6B9BFF" data-in=".9,.8,up">Did it make money?</div>
      <div class="run" style="left:1000px;top:420px;width:800px" data-in=".4,.8,left">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><span class="mono" style="font-size:24px">${RUN}</span><span class="ex">EXAMPLE</span></div>
        <div class="r" data-in=".9,.4,up"><span style="color:#8FA2C4">Agent</span><span>support-agent</span></div>
        <div class="r" data-in="1.05,.4,up"><span style="color:#8FA2C4">Customer</span><span>Acme Inc.</span></div>
        <div class="r" data-in="1.2,.4,up"><span style="color:#8FA2C4">Usage</span><span>1 voice call · completed ✓</span></div>
        <div class="r" data-in="1.7,.4,up"><span style="color:#8FA2C4">Provider cost</span><span class="mono" data-count="1.7,2.3">$0.11</span></div>
        <div class="r" data-in="2.3,.4,up"><span style="color:#8FA2C4">Revenue</span><span class="mono" style="color:#6B9BFF;font-size:30px">?</span></div>
      </div>
      <div class="ex" style="position:absolute;left:120px;top:960px" data-in="2.6,.5,fade">EXAMPLE FIGURES</div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px" data-in=".2,.8,up">Your AI ran.</div>
      <div class="hd" style="left:80px;top:370px;color:#6B9BFF" data-in=".9,.8,up">Did it make
money?</div>
      <div class="run" style="left:60px;top:720px;width:960px;font-size:36px" data-in=".4,.8,up">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><span class="mono" style="font-size:26px">${RUN}</span><span class="ex">EXAMPLE</span></div>
        <div class="r" data-in=".9,.4,up"><span style="color:#8FA2C4">Agent</span><span>support-agent</span></div>
        <div class="r" data-in="1.05,.4,up"><span style="color:#8FA2C4">Customer</span><span>Acme Inc.</span></div>
        <div class="r" data-in="1.2,.4,up"><span style="color:#8FA2C4">Usage</span><span>1 voice call · completed ✓</span></div>
        <div class="r" data-in="1.7,.4,up"><span style="color:#8FA2C4">Provider cost</span><span class="mono" data-count="1.7,2.3">$0.11</span></div>
        <div class="r" data-in="2.3,.4,up"><span style="color:#8FA2C4">Revenue</span><span class="mono" style="color:#6B9BFF;font-size:30px">?</span></div>
      </div>`,
    sfx: [[.2, 'whoosh_s'], [.9, 'ticks3'], [1.7, 'tick'], [2.3, 'pop']],
  },
  meter: {
    name: 'meter', src: 'sample', copy: 'Track usage.', boards: [1.4, 5.0],
    note: 'Real Clocknext metering view (revenue vs provider cost, usage per customer and model). The bar for our run lights up blue under Acme Inc.; a tooltip names the event: run_4821 · voice call · provider cost $0.11 (EXAMPLE). Slow push-in on it.',
    bg: 'light', len: 8, hero: 5,
    cam: [[0, 1, .5, .5], [2.0, 1, .5, .5], [4.0, 1.25, .2, .58], [8, 1.28, .2, .58]],
    camV: [[0, 1, .5, .5], [2.0, 1, .5, .5], [4.0, 1.2, .2, .5], [8, 1.22, .2, .5]],
    html: `<div class="hd" style="left:120px;top:140px" data-in=".2,.8,up">Track usage.</div>
      <div class="shot" style="left:120px;top:420px;width:1680px" data-in="0,.8,rise"><img src="assets/meter.png"></div>
      <div class="bluebar" style="left:208px;top:600px;width:14px;height:96px" data-in="2.2,.5,fade"></div>
      <div class="tip" style="left:236px;top:458px" data-in="2.6,.6,up"><span style="color:#6B9BFF">●</span> ${RUN} · Acme Inc.<br>voice call · provider cost $0.11 <span style="color:#8FA2C4">· EXAMPLE</span></div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px" data-in=".2,.8,up">Track usage.</div>
      <div style="position:absolute;left:0;top:640px;width:1080px;height:420px;overflow:hidden" data-in="0,.8,rise"><img src="assets/meter.png" style="position:absolute;left:30px;top:20px;width:1680px;border-radius:16px"></div>
      <div class="bluebar" style="left:118px;top:840px;width:14px;height:96px" data-in="2.2,.5,fade"></div>
      <div class="tip" style="left:80px;top:1120px;font-size:24px" data-in="2.6,.6,up"><span style="color:#6B9BFF">●</span> ${RUN} · Acme Inc.<br>voice call · provider cost $0.11<br><span style="color:#8FA2C4">EXAMPLE</span></div>`,
    sfx: [[0, 'whoosh'], [2.2, 'tick'], [2.6, 'pop']],
  },
  charge: {
    name: 'charge', src: 'sample', copy: 'Turn usage into a charge.', boards: [1.6, 6.0],
    note: 'Real Clocknext plan builder: the "Voice call" composite, one line item at $0.45 / call. The run\'s event chip flies into it; the price is ringed; result: 1 call × $0.45 = $0.45 charged to Acme Inc. (EXAMPLE).',
    bg: 'light', len: 9, hero: 6,
    cam: [[0, 1, .5, .5], [3.0, 1, .5, .5], [4.6, 1.04, .7, .62], [9, 1.05, .7, .62]],
    html: `<div class="hd" style="left:120px;top:140px" data-in=".2,.8,up">Turn usage
into a charge.</div>
      <div class="shot" style="left:980px;top:200px;width:820px" data-in=".3,.8,rise"><img src="assets/composite.png"></div>
      <div class="chip" style="left:120px;top:560px;width:380px;z-index:5" data-in="1.0,.5,pop" data-fly="2.6,3.5,1380,614,380,62" data-out="3.7,.35">${RUN} · 1 voice call</div>
      <div class="ringbox" style="left:1552px;top:612px;width:200px;height:66px" data-ring="3.9,.6"></div>
      <div class="card" style="left:980px;top:850px;width:820px;padding:22px 30px" data-in="4.6,.6,up"><div style="display:flex;justify-content:space-between;align-items:center"><span class="mono" style="font-size:26px">1 call × $0.45 = <b style="color:#3D6FE0">$0.45</b></span><span class="ex">EXAMPLE</span></div></div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px" data-in=".2,.8,up">Turn usage
into a charge.</div>
      <div class="shot" style="left:80px;top:600px;width:920px" data-in=".3,.8,rise"><img src="assets/composite.png"></div>
      <div class="chip" style="left:80px;top:1360px;width:400px;z-index:5" data-in="1.0,.5,pop" data-fly="2.6,3.5,330,1057,400,62" data-out="3.7,.35">${RUN} · 1 voice call</div>
      <div class="ringbox" style="left:736px;top:1052px;width:210px;height:72px" data-ring="3.9,.6"></div>
      <div class="card" style="left:80px;top:1300px;width:920px;padding:22px 30px" data-in="4.6,.6,up"><div style="display:flex;justify-content:space-between;align-items:center"><span class="mono" style="font-size:28px">1 call × $0.45 = <b style="color:#3D6FE0">$0.45</b></span><span class="ex">EXAMPLE</span></div></div>`,
    sfx: [[.3, 'whoosh'], [1.0, 'pop'], [2.6, 'whoosh_s'], [3.9, 'pop'], [4.6, 'tick']],
  },
  margin: {
    name: 'margin', src: 'sample', copy: 'See what you keep.', boards: [1.6, 4.4],
    note: 'Real Clocknext customer view for Acme Inc. (revenue $84,250 · provider cost $21,180 · 74.9% gross margin) beside the run\'s own line: charge $0.45 vs provider cost $0.11 → you keep $0.34 (75.6%). One blue highlight steps charge → cost → keep; the account\'s gross margin is ringed.',
    bg: 'light', len: 6, hero: 4.4,
    html: `<div class="hd" style="left:120px;top:140px" data-in=".1,.8,up">See what you keep.</div>
      <div class="shot" style="left:760px;top:260px;width:1100px" data-in=".2,.8,rise"><img src="assets/margin_c.png"></div>
      <div class="ringbox" style="left:1626px;top:320px;width:120px;height:58px" data-ring="4.6,.6"></div>
      <div class="card" style="left:100px;top:400px;width:600px" data-in=".6,.7,left">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="mono">${RUN} · Acme Inc.</span><span class="ex">EXAMPLE</span></div>
        <div style="position:absolute;left:14px;right:14px;top:86px;height:70px;background:rgba(107,155,255,.22);border-radius:10px;z-index:0" data-in="1.4,.4,fade" data-pan="2.4,2.9,0,0,0,71"></div>
        <div style="position:absolute;left:14px;right:14px;top:228px;height:70px;background:rgba(107,155,255,.35);border-radius:10px;z-index:0" data-in="3.3,.4,fade"></div>
        <div class="r"><span>Customer charge</span><span class="mono">$0.45</span></div>
        <div class="r"><span>Provider cost</span><span class="mono">−$0.11</span></div>
        <div class="r" style="font-weight:600"><span>You keep</span><span class="mono" style="color:#3D6FE0;font-size:30px"><span data-count="3.3,3.9">$0.34</span> · 75.6%</span></div>
      </div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px" data-in=".1,.8,up">See what
you keep.</div>
      <div class="card" style="left:60px;top:560px;width:960px" data-in=".6,.7,up">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="mono">${RUN} · Acme Inc.</span><span class="ex">EXAMPLE</span></div>
        <div style="position:absolute;left:14px;right:14px;top:86px;height:70px;background:rgba(107,155,255,.22);border-radius:10px;z-index:0" data-in="1.4,.4,fade" data-pan="2.4,2.9,0,0,0,71"></div>
        <div style="position:absolute;left:14px;right:14px;top:228px;height:70px;background:rgba(107,155,255,.35);border-radius:10px;z-index:0" data-in="3.3,.4,fade"></div>
        <div class="r"><span>Customer charge</span><span class="mono">$0.45</span></div>
        <div class="r"><span>Provider cost</span><span class="mono">−$0.11</span></div>
        <div class="r" style="font-weight:600"><span>You keep</span><span class="mono" style="color:#3D6FE0;font-size:30px"><span data-count="3.3,3.9">$0.34</span> · 75.6%</span></div>
      </div>
      <div class="shot" style="left:40px;top:1000px;width:1000px" data-in=".2,.8,rise"><img src="assets/margin_c.png"></div>`,
    sfx: [[.2, 'whoosh'], [1.4, 'tick'], [2.4, 'tick'], [3.3, 'ticks3'], [4.6, 'pop']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'Pricing and billing for AI products.', boards: [2.8],
    note: 'Navy. Clocknext lockup (light version), the line, their real buttons "Book a demo" / "Get started for free".',
    bg: 'dark', dark: 1, len: 4, hero: 2.8,
    html: `<div class="ctr" style="left:960px;top:420px" data-in=".2,.8,blur"><img src="assets/logo_light.png" style="height:104px;display:block"></div>
      <div class="hd ctr" style="left:960px;top:590px;font-size:68px;color:#F1F4F8" data-in=".8,.8,up">Pricing and billing for AI products.</div>
      <div class="ctr" style="left:960px;top:730px;display:flex;gap:18px" data-in="1.4,.6,up"><span style="background:#6B9BFF;color:#0B1220;font:600 26px Geist;border-radius:8px;padding:18px 30px">Book a demo</span><span style="border:1.5px solid #5D6F90;color:#F1F4F8;font:500 26px Geist;border-radius:8px;padding:18px 30px">Get started for free</span></div>`,
    htmlV: `<div class="ctr" style="left:540px;top:800px" data-in=".2,.8,blur"><img src="assets/logo_light.png" style="height:96px;display:block"></div>
      <div class="hd ctr" style="left:540px;top:990px;font-size:76px;color:#F1F4F8;text-align:center" data-in=".8,.8,up">Pricing and billing
for AI products.</div>
      <div class="ctr" style="left:540px;top:1180px;display:flex;gap:18px" data-in="1.4,.6,up"><span style="background:#6B9BFF;color:#0B1220;font:600 26px Geist;border-radius:8px;padding:18px 30px">Book a demo</span><span style="border:1.5px solid #5D6F90;color:#F1F4F8;font:500 26px Geist;border-radius:8px;padding:18px 30px">Get started for free</span></div>`,
    sfx: [[.2, 'shimmer']],
  },
};
