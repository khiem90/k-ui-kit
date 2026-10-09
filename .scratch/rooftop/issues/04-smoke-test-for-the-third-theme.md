# 04: Prove the third Theme in fresh Consumer apps

**What to build:** The Consumer smoke test proves Rooftop the way it proves Noren. The fresh Next.js app imports the Rooftop fonts stylesheet beside the other two and the test asserts that both Rooftop faces load for a latin and a latin-ext sample. The Vite app renders a Rooftop section beside its Noren one and the test asserts that the `:root, [data-theme]` primary override reaches all three, that the Rooftop section's TextField is recessed to Wet stone behind a Fog teal edge, and that the body is still Apricot. The build check requires the Rooftop block in the main stylesheet.

**Blocked by:** 02, 03

**Status:** resolved

**GitHub:** https://github.com/khiem90/k-ui-kit/issues/9

- [x] The Next.js smoke app imports `k-ui-kit/fonts/rooftop.css` beside the other two, and the test asserts both Rooftop faces load for both samples, with a `rooftopFaces` list kept in step with the Fonts Story and the build check's fonts table
- [x] The Vite smoke app renders the same two Components again inside `<section id="rooftop" data-theme="rooftop">`, and the test asserts the override colour on the primary Button inside the Ridgeline content, the Noren section, and the Rooftop section
- [x] The test asserts the Rooftop section's TextField has a Wet stone fill, a 2px Fog teal edge on every side, and that the section's computed `color-scheme` is dark, while the body is still Apricot
- [x] `tokenRgb` in the smoke script reads the Rooftop block by splitting at its selector, so each Theme's expected colours come from its own block
- [x] The build check requires `dist/styles/index.css` to carry a `:where([data-theme=rooftop])` block that declares `--kui-primary`, accepting either quoting of the attribute value
- [x] `pnpm smoke` passes

## Comments

2026-10-09: Landed on branch `claude/kind-lamport-q4wrek`. In `scripts/smoke-test.mjs` the Next.js layout imports `k-ui-kit/fonts/rooftop.css` after the Noren sheet, a `rooftopFaces` list holds the two Rooftop faces, and `verifyFaces("Rooftop", rooftopFaces)` runs beside the Ridgeline and Noren ones against the latin and latin-ext samples. The Vite app renders the same Button and TextField a third time inside `<section id="rooftop" data-theme="rooftop">`, and a new `verifyRooftopSubtree` asserts the override colour on that Button, a field with 2px edges on every side in the Rooftop border colour on the Rooftop surface field colour, a computed `color-scheme` of `dark` on the section, and a body still on Ridgeline's background. The Noren check and the Ridgeline field check now read `--kui-surface-field` rather than surface raised, since that is the role a field draws. `tokenRgb` splits the Tokens file at both Theme selectors, so each Theme's colours come from its own block. The build check's Rooftop block requirement landed with ticket 03 in `scripts/verify-build.mjs`, as a regex over both Theme names that accepts either quoting of the attribute value.

Verified with `pnpm smoke` in this container, which scaffolded both apps over the network, built them, and drove them in Chromium: every check passed, including "loads all 2 Rooftop faces in both ranges" on the Next.js page and the four Rooftop checks on the Vite page, with the field read as `2px 2px 2px 2px rgb(94, 116, 114) on rgb(26, 34, 36)`.
