/* SeySpace: "Your whole studio, in one frame."  Problem → Cause → Solution → Proof → CTA, ~32 s.
 * Dark & glowing for the night of admin (problem, cause); light & airy once the aperture opens (solution, CTA). */
const PHOTOS = ['assets/g2.jpg', 'assets/g0.jpg', 'assets/g1.jpg', 'assets/g3.jpg', 'assets/g4.jpg', 'assets/g5.jpg'];
window.TIMELINE = {
  FPS: 30, BPM: 96,
  STYLE: 'airy',
  FORMAT: '16:9',
  shots: [
    /* PROBLEM: the shoot ended hours ago; the admin hasn't */
    ['kinetic', 2.4, 1.1, { big: '11:48', small: 'pm', label: 'THE SHOOT ENDED AT SIX', glow: 'hi' }],
    ['viewfinder', 3.0, 1.0, { photo: 'assets/g2.jpg', headline: ['Shoot all day.', 'Admin all night.'],
      items: ['gallery link??', 'is the deposit in?', 'can we move to Saturday?', 'contract_v3_FINAL.pdf', 'prints please!!', 'invoice attached'] }],
    /* CAUSE: the studio runs on separate tools, taped together, and every job is done by hand */
    ['tape', 3.2, 1.0, { headline: ['7 tools,', 'duct-taped together.'], peel: 3,
      tools: [['◷', 'Calendar', '#2386D6'], ['✉', 'Email', '#E0701E'], ['✎', 'Contracts', '#7C5CFF'], ['$', 'Invoices', '#19B36B'], ['▦', 'Galleries', '#485949'], ['⌗', 'Spreadsheet', '#1F8A5B'], ['▢', 'Print lab', '#C2412D']],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] }],
    ['scribbles', 2.8, 1.15, { surface: 'sticky', caption: ['Every job,', 'by hand.'], smear: false,
      items: [{ t: 'send contract v3', x: .08, y: .1, size: 70, color: 'black', strike: true }, { t: 'chase deposit', x: .1, y: .3, size: 70, color: 'black' },
              { t: 'upload gallery ??', x: .12, y: .5, size: 70, color: 'red', circle: true }, { t: 'reply to 14 emails', x: .08, y: .7, size: 66, color: 'black' }] }],
    /* SOLUTION: the aperture closes on the mess and opens on SeySpace; every step locks into one frame */
    ['aperture', 2.4, 1.05, { photo: 'assets/g2.jpg' }],
    ['inline', 2.8, 1.2, { before: 'Book', component: 'booking', after: 'it.', line2: 'Get paid.' }],
    ['componentHero', 2.8, 1.25, { headline: ['Contracts,', 'signed.'], component: 'contract' }],
    ['photoRing', 3.0, 1.05, { headline: ['Deliver galleries', 'clients love.'], photos: PHOTOS, component: 'download' }],
    ['fan', 2.8, 1.2, { headline: ['Turn galleries', 'into revenue.'], card: 'order', count: 7, stat: 'cart' }],
    /* PROOF: their own claim */
    ['dotNumber', 3.0, 1.15, { value: '0%', caption: ['platform commission', 'on paid plans'] }],
    /* CTA */
    ['flood', 3.6, 1.1, { button: 'Get Started →' }],
  ],
};
