# k-ui-kit

Accessible React components styled with plain CSS. Ten Components that meet WCAG 2.2 AA, one stylesheet, a dark Theme, and no styling runtime.

## Use it

```bash
pnpm add k-ui-kit
```

```tsx
import "k-ui-kit/styles.css";
import { Button } from "k-ui-kit";

<Button variant="primary">Save</Button>;
```

React 18 or later is a peer dependency. See the Getting started page in Storybook for Themes and Token overrides.

## Develop it

pnpm is pinned through corepack, so `corepack enable` once and the right version is used.

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Storybook on port 6006                           |
| `pnpm test`            | Runs every Story as a test in Chromium, with axe |
| `pnpm lint`            | ESLint with jsx-a11y, then a Prettier check      |
| `pnpm typecheck`       | `tsc --noEmit`                                   |
| `pnpm build`           | tsup to `dist/`, then verifies the output shape  |
| `pnpm build:storybook` | Static Storybook to `storybook-static/`          |
| `pnpm check`           | Lint, typecheck, test, and build in one go       |

Stories are the tests. The a11y addon fails the run on any axe violation, and play functions cover keyboard behaviour.

If the first test run after adding a dependency fails with a 404 on a `node_modules/.cache` chunk, run it again. Vite re-optimises dependencies on that run and invalidates the chunk the browser had already requested.

## Repository layout

- `src/components/<Name>/` holds a Component's source, CSS, and Stories.
- `src/styles/` holds the Tokens and the single entry stylesheet.
- `src/index.ts` is the public entry.
- `CONTEXT.md` is the glossary. `docs/adr/` records the decisions behind the hard choices.
