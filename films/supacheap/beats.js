/* Supacheap.eu — one person (dummy data: Alex Muster, Berlin) starts the free five-broker test and checks what is pending. */
const BROKERS = ['SCHUFA Holding AG', 'CRIF GmbH', 'Creditreform Boniversum GmbH', 'infoscore Consumer Data GmbH (Experian)', 'Verband der Vereine Creditreform e.V.'];
const CONTACT = `<div style="padding:30px 34px"><div class="lbl" style="position:static;margin-bottom:18px">Sample contact · dummy data</div>
  <div style="font:600 36px Inter;margin-bottom:10px">Alex Muster</div>
  <div style="font:400 24px/1.6 Inter;color:#5F6B7A">Musterstraße 12<br>10115 Berlin<br>alex.muster@example.com</div></div>`;
const FORM = (w) => `<div class="win" style="left:0;top:0;width:${w}px"><div class="bar"><i></i><i></i><i></i><span>supacheap.eu/en/free-tier</span></div><div style="position:relative;padding:28px 34px 30px">
  ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<img src="assets/form_${i}.png" style="${i ? 'position:absolute;left:34px;top:28px;width:calc(100% - 68px)' : ''}" ${i ? `data-in="${[0, 1.0, 1.8, 2.5, 3.0, 3.4, 3.9, 4.8][i]},.12,fade"` : ''}>`).join('')}</div></div>`;
window.BEATS = {
  who: {
    name: 'who', src: 'illus', copy: 'Who has your personal data?', boards: [2.9],
    note: 'A sample contact card (dummy data) beside the five brokers in the free test. Thin teal lines draw from the card to each broker.',
    bg: 'light', len: 4, hero: 2.9,
    html: `<div class="hd" style="left:120px;top:120px" data-in=".1,.8,up">Who has your personal data?</div>
      <div class="card" style="left:120px;top:400px;width:560px" data-in=".4,.7,left">${CONTACT}</div>
      <svg style="position:absolute;left:0;top:0" width="1920" height="1080">${BROKERS.map((b, i) => `<path d="M680 560 C 820 560 860 ${352 + i * 108} 1000 ${352 + i * 108}" pathLength="1" style="fill:none;stroke:#198575;stroke-width:2.5;opacity:.7" data-draw="${1.2 + i * .15},${1.7 + i * .15}"/>`).join('')}</svg>
      ${BROKERS.map((b, i) => `<div class="card" style="left:1000px;top:${314 + i * 108}px;width:800px;padding:20px 28px;font-size:26px" data-in="${.9 + i * .12},.5,left">${b}</div>`).join('')}`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">Who has your
personal data?</div>
      <div class="card" style="left:80px;top:520px;width:920px" data-in=".4,.7,up">${CONTACT}</div>
      ${BROKERS.map((b, i) => `<div class="card" style="left:140px;top:${930 + i * 112}px;width:860px;padding:22px 28px;font-size:26px" data-in="${.9 + i * .12},.5,left">${b}</div>`).join('')}
      <svg style="position:absolute;left:0;top:0" width="1080" height="1920">${BROKERS.map((b, i) => `<path d="M100 880 L100 ${966 + i * 112} L140 ${966 + i * 112}" pathLength="1" style="fill:none;stroke:#198575;stroke-width:2.5;opacity:.7" data-draw="${1.2 + i * .15},${1.7 + i * .15}"/>`).join('')}</svg>`,
    sfx: [[.4, 'whoosh_s'], [.9, 'pops5']],
  },
  start: {
    name: 'start', src: 'real', copy: 'Start with five brokers.', boards: [1.4, 5.0],
    note: 'Real supacheap.eu free test page ("Free test run for the top 5 data brokers"). Camera pushes into the "These brokers are included" box; it is ringed. Held long enough to read the five names.',
    bg: 'light', len: 7, hero: 5,
    cam: [[0, 1, .5, .5], [2.0, 1, .5, .5], [3.6, 1.45, .56, .78], [7, 1.5, .56, .78]],
    camV: [[0, 1, .5, .5], [2.0, 1, .5, .5], [3.6, 1.3, .5, .62], [7, 1.33, .5, .62]],
    html: `<div class="hd" style="left:120px;top:110px" data-in=".1,.8,up">Start with five brokers.</div>
      <div class="win" style="left:460px;top:290px;width:1300px" data-in=".2,.8,rise"><div class="bar"><i></i><i></i><i></i><span>supacheap.eu/en/free-tier</span></div><img src="assets/start.png"></div>
      <div class="ringbox" style="left:735px;top:866px;width:752px;height:232px" data-ring="3.8,.6"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">Start with
five brokers.</div>
      <div class="win" style="left:40px;top:640px;width:1000px" data-in=".2,.8,rise"><div class="bar"><i></i><i></i><i></i><span>supacheap.eu/en/free-tier</span></div><img src="assets/start.png"></div>
      <div class="ringbox" style="left:278px;top:1110px;width:582px;height:182px" data-ring="3.8,.6"></div>`,
    sfx: [[.2, 'whoosh'], [3.8, 'pop']],
  },
  send: {
    name: 'send', src: 'real', copy: 'Send removal requests.', boards: [1.0, 6.2],
    note: 'The real free-test form, filled in field by field with dummy data (Alex Muster, Musterstraße 12, 10115 Berlin, Germany); both consent boxes ticked; cursor presses "Request confirmation link". Captured from the live page; nothing was submitted.',
    bg: 'light', len: 9, hero: 6.2,
    cam: [[0, 1, .5, .5], [4.6, 1.03, .62, .5], [6.4, 1.1, .62, .8], [9, 1.1, .62, .8]],
    camV: [[0, 1, .5, .5], [6.4, 1.06, .5, .7], [9, 1.06, .5, .7]],
    cursor: [[5.2, [.98, 1.05]], [6.4, '#reqbtn', true]],
    cursorV: [[5.2, [.98, 1.05]], [6.4, '#reqbtn', true]],
    html: `<div class="hd" style="left:120px;top:140px" data-in=".1,.8,up">Send removal
requests.</div>
      <div class="lbl" style="left:126px;top:400px" data-in=".6,.6,up">Dummy data only</div>
      <div style="position:absolute;left:820px;top:60px;width:980px" data-in="0,.6,rise">${FORM(980)}</div>
      <div id="reqbtn" style="position:absolute;left:990px;top:902px;width:10px;height:10px"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">Send removal
requests.</div>
      <div class="lbl" style="left:84px;top:500px" data-in=".6,.6,up">Dummy data only</div>
      <div style="position:absolute;left:40px;top:580px;width:1000px" data-in="0,.6,rise">${FORM(1000)}</div>
      <div id="reqbtn" style="position:absolute;left:212px;top:1440px;width:10px;height:10px"></div>`,
    sfx: [[0, 'whoosh'], [1.0, 'type6'], [1.8, 'type4'], [2.5, 'type5'], [3.0, 'type2'], [3.4, 'type2'], [3.9, 'type3'], [4.8, 'click'], [6.4, 'click']],
  },
  track: {
    name: 'track', src: 'placeholder', copy: 'Track the next step.', boards: [4.4],
    note: 'PLACEHOLDER until Supacheap sends a clean dashboard capture. The free-test page says the dashboard "shows the status and the live countdown until the next possible request". Shown: each broker marked "Request sent" (outline) and "Removal confirmed" kept as a separate, solid state, with 0 of 5 confirmed so far. Countdown ticks. Held ~3 s to read.',
    bg: 'light', len: 6, hero: 4.4,
    html: `<div class="hd" style="left:120px;top:120px" data-in=".1,.8,up">Track the next step.</div>
      <div class="lbl" style="left:126px;top:260px" data-in=".5,.5,up">Next possible request in <span class="mono" style="color:#198575;letter-spacing:0">29d 23:59:41</span></div>
      <div class="card" style="left:120px;top:330px;width:1180px;overflow:hidden" data-in=".3,.7,up">
        ${BROKERS.map((b, i) => `<div class="brk" data-in="${.8 + i * .14},.4,up"><span>${b}</span><span class="st st-sent" data-in="${1.6 + i * .18},.4,pop">REQUEST SENT</span></div>`).join('')}</div>
      <div class="card" style="left:1360px;top:330px;width:440px;padding:30px" data-in="1.2,.6,left">
        <div class="lbl" style="position:static;margin-bottom:22px">Status key</div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px"><span class="st st-sent">REQUEST SENT</span><span class="mono" style="font-size:24px" data-count="2.4,3.2">5</span></div>
        <div style="display:flex;align-items:center;gap:14px"><span class="st st-done">REMOVAL CONFIRMED</span><span class="mono" style="font-size:24px">0</span></div>
        <div style="font:400 20px/1.45 Inter;color:#5F6B7A;margin-top:22px">Confirmed only when the broker replies.</div></div>
      <div class="ph-tag" style="left:120px;top:960px">Placeholder · needs real dashboard capture</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">Track the
next step.</div>
      <div class="lbl" style="left:84px;top:500px;font-size:20px" data-in=".5,.5,up">Next possible request in <span class="mono" style="color:#198575;letter-spacing:0">29d 23:59:41</span></div>
      <div class="card" style="left:40px;top:560px;width:1000px;overflow:hidden" data-in=".3,.7,up">
        ${BROKERS.map((b, i) => `<div class="brk" style="font-size:24px;padding:22px 22px" data-in="${.8 + i * .14},.4,up"><span>${b}</span><span class="st st-sent" style="font-size:16px" data-in="${1.6 + i * .18},.4,pop">REQUEST SENT</span></div>`).join('')}</div>
      <div class="card" style="left:40px;top:1140px;width:1000px;padding:30px" data-in="1.2,.6,up">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px"><span class="st st-sent">REQUEST SENT</span><span class="mono" style="font-size:24px" data-count="2.4,3.2">5</span></div>
        <div style="display:flex;align-items:center;gap:14px"><span class="st st-done">REMOVAL CONFIRMED</span><span class="mono" style="font-size:24px">0</span></div>
        <div style="font:400 22px/1.45 Inter;color:#5F6B7A;margin-top:22px">Confirmed only when the broker replies.</div></div>
      <div class="ph-tag" style="left:80px;top:1480px">Placeholder · needs real dashboard capture</div>`,
    sfx: [[.3, 'whoosh_s'], [1.6, 'pops5'], [2.4, 'ticks4']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'Try the free test.', boards: [2.6],
    note: 'Shield mark + Supacheap.eu wordmark, the line, and their real button label "Try for free: top 5 brokers free".',
    bg: 'light', len: 4, hero: 2.6,
    html: `<div class="ctr" style="left:960px;top:400px;display:flex;align-items:center;gap:20px" data-in=".2,.8,blur"><svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#202936" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span style="font:700 80px Inter;letter-spacing:-.03em;color:#202936">Supacheap.eu</span></div>
      <div class="hd ctr" style="left:960px;top:580px;font-size:78px" data-in=".8,.8,up">Try the free test.</div>
      <div class="ctr" style="left:960px;top:730px" data-in="1.4,.6,up"><span class="btn">Try for free: top 5 brokers free</span></div>`,
    htmlV: `<div class="ctr" style="left:540px;top:780px;display:flex;align-items:center;gap:16px" data-in=".2,.8,blur"><svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#202936" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span style="font:700 72px Inter;letter-spacing:-.03em;color:#202936">Supacheap.eu</span></div>
      <div class="hd ctr" style="left:540px;top:960px;font-size:84px" data-in=".8,.8,up">Try the free test.</div>
      <div class="ctr" style="left:540px;top:1120px" data-in="1.4,.6,up"><span class="btn" style="font-size:26px">Try for free: top 5 brokers free</span></div>`,
    sfx: [[.2, 'shimmer']],
  },
};
