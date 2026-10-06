# No runtime dependencies

The kit ships with zero runtime dependencies. This supersedes ADR 0002. Dialog, Select, Tooltip, Tabs, RadioGroup, Checkbox, Switch, and the `asChild` slot were built on Radix Primitives, and DataTable on TanStack Table. All of that is now code in this repo. The maintainer wants to own every line a Consumer installs, and the platform now covers most of what Radix supplied: `<dialog>` gives the focus trap, inert background, and Escape, the Popover API gives top-layer rendering and light dismiss, and CSS anchor positioning reached Baseline in January 2026.

Development tooling (Storybook, Vitest, tsup, ESLint) is unaffected because none of it ships to a Consumer.

## Considered options

- Keep Radix, with Base UI as the fallback. This was ADR 0002. It keeps the WAI-ARIA keyboard work out of our hands, at the cost of nine packages we don't control.
- Drop Radix but keep TanStack Table. DataTable only sorts one column, paginates, and selects rows, which is a small amount of code to own.
- Own everything, and use a native element wherever one does the job. Chosen.

## Consequences

- Keyboard handling, focus management, and ARIA wiring for the composite Components are ours to get right. The Story play functions are the regression net, so the public API stays frozen through the rewrite and their behavioural assertions should not change.
- `package.json` has no `dependencies` field. Adding one needs a new ADR.
- Positioning uses CSS anchor positioning and `position-try-fallbacks` rather than a JavaScript collision engine. In a browser older than the January 2026 Baseline, a Tooltip or Select list opens in the centre of the viewport instead of next to its trigger.
