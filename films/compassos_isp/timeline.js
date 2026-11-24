/* Compass OS: "Only say what's true."  Problem → Cause → Solution → Proof → CTA (16:9). */
window.TIMELINE = {
  FPS: 30, BPM: 100, STYLE: 'airy', FORMAT: '16:9',
  shots: [
    /* PROBLEM: the perfect role, and a résumé that is almost right */
    ['kinetic', 2.4, 1.1, { big: '1:12', small: 'am', label: 'THE ROLE CLOSES FRIDAY', glow: 'hi' }],
    ['scribbles', 3.0, 1.1, { surface: 'paper', caption: ['Sounds great.', 'Is it true?'],
      items: [{ t: 'Led product org', x: .08, y: .12, size: 64, color: 'black' }, { t: 'Grew revenue 3x', x: .1, y: .34, size: 70, color: 'red', circle: true },
              { t: 'Best-in-class leader', x: .08, y: .56, size: 64, color: 'black', strike: true }, { t: 'synergy??', x: .52, y: .74, size: 58, color: 'red' }] }],
    /* CAUSE: generic AI writers invent numbers; recruiters and screens drop what they can't trust */
    ['funnel', 3.0, 1.1, { headline: ['AI-written claims.', 'Filtered out.'], gate: 'SCREEN', count: 1400, pass: 14 }],
    ['dial', 2.8, 1.15, { headline: ['Can you', 'back it up?'], value: 31, from: 100, unit: '%', label: 'CLAIMS YOU CAN PROVE', accent: true }],
    /* SOLUTION */
    ['turnInk', 2.2, 1.05],
    ['componentHero', 2.8, 1.25, { headline: ['See why', 'it fits.'], component: 'match' }],
    ['inline', 2.8, 1.2, { before: 'Tailor', component: 'resume', after: 'it.', line2: 'Keep it true.' }],
    ['redline', 3.2, 1.05, { before: '', wrong: 'Grew revenue 3x.', right: 'Shipped two launches.', after: '', stamp: 'NOT IN YOUR PROFILE', note: 'Traced to your profile' }],
    ['splitWords', 2.4, 1.15, { left: 'Grounded', right: 'claims.', component: 'pip' }],
    /* PROOF (their example) */
    ['statLine', 2.8, 1.15, { value: '92%', caption: 'strong fit, and it tells you', bold: 'why.', chip: 'VP Product, Payments' }],
    /* CTA */
    ['flood', 3.4, 1.1, { button: 'Create free account' }],
  ],
};
