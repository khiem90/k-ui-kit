# 07: RadioGroup

**What to build:** A Consumer's RadioGroup is built from real radio inputs, so the browser provides the single Tab stop and arrow-key selection, and it is drawn in Ridgeline colours with no Radix underneath.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [ ] Items are native radio inputs sharing one generated name, or the Consumer's name when given
- [ ] Root renders the radiogroup role with the existing labelling and orientation wiring
- [ ] The group is one Tab stop, and arrow keys move the selection, as today
- [ ] Controlled and uncontrolled use the existing value, defaultValue, and onValueChange props; disabled items are skipped
- [ ] Items expose the same data-state values as today
- [ ] Radios are 22px; unchecked is surface raised with the 2px border, checked is Ember with a cream dot
- [ ] The group label uses the label style; item labels use the body font at 16px
- [ ] RadioGroup's CSS reads only the new Token names
- [ ] `@radix-ui/react-radio-group` is removed from the manifest and the lockfile
- [ ] Existing RadioGroup Stories pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
