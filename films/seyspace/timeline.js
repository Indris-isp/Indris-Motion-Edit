/* SeySpace — 30 s. Rows: ['beat', secondsOnScreen, speed, { d: BEATS.x, tin, tout }] */
window.TIMELINE = {
  FPS: 30, BPM: 72, MUSIC: 'calm', STYLE: 'story', FORMAT: '16:9',
  shots: [
    ['beat', 3.4, 1.0, { d: BEATS.open }],
    ['beat', 6.6, 1.06, { d: BEATS.book }],
    ['beat', 4.2, 1.0, { d: BEATS.deliver, tin: 'fade' }],
    ['beat', 5.8, 0.95, { d: BEATS.photo }],
    ['beat', 6.0, 1.0, { d: BEATS.prints, tin: 'fade' }],
    ['beat', 4.0, 1.0, { d: BEATS.end, tin: 'fade' }],
  ],
};
