// Renders each scene's key frame as a PNG (scene start + keyframe offset from timing.json).
import {execSync} from 'node:child_process';
import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync('src/timing.json', 'utf8'));
const only = process.argv[2];
for (const [k, s] of Object.entries(T.scenes)) {
  if (only && only !== k) continue;
  const frame = s.from + T.keyframes[k];
  execSync(`npx remotion still Launch out/stills/${k}_f${frame}.png --frame=${frame} --props='{"withAudio":false}' --log=error`, {stdio: 'inherit'});
}
