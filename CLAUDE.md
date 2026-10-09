# k-ui-kit

Accessible React component library on npm. Plain CSS with Tokens in three Themes (Ridgeline by default, Noren through `data-theme="noren"`, Rooftop, the dark one, through `data-theme="rooftop"`, all in `src/styles/tokens.css`, each with its own opt-in fonts stylesheet, `fonts.css`, `fonts-noren.css`, and `fonts-rooftop.css`), Components built on the platform (native dialog and inputs, the Popover API, CSS anchor positioning) with zero runtime dependencies, Stories as tests.

Shared internals live in `src/*.ts(x)` beside `index.ts` (Slot, popover anchoring, compose, controllable state). Check them before writing a helper.

## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the root, ADRs under `docs/adr/`. See `docs/agents/domain.md`.
