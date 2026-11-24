### UI kit: rebuild their product UI, don't paste it

Premium launch films never show a raw screenshot as the subject. They take the product's real components and redraw them: clean, simplified, larger, in the brand's type and colours. Then each piece can move on its own: rows stagger in, titles type, numbers count, toggles switch, bars grow.

#### Process

1. **Look.** Read their product screenshots (`brand/ui/*`, `brand/hero.png`, `brand/pages/*`, or the user's own). Use `scripts/layers.py grid` to zoom in on a component.
2. **Inventory.** List the 4–8 components that *are* the product. For example:
   - a fitness app's workout card, leaderboard and max chart
   - a newsletter tool's editor, email and members tile
   - a CRM's pipeline card, contact row and deal value
3. **Describe.** Write each one in `brief.js → kit` as a spec (below). Keep their:
   - **labels** (their real wording, e.g. "Back Squat · 3 × 5")
   - **icon language** (rings with letters, coloured dots, avatars, glyph squares)
   - **colour use** (which accent marks state, tags, deltas)
   - **shape** (radius, dark or light surface)

   Simplify: 3–5 rows, no tiny metadata, larger type.
4. **Check.** Render a board. Each component should be recognisable to their users, and cleaner than the real UI.

#### Specs (`kit.js`)

```js
kit: {
  workout: { type: 'list', label: 'TODAY · VARSITY', items: [
    { title: 'Back Squat', sub: '3 × 5 · 82%', icon: { kind: 'ring', color: '#2bb673', letter: 'A' } },
    { title: 'Vertical Jump', sub: '3 × 3', icon: { kind: 'ring', color: '#1fa2ff', letter: 'B' } } ] },
  leaderboard: { type: 'leaderboard', title: 'Leaderboard · Back Squat', entries: [{ place: 1, value: '210', name: 'Rocky B.' }] },
  maxreport: { type: 'chart', kind: 'bars', title: 'Max Report · Deadlift', values: [405, 365, 420], colors: ['#7fd3f7', '#1fa2ff'], highlight: 2 },
  editor: { type: 'editor', back: '← Posts', actions: ['Preview', 'Publish'], cover: 'linear-gradient(135deg,#ffe7a8,#fec137)', title: 'The Daily Update', lines: 4, toggle: 'Send as newsletter' },
  email: { type: 'email', from: 'The Daily Update', subject: 'Issue #142: what changed' },
  members: { type: 'stat', label: 'Total members', value: '13,041', delta: '+4%', dark: true },
}
```

| type | fields | life when animated |
|---|---|---|
| `list` | `label`, `items[{title, sub, icon{kind: ring/avatar/dot/glyph, color, letter, text}, tag{text, color, bg}}]` | rows stagger in |
| `stat` | `label`, `value`, `delta`, `deltaColor` | value counts up |
| `chart` | `kind: bars/line/donut`, `values`, `labels`, `colors`, `highlight`, `title` | bars grow / line draws |
| `editor` | `back`, `actions`, `cover`, `title`, `lines`, `toggle` | title types, toggle switches on |
| `email` | `from`, `subject`, `dot` | — (use in `fan`) |
| `slider` | `label`, `value 0–1`, `display` | knob slides to value |
| `toggle` | `label`, `on` | switches on |
| `chat` | `messages[{me, name, text}]` | bubbles stagger |
| `toast` | `title`, `sub`, `icon`, `color` | pops |
| `leaderboard` | `title`, `entries[{place, value, name}]` | values count |
| `table` | `columns`, `rows`, `tagCol` | rows stagger |
| `form` | `title`, `fields`, `button` | fields stagger |
| `button` | `label`, `kind 1/2`, `size` | uses the brand's real button style |

Every spec also takes `dark`, `w` and `radius`.

To place a component in a move, call `renderComponent(parent, keyOrSpec, { x, y, w })`, then `revealParts(c, t, t0)` and `animateComponent(c, t, t0)`. The `monitorWords`, `splitWords`, `frameCard`, `uiBuild` and `device()` helpers take `component:` to put a rebuilt component on a screen.

If a component type is missing (a calendar, a map, a kanban board), add a `case` to `renderComponent` in `kit.js` with CSS in `index.html`, using brand variables only.
