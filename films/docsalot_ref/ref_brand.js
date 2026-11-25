/* DocsAlot in the reference style: soft violet on clean white, their two-shape mark. Real copy from docsalot.dev / docs. */
window.REF = { color: '#6A55D6', font: 'var(--font)', mark: '<img src="assets/mark.svg" style="width:100%;display:block">', bigW: 300 };
(function () {
  const K = window.BRIEF.kit, R = window.RUI, M = window.REF.mark;
  K.screen1 = R.app({ name: 'DocsAlot', mark: M, nav: ['Home', 'API Reference', 'Analytics', 'Integrations', 'Settings'], active: 'Home', eyebrow: 'Document APIs', title: 'Authentication', chip: 'Cited',
    left: { title: 'Configure auth globally', html: `<div style="font:500 15px/1.5 Inter;color:#2E322E"><span style="background:rgba(var(--Argb),.14);box-shadow:inset 3px 0 0 var(--A);padding:3px 8px;border-radius:4px">Most projects should define a default auth method in layout.json.</span></div><pre style="margin:14px 0 0;background:#14131A;color:#E6E3F5;border-radius:12px;padding:16px;font:500 14px/1.5 'IBM Plex Mono',monospace">{ "api": { "auth": { "method": "bearer" } } }</pre>` },
    right: { title: 'On this page', rows: [['Configure auth globally', 'ok', 'Cited'], ['Override auth per page', 'pend', 'Docs'], ['Supported methods', 'pend', 'Docs']] } });
  K.screen2 = R.app({ name: 'DocsAlot', mark: M, nav: ['Home', 'API Reference', 'Analytics', 'Integrations', 'Settings'], active: 'Integrations', eyebrow: 'Integrations', title: 'Support bots', chip: 'Live',
    left: { title: '#support', html: R.rows([['@docsalot How do I configure authentication?', 'Answered', 'ok'], ['Answer cites document-apis/authentication', 'Source', 'ok'], ['Can we rotate API keys from the dashboard?', 'Docs gap', 'warn']]) },
    right: { title: 'Channels', rows: [['Slack bot', 'ok', 'Installed'], ['Discord bot', 'ok', 'Installed'], ['Knowledge base', 'ok', 'Synced']] } });
  window.REFT = {
    line: 'Beautiful docs. Fast pages. Clean context for agents.', pill: 'Ask DocsAlot',
    a: R.cardHead('#support', 'DocsAlot') + R.title('@docsalot', 'How do I configure authentication?') + R.lines(3) + R.btn('Ask', 'Slack'), done: 'Answered ✓',
    b: R.cardHead('Answer', '') + `<div style="margin-top:34px;font:400 22px/1.4 var(--rf)">Set a default once in layout.json.</div><div style="margin-top:16px;font:500 18px 'IBM Plex Mono',monospace;color:var(--A)">↗ document-apis/authentication</div>` + R.lines(1) + R.foot('With a source'),
    tilt: ['Every Answer', 'Cited'], orbit: 'Everywhere You Ask', orbitItems: ['Slack', 'Discord', 'Docs', 'Search', 'API Reference', 'Agents'],
    ring: 'With a Source',
    object: R.paper({ head: 'docs.docsalot.dev', title: 'Authentication', lines: [['Every interactive API page needs an authentication strategy.'], ['Most projects should define a default auth method in layout.json.', 1], ['Override it on an individual page.']], foot: 'Cited in the answer' }),
    objBox: { background: '#fff', padding: '34px', boxShadow: '0 60px 80px -30px rgba(0,0,0,.35),0 0 0 1px #E8E8E3', borderRadius: '6px' },
    cards: [['Question', 'Configure auth?', '#support · Slack', 'Asked'], ['Answer', 'layout.json', 'bearer method', 'Cited'], ['Docs gap', 'Rotate API keys?', 'not documented', 'Flagged']],
    net: ['Docs Gaps', 'Found'], final: 'Docs That Answer', end: 'DocsAlot for customer support.',
  };
})();
