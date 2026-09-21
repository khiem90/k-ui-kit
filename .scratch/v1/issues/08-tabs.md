# 08: Tabs

**What to build:** A Consumer assembles Tabs from parts. Arrow keys move between tab headers, only the active panel is in the Tab order, and the active state is exposed for styling.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Composite component built on the Radix Tabs Primitive, exposed as a namespace with root, list, trigger, and content parts
- [ ] Controlled and uncontrolled via value, defaultValue, onValueChange
- [ ] Arrow keys move between triggers with automatic activation; Home and End jump to first and last; disabled triggers are skipped
- [ ] Inactive panels are not rendered into the Tab order; active trigger and panel expose their state via data attributes
- [ ] Parts forward refs, accept className, spread rest props
- [ ] Stories for Default, with a disabled tab, vertical orientation, and a controlled example; a play function arrows across tabs and asserts the visible panel changes
- [ ] axe passes on every Story; lint, typecheck, build pass
