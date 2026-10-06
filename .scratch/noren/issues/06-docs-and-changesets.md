# 06: Two Themes in the docs and the changelog

**What to build:** Every place a Consumer reads about the kit describes two Themes. The Getting started page gains a Themes section with the attribute, the second fonts import, the light-only Color scheme statement, and a Token table listing each role with its Ridgeline and Noren values. The README's opening and its fonts paragraph mention Noren. The pending first-release changeset stops calling Ridgeline the only Theme, and a new minor changeset describes Noren, the new Token roles, and ADR 0006's widening.

**Blocked by:** 03, 04

**Status:** resolved

- [x] The Getting started page has a Themes section covering the attribute, the fonts import per Theme, the light-only Color scheme, and a table of every Token role with both Themes' values, including the four-value Tokens and the Rail
- [x] The README describes Noren in its opening, its usage snippet shows the attribute, and its fonts paragraph covers both stylesheets and the latin-only coverage of the Noren faces
- [x] The first-release changeset no longer says Ridgeline is the only Theme, and a new minor changeset describes Noren, lists the new Token roles, names the three Tokens that may hold four values, and states the fonts coverage
- [x] CLAUDE.md and the README's repository layout section mention the second Theme and the second fonts stylesheet where they describe the first
- [x] The Noren spec's Further notes record anything that deviated from the Theme table during implementation
- [x] Lint, Prettier included, passes

## Comments

2026-10-06: Landed on branch `noren-06-docs-and-changesets`. The Getting started page opens on two Themes, keeps "Add the fonts" for Ridgeline and points at the Noren import, and gains a Themes section: the attribute on the html element or any ancestor, the Dialog following its subtree into the top layer, the `k-ui-kit/fonts/noren.css` import with the 55 KB figure and what the latin-ext files do and do not draw, the light-only Color scheme with `data-color-scheme` still reserved, and the Storybook toolbar. "Override Tokens" says where each Theme declares its values and that a `:root` rule beats a Theme on the html element but not a `data-theme` wrapper, with the `:root, [data-theme]` form as the fix. The Token table has a Noren column, a row for each of the sixteen new roles, "Up to four values" on the three Tokens that may hold them, and "Not declared, inherits `150ms`" on motion duration. Every value is copied from `src/styles/tokens.css`, not the spec table, so `--kui-rail-color` and the lowercase hex are the ones that ship.

Elsewhere. The README describes both Themes in its opening, shows the attribute with the Noren fonts import in a second snippet, covers both fonts stylesheets and the latin-ext caveat in one paragraph, drops "the only Theme", and names `fonts-noren.css` and the per-family font folders in the repository layout. `.changeset/first-release.md` calls Ridgeline the default rather than the only Theme and says `data-theme` names a Theme. `.changeset/noren.md` is the minor changeset: what Noren looks like, the three four-value Tokens, the sixteen new roles by name with what reads each, the `:root, [data-theme]` note, and the fonts stylesheet with its coverage. CLAUDE.md's first line names both Themes and the two fonts stylesheets. ADR 0001's "declared once, on the root" consequence and ADR 0005's "while Ridgeline is the only Theme" consequence are reworded; the decisions are untouched. The spec's Further notes gain three entries from tickets 01, 02, and 04: label weight on the Dialog title and the DataTable caption, radius tab on the horizontal Tabs list and the `--kui-rail-color` spelling, and six font files whose latin-ext slices draw almost nothing.

After merging `noren`, which by then carried ticket 05, the README's smoke-test paragraph was rewritten to what the script now proves: the Next.js app under Noren with both fonts imports, the Vite app with a Noren section beside Ridgeline content, and the `:root, [data-theme]` override reaching both.

Verified with `pnpm lint` (Prettier included, after `pnpm format` aligned the four-column table), `pnpm typecheck`, `pnpm test` (153 Story tests in Chromium, the Getting started page's form Story among them), and `pnpm build`. The static Storybook was built and the Getting started page read in the browser at 1280px: the Themes section, both code blocks, and all 52 rows of the table render. The first cut of the table was 1353px wide in Storybook's 1000px column because a font stack in one code span cannot wrap, so each family in a stack and each part of the floating shadow is now its own code span, and the table measures 1018px with no horizontal page scroll.

For later tickets. Nothing in the repo still says Ridgeline is the only Theme; a grep for "only Theme" across the tracked files outside `.scratch/` finds nothing. The "Used for" column of the Token table is the narrowest at 1280px and wraps to five lines on the label weight row, so a future row should keep that cell short.
