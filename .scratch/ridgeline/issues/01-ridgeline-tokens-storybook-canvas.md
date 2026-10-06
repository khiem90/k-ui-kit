# 01: Ridgeline Tokens and Storybook canvas

**What to build:** A Consumer who imports the stylesheet gets the Ridgeline Token set, and Storybook shows it on an apricot canvas with no Theme toolbar. The new Token names exist alongside the old ones, with the old names pointing at Ridgeline values, so every Component still renders and every Story still passes while the Components move over one ticket at a time. A Tokens Story proves the colour pairs meet WCAG.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Every Token in the spec's Theme table exists under its role name, with the Ridgeline value and the palette name in a comment beside it
- [x] The old Token names stay for now and resolve to the nearest Ridgeline value, so no Component loses a value mid-migration
- [x] The dark Color scheme is gone: no dark media query block, no light or dark `data-theme` selectors, and the root declares a light colour-scheme
- [x] Token selectors stay wrapped in `:where()`, so a Consumer's plain root override still wins (ADR 0001)
- [x] Storybook's themes addon, its decorator, and its toolbar are removed, and the preview canvas uses the background Token
- [x] A new Tokens Story renders the colour, shadow, radius, spacing, and type Tokens as swatches
- [x] The Tokens Story's play function reads computed Token values and asserts at least 4.5:1 for every text pair the kit draws (foreground and foreground muted on background, surface raised, and tint; primary foreground on primary and primary hover; danger foreground on danger; danger on background and surface raised), and at least 3:1 for the border on surface raised and the focus ring on background and surface raised
- [x] ADR 0001's consequence about dark values appearing twice is updated to match
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in df066b2 on branch `ridgeline-01-tokens-storybook-canvas`. `src/styles/tokens.css` now holds every role from the spec's Theme table on `:where(:root)`, with palette names in comments and `color-scheme: light`. The dark block, the dark media query, and both `data-theme` selectors are gone. The old names sit in a second `:where(:root)` block and point at new Tokens through `var()`: background subtle at surface raised, radius sm, md, and lg at radius field, radius full at radius pill, and font family at font body. A Consumer override of a new name reaches the old one too. Storybook lost the themes addon (removed from devDependencies too), its decorator, and its toolbar, and the canvas body uses the background and font body Tokens. The new `Tokens` Story (`src/docs/Tokens.stories.tsx`) draws swatches for colour, shadow, radius, spacing, and type, plus a chip for each colour pair. Its play function fails on any undefined Token, checks the contrast formula against known WCAG values, resolves each colour Token through the browser, and asserts 4.5:1 for the eleven text pairs and 3:1 for the border and focus ring pairs. ADR 0001's consequence about dark values appearing twice now says each Token is declared once. Verified: `pnpm check` passes with 108 Story tests in Chromium with axe, and I looked at the Tokens Story in Storybook on the apricot canvas.

One deviation from the spec. The board's muted colour #6b4f45 is 4.3:1 on Peach sky, and the Story caught it. Foreground muted is now #654b41, the nearest step towards Bark that clears 4.5:1 there (4.6:1). The border keeps #6b4f45. I updated the spec's Theme table and measured pairs to match.

For later tickets. Spacing is now in px on the Ridgeline scale, so space 5 to 8 grew (24, 32, 48, 72). Component tickets should read `--kui-radius-field` and friends directly; ticket 16 deletes the old names. The Getting started page still describes the dark Theme and the toolbar, and `pnpm smoke` still asserts dark panels and parses a `data-theme="dark"` block out of tokens.css, so it fails until ticket 17 rewrites both. Font families name Fraunces, Josefin Sans, and Nunito Sans, and ticket 02 supplies the font files.
