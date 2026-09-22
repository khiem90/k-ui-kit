# k-ui-kit

Accessible React Components styled with plain CSS. Ten Components that meet WCAG 2.2 AA, one stylesheet, a dark Theme, and no styling runtime.

Browse every Component in the Storybook at https://khiem90.github.io/k-ui-kit/.

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

package.json pins the pnpm version. Run `corepack enable` once and corepack picks that version.

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Storybook on port 6006                           |
| `pnpm test`            | Runs every Story as a test in Chromium, with axe |
| `pnpm lint`            | ESLint with jsx-a11y, then a Prettier check      |
| `pnpm typecheck`       | `tsc --noEmit`                                   |
| `pnpm build`           | tsup to `dist/`, then verifies the output shape  |
| `pnpm build:storybook` | Static Storybook to `storybook-static/`          |
| `pnpm check`           | Lint, typecheck, test, and build in one go       |
| `pnpm changeset`       | Writes a changeset for the current change        |

Stories are the tests. The a11y addon fails the run on any axe violation, and play functions cover keyboard behaviour.

If the first test run after adding a dependency fails with a 404 on a `node_modules/.cache` chunk, run it again. Vite re-optimises dependencies on that run and invalidates the chunk the browser had already requested.

## Contribute a change

Open a pull request against `main`. A ruleset named "Protect main" blocks the merge until two checks pass:

- `ci` runs lint, typecheck, the Story tests in Chromium, and the build.
- `changeset` fails when shipped code changed and the pull request adds no file under `.changeset/`. Shipped code means `src/` except Stories and docs, `package.json`, and `tsup.config.ts`.

Run `pnpm changeset` to write one. Pick the bump (patch, minor, or major) and describe the change the way a Consumer should read it in the changelog. Run `pnpm changeset --empty` when shipped code changed but no Consumer would notice, such as a refactor.

The same ruleset blocks pushes straight to `main`. Repository admins can bypass it, and that is how the maintainer merges the version pull request described below.

## Release

Every push to `main` runs the Release workflow. While changesets are waiting it opens or updates a pull request titled "Version Packages" that bumps the version, writes `CHANGELOG.md`, and deletes the consumed changesets. Merging that pull request publishes to npm with provenance, tags the commit, and creates a GitHub release.

The Actions bot that opens the version pull request cannot trigger CI, so that pull request shows no checks. It only bumps the version, rewrites `CHANGELOG.md`, and deletes the consumed changesets, so merge it with the admin bypass. To give it a CI run instead, pass a fine-grained personal access token to the action's `github-token` input in `release.yml`.

Publishing reads an npm token from a repository secret named `NPM_TOKEN`. Until that secret exists the workflow still manages the version pull request and skips the publish step. One-time setup for the maintainer:

1. Sign in to npm. `npm login` in a terminal creates the account if needed and signs the CLI in.
2. On npmjs.com open your avatar, then Access Tokens, then Generate New Token. Give it a name, tick "Bypass two-factor authentication" so the workflow can publish without a code, set Packages and scopes to "Read and write (publish and stage)" for All Packages, and pick an expiry. Copy the token. npm shows it only once.
3. Store it as the secret with `gh secret set NPM_TOKEN`, or in Settings, then Secrets and variables, then Actions, then New repository secret.
4. If a version pull request was already merged, run the Release workflow by hand from the Actions tab. It publishes any version that is not on npm yet.

Tokens expire, so repeat steps 2 and 3 when a Release run fails with an authentication error. npm's access token docs say that publishing with a token ends in January 2027. Before then, add a trusted publisher on the package's settings page on npmjs.com (GitHub Actions, repository `khiem90/k-ui-kit`, workflow `release.yml`), then remove the `NPM_TOKEN` gate and `NODE_AUTH_TOKEN` from `.github/workflows/release.yml`. Provenance is automatic with trusted publishing.

## Repository layout

- `src/components/<Name>/` holds a Component's source, CSS, and Stories.
- `src/styles/` holds the Tokens and the single entry stylesheet.
- `src/icons.tsx` holds the inline SVG icons the kit's own Components use. They are not exported.
- `src/index.ts` is the public entry.
- `.changeset/` holds pending changesets and the Changesets config.
- `.github/workflows/` holds the CI, Pages, and Release workflows.
- `CONTEXT.md` is the glossary. `docs/adr/` records the decisions behind the hard choices.
