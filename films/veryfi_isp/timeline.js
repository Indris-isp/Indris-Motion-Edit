/* Veryfi Thinking Mode: "A second look before it posts."  Problem → Cause → Solution → Proof → CTA (16:9). */
window.TIMELINE = {
  FPS: 30, BPM: 100, STYLE: 'midnight', FORMAT: '16:9',
  shots: [
    /* PROBLEM: the invoice says $108.00; the extraction says $180.00 */
    ['kinetic', 2.4, 1.1, { big: '$180.00', label: 'EXTRACTED TOTAL · SAMPLE INVOICE', glow: 'hi' }],
    ['scribbles', 3.0, 1.1, { surface: 'paper', caption: ['The invoice says', '$108.00'],
      items: [{ t: 'Acme Supply Co. #4471', x: .08, y: .1, size: 56, color: 'black' }, { t: 'Subtotal  $100.00', x: .08, y: .32, size: 62, color: 'black' },
              { t: 'Tax 8%  $8.00', x: .08, y: .5, size: 62, color: 'black' }, { t: 'Total  $108.00', x: .08, y: .7, size: 72, color: 'red', circle: true }] }],
    /* CAUSE: it posts straight to the ERP with no human review (from the Thinking Mode docs) */
    ['funnel', 3.0, 1.1, { headline: ['Straight to the ERP.', 'No human review.'], gate: 'ERP', count: 1400, pass: 30 }],
    /* SOLUTION */
    ['turnInk', 2.2, 1.05],
    ['inline', 2.8, 1.2, { before: 'Add', component: 'param', after: 'one', line2: 'parameter.' }],
    ['componentHero', 3.0, 1.2, { headline: ['Review. Correct.', 'Recheck.'], component: 'agents' }],
    ['monitorWords', 2.6, 1.15, { component: 'extract', items: ['Receipts', 'Invoices', 'light · deep'] }],
    ['redline', 3.0, 1.05, { before: 'Total', wrong: '$180.00', right: '$108.00', after: '', stamp: 'MISMATCH', note: 'Caught before it posts' }],
    /* PROOF: their own numbers */
    ['statLine', 2.8, 1.15, { value: '99.995%', caption: 'uptime SLA,', bold: 'bank-grade security.', chip: 'SOC 2 Type II' }],
    /* CTA */
    ['flood', 3.4, 1.1, { button: 'Get Started for Free' }],
  ],
};
/* 30–40 s: stretch every beat by 1.08 (more seconds, same motion) */
TIMELINE.shots = TIMELINE.shots.map(r => [r[0], +(r[1] * 1.08).toFixed(2), +(r[2] / 1.08).toFixed(3), r[3]]);
