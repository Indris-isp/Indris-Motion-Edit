/* SeySpace v2: review fixes. Faster hook, no motion-blur slides: hard cuts, dissolves, mask wipes and an iris.
 * Problem → Cause → Solution → Proof → CTA, ~30.6 s, 16:9, silent. */
const PHOTOS = ['assets/g2.jpg', 'assets/g0.jpg', 'assets/g1.jpg', 'assets/g3.jpg', 'assets/g4.jpg', 'assets/g5.jpg'];
const X = (tin, extra) => Object.assign({ tin, tout: null }, extra || {});
window.TIMELINE = {
  FPS: 30, BPM: 96, STYLE: 'airy', FORMAT: '16:9',
  shots: [
    /* PROBLEM: the evening races by while the messages pile up */
    ['clockHook', 2.0, 1.2, X(null, { label: 'THE SHOOT ENDED AT SIX',
      notes: [['Client · 9:14 pm', 'when will the gallery be ready??'], ['Client · 9:41 pm', 'is the deposit in?'], ['Client · 10:02 pm', 'can we move to Saturday?'], ['Lab · 10:30 pm', 'print order on hold'], ['Client · 11:12 pm', 'contract_v3_FINAL.pdf'], ['Client · 11:47 pm', 'prints please!!']] })],
    ['viewfinder', 2.4, 1.25, X('dissolve', { photo: 'assets/g2.jpg', headline: ['Shoot all day.', 'Admin all night.'],
      items: ['gallery link??', 'is the deposit in?', 'invoice attached', 'prints please!!'] })],
    /* CAUSE */
    ['linked', 3.0, 1.05, X('mask', { headline: ['7 tools.', 'Barely connected.'], fail: 3, error: 'Invoice didn’t sync',
      tools: [['◷', 'Calendar'], ['✉', 'Email'], ['✎', 'Contracts'], ['$', 'Invoices'], ['▦', 'Galleries'], ['⌗', 'Spreadsheet'], ['▢', 'Print lab']],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] })],
    ['note3d', 2.8, 1.05, X(null, { caption: ['Every job,', 'by hand.'],
      items: [{ t: 'send contract v3', strike: true }, { t: 'chase deposit' }, { t: 'upload gallery ??', red: true, circle: true }, { t: 'reply to 14 emails' }] })],
    /* SOLUTION */
    ['focusLogo', 2.4, 1.08, X('iris', { tag: 'ONE STUDIO. ONE PLACE.' })],
    ['splitHero', 2.6, 1.15, X('mask', { headline: ['Book it.', 'Get paid.'], component: 'booking', zoom: 1.3 })],
    ['componentHero', 2.8, 1.25, X('dissolve', { headline: ['Contracts,', 'signed.'], component: 'contract', slideHead: true, zoom: 1.3 })],
    ['photoRing', 3.0, 1.05, X('mask', { headline: ['Deliver galleries', 'clients love.'], photos: PHOTOS, component: 'download' })],
    ['fan', 2.8, 1.2, X(null, { headline: ['Turn galleries', 'into revenue.'], card: 'order', count: 5, spread: 310, rot: 6, drop: 34, stat: 'cart' })],
    /* PROOF: their own claim, on a sample order from their cart */
    ['keep', 3.2, 1.0, X('dissolve', { value: '0%', caption: ['platform commission', 'on paid plans'],
      rows: [['Print sale', '$295.00'], ['SeySpace commission', '$0.00', '#1F6B3A'], ['You keep', '$295.00']] })],
    /* CTA */
    ['flood', 3.6, 1.1, X('dissolve', { button: 'Get Started →' })],
  ],
};
