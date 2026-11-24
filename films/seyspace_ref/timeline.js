/* SeySpace, reference-led (user's Pinterest reference): one glowing green world, slow continuous motion,
 * thin letter-by-letter type, glass cards, tilted screen, orbit, ring reveal, product on a table, network, final screen. 16:9. */
window.TIMELINE = {
  FPS: 30, BPM: 86, STYLE: 'airy', FORMAT: '16:9',
  shots: [
    ['logoBloom', 2.40, 1.75],
    ['lineToPill', 2.84, 1.75, { line: 'All-in-one photography business platform', pill: 'One Studio' }],
    ['glassCards', 3.09, 1.75, { pill: 'One Studio' }],
    ['tiltScreen', 3.02, 1.75, { tin: 'dissolve', component: 'galleries', words: ['Every', 'Gallery'] }],
    ['orbit', 3.29, 1.75, { tin: 'dissolve', text: 'Everything Connected', items: ['Smart Booking', 'Contracts', 'Client Galleries', 'Digital Store', 'Studio CRM', 'Lightroom'] }],
    ['ringWord', 1.84, 1.75, { text: 'Prints that Sell' }],
    ['printStage', 3.09, 1.75, { text: 'Prints that Sell', cards: [['Order #4471', 'Fine Art Print', '8 × 10 · $45.00', 'Paid'], ['Order #4472', 'Full Digital Collection', '$250.00', 'Paid'], ['Your cart', 'Total $295.00', '2 items', 'Checkout']] }],
    ['network', 2.77, 1.75, { tin: 'dissolve', words: ['Grow Your', 'Studio'] }],
    ['finalScreen', 2.89, 1.75, { tin: 'dissolve', title: 'Run Your Studio', component: 'dash' }],
    ['endMark', 2.06, 1.75, { tin: 'dissolve', line: 'Everything you need to run your studio.' }],
  ],
};
