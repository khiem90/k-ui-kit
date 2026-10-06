# k-ui-kit

Accessible React Components styled with plain CSS. Ten Components that meet WCAG 2.2 AA, in two Themes. Ridgeline, the default, is warm apricot and cream surfaces, Ember actions, pill Buttons, and an arched Dialog. Noren, one attribute away, is Washi and Paper surfaces, Cat text, a Lantern red primary, Tabs hung like cloth from a Cedar Rail, underlined fields, and flat square Buttons. One stylesheet holds both, each has a bundled fonts stylesheet, and there is no styling runtime and no runtime dependency besides React.

Browse every Component in the Storybook at https://khiem90.github.io/k-ui-kit/. The package is on npm at https://www.npmjs.com/package/k-ui-kit.

## Use it

```bash
pnpm add k-ui-kit
```

```tsx
import "k-ui-kit/styles.css";
import "k-ui-kit/fonts.css";
import { Button } from "k-ui-kit";

<Button variant="primary">Save</Button>;
```

That is Ridgeline. For Noren, set `data-theme="noren"` on the html element, or on any ancestor, and import its fonts stylesheet instead:

```tsx
import "k-ui-kit/styles.css";
import "k-ui-kit/fonts/noren.css";

<html lang="en" data-theme="noren">
  <body>{children}</body>
</html>;
```

Both fonts stylesheets are optional. `k-ui-kit/fonts.css` loads Fraunces, Josefin Sans, and Nunito Sans, and `k-ui-kit/fonts/noren.css` loads Shippori Mincho B1 and Zen Kaku Gothic New, each from files inside the package under the SIL Open Font License. Leave one out if you already serve those fonts, or to fall back to Georgia and `system-ui`. On a Japanese machine Noren reaches the system mincho and gothic first. The Noren files are the latin and latin-ext subsets, and the two families draw almost no latin-ext letters, so Japanese text and most accented Central European letters fall back to the next family in the stack. The main stylesheet loads no font files.

React and React DOM 18 or later are peer dependencies, and the package has no other dependencies. Every Component is the kit's own code, built on the native dialog element, the Popover API, CSS anchor positioning, and real form inputs. Every Component renders from a React Server Component with no client boundary in your app.

Both Themes have a light Color scheme only, and both ship in the one stylesheet. Restyle either by overriding Tokens such as `--kui-primary` or `--kui-radius-button` in a plain `:root` rule, or `:root, [data-theme]` to reach a Theme set on a wrapper below the root. See the Getting started page in Storybook for every Token with its value in each Theme and a form example.

## Develop it

package.json pins the pnpm version. Run `corepack enable` once and corepack picks that version.

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Storybook on port 6006                           |
| `pnpm test`            | Runs every Story as a test in Chromium, with axe |
| `pnpm lint`            | ESLint with jsx-a11y, Stylelint, then Prettier   |
| `pnpm typecheck`       | `tsc --noEmit`                                   |
| `pnpm build`           | tsup to `dist/`, then verifies the output shape  |
| `pnpm build:storybook` | Static Storybook to `storybook-static/`          |
| `pnpm check`           | Lint, typecheck, test, and build in one go       |
| `pnpm smoke`           | Proves the kit in fresh Next.js and Vite apps    |
| `pnpm changeset`       | Writes a changeset for the current change        |

Stories are the tests. The a11y addon fails the run on any axe violation, and play functions cover keyboard behaviour.

Stylelint guards ADR 0001 in `src/**/*.css`. It fails on a colour written as hex, `rgb()`, `color-mix()`, a named colour, or any other colour function, and on a px or rem length in a margin, padding, gap, radius, or font-size property. Those values belong in `src/styles/tokens.css`, the one file the colour rules skip. The length rule lets through `0`, `1px`, `2px`, and the `-1px` of the visually-hidden pattern. A declaration that needs another value carries a `stylelint-disable-next-line` comment with the reason after `--`, and the config rejects a disable without one.

`pnpm smoke` is the Consumer check. It packs the package, scaffolds a Next.js App Router app and a Vite app in a temporary folder, installs the tarball into each, builds them, and drives them in Chromium. It checks that the installed kit brings no dependencies, that every Component renders and responds from a server component, that the fonts stylesheet resolves every face in the Next.js build, that Ridgeline ignores a dark system preference and yields to a plain `:root` Token override, and that the Vite bundle holds only the Components the app imports, the stylesheet, and no font files. It needs the network and takes a few minutes. Run it before merging a version pull request.

