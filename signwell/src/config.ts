// Every client-facing value lives here: colors, fonts, copy, numbers.
// Swap in SignWell's brand guide values when they arrive.
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
