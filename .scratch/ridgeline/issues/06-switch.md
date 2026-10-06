# 06: Switch

**What to build:** A Consumer's Switch is a Ridgeline pill track that toggles with Space or Enter, reports its state to assistive technology, and submits in a form when it has a name, with no Radix underneath.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [ ] A button with the switch role and aria-checked is the interactive element; Space and Enter toggle it
- [ ] The root exposes the same data-state values as today
- [ ] When it has a name, a hidden input carries its value into the form, and required is honoured
- [ ] Off is a surface raised track with the 2px border and a muted thumb; on is an Ember track with a cream thumb
- [ ] A Story asserts the switch's value appears in a submitted form
- [ ] Switch's CSS reads only the new Token names
- [ ] `@radix-ui/react-switch` is removed from the manifest and the lockfile
- [ ] Existing Switch Stories pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
