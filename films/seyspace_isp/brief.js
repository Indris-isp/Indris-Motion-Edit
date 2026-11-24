/* SeySpace (seyspace.com): "Your whole studio, in one frame."
 * Brand: Plus Jakarta Sans 800 (tight), Inter body, black pill buttons, forest green #1B3B32 as the one hero colour
 * (with their sage #485949 and pale sage #E4EBD8), their two-square mark. UI is REBUILT from their product
 * screens (client portal invoice, secure download, cart, order confirmation, smart booking, contracts). */
window.BRIEF = {
  product: 'SeySpace', url: 'seyspace.com',
  brand: {
    colors: { accent: '#1B3B32', accent2: '#485949', accent3: '#0F241E', highlight: '#E4EBD8', bg: '#FFFFFF', bg2: '#F5F4EF', surface: '#FFFFFF',
              ink: '#111611', muted: '#7A7F78', dark: '#0C1613', onDark: '#FFFFFF', line: '#E8E6DF', tint: '#EEF2EC' },
    fonts: [{ family: 'Plus Jakarta Sans', src: 'fonts/PlusJakartaSans-700.ttf', weight: 700 }, { family: 'Plus Jakarta Sans', src: 'fonts/PlusJakartaSans-800.ttf', weight: 800 }],
    display: 'Plus Jakarta Sans', body: 'Inter', headWeight: 800, headTracking: '-.045em', radius: 20,
    buttons: { primary: { bg: '#1B1B1D', color: '#fff', radius: 999 }, secondary: { bg: 'transparent', color: 'inherit', border: '2px solid currentColor', radius: 999 }, weight: 700 },
    logo: 'assets/logo.png', logoOnDark: 'assets/logo-white.png',
    markSvg: '<svg viewBox="0 0 295 294" width="100%" style="display:block"><rect x="0" y="0" width="171" height="130" fill="currentColor"/><rect x="124" y="162" width="171" height="132" fill="currentColor"/></svg>',
  },
  launch: { pill: 'All-in-one photography business platform →' },
  hero: { eyebrow: 'Tools for the modern photographer', l1: 'Everything you need', l2: 'to run your studio.', screen: null, layers: [] },
  features: [], words: { items: [] }, split: {}, build: {},
  stat: { value: '0%', valueShort: '0%', caption: 'platform commission', bold: 'on paid plans.' },

  /* UI KIT: SeySpace components, rebuilt from their product screens (real labels and their own example figures) */
  kit: {
    booking: { type: 'list', label: 'SMART BOOKING · NEW SESSION', items: [
      { title: 'Wedding · The Elegance Collection', sub: 'Sat 27 Oct · 4:00 PM', icon: { kind: 'glyph', color: '#1B3B32', text: '◷' } },
      { title: 'Questionnaire', sub: 'Sent automatically', icon: { kind: 'glyph', color: '#485949', text: '✎' }, tag: { text: 'Done', color: '#1F6B3A', bg: '#E3F1E7' } },
      { title: 'Session fee', sub: '$1,800 · scheduled payment', icon: { kind: 'glyph', color: '#1B1B1D', text: '$' }, tag: { text: 'Scheduled' } } ] },
    invoice: { type: 'stat', label: 'INVOICE · CLIENT PORTAL', value: '$2,450', delta: 'Automated billing', deltaColor: '#1F6B3A' },
    contract: { type: 'editor', back: '← Contracts', actions: ['Preview', 'Send to sign'], cover: "url('assets/g3.jpg') center 30%/cover", title: 'Wedding contract', lines: 3, toggle: 'Request digital signature' },
    download: { type: 'list', label: 'DIGITAL DELIVERY · SECURE DOWNLOAD', items: [
      { title: 'High Resolution', sub: 'Original file (300 DPI)', icon: { kind: 'glyph', color: '#1B3B32', text: '✓' } },
      { title: 'Web Size', sub: 'Social ready (72 DPI)', icon: { kind: 'dot', color: '#C8B9A7' } } ] },
    order: { type: 'toast', title: 'Fine Art Print', sub: '8 × 10 · $45.00', icon: '✓', color: '#1B3B32' },
    cart: { type: 'stat', label: 'YOUR CART · TOTAL', value: '$295.00', delta: 'Paid', deltaColor: '#7FD39B', dark: true },
  },
  people: ['PS', 'AM', 'JR', 'KT', 'LB', 'NW'],
  cta: { tagline: ['Everything you need ', 'to run your studio.'], primary: 'Get Started →', secondary: 'Join Studio' },
};
