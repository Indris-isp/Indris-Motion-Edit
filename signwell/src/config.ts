// Every client-facing value lives here: colors, fonts, copy, numbers.
// Swap in SignWell's brand guide values when they arrive.
// Light look (Officely-style reference): airy white ground, soft blue glows, ink type, one blue accent.
export const LIGHT = {
  bg: '#f6f8fe',
  bgDeep: '#e8eefc',
  ink: '#0f1729',
  ink2: '#5b6479',
  accent: '#2b59e8',
  accentSoft: 'rgba(43,89,232,.10)',
  glow: 'rgba(79,124,255,.42)',
  pain: '#2b59e8', // was orange; client wants blue throughout
  cardShadow: '0 28px 60px rgba(43,89,232,.22), 0 4px 12px rgba(43,89,232,.14), 0 0 46px rgba(79,124,255,.30)', // blue drop shadow + glow
  glowStrong: '0 34px 80px rgba(43,89,232,.32), 0 6px 16px rgba(43,89,232,.20), 0 0 70px rgba(79,124,255,.45)',
  cardBorder: '1px solid #e4e9f5',
  glass: 'rgba(255,255,255,.72)',
};

export const COLORS = {
  navy: '#0a1330',
  navy2: '#142356',
  blue: '#2b59e8',
  blueDeep: '#1c3fb8',
  blueSoft: '#e4ebfd',
  ink: '#141b2d',
  ink2: '#5a6478',
  paper: '#ffffff',
  canvas: '#eef1f7',
  line: '#dfe3ec',
  green: '#1e9e64',
  greenSoft: '#e1f4ea',
  amber: '#f0a04b',
  magenta: '#c2409f',
  magentaSoft: '#f8e3f2',
  white: '#ffffff',
};

// Type guideline (client): Inter everywhere.
export const TYPE = {
  heading: 700,     // main headings
  subheading: 600,  // subheadings
  body: 400,        // body text
  button: 600,      // buttons and navigation (500–600)
};

export const COPY = {
  s1: {
    emails: [
      {from: 'Maya Ortiz', subject: 'Contract attached', meta: 'Mon'},
      {from: 'Maya Ortiz', subject: 'Just following up', meta: 'Wed'},
      {from: 'Maya Ortiz', subject: 'Re: Re: Any update?', meta: 'Fri'},
      {from: 'Maya Ortiz', subject: 'Re: Re: Re: Signed yet?', meta: 'Sun'},
    ],
    counterLabel: 'Waiting',
    counterTo: 6,
    counterUnit: 'days',
    headline: 'Still waiting on a signature?',
  },
  s2: {
    steps: ['Print', 'Sign', 'Scan', 'Email'],
    delays: ['+1 day', '+1 day', '+2 days', '+2 days'],
    headline: ['Print.', 'Sign.', 'Scan.', 'Repeat.'],
  },
  s3: {
    product: 'SignWell',
    docName: 'Studio_Agreement.pdf',
    docTitle: 'Studio Agreement',
    recipient: 'Jordan Lee',
    sender: 'Maya Ortiz',
    fields: ['Signature', 'Initials', 'Date signed', 'Text'],
    send: 'Send',
    toast: 'Sent to Jordan Lee',
    headline: ['Place', 'it.', 'Send', 'it.'],
  },
  s4: {
    counterLabel: 'Time to signed',
    fromMinutes: 6 * 24 * 60,
    toMinutes: 4,
    headline: ['Signed.', 'Before', 'lunch.'],
  },
  s5: {
    wordmark: 'SignWell',
    tagline: 'Electronic signatures made easy.',
    cta: 'Start free',
    url: 'signwell.com',
  },
};
