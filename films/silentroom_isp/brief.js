/* SilentRoom: "Quiet the noise." Brand: Source Serif 4 (their Fraunces-style serif voice) on paper, ink,
 * one hero colour = muted burgundy #794B57; their red brushstroke mark is the character. */
window.BRIEF = {
  product: 'SilentRoom', url: 'silentroom.media',
  brand: {
    colors: { accent: '#794B57', accent2: '#9A6E79', accent3: '#5A3540', highlight: '#C9302C', bg: '#F7F2E8', bg2: '#EFE8DA', surface: '#FBF8F1', ink: '#272521', muted: '#7C756A', dark: '#1E1B18', line: '#E3DACB', tint: '#F3E9EC' },
    fonts: [{ family: 'Source Serif 4', src: 'fonts/SourceSerif4-400.ttf', weight: 400 }, { family: 'Source Serif 4', src: 'fonts/SourceSerif4-600.ttf', weight: 600 }],
    display: 'Source Serif 4', body: 'Inter', headWeight: 400, headTracking: '-.02em', radius: 10,
    buttons: { primary: { bg: '#272521', color: '#F7F2E8', radius: 6 }, secondary: { bg: 'transparent', color: 'inherit', border: '1px solid currentColor', radius: 6 }, weight: 500 },
    logo: null, icon: 'assets/mark.png',
  },
  launch: { pill: 'An AI workspace for writers →' },
  kit: {
    draft: { type: 'editor', back: '← The Quiet Hours', actions: ['Notes', 'Focus'], cover: 'linear-gradient(135deg,#EFE3D3,#C9A9A6)', title: 'Chapter 3 · The house kept its own hours.', lines: 4, toggle: 'Focus mode' },
    suggest: { type: 'list', label: 'SUGGESTION · TAB TO ACCEPT', items: [
      { title: 'By six the street had gone quiet, and', icon: { kind: 'dot', color: '#794B57' } },
      { title: 'I sat with the notes I had been avoiding all week.', sub: 'edited by you', icon: { kind: 'glyph', color: '#272521', text: '✎' }, tag: { text: 'Yours', color: '#794B57', bg: '#F3E9EC' } } ] },
    notes: { type: 'list', label: 'PROJECT NOTES', items: [
      { title: 'The kitchen at dusk?', icon: { kind: 'dot', color: '#C9A9A6' } }, { title: '“We kept our own hours.”', sub: 'Mum, interview p.12', icon: { kind: 'dot', color: '#C9A9A6' } }, { title: 'Cut the bus scene', icon: { kind: 'dot', color: '#C9A9A6' } } ] },
  },
  cta: { tagline: ['An AI workspace ', 'for writers.'], primary: 'Start writing', secondary: 'Read the journal' },
};
