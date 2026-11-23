/* Veryfi Thinking Mode — 30 s */
window.TIMELINE = {
  FPS: 30, BPM: 90, STYLE: 'story', FORMAT: '16:9',
  shots: [
    ['beat', 4.0, 1.0, { d: BEATS.mismatch }],
    ['beat', 9.0, 1.0, { d: BEATS.check }],
    ['beat', 11.0, 1.0, { d: BEATS.thinking, tin: 'fade' }],
    ['beat', 3.5, 1.0, { d: BEATS.match, tin: 'fade' }],
    ['beat', 2.5, 1.0, { d: BEATS.end, tin: 'fade' }],
  ],
};
