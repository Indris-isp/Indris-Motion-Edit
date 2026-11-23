/* Clocknext — 33 s */
window.TIMELINE = {
  FPS: 30, BPM: 96, STYLE: 'story', FORMAT: '16:9',
  shots: [
    ['beat', 4.0, 1.0, { d: BEATS.run }],
    ['beat', 8.0, 1.0, { d: BEATS.meter, tin: 'fade' }],
    ['beat', 9.0, 1.0, { d: BEATS.charge, tin: 'fade' }],
    ['beat', 6.0, 1.0, { d: BEATS.margin, tin: 'fade' }],
    ['beat', 6.0, 0.7, { d: BEATS.end, tin: 'fade' }],
  ],
};
