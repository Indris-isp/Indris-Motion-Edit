/* BRIEF: every word, number and colour in the RB2B launch film.
 * Numbers, people and company names marked PLACEHOLDER are illustrative — replace with real, approved ones.
 * Keep headlines to 2-4 words per line; line 2 is the accent-coloured payoff.
 */
window.BRIEF = {
  product: 'RB2B',
  url: 'rb2b.com',
  brand: {
    accent: '#2F6BFF',
    logo: null,                   // supply an approved logo file in assets/ to replace the generated icon
  },
  people: ['SC', 'MR', 'JP', 'AK', 'DL', 'NV'],   // PLACEHOLDER initials (fictional people)
  channels: [['#', '#7C5CFF', 'Slack'], ['◆', '#FF6A3D', 'CRM'], ['⚡', '#19B36B', 'Webhook']],

  /* PROBLEM — a real moment: a buyer on the pricing page */
  hook: { from: '2:47', to: '2:48', suffix: 'pm', notifMeta: 'Site analytics · 2:48', notif: 'Visitor on /pricing · 4m 12s' },

  /* PROBLEM — the visitor's journey, then they vanish (new shot: journey) */
  journey: {
    l1: 'Checked pricing.', l2: 'Then vanished.',
    pages: [['/', 'Home'], ['/pricing', 'Pricing'], ['/case-studies', 'Case study']],
    timer: [4, 12], exit: 'Tab closed · no form',
  },
  /* PROBLEM — the chaos */
  chaos: {
    l1: 'Who are all', l2: 'these people?',
    sources: [['?', '#9AA3B5'], ['?', '#B4BBC9'], ['?', '#8A93A6'], ['?', '#A7AFBF']],
    messages: ['Anonymous · /pricing', 'Unknown · /demo', 'Anonymous · 3 visits', 'Unknown · /pricing', 'Visitor #4821', 'Anonymous · /docs', 'Unknown · 6m on site', 'Bounced · /pricing'],
  },
  /* PAIN — the problem as a number */
  pain: { value: 2847, unit: 'anonymous', pill: '0 form fills', complaints: ['who was that?', 'pricing ×4…', 'no form fill', 'gone.', 'lead lost', 'bounced'] },

  /* REVEAL — dark stage, monitor with a live chart, ✦ keywords, flanking words (new shot: monitor) */
  monitor: { violet: '#6A2BFF', panel: 'Visitors identified', value: 1284, unit: 'today',     // PLACEHOLDER number
    keywords: ['Identify', 'Enrich', 'Alert'], flank: ['Real-time', 'intent.'] },
  /* EASE — pastel glass card, the pixel is dropped onto the site (new shot: dropzone) */
  dropzone: { l1: 'One script.', l2: 'Live in 2 minutes.', title: 'Install RB2B', label: 'YOUR WEBSITE', hint: 'Drop your pixel here',
    file: 'rb2b-pixel.js', size: 'Script · 2 KB', live: 'Live · identifying visitors' },

  /* BENEFIT — anonymous card is scanned and decodes into a named person (new shot: unmask) */
  unmask: {
    l1: 'Every visitor,', l2: 'has a name.',
    anon: 'Anonymous visitor', ip: 'IP 104.28.•••.••',
    name: 'Sarah Chen', title: 'VP of Sales', company: 'Northwind Labs', // PLACEHOLDER person
    chips: ['Verified email ✓', 'Northwind · 340 staff', 'Viewed /pricing ×3', 'Austin, TX'],
    before: 'Anonymous', after: 'Identified ✓',
  },

  /* BENEFIT — product UI on a 3D laptop, hand clicks the action */
  inbox: {
    l1: 'Hot leads,', l2: 'in real time.',
    screenshot: null,
    click: [0.86, 0.2],
    nav: ['Visitors', 'Companies', 'Hot pages', 'Settings'],
    title: 'Identified today', badge: '24 new',
    items: [['Sarah Chen · VP Sales', 'Pricing'], ['Marcus Reid · Founder', 'Demo'], ['Jade Park · RevOps', 'Case study'], ['Amir Khan · CMO', 'Pricing'], ['Dana Lee · AE Lead', 'Blog']],
    tags: { Pricing: ['#FFECEC', '#D63C3C'], Demo: ['#FFF3E8', '#E0701E'], 'Case study': ['#EEF3FF', '#2F6BFF'], Blog: ['#E8FBF2', '#139B6E'] },
    action: 'Push to CRM →',
  },
  /* BENEFIT — circle reveal, leads sort themselves */
  sort: {
    l1: 'Ready to buy?', l2: 'Know first.', pattern: ['who visited', 'hot leads first'],
    columns: ['Hot', 'Warm', 'Nurture'],
    chips: [['Sarah · /pricing ×3', 0], ['Marcus · /blog', 1], ['Jade · /docs', 2], ['Amir · /demo', 0], ['Dana · /careers', 2], ['Noah · /case-study', 1], ['Priya · /pricing', 0], ['Leo · /about', 2], ['Ivy · /integrations', 1]],
  },
  /* BENEFIT — one visit fans out to every tool */
  reply: { l1: 'Straight into', l2: 'your Slack.', message: 'Sarah Chen, VP Sales viewed /pricing', avatar: 'RB' },

  /* BENEFIT — accent card morphs into a lead panel; a hand adds her to a sequence */
  morph: { l1: 'Follow up', l2: 'while warm.', title: 'Lead · Sarah Chen', panelTitle: 'Sarah Chen',
    meta: [['Company', 'Northwind Labs'], ['Visited', '/pricing ×3'], ['Intent', 'High']], button: 'Add to sequence', done: 'Added ✓' },

  /* unused shots in this cut (kept so the template shots still build) */
  colorize: { l1: 'Plugs into', l2: 'your stack.', toggle: 'Connect Slack & CRM', pill: '1,240 leads synced' },
  rack: { request: 'Follow up with Sarah today', button: 'Send', done: 'Sent ✓', screenshot: null },
  dive: { l1: 'Names behind', l2: 'every visit.', screenshot: null },

  /* PROOF — dashboard with count-ups (PLACEHOLDER numbers) */
  proof: {
    pre: 'Turn traffic into ', accent: 'pipeline.',
    panel: 'Visitors identified', period: 'Last 30 days',
    m1: { label: 'People named', to: 18420 },
    m2: { label: 'Time to follow-up', from: 48, to: 5, unit: ' min' },
    bars: [38, 55, 50, 78, 92, 124, 156],
    left: { label: 'Meetings booked', to: 312, suffix: '' },
    right: { label: 'Rating', to: 4.8 },
    quote: '“3 deals from one Slack ping”',
  },
  /* PROOF — social proof (PLACEHOLDER fictional logos and numbers) */
  social: { l1: 'Trusted by', from: 2000, to: 10000, suffix: '+ teams',
    logos: ['Northwind', 'kitebase', 'LUMEN&CO', 'Orbital', 'acme.io', 'Brightline', 'QUANTA', 'fernway'],
    rating: { from: 4.1, to: 4.8, note: '900+ reviews' } },
  /* EASE — slot-reel number */
  setup: { from: 10, to: 2, l1: 'minutes', l2: 'to install' },
  /* CTA */
  cta: { tagline: ['Know who’s ', 'on your site.'], primary: 'Get started free →', secondary: 'Book a demo' },
};
