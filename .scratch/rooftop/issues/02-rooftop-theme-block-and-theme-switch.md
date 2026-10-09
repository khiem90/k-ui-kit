# 02: The Rooftop Theme block, the Theme switch, and its contrast proof

**What to build:** A Consumer sets `data-theme="rooftop"` on the html element, or on any ancestor, and every Component under it renders in Rooftop: a Wet stone page, Awning panels, Ticket text, Bulb primary, Stool secondary, fields recessed to Wet stone behind a Fog teal edge, Big Shoulders Display signage on every label, 4px controls and 10px panels, a black drop shadow under Buttons, a Bulb ring and glow on anything that floats, a Sign box tint, a Sign gold Dialog title, and a dark Color scheme. Without the attribute, Ridgeline is unchanged. In Storybook a third toolbar entry switches the canvas to Rooftop, and the Tokens Story proves every Rooftop pair meets WCAG. Text falls back to the stacks until ticket 03 lands.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A third block selected by `[data-theme="rooftop"]`, wrapped in `:where()` and placed after Noren's, fills every Token role with the value from the spec's Theme table, palette names in comments, declares `color-scheme: dark`, and leaves motion duration alone so the reduced-motion rule keeps the last word
- [ ] The header comment of `tokens.css` describes three Themes and says each carries its own Color scheme
- [ ] The attribute works on the html element and on any ancestor, and a Dialog opened from a Rooftop subtree renders in Rooftop
- [ ] The ThemeSwitch Story gains a Rooftop case: a Button inside a Rooftop wrapper is Bulb beside a Ridgeline one, and the `:root, [data-theme]` override reaches both
- [ ] The Tokens Story gains a Rooftop Story on its own root carrying the attribute, with the same contrast assertions, and it fails on any Token the Rooftop block leaves undeclared, the way the Noren Story does
- [ ] The Rooftop Tokens Story also asserts from computed style that a TextField rendered inside an open Dialog has a Wet stone fill on an Awning panel with a Fog teal edge, that the Dialog's box shadow carries the 2px Bulb ring, that a Tab trigger and a Button have 4px corners, that the Tabs list and the Dialog show no Rail, and that the computed `color-scheme` of the Theme root is dark
- [ ] Danger is #E58A6E, the stripe is #1E2829, and the tint is #141A1B, as the spec's table and notes record
- [ ] The Storybook toolbar global gains a Rooftop entry that sets the attribute on the html element, and the canvas turns Wet stone under Rooftop through the existing background Token
- [ ] The maintainer has checked each Component under Rooftop in Storybook against the board, read a 12px DataTable header and a Select group label in Big Shoulders Display at 800, and either accepted them or recorded the `--kui-font-button` fallback in the spec's Further notes
- [ ] axe passes on every Story under the default Theme; lint, typecheck, tests, and build pass

## Comments
