# Launch films: storyboards (awaiting approval)

Seven story-walkthrough films, built with `.claude/skills/saas-launch-video` (new `story` style + `shots_story.js`).
Each project: `brief.js` (brand), `film.css` (layout), `beats.js` (shots as HTML + data-* motion), `timeline.js`, `film.json` (board notes).

| Film | Board 16:9 | Board 9:16 |
|---|---|---|
| SeySpace | seyspace/out/storyboard.png | seyspace/out/storyboard_9x16.png |
| Compass OS | compassos/out/storyboard.png | compassos/out/storyboard_9x16.png |
| Clocknext | clocknext/out/storyboard.png | clocknext/out/storyboard_9x16.png |
| Supacheap.eu | supacheap/out/storyboard.png | supacheap/out/storyboard_9x16.png |
| DocsAlot | docsalot/out/storyboard.png | docsalot/out/storyboard_9x16.png |
| Veryfi | veryfi/out/storyboard.png | veryfi/out/storyboard_9x16.png |
| SilentRoom | silentroom/out/storyboard.png | silentroom/out/storyboard_9x16.png |

Rebuild a board: `cd films/<film> && node ../../.claude/skills/saas-launch-video/scripts/story_board.cjs . [--format 9:16]`.
Veryfi's web fonts (*.woff2) are not committed; fetch them from veryfi.com into films/veryfi/fonts/ (see brief.js).
