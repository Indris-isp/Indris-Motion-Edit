/* SilentRoom — 32 s */
window.TIMELINE = {
  FPS: 30, BPM: 76, STYLE: 'story', FORMAT: '16:9',
  shots: [
    ['beat', 5.0, 1.0, { d: BEATS.desk }],
    ['beat', 8.0, 1.0, { d: BEATS.room }],
    ['beat', 12.0, 1.0, { d: BEATS.shape }],
    ['beat', 4.5, 1.0, { d: BEATS.passage, tin: 'fade' }],
    ['beat', 2.5, 1.0, { d: BEATS.end, tin: 'fade' }],
  ],
};
