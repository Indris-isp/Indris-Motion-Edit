/* Clocknext (clocknext.com): "Every run, priced." Brand: Inter + Petrona (their serif headings) on a navy night,
 * one hero colour = the concept's signal blue #6B9BFF (their site amber kept for the chart bars). */
window.BRIEF = {
  product: 'Clocknext', url: 'clocknext.com',
  brand: {
    colors: { accent: '#6B9BFF', accent2: '#9BBBFF', accent3: '#3D6FE0', highlight: '#F5B700', bg: '#F1F4F8', bg2: '#E8EDF4', surface: '#FFFFFF', ink: '#101827', muted: '#5D6779', dark: '#0B1220', line: '#DCE3EC', tint: '#EAF0FF', gradient: ['#1C2C55', '#3D6FE0'] },
    fonts: [{ family: 'Geist', src: 'fonts/Geist-600.ttf', weight: 600 }, { family: 'Geist', src: 'fonts/Geist-400.ttf', weight: 400 }, { family: 'IBM Plex Mono', src: 'fonts/IBMPlexMono-500.ttf', weight: 500 }],
    display: 'Geist', body: 'Geist', headWeight: 600, headTracking: '-.04em', radius: 14,
    buttons: { primary: { bg: '#6B9BFF', color: '#0B1220', radius: 8 }, secondary: { bg: 'transparent', color: 'inherit', border: '1.5px solid currentColor', radius: 8 }, weight: 600 },
    logo: 'assets/logo_t.png', logoOnDark: 'assets/logo_light.png',
  },
  launch: { pill: 'AI billing is complex. Let’s make it simple again →' },
  kit: {
    usage: { type: 'list', label: 'METERING · ACME INC.', items: [
      { title: 'run_4821 · support-agent', sub: '1 voice call · completed', icon: { kind: 'glyph', color: '#6B9BFF', text: '▸' }, tag: { text: '$0.11 cost', color: '#3D6FE0', bg: '#EAF0FF' } },
      { title: 'run_4822 · support-agent', sub: '1 voice call · completed', icon: { kind: 'glyph', color: '#9BBBFF', text: '▸' } },
      { title: 'run_4823 · research-agent', sub: '41k tokens', icon: { kind: 'glyph', color: '#F5B700', text: '▸' } } ] },
    plan: { type: 'list', label: 'VOICE CALL · COMPOSITE', items: [
      { title: 'Tokens', sub: 'Credits', icon: { kind: 'dot', color: '#5B4BE8' } }, { title: 'Resolution', sub: 'Outcome', icon: { kind: 'dot', color: '#2C7DA0' } },
      { title: 'Minutes', sub: 'Units', icon: { kind: 'dot', color: '#C2552D' } }, { title: 'One line item', sub: 'billed per call', icon: { kind: 'glyph', color: '#101827', text: '$' }, tag: { text: '$0.45 / call', color: '#3D6FE0', bg: '#EAF0FF' } } ] },
    margin: { type: 'stat', label: 'ACME INC. · GROSS MARGIN', value: '74.9%', delta: '+4.1pt', deltaColor: '#7FD39B', dark: true },
  },
  cta: { tagline: ['Pricing and billing ', 'for AI products.'], primary: 'Book a demo', secondary: 'Get started for free' },
};
