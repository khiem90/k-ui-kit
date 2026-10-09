# 04: Prove the third Theme in fresh Consumer apps

**What to build:** The Consumer smoke test proves Rooftop the way it proves Noren. The fresh Next.js app imports the Rooftop fonts stylesheet beside the other two and the test asserts that both Rooftop faces load for a latin and a latin-ext sample. The Vite app renders a Rooftop section beside its Noren one and the test asserts that the `:root, [data-theme]` primary override reaches all three, that the Rooftop section's TextField is recessed to Wet stone behind a Fog teal edge, and that the body is still Apricot. The build check requires the Rooftop block in the main stylesheet.

**Blocked by:** 02, 03

**Status:** ready-for-agent

**GitHub:** https://github.com/khiem90/k-ui-kit/issues/9

- [ ] The Next.js smoke app imports `k-ui-kit/fonts/rooftop.css` beside the other two, and the test asserts both Rooftop faces load for both samples, with a `rooftopFaces` list kept in step with the Fonts Story and the build check's fonts table
- [ ] The Vite smoke app renders the same two Components again inside `<section id="rooftop" data-theme="rooftop">`, and the test asserts the override colour on the primary Button inside the Ridgeline content, the Noren section, and the Rooftop section
- [ ] The test asserts the Rooftop section's TextField has a Wet stone fill, a 2px Fog teal edge on every side, and that the section's computed `color-scheme` is dark, while the body is still Apricot
- [ ] `tokenRgb` in the smoke script reads the Rooftop block by splitting at its selector, so each Theme's expected colours come from its own block
- [ ] The build check requires `dist/styles/index.css` to carry a `:where([data-theme=rooftop])` block that declares `--kui-primary`, accepting either quoting of the attribute value
- [ ] `pnpm smoke` passes

## Comments
