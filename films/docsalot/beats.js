/* DocsAlot — one customer question asked in a test Slack workspace, answered with a citation; a second question exposes a docs gap.
 * Question = DocsAlot's own documented example. Answer + cited sentence = their real Authentication page. */
const Q = 'How do I configure authentication?';
const BOT = (big) => `<div class="av" style="background:#fff;box-shadow:inset 0 0 0 1.5px #E7E6EE"><img src="assets/mark.svg" style="width:34px"></div>`;
const ANSWER = `Set a default once in <code>layout.json</code>: <code>"auth": { "method": "bearer" }</code>. To change one endpoint, override it with <code>authMethod</code> in that page's frontmatter.`;
const CHAT = (w, h, inner) => `<div class="chat" style="left:0;top:0;width:${w}px;height:${h}px"><div class="top"># support <small>test workspace</small></div>${inner}</div>`;
window.BEATS = {
  again: {
    name: 'again', src: 'illus', copy: 'Still answering this by hand?', boards: [3.0],
    note: 'Two customers, two days, the same question. The second bubble lands on top of the first.',
    bg: 'light', len: 4, hero: 3.0,
    html: `<div class="hd" style="left:120px;top:140px" data-in=".1,.8,up">Still answering this by hand?</div>
      <div class="bubble" style="left:640px;top:400px" data-in=".6,.6,up"><small>MON 09:12 · customer A</small>${Q}</div>
      <div class="bubble" style="left:900px;top:640px" data-in="1.5,.6,up"><small>THU 16:40 · customer B</small>${Q}</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">Still answering
this by hand?</div>
      <div class="bubble" style="left:60px;top:640px;font-size:34px" data-in=".6,.6,up"><small>MON 09:12 · customer A</small>${Q}</div>
      <div class="bubble" style="left:110px;top:880px;font-size:34px" data-in="1.5,.6,up"><small>THU 16:40 · customer B</small>${Q}</div>`,
    sfx: [[.6, 'pop'], [1.5, 'pop']],
  },
  ask: {
    name: 'ask', src: 'placeholder', copy: 'Ask in Slack.', boards: [4.2],
    note: 'In a test Slack workspace, the question is typed with an @docsalot mention (their documented usage: "@docsalot <your question>"). Message pops in. PLACEHOLDER: rebuild of a Slack thread until the team sends a capture from their test workspace.',
    bg: 'light', len: 8, hero: 4.2,
    html: `<div class="hd" style="left:120px;top:140px" data-in=".1,.8,up">Ask in Slack.</div>
      <div class="cmd" style="left:126px;top:280px" data-in=".6,.6,up">@docsalot &lt;your question&gt;</div>
      <div style="position:absolute;left:760px;top:240px" data-in=".2,.8,rise">${CHAT(1040, 560, `
        <div class="msg" data-in="3.4,.4,up"><div class="av" style="background:#E07A5F">JR</div><div><b>Jordan R.</b><time>16:42</time><p><span class="at">@docsalot</span> ${Q}</p></div></div>`)}
        <div style="position:absolute;left:28px;right:28px;bottom:28px;height:76px;border:1.5px solid #DAD9E1;border-radius:12px;display:flex;align-items:center;padding:0 22px;font:400 27px Geist;color:#202124" data-out="3.3,.2"><span class="at" data-in="1.2,.1,fade">@docsalot</span>&nbsp;<span data-type="1.5,3.0">${Q}</span></div></div>
      <div class="ph-tag" style="left:760px;top:840px">Placeholder · needs test-workspace capture</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">Ask in Slack.</div>
      <div class="cmd" style="left:84px;top:390px" data-in=".6,.6,up">@docsalot &lt;your question&gt;</div>
      <div style="position:absolute;left:40px;top:520px" data-in=".2,.8,rise">${CHAT(1000, 700, `
        <div class="msg" data-in="3.4,.4,up"><div class="av" style="background:#E07A5F">JR</div><div><b>Jordan R.</b><time>16:42</time><p><span class="at">@docsalot</span> ${Q}</p></div></div>`)}
        <div style="position:absolute;left:28px;right:28px;bottom:28px;height:76px;border:1.5px solid #DAD9E1;border-radius:12px;display:flex;align-items:center;padding:0 22px;font:400 25px Geist;color:#202124;white-space:nowrap;overflow:hidden" data-out="3.3,.2"><span class="at" data-in="1.2,.1,fade">@docsalot</span>&nbsp;<span data-type="1.5,3.0">${Q}</span></div></div>
      <div class="ph-tag" style="left:40px;top:1260px">Placeholder · needs test-workspace capture</div>`,
    sfx: [[.2, 'whoosh'], [1.2, 'type3'], [1.6, 'type8'], [3.4, 'pop']],
  },
  answer: {
    name: 'answer', src: 'placeholder', copy: 'Get an answer with a source.', boards: [3.6],
    note: 'The bot replies in the thread with the answer and a cited link to docs.docsalot.dev/document-apis/authentication. The link is ringed and the cursor clicks it: that click is the cut to the source. PLACEHOLDER thread UI as above; the answer text is taken from their real Authentication page.',
    bg: 'light', len: 5, hero: 3.6,
    cam: [[0, 1, .5, .5], [3.0, 1, .5, .5], [5, 1.14, .55, .72]],
    camV: [[0, 1, .5, .5], [3.0, 1, .5, .5], [5, 1.1, .4, .62]],
    cursor: [[3.4, [.9, 1.05]], [4.5, '#srclink', true]],
    html: `<div class="hd" style="left:120px;top:110px" data-in="0,.7,up">Get an answer
with a source.</div>
      <div style="position:absolute;left:640px;top:300px">${CHAT(1160, 700, `
        <div class="msg"><div class="av" style="background:#E07A5F">JR</div><div><b>Jordan R.</b><time>16:42</time><p><span class="at">@docsalot</span> ${Q}</p></div></div>
        <div class="msg" data-in=".9,.5,up">${BOT()}<div style="min-width:0"><b>DocsAlot</b><time>16:42 · APP</time><p data-in="1.2,.6,fade">${ANSWER}</p>
          <div id="srclink" class="src" data-in="2.0,.5,pop" data-ring="2.8,.6">↗ docs.docsalot.dev/document-apis/authentication</div></div></div>`)}</div>
      <div class="ph-tag" style="left:120px;top:960px">Placeholder · needs test-workspace capture</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in="0,.7,up">Get an answer
with a source.</div>
      <div style="position:absolute;left:40px;top:520px">${CHAT(1000, 940, `
        <div class="msg"><div class="av" style="background:#E07A5F">JR</div><div><b>Jordan R.</b><time>16:42</time><p><span class="at">@docsalot</span> ${Q}</p></div></div>
        <div class="msg" data-in=".9,.5,up">${BOT()}<div style="min-width:0"><b>DocsAlot</b><time>16:42 · APP</time><p data-in="1.2,.6,fade">${ANSWER}</p>
          <div id="srclink" class="src" style="font-size:18px" data-in="2.0,.5,pop" data-ring="2.8,.6">↗ docs.docsalot.dev/document-apis/authentication</div></div></div>`)}</div>
      <div class="ph-tag" style="left:40px;top:1500px">Placeholder · needs test-workspace capture</div>`,
    sfx: [[.9, 'pop'], [2.0, 'pop'], [4.5, 'click']],
  },
  source: {
    name: 'source', src: 'real', copy: '(Get an answer with a source.)', boards: [2.6],
    note: 'Cut from the citation to the real DocsAlot docs page, Authentication. Push in on the exact source sentence, "Most projects should define a default auth method in layout.json.", which gets the violet highlight. This is the visual payoff.',
    bg: '#F6F5FA', len: 5, hero: 2.6,
    cam: [[0, 1.0, .5, .5], [1.0, 1.0, .5, .5], [2.4, 1.45, .44, .66], [5, 1.5, .44, .66]],
    camV: [[0, 1.0, .5, .5], [1.0, 1.0, .5, .5], [2.4, 1.5, .4, .5], [5, 1.55, .4, .5]],
    html: `<div class="win" style="left:210px;top:120px;width:1500px;height:850px" data-in="0,.5,fade"><div class="bar"><i></i><i></i><i></i><span>docs.docsalot.dev/document-apis/authentication</span></div><img src="assets/auth_page.png" style="width:100%;display:block"></div>
      <div class="hlbox" style="left:572px;top:607px;width:528px;height:42px" data-in="1.6,.6,wipe"></div>`,
    htmlV: `<div class="win" style="left:40px;top:560px;width:1000px;height:700px" data-in="0,.5,fade"><div class="bar"><i></i><i></i><i></i><span>docs.docsalot.dev/document-apis/authentication</span></div><img src="assets/auth_page.png" style="width:100%;display:block"></div>
      <div class="hlbox" style="left:283px;top:906px;width:352px;height:30px" data-in="1.6,.6,wipe"></div>`,
    sfx: [[0, 'whoosh_s'], [1.6, 'swoop']],
  },
  gap: {
    name: 'gap', src: 'placeholder', copy: 'See what your docs are missing.', boards: [4.0],
    note: 'A second question that the docs do not cover ("Can we rotate API keys from the dashboard?"). The bot says it found no documented answer, and the gap is flagged for the docs team. PLACEHOLDER: only show the flag if DocsAlot can supply this capture; the question is a sample.',
    bg: 'light', len: 7, hero: 4.0,
    html: `<div class="hd" style="left:120px;top:110px" data-in=".1,.8,up">See what your
docs are missing.</div>
      <div style="position:absolute;left:640px;top:330px" data-in="0,.6,fade">${CHAT(1160, 640, `
        <div class="msg" data-in=".6,.4,up"><div class="av" style="background:#3D8B6E">MK</div><div><b>Maya K.</b><time>17:05</time><p><span class="at">@docsalot</span> Can we rotate API keys from the dashboard?</p></div></div>
        <div class="msg" data-in="1.6,.5,up">${BOT()}<div><b>DocsAlot</b><time>17:05 · APP</time><p>I couldn't find a documented answer for this.</p>
          <div class="flag" data-in="2.6,.5,pop" data-ring="3.2,.6">⚑ Docs gap flagged for your team</div></div></div>`)}</div>
      <div class="ph-tag" style="left:120px;top:960px">Placeholder · show only if capture exists</div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".1,.8,up">See what your
docs are missing.</div>
      <div style="position:absolute;left:40px;top:540px" data-in="0,.6,fade">${CHAT(1000, 760, `
        <div class="msg" data-in=".6,.4,up"><div class="av" style="background:#3D8B6E">MK</div><div><b>Maya K.</b><time>17:05</time><p><span class="at">@docsalot</span> Can we rotate API keys from the dashboard?</p></div></div>
        <div class="msg" data-in="1.6,.5,up">${BOT()}<div><b>DocsAlot</b><time>17:05 · APP</time><p>I couldn't find a documented answer for this.</p>
          <div class="flag" data-in="2.6,.5,pop" data-ring="3.2,.6">⚑ Docs gap flagged for your team</div></div></div>`)}</div>
      <div class="ph-tag" style="left:40px;top:1340px">Placeholder · show only if capture exists</div>`,
    sfx: [[.6, 'pop'], [1.6, 'pop'], [2.6, 'stamp']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'DocsAlot for customer support.', boards: [2.6],
    note: 'DocsAlot logo, the line, and a mono label: "Slack · Discord".',
    bg: 'light', len: 4, hero: 2.6,
    html: `<div class="ctr" style="left:960px;top:410px" data-in=".2,.8,blur"><img src="assets/logo.svg" style="height:110px;display:block"></div>
      <div class="hd ctr" style="left:960px;top:590px;font-size:72px" data-in=".8,.8,up">DocsAlot for customer support.</div>
      <div class="cmd ctr" style="left:960px;top:720px;font-size:26px" data-in="1.4,.6,up">Slack · Discord</div>`,
    htmlV: `<div class="ctr" style="left:540px;top:790px" data-in=".2,.8,blur"><img src="assets/logo.svg" style="height:96px;display:block"></div>
      <div class="hd ctr" style="left:540px;top:980px;font-size:80px;text-align:center" data-in=".8,.8,up">DocsAlot for
customer support.</div>
      <div class="cmd ctr" style="left:540px;top:1150px;font-size:26px" data-in="1.4,.6,up">Slack · Discord</div>`,
    sfx: [[.2, 'shimmer']],
  },
};
