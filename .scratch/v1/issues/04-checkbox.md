# 04: Checkbox

**What to build:** A Consumer renders a labelled Checkbox that supports checked, unchecked, and indeterminate states, controlled or uncontrolled, and keyboard users toggle it with Space. DataTable will reuse this Component for row selection.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] Simple component built on the Radix Checkbox Primitive with flat props: label, checked, defaultChecked, onCheckedChange, indeterminate, disabled
- [x] Label is associated and clicking it toggles the box
- [x] Indeterminate renders its own icon and exposes the mixed state to assistive technology
- [x] Forwards ref, accepts className, spreads rest props
- [x] Stories for Default, checked, indeterminate, disabled, and a controlled example; a play function toggles with Space and asserts the state and callback
- [x] axe passes on every Story; lint, typecheck, build pass

## Comments

2026-09-21: Implemented in 5a8dddf (Checkbox, stylesheet, icons module, Stories, changeset) and e02301c (code review fixes). Verified locally: lint, typecheck, 34 Story tests in Chromium with axe (10 of them Checkbox), and build all pass. Decisions worth knowing. `className` goes on the root and every other prop, including the ref, goes to the button that carries the checkbox role, following the TextField precedent; the ticket names no target for rest props and the prop types document the split. `indeterminate` is a flat prop the Consumer owns: while it is set the box shows and announces mixed, toggling reports true, and the Consumer clears the prop. The box never clears it itself the way a native checkbox does. The Component owns its checked state so Radix stays controlled; passing the prop straight through would make an uncontrolled box toggled while mixed land on a stale value, and Radix warns on the controlled switch. `required` and `value` are accepted beyond the ticket's six props because they reach the form through the hidden input Radix renders, and each has a Story. The button is a 24px target with the visible square drawn inside it, for the WCAG 2.2 target size, which axe does not check by default. `label` is required and always visible, so ticket 12 needs a hidden-label affordance for row and select-all boxes; a comment there says so. Kit-wide, the class-name join now appears in three Components and the primary hover mix in two, so a shared helper and a hover Token are candidates for a later ticket.
