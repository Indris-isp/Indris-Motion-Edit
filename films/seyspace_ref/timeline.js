/* SeySpace, reference-led (user's Pinterest reference): one glowing green world, slow continuous motion,
 * thin letter-by-letter type, glass cards, tilted screen, orbit, ring reveal, product on a table, network, final screen. 16:9. */
window.TIMELINE = {
  FPS: 30, BPM: 86, STYLE: 'airy', FORMAT: '16:9',
  shots: [
    ['logoBloom',   4.2, 1.0],
    ['lineToPill',  4.6, 1.08, { line: 'All-in-one photography business platform', pill: 'One Studio' }],
    ['glassCards',  5.0, 1.08, { pill: 'One Studio' }],
    ['tiltScreen',  4.8, 1.1, { tin: 'dissolve', component: 'galleries', words: ['Every', 'Gallery'] }],
    ['orbit',       5.0, 1.15, { tin: 'dissolve', text: 'Everything Connected', items: ['Smart Booking', 'Contracts', 'Client Galleries', 'Digital Store', 'Studio CRM', 'Lightroom'] }],
    ['ringWord',    2.8, 1.15, { text: 'Prints that Sell' }],
    ['printStage',  5.0, 1.08, { text: 'Prints that Sell', cards: [['Order #4471', 'Fine Art Print', '8 × 10 · $45.00', 'Paid'], ['Order #4472', 'Full Digital Collection', '$250.00', 'Paid'], ['Your cart', 'Total $295.00', '2 items', 'Checkout']] }],
    ['network',     4.4, 1.1, { tin: 'dissolve', words: ['Grow Your', 'Studio'] }],
    ['finalScreen', 4.6, 1.1, { tin: 'dissolve', title: 'Run Your Studio', component: 'dash' }],
    ['endMark',     3.6, 1.0, { tin: 'dissolve', line: 'Everything you need to run your studio.' }],
  ],
};
