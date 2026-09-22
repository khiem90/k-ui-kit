# 05: Switch

**What to build:** A Consumer renders a labelled Switch for an on/off setting. Screen readers announce it as a switch with its state, and keyboard users toggle it with Space.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] Simple component built on the Radix Switch Primitive with flat props: label, checked, defaultChecked, onCheckedChange, disabled
- [x] Label is associated; the control exposes the switch role and checked state
- [x] Thumb animates between positions; the animation is removed under reduced motion
- [x] Forwards ref, accepts className, spreads rest props
- [x] Stories for Default, on, disabled, and a controlled example; a play function toggles with Space and asserts state and callback
- [x] axe passes on every Story; lint, typecheck, build pass

## Comments

2026-09-21: Implemented in 1902c84 (Switch, stylesheet, Stories, changeset) and b79d193 (code review fixes). Verified locally: lint, typecheck, 43 Story tests in Chromium with axe (9 of them Switch), and build all pass. Decisions worth knowing. `className` goes on the root and every other prop, including the ref, goes to the button that carries the switch role, matching Checkbox and TextField. `required` and `value` are accepted beyond the ticket's five props because they reach the form through the hidden input Radix renders, and each has a Story. The track is the button at 44 by 24px, which meets the WCAG 2.2 target size without a larger hit area. The thumb slides with a transform transition on the motion Token, which is 0ms under reduced motion; no Story checks the animation since the spec rules out visual regression tests. The Component owns its checked state so the root carries data-state the way the Checkbox root does, and a Consumer targets both the same way. Review added a `--kui-radius-full` Token for pill shapes because ADR 0001 forbids a hard-coded radius, and the spec now says four radii. Enter also toggles the switch, which the APG lists as optional for a switch, and no Story locks that either way. Kit-wide, the class-name join is now in four Components, the primary hover mix in three, and the toggle prop docs are shared word for word between Checkbox and Switch, so a helper, a hover Token, and a shared toggle-props type are candidates for a later ticket.
