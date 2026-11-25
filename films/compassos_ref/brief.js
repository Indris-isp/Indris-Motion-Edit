/* Compass OS (compass-os.dev): "Only say what's true."  Brand: DM Sans (concept) + Gabarito wordmark, forest #17302A,
 * one hero colour = their coral CTA #FF7A59, cream #F4EDE1 surfaces, Pip the mascot as the character. */
window.BRIEF = {
  product: 'Compass OS', url: 'compass-os.dev',
  brand: {
    colors: { accent: '#17302A', accent2: '#2E5A4E', accent3: '#0E1F1B', highlight: '#FF7A59', bg: '#F8F7F3', bg2: '#F4EDE1', surface: '#FFFFFF', ink: '#17302A', muted: '#6B6F68', dark: '#17302A', line: '#E6E1D6', tint: '#FFF0EA' },
    fonts: [{ family: 'DM Sans', src: 'fonts/DMSans-600.ttf', weight: 600 }, { family: 'DM Sans', src: 'fonts/DMSans-400.ttf', weight: 400 }, { family: 'Gabarito', src: 'fonts/Gabarito-700.ttf', weight: 700 }],
    display: 'DM Sans', body: 'DM Sans', headWeight: 600, headTracking: '-.035em', radius: 24,
    buttons: { primary: { bg: '#FF7A59', color: '#17302A', radius: 999 }, secondary: { bg: 'transparent', color: 'inherit', border: '1px solid currentColor', radius: 999 }, weight: 700 },
    logo: null, icon: 'assets/logo.svg',
  },
  launch: { pill: 'Your career, ready before you need it →' },
  kit: {
    match: { type: 'list', label: 'TOP MATCH TODAY', items: [
      { title: 'VP Product, Payments', sub: 'Stripe · Remote (US)', icon: { kind: 'glyph', color: '#5B4BE8', text: '▣' }, tag: { text: '92% strong fit', color: '#17302A', bg: '#DFF3E6' } },
      { title: 'Two payments launches + a marketplace P&L', sub: 'match their must-haves', icon: { kind: 'dot', color: '#FF7A59' } },
      { title: '$280k–$330k base', sub: 'Pay on your roles', icon: { kind: 'dot', color: '#17302A' } } ] },
    resume: { type: 'list', label: 'RESUME FOR STRIPE · VP PRODUCT, PAYMENTS', items: [
      { title: 'Led a 40-person product org', sub: 'checkout, risk, and payouts', icon: { kind: 'glyph', color: '#2E5A4E', text: '✓' } },
      { title: 'ML fraud model cut chargebacks 28%', sub: 'traced to your profile', icon: { kind: 'glyph', color: '#2E5A4E', text: '✓' } },
      { title: 'Grew payments revenue 3x', sub: 'not in your profile', icon: { kind: 'glyph', color: '#E5484D', text: '!' }, tag: { text: 'Check', color: '#B42318', bg: '#FDE8E6' } } ] },
    pip: { type: 'chat', messages: [ { me: true, text: 'Grew payments revenue 3x in two years.' },
      { me: false, name: 'PIP', text: '“3x” isn’t in your profile. Remove it, or add the fact first. I won’t make things up for you.' } ] },
    traced: { type: 'stat', label: 'LINES TRACED TO YOUR PROFILE', value: '3 of 3', delta: 'Grounded', deltaColor: '#7FD39B', dark: true },
  },
  people: ['SC', 'MR', 'JT', 'AK', 'LB', 'NW'],
  cta: { tagline: ['Your career, ', 'ready before you need it.'], primary: 'Create free account', secondary: 'Chrome extension' },
};
