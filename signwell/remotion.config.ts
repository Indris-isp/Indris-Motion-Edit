import {Config} from '@remotion/cli/config';

// Pre-installed headless Chromium in this environment; delete this line on a machine where Remotion can download its own.
Config.setBrowserExecutable(
  process.env.REMOTION_CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
