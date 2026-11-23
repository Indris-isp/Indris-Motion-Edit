/* SilentRoom — one writer, one chapter. Rough notes on a cluttered desk become a draft inside the workspace;
 * the writer accepts one AI suggestion, then rewrites half of it in their own words. All text is sample text. */
const NOTES = [
  ['CH. 3', 'The kitchen at dusk?'],
  ['MUM', '"We kept our own hours."'],
  ['CUT?', 'Bus scene drags.'],
  ['INTERVIEW P.12', 'The kettle, always the kettle.'],
];
const TABS = ['Notes on memory.pdf', 'Interview transcript', 'Thesaurus: quiet', 'Dusk light refs', 'Draft v0 (empty)', 'Ch.2 feedback', 'Kettle history', 'Mum voice memo', 'Outline'];
const note = (i, x, y, r, extra = '') => `<div style="position:absolute;left:${x}px;top:${y}px" ${extra}><div class="note" style="transform:rotate(${r}deg)"><small>${NOTES[i][0]}</small>${NOTES[i][1]}</div></div>`;
const LINE1 = 'The house kept its own hours.';
const SUG1 = ' By six the street had gone quiet, and ';
const SUG2 = 'a sense of profound stillness settled over the desk.';
const MINE = 'I sat with the notes I had been avoiding all week.';
const PH = (x, y) => `<div class="ph-tag" style="left:${x}px;top:${y}px">Placeholder · needs real workspace recording</div>`;
window.BEATS = {
  desk: {
    name: 'desk', src: 'illus', copy: 'Too many tabs. Still a blank page.', boards: [3.6],
    note: 'A writer\'s desk: sticky notes, nine reference tabs, an empty draft with a waiting caret. Light keyboard taps, no typing. Everything drifts a little.',
    bg: 'accent', len: 5, hero: 3.6, drift: .03,
    html: `<div class="hd" style="left:120px;top:120px" data-in=".4,.9,up">Too many tabs.
Still a blank page.</div>
      <div class="win" style="left:820px;top:170px;width:1000px;height:640px" data-in=".1,.8,fade"><div class="tabs">${TABS.map((t, i) => `<span class="${i === 4 ? 'on' : ''}" data-in="${.3 + i * .08},.3,fade">${t}</span>`).join('')}</div>
        <div style="padding:60px 80px"><div style="font:400 44px 'Source Serif 4';color:#B4AB9C">Untitled</div><div style="margin-top:26px;width:3px;height:44px;background:#794B57" data-in="1.4,.1,fade"></div></div></div>
      ${note(0, 140, 560, -4, 'data-in=".6,.6,up"')}${note(1, 470, 640, 3, 'data-in=".8,.6,up"')}${note(2, 300, 830, -2, 'data-in="1.0,.6,up"')}${note(3, 740, 760, 5, 'data-in="1.2,.6,up"')}`,
    htmlV: `<div class="hd" style="left:80px;top:250px" data-in=".4,.9,up">Too many tabs.
Still a blank page.</div>
      <div class="win" style="left:60px;top:520px;width:960px;height:620px" data-in=".1,.8,fade"><div class="tabs">${TABS.slice(0, 6).map((t, i) => `<span class="${i === 4 ? 'on' : ''}" data-in="${.3 + i * .08},.3,fade">${t}</span>`).join('')}</div>
        <div style="padding:60px 70px"><div style="font:400 44px 'Source Serif 4';color:#B4AB9C">Untitled</div><div style="margin-top:26px;width:3px;height:44px;background:#794B57" data-in="1.4,.1,fade"></div></div></div>
      ${note(0, 60, 1180, -4, 'data-in=".6,.6,up"')}${note(1, 420, 1230, 3, 'data-in=".8,.6,up"')}${note(2, 120, 1400, -2, 'data-in="1.0,.6,up"')}${note(3, 560, 1420, 5, 'data-in="1.2,.6,up"')}`,
    sfx: [[.6, 'tick'], [1.0, 'tick'], [2.2, 'ticks2']],
  },
  room: {
    name: 'room', src: 'placeholder', copy: 'Give the draft a place to start.', boards: [1.0, 5.2],
    note: 'Clean cut from desk to editor. The same four notes straighten and slide into the project sidebar ("The Quiet Hours · sample project"); the chapter opens with a waiting caret. PLACEHOLDER layout until SilentRoom sends a workspace recording; real control labels go here.',
    bg: 'light', len: 8, hero: 5.2,
    html: `<div class="hd" style="left:120px;top:80px;font-size:64px" data-in="1.8,.8,up">Give the draft a place to start.</div>
      <div class="win" style="left:120px;top:220px;width:1680px;height:800px" data-in="0,.6,fade">
        <div class="side"><div class="cap" style="position:static;margin-bottom:6px">Project</div><div style="font:600 30px 'Source Serif 4';margin-bottom:30px">The Quiet Hours</div>
          <div class="cap" style="position:static;font-size:15px">Notes</div></div>
        <div style="position:absolute;left:480px;top:70px;right:80px"><div class="cap" style="position:static">Chapter 3</div>
          <div style="font:400 56px 'Source Serif 4';margin:14px 0 30px">The Quiet Hours</div><div style="width:3px;height:50px;background:#794B57" data-in="3.4,.1,fade"></div></div></div>
      ${[0, 1, 2, 3].map(i => note(i, [140, 470, 300, 740][i], [560, 640, 830, 760][i], 0, `data-fly="${.6 + i * .15},${1.7 + i * .15},${148},${402 + i * 150},330,130"`)).join('')}
      ${PH(1380, 960)}`,
    htmlV: `<div class="hd" style="left:80px;top:250px;font-size:72px" data-in="1.8,.8,up">Give the draft
a place to start.</div>
      <div class="win" style="left:40px;top:470px;width:1000px;height:1180px" data-in="0,.6,fade">
        <div class="side" style="width:auto;right:0;bottom:auto;height:420px;border-right:0;border-bottom:1px solid #E3DACB"><div class="cap" style="position:static;margin-bottom:6px">Project</div><div style="font:600 30px 'Source Serif 4'">The Quiet Hours</div></div>
        <div style="position:absolute;left:60px;top:480px;right:60px"><div class="cap" style="position:static">Chapter 3</div>
          <div style="font:400 56px 'Source Serif 4';margin:14px 0 30px">The Quiet Hours</div><div style="width:3px;height:50px;background:#794B57" data-in="3.4,.1,fade"></div></div></div>
      ${[0, 1, 2, 3].map(i => `<div style="position:absolute;left:${[60, 420, 120, 560][i]}px;top:${[1180, 1230, 1400, 1420][i]}px;width:330px" data-fly="${.6 + i * .15},${1.7 + i * .15},${70 + (i % 2) * 480},${600 + Math.floor(i / 2) * 150},460,130"><div class="note" style="width:auto">` + `<small>${NOTES[i][0]}</small>${NOTES[i][1]}</div></div>`).join('')}
      ${PH(40, 1690)}`,
    sfx: [[0, 'whoosh_s'], [.6, 'swoop'], [1.8, 'tick']],
  },
  shape: {
    name: 'shape', src: 'placeholder', copy: 'Shape the draft in your own words.', boards: [3.2, 9.6],
    note: 'The writer types the first line. A suggestion appears as ghost text (burgundy italic, "Suggestion · Tab to accept"); accepted, it turns to ink. Then the writer strikes half of it and types their own clause: "I sat with the notes I had been avoiding all week." Held on that edit. Sample text; PLACEHOLDER until confirmed against the real AI-assisted workflow.',
    bg: 'light', len: 12, hero: 9.6,
    cam: [[0, 1, .5, .5], [4.6, 1, .5, .5], [6.4, 1.06, .64, .5], [12, 1.07, .64, .5]],
    camV: [[0, 1, .5, .5], [4.6, 1, .5, .5], [6.4, 1.03, .5, .55], [12, 1.04, .5, .55]],
    html: `<div class="hd" style="left:120px;top:80px;font-size:64px" data-in=".1,.8,up">Shape the draft in your own words.</div>
      <div class="win" style="left:120px;top:220px;width:1680px;height:800px">
        <div class="side"><div class="cap" style="position:static;margin-bottom:6px">Project</div><div style="font:600 30px 'Source Serif 4';margin-bottom:30px">The Quiet Hours</div>
          <div class="cap" style="position:static;font-size:15px;margin-bottom:12px">Notes</div>${NOTES.map(n => `<div class="note" style="width:auto;margin-bottom:20px;font-size:23px;padding:18px 20px"><small>${n[0]}</small>${n[1]}</div>`).join('')}</div>
        <div style="position:absolute;left:480px;top:70px;right:110px"><div class="cap" style="position:static">Chapter 3</div>
          <div style="font:400 56px 'Source Serif 4';margin:14px 0 30px">The Quiet Hours</div>
          <div class="ed"><span data-type=".5,1.8">${LINE1}</span><span class="ghost" data-in="2.3,.6,fade" data-color="3.8,.5,#B08E97,#272521">${SUG1}</span><span style="display:inline-grid;vertical-align:top" data-swap="6.0,.3"><span class="sa ghost" data-in="2.3,.6,fade" data-color="3.8,.5,#B08E97,#272521"><span data-strike="5.2,.6">${SUG2}</span></span><span class="sb"><span data-type="6.2,8.2" data-mark="8.6,.6">${MINE}</span></span></span></div></div></div>
      <div class="chip" style="left:600px;top:600px" data-in="2.6,.5,pop" data-out="3.8,.3">Suggestion · Tab to accept</div>
      <div class="chip" style="left:600px;top:600px;background:#272521;color:#F7F2E8" data-in="8.8,.5,pop">Edited by you</div>
      ${PH(1380, 960)}`,
    htmlV: `<div class="hd" style="left:80px;top:250px;font-size:72px" data-in=".1,.8,up">Shape the draft
in your own words.</div>
      <div class="win" style="left:40px;top:470px;width:1000px;height:1180px">
        <div style="position:absolute;left:60px;top:60px;right:60px"><div class="cap" style="position:static">Chapter 3</div>
          <div style="font:400 56px 'Source Serif 4';margin:14px 0 30px">The Quiet Hours</div>
          <div class="ed" style="font-size:42px"><span data-type=".5,1.8">${LINE1}</span><span class="ghost" data-in="2.3,.6,fade" data-color="3.8,.5,#B08E97,#272521">${SUG1}</span><span style="display:inline-grid;vertical-align:top" data-swap="6.0,.3"><span class="sa ghost" data-in="2.3,.6,fade" data-color="3.8,.5,#B08E97,#272521"><span data-strike="5.2,.6">${SUG2}</span></span><span class="sb"><span data-type="6.2,8.2" data-mark="8.6,.6">${MINE}</span></span></span></div></div></div>
      <div class="chip" style="left:100px;top:1060px" data-in="2.6,.5,pop" data-out="3.8,.3">Suggestion · Tab to accept</div>
      <div class="chip" style="left:100px;top:1060px;background:#272521;color:#F7F2E8" data-in="8.8,.5,pop">Edited by you</div>
      ${PH(40, 1690)}`,
    sfx: [[.5, 'type8'], [2.3, 'shimmer'], [3.8, 'tick'], [5.2, 'swoop'], [6.2, 'type10'], [8.8, 'pop']],
  },
  passage: {
    name: 'passage', src: 'illus', copy: '(the passage fills the frame)', boards: [3.4],
    note: 'The finished lines fill the frame on paper, revealed one line at a time and held long enough to read. The writer\'s own clause keeps its faint burgundy underline.',
    bg: 'accent', len: 4.5, hero: 3.4,
    html: `<div style="position:absolute;left:260px;top:300px;width:1400px;font:400 64px/1.45 'Source Serif 4';color:#272521">
      <div data-in=".2,.9,up">${LINE1}</div><div data-in=".9,.9,up">By six the street had gone quiet, and</div><div data-in="1.6,.9,up"><span style="background:rgba(121,75,87,.16);border-radius:4px;padding:0 6px">${MINE}</span></div></div>`,
    htmlV: `<div style="position:absolute;left:90px;top:600px;width:900px;font:400 64px/1.45 'Source Serif 4';color:#272521">
      <div data-in=".2,.9,up">${LINE1}</div><div data-in=".9,.9,up">By six the street had gone quiet, and</div><div data-in="1.6,.9,up"><span style="background:rgba(121,75,87,.16);border-radius:4px;padding:0 6px">${MINE}</span></div></div>`,
    sfx: [[.2, 'shimmer']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'SilentRoom. An AI workspace for writers.', boards: [2.0],
    note: 'The red brushstroke mark from silentroom.media, then the line set in Source Serif 4. (Confirm the product logo. The site only shows the "Silent Room Journal" wordmark.)',
    bg: 'accent', len: 2.5, hero: 2.0,
    html: `<div class="ctr" style="left:960px;top:380px" data-in=".1,.7,blur"><img src="assets/mark.png" style="height:150px;display:block"></div>
      <div class="hd ctr" style="left:960px;top:560px;font-size:84px" data-in=".4,.7,up">SilentRoom.</div>
      <div class="hd ctr" style="left:960px;top:665px;font-size:52px;font-style:italic;color:#794B57" data-in=".7,.7,up">An AI workspace for writers.</div>`,
    htmlV: `<div class="ctr" style="left:540px;top:760px" data-in=".1,.7,blur"><img src="assets/mark.png" style="height:140px;display:block"></div>
      <div class="hd ctr" style="left:540px;top:940px;font-size:96px" data-in=".4,.7,up">SilentRoom.</div>
      <div class="hd ctr" style="left:540px;top:1060px;font-size:56px;font-style:italic;color:#794B57" data-in=".7,.7,up">An AI workspace for writers.</div>`,
    sfx: [[.1, 'shimmer']],
  },
};
