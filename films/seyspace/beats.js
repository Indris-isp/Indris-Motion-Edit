/* SeySpace — "From booked to delivered". One photographer, one job: The Elegance Collection.
 * The same portrait (g2) opens the film, becomes the booking thumbnail, is opened in the gallery, and closes the film. */
const IMG = 'assets/g2.jpg';
window.BEATS = {
  open: {
    name: 'open', src: 'real', copy: 'Your next shoot starts here.', boards: [2.4],
    note: 'Full-bleed portrait from the job, slow pull-back. Headline rises. Soft shutter sound on the cut.',
    bg: '#141210', drift: 0,
    html: `<img class="full" src="${IMG}" style="object-position:50% 24%" data-zoom="0,3.2,1.14,1.0,50,30"><div class="shade"></div>
      <div class="hd" style="left:120px;top:850px;font-size:112px;color:#F7F4EF" data-in=".5,.9,up">Your next shoot starts here.</div>`,
    htmlV: `<img class="full" src="${IMG}" style="object-position:50% 30%" data-zoom="0,3.2,1.14,1.0,50,30"><div class="shade"></div>
      <div class="hd" style="left:80px;top:1240px;font-size:112px;color:#F7F4EF;white-space:pre" data-in=".5,.9,up">Your next shoot
starts here.</div>`,
    sfx: [[0, 'whoosh_s']],
  },
  book: {
    name: 'book', src: 'illus', copy: 'Book the shoot.', boards: [1.3, 5.9],
    note: 'Match cut: the portrait shrinks into the booking card for a sample session. Details stagger in, cursor confirms, status flips to Confirmed, the real client-portal invoice ($1,800 + $650 = $2,450) rises.',
    bg: 'light', len: 7, hero: 4.6,
    cam: [[0, 1, .5, .5], [4.4, 1, .5, .5], [6.9, 1.05, .62, .55]],
    cursor: [[2.6, [.72, 1.05]], [3.9, '#cb', true]],
    html: `<div class="hd" style="left:130px;top:200px;font-size:140px" data-in=".9,.8,up">Book the shoot.</div>
      <div class="cap" style="left:136px;top:365px" data-in="1.2,.7,up">Sample session · The Elegance Collection</div>
      <div class="dev" style="left:150px;top:470px;width:360px" data-in="4.6,.8,rise" data-ring="5.6,.6"><img src="assets/invoice_phone.png" style="border-radius:34px 34px 0 0"></div>
      <div class="card" style="left:990px;top:110px;width:800px;height:860px" data-in=".5,.5,fade">
        <div style="position:absolute;left:32px;right:32px;top:400px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px" data-in="1.25,.5,up">
            <div style="font:600 32px Inter">The Elegance Collection</div>
            <div data-swap="4.15,.6"><span class="chip sa" style="background:#F1EBE2;color:#6E6458">REQUEST</span><span class="chip sb" style="background:#E3F1E7;color:#1F6B3A">CONFIRMED ✓</span></div></div>
          <div class="row" data-in="1.45,.5,up"><span>Date</span><b>Sat, 27 Oct 2025 · 4:00 PM</b></div>
          <div class="row" data-in="1.6,.5,up"><span>Client</span><b>Sample client</b></div>
          <div class="row" data-in="1.75,.5,up"><span>Session fee</span><b>$1,800</b></div>
          <div class="row" data-in="1.9,.5,up"><span>Retouching</span><b>$650</b></div>
          <div style="margin-top:24px" data-in="2.1,.5,up"><span id="cb" class="btn1" data-swap="4.1,.5"><span class="sa">Confirm booking</span><span class="sb">Booked ✓</span></span></div>
        </div></div>
      <div class="ph" style="left:0;top:0;width:1920px;height:1080px;border-radius:0;z-index:5" data-fly=".05,1.05,1022,142,736,340,14"><img src="${IMG}" style="object-position:50% 24%"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:250px;font-size:128px" data-in=".9,.8,up">Book the shoot.</div>
      <div class="cap" style="left:84px;top:400px;font-size:20px" data-in="1.2,.7,up">Sample session · The Elegance Collection</div>
      <div class="card" style="left:60px;top:470px;width:960px;height:1010px" data-in=".5,.5,fade">
        <div style="position:absolute;left:34px;right:34px;top:440px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px" data-in="1.25,.5,up">
            <div style="font:600 32px Inter">The Elegance Collection</div>
            <div data-swap="4.15,.6"><span class="chip sa" style="background:#F1EBE2;color:#6E6458">REQUEST</span><span class="chip sb" style="background:#E3F1E7;color:#1F6B3A">CONFIRMED ✓</span></div></div>
          <div class="row" data-in="1.45,.5,up"><span>Date</span><b>Sat, 27 Oct 2025 · 4:00 PM</b></div>
          <div class="row" data-in="1.6,.5,up"><span>Client</span><b>Sample client</b></div>
          <div class="row" data-in="1.75,.5,up"><span>Session fee</span><b>$1,800</b></div>
          <div class="row" data-in="1.9,.5,up"><span>Retouching</span><b>$650</b></div>
          <div style="margin-top:24px" data-in="2.1,.5,up"><span id="cb" class="btn1" data-swap="4.1,.5"><span class="sa">Confirm booking</span><span class="sb">Booked ✓</span></span></div>
        </div></div>
      <div class="dev" style="left:640px;top:1250px;width:380px;z-index:6" data-in="4.6,.8,rise" data-ring="5.6,.6"><img src="assets/invoice_phone.png" style="border-radius:34px 34px 0 0"></div>
      <div class="ph" style="left:0;top:0;width:1080px;height:1920px;border-radius:0;z-index:5" data-fly=".05,1.05,94,504,892,400,14"><img src="${IMG}" style="object-position:50% 24%"></div>`,
    sfx: [[0, 'whoosh_s'], [1.45, 'pops4'], [3.9, 'click'], [4.15, 'pop'], [4.6, 'whoosh_s']],
  },
  deliver: {
    name: 'deliver', src: 'real', copy: 'Deliver the gallery.', boards: [1.6, 3.6],
    note: 'Real SeySpace client gallery for the same job (The Elegance Collection, Secure Download panel). Device rises, cursor opens VIEW GALLERY, camera pushes in.',
    bg: 'light', len: 4, hero: 2.0,
    cam: [[0, 1, .5, .5], [2.4, 1, .646, .564], [4, 1.2, .646, .564]],
    cursor: [[1.4, [.8, 1.05]], [2.6, [.646, .566], true]],
    camV: [[0, 1, .5, .5], [2.4, 1, .5, .5], [4, 1.15, .5, .5]], cursorV: [[1.4, [.8, 1.05]], [2.6, [.5, .5], true]],
    html: `<div class="hd" style="left:120px;top:230px;font-size:120px;white-space:pre" data-in=".3,.8,up" data-out="2.3,.4">Deliver
the gallery.</div>
      <div class="dev" style="left:640px;top:200px;width:1200px" data-in=".1,.9,rise"><img src="assets/gal_digital_delivery_dev.png"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px;font-size:120px;white-space:pre" data-in=".3,.8,up" data-out="2.3,.4">Deliver
the gallery.</div>
      <div class="dev" style="left:40px;top:640px;width:1000px" data-in=".1,.9,rise"><img src="assets/gal_digital_delivery_dev.png"></div>`,
    sfx: [[.1, 'whoosh'], [2.6, 'click']],
  },
  photo: {
    name: 'photo', src: 'illus', copy: '(Deliver the gallery.)', boards: [.6, 3.6],
    note: 'Inside the gallery: the job\'s photos (from seyspace.com) in their gallery layout. Cursor opens the portrait; it expands to the lightbox with the gallery dimmed around it; client marks it a favourite.',
    bg: '#FFFFFF', len: 5.5, hero: 3.6,
    cursor: [[.6, [.62, .95]], [1.4, '#g2', true]],
    html: `<div class="galhd" style="left:120px;top:60px">THE ELEGANCE COLLECTION</div><div class="galhd" style="left:1560px;top:60px;color:#8A847B;font-weight:500">6 photos</div>
      <div class="ph" style="left:120px;top:120px;width:400px;height:540px" data-in="0,.4,fade"><img src="assets/g0.jpg"></div>
      <div class="ph" style="left:540px;top:120px;width:400px;height:540px" data-in=".06,.4,fade"><img src="assets/g1.jpg"></div>
      <div class="ph" style="left:1380px;top:120px;width:400px;height:540px" data-in=".18,.4,fade"><img src="assets/g3.jpg"></div>
      <div class="ph" style="left:120px;top:680px;width:820px;height:400px" data-in=".24,.4,fade"><img src="assets/g4.jpg"></div>
      <div class="ph" style="left:960px;top:680px;width:820px;height:400px" data-in=".3,.4,fade"><img src="assets/g5.jpg"></div>
      <div style="position:absolute;inset:0;background:rgba(20,18,16,.88);z-index:5" data-in="1.55,.5,fade"></div>
      <div id="g2" class="ph" style="left:960px;top:120px;width:400px;height:540px;z-index:6" data-in=".12,.4,fade" data-fly="1.55,2.45,624,60,672,900,4"><img src="${IMG}"></div>
      <div class="cap" style="left:624px;top:990px;color:#E4DDD2;z-index:7" data-in="2.6,.6,up">Editorial Bridal Portrait · 3 of 6</div>
      <div class="chip" style="position:absolute;left:1316px;top:84px;background:#F7F4EF;color:#20201E;z-index:7;font-size:20px" data-in="3.3,.5,pop">♥ Client favourite</div>`,
    htmlV: `<div class="galhd" style="left:60px;top:250px">THE ELEGANCE COLLECTION</div>
      <div class="ph" style="left:60px;top:310px;width:470px;height:630px" data-in="0,.4,fade"><img src="assets/g0.jpg"></div>
      <div class="ph" style="left:550px;top:310px;width:470px;height:630px" data-in=".06,.4,fade"><img src="assets/g1.jpg"></div>
      <div class="ph" style="left:550px;top:960px;width:470px;height:630px" data-in=".18,.4,fade"><img src="assets/g3.jpg"></div>
      <div class="ph" style="left:60px;top:1610px;width:960px;height:310px" data-in=".24,.4,fade"><img src="assets/g4.jpg"></div>
      <div style="position:absolute;inset:0;background:rgba(20,18,16,.88);z-index:5" data-in="1.55,.5,fade"></div>
      <div id="g2" class="ph" style="left:60px;top:960px;width:470px;height:630px;z-index:6" data-in=".12,.4,fade" data-fly="1.55,2.45,90,300,900,1205,4"><img src="${IMG}"></div>
      <div class="cap" style="left:90px;top:1540px;color:#E4DDD2;z-index:7;font-size:20px" data-in="2.6,.6,up">Editorial Bridal Portrait · 3 of 6</div>
      <div class="chip" style="position:absolute;left:700px;top:330px;background:#F7F4EF;color:#20201E;z-index:7;font-size:20px" data-in="3.3,.5,pop">♥ Client favourite</div>`,
    sfx: [[1.4, 'click'], [1.55, 'whoosh_s'], [3.3, 'pop']],
  },
  prints: {
    name: 'prints', src: 'real', copy: 'Sell the prints.', boards: [1.8, 4.0],
    note: 'Real SeySpace gallery cart for the same collection: 8 × 10 Fine Art Print, $45.00. Camera pushes onto the print line, annotation ring, cursor heads to Proceed to Checkout.',
    bg: 'light', len: 6, hero: 3.0,
    cam: [[0, 1, .5, .5], [2.2, 1, .5, .5], [3.2, 1.25, .79, .34], [4.4, 1.25, .79, .34], [5.4, 1.0, .5, .5]],
    cursor: [[4.4, [.95, 1.05]], [5.4, [.843, .9], true]],
    camV: [[0, 1, .5, .5], [2.2, 1, .5, .5], [3.2, 1.3, .76, .4], [4.4, 1.3, .76, .4], [5.4, 1.0, .5, .5]], cursorV: [[4.4, [.95, 1.05]], [5.4, [.786, .643], true]],
    html: `<div class="hd" style="left:120px;top:230px;font-size:120px;white-space:pre" data-in=".3,.8,up" data-out="2.1,.4">Sell
the prints.</div>
      <div class="cap" style="left:126px;top:500px" data-in=".7,.7,up" data-out="2.1,.4">8 × 10 fine art print</div>
      <div class="dev" style="left:600px;top:170px;width:1260px" data-in=".05,.9,rise"><img src="assets/gal_sell_photos_dev.png"></div>
      <div style="position:absolute;left:1424px;top:306px;width:332px;height:132px;border-radius:14px" data-ring="3.1,.6"></div>`,
    htmlV: `<div class="hd" style="left:80px;top:260px;font-size:120px;white-space:pre" data-in=".3,.8,up" data-out="2.1,.4">Sell
the prints.</div>
      <div class="cap" style="left:84px;top:530px;font-size:20px" data-in=".7,.7,up" data-out="2.1,.4">8 × 10 fine art print</div>
      <div class="dev" style="left:40px;top:640px;width:1000px" data-in=".05,.9,rise"><img src="assets/gal_sell_photos_dev.png"></div>`,
    sfx: [[.05, 'whoosh'], [3.1, 'pop'], [5.4, 'click']],
  },
  end: {
    name: 'end', src: 'brand', copy: 'Run your studio in one place.', boards: [2.8],
    note: 'Back to the opening portrait, darkened. SeySpace logo with generous clear space, line below.',
    bg: '#141210', len: 4, hero: 2.8, drift: .02,
    html: `<img class="full" src="${IMG}" style="object-position:50% 24%;filter:blur(3px) brightness(.42)" data-zoom="0,4,1.06,1.0,50,40">
      <div class="ctr" style="left:960px;top:470px" data-in=".3,.9,blur"><img src="assets/logo-white.png" style="height:96px;display:block"></div>
      <div class="hd ctr" style="left:960px;top:640px;font-size:76px;color:#F7F4EF" data-in="1.0,.8,up">Run your studio in one place.</div>`,
    htmlV: `<img class="full" src="${IMG}" style="object-position:50% 24%;filter:blur(3px) brightness(.42)" data-zoom="0,4,1.06,1.0,50,40">
      <div class="ctr" style="left:540px;top:860px" data-in=".3,.9,blur"><img src="assets/logo-white.png" style="height:84px;display:block"></div>
      <div class="hd ctr" style="left:540px;top:1060px;font-size:84px;color:#F7F4EF;white-space:pre;text-align:center" data-in="1.0,.8,up">Run your studio
in one place.</div>`,
    sfx: [[0, 'whoosh_s'], [.3, 'shimmer']],
  },
};
