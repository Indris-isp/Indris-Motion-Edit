import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts ship with the project (public/fonts) and must be ready before frame 0 renders.
// A fallback font in a frame is a bug.
export const DISPLAY = 'SW Inter, Arial, sans-serif'; // headings use Inter 700 per the type guideline
export const BODY = 'SW Inter, Arial, sans-serif';
export const HAND = 'SW Caveat, cursive';

const faces: [string, string, string][] = [
  ['SW Inter', '400', 'inter-400'], ['SW Inter', '500', 'inter-500'], ['SW Inter', '600', 'inter-600'], ['SW Inter', '700', 'inter-700'],
  ['SW Caveat', '600', 'caveat-600'],
];

if (typeof document !== 'undefined' && !(window as any).__swFonts) {
  (window as any).__swFonts = true;
  const handle = delayRender('Loading fonts');
  Promise.all(faces.map(([family, weight, file]) => {
    const face = new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)}) format('woff2')`, {weight});
    document.fonts.add(face);
    return face.load();
  })).then(() => document.fonts.ready).then(() => continueRender(handle)).catch((e) => { console.error(e); });
}
