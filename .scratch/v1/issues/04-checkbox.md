# 04: Checkbox

**What to build:** A Consumer renders a labelled Checkbox that supports checked, unchecked, and indeterminate states, controlled or uncontrolled, and keyboard users toggle it with Space. DataTable will reuse this Component for row selection.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Simple component built on the Radix Checkbox Primitive with flat props: label, checked, defaultChecked, onCheckedChange, indeterminate, disabled
- [ ] Label is associated and clicking it toggles the box
- [ ] Indeterminate renders its own icon and exposes the mixed state to assistive technology
- [ ] Forwards ref, accepts className, spreads rest props
- [ ] Stories for Default, checked, indeterminate, disabled, and a controlled example; a play function toggles with Space and asserts the state and callback
- [ ] axe passes on every Story; lint, typecheck, build pass
