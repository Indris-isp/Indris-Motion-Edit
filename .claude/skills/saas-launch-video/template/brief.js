/* BRIEF: every word, number and colour in the film. Edit this file first.
 * The values below are the "Loopin" demo (a fictional product). Replace them all.
 * Keep headlines to 2-4 words per line; line 2 is the accent-coloured payoff.
 */
window.BRIEF = {
  product: 'Loopin',
  url: 'loopin.app',
  brand: {
    accent: '#2F6BFF',            // the one brand colour; the rest of the palette derives from it
    // accentLight: '#5B8CFF', accentDark: '#1F4FD6', ink: '#0B0D12', font: 'Inter',
    logo: null,                   // e.g. 'assets/logo.svg' (square works best); null = generated ring icon
  },
  people: ['MK', 'JL', 'AS', 'TR', 'BN', 'EO'],   // initials, or image paths like 'assets/p1.jpg'
  channels: [['#', '#7C5CFF', 'Chat'], ['@', '#FF6A3D', 'Email'], ['✓', '#19B36B', 'Docs']], // [glyph, colour, label]

  /* PROBLEM — a real moment */
  hook: { from: '9:13', to: '9:14', suffix: 'am', notifMeta: 'Client · 9:14', notif: 'any update on the v2 feedback??' },
  /* PROBLEM — the chaos */
  chaos: {
    l1: 'Feedback is', l2: 'everywhere.',
    sources: [['#', '#7C5CFF'], ['@', '#FF6A3D'], ['✉', '#2386D6'], ['☎', '#19B36B']],
    messages: ['is this the final?', 'see my comments', 'logo bigger pls', 'where’s v2??', 'can we revert?', 'feedback in doc', 'urgent!!', 'did you see this?'],
  },
  /* PAIN — the problem as a number */
  pain: { value: 127, unit: 'unread', pill: '+38 today', complaints: ['still waiting…', 'v2??', 'which file?', 'hello?', 'ETA?', 'missed this'] },

  /* BENEFIT — product UI on a 3D laptop, hand clicks the action */
  inbox: {
    l1: 'Every comment,', l2: 'one inbox.',
    screenshot: null,             // e.g. 'assets/app.png' (16:10). If set, replaces the mock UI below.
    click: [0.86, 0.2],           // where the hand clicks on the screenshot (fractions of width, height)
    nav: ['Inbox', 'Assigned', 'Done', 'Clients'],
    title: 'All feedback', badge: '5 new',
    items: [['Logo needs more contrast', 'Design'], ['Pricing copy feels long', 'Copy'], ['Love the new hero!', 'Praise'], ['Checkout bug on Safari', 'Bug'], ['Can we add dark mode?', 'Request']],
    tags: { Design: ['#EEF3FF', '#2F6BFF'], Copy: ['#FFF3E8', '#E0701E'], Praise: ['#E8FBF2', '#139B6E'], Bug: ['#FFECEC', '#D63C3C'], Request: ['#F1ECFF', '#6A4BE0'] },
    action: 'Resolve ✓',
  },
  /* BENEFIT — circle reveal, things sort themselves */
  sort: {
    l1: 'Sorted by AI.', l2: 'Instantly.', pattern: ['by AI', 'instantly sorted'],
    columns: ['Design', 'Bug', 'Praise'],
    chips: [['Logo needs contrast', 0], ['Checkout bug on Safari', 1], ['Love the new hero!', 2], ['Spacing on mobile', 0], ['Login loops twice', 1], ['Great onboarding', 2], ['Icons feel heavy', 0], ['PDF export fails', 1], ['So much faster', 2]],
  },
  /* BENEFIT — one action fans out to many places (uses channels) */
  reply: { l1: 'Reply once.', l2: 'Everyone sees it.', message: 'Fixed in v2.1, take a look ✓', avatar: 'YOU' },

  /* BENEFIT — grey wall of faces lights up as a toggle connects (integrations / team adoption) */
  colorize: { l1: 'Plugs into', l2: 'your tools.', toggle: 'Connect Chat, Email & Docs', pill: '48 clients synced' },
  /* BENEFIT — accent card with a headline morphs into a folder, then into the product panel; a hand approves */
  morph: { l1: 'Approvals,', l2: 'one click.', title: 'Review · Homepage v2', panelTitle: 'Homepage v2',
    meta: [['Owner', 'Maya K.'], ['Due', 'Today'], ['Comments', '12 resolved']], button: 'Approve', done: 'Approved ✓' },
  /* BENEFIT — laptop whips in, a request types and sends, camera pushes onto the button with depth of field */
  rack: { request: 'Review the new pricing page', button: 'Send request', done: 'Sent ✓', screenshot: null,
    l1: 'Ask once.', l2: 'Get answers.' },   // l1/l2 show in 9:16 only (fills the space above the laptop)
  /* TRANSITION/BENEFIT — camera dives into the laptop screen until it fills the frame; headline on glass */
  dive: { l1: 'Lives where', l2: 'you already work.', screenshot: null },

  /* PROOF — dashboard with count-ups */
  proof: {
    pre: 'Close feedback ', accent: '3.2× faster',
    panel: 'Feedback overview', period: 'This week',
    m1: { label: 'Resolved', to: 12480 },
    m2: { label: 'Avg. reply', from: 60, to: 18, unit: ' min' },
    bars: [40, 62, 48, 80, 96, 120, 150],
    left: { label: 'Clients happy', to: 94, suffix: '%' },
    right: { label: 'Rating', to: 4.9 },
    quote: '“we shipped v2 a week early”',
  },
  /* PROOF — social proof */
  social: { l1: 'Trusted by', from: 300, to: 1200, suffix: '+ teams',
    logos: ['Northwind', 'kitebase', 'LUMEN&CO', 'Orbital', 'acme.io', 'Brightline', 'QUANTA', 'fernway'],   // or image paths
    rating: { from: 4.1, to: 4.9, note: '600+ reviews' } },
  /* EASE — slot-reel number */
  setup: { from: 10, to: 2, l1: 'minutes', l2: 'to set up' },
  /* CTA */
  cta: { tagline: ['Close the loop ', 'on every client.'], primary: 'Start free →', secondary: 'Book a demo' },
};
