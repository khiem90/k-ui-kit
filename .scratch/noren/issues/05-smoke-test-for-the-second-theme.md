# 05: Prove the second Theme in fresh Consumer apps

**What to build:** The Consumer smoke test proves Noren the way it proves Ridgeline. The fresh Next.js app sets `data-theme="noren"` on its html element and imports the Noren fonts stylesheet, and the test asserts that the computed primary is Lantern and that every Noren face loads for a latin and a latin-ext sample. The Vite app keeps its Ridgeline `:root` override check and gains an assertion that a plain `:root` override still wins under the attribute.

**Blocked by:** 03, 04

**Status:** ready-for-agent

- [ ] The Next.js smoke app carries the attribute on html and imports both fonts stylesheets, and the test asserts the computed primary of a rendered Button is Lantern
- [ ] The test asserts every Noren face loads for both samples in the Next.js build, kept in step with the Fonts Story
- [ ] The Vite smoke app renders a Noren subtree beside its Ridgeline content and the test asserts the app's `:root` primary override reaches both
- [ ] The build check asserts the main stylesheet contains the Noren block
- [ ] `pnpm smoke` passes
