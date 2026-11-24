/* SilentRoom: "Quiet the noise."  Problem → Cause → Solution → (Proof: none public) → CTA (16:9). Light & warm. */
window.TIMELINE = {
  FPS: 30, BPM: 80, STYLE: 'airy', FORMAT: '16:9',
  shots: [
    /* PROBLEM: a blank page under a pile of tabs */
    ['kinetic', 2.6, 1.05, { big: '23 tabs.', label: 'AND STILL A BLANK PAGE', glow: 'acc' }],
    ['scribbles', 3.0, 1.1, { surface: 'sticky', caption: ['Notes everywhere.', 'Words nowhere.'],
      items: [{ t: 'kitchen at dusk?', x: .08, y: .12, size: 64, color: 'black' }, { t: '“we kept our own hours”', x: .08, y: .32, size: 60, color: 'black' },
              { t: 'cut bus scene', x: .1, y: .52, size: 64, color: 'black', strike: true }, { t: 'chapter 3 ??', x: .1, y: .72, size: 70, color: 'red', circle: true }] }],
    /* CAUSE: research, chat windows and the draft live in different places, and the voice gets lost */
    ['funnel', 3.0, 1.1, { headline: ['Every tool shouts.', 'Your voice gets lost.'], gate: 'DRAFT', count: 1200, pass: 8 }],
    /* SOLUTION */
    ['strokesLogo', 2.4, 1.05, { word: 'SilentRoom', colors: ['#794B57', '#C9302C', '#9A6E79', '#272521', '#C9A9A6'] }],
    ['inline', 2.8, 1.15, { before: 'Bring', component: 'notes', after: 'your', line2: 'notes in.' }],
    ['componentHero', 3.0, 1.15, { headline: ['Give the draft', 'a place to start.'], component: 'draft' }],
    ['redline', 3.2, 1.0, { before: 'a sense of', wrong: 'profound stillness', right: 'the notes I avoided', after: '', stamp: 'NOT YOUR VOICE', note: 'In your own words' }],
    ['splitWords', 2.4, 1.1, { left: 'Your', right: 'words.', component: 'suggest' }],
    /* CTA (no public proof numbers yet) */
    ['flood', 3.6, 1.05, { button: 'Start writing' }],
  ],
};
/* 30–40 s: stretch every beat by 1.17 (more seconds, same motion) */
TIMELINE.shots = TIMELINE.shots.map(r => [r[0], +(r[1] * 1.17).toFixed(2), +(r[2] / 1.17).toFixed(3), r[3]]);
