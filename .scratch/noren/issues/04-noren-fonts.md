# 04: The Noren fonts

**What to build:** A Consumer adds `import "k-ui-kit/fonts/noren.css"` and gets Shippori Mincho B1 for Dialog titles and Zen Kaku Gothic New for everything else, served from woff2 files inside the package under their SIL Open Font License. The main stylesheet still loads no font files, Ridgeline's fonts stylesheet is untouched, and a Consumer who skips the import falls back to a mincho and a gothic on a Japanese system and to Georgia and the system sans elsewhere.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Shippori Mincho B1 at 800 and Zen Kaku Gothic New at 400 and 700 ship as woff2 files for the latin and latin-ext ranges, with the SIL Open Font License text beside each family
- [ ] A new stylesheet exported as `k-ui-kit/fonts/noren.css` holds the font-face rules with font-display swap and unicode ranges, and `k-ui-kit/fonts.css` is unchanged
- [ ] The main stylesheet contains no font-face rules, and the copy step carries the new stylesheet and files into the build output
- [ ] The build check fails if the Noren stylesheet is not exported, if any face it references is missing from the output, or if the licence files are missing
- [ ] The Fonts Story shows each Noren face with a latin and a latin-ext sample, and the Storybook preview imports both fonts stylesheets
- [ ] The stylesheet's header comment states that the bundled faces cover latin and latin-ext only and that Japanese text falls back to the system font
- [ ] Lint, typecheck, tests, and build pass
