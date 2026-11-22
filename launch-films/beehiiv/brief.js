/* beehiiv: independent concept by ISP Agency (not affiliated with or approved by beehiiv).
 * No company-authored brand guide was found: the accent #F2652E is a PLACEHOLDER to replace with the official kit.
 * No beehiiv logo is used. All numbers are illustrative sample data. */
window.BRIEF = {
  product: 'beehiiv',
  url: 'beehiiv.com',
  brand: { accent: '#F2652E', logo: null },
  people: ['ER', 'KD', 'SM', 'PW', 'HL', 'AJ'],
  channels: [['✉', '#F2652E', 'Newsletter'], ['◉', '#7C5CFF', 'Website'], ['$', '#19B36B', 'Monetize']],

  hook: { from: '6:58', to: '6:59', suffix: 'am', notifMeta: 'Reminder · 6:59', notif: 'issue #12 goes out in one hour' },
  chaos: {
    l1: 'Five tools,', l2: 'one newsletter.',
    sources: [['✎', '#7C5CFF'], ['@', '#FF6A3D'], ['$', '#19B36B'], ['▥', '#2386D6']],
    messages: ['export the list again', 'fix the signup form', 'which tool has stats?', 'sponsor invoice due', 'paywall broken?', 'sync failed', 'update the site', 'referral sheet?'],
  },
  pain: { value: 11, unit: 'tabs open', pill: '$0 earned', complaints: ['opens?', 'sync failed', 'which list?', 'invoice?', 'paywall?', 'unsubscribed'] },

  /* SOLUTION 1: write and send in one place */
  inbox: {
    l1: 'Write it.', l2: 'Send it.',
    screenshot: null, click: [0.86, 0.2],
    nav: ['Posts', 'Audience', 'Grow', 'Monetize'],
    title: 'Issue #12 · Draft', badge: 'Ready',
    items: [['The weekly brief: issue #12', 'Title'], ['Three things worth reading', 'Body'], ['Presented by our sponsor', 'Ad'], ['You might also like…', 'Grow'], ['Members-only deep dive', 'Paid']],
    tags: { Title: ['#FFF1EA', '#D9531E'], Body: ['#F2F4F8', '#4A5163'], Ad: ['#E8FBF2', '#139B6E'], Grow: ['#F1ECFF', '#6A4BE0'], Paid: ['#FFF7E0', '#B7791F'] },
    action: 'Send ✓',
  },
  /* SOLUTION 2: readers bring readers */
  colorize: { l1: 'Readers bring', l2: 'more readers.', toggle: 'Turn on referral program', pill: '+312 new subscribers' },
  /* SOLUTION 3: turn readers into revenue */
  morph: { l1: 'Readers,', l2: 'to revenue.', title: 'Monetize · Premium tier', panelTitle: 'Premium tier',
    meta: [['Price', '$8 / month'], ['Perks', 'Paid-only posts'], ['Ads', 'Sponsor slots']], button: 'Launch tier', done: 'Live ✓' },

  monitor: { title: 'Subscribers', value: 4820, words: ['Publish', 'Grow', 'Earn'], l1: 'Own your', l2: 'audience.' },
  proof: {
    pre: 'Watch it ', accent: 'grow.',
    panel: 'Audience', period: 'Last 90 days',
    m1: { label: 'Subscribers', to: 4820 },
    m2: { label: 'Open rate', from: 38, to: 52, unit: '%' },
    bars: [42, 50, 61, 70, 88, 114, 150],
    left: { label: 'From referrals', to: 31, suffix: '%' },
    right: { label: 'Paid subscribers', to: 186, dec: 0, stars: false },
    quote: 'First sponsor booked ✓',
  },
  cta: { tagline: ['Publish, grow ', 'and earn.'], primary: 'Try beehiiv →', secondary: 'See features' },
};
