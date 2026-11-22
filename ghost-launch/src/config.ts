// All client-facing copy, numbers and colors live here so revisions are one-line changes.
export const FPS = 60;
export const W = 1920;
export const H = 1080;

// Scene lengths in frames (storyboard v4). Must sum to 2700 (45.0 s).
export const SCENES = {
  hook: 210,
  who: 210,
  reach: 240,
  fees: 240,
  tools: 300,
  meet: 240,
  publish: 240,
  paid: 240,
  dash: 240,
  proof: 180,
  payoff: 180,
  cta: 180,
} as const;
export type SceneKey = keyof typeof SCENES;
/** Global start frame of each scene (for continuous background drift across cuts). */
export const START = (() => {
  let t = 0;
  const o = {} as Record<SceneKey, number>;
  (Object.keys(SCENES) as SceneKey[]).forEach((k) => { o[k] = t; t += SCENES[k]; });
  return o;
})();
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

// Sampled from ghost.org and the Ghost admin dashboard shown there.
export const COLORS = {
  bg: "#15171A", // Ghost --color-base
  bg2: "#191B1F",
  panel: "#1D1F23",
  panel2: "#272A2F",
  line: "#2C2F35",
  ink: "#FFFFFF",
  mute: "#8E9196",
  faint: "#555960",
  pink: "#FF247D", // Ghost --color-pink (charts)
  purple: "#8E42FF", // MRR / subscriptions line
  green: "#30CF43", // growth deltas
  lime: "#D1FF19", // Ghost --color-lime (accents, CTA)
  yellow: "#FFC52E",
  paper: "#FFFFFF",
  paperInk: "#15171A",
  // On the white gradient stage (ghost.org hero: dark ink on white)
  text: "#112220",
  textMute: "#64748B",
};

export const FONTS = {
  sans: "'Inter', sans-serif", // ghost.org uses InterVariable throughout
  serif: "'Source Serif 4', serif", // editor body copy (Georgia-style)
};

export const COPY = {
  hook: { l1: ["Your", "audience."], l2: ["Their", "algorithm."], accent: "algorithm.", accentColor: "pink", reachFrom: 100, reachTo: 6 },
  problem: {
    tools: ["Website", "Members", "Email", "Payments", "Analytics"],
    line: ["Five", "tools.", "Five", "bills.", "A cut", "of every", "sale."],
    accent: "A cut",
    accentColor: "pink",
    revenue: 1000,
    feePct: 10,
  },
  fix: {
    postTitle: "The future of local news",
    button: "Publish & send",
    channels: ["Website", "Newsletter", "Members", "Social web"],
    line: ["One", "place.", "Ghost."],
    accent: "Ghost.",
    accentColor: "purple",
  },
  payoff: {
    members: 2480,
    revenue: 1000,
    line: ["Your", "audience.", "Your", "revenue."],
    accent: "revenue.",
    accentColor: "purple",
    feeNote: "0% platform fees",
  },
  cta: {
    tagline: "Turn your audience into a business.", // ghost.org hero headline
    button: "Start publishing now",
    sub: "Try Ghost free for 14 days · ghost.org",
  },
};
