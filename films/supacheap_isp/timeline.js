/* Supacheap.eu: "Take your name back."  Problem → Cause → Solution → Proof → CTA (16:9). */
window.TIMELINE = {
  FPS: 30, BPM: 104, STYLE: 'midnight', FORMAT: '16:9',
  shots: [
    /* PROBLEM: your name, address and birthday are on lists you never signed up for */
    ['crowd', 3.0, 1.05, { count: 40, names: 'SC CR CB IS VV EX AC DM LI PI RB QX'.split(' '),
      questions: ['Alex Muster', 'Musterstraße 12', '10115 Berlin', 'born 1988', 'credit score', 'alex.muster@…'], center: ['Who has', 'your personal data?'] }],
    ['kinetic', 2.4, 1.1, { big: '544', label: 'DATA BROKERS IN OUR CATALOGUE', glow: 'hi' }],
    /* CAUSE: each broker needs its own legal request, and nobody writes 544 letters */
    ['scribbles', 3.0, 1.1, { surface: 'paper', caption: ['One letter', 'per broker.'],
      items: [{ t: 'Art. 17 request #1 ✓', x: .08, y: .12, size: 60, color: 'black', strike: true }, { t: 'Art. 17 request #2', x: .08, y: .32, size: 60, color: 'black' },
              { t: 'Art. 17 request #3 ?', x: .08, y: .52, size: 60, color: 'red', circle: true }, { t: '… #544', x: .5, y: .74, size: 70, color: 'black' }] }],
    /* SOLUTION */
    ['strokesLogo', 2.4, 1.05, { word: 'Supacheap.eu' }],
    ['componentHero', 2.8, 1.2, { headline: ['Start with', 'five brokers.'], component: 'form' }],
    ['fan', 2.8, 1.2, { headline: ['Requests sent', 'for you.'], card: 'request', count: 5, subjects: ['SCHUFA Holding AG', 'CRIF GmbH', 'Creditreform Boniversum', 'infoscore (Experian)', 'Verband der Vereine Creditreform'], stat: 'sent' }],
    ['inline', 2.8, 1.2, { before: 'Track', component: 'status', after: 'the', line2: 'next step.' }],
    ['monitorWords', 2.6, 1.15, { component: 'status', items: ['Find', 'Request', 'Track'] }],
    /* PROOF: their own numbers */
    ['dotNumber', 2.8, 1.15, { value: '100%', caption: ['GDPR-compliant', 'processes'] }],
    /* CTA */
    ['flood', 3.4, 1.1, { button: 'Try for free: top 5 brokers free' }],
  ],
};
/* 30–40 s: stretch every beat by 1.08 (more seconds, same motion) */
TIMELINE.shots = TIMELINE.shots.map(r => [r[0], +(r[1] * 1.08).toFixed(2), +(r[2] / 1.08).toFixed(3), r[3]]);
