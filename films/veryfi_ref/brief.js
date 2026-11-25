/* Veryfi Thinking Mode: "A second look before it posts." Official system: NB International (+ DIN Pro for numbers),
 * navy #171C3A, one hero colour = Veryfi green #00D181 (mint #48FFD3 for highlights). Wordmark solid white on navy. */
window.BRIEF = {
  product: 'Veryfi', url: 'veryfi.com',
  brand: {
    colors: { accent: '#00D181', accent2: '#48FFD3', accent3: '#00A866', highlight: '#48FFD3', bg: '#F6F7FB', bg2: '#ECEFF7', surface: '#FFFFFF', ink: '#171C3A', muted: '#6B7090', dark: '#171C3A', line: '#E1E4EF', tint: '#E3FBF1', gradient: ['#171C3A', '#0869E1'] },
    fonts: [{ family: 'NB International', src: 'fonts/NBInternationalPro-Regular.woff2', weight: 400 }, { family: 'NB International', src: 'fonts/NBInternationalPro-Medium.woff2', weight: 500 },
            { family: 'DIN Pro', src: 'fonts/DINPro.woff2', weight: 400 }, { family: 'DIN Pro', src: 'fonts/DINPro-Medium.woff2', weight: 500 }],
    display: 'NB International', body: 'NB International', headWeight: 500, headTracking: '-.025em', radius: 14,
    buttons: { primary: { bg: '#00D181', color: '#171C3A', radius: 8 }, secondary: { bg: 'transparent', color: 'inherit', border: '1.5px solid currentColor', radius: 8 }, weight: 500 },
    logo: 'assets/wordmark_navy.svg', logoOnDark: 'assets/wordmark_white.svg',
  },
  launch: { pill: 'Introducing Thinking Mode →' },
  kit: {
    extract: { type: 'table', columns: ['Field', 'Value'], rows: [['vendor', 'Acme Supply Co.'], ['subtotal', '100.00'], ['tax', '8.00'], ['total', '180.00']], tagCol: null },
    agents: { type: 'list', label: '"thinking": "light"', items: [
      { title: 'Review', sub: 'subtotal + tax ≠ total', icon: { kind: 'glyph', color: '#00D181', text: '✓' } },
      { title: 'Correct', sub: 'total: 180.00 → 108.00', icon: { kind: 'glyph', color: '#00D181', text: '✓' } },
      { title: 'Recheck', sub: '100.00 + 8.00 = 108.00', icon: { kind: 'glyph', color: '#00D181', text: '✓' }, tag: { text: 'Matches', color: '#00A866', bg: '#E3FBF1' } } ] },
    param: { type: 'toggle', label: '"thinking": "light"', on: true },
    uptime: { type: 'stat', label: 'UPTIME SLA', value: '99.995%', delta: 'Bank-grade security', deltaColor: '#48FFD3', dark: true },
  },
  cta: { tagline: ['Introducing ', 'Veryfi Thinking Mode.'], primary: 'Get Started for Free', secondary: 'Book a Demo' },
};
