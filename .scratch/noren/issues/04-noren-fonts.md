# 04: The Noren fonts

**What to build:** A Consumer adds `import "k-ui-kit/fonts/noren.css"` and gets Shippori Mincho B1 for Dialog titles and Zen Kaku Gothic New for everything else, served from woff2 files inside the package under their SIL Open Font License. The main stylesheet still loads no font files, Ridgeline's fonts stylesheet is untouched, and a Consumer who skips the import falls back to a mincho and a gothic on a Japanese system and to Georgia and the system sans elsewhere.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Shippori Mincho B1 at 800 and Zen Kaku Gothic New at 400 and 700 ship as woff2 files for the latin and latin-ext ranges, with the SIL Open Font License text beside each family
- [x] A new stylesheet exported as `k-ui-kit/fonts/noren.css` holds the font-face rules with font-display swap and unicode ranges, and `k-ui-kit/fonts.css` is unchanged
- [x] The main stylesheet contains no font-face rules, and the copy step carries the new stylesheet and files into the build output
- [x] The build check fails if the Noren stylesheet is not exported, if any face it references is missing from the output, or if the licence files are missing
- [x] The Fonts Story shows each Noren face with a latin and a latin-ext sample, and the Storybook preview imports both fonts stylesheets
- [x] The stylesheet's header comment states that the bundled faces cover latin and latin-ext only and that Japanese text falls back to the system font
- [x] Lint, typecheck, tests, and build pass

## Comments

2026-10-06: Landed on branch `noren-04-noren-fonts`. A Consumer imports `k-ui-kit/fonts/noren.css`, which maps to `dist/styles/fonts-noren.css`, and its url() paths point at `dist/fonts/shippori-mincho-b1/` and `dist/fonts/zen-kaku-gothic-new/`. The source is `src/styles/fonts-noren.css` and the two new folders under `src/fonts/`. `scripts/copy-fonts.mjs` copies the new sheet beside Ridgeline's; `src/fonts/` was already copied wholesale. Ridgeline's `src/styles/fonts.css` and the `./fonts.css` export are untouched, and `tokens.css` was left alone for ticket 01.

Where the files came from. All six woff2 files are the latin and latin-ext subsets the Google Fonts CSS API served for `Shippori+Mincho+B1:wght@800` and `Zen+Kaku+Gothic+New:wght@400;700` under a Chrome User-Agent, downloaded from fonts.gstatic.com as they are, with Google's unicode ranges copied into the sheet. Each `OFL.txt` is the one in `ofl/shipporiminchob1/` and `ofl/zenkakugothicnew/` in the google/fonts repo. Neither licence names a Reserved Font Name, so subsets are fine.

Two deviations from the spec text. The spec counts "three files", one per face covering both ranges, like Josefin Sans. Google serves both subsets per face as separate static files, so the sheet ships six files instead, mirroring the Fraunces and Nunito Sans approach rather than the Josefin one. A latin-only page then fetches only the three latin files. Second, the latin-ext slices are tiny (1.6 to 1.7 KB each) because the families barely draw that range. Checked against the full TTFs in google/fonts: Shippori Mincho B1 has only dotless i and the OE ligature from latin-ext, and Zen Kaku Gothic New adds the Welsh circumflexes, the capital sharp s and the grave Y. Neither has Ł, ź or any other Polish or Czech letter. So the header comment says that most latin-ext letters fall back along with Japanese text, which is weaker than the spec's "cover latin and latin-ext" but true. Six files, 56,696 bytes in all (Shippori 33.9 KB, Zen Kaku 22.8 KB).

Naming. Shippori ships at one weight, so its files follow the Ridgeline pattern, `shippori-mincho-b1-latin.woff2` and `-latin-ext`. Zen Kaku Gothic New ships two static weights, so its names carry the weight: `zen-kaku-gothic-new-400-latin.woff2`, `-400-latin-ext`, `-700-latin`, `-700-latin-ext`. Ridgeline never had a static multi-weight family, so this is a new case in the pattern.

Verified with `pnpm check` (lint, typecheck, 145 Story tests in Chromium, build). The Fonts Story was red first (Shippori Mincho B1 800 loaded no face), then green once the sheet and the preview import landed. The build check now runs the url, swap, unicode-range and both-subsets checks over both sheets from one `fontsSheets` list, requires the `./fonts/noren.css` export, and looks for the two new `OFL.txt` files. Deleting `zen-kaku-gothic-new-700-latin.woff2` from dist failed one check, and deleting `dist/styles/fonts-noren.css` failed seven. `pnpm pack --dry-run` lists the sheet, all six files and both licences.

For later tickets. The family names are exactly "Shippori Mincho B1" and "Zen Kaku Gothic New", so ticket 01's Noren font Tokens should quote them that way; weights available are 800 for Shippori and 400 and 700 for Zen Kaku, nothing else, and nothing italic. The export path is `k-ui-kit/fonts/noren.css`. The faces list to mirror in `scripts/smoke-test.mjs` (ticket 05) is `["Shippori Mincho B1", "normal", 800]`, `["Zen Kaku Gothic New", "normal", 400]`, `["Zen Kaku Gothic New", "normal", 700]`, the same triples as in `scripts/verify-build.mjs` and `src/docs/Fonts.stories.tsx`. A latin-ext sample such as "Łódź" still loads the latin-ext face through its unicode-range even though the file has no Ł glyph, so the Story and a `document.fonts.load` smoke check both pass; a visual check of latin-ext text will show fallback glyphs. The Storybook preview imports `src/styles/fonts-noren.css` right after `fonts.css`; if ticket 03 renames `preview.ts` to `preview.tsx`, keep that import. Ticket 06 should document the second import and the 55 KB figure on the Getting started page, the README and the changeset, and say plainly that Japanese and most latin-ext text fall back.
