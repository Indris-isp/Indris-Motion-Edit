/* DocsAlot: "Every answer, with its source."  Problem → Cause → Solution → Proof → CTA (16:9). */
window.TIMELINE = {
  FPS: 30, BPM: 108, STYLE: 'airy', FORMAT: '16:9',
  shots: [
    /* PROBLEM: the same question, again and again */
    ['crowd', 3.0, 1.05, { count: 40, questions: ['How do I configure auth?', 'how to set up auth??', 'auth not working', 'bearer token?', 'where is the API key?', 'auth docs?'], center: ['Same question.', 'Again.'] }],
    ['kinetic', 2.4, 1.1, { big: '#support', label: 'STILL ANSWERING THIS BY HAND', glow: 'acc' }],
    /* CAUSE: the answer is in the docs; nobody finds it in time */
    ['funnel', 3.0, 1.1, { headline: ['The answer is in the docs.', 'Nobody finds it.'], gate: 'SEARCH', count: 1300, pass: 10 }],
    /* SOLUTION */
    ['strokesLogo', 2.4, 1.05, { word: 'DocsAlot' }],
    ['componentHero', 2.8, 1.25, { headline: ['Ask in Slack.', 'Get an answer.'], component: 'thread' }],
    ['inline', 2.8, 1.2, { before: 'Every', component: 'source', after: 'answer', line2: 'with a source.' }],
    ['splitWords', 2.4, 1.15, { left: 'Asked.', right: 'Cited.', component: 'thread' }],
    ['redline', 3.0, 1.05, { before: 'Can we rotate API keys', wrong: '?', right: '⚑', after: '', stamp: 'NOT IN THE DOCS', note: 'Docs gap flagged for your team' }],
    /* PROOF (no public numbers: the channels it already lives in) */
    ['monitorWords', 2.6, 1.15, { component: 'source', items: ['Slack', 'Discord', 'Your docs'] }],
    /* CTA */
    ['flood', 3.4, 1.1, { button: 'Create your docs →' }],
  ],
};
/* 30–40 s: stretch every beat by 1.12 (more seconds, same motion) */
TIMELINE.shots = TIMELINE.shots.map(r => [r[0], +(r[1] * 1.12).toFixed(2), +(r[2] / 1.12).toFixed(3), r[3]]);
