// Every number, line of copy and color the client might revise lives here.
export const FPS = 60;
export const TOTAL = 1800; // 30.0 s

export const C = {
  teal: '#0F7C86',
  teal2: '#16A6AE',
  cyan: '#3FE0E8',
  navy: '#0B1220',
  ink: '#111827',
  mut: '#6B7280',
  line: '#E5E7EB',
  green: '#16A34A',
  tealSoft: '#E6F6F7',
  nightText: '#A9B6C6',
};

export const TEAL_GRAD = 'linear-gradient(180deg,#5EEAF0 0%,#16A6AE 55%,#0F7C86 100%)';

// Scene timing (frames). Must add up to TOTAL; checked in Root.tsx.
export const SCENES = [
  {id: 'hook', from: 0, dur: 210},
  {id: 'problem', from: 210, dur: 210},
  {id: 'reveal', from: 420, dur: 150},
  {id: 'doors', from: 570, dur: 180},
  {id: 'chat', from: 750, dur: 360},
  {id: 'booked', from: 1110, dur: 270},
  {id: 'always', from: 1380, dur: 120},
  {id: 'offer', from: 1500, dur: 120},
  {id: 'cta', from: 1620, dur: 180},
] as const;

export const COPY = {
  hook: {
    time: '11:52 PM.',
    head: 'A new lead|just texted you.',
    from: '+1 (512) 555-0148',
    msg: 'Hi, need 3 warehouse temps by Monday. Can someone call me?',
  },
  problem: {
    head: 'You saw it|at 9:14 AM.',
    delayMinutes: 562, // 9h 22m
    label: 'to first reply',
    sub1: "They'd already booked",
    sub2: 'someone who answered.',
  },
  reveal: {meet: 'Meet', name: 'SurFox AI', sub: 'The AI that answers every lead the moment they reach out.'},
  doors: {
    head: 'Same AI.|Three doors.',
    cards: [
      {k: 'SMS', line: 'They text.'},
      {k: 'WEBSITE CHAT', line: 'They chat on your site.'},
      {k: 'VOICE', line: 'They call your number.'},
    ],
    chip: 'Answered',
    foot: ['SurFox answers', 'in seconds.'],
  },
  chat: {
    head: 'It talks like|your best rep.',
    statLabel: 'FIRST REPLY',
    statValue: 4, // seconds
    statCaption: 'Not 9 hours.',
    name: 'James K.',
    role: 'Operations Manager · Metro Logistics',
    msgs: [
      'Hi James! Thanks for reaching out. Still looking to fill those warehouse roles?',
      'Yeah we need 3 by next Monday',
      'Got it. What shift and pay range are you working with?',
      '6am–2pm, $18–20/hr',
    ],
    tags: ['CAPTURES URGENCY', 'QUALIFIES REQUIREMENT'],
  },
  booked: {
    head: 'Qualified|before you wake up.',
    status: 'Hot · qualified',
    fields: [
      ['URGENCY', 'By Monday'],
      ['HEADCOUNT', '3 associates'],
      ['PAY', '$18–20/hr'],
    ],
    qualifySeconds: 243, // 4m 3s
    title: 'Call booked',
    time: '4:00 PM',
    handoff: 'Handed off to your team',
    hero: 'Cold leads become|calendar holds,|without the chase.',
  },
  always: {
    time: '3:12 AM',
    asleep: "Your team's asleep.",
    awake: "SurFox isn't.",
    rows: [
      ['Website chat · Dana R.', 'replied'],
      ['Call · (469) 555-0182', 'answered'],
      ['SMS · Marco T.', 'booked'],
    ],
    label: 'RUNS 24/7',
  },
  offer: {chip: 'LIMITED PRICING', pre: 'Plans starting at', price: 49, per: '/month', line: 'Less than one missed lead.'},
  cta: {name: 'SurFox AI', tag: 'Answer every lead. Book more calls.', button: 'Try it free in minutes', url: 'getsurfox.com'},
};
