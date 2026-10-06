# 13: Select Ridgeline styling

**What to build:** A Consumer's Select trigger matches TextField, and its list is a cream Ridgeline card whose highlighted option is visible to keyboard users.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas), 12 (Select behaviour without Radix)

**Status:** ready-for-agent

- [ ] The trigger matches TextField: surface raised, field radius, 2px border, Ember border plus focus ring on focus, and the same three heights
- [ ] The list is surface raised with the card radius and floating shadow
- [ ] Options use the field radius; the selected option shows an Ember check
- [ ] The highlighted option gets a Peach sky fill and the focus ring, since the fill alone can't serve as the focus indicator
- [ ] Group labels use the label style
- [ ] Select's CSS reads only the new Token names
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
