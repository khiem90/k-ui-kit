# 06: Two Themes in the docs and the changelog

**What to build:** Every place a Consumer reads about the kit describes two Themes. The Getting started page gains a Themes section with the attribute, the second fonts import, the light-only Color scheme statement, and a Token table listing each role with its Ridgeline and Noren values. The README's opening and its fonts paragraph mention Noren. The pending first-release changeset stops calling Ridgeline the only Theme, and a new minor changeset describes Noren, the new Token roles, and ADR 0006's widening.

**Blocked by:** 03, 04

**Status:** ready-for-agent

- [ ] The Getting started page has a Themes section covering the attribute, the fonts import per Theme, the light-only Color scheme, and a table of every Token role with both Themes' values, including the four-value Tokens and the Rail
- [ ] The README describes Noren in its opening, its usage snippet shows the attribute, and its fonts paragraph covers both stylesheets and the latin-only coverage of the Noren faces
- [ ] The first-release changeset no longer says Ridgeline is the only Theme, and a new minor changeset describes Noren, lists the new Token roles, names the three Tokens that may hold four values, and states the fonts coverage
- [ ] CLAUDE.md and the README's repository layout section mention the second Theme and the second fonts stylesheet where they describe the first
- [ ] The Noren spec's Further notes record anything that deviated from the Theme table during implementation
- [ ] Lint, Prettier included, passes
