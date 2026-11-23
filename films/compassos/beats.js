/* Compass OS — one sample candidate, one role (VP Product, Payments at Stripe, Compass's own example), one claim that gets removed.
 * All three product screens are Compass OS's real UI (match card, tailored résumé, Pip's claim check). */
const RESUME = `<h3>Sample Candidate</h3><div class="r">Product leader · Payments</div><div class="sec">EXPERIENCE</div>
  <ul><li>Led a 40-person product org across checkout, risk, and payouts.</li><li>Launched an ML fraud model that cut chargebacks 28%.</li><li>Grew payments revenue 3x in two years.</li></ul>
  <div class="sec">EARLIER</div><div class="sk" style="width:86%"></div><div class="sk" style="width:72%"></div><div class="sk" style="width:80%"></div>`;
window.BEATS = {
  role: {
    name: 'role', src: 'sample', copy: 'Found the right role?', boards: [2.8],
    note: 'A sample résumé on the left, the real Compass OS "Top match today" card (VP Product, Payments · 92% strong fit) rising beside it.',
    bg: 'light', len: 4, hero: 2.8,
    html: `<div class="hd" style="left:120px;top:110px;font-size:100px" data-in=".2,.8,up">Found the right role?</div>
      <div class="paper" style="left:120px;top:300px;width:600px;height:700px" data-in=".5,.8,left">${RESUME}</div>
      <div class="shot" style="left:800px;top:380px;width:1000px" data-in="1.0,.9,rise"><img src="assets/match.png"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px;font-size:100px" data-in=".2,.8,up">Found the
right role?</div>
      <div class="paper" style="left:80px;top:1060px;width:920px;height:640px" data-in=".5,.8,up">${RESUME}</div>
      <div class="shot" style="left:60px;top:540px;width:960px;z-index:3" data-in="1.0,.9,rise"><img src="assets/match.png"></div>`,
    sfx: [[.2, 'whoosh_s'], [1.0, 'whoosh']],
  },
  fit: {
    name: 'fit', src: 'real', copy: 'See why it fits.', boards: [3.4],
    note: 'Real match card. One reason gets the single yellow annotation ("Two payments launches and a marketplace P&L match their must-haves"), then the 92% fit is ringed. Slow push-in; the line stays on screen long enough to read.',
    bg: 'light', len: 6.5, hero: 3.4,
    cam: [[0, 1, .5, .5], [1.2, 1, .5, .5], [3.2, 1.07, .62, .6], [6.5, 1.09, .62, .6]],
    camV: [[0, 1, .5, .5], [1.2, 1, .5, .5], [3.2, 1.14, .5, .45], [6.5, 1.18, .5, .45]],
    html: `<div class="hd" style="left:120px;top:130px;font-size:100px" data-in=".1,.8,up">See why it fits.</div>
      <div class="shot" style="left:560px;top:300px;width:1240px" data-in="0,.7,fade"><img src="assets/match.png"></div>
      <div class="hl" style="left:620px;top:600px;width:1046px;height:66px;opacity:.55" data-in="1.6,.7,wipe"></div>
      <div class="ringbox" style="left:1520px;top:386px;width:200px;height:112px" data-ring="2.8,.6"></div>
      <div class="lbl" style="left:126px;top:300px;width:380px" data-in="3.2,.7,up">From your profile:<br><b style="color:#23272F">two payments launches,<br>a marketplace P&amp;L</b></div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px;font-size:100px" data-in=".1,.8,up">See why
it fits.</div>
      <div class="shot" style="left:60px;top:600px;width:960px" data-in="0,.7,fade"><img src="assets/match.png"></div>
      <div class="hl" style="left:106px;top:832px;width:812px;height:52px;opacity:.55" data-in="1.6,.7,wipe"></div>
      <div class="ringbox" style="left:803px;top:664px;width:156px;height:90px" data-ring="2.8,.6"></div>
      <div class="lbl" style="left:86px;top:1260px;width:900px;font-size:26px" data-in="3.2,.7,up">From your profile: <b style="color:#23272F">two payments launches, a marketplace P&amp;L</b></div>`,
    sfx: [[1.6, 'swoop'], [2.8, 'pop']],
  },
  tailor: {
    name: 'tailor', src: 'real', copy: 'Tailor it to the role.', boards: [1.6, 4.6],
    note: 'Real tailored résumé ("Resume for Stripe · VP Product, Payments"). The unsupported line "Grew payments revenue 3x in two years" is ringed; Pip\'s real check pops beside it: "“3x” isn\'t in your profile. Remove it, or add the fact to your profile first. I won\'t make things up for you." Held ~3 s to read.',
    bg: 'light', len: 8, hero: 4.6,
    cam: [[0, 1, .5, .5], [1.6, 1, .5, .5], [3.0, 1.05, .6, .6], [8, 1.07, .6, .6]],
    html: `<div class="hd" style="left:120px;top:110px;font-size:100px" data-in=".1,.8,up">Tailor it to the role.</div>
      <div class="shot" style="left:100px;top:290px;width:1200px" data-in=".2,.8,rise"><img src="assets/resume.png"></div>
      <div class="ringbox" style="left:136px;top:622px;width:1128px;height:84px" data-ring="2.0,.6"></div>
      <svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path d="M1266 664 C1300 664 1310 620 1336 600" pathLength="1" style="fill:none;stroke:#E0B028;stroke-width:3" data-draw="2.7,3.1"/></svg>
      <div class="shot" style="left:1336px;top:440px;width:520px" data-in="3.0,.6,pop"><img src="assets/pip.png"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px;font-size:100px" data-in=".1,.8,up">Tailor it
to the role.</div>
      <div class="shot" style="left:20px;top:600px;width:1040px" data-in=".2,.8,rise"><img src="assets/resume.png"></div>
      <div class="ringbox" style="left:50px;top:896px;width:980px;height:76px" data-ring="2.0,.6"></div>
      <svg style="position:absolute;left:0;top:0" width="1080" height="1920"><path d="M540 974 L540 1110" pathLength="1" style="fill:none;stroke:#E0B028;stroke-width:3" data-draw="2.7,3.1"/></svg>
      <div class="shot" style="left:150px;top:1110px;width:780px" data-in="3.0,.6,pop"><img src="assets/pip.png"></div>`,
    sfx: [[.2, 'whoosh'], [2.0, 'pop'], [3.0, 'pop']],
  },
  grounded: {
    name: 'grounded', src: 'illus', copy: 'Keep every claim grounded.', boards: [1.2, 3.8],
    note: 'Same résumé card. The "3x" line is struck through, then replaced in place by a line traced to the sample profile: "Shipped two payments launches and ran a marketplace P&L." Footer flips from "2 of 3" to "3 of 3 lines traced to your profile". The edit is an overlay on the real card; confirm the wording with the product\'s real verification flow.',
    bg: 'light', len: 6, hero: 3.8,
    cam: [[0, 1, .5, .5], [1.0, 1.06, .5, .6], [6, 1.1, .5, .6]],
    camV: [[0, 1, .5, .5], [1.0, 1.06, .5, .5], [6, 1.1, .5, .5]],
    html: `<div class="hd" style="left:120px;top:110px;font-size:100px" data-in="0,.7,up">Keep every claim grounded.</div>
      <div class="shot" style="left:410px;top:300px;width:1100px"><img src="assets/resume.png"></div>
      <div style="position:absolute;left:470px;top:650px;width:470px;height:4px;background:#C2412D;border-radius:2px" data-in=".7,.5,wipe" data-out="1.75,.2"></div>
      <div data-swap="1.8,.7" style="position:absolute;left:442px;top:612px;width:1040px;height:82px"><span class="sa"></span><span class="sb patch" style="height:78px">•&nbsp;&nbsp;Shipped two payments launches and ran a marketplace P&amp;L.</span></div>
      <div data-swap="2.5,.6" style="position:absolute;left:411px;top:740px;width:1098px;height:70px"><span class="sa"></span><span class="sb" style="display:flex;align-items:center;height:70px;background:#FAF5EA;color:#1E6B52;font:600 21px Inter;padding-left:44px;border-radius:0 0 22px 22px">✓&nbsp; 3 of 3 lines traced to your profile</span></div>
      <div class="pill" style="left:452px;top:850px" data-in="3.1,.5,pop">Grounded in: two payments launches · marketplace P&amp;L</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px;font-size:100px" data-in="0,.7,up">Keep every
claim grounded.</div>
      <div class="shot" style="left:20px;top:600px;width:1040px"><img src="assets/resume.png"></div>
      <div style="position:absolute;left:76px;top:931px;width:440px;height:4px;background:#C2412D;border-radius:2px" data-in=".7,.5,wipe" data-out="1.75,.2"></div>
      <div data-swap="1.8,.7" style="position:absolute;left:52px;top:901px;width:984px;height:66px"><span class="sa"></span><span class="sb patch" style="height:62px;font-size:23px;padding-left:22px">•&nbsp;&nbsp;Shipped two payments launches and ran a marketplace P&amp;L.</span></div>
      <div data-swap="2.5,.6" style="position:absolute;left:21px;top:1015px;width:1038px;height:68px"><span class="sa"></span><span class="sb" style="display:flex;align-items:center;height:68px;background:#FAF5EA;color:#1E6B52;font:600 19px Inter;padding-left:38px;border-radius:0 0 20px 20px">✓&nbsp; 3 of 3 lines traced to your profile</span></div>
      <div class="pill" style="left:80px;top:1140px;font-size:21px" data-in="3.1,.5,pop">Grounded in: two payments launches · marketplace P&amp;L</div>`,
    sfx: [[.7, 'swoop'], [1.8, 'whoosh_s'], [2.5, 'tick'], [3.1, 'pop']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'Get ready for your next move.', boards: [2.6],
    note: 'Compass OS mascot + wordmark, the line, and their real "Create free account" button.',
    bg: 'light', len: 4, hero: 2.6,
    html: `<div class="ctr" style="left:960px;top:400px;display:flex;align-items:center;gap:22px" data-in=".2,.8,blur"><img src="assets/logo.svg" style="height:130px"><span style="font:700 86px Gabarito;color:#17302A;letter-spacing:-.02em">Compass OS</span></div>
      <div class="hd ctr" style="left:960px;top:590px;font-size:72px" data-in=".8,.8,up">Get ready for your next move.</div>
      <div class="ctr" style="left:960px;top:740px" data-in="1.4,.6,up"><span class="cta">Create free account</span></div>`,
    htmlV: `<div class="ctr" style="left:540px;top:760px;display:flex;align-items:center;gap:18px" data-in=".2,.8,blur"><img src="assets/logo.svg" style="height:110px"><span style="font:700 72px Gabarito;color:#17302A">Compass OS</span></div>
      <div class="hd ctr" style="left:540px;top:960px;font-size:76px;text-align:center" data-in=".8,.8,up">Get ready for
your next move.</div>
      <div class="ctr" style="left:540px;top:1150px" data-in="1.4,.6,up"><span class="cta">Create free account</span></div>`,
    sfx: [[.2, 'shimmer']],
  },
};
