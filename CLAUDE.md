# Project rules

## Ask before expensive work
- Do only what the user asked. Don't add extra deliverables (test videos, example films, extra boards, alternative versions) on your own initiative.
- Never render a video (`build.sh`, `render.cjs` full renders) or test or example films unless the user explicitly asks for a render in the current conversation. Approving a plan, a skill change or a storyboard is not approval to render.
- Before any render or other costly step (several render/fix/check rounds, large captures, big rewrites), say in one or two lines what it will do and roughly how big it is, then wait for a clear yes.
- If a request is ambiguous, ask a short question instead of guessing.

## Repo
- `.claude/skills/launchvideoisp/`: the launch-video skill (see its `SKILL.md`).
- `skill-demo/`: example outputs from earlier sessions.
- `launchvideoisp-skill.md` / `launchvideoisp-reference.md`: the skill exported as single Markdown files.
