/* Veryfi Thinking Mode in the reference style: navy on clean white (the approved system has no black), green chips. */
window.REF = { color: '#171C3A', font: 'var(--font)', mark: '<svg viewBox="0 0 40 40" width="100%" style="display:block"><rect width="40" height="40" rx="10" fill="#171C3A"/><path d="M11 13l9 15 9-15" fill="none" stroke="#00D181" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>', markBig: '<img src="assets/wordmark_navy.svg" style="width:100%;display:block">', bigW: 560, noWord: true, endLogo: '<img src="assets/wordmark_navy.svg" style="width:100%;display:block">', endW: 420, netText: 'v' };
(function () {
  const K = window.BRIEF.kit, R = window.RUI, M = '<img src="assets/wordmark_navy.svg" style="width:100%;display:block;margin-top:6px">';
  K.screen1 = R.app({ name: '', mark: M, nav: ['Documents', 'Receipts', 'Invoices', 'Bank statements', 'API keys'], active: 'Invoices', eyebrow: 'Document · invoice-4471.pdf', title: 'Acme Supply Co.', chip: 'Extracted',
    stats: [['Subtotal', '100.00', 'extracted'], ['Tax', '8.00', 'extracted'], ['Total', '180.00', 'needs review']],
    left: { title: 'Line items', html: R.rows([['Thermal paper · 2 × $30.00', '$60.00', 'ok'], ['Labels 4×6 · 4 × $10.00', '$40.00', 'ok'], ['Total on the invoice', '$108.00', 'warn']]) },
    right: { title: 'Request', rows: [['POST /v8/partner/documents', 'ok', '200'], ['"thinking"', 'pend', 'off'], ['Mode', 'pend', 'Real-time']] } });
  K.screen2 = R.app({ name: '', mark: M, nav: ['Documents', 'Receipts', 'Invoices', 'Bank statements', 'API keys'], active: 'Invoices', eyebrow: '"thinking": "light"', title: 'Total: 108.00', chip: 'Matches',
    stats: [['Subtotal', '100.00', 'checked'], ['Tax', '8.00', 'checked'], ['Total', '108.00', 'corrected']],
    left: { title: 'Agents', html: R.rows([['Review · subtotal + tax ≠ total', 'Done', 'ok'], ['Correct · 180.00 → 108.00', 'Done', 'ok'], ['Recheck · 100.00 + 8.00 = 108.00', 'Done', 'ok']]) },
    right: { title: 'Platform', rows: [['Uptime SLA', 'ok', '99.995%'], ['SOC 2 Type II', 'ok', 'Yes'], ['HIPAA · BAA', 'ok', 'Yes']] } });
  window.REFT = {
    line: 'Extract data from documents. Catch fraud. One API.', pill: 'Thinking Mode',
    a: R.cardHead('invoice-4471.pdf', '') + R.title('Acme Supply Co.', 'Sample invoice · Total $108.00') + R.lines(3) + R.btn('Extracted total: 180.00', ''), done: 'Corrected total: 108.00 ✓',
    b: R.cardHead('Request', '') + `<pre style="margin:30px 0 0;font:500 19px/1.6 'IBM Plex Mono',monospace;color:#171C3A;white-space:pre">{\n  "file_url": "…/invoice-4471.pdf",\n  <b style="color:#00A866">"thinking": "light"</b>\n}</pre>` + R.foot('One parameter'),
    tilt: ['Every', 'Document'], orbit: 'One API', orbitItems: ['Receipts', 'Invoices', 'Bank Statements', 'Checks', 'W-2s', 'Insurance Cards'],
    ring: 'A Second Look',
    object: R.paper({ head: 'Sample invoice #4471', title: 'Acme Supply Co.', lines: [['Thermal paper · 2 × $30.00 · $60.00'], ['Labels 4×6 · 4 × $10.00 · $40.00'], ['Subtotal $100.00 · Tax 8% $8.00'], ['Total $108.00', 1]], foot: 'Thinking Mode: matches' }),
    objBox: { background: '#fff', padding: '34px', boxShadow: '0 60px 80px -30px rgba(0,0,0,.35),0 0 0 1px #E8E8E3', borderRadius: '6px' },
    cards: [['Review', 'Mismatch found', 'subtotal + tax ≠ total', 'Caught'], ['Correct', '180.00 → 108.00', 'total', 'Fixed'], ['Recheck', '108.00', '100.00 + 8.00', 'Matches']],
    net: ['99.995%', 'Uptime'], final: 'Introducing Thinking Mode', end: 'Introducing Veryfi Thinking Mode.',
  };
})();
