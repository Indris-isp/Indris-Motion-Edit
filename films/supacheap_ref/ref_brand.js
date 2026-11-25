/* Supacheap.eu in the reference style: trust teal on clean white, the shield as the mark. Real copy from supacheap.eu. */
window.REF = { color: '#198575', font: 'var(--font)', mark: '<svg viewBox="0 0 24 24" width="100%" style="display:block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', bigW: 300 };
(function () {
  const K = window.BRIEF.kit, R = window.RUI, M = window.REF.mark;
  K.screen1 = R.app({ name: 'Supacheap.eu', mark: M, nav: ['Dashboard', 'Brokers', 'Requests', 'Monitoring', 'Settings'], active: 'Brokers', eyebrow: 'Data broker catalogue', title: '544 data brokers', chip: 'GDPR Art. 17',
    stats: [['Free test', '5', 'top data brokers'], ['In the plans', '539', 'more brokers'], ['Processes', '100%', 'GDPR-compliant']],
    left: { title: 'Included in the free test', html: R.rows([['SCHUFA Holding AG', 'Included', 'ok'], ['CRIF GmbH', 'Included', 'ok'], ['Creditreform Boniversum', 'Included', 'ok'], ['infoscore (Experian)', 'Included', 'ok']]) },
    right: { title: 'Hosted in Germany', rows: [['SSL/TLS encryption', 'ok', 'On'], ['2FA & passkeys', 'ok', 'On'], ['Privacy audits', 'ok', 'Auto']] } });
  K.screen2 = R.app({ name: 'Supacheap.eu', mark: M, nav: ['Dashboard', 'Brokers', 'Requests', 'Monitoring', 'Settings'], active: 'Requests', eyebrow: 'Your dashboard', title: 'Next request in 29d 23:59', chip: 'Illustrative dashboard',
    left: { title: 'Erasure requests', html: R.rows([['SCHUFA Holding AG', 'Request sent', 'ok'], ['CRIF GmbH', 'Request sent', 'ok'], ['Creditreform Boniversum', 'Request sent', 'ok'], ['infoscore (Experian)', 'Request sent', 'ok']]) },
    right: { title: 'Status', rows: [['Requests sent', 'ok', '5'], ['Removal confirmed', 'pend', '0 of 5'], ['Countdown', 'pend', 'Live']] } });
  window.REFT = {
    line: 'The most affordable way to delete data from the internet.', pill: 'Free Test',
    a: R.cardHead('Free test run', 'Supacheap.eu') + R.title('Alex Muster (example)', 'Musterstraße 12 · 10115 Berlin') + R.lines(3) + R.btn('Request confirmation link', '5 brokers'), done: 'Link sent ✓',
    b: R.cardHead('Brokers', '') + `<div style="margin-top:40px;font:500 72px var(--rf);letter-spacing:-.03em">544</div><div style="margin-top:4px;font:300 20px var(--rf);opacity:.8">data brokers in check</div>` + R.lines(2) + R.foot('Dummy data shown'),
    tilt: ['Every', 'Broker'], orbit: 'Requests Sent', orbitItems: ['SCHUFA', 'CRIF', 'Boniversum', 'infoscore', 'Creditreform', '+539 more'],
    ring: 'Delete Your Data',
    object: R.paper({ head: 'Art. 17 GDPR', title: 'Erasure request', lines: [['To: SCHUFA Holding AG'], ['On behalf of: Alex Muster'], ['Please erase all personal data you hold about me.', 1]], foot: 'Sent by Supacheap.eu' }),
    objBox: { background: '#fff', padding: '34px', boxShadow: '0 60px 80px -30px rgba(0,0,0,.35),0 0 0 1px #E8E8E3', borderRadius: '6px' },
    cards: [['SCHUFA', 'Request sent', 'Art. 17 GDPR', 'Sent'], ['CRIF GmbH', 'Request sent', 'Art. 17 GDPR', 'Sent'], ['Next request', '29d 23:59', 'live countdown', 'Track']],
    net: ['Take Back', 'Your Name'], final: 'Track Every Request', end: 'Deleting is that easy.',
  };
})();
