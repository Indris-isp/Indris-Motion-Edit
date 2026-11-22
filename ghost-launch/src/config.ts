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

export const COLORS = {
  bg: "#15171A",
  bg2: "#1C1F23",
  panel: "#212429",
  panel2: "#2A2E34",
  line: "#363A41",
  ink: "#F4F4F2",
  mute: "#8B8F96",
  faint: "#5A5E66",
  pink: "#FF3D7F",
  pinkDeep: "#E8175D",
  green: "#30CF43",
};

export const FONTS = {
  sans: "'Inter', sans-serif",
  serif: "'Instrument Serif', serif",
};

export const COPY = {
  hook: { l1: ["Your", "audience."], l2: ["Their", "algorithm."], accent: "algorithm.", reachFrom: 100, reachTo: 6 },
  problem: {
    tools: ["Website", "Members", "Email", "Payments", "Analytics"],
    line: ["Five", "tools.", "Five", "bills.", "A cut", "of every", "sale."],
    accent: "A cut",
    revenue: 1000,
    feePct: 10,
  },
  fix: {
    postTitle: "The future of local news",
    button: "Publish & send",
    channels: ["Website", "Newsletter", "Members", "Social web"],
    line: ["One", "place.", "Ghost."],
    accent: "Ghost.",
  },
  payoff: {
    members: 2480,
    revenue: 1000,
    line: ["Your", "audience.", "Your", "revenue."],
    accent: "revenue.",
    feeNote: "0% platform fees",
  },
  cta: {
    tagline: "Independent technology for modern publishing",
    button: "Start your free trial",
    url: "ghost.org",
  },
};
