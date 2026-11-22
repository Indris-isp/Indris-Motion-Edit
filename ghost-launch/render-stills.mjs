// Renders key-frame stills for review: node render-stills.mjs [frame,frame,...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const KEY = { "01_hook": 170, "02_who": 380, "03_reach": 600, "04_fees": 860, "05a_tools": 1050, "05b_tools": 1162, "06a_star": 1262, "06b_meet": 1415, "07a_publish": 1558, "07b_inbox": 1655, "08a_faces": 1785, "08b_keep": 1892, "09a_wall": 1970, "09b_dash": 2135, "10_proof": 2290, "11a_dial": 2415, "11b_payoff": 2505, "12_cta": 2685 };
const arg = process.argv[2];
const frames = arg ? Object.fromEntries(arg.split(",").map((f) => [`f${f.padStart(4, "0")}`, Number(f)])) : KEY;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "GhostLaunch", browserExecutable: BROWSER });
fs.mkdirSync("out/stills", { recursive: true });
for (const [name, frame] of Object.entries(frames)) {
  const output = `out/stills/${name}.png`;
  await renderStill({ serveUrl, composition, frame, output, browserExecutable: BROWSER, chromiumOptions: { gl: "swangle" } });
  console.log(output, frame);
}
