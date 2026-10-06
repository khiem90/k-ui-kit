# 05: Prove the second Theme in fresh Consumer apps

**What to build:** The Consumer smoke test proves Noren the way it proves Ridgeline. The fresh Next.js app sets `data-theme="noren"` on its html element and imports the Noren fonts stylesheet, and the test asserts that the computed primary is Lantern and that every Noren face loads for a latin and a latin-ext sample. The Vite app keeps its Ridgeline `:root` override check and gains an assertion that a plain `:root` override still wins under the attribute.

**Blocked by:** 03, 04

**Status:** resolved

- [x] The Next.js smoke app carries the attribute on html and imports both fonts stylesheets, and the test asserts the computed primary of a rendered Button is Lantern
- [x] The test asserts every Noren face loads for both samples in the Next.js build, kept in step with the Fonts Story
- [x] The Vite smoke app renders a Noren subtree beside its Ridgeline content and the test asserts the app's `:root` primary override reaches both
- [x] The build check asserts the main stylesheet contains the Noren block
- [x] `pnpm smoke` passes

## Comments

2026-10-06: Landed on branch `noren-05-smoke-test-for-the-second-theme`. The Next.js smoke app sets `data-theme="noren"` on its html element and imports `k-ui-kit/fonts.css` and `k-ui-kit/fonts/noren.css`. The test checks its page under Noren: the body background is Washi, the primary Button is Lantern, a dark system preference changes nothing, all eight Ridgeline faces and all three Noren faces (Shippori Mincho B1 800, Zen Kaku Gothic New 400 and 700) load for the latin and latin-ext samples, and the Button's first font-family is `"Zen Kaku Gothic New"` with a loaded face at the Button's weight. The faces lists, `ridgelineFaces` and `norenFaces`, mirror `src/docs/Fonts.stories.tsx` and the `fontsSheets` table in `scripts/verify-build.mjs`. The Vite app keeps its Ridgeline checks and renders the same two Components again inside `<section id="noren" data-theme="noren">`. The test asserts the override colour on the primary Button inside and outside the wrapper, that the TextField inside has a 0px top edge, a 3px bottom edge and a Paper background, that the one outside keeps its 2px edges on Cream, and that the body is still Apricot. `scripts/verify-build.mjs` requires `dist/styles/index.css` to carry a `:where([data-theme=noren])` block that declares `--kui-primary`.

Where the expected colours come from. `tokenRgb` now takes a Theme and searches only that Theme's block of `tokens.css`, split at the Noren selector; the old first-match lookup returned Ridgeline's value for every name. The comment that called Ridgeline the only Theme is gone.

Two deviations from the ticket text. The ticket has the Vite app's plain `:root` override reaching the Noren subtree. It cannot: a Theme block declares every Token on the wrapper itself, and that beats a value inherited from `:root`, as ticket 03's ThemeSwitch Story shows. The Vite app's override is therefore written as `:root, [data-theme] { --kui-primary: ... }`, the form the Getting started page should document for a Consumer who themes a subtree. Second, ticket 03's Comments say esbuild keeps the selector as written; it does not. `dist/styles/index.css` has `:where([data-theme=noren])` with the quotes dropped, so the build check accepts either quoting.

Verified with `pnpm smoke`, 45 checks on Next.js 16.4.0 with React 19.3.0 and Vite 8.3.3. Red first: with the assertions in and the app files unchanged, exactly the six new checks failed (the Noren background, Lantern, the dark preference re-check, the three Noren faces, the Zen Kaku label, and the Vite subtree) while every Ridgeline check passed; the rerun against the same folder with the app changes passed everything. The build check was red against a dist whose Noren selector was renamed, then green after a rebuild. `pnpm check` (lint, typecheck, 153 Story tests in Chromium, build) passes.

For ticket 06. The README's smoke paragraph should say the Next.js app runs under Noren with both fonts imports and the Vite app themes a subtree beside Ridgeline content. The Getting started page needs the `:root, [data-theme]` form beside the attribute, and the ADR 0003 guarantees now hold for both Themes (story 52).
