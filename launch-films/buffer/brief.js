/* Buffer: independent concept by ISP Agency (not affiliated with or approved by Buffer).
 * Colours from Buffer's published visual guide (#2C4BFF blue, #231F20 black). No Buffer logo is used:
 * the icon is a generated placeholder. Platform names are descriptive only; all numbers are illustrative sample data. */
window.BRIEF = {
  product: 'Buffer',
  url: 'buffer.com',
  brand: { accent: '#2C4BFF', ink: '#231F20', logo: null },
  people: ['AM', 'JS', 'RK', 'LT', 'NO', 'CP'],
  channels: [['in', '#0A66C2', 'LinkedIn'], ['◎', '#E1306C', 'Instagram'], ['@', '#231F20', 'Threads']],

  hook: { from: '8:58', to: '8:59', suffix: 'am', notifMeta: 'Client · 8:59', notif: 'did the launch post go out??' },
  chaos: {
    l1: 'Six channels,', l2: 'six tabs open.',
    sources: [['in', '#0A66C2'], ['◎', '#E1306C'], ['@', '#231F20'], ['▶', '#FF3B30']],
    messages: ['caption for LinkedIn?', 'resize for stories', 'who’s posting today?', 'reply to comments!', 'did this go live?', 'post on Threads too?', 'missed the 9 am slot', 'which hashtags?'],
  },
  pain: { value: 42, unit: 'posts due', pill: '+12 this week', complaints: ['is it live?', 'wrong size', 'who replied?', 'caption?', 'ETA?', 'missed it'] },

  /* SOLUTION 1: one idea, every channel */
  reply: { l1: 'Write once.', l2: 'Post everywhere.', message: 'Our spring launch is live — come take a look', avatar: 'YOU' },
  /* SOLUTION 2: plan the week in one queue */
  morph: { l1: 'One queue.', l2: 'All week.', title: 'Queue · This week', panelTitle: 'This week',
    meta: [['Mon', 'LinkedIn · 9:00'], ['Wed', 'Instagram · 12:30'], ['Fri', 'Threads · 17:00']], button: 'Schedule', done: 'Scheduled ✓' },
  /* SOLUTION 3: every comment in one place */
  inbox: {
    l1: 'Every comment,', l2: 'one place.',
    screenshot: null, click: [0.86, 0.2],
    nav: ['Create', 'Publish', 'Community', 'Insights'],
    title: 'Comments', badge: '5 new',
    items: [['Love this launch!', 'Instagram'], ['Is there a student plan?', 'LinkedIn'], ['When does it ship?', 'Threads'], ['Great breakdown, thanks', 'LinkedIn'], ['Link isn’t working', 'Instagram']],
    tags: { Instagram: ['#FDEBF2', '#C2185B'], LinkedIn: ['#E8F1FB', '#0A66C2'], Threads: ['#EFEFEF', '#231F20'] },
    action: 'Reply ✓',
  },

  monitor: { title: 'Engagement this week', value: 18240, words: ['Create', 'Publish', 'Insights'], l1: 'Show up', l2: 'everywhere.' },
  proof: {
    pre: 'See what ', accent: 'lands best.',
    panel: 'Insights', period: 'Last 30 days',
    m1: { label: 'Engagements', to: 18240 },
    m2: { label: 'Avg. reply time', from: 9, to: 2, unit: ' h' },
    bars: [50, 62, 58, 76, 92, 118, 150],
    left: { label: 'Posts published', to: 42 },
    right: { label: 'Engagement rate', to: 5.8, suffix: '%', stars: false },
    quote: 'Best time to post: Tue 9:00',
  },
  cta: { tagline: ['Your social media, ', 'one workspace.'], primary: 'Try Buffer →', secondary: 'See plans' },
};
