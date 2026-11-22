# SaaS launch films: six prospect concepts

These are independent spec concepts by ISP Agency for the six prospects in "Six SaaS Prospect Profiles" (22 Nov 2026). **None of them is affiliated with or approved by the company named.**

Each folder holds one 16:9 (1920×1080, 30 fps) film of about 26 s, built with `.claude/skills/saas-launch-video`.

**Story:** the problem (hook, chaos, pain) → a dark turn → the brand reveal → solutions 1, 2 and 3 → a recap on a monitor (`monitor`, the new reference style) → results → CTA.

| Folder | Solutions shown | Accent |
|---|---|---|
| `posthog/` | funnel drop-off → sorted session replays → experiment and roll-out | #1D4AFF (published) |
| `buffer/` | write once, post everywhere → weekly queue → all comments in one place | #2C4BFF (published) |
| `beehiiv/` | write and send → referral growth → premium tier | #F2652E (**placeholder**) |
| `kit/` | landing-page form → welcome sequence → tag-based segments | #44B1FF (published) |
| `veed/` | idea to video → brand kit → export to every format | #7B61FF (**placeholder**) |
| `stan/` | store in bio → tap to pay or book → followers become customers | #6355FF (**placeholder**) |

## Before sending
- **Logos:** no company logo, mark or mascot is used. The icon is a generated placeholder. Request the official kit before sending.
- **Numbers:** every number, price, name and comment is illustrative sample data, not a company claim. There are no ratings, testimonials or customer logos.
- **UI:** the product screens are mock-ups, not real product captures. Swap in approved screenshots with `brief.inbox.screenshot` and `brief.inbox.click`.
- **Music:** the music is synthesized. Drop a licensed track in `<brand>/assets/music.mp3` and rebuild.

## Edit and rebuild
- Copy, colours and numbers: `<brand>/brief.js`
- Shot order and pacing: `<brand>/timeline.js`
- Rebuild: `cd launch-films/<brand> && NAME=<brand>_launch ./build.sh` writes `out/<brand>_launch.mp4` and `out/qa_sheet.png`