If the first test run after adding a dependency fails with a 404 on a `node_modules/.cache` chunk, run it again. Vite re-optimises dependencies on that run and invalidates the chunk the browser had already requested.

## Contribute a change

Open a pull request against `main`. A ruleset named "Protect main" blocks the merge until two checks pass:

- `ci` runs lint, typecheck, the Story tests in Chromium, and the build.
- `changeset` fails when shipped code changed and the pull request adds no file under `.changeset/`. Shipped code means `src/` except Stories and docs, `package.json`, and `tsup.config.ts`.

Run `pnpm changeset` to write one. Pick the bump (patch, minor, or major) and describe the change the way a Consumer should read it in the changelog. Run `pnpm changeset --empty` when shipped code changed but no Consumer would notice, such as a refactor.

The same ruleset blocks pushes straight to `main`. Repository admins can bypass it, and that is how the maintainer merges the version pull request described below.

## Release

Every push to `main` runs the Release workflow. While changesets are waiting it opens or updates a pull request titled "Version Packages" that bumps the version, writes `CHANGELOG.md`, and deletes the consumed changesets. Merging that pull request publishes to npm with provenance, tags the commit, and creates a GitHub release. Run `pnpm smoke` before merging it.

The Actions bot that opens the version pull request cannot trigger CI, so that pull request shows no checks. It only bumps the version, rewrites `CHANGELOG.md`, and deletes the consumed changesets, so merge it with the admin bypass. To give it a CI run instead, pass a fine-grained personal access token to the action's `github-token` input in `release.yml`.

Publishing reads an npm token from a repository secret named `NPM_TOKEN`. Until that secret exists the workflow still manages the version pull request and skips the publish step. One-time setup for the maintainer:

1. Sign in to npm. `npm login` in a terminal creates the account if needed and signs the CLI in.
2. On npmjs.com open your avatar, then Access Tokens, then Generate New Token. Give it a name, tick "Bypass two-factor authentication" so the workflow can publish without a code, set Packages and scopes to "Read and write (publish and stage)" for All Packages, and pick an expiry. Copy the token. npm shows it only once.
3. Store it as the secret with `gh secret set NPM_TOKEN`, or in Settings, then Secrets and variables, then Actions, then New repository secret.
4. If a version pull request was already merged, run the Release workflow by hand from the Actions tab. It publishes any version that is not on npm yet.

Tokens expire, so repeat steps 2 and 3 when a Release run fails with an authentication error. npm's access token docs say that publishing with a token ends in January 2027. Before then, add a trusted publisher on the package's settings page on npmjs.com (GitHub Actions, repository `khiem90/k-ui-kit`, workflow `release.yml`), then remove the `NPM_TOKEN` gate and `NODE_AUTH_TOKEN` from `.github/workflows/release.yml`. Provenance is automatic with trusted publishing.

## Repository layout

- `src/components/<Name>/` holds a Component's source, CSS, and Stories.
- `src/styles/` holds the Tokens of both Themes in `tokens.css`, the main entry stylesheet, and the two opt-in fonts stylesheets, `fonts.css` for Ridgeline and `fonts-noren.css` for Noren.
- `src/fonts/` holds the woff2 files and each family's OFL.txt, one folder per family across both Themes. The build copies them to `dist/fonts/` unchanged.
- `src/icons.tsx` holds the inline SVG icons the kit's own Components use. `src/slot.tsx` holds the Slot behind `asChild`, and `src/popover.tsx` the anchored popover hook Tooltip and Select share. `src/compose.ts` merges refs and event handlers, and `src/controllable-state.ts` holds the controlled or uncontrolled state every stateful Component uses. None of them are exported, and each needs its own line in the tsup entry list.
- `src/index.ts` is the public entry. It carries no client directive and assembles the composite namespaces, so a server component can render `Dialog.Root`. Each Component's file carries its own directive and is built to its own file under `dist/`. `docs/adr/0003-client-boundary-below-the-entry.md` has the reasoning.
- `scripts/` holds the build verifier and the Consumer smoke test.
- `src/docs/` holds the Getting started page and the Story it renders, the Tokens and Fonts Stories, and `contrast.ts`, the WCAG contrast helpers Stories share. Nothing in it ships.
- `.changeset/` holds pending changesets and the Changesets config.
- `.github/workflows/` holds the CI, Pages, and Release workflows.
- `GLOSSARY.md` is the glossary. `docs/adr/` records the decisions behind the hard choices.
