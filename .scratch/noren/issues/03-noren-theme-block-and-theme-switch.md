# 03: The Noren Theme block, the Theme switch, and its contrast proof

**What to build:** A Consumer sets `data-theme="noren"` on the html element, or on any ancestor, and every Component under it renders in Noren: Washi and Paper surfaces, Cat text, Lantern primary, Cedar secondary, cloth Tabs on a Cedar Rail, underlined fields, flat 4px Buttons, a Rail on the Dialog instead of the arch, an Old wall overlay, Broth highlights, and the lantern glow on popups. Without the attribute, Ridgeline is unchanged. In Storybook a Theme toolbar switches the canvas between the two, and the Tokens Story proves every Noren pair meets WCAG. Text falls back to the stacks until ticket 04 lands.

**Blocked by:** 01, 02

**Status:** ready-for-agent

- [ ] A second block selected by `[data-theme="noren"]`, wrapped in `:where()` and placed after Ridgeline's, fills every Token role with the value from the spec's Theme table, palette names in comments, and declares `color-scheme: light`
- [ ] The attribute works on the html element and on any ancestor, and a Dialog opened from a Noren subtree renders in Noren
- [ ] A Story renders a Button inside a Noren wrapper beside one outside it and asserts from computed style that their backgrounds are Lantern and Ember, and that a plain `:root` override of primary beats both
- [ ] The Tokens Story runs once per Theme, each on its own root carrying the attribute, with the same contrast assertions, and the Noren Story fails on any undefined Token
- [ ] The Noren Tokens Story also asserts from computed style that a rendered TextField has a 3px bottom border and no top border, that a Tab trigger has square top corners, and that the Tabs list and the Dialog show a 10px Rail
- [ ] Muted text is #574333, danger is #9B2335, and the stripe is #F7EED8, as the spec's table and notes record
- [ ] Storybook has a Theme toolbar global that sets the attribute on the html element, defaulting to Ridgeline, and the canvas turns Washi under Noren through the existing background Token
- [ ] axe passes on every Story under the default Theme, and the maintainer has checked each Component under Noren in Storybook against the board; lint, typecheck, tests, and build pass
