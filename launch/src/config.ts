/* Everything a client revision touches lives here: colours, copy, numbers, scene lengths. */
import vo from './vo.json';

export const FPS = 60;
export const TOTAL = 1800; // 30.0 s

export const C = {
  bg: '#0B0B0C',
  bg2: '#151517',
  card: '#18181B',
  card2: '#202024',
  line: 'rgba(255,255,255,0.08)',
  text: '#F5F3F0',
  mut: '#8B8781',
  dim: '#4A4845',
  acc: '#FF821C',
  accHi: '#FFB862',
  accLo: '#E65000',
  red: '#FF4F45',
  green: '#3FD98A',
};

export const FONT = {
  sans: 'Inter, sans-serif',
  serif: "'Instrument Serif', serif",
};

export const COPY = {
  handle: '@isp_agency_',
  brand: 'ISP',
  brandSub: 'AGENCY',
  rawFile: 'RAW_0042.MOV',
  rawLength: '14:32',
  weekViews: 11, // "views this week" in the hook: low on purpose
  postViews: [3, 0, 2, 1, 4, 0, 1], // per post, MON..SUN
  growthPct: 248, // scene 4 growth tile
  views: 128_400, // scene 5 counter
  followers: 12_400,
  cta: 'Book your free strategy call',
  ctaSub: 'Link in bio',
  checklist: ['Editing', 'Captions', 'Branding', 'Posting', 'Growth'],
};

/* Scene lengths come from STORYBOARD.md. `lead` = frames before the first VO line of the scene. */
export const SCENES = [
  { id: 'hook', dur: 240, lead: 24, vo: ['posting', 'nobody'] },
  { id: 'gaps', dur: 276, lead: 12, vo: ['unedited', 'nobrand', 'nostrat'] },
  { id: 'meet', dur: 162, lead: 12, vo: ['meet'] },
  { id: 'services', dur: 330, lead: 12, vo: ['editing', 'branding', 'growth', 'allone'] },
  { id: 'transform', dur: 294, lead: 12, vo: ['turn'] },
  { id: 'record', dur: 168, lead: 12, vo: ['record', 'handle'] },
  { id: 'cta', dur: 330, lead: 12, vo: ['book', 'bio'] },
] as const;

export type VoKey = keyof typeof vo;
type Line = { key: VoKey; from: number; dur: number; local: number };

/* VO placement: each line starts after the previous one plus the script's <break>. */
export const SCENE_FROM: number[] = [];
export const VO: Record<string, Line> = {};
{
  let from = 0;
  for (const s of SCENES) {
    SCENE_FROM.push(from);
    let t = from + s.lead;
    for (const key of s.vo) {
      const v = (vo as Record<string, { dur: number; pause: number }>)[key];
      const dur = Math.ceil(v.dur * FPS);
      VO[key] = { key: key as VoKey, from: t, dur, local: t - from };
      t += dur + Math.round(v.pause * FPS);
    }
    if (t > from + s.dur) throw new Error(`VO overruns scene ${s.id}: ends ${t}, scene ends ${from + s.dur}`);
    from += s.dur;
  }
  if (from !== TOTAL) throw new Error(`Scenes add up to ${from} frames, storyboard says ${TOTAL}`);
}
/** frame (local to its scene) where a VO line starts */
export const cue = (k: VoKey) => VO[k].local;
/** frame (local) where a VO line ends */
export const cueEnd = (k: VoKey) => VO[k].local + VO[k].dur;
