// All client-facing copy, numbers and colors live here so revisions are one-line changes.
export const FPS = 60;
export const W = 1920;
export const H = 1080;

// Scene lengths in frames. Must sum to 1800 (30.0 s).
export const SCENES = {
  hook: 240,
  problem: 420,
  fix: 480,
  payoff: 360,
  cta: 300,
} as const;
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
