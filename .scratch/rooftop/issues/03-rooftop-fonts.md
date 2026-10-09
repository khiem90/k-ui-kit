# 03: Ship the Rooftop fonts as a third opt-in stylesheet

**What to build:** A Consumer imports `k-ui-kit/fonts/rooftop.css` and gets Big Shoulders Display at 800 and Barlow at 400, served as woff2 files from inside the package under each family's SIL Open Font License. The sheet is separate from the Ridgeline and Noren sheets, so a Consumer fetches only the Theme they use, and the main stylesheet still loads no font files. Without the import, the Rooftop stacks fall back to Arial Narrow and the system sans.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

**GitHub:** https://github.com/khiem90/k-ui-kit/issues/8

- [ ] `src/fonts/big-shoulders-display/` holds the 800 face and `src/fonts/barlow/` the 400 face, each as Google Fonts' latin and latin-ext subsets as served, four files, with `OFL.txt` beside each family
- [ ] `src/styles/fonts-rooftop.css` declares the four font-face rules with font-display swap and the same unicode ranges the other sheets use, and its header comment states that the files cover latin and latin-ext only, that Vietnamese and anything else falls back along the stack, and how many latin-ext glyphs each face draws
- [ ] `package.json` exports `./fonts/rooftop.css` as `./dist/styles/fonts-rooftop.css`, and the copy script copies the sheet beside the other two so its `url()` paths resolve the same way
- [ ] The build check runs its fonts checks over all three sheets, requires the new export, and looks for the two new licence files
- [ ] The Fonts Story loads the two Rooftop faces beside the others for the latin and latin-ext samples, and the Storybook preview imports all three sheets
- [ ] The main stylesheet still carries no font-face rule; lint, typecheck, tests, and build pass

## Comments
