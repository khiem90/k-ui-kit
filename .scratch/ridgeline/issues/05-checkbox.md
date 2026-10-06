# 05: Checkbox

**What to build:** A Consumer's Checkbox is a real checkbox input drawn by the kit in Ridgeline colours. It keeps the indeterminate state, Space to toggle, and form submission, with no Radix underneath.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [ ] A native checkbox input is the interactive element, visually replaced by a 22px drawn box
- [ ] Indeterminate is set on the input's DOM property, so assistive technology reports the mixed state
- [ ] The root exposes the same data-state values as today: checked, unchecked, and indeterminate
- [ ] Name, value, and required work through the native input
- [ ] Unchecked is surface raised with the 2px border; checked is Ember with a cream check; indeterminate is Ember with a cream bar
- [ ] The label uses the body font at 16px; `hideLabel` still gives an accessible name with no visible text
- [ ] A Story asserts the checkbox's value appears in a submitted form
- [ ] Checkbox's CSS reads only the new Token names
- [ ] `@radix-ui/react-checkbox` is removed from the manifest and the lockfile
- [ ] Existing Checkbox Stories, and the DataTable selection Stories that use Checkbox, pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
