// Renders key-frame stills for review: node render-stills.mjs [frame,frame,...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const KEY = { "01_hook": 200, "02a_copy": 352, "02b_cut": 510, "02c_stack": 640, "03a_type": 790, "03b_click": 898, "03c_send": 1080, "04_payoff": 1440, "05_cta": 1750 };
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
