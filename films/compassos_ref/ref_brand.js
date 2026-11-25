/* Compass OS in the reference style: coral world-accent on clean white, Pip as the mark. Real copy from compass-os.dev. */
window.REF = { color: '#E8613F', font: 'var(--font)', mark: '<img src="assets/logo.svg" style="width:100%;display:block">', markBig: '<img src="assets/logo.svg" style="width:100%;display:block">', bigW: 300 };
(function () {
  const K = window.BRIEF.kit, R = window.RUI, M = window.REF.mark;
  K.screen1 = R.app({ name: 'Compass OS', mark: M, nav: ['Career', 'Practice', 'Find', 'Move', 'Tailor', 'Apply'], active: 'Find', eyebrow: 'Top match today', title: 'VP Product, Payments', chip: '92% strong fit',
    stats: [['Company', 'Stripe', 'Remote (US)'], ['Base', '$280k–$330k', 'Pay on your roles'], ['Fit', '92%', 'Strong fit']],
    left: { title: 'Why it fits', html: R.rows([['Two payments launches', 'Match', 'ok'], ['A marketplace P&L', 'Match', 'ok'], ['Compliance experience', 'Listed', 'ok']]) },
    right: { title: 'Other roles', rows: [['Head of Product · Oscar Health', 'ok', '87%'], ['VP Product Mgmt · Vercel', 'ok', '83%'], ['Director of Product, AI', 'pend', 'New']] } });
  K.screen2 = R.app({ name: 'Compass OS', mark: M, nav: ['Career', 'Practice', 'Find', 'Move', 'Tailor', 'Apply'], active: 'Tailor', eyebrow: 'Resume for Stripe', title: 'VP Product, Payments', chip: '3 of 3 traced',
    left: { title: 'Tailored bullets', html: R.rows([['Led a 40-person product org', 'Traced', 'ok'], ['ML fraud model cut chargebacks 28%', 'Traced', 'ok'], ['Shipped two payments launches', 'Traced', 'ok']]) },
    right: { title: 'Pip checked', rows: [['“3x” removed', 'warn', 'Not in profile'], ['Claims grounded', 'ok', 'Done'], ['Ready to apply', 'ok', 'Ready']] } });
  window.REFT = {
    line: 'Your career, ready before you need it.', pill: 'One Profile',
    a: R.cardHead('Top match today', 'Compass OS') + R.title('VP Product, Payments', 'Stripe · Remote (US)') + R.lines(3) + R.btn('See why it fits', '92%'), done: 'Strong fit ✓',
    b: R.cardHead('Resume', '') + `<div style="margin-top:34px;font:500 22px var(--rf)">Grew payments revenue 3x</div><div style="margin-top:10px;font:300 19px var(--rf);color:#B42318">“3x” isn’t in your profile.</div>` + R.lines(2) + R.foot('Pip · I won’t make things up for you.'),
    tilt: ['See Why', 'It Fits'], orbit: 'Everything Ready', orbitItems: ['Career', 'Practice', 'Find', 'Move', 'Tailor', 'Apply'],
    ring: 'Only What’s True',
    object: R.paper({ head: 'Resume for Stripe', title: 'VP Product, Payments', lines: [['Led a 40-person product org across checkout, risk, and payouts.'], ['Launched an ML fraud model that cut chargebacks 28%.'], ['Shipped two payments launches and ran a marketplace P&L.', 1]], foot: '3 of 3 lines traced to your profile' }),
    objBox: { background: '#fff', padding: '34px', boxShadow: '0 60px 80px -30px rgba(0,0,0,.35),0 0 0 1px #E8E8E3', borderRadius: '6px' },
    cards: [['Pip check', '“3x” removed', 'Not in your profile', 'Fixed'], ['Bullet', 'Two launches', 'Traced to profile', 'True'], ['Application', 'Stripe', 'VP Product, Payments', 'Ready']],
    net: ['Roles Worth', 'a Look'], final: 'Ready When You Are', end: 'Your career, ready before you need it.',
  };
})();
