import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(16);
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell");
