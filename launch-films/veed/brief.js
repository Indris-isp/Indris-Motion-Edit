/* VEED: independent concept by ISP Agency (not affiliated with or approved by VEED).
 * No company-authored brand guide was found: the accent #7B61FF is a PLACEHOLDER to replace with the official kit.
 * No VEED logo is used. All numbers are illustrative sample data. */
window.BRIEF = {
  product: 'VEED',
  url: 'veed.io',
  brand: { accent: '#7B61FF', logo: null },
  people: ['SK', 'TM', 'RB', 'AL', 'JN', 'EV'],
  channels: [['▭', '#7B61FF', '16:9'], ['▯', '#FF6A3D', '9:16'], ['□', '#19B36B', '1:1']],

  hook: { from: '4:58', to: '4:59', suffix: 'pm', notifMeta: 'Marketing lead · 4:59', notif: 'can we get 5 cuts of this by tomorrow?' },
  chaos: {
    l1: 'One video,', l2: 'five formats.',
    sources: [['▶', '#FF3B30'], ['✂', '#7B61FF'], ['T', '#2386D6'], ['♪', '#19B36B']],
    messages: ['needs captions', 'make it 9:16', 'add the logo', 'shorter for social?', 'translate to Spanish', 'export failed', 'wrong font', 'where’s the raw file?'],
  },
  pain: { value: 14, unit: 'versions', pill: 'due tomorrow', complaints: ['captions?', 'too long', 'logo?', 'v3 or v4?', 'ETA?', 'resize?'] },

  /* SOLUTION 1: from idea to video, in the browser */
  dive: { l1: 'Idea in.', l2: 'Video out.', screenshot: null },
  /* SOLUTION 2: brand kit keeps every cut on brand */
  morph: { l1: 'On brand.', l2: 'Every cut.', title: 'Brand kit · Spring campaign', panelTitle: 'Brand kit',
    meta: [['Font', 'Your brand font'], ['Colours', '3 saved'], ['Logo', 'Auto-placed']], button: 'Apply', done: 'Applied ✓' },
  /* SOLUTION 3: one edit, every format */
  reply: { l1: 'One edit.', l2: 'Every format.', message: 'Export: 16:9 · 9:16 · 1:1 with captions', avatar: 'YOU' },

  monitor: { title: 'Videos exported', value: 48, words: ['Generate', 'Edit', 'Publish'], l1: 'Idea', l2: 'to post.' },
  proof: {
    pre: 'More videos, ', accent: 'less editing.',
    panel: 'Spring campaign', period: 'This week',
    m1: { label: 'Videos exported', to: 48 },
    m2: { label: 'Avg. edit time', from: 60, to: 12, unit: ' min' },
    bars: [30, 44, 52, 70, 96, 126, 150],
    left: { label: 'Captioned', to: 100, suffix: '%' },
    right: { label: 'Languages', to: 6, dec: 0, stars: false },
    quote: 'Campaign ready to post ✓',
  },
  cta: { tagline: ['From idea ', 'to video.'], primary: 'Try VEED →', secondary: 'See templates' },
};
