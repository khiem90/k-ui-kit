# 02: Bundled fonts

**What to build:** A Consumer adds one optional stylesheet import and gets Fraunces, Josefin Sans, and Nunito Sans served from the package. A Consumer who skips it downloads no font files, and the main stylesheet stays font-free. The build fails if the fonts stylesheet ever points at a file that isn't shipped.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] woff2 files committed for the latin and latin-ext ranges: Fraunces 400 italic, 600 upright, 600 italic; Josefin Sans 400 and 600; Nunito Sans 400, 600, and 700
- [x] The SIL Open Font License text for each family ships alongside the files
- [x] A fonts stylesheet holds the font-face rules with font-display swap and the unicode ranges for each subset
- [x] The package exports it as its own subpath next to the main stylesheet subpath, and the build copies it and the font files into the output
- [x] The main stylesheet contains no font-face rules
- [x] Storybook loads the fonts stylesheet so the docs show the full Theme
- [x] The build verification script fails when the fonts stylesheet refers to a font file missing from the build output
- [x] Lint, typecheck, tests, and build pass

## Comments

2026-10-05: Landed on branch `ridgeline-02-bundled-fonts`. A Consumer imports `k-ui-kit/fonts.css`, which maps to `dist/styles/fonts.css`, and its url() paths point at `dist/fonts/<family>/`. The source lives in `src/styles/fonts.css` and `src/fonts/`. tsup runs `scripts/copy-fonts.mjs` on success to copy both into dist, because bundling the stylesheet would rename and move the font files. The config can't import `node:fs` itself since the repo has no `@types/node`.

Where the files came from. Fraunces and Nunito Sans are the latin and latin-ext woff2 subsets that the Google Fonts CSS API (fonts.googleapis.com/css2, fonts.gstatic.com files) serves for the Theme's weights, with Google's unicode ranges copied as they are. Josefin Sans is `ofl/josefinsans/JosefinSans[wght].ttf` from the google/fonts GitHub repo, compressed to woff2 with fontTools and otherwise unchanged. Each `OFL.txt` comes from the same family folder in google/fonts.

One deviation from the ticket text. Josefin Sans's licence names "Josefin Sans" as a Reserved Font Name, and the OFL treats a subset as a Modified Version that may not use that name. So it ships whole as one 47.7 KB file whose single face declares both subsets' ranges, instead of two Google subsets. A latin-only page pays about 19 KB more than the subsets would cost. Fraunces and Nunito Sans reserve no name.

Google serves variable files, so the italic Fraunces file covers 400 and 600, Josefin Sans covers 400 and 600, and Nunito Sans covers 400, 600, and 700. Each face declares the file's full weight axis (Fraunces italic 100 900, Josefin Sans 100 700, Nunito Sans 200 1000). Upright Fraunces is a static 600. Seven files, 228 KB in all.

Verified with `pnpm check` (lint, typecheck, 108 Story tests in Chromium, build). The build check now fails when the main stylesheet has a font-face rule, when the manifest lacks the `./fonts.css` export, when a family's OFL.txt is missing from dist, when a url() in the fonts stylesheet has no file behind it, or when any Theme face lacks a declaration for either subset. Deleting a woff2 from dist made it fail as expected. A test-only Story, `src/docs/Fonts.stories.tsx`, loads every face for a latin and a latin-ext sample through `document.fonts` and fails with a NetworkError when a file is missing. `pnpm pack --dry-run` lists all fonts, licences, and the stylesheet.

For later tickets. The family names are exactly "Fraunces", "Josefin Sans", and "Nunito Sans", so ticket 01's font Tokens should name them that way. The Storybook preview imports `src/styles/fonts.css` right after the main stylesheet. Ticket 01 rewrites that file, so a merge keeps both edits. Ticket 17 should document the fonts import on the Getting started page and in the README, which still say the kit ships no font files.
