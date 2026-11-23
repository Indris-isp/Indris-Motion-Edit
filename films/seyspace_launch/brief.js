/* SeySpace launch film, Ref A (Airy Light) structure. Brand from seyspace.com: Plus Jakarta Sans, black CTA,
 * forest green #1B3B32 as the accent, their logo, their real gallery / cart / store screens, their own lines. */
window.BRIEF = {
  product: 'SeySpace',
  url: 'seyspace.com',
  brand: {
    colors: { accent: '#1B3B32', highlight: '#C8B9A7', bg: '#FFFFFF', bg2: '#F4F1EA', ink: '#111611', muted: '#7A7F78', dark: '#0F1F1A', line: '#E6E2D8', tint: '#EDF2EE' },
    fonts: [{ family: 'Plus Jakarta Sans', src: 'fonts/PlusJakartaSans-700.ttf', weight: 700 }, { family: 'Plus Jakarta Sans', src: 'fonts/PlusJakartaSans-800.ttf', weight: 800 }],
    display: 'Plus Jakarta Sans', body: 'Inter', headWeight: 800, headTracking: '-.045em',
    radius: 20,
    buttons: { primary: { bg: '#1B1B1D', color: '#fff', radius: 999 }, secondary: { bg: 'transparent', color: 'inherit', border: '2px solid currentColor', radius: 999 }, weight: 700 },
    logo: 'brand/logo.png', logoOnDark: 'assets/logo-white.png', icon: 'assets/icon.png',
  },
  launch: { pill: 'All-in-one photography business platform →' },
  hero: { eyebrow: 'Tools for the modern photographer', l1: 'Everything you need', l2: 'to run your studio.', screen: 'assets/gal_digital_delivery_scr.png', layers: [] },
  features: [{ label: 'Client galleries', l1: 'Galleries that', l2: 'wow clients.', image: 'assets/gal_digital_delivery_scr.png' }],
  words: { screen: null, items: ['Book', 'Deliver', 'Sell'] },
  split: { left: 'Shoot', right: 'more.', screen: null },
  build: { title: 'New gallery', label: 'THE ELEGANCE COLLECTION', base: null, drag: null },
  stat: { value: '0%', valueShort: '0%', caption: 'platform commission on print sales,', bold: 'on paid plans.' },

  people: ['PS', 'AM', 'JR', 'KT', 'LB', 'NW'],
  channels: [['▦', '#1B3B32', 'Galleries'], ['✎', '#4A3B2C', 'Contracts'], ['$', '#485949', 'Store']],

  hook: { from: '9:41', to: '9:42', suffix: 'pm', notifMeta: 'Client · 9:42 pm', notif: 'when will our wedding photos be ready??' },
  chaos: {
    l1: 'Your studio is', l2: 'everywhere.',
    sources: [['✉', '#2386D6'], ['#', '#7C5CFF'], ['$', '#19B36B'], ['☁', '#E0701E']],
    messages: ['gallery link?', 'invoice attached', 'can we move the shoot?', 'deposit sent!', 'where’s the contract?', 'prints please!!', 'which date again?', 'download not working'],
  },
  pain: { value: 9, unit: 'apps', pill: 'duct-taped', complaints: ['gallery link?', 'invoice??', 'contract?', 'deposit paid?', 'which date?', 'prints pls'] },

  inbox: {
    l1: 'Galleries that', l2: 'wow clients.',
    screenshot: 'assets/gal_digital_delivery_scr.png', click: [0.52, 0.58],
    nav: [], title: '', badge: '', items: [], tags: {}, action: 'Open ✓',
  },
  sort: {
    l1: 'Booked. Paid.', l2: 'Delivered.', pattern: ['booked', 'paid', 'delivered'],
    columns: ['Booked', 'Paid', 'Delivered'],
    chips: [['Elegance Collection', 2], ['Mehta wedding', 0], ['Studio portraits', 1], ['Brand shoot', 0], ['Engagement session', 1], ['Family day', 2], ['Headshots', 0], ['Maternity', 1], ['Reception', 2]],
  },
  reply: { l1: 'Share once.', l2: 'Everyone sees it.', message: 'Your gallery is ready ✓', avatar: 'YOU' },
  colorize: { l1: 'Every client,', l2: 'one place.', toggle: 'Connect your client portal', pill: 'Clients synced' },
  morph: { l1: 'Contracts,', l2: 'signed in a click.', title: 'Contract · Elegance Collection', panelTitle: 'Wedding contract',
    meta: [['Client', 'Sample client'], ['Shoot', '27 Oct 2025'], ['Fee', '$2,450']], button: 'Send to sign', done: 'Signed ✓',
    tiles: [['assets/g2.jpg', 'Bridal portrait', 'Portraits'], ['assets/g0.jpg', 'Grand staircase', 'First look'], ['assets/g1.jpg', 'Couple ascending', 'Ceremony'], ['assets/g3.jpg', 'Palace archway', 'Venue'], ['assets/g4.jpg', 'Gilded mirror', 'Details'], ['assets/g5.jpg', 'Reception portrait', 'Reception']] },
  rack: { request: 'Send gallery to Sample client', button: 'Share gallery', done: 'Shared ✓', screenshot: 'assets/gal_sell_photos_scr.png',
    l1: 'Share it.', l2: 'In one click.' },
  dive: { l1: 'Turn galleries', l2: 'into revenue.', screenshot: 'assets/store_storefront_scr.png' },

  proof: { pre: '', accent: '', panel: '', period: '', m1: { label: '', to: 0 }, m2: { label: '', from: 0, to: 0, unit: '' }, bars: [], left: { label: '', to: 0, suffix: '' }, right: { label: '', to: 0 }, quote: '' },
  social: { l1: '', from: 0, to: 0, suffix: '', logos: [], rating: { from: 0, to: 0, note: '' } },
  setup: { from: 9, to: 1, l1: 'place', l2: 'for your studio' },
  cta: { tagline: ['Everything you need ', 'to run your studio.'], primary: 'Get Started →', secondary: 'Join Studio' },
};
