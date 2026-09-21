# 10: Select

**What to build:** A Consumer assembles a Select from parts, sized to line up with TextField. Keyboard users open it, arrow through options, jump by typing, and pick with Enter.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Composite component built on the Radix Select Primitive, exposed as a namespace with root, trigger, content, item, and group parts; the trigger renders the inline chevron icon, items render the inline check icon when selected
- [ ] Controlled and uncontrolled via value, defaultValue, onValueChange; placeholder supported
- [ ] Sizes sm, md, lg on the trigger match TextField heights
- [ ] Arrow keys move through options, typeahead jumps to a match, Enter selects, Escape closes; disabled items are skipped
- [ ] Trigger accepts an accessible name via a visible label or aria-label; the listbox and option roles are exposed
- [ ] Parts forward refs, accept className, spread rest props
- [ ] Stories for Default, each size, with groups, with a disabled item, with a placeholder, and a controlled example; a play function opens with the keyboard, arrows, selects, and asserts the trigger text and callback
- [ ] axe passes on every Story; lint, typecheck, build pass
