/* SilentRoom in the reference style: muted burgundy on clean white, the brushstroke mark. Editor screens are placeholders. */
window.REF = { color: '#794B57', font: 'var(--font)', mark: '<img src="assets/mark.png" style="width:100%;display:block">', bigW: 340 };
(function () {
  const K = window.BRIEF.kit, R = window.RUI, M = window.REF.mark;
  K.screen1 = R.app({ name: 'SilentRoom', mark: M, nav: ['Projects', 'Notes', 'Drafts', 'Research', 'Settings'], active: 'Notes', eyebrow: 'The Quiet Hours', title: 'Project notes', chip: '4 notes',
    left: { title: 'Notes', html: R.rows([['The kitchen at dusk?', 'Note', 'pend'], ['“We kept our own hours.” · Mum, p.12', 'Quote', 'ok'], ['Cut the bus scene', 'Edit', 'pend']]) },
    right: { title: 'Sources', rows: [['Interview transcript', 'ok', 'Linked'], ['Dusk light refs', 'ok', 'Linked'], ['Ch.2 feedback', 'pend', 'Open']] } });
  K.screen2 = R.app({ name: 'SilentRoom', mark: M, nav: ['Projects', 'Notes', 'Drafts', 'Research', 'Settings'], active: 'Drafts', eyebrow: 'Chapter 3', title: 'The Quiet Hours', chip: 'Focus mode',
    left: { title: 'Draft', html: `<div style="font:400 18px/1.6 var(--font);color:#2E2B27">The house kept its own hours. By six the street had gone quiet, and <span style="background:rgba(var(--Argb),.14);box-shadow:inset 3px 0 0 var(--A);padding:2px 6px">I sat with the notes I had been avoiding all week.</span></div>` },
    right: { title: 'Edits', rows: [['Suggestion accepted', 'ok', 'Tab'], ['Rewritten in your words', 'ok', 'Yours'], ['Notes linked', 'ok', '4']] } });
  window.REFT = {
    line: 'Thinking with words.', pill: 'One Quiet Room',
    a: R.cardHead('The Quiet Hours', 'SilentRoom') + R.title('Chapter 3', 'Draft · sample text') + R.lines(3) + R.btn('Suggestion · Tab to accept', ''), done: 'Edited by you ✓',
    b: R.cardHead('Notes', '') + `<div style="margin-top:34px;font:italic 400 24px/1.4 var(--font)">“We kept our own hours.”</div><div style="margin-top:8px;font:300 19px var(--rf);opacity:.8">Mum · interview p.12</div>` + R.lines(2) + R.foot('Research beside the draft'),
    tilt: ['Every Note', 'In One Place'], orbit: 'Your Notes, Together', orbitItems: ['Notes', 'Interviews', 'Drafts', 'Outline', 'Research', 'Voice memos'],
    ring: 'In Your Own Words',
    object: R.paper({ serif: 1, head: 'Chapter 3', title: 'The Quiet Hours', lines: [['The house kept its own hours.'], ['By six the street had gone quiet, and'], ['I sat with the notes I had been avoiding all week.', 1]], foot: 'Sample text' }),
    objBox: { background: '#FBF8F1', padding: '38px', boxShadow: '0 60px 80px -30px rgba(0,0,0,.35),0 0 0 1px #E8E2D6', borderRadius: '4px' },
    cards: [['Suggestion', 'Accepted', 'Tab to accept', 'Kept'], ['Edit', 'Your words', 'rewritten by you', 'Yours'], ['Focus', 'Quiet', 'no tabs, no noise', 'On']],
    net: ['Write Without', 'Noise'], final: 'Your Writing Room', end: 'An AI workspace for writers.',
  };
})();
