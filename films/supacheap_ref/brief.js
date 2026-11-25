/* Supacheap.eu: "Take your name back." Brand: Inter (their 900/800 headings), deep navy night like their site,
 * one hero colour = the concept's trust teal #198575, the shield mark as the character. */
window.BRIEF = {
  product: 'Supacheap.eu', url: 'supacheap.eu',
  brand: {
    colors: { accent: '#198575', accent2: '#3FB39E', accent3: '#0F5E52', highlight: '#5EE6C8', bg: '#F5F7F8', bg2: '#ECF0F2', surface: '#FFFFFF', ink: '#202936', muted: '#5F6B7A', dark: '#0F1626', line: '#DDE3E8', tint: '#E4F3EF' },
    fonts: [{ family: 'IBM Plex Mono', src: 'fonts/IBMPlexMono-500.ttf', weight: 500 }],
    display: 'Inter', body: 'Inter', headWeight: 800, headTracking: '-.04em', radius: 12,
    buttons: { primary: { bg: '#198575', color: '#fff', radius: 10 }, secondary: { bg: 'transparent', color: 'inherit', border: '2px solid currentColor', radius: 10 }, weight: 700 },
    logo: null,
    markSvg: '<svg viewBox="0 0 24 24" width="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  },
  launch: { pill: 'Free test: top 5 brokers →' },
  kit: {
    form: { type: 'form', title: 'Free test run · top 5 data brokers', fields: ['alex.muster@example.com', 'Alex Muster', 'Musterstraße 12 · 10115 Berlin'], button: 'Request confirmation link' },
    request: { type: 'email', from: 'Supacheap.eu', subject: 'Erasure request · Art. 17 GDPR', dot: '#198575' },
    status: { type: 'list', label: 'YOUR DASHBOARD · NEXT REQUEST IN 29d 23:59', items: [
      { title: 'SCHUFA Holding AG', icon: { kind: 'dot', color: '#198575' }, tag: { text: 'Request sent', color: '#198575', bg: '#E4F3EF' } },
      { title: 'CRIF GmbH', icon: { kind: 'dot', color: '#198575' }, tag: { text: 'Request sent', color: '#198575', bg: '#E4F3EF' } },
      { title: 'Creditreform Boniversum', icon: { kind: 'dot', color: '#198575' }, tag: { text: 'Request sent', color: '#198575', bg: '#E4F3EF' } },
      { title: 'Removal confirmed', sub: 'only when a broker replies', icon: { kind: 'dot', color: '#A9B3BF' }, tag: { text: '0 of 5', color: '#5F6B7A', bg: '#ECF0F2' } } ] },
    sent: { type: 'stat', label: 'REQUESTS SENT', value: '5', delta: 'Art. 17 GDPR', deltaColor: '#5EE6C8', dark: true },
  },
  people: ['AM'],
  cta: { tagline: ['Deleting is ', 'that easy.'], primary: 'Try for free: top 5 brokers free', secondary: 'View plans' },
};
