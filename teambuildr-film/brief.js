/* BRIEF: TeamBuildr launch film. Every word, number and colour lives here.
 * Brand sampled from teambuildr.com: orange #FF6A33 → #FF4500, navy #1E212E, Figtree.
 * Claims use TeamBuildr's own site copy. Athlete names / initials and in-app numbers are placeholder data.
 */
window.BRIEF = {
  product: 'TeamBuildr',
  url: 'teambuildr.com',
  brand: {
    accent: '#FF6A33', accentLight: '#FF9A3D', accentDark: '#FF4500',
    ink: '#1E212E', mut: '#6E7487', font: 'Figtree',
    night1: '#2A2E40', night2: '#12141C',          // their navy, for the dark turn
    logo: 'assets/mark.svg',                        // white V mark on the orange-gradient tile
    wordmark: 'assets/wordmark.svg', wordmarkRatio: 6.46,
  },
  people: ['JR', 'MC', 'AD', 'DB', 'KO', 'TP'],     // placeholder athletes
  channels: [['▣', '#FF6A33', 'Mobile app'], ['▤', '#2BBAD6', 'Tablet view'], ['▦', '#7B4BDB', 'Weight Room View']],

  /* PROBLEM: a real moment */
  hook: { from: '5:47', to: '5:48', suffix: 'am', notifMeta: 'Athlete · 5:48', notif: 'coach which sheet is today’s lift??' },
  /* PROBLEM: the chaos */
  chaos: {
    l1: 'Programs are', l2: 'everywhere.',
    sources: [['▦', '#1F7A45'], ['✉', '#2BBAD6'], ['⎙', '#6E7487'], ['#', '#7B4BDB']],
    messages: ['Maxes_FINAL_v3.xlsx', '#REF!', 'printer jammed', 'what’s my 1RM?', 'lost my sheet', 'Wk4_PRINT.xlsx', 'which tab??', 're-type 42 logs'],
  },
  /* PAIN: the problem as a number */
  pain: { value: 14, unit: 'spreadsheets', pill: '+3 this week', complaints: ['which tab?', '#REF!', 'my max?', 'sheet’s wet', 'v3 or v4?', 'did it save?'] },

  /* BENEFIT 1: program builder on the laptop, the hand publishes */
  inbox: {
    l1: 'Program your way.', l2: 'In minutes.',
    screenshot: 'assets/builder.png', click: [0.94, 0.044],
    nav: ['Builder', 'Calendars', 'Athletes', 'Reports'], title: 'Week 4', badge: '42',
    items: [['Lower Body A', 'Lower'], ['Speed + Plyo', 'Speed'], ['Upper Body A', 'Upper'], ['Recovery', 'Recovery'], ['Lower Body B', 'Lower']],
    tags: { Lower: ['#FFF1EA', '#E5541F'], Speed: ['#E6F7FB', '#1E9DB8'], Upper: ['#F1ECFF', '#6A4BE0'], Recovery: ['#E8FBF2', '#139B6E'] },
    action: 'Publish ✓',
  },
  /* BENEFIT 2: one program fans out to every way athletes train */
  reply: { l1: 'Build it once.', l2: 'Every athlete gets it.', message: 'Week 4 · Lower Body A is live', avatar: 'TB' },
  /* BENEFIT 3: the roster lights up as athletes log */
  colorize: { l1: 'Logged in', l2: 'a few clicks.', toggle: 'Weight Room View', pill: '38 / 42 logged today' },
  /* BENEFIT 4 (AMS): headline card morphs into the readiness panel; the coach adjusts */
  morph: { l1: 'Track how', l2: 'they feel.', title: 'AMS · Daily check-in', panelTitle: 'Readiness · Today',
    meta: [['Sleep', '7.5 h'], ['Soreness', 'L hamstring 4/5'], ['Plan', 'Modify sprints']], button: 'Adjust workout', done: 'Adjusted ✓' },
  /* BENEFIT 5 (AMS): circle reveal, the team sorts itself by readiness */
  sort: {
    l1: 'Readiness,', l2: 'sorted.', pattern: ['readiness', 'pain · load · progress'],
    columns: ['Ready', 'Modify', 'Check in'],
    chips: [['J. Rivera · 18/20', 0], ['K. Owens · 13/20', 1], ['A. Diaz · 8/20', 2], ['M. Chen · 17/20', 0], ['T. Patel · 12/20', 1], ['D. Brooks · 19/20', 0], ['S. Lee · 11/20', 1], ['R. Cruz · 9/20', 2], ['L. Grant · 16/20', 0]],
  },
  rack: { request: 'Lower Body A for Varsity', button: 'Publish', done: 'Live ✓', screenshot: null, l1: 'Publish once.', l2: 'Done.' },
  dive: { l1: 'One place', l2: 'for everything.', screenshot: null },

  /* PROOF: coach dashboard (placeholder team data, not a marketing claim) */
  proof: {
    pre: 'See the ', accent: 'full picture.',
    panel: 'Varsity Football', period: 'This week',
    m1: { label: 'Sets logged', to: 3184 },
    m2: { label: 'Completion', from: 61, to: 94, unit: '%' },
    bars: [52, 64, 70, 78, 88, 96, 110],
    left: { label: 'New PRs', to: 12, suffix: '' },
    right: { label: 'Ready today', to: 36, dec: 0, suffix: ' / 42' },
    quote: '“Back Squat 275 → 285”',
  },
  /* PROOF: social (5,500+ and 2012 are from teambuildr.com) */
  social: { l1: 'Trusted by', from: 1200, to: 5500, suffix: '+ coaches & teams',
    logos: ['Colleges', 'Professional', 'High Schools', 'Tactical', 'Gyms & Facilities', 'Colleges', 'Professional', 'High Schools'],
    rating: { text: 'Since 2012', note: 'built by coaches, for coaches' } },
  setup: { from: 10, to: 2, l1: 'minutes', l2: 'to set up' },
  /* CTA (their own copy: "Ditch the spreadsheets. Coach from one place.") */
  cta: { tagline: ['Ditch the spreadsheets. ', 'Coach from one place.'], primary: 'Start free trial', secondary: 'Book a demo' },
};
