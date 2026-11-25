/* Clocknext in the reference style: signal blue on clean white. Real copy and example figures from clocknext.com. */
window.REF = { color: '#3D6FE0', font: 'var(--font)', mark: '<svg viewBox="0 0 24 24" width="100%" style="display:block"><path d="M18.5 6.2A8.2 8.2 0 1 0 18.5 17.8" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>', bigW: 300 };
(function () {
  const K = window.BRIEF.kit, R = window.RUI, M = window.REF.mark;
  K.screen1 = R.app({ name: 'clocknext', mark: M, nav: ['Overview', 'Signals', 'Usage logs', 'Invoices', 'Pricing'], active: 'Usage logs', eyebrow: 'Metering', title: 'Acme Inc.', chip: '74.9% margin',
    stats: [['Revenue', '$84,250', '+18.2% on prior period'], ['Provider cost', '$21,180', '+9.1%'], ['Margin', '$63,070', '+21.4%']],
    left: { title: 'Revenue by month', note: 'Billed per month', html: R.bars([13.4, 15.2, 15.9, 18.1, 19.6, 21.0], ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']) },
    right: { title: 'Usage logs', rows: [['run_4821 · voice call', 'ok', '$0.45'], ['run_4822 · voice call', 'ok', '$0.45'], ['run_4823 · 41k tokens', 'pend', 'Metered']] } });
  K.screen2 = R.app({ name: 'clocknext', mark: M, nav: ['Overview', 'Signals', 'Usage logs', 'Invoices', 'Pricing'], active: 'Pricing', eyebrow: 'Create your pricing package', title: 'One plan, one invoice', chip: 'Live',
    stats: [['Credits', '$800.00', '100,000 at $0.008'], ['Outcomes', '$564.00', '47 at $12.00'], ['Units', '$348.00', '12 seats at $29.00'], ['Voice Agent', '$410.00', 'Composite']],
    left: { title: 'Invoices', html: R.rows([['INV-0006 · Acme Inc.', '$412.00', 'ok'], ['INV-0005 · Acme Inc.', '$320.00', 'ok'], ['INV-0004 · Dunder Mifflin', '$1,000.00', 'ok']]) },
    right: { title: 'Billing', rows: [['Prepaid', 'ok', 'On'], ['Postpaid', 'ok', 'On'], ['Top-ups', 'pend', 'Optional']] } });
  window.REFT = {
    line: 'AI billing is complex. Let’s make it simple again.', pill: 'One Invoice',
    a: R.cardHead('run_4821', 'clocknext') + R.title('Voice call · completed', 'Acme Inc. · support-agent') + R.lines(3) + R.btn('Provider cost: $0.11', ''), done: 'Charged to customer: $0.45 ✓',
    b: R.cardHead('Voice call', 'Composite') + `<div style="margin-top:40px;font:500 56px var(--rf);letter-spacing:-.03em">$0.45</div><div style="margin-top:6px;font:300 20px var(--rf);opacity:.8">per call · one line item</div>` + R.lines(2) + R.foot('Tokens · Resolution · Minutes'),
    tilt: ['Every Token', 'Metered'], orbit: 'Price Any Way', orbitItems: ['Credits', 'Outcomes', 'Units', 'Composites', 'Prepaid', 'Postpaid'],
    ring: 'See What You Keep',
    object: R.paper({ head: 'Invoice · Acme Inc.', title: 'Voice Agent · run_4821', lines: [['Customer charge · $0.45'], ['Provider cost · $0.11'], ['You keep · $0.34 (75.6%)', 1]], foot: 'Example figures' }),
    objBox: { background: '#fff', padding: '34px', boxShadow: '0 60px 80px -30px rgba(0,0,0,.35),0 0 0 1px #E8E8E3', borderRadius: '6px' },
    cards: [['Charge', '$0.45', 'per voice call', 'Billed'], ['Provider cost', '$0.11', 'metered', 'Tracked'], ['Margin', '74.9%', 'Acme Inc.', '+4.1pt']],
    net: ['Live in', 'Hours'], final: 'Pricing for AI Products', end: 'Free up to $100K USD in billed revenue.',
  };
})();
