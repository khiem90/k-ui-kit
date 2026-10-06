# 17: Docs, changesets, and smoke test

**What to build:** A Consumer reading the Getting started page and the README learns the Ridgeline kit as it ships: one stylesheet, opt-in fonts, a light-only Theme, Token overrides, and no runtime dependencies. The release notes describe the Ridgeline kit, and the packed package is proven again in fresh Next.js and Vite apps.

**Blocked by:** 02 (Bundled fonts), 16 (Remove old Token names and lock out dependencies)

**Status:** ready-for-agent

- [x] The Getting started page covers the fonts import, Ridgeline as the only Theme with a light Color scheme only, and overriding Tokens with the new role names
- [x] The Getting started page drops the dark mode and theme attribute instructions, including the override pattern that restated the dark media query
- [x] The README describes Ridgeline, the fonts import, and zero runtime dependencies, and no longer mentions Radix or a dark Theme
- [x] The pending changesets are rewritten to describe the Ridgeline kit with no runtime dependencies, keeping the first release a minor bump
- [x] `pnpm smoke` passes: a server component page renders every Component in a fresh Next.js app, and the Vite bundle contains only the imported Components and the stylesheet
- [x] The smoke test loads the fonts stylesheet in at least one app and the fonts resolve
- [x] Lint, typecheck, tests, and build pass

## Comments

2026-10-05: Landed on branch `ridgeline-17-docs-changesets-smoke-test`.

The Getting started page now covers the fonts import, Ridgeline as the only Theme with a light Color scheme, and Token overrides in a plain `:root` rule with the role names. The Token table lists every Ridgeline Token and its value. The dark Theme section, the `data-theme` instructions, and the override pattern with the dark media query are gone. The page also says that selected and hovered DataTable rows swap `--kui-primary` and `--kui-focus-ring` for primary hover and foreground, since a root override of those two doesn't reach there (ticket 15). The form example's "Plan" label borrows the label Tokens so it matches TextField's, and its Story changed to match. The README describes Ridgeline, the optional fonts stylesheet, and zero runtime dependencies, and its smoke test paragraph and repository layout are current.

The 13 changesets stay minor bumps. Every one that said "on the Radix primitive" is rewritten. first-release.md now covers the Ridgeline Tokens, the fonts stylesheet, Button, and the empty dependency list. It states the muted foreground value (ticket 01) and why Josefin Sans ships whole (ticket 02). Each changeset whose Component changed for anyone who used a build from `main` ends with what changed. first-release.md covers the Token renames, the dropped dark Color scheme, and the new heights. Checkbox and RadioGroup cover the HTMLInputElement refs (05, 07), and RadioGroup its reset to defaultValue. Dialog covers the HTMLDialogElement ref (10), the surface on `.kui-dialog__viewport`, `::backdrop`, and the need for a definite width (11). Select covers Tab moving on, the outside press, the page no longer aria-hidden, reset calling onValueChange with the start value or "", and the dropped scroll buttons (12). Tooltip covers the lost arrow and slide (09), Tabs the rtl keys and Tab stop (08), and DataTable the narrowed ColumnDef (14). textfield, checkbox-hide-label, datatable-selection, and server-components needed no change.

The smoke test lost its dark Theme panels and the `data-theme` parsing. The Next.js app imports `k-ui-kit/fonts.css`, and the test loads all eight Ridgeline faces with a latin and a latin-ext sample through `document.fonts.load`, then checks a Button label has a loaded Josefin Sans face. Both apps check that a dark system preference changes nothing. The Vite app overrides `--kui-primary` in a plain `:root` rule and checks the Button shows it. Its bundle must hold no `@font-face` and no woff2 file. The Next.js lockfile entry for the kit must list no dependencies. Checkbox and RadioGroup are now found by role and checked with `isChecked()`, because native inputs carry no role or aria-checked attribute. I pointed the font checks at the Vite app, which skips the fonts, and both failed. That run caught `document.fonts.check()` returning true when no face matches, so the label check now looks for a loaded face itself.

Verified: `pnpm check` passes (lint, typecheck, 142 Story tests in 13 files, build). `pnpm smoke` passes in freshly scaffolded Next.js 16.3.8 and Vite 8.3.3 apps, with 40 checks and no console errors.

For later. GLOSSARY.md and ADR 0001 already had no Radix or dark Theme wording. ADR 0002 still describes Radix, but it is marked superseded by ADR 0004, so I left it as history. The project CLAUDE.md still says "Radix underneath the hard widgets". I didn't edit it, so the maintainer should.
