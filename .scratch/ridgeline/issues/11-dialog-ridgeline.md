# 11: Dialog Ridgeline styling

**What to build:** A Consumer's Dialog has an arched top with a centred header, the kit's signature shape, and the arch stays well proportioned at any width.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas), 10 (Dialog behaviour without Radix)

**Status:** ready-for-agent

- [ ] The content is surface raised with the floating shadow over the overlay Token
- [ ] The top corners use the arch radius, capped at half the content's width; the bottom corners use the card radius
- [ ] The header is centred: Title in the display font, italic, in Ember; Description in muted body text below it
- [ ] The close button sits fully inside the arch's curve at every supported width
- [ ] A Story shows a narrow and a wide Dialog, so the arch cap can be checked by eye
- [ ] Dialog's CSS reads only the new Token names
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
