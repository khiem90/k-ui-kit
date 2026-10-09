# 05: Three Themes and one dark Color scheme in the docs and the changelog

**What to build:** Every place a Consumer reads about the kit describes three Themes and says each carries its own Color scheme. The Getting started page's Themes section covers the Rooftop attribute, the third fonts import, and the dark Color scheme, and its Token table gains a Rooftop column and a surface field row. The README's opening and its fonts paragraph mention Rooftop. ADR 0001's light-only consequence and the Getting started "light only" paragraph are reworded to what ADR 0007 decides. A new minor changeset describes Rooftop and the surface field role.

**Blocked by:** 02, 03

**Status:** ready-for-agent

- [ ] The Getting started Themes section covers `data-theme="rooftop"`, the `k-ui-kit/fonts/rooftop.css` import with its file count and size, the latin and latin-ext coverage, the dark Color scheme and what `color-scheme: dark` does inside a Rooftop subtree, and the Storybook toolbar entry
- [ ] The Getting started "light only" paragraph now says each Theme declares its own Color scheme, Rooftop's is dark, and `data-color-scheme` stays reserved, and ADR 0001's light-only consequence says the same; the decisions in ADR 0001 and 0005 are untouched
- [ ] The Token table has a Rooftop column and a surface field row, every value copied from `src/styles/tokens.css`, and the page is read in the browser at 1280px: if the table overflows Storybook's column, it splits into one table per Theme
- [ ] The README describes three Themes in its opening, shows the Rooftop attribute with its fonts import, covers all three fonts stylesheets and the latin-ext caveat in one paragraph, names `fonts-rooftop.css` and the two new font folders in the repository layout, and its smoke-test paragraph says what the script now proves
- [ ] The first-release changeset and the Noren changeset no longer say both Themes are light only, and a new minor changeset describes Rooftop, the dark Color scheme, the surface field role and what reads it, and the fonts stylesheet with its coverage
- [ ] CLAUDE.md's first line names three Themes and three fonts stylesheets
- [ ] The Rooftop spec's Further notes record anything that deviated from the Theme table during implementation
- [ ] A grep for "light Color scheme only" and "both Themes" across the tracked files outside `.scratch/` finds nothing stale; lint, Prettier included, passes

## Comments
