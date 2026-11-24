/* Clocknext: "Every run, priced."  Problem → Cause → Solution → Proof → CTA (16:9). Dark & glowing throughout, light for the plan. */
window.TIMELINE = {
  FPS: 30, BPM: 112, STYLE: 'midnight', FORMAT: '16:9',
  shots: [
    /* PROBLEM: the agent ran; nobody knows what it earned */
    ['kinetic', 2.4, 1.1, { big: '$0.11', label: 'ONE AGENT RUN · PROVIDER COST', glow: 'acc' }],
    ['crowd', 3.0, 1.05, { count: 40, names: 'R1 R2 R3 R4 R5 R6 R7 R8'.split(' '), questions: ['run_4821 · $0.11', 'run_4822 · $0.09', '41k tokens', 'run_4823 · $0.38', 'voice call · 4 min', 'run_4824 · ?'], center: ['Your AI ran.', 'Did it make money?'] }],
    /* CAUSE: counting is easy; billing is not (their own line) */
    ['funnel', 3.2, 1.05, { headline: ['Every token is easy to count.', 'Turning it into revenue isn’t.'], gate: 'BILLING', count: 1600, pass: 18 }],
    ['scribbles', 2.8, 1.15, { surface: 'paper', caption: ['Billing by', 'spreadsheet.'],
      items: [{ t: 'usage_export.csv', x: .08, y: .12, size: 60, color: 'black' }, { t: '× $0.45 ?', x: .12, y: .34, size: 70, color: 'red', circle: true },
              { t: 'margin = ???', x: .08, y: .56, size: 66, color: 'black' }, { t: 'invoice v4', x: .5, y: .76, size: 58, color: 'black', strike: true }] }],
    /* SOLUTION */
    ['turnInk', 2.2, 1.05],
    ['inline', 2.8, 1.2, { before: 'Meter', component: 'usage', after: 'every', line2: 'agent run.' }],
    ['componentHero', 2.8, 1.25, { headline: ['Price it', 'as one line.'], component: 'plan' }],
    ['chartSet', 3.0, 1.15, { headline: ['See what', 'you keep.'], pill: 'run_4821 · EXAMPLE', bars: [{ value: '$0.45', label: 'CHARGE' }, { value: '$0.11', label: 'PROVIDER COST', color: 'linear-gradient(180deg,#F5B700,#C98F00)' }],
      slider: { label: 'Price per call', value: .62, display: '$0.45' } }],
    ['splitWords', 2.4, 1.15, { left: 'Prepaid.', right: 'Postpaid.', component: 'margin' }],
    /* PROOF: their offer */
    ['statLine', 2.8, 1.15, { value: '$100K', caption: 'in billed revenue,', bold: 'free to start.', chip: 'Live in hours' }],
    /* CTA */
    ['flood', 3.4, 1.1, { button: 'Book a demo' }],
  ],
};
