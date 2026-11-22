/* BRIEF: Ghost (ghost.org) launch film. Every word, number and colour lives here.
 * Brand styling follows ghost.org: Inter Bold, ink #15171A, white-and-black ground, purple accent
 * (Ghost's analytics purple), black primary button as on ghost.org's white sections.
 * PLACEHOLDERS (fictional, replace or confirm before publishing): people initials, "Riverside Daily",
 * member counts, the quote. Publication names in social are the ones featured on ghost.org: confirm use.
 */
window.BRIEF = {
  product: 'ghost',
  url: 'ghost.org',
  brand: {
    accent: '#8E42FF',
    ink: '#15171A',
    blob: '176,178,184',          // white-and-black ground (client approved): neutral grey haze, no tint
    logo: 'assets/ghost-orb.png', // Ghost orb mark from ghost.org
  },
  people: ['MR', 'JK', 'AP', 'LS', 'SN', 'IV'],
  channels: [['✎', '#15171A', 'Website'], ['✉', '#8E42FF', 'Newsletter'], ['$', '#30CF43', 'Members']],

  /* PROBLEM: a real moment. You post, the platform shows almost no one saw it. */
  hook: { from: '9:00', to: '9:01', suffix: 'am', notifMeta: 'Your post · 9:01', notif: 'Seen by 6% of your followers' },
  /* PROBLEM: the chaos of running a publication on rented platforms and duct-taped tools */
  chaos: {
    l1: 'Five tools.', l2: 'Zero control.',
    sources: [['✉', '#8E42FF'], ['$', '#30CF43'], ['♥', '#FF247D'], ['▲', '#15171A']],
    messages: ['reach down 40%', 'export members.csv', 'payment sync failed', '10% platform fee', 'invoice due: $39', 'who unsubscribed?', 'algorithm changed', 'import 1 of 3…'],
  },
  /* PAIN: one number */
  pain: { value: 94, unit: '% unseen', pill: '6% reach', complaints: ['where’s my reach?', '10% fee again?', 'export… again', 'sync failed', '5 logins', 'who left?'] },

  /* BENEFIT 1 (answers reach): the real Ghost editor on a laptop, the hand clicks Publish */
  inbox: {
    l1: 'Every post,', l2: 'every inbox.',
    screenshot: 'assets/editor.jpg', // ghost.org editor, 16:10
    click: [0.93, 0.035],            // "Publish" in the editor's top bar
    nav: [], title: '', badge: '', items: [], tags: {}, action: 'Publish',
  },
  /* BENEFIT 2 (answers fees): grey wall of readers lights up as paid memberships turn on */
  colorize: { l1: 'Paid members.', l2: '0% fees.', toggle: 'Turn on paid memberships', pill: '2,480 paying members' },
  /* BENEFIT 3 (answers tool sprawl): headline card morphs into one Ghost panel; the hand publishes */
  morph: { l1: 'One place,', l2: 'no duct tape.', title: 'Riverside Daily · Ghost', panelTitle: 'Riverside Daily',
    meta: [['Website', 'Live'], ['Newsletter', '2,480 subscribers'], ['Payments', '0% fees']], button: 'Publish & send', done: 'Sent ✓' },
  /* (unused shots keep valid copy so nothing from the template survives) */
  sort: { l1: 'Sorted.', l2: 'Instantly.', pattern: ['ghost'], columns: ['Free', 'Paid', 'Comp'], chips: [] },
  reply: { l1: 'Publish once.', l2: 'Everywhere.', message: 'The future of local news', avatar: 'YOU' },
  rack: { request: 'The future of local news', button: 'Publish & send', done: 'Sent ✓', screenshot: 'assets/editor.jpg' },
  dive: { l1: 'Your whole business,', l2: 'in one place.', screenshot: null },

  /* PROOF: dashboard with count-ups */
  proof: {
    pre: 'Keep ', accent: '100% of your revenue',
    panel: 'Riverside Daily · Dashboard', period: 'Last 30 days',
    m1: { label: 'Paid members', to: 2480 },
    m2: { label: 'Platform fee', from: 10, to: 0, unit: '%' },
    bars: [40, 58, 52, 78, 96, 124, 150],
    left: { label: 'Open rate', to: 64, suffix: '%' },
    right: { label: 'MRR growth', to: 2.4, suffix: '×' },
    quote: '“We kept every dollar.”',
  },
  /* PROOF: social proof (ghost.org: "Last week, 20,425 brand new publications got started with Ghost") */
  social: { l1: 'Last week,', from: 2000, to: 20425, suffix: ' new publications',
    logos: ['404 Media', 'Tangle', 'Platformer', 'The Lever', 'Buffer', 'Kickstarter', 'Y Combinator', 'Unsplash'],
    rating: { from: 10, to: 100, prefix: '$', suffix: 'M+', note: 'earned on Ghost every year', stars: false } },
  /* EASE: the reel lands on zero platform fees */
  setup: { from: 10, to: 0, suffix: '%', l1: 'fees on what', l2: 'your readers pay.', pad: false, labelX: 1000 },
  /* CTA: ghost.org's own hero line and button */
  cta: { tagline: ['Turn your audience ', 'into a business.'], primary: 'Start publishing now →', secondary: 'Try free for 14 days' },
};
