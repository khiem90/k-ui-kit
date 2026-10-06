# 12: Select behaviour without Radix

**What to build:** A Consumer's Select is a listbox written in the kit, anchored to its trigger with the positioning from Tooltip, and keyboard and form behaviour match today. It keeps today's look; Ridgeline styling is ticket 13.

**Blocked by:** 09 (Tooltip), for the popover and anchoring pattern

**Status:** ready-for-agent

- [ ] The trigger has the combobox role and the existing labelling; the list is a manual popover with the listbox role, anchored below the trigger and at least as wide, flipping when there isn't room
- [ ] Opening moves focus into the list onto the selected option, or the first one
- [ ] Arrow keys, Home, End, typeahead, Enter, and Space behave as today; disabled options are skipped; Escape closes and returns focus to the trigger
- [ ] Groups have the group role labelled by their label
- [ ] The list closes on an outside pointer press or when focus leaves it; the rest of the page is not hidden from assistive technology
- [ ] The trigger no longer needs to leave the Tab order while the list is open, since nothing is aria-hidden
- [ ] A visually hidden native select mirrors the value, so name, required, and form reset behave as today
- [ ] The list scrolls natively with a visible scrollbar; the scroll-up and scroll-down buttons are removed
- [ ] Parts expose the same data-state values as today
- [ ] A Story asserts the list sits below its trigger by comparing bounding boxes
- [ ] A Story asserts the selected value appears in a submitted form, and that required blocks submission when empty
- [ ] `@radix-ui/react-select` is removed from the manifest and the lockfile, and no Radix package remains
- [ ] Existing Select Stories pass with their behavioural assertions unchanged; any Story that queried the scroll buttons is updated and the change is noted in this ticket's comments
- [ ] axe passes on every Story, including those that end with the list open; lint, typecheck, tests, and build pass
