# Ghost launch video (Remotion)

A 30.0 s launch video: 1920×1080 at 60 fps (1800 frames). The interface is rebuilt as vector art, with no screenshots. `storyboard.html` is the approved storyboard.

- `src/config.ts` holds all copy, numbers, colors and scene lengths, so a client revision is a one-line change.
- `src/anim.ts` has the easing, spring entrances, exits, click presses, drift and count-ups.
- `src/components/` has the shared pieces: Camera/Stage, Cursor (moves on arcs), Kinetic (the headlines), the five tool windows, the Ghost editor and the Ghost dashboard.
- `src/scenes/` has one component per scene, from S1Hook to S5Cta.

```bash
npm install
```

```bash
npm run stills
```

```bash
npm run render
```

The stills land in `out/stills/`.

The brand styling is sampled from ghost.org: Inter Bold with tight tracking, Inter Bold Italic for emphasis, `#15171A` base, lime `#D1FF19` accent, pink `#FF247D` and purple chart colors, and green deltas. The editor and dashboard are vector rebuilds of the ones shown on ghost.org. The logo and orb in `public/brand/` are the PNGs served by ghost.org (800 px and 400 px); swap in vector versions if Ghost supplies them.
