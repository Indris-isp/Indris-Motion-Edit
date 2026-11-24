/* STYLE LIBRARY — the motion/visual language of the film. The BRAND (brief.js) supplies colours,
 * fonts, logo and UI; the STYLE decides how scenes look and move with them.
 * Pick with TIMELINE.STYLE (or ?style=). Each style was learned from a reference film; add new ones
 * the same way (see references/styles.md).
 *
 * bg.{light,dark,accent}: CSS backgrounds for the three scene kinds (may use brand vars)
 * device: default frame for product screens: 'monitor' | 'laptop' | 'browser' | 'phone' | 'none'
 * card:   'solid' | 'glass' | 'outline'      texture: 'blobs' | 'grain' | 'rays' | 'none'
 * head:   headline weight / tracking         turn: which shot opens the solution ('turn' | 'turnInk' | 'turnGlow')
 * shots:  a default scene list (new_project.py writes it into timeline.js). It is only a starting point:
 *         write the concept and choose moves for it (references/concepts.md, creative-moves.md).
 */
window.STYLES = {
  /* Ref A (office-booking film): white, airy, soft accent blobs, glass cards, star-field turn, laptop */
  airy: {
    name: 'Airy Light',
    bg: { light: 'linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%)',
          dark: 'radial-gradient(ellipse at 50% 50%,var(--night1) 0%,var(--night2) 55%,#020611 100%)',
          accent: 'radial-gradient(ellipse at 50% 30%,var(--acc2) 0%,var(--acc) 45%,var(--acc3) 100%)' },
    device: 'laptop', card: 'solid', texture: 'blobs', head: { weight: 600, track: '-.045em' }, turn: 'turn', bpm: 128,
    shots: [["kinetic", 1.8, 1.3], ["crowd", 2.2, 1.3], ["turn", 2.0, 1.25], ["inline", 2.6, 1.3], ["componentHero", 2.8, 1.25], ["fan", 2.6, 1.25], ["dotNumber", 2.2, 1.3], ["flood", 3.0, 1.15]],
  },
  /* Black/white editorial brands (e.g. Ghost): ink on paper, grain, hard cuts, no blobs, flat screenshots */
  editorial: {
    name: 'Editorial Contrast',
    bg: { light: 'var(--bg)', dark: 'var(--dark)', accent: 'var(--dark)' },
    device: 'none', card: 'solid', texture: 'grain', head: { weight: 800, track: '-.045em' }, turn: 'turnInk', bpm: 112,
    shots: [["dial", 2.4, 1.3], ["funnel", 2.4, 1.25], ["turnInk", 1.8, 1.2], ["componentHero", 3.0, 1.25], ["fan", 2.8, 1.25], ["statLine", 2.6, 1.25], ["flood", 3.0, 1.15]],
  },
  /* Ref C (no-code agent film): midnight blue→violet gradients, monitor with floating ✦ keywords,
     split words, frame-in-frame zoom-out into a glass card, UI that builds itself, lavender light scenes */
  midnight: {
    name: 'Midnight Gradient',
    bg: { light: 'radial-gradient(ellipse 60% 60% at 12% 8%,rgba(var(--acc2RGB),.28) 0%,rgba(var(--acc2RGB),0) 60%),radial-gradient(ellipse 70% 60% at 90% 92%,rgba(var(--accRGB),.3) 0%,rgba(var(--accRGB),0) 60%),linear-gradient(160deg,var(--tint) 0%,#fff 55%,var(--tint) 100%)',
          dark: 'radial-gradient(ellipse 80% 70% at 75% 110%,var(--gradB) 0%,rgba(0,0,0,0) 60%),radial-gradient(ellipse 70% 80% at 8% 0%,var(--gradA) 0%,rgba(0,0,0,0) 60%),linear-gradient(160deg,var(--night2) 0%,var(--night1) 100%)',
          accent: 'linear-gradient(135deg,var(--gradA),var(--gradB))' },
    device: 'monitor', card: 'glass', texture: 'none', head: { weight: 700, track: '-.03em' }, turn: 'turnGlow', bpm: 120,
    shots: [["kinetic", 1.8, 1.3], ["scribbles", 2.6, 1.25], ["crowd", 2.2, 1.3], ["strokesLogo", 2.0, 1.2], ["inline", 2.6, 1.3], ["podium", 2.4, 1.3], ["monitorWords", 2.2, 1.25], ["chartSet", 2.6, 1.3], ["dotNumber", 2.2, 1.3], ["flood", 3.0, 1.15]],
  },
  /* Ref B (Mac assistant teaser): calm grey, thin type, words fade one by one, object → device → world dives */
  cinematic: {
    name: 'Cinematic Device',
    bg: { light: 'linear-gradient(180deg,#efefef,#e6e6e6)', dark: '#000', accent: 'linear-gradient(160deg,var(--acc2),var(--acc3))' },
    device: 'laptop', card: 'glass', texture: 'none', head: { weight: 500, track: '-.02em' }, turn: 'turnInk', bpm: 96,
    shots: [["kinetic", 2.0, 1.2], ["dial", 2.4, 1.2], ["turnInk", 2.0, 1.1], ["componentHero", 3.0, 1.2], ["inline", 2.6, 1.2], ["statLine", 2.6, 1.2], ["flood", 3.2, 1.1]],
  },
};
