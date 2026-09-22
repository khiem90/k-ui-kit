# 06: RadioGroup

**What to build:** A Consumer assembles a RadioGroup from parts and gets native radio keyboard behaviour: arrow keys move selection, Tab enters and leaves the group as one stop.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] Composite component built on the Radix RadioGroup Primitive, exposed as a namespace with a root part and an item part that renders its own label
- [x] Controlled and uncontrolled via value, defaultValue, onValueChange
- [x] Arrow keys move selection and focus; the group is a single Tab stop; disabled items are skipped
- [x] Group accepts an accessible name via a label part or aria-label
- [x] Parts forward refs, accept className, spread rest props
- [x] Stories for Default, with a disabled item, horizontal orientation, and a controlled example; a play function arrows through items and asserts selection and callback
- [x] axe passes on every Story; lint, typecheck, build pass

## Comments

2026-09-21: Implemented in a72ef7f (RadioGroup parts, stylesheet, Stories, changeset) and aba001c (code review fixes). Verified locally: lint, typecheck, 55 Story tests in Chromium with axe (12 of them RadioGroup), and build all pass. Decisions worth knowing. The parts are Root, Item, and Label. Radix's Indicator is folded into Item, which renders the button and its own label the way Checkbox does, and Label is the kit's own part since Radix has none. Item takes the label as a `label` prop, matching Checkbox and Switch, rather than as children. Root owns the selected value so each item carries data-state and data-disabled on its root, and it keeps Radix controlled at all times by passing null for no selection, which Radix 1.4 accepts. Radix calls back with null when a form reset clears an uncontrolled group; Root clears its own state and does not forward that to onValueChange, since a native reset fires no change event either. `orientation` sets the layout, aria-orientation, and data-orientation but never reaches Radix, because Radix would limit the arrow keys to one axis and native radios answer all four. A Consumer coming from Radix will notice that a horizontal group still answers Up and Down. Root generates the label id, the Label part renders it, and Root sets aria-labelledby unless the Consumer passes aria-label, so the name is in server HTML and an aria-label group carries no dangling reference. The Label part does not accept id for that reason. `name`, `required`, and a group-level `disabled` go beyond the ticket's bullets because Radix wires them through the hidden inputs and the group context, and each has a Story. `dir` is not exposed, since right-to-left is out of scope for v1. The play functions hold each arrow key across Radix's zero-delay focus timer through a helper, because user-event releases a key in the same task it presses it and Radix selects on arrow-driven focus only while the key is down. Kit-wide, the radio CSS repeats Checkbox's 24px-button-with-the-shape-inside rule set, the class-name join is now in five Components, and verify-build.mjs takes two lines per Component, so a shared control stylesheet, a class helper, and a build check derived from the entry's exports are candidates for a later ticket.
