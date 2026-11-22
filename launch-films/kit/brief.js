/* Kit: independent concept by ISP Agency (not affiliated with or approved by Kit).
 * Accent #44B1FF from kit.com/brand. No Kit logo is used: the icon is a generated placeholder.
 * All numbers are illustrative sample data. */
window.BRIEF = {
  product: 'Kit',
  url: 'kit.com',
  brand: { accent: '#44B1FF', accentDark: '#1F86D1', logo: null },
  people: ['NB', 'IL', 'OS', 'MR', 'TC', 'DV'],
  channels: [['✉', '#44B1FF', 'Email'], ['▤', '#7C5CFF', 'Landing pages'], ['$', '#19B36B', 'Products']],

  hook: { from: '7:41', to: '7:42', suffix: 'pm', notifMeta: 'New DM · 7:42', notif: 'where can I get your guide??' },
  chaos: {
    l1: 'Followers,', l2: 'but no list.',
    sources: [['◎', '#E1306C'], ['▶', '#FF3B30'], ['@', '#231F20'], ['✉', '#44B1FF']],
    messages: ['link in bio?', 'did you get my DM?', 'is the course open?', 'send me the PDF', 'missed your post', 'the feed hid it', 'waitlist?', 'how do I buy?'],
  },
  pain: { value: 214, unit: 'DMs', pill: '+40 today', complaints: ['link?', 'PDF pls', 'course?', 'hello?', 'price?', 'missed it'] },

  /* SOLUTION 1: a form that builds the list */
  morph: { l1: 'Offer it.', l2: 'List grows.', title: 'Landing page · Free guide', panelTitle: 'Free guide',
    meta: [['Offer', 'Design starter guide'], ['Form', 'Name + email'], ['Tag', 'Guide download']], button: 'Publish', done: 'Published ✓' },
  /* SOLUTION 2: welcome sequence on autopilot */
  inbox: {
    l1: 'Welcome them,', l2: 'automatically.',
    screenshot: null, click: [0.86, 0.2],
    nav: ['Subscribers', 'Broadcasts', 'Automations', 'Products'],
    title: 'Welcome sequence', badge: '5 emails',
    items: [['Day 0 · Here’s your guide', 'Email'], ['Day 2 · How I got started', 'Email'], ['Day 4 · Into design?', 'Tag'], ['Day 6 · The course is open', 'Offer'], ['Day 7 · Last call', 'Offer']],
    tags: { Email: ['#E8F5FF', '#1F86D1'], Tag: ['#F1ECFF', '#6A4BE0'], Offer: ['#E8FBF2', '#139B6E'] },
    action: 'Activate ✓',
  },
  /* SOLUTION 3: right message, right reader */
  sort: {
    l1: 'Right message,', l2: 'right reader.', pattern: ['tags', 'segments'],
    columns: ['Beginners', 'Designers', 'Buyers'],
    chips: [['Downloaded guide', 0], ['Clicked “Figma tips”', 1], ['Bought starter kit', 2], ['New this week', 0], ['Opened design issue', 1], ['Bought course', 2], ['Joined via form', 0], ['Replied to day 2', 1], ['Upgraded plan', 2]],
  },

  monitor: { title: 'Subscribers', value: 3240, words: ['Grow', 'Automate', 'Sell'], l1: 'Grow it.', l2: 'Earn it.' },
  proof: {
    pre: 'From signup ', accent: 'to first sale.',
    panel: 'Creator dashboard', period: 'This month',
    m1: { label: 'Subscribers', to: 3240 },
    m2: { label: 'Open rate', from: 41, to: 56, unit: '%' },
    bars: [36, 48, 55, 72, 90, 120, 150],
    left: { label: 'Finished welcome', to: 82, suffix: '%' },
    right: { label: 'Products sold', to: 64, dec: 0, stars: false },
    quote: 'New sale: Starter course ✓',
  },
  cta: { tagline: ['Your audience, ', 'your business.'], primary: 'Try Kit →', secondary: 'See features' },
};
