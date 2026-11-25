/* DocsAlot (docsalot.dev), support bot launch: "Every answer, with its source." Brand: Geist + IBM Plex Mono,
 * white and charcoal, one hero colour = the concept's soft violet #7763D9; their two-shape mark keeps its own colours. */
window.BRIEF = {
  product: 'DocsAlot', url: 'docsalot.dev',
  brand: {
    colors: { accent: '#7763D9', accent2: '#9C8DEA', accent3: '#5546B0', highlight: '#B9AEF5', bg: '#FFFFFF', bg2: '#F6F5FA', surface: '#FFFFFF', ink: '#202124', muted: '#6B6E76', dark: '#141318', line: '#E7E6EE', tint: '#F1EEFC' },
    fonts: [{ family: 'Geist', src: 'fonts/Geist-600.ttf', weight: 600 }, { family: 'Geist', src: 'fonts/Geist-400.ttf', weight: 400 }, { family: 'IBM Plex Mono', src: 'fonts/IBMPlexMono-500.ttf', weight: 500 }],
    display: 'Geist', body: 'Geist', headWeight: 600, headTracking: '-.04em', radius: 14,
    buttons: { primary: { bg: '#202124', color: '#fff', radius: 10 }, secondary: { bg: 'transparent', color: 'inherit', border: '1.5px solid currentColor', radius: 10 }, weight: 600 },
    logo: 'assets/logo.svg', invertOnDark: true,
    markSvg: '<svg viewBox="0 -1 60 66" width="100%" style="display:block"><defs><linearGradient id="dn" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#B9AEF5"/><stop offset="1" stop-color="#9C8DEA"/></linearGradient><linearGradient id="db" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c78ec"/><stop offset="1" stop-color="#1d61dc"/></linearGradient></defs><path fill="url(#dn)" d="M8 4h21c1.5 0 2.8.6 3.8 1.7l9.5 10.2c1.2 1.3.3 3.5-1.5 3.5H19a5 5 0 0 0-5 5v28a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a5 5 0 0 1 5-5Z"/><path fill="url(#db)" d="M23 20h19c1.3 0 2.5.5 3.4 1.5l10.1 10.4c.9.9 1.5 2.2 1.5 3.5v13.8c0 2.1-1.2 4.1-3.1 5L23 67.3c-3.3 1.5-7-.9-7-4.5V27a7 7 0 0 1 7-7Z" transform="translate(0 -5)"/></svg>',
  },
  launch: { pill: 'DocsAlot for customer support →' },
  kit: {
    thread: { type: 'chat', messages: [ { me: false, name: 'JR', text: '@docsalot How do I configure authentication?' },
      { me: true, text: 'Set a default once in layout.json: "auth": { "method": "bearer" }. Source ↗ document-apis/authentication' } ] },
    source: { type: 'list', label: 'SOURCE · DOCS.DOCSALOT.DEV', items: [
      { title: 'Authentication', sub: 'Document APIs', icon: { kind: 'glyph', color: '#7763D9', text: '↗' } },
      { title: 'Most projects should define a default auth method in layout.json.', icon: { kind: 'dot', color: '#7763D9' }, tag: { text: 'Cited', color: '#5546B0', bg: '#F1EEFC' } } ] },
    gap: { type: 'toast', title: 'Docs gap flagged', sub: '“Can we rotate API keys from the dashboard?”', icon: '⚑', color: '#C27A00' },
  },
  people: ['JR', 'MK', 'AS', 'TB', 'LC', 'DW'],
  cta: { tagline: ['Beautiful docs. ', 'Answers with a source.'], primary: 'Create your docs →', secondary: 'Visit customer docs ↗' },
};
