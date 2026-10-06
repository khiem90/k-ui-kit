# 01: Ridgeline Tokens and Storybook canvas

**What to build:** A Consumer who imports the stylesheet gets the Ridgeline Token set, and Storybook shows it on an apricot canvas with no Theme toolbar. The new Token names exist alongside the old ones, with the old names pointing at Ridgeline values, so every Component still renders and every Story still passes while the Components move over one ticket at a time. A Tokens Story proves the colour pairs meet WCAG.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Every Token in the spec's Theme table exists under its role name, with the Ridgeline value and the palette name in a comment beside it
- [ ] The old Token names stay for now and resolve to the nearest Ridgeline value, so no Component loses a value mid-migration
- [ ] The dark Color scheme is gone: no dark media query block, no light or dark `data-theme` selectors, and the root declares a light colour-scheme
- [ ] Token selectors stay wrapped in `:where()`, so a Consumer's plain root override still wins (ADR 0001)
- [ ] Storybook's themes addon, its decorator, and its toolbar are removed, and the preview canvas uses the background Token
- [ ] A new Tokens Story renders the colour, shadow, radius, spacing, and type Tokens as swatches
- [ ] The Tokens Story's play function reads computed Token values and asserts at least 4.5:1 for every text pair the kit draws (foreground and foreground muted on background, surface raised, and tint; primary foreground on primary and primary hover; danger foreground on danger; danger on background and surface raised), and at least 3:1 for the border on surface raised and the focus ring on background and surface raised
- [ ] ADR 0001's consequence about dark values appearing twice is updated to match
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
