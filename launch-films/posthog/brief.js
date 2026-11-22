/* PostHog: independent concept by ISP Agency (not affiliated with or approved by PostHog).
 * Brand colours from brand.posthog.com (#1D4AFF blue, #151515 ink). No PostHog logo or hedgehog art is used:
 * the icon is a generated placeholder. All numbers are illustrative sample data, not PostHog claims. */
window.BRIEF = {
  product: 'PostHog',
  url: 'posthog.com',
  brand: { accent: '#1D4AFF', ink: '#151515', logo: null },
  people: ['MK', 'JL', 'AS', 'TR', 'BN', 'EO'],
  channels: [['▥', '#1D4AFF', 'Analytics'], ['▶', '#F54E00', 'Replay'], ['⚑', '#DC9300', 'Flags']],

  hook: { from: '4:46', to: '4:47', suffix: 'pm', notifMeta: 'Product lead · 4:47', notif: 'why are signups down this week??' },
  chaos: {
    l1: 'The answer is', l2: 'everywhere.',
    sources: [['▥', '#1D4AFF'], ['⚠', '#F54E00'], ['✉', '#8A5CF6'], ['#', '#19B36B']],
    messages: ['stuck on step 3?', 'is it the new UI?', 'check the logs', 'can’t reproduce', 'which release?', '14 support tickets', 'rage clicks?', 'mobile only?'],
  },
  pain: { value: 6, unit: 'tools open', pill: '0 answers', complaints: ['which event?', 'no repro', 'Safari?', 'guessing…', 'ETA?', 'still down'] },

  /* SOLUTION 1: product analytics finds the drop-off */
  inbox: {
    l1: 'Spot the', l2: 'drop-off.',
    screenshot: null, click: [0.86, 0.2],
    nav: ['Insights', 'Replays', 'Flags', 'Experiments'],
    title: 'Onboarding funnel', badge: '−38% at step 3',
    items: [['Step 3 · Connect data', 'Drop-off'], ['Step 2 · Invite team', 'Healthy'], ['Step 4 · First chart', 'Healthy'], ['Safari users · 61% of exits', 'Segment'], ['New UI shipped Tuesday', 'Change']],
    tags: { 'Drop-off': ['#FFECEC', '#D63C3C'], Healthy: ['#E8FBF2', '#139B6E'], Segment: ['#EEF3FF', '#1D4AFF'], Change: ['#FFF3E8', '#E0701E'] },
    action: 'Watch replays ▶',
  },
  /* SOLUTION 2: session replays, already sorted */
  sort: {
    l1: 'Every replay,', l2: 'already sorted.', pattern: ['session replay', 'see the why'],
    columns: ['Rage clicks', 'Errors', 'Drop-offs'],
    chips: [['Clicked “Next” 9×', 0], ['TypeError: null', 1], ['Left at step 3', 2], ['Button not responding', 0], ['Upload failed', 1], ['Closed tab at form', 2], ['Spam-clicked save', 0], ['401 on connect', 1], ['Exited after 4 s', 2]],
  },
  /* SOLUTION 3: ship the fix behind a flag, measure it */
  morph: { l1: 'Test it.', l2: 'Ship it.', title: 'Experiment · Onboarding v2', panelTitle: 'Onboarding v2',
    meta: [['Flag', 'new-onboarding'], ['Split', '50 / 50'], ['Goal', 'Signup completed']], button: 'Roll out', done: 'Rolled out ✓' },

  monitor: { title: 'Signups completed', value: 4820, words: ['Analytics', 'Replay', 'Experiments'], l1: 'Find it.', l2: 'Fix it.' },
  proof: {
    pre: 'See what ', accent: 'actually worked.',
    panel: 'Experiment · Onboarding v2', period: 'Last 14 days',
    m1: { label: 'Signups completed', to: 4820 },
    m2: { label: 'Time to activate', from: 42, to: 18, unit: ' min' },
    bars: [40, 46, 44, 58, 90, 124, 150],
    left: { label: 'Win probability', to: 97, suffix: '%' },
    right: { label: 'Conversion lift', to: 12.4, suffix: '%', stars: false },
    quote: 'Variant B rolled out ✓',
  },
  cta: { tagline: ['Find it, fix it, ', 'prove it.'], primary: 'Try PostHog →', secondary: 'See the docs' },
};
