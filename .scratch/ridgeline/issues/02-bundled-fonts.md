# 02: Bundled fonts

**What to build:** A Consumer adds one optional stylesheet import and gets Fraunces, Josefin Sans, and Nunito Sans served from the package. A Consumer who skips it downloads no font files, and the main stylesheet stays font-free. The build fails if the fonts stylesheet ever points at a file that isn't shipped.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] woff2 files committed for the latin and latin-ext ranges: Fraunces 400 italic, 600 upright, 600 italic; Josefin Sans 400 and 600; Nunito Sans 400, 600, and 700
- [ ] The SIL Open Font License text for each family ships alongside the files
- [ ] A fonts stylesheet holds the font-face rules with font-display swap and the unicode ranges for each subset
- [ ] The package exports it as its own subpath next to the main stylesheet subpath, and the build copies it and the font files into the output
- [ ] The main stylesheet contains no font-face rules
- [ ] Storybook loads the fonts stylesheet so the docs show the full Theme
- [ ] The build verification script fails when the fonts stylesheet refers to a font file missing from the build output
- [ ] Lint, typecheck, tests, and build pass
