# 06: RadioGroup

**What to build:** A Consumer assembles a RadioGroup from parts and gets native radio keyboard behaviour: arrow keys move selection, Tab enters and leaves the group as one stop.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Composite component built on the Radix RadioGroup Primitive, exposed as a namespace with a root part and an item part that renders its own label
- [ ] Controlled and uncontrolled via value, defaultValue, onValueChange
- [ ] Arrow keys move selection and focus; the group is a single Tab stop; disabled items are skipped
- [ ] Group accepts an accessible name via a label part or aria-label
- [ ] Parts forward refs, accept className, spread rest props
- [ ] Stories for Default, with a disabled item, horizontal orientation, and a controlled example; a play function arrows through items and asserts selection and callback
- [ ] axe passes on every Story; lint, typecheck, build pass
