#!/usr/bin/env bash
# Downloads Satoshi Light, Light Italic and Medium (free from Fontshare) into video/fonts/.
# Satoshi's licence doesn't allow redistributing the font files, so they're not committed.
set -euo pipefail
cd "$(dirname "$0")/../fonts"
B=https://cdn.fontshare.com/wf
curl -fsS -o Satoshi-Light.ttf       "$B/D7WD5OXZFWQ5T76HSPWAC7MNKAJXE2YG/LUGNSPO5YC34ABNB2O6K7AFDSOJZT56V/WNDVG7O66ENLOD43GS7FBUCC4KMT5OM2.ttf"
curl -fsS -o Satoshi-LightItalic.ttf "$B/BRQAKSEW34X5RMZXKNWSVNXMNXSLSG6X/DOBF42XRXCZ2WDWJNNFFNBHBHYFWLRQD/MVBFGLEMN2LQF4RKXAFO4YZFKXTEZ7FQ.ttf"
curl -fsS -o Satoshi-Medium.ttf      "$B/P2LQKHE6KA6ZP4AAGN72KDWMHH6ZH3TA/ZC32TK2P7FPS5GFTL46EU6KQJA24ZYDB/7AHDUZ4A7LFLVFUIFSARGIWCRQJHISQP.ttf"
echo "Satoshi fonts saved to $(pwd)"
