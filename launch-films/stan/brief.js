/* Stan: independent concept by ISP Agency (not affiliated with or approved by Stan).
 * No company-authored brand guide was found: the accent #6355FF is a PLACEHOLDER to replace with the official kit.
 * No Stan logo is used. All numbers and prices are illustrative sample data, not earnings claims. */
window.BRIEF = {
  product: 'Stan',
  url: 'stan.store',
  brand: { accent: '#6355FF', logo: null },
  people: ['JH', 'VD', 'MA', 'KS', 'LB', 'RT'],
  channels: [['⬇', '#6355FF', 'Downloads'], ['☎', '#19B36B', 'Coaching'], ['▶', '#FF6A3D', 'Courses']],

  hook: { from: '9:41', to: '9:42', suffix: 'pm', notifMeta: 'New DM · 9:42', notif: 'do you do 1:1 coaching??' },
  chaos: {
    l1: 'Big following,', l2: 'no store.',
    sources: [['◎', '#E1306C'], ['▶', '#FF3B30'], ['@', '#231F20'], ['$', '#19B36B']],
    messages: ['how do I pay you?', 'is the ebook out?', 'book a call?', 'link broken', 'can I pay by card?', 'send the PDF pls', 'calendar link?', 'preset pack?'],
  },
  pain: { value: 87, unit: 'DMs', pill: '0 sales', complaints: ['price?', 'link?', 'book?', 'PDF?', 'hello?', 'still open?'] },

  /* SOLUTION 1: a store in your bio */
  morph: { l1: 'Store in', l2: 'your bio.', title: 'My store · Link in bio', panelTitle: 'My store',
    meta: [['Ebook', '$19'], ['1:1 coaching', '$90 / call'], ['Mini course', '$149']], button: 'Publish', done: 'Live ✓' },
  /* SOLUTION 2: pay or book in a tap, delivered automatically */
  inbox: {
    l1: 'Tap. Pay.', l2: 'Done.',
    screenshot: null, click: [0.86, 0.2],
    nav: ['Store', 'Income', 'Customers', 'Analytics'],
    title: 'Orders', badge: '5 new',
    items: [['Ebook · Meal plan', 'Paid'], ['1:1 coaching · Thu 3 pm', 'Booked'], ['Preset pack', 'Paid'], ['Mini course', 'Paid'], ['Coaching · Fri 11 am', 'Booked']],
    tags: { Paid: ['#E8FBF2', '#139B6E'], Booked: ['#EFEDFF', '#4B3FE0'] },
    action: 'Delivered ✓',
  },
  /* SOLUTION 3: followers become customers */
  colorize: { l1: 'Followers become', l2: 'customers.', toggle: 'Add store link to bio', pill: '24 new customers' },

  monitor: { title: 'Store sales', value: 2840, words: ['Sell', 'Book', 'Deliver'], l1: 'Post.', l2: 'Get paid.' },
  proof: {
    pre: 'Your followers, ', accent: 'your store.',
    panel: 'Store analytics', period: 'This month',
    m1: { label: 'Store visits', to: 6420 },
    m2: { label: 'Checkout time', from: 4, to: 1, unit: ' min' },
    bars: [38, 46, 60, 66, 92, 118, 150],
    left: { label: 'Visit to purchase', to: 6, suffix: '%' },
    right: { label: 'Calls booked', to: 18, dec: 0, stars: false },
    quote: 'New order: Meal plan ✓',
  },
  cta: { tagline: ['Sell what you know, ', 'from your bio.'], primary: 'Try Stan →', secondary: 'See how it works' },
};
