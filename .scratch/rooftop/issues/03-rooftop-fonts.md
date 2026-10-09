# 03: Ship the Rooftop fonts as a third opt-in stylesheet

**What to build:** A Consumer imports `k-ui-kit/fonts/rooftop.css` and gets Big Shoulders Display at 800 and Barlow at 400, served as woff2 files from inside the package under each family's SIL Open Font License. The sheet is separate from the Ridgeline and Noren sheets, so a Consumer fetches only the Theme they use, and the main stylesheet still loads no font files. Without the import, the Rooftop stacks fall back to Arial Narrow and the system sans.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

**GitHub:** https://github.com/khiem90/k-ui-kit/issues/8

- [x] `src/fonts/big-shoulders-display/` holds the 800 face and `src/fonts/barlow/` the 400 face, each as Google Fonts' latin and latin-ext subsets as served, four files, with `OFL.txt` beside each family
- [x] `src/styles/fonts-rooftop.css` declares the four font-face rules with font-display swap and the same unicode ranges the other sheets use, and its header comment states that the files cover latin and latin-ext only, that Vietnamese and anything else falls back along the stack, and how many latin-ext glyphs each face draws
- [x] `package.json` exports `./fonts/rooftop.css` as `./dist/styles/fonts-rooftop.css`, and the copy script copies the sheet beside the other two so its `url()` paths resolve the same way
- [x] The build check runs its fonts checks over all three sheets, requires the new export, and looks for the two new licence files
- [x] The Fonts Story loads the two Rooftop faces beside the others for the latin and latin-ext samples, and the Storybook preview imports all three sheets
- [x] The main stylesheet still carries no font-face rule; lint, typecheck, tests, and build pass

## Comments

2026-10-09: Landed on branch `claude/kind-lamport-q4wrek`. A Consumer imports `k-ui-kit/fonts/rooftop.css`, which maps to `dist/styles/fonts-rooftop.css`, and its url() paths point at `dist/fonts/big-shoulders-display/` and `dist/fonts/barlow/`. The source is `src/styles/fonts-rooftop.css` and the two new folders under `src/fonts/`. `scripts/copy-fonts.mjs` copies the new sheet beside the other two. The Ridgeline and Noren sheets and exports are untouched, and the main stylesheet still carries no font-face rule.

Where the files came from. All four woff2 files are the latin and latin-ext subsets the Google Fonts CSS API served for `Big+Shoulders+Display:wght@800` and `Barlow:wght@400` under a Chrome User-Agent, downloaded from fonts.gstatic.com as they are, with Google's unicode ranges copied into the sheet. Each `OFL.txt` is the one in `ofl/bigshouldersdisplay/` and `ofl/barlow/` in the google/fonts repo. Neither licence names a Reserved Font Name, so subsets are fine. Google also serves a Vietnamese subset of both families; it is left out, as the spec decides.

Coverage, checked with fontTools on the files themselves. Unlike the Noren families, both faces draw latin-ext in full: the Big Shoulders Display latin-ext file maps 313 code points and the Barlow one 164, Ł, ź, Ś, Č, and Ř among them. The header comment records those counts. Four files, 64,060 bytes in all (Big Shoulders Display 27.0 KB, Barlow 35.6 KB), so the Getting started page can say 63 KB across four files.

Names and weights. The family names are exactly "Big Shoulders Display" and "Barlow", which the Rooftop stacks in `tokens.css` quote that way. Both are static files at one weight each, 800 and 400, nothing italic. The Dialog title keeps `font-style: italic` from component CSS, so the browser synthesises an oblique Big Shoulders Display, as the spec's Further notes already record.

Verified with `pnpm lint`, `pnpm typecheck`, `pnpm test` (the Fonts Story loads both new faces for the latin and latin-ext samples), and `pnpm build`. The build check now runs the url, swap, unicode-range, and both-subsets checks over all three sheets from the one `fontsSheets` list, requires the `./fonts/rooftop.css` export, and looks for the two new `OFL.txt` files. The Storybook preview imports the new sheet after the Noren one.

For later tickets. The faces list to mirror in `scripts/smoke-test.mjs` is `'normal 800 16px "Big Shoulders Display"'` and `'normal 400 16px "Barlow"'`, the same pairs as in `scripts/verify-build.mjs` and `src/docs/Fonts.stories.tsx`.
