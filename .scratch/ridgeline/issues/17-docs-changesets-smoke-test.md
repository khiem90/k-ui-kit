# 17: Docs, changesets, and smoke test

**What to build:** A Consumer reading the Getting started page and the README learns the Ridgeline kit as it ships: one stylesheet, opt-in fonts, a light-only Theme, Token overrides, and no runtime dependencies. The release notes describe the Ridgeline kit, and the packed package is proven again in fresh Next.js and Vite apps.

**Blocked by:** 02 (Bundled fonts), 16 (Remove old Token names and lock out dependencies)

**Status:** ready-for-agent

- [ ] The Getting started page covers the fonts import, Ridgeline as the only Theme with a light Color scheme only, and overriding Tokens with the new role names
- [ ] The Getting started page drops the dark mode and theme attribute instructions, including the override pattern that restated the dark media query
- [ ] The README describes Ridgeline, the fonts import, and zero runtime dependencies, and no longer mentions Radix or a dark Theme
- [ ] The pending changesets are rewritten to describe the Ridgeline kit with no runtime dependencies, keeping the first release a minor bump
- [ ] `pnpm smoke` passes: a server component page renders every Component in a fresh Next.js app, and the Vite bundle contains only the imported Components and the stylesheet
- [ ] The smoke test loads the fonts stylesheet in at least one app and the fonts resolve
- [ ] Lint, typecheck, tests, and build pass
