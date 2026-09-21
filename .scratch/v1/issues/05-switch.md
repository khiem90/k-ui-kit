# 05: Switch

**What to build:** A Consumer renders a labelled Switch for an on/off setting. Screen readers announce it as a switch with its state, and keyboard users toggle it with Space.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Simple component built on the Radix Switch Primitive with flat props: label, checked, defaultChecked, onCheckedChange, disabled
- [ ] Label is associated; the control exposes the switch role and checked state
- [ ] Thumb animates between positions; the animation is removed under reduced motion
- [ ] Forwards ref, accepts className, spreads rest props
- [ ] Stories for Default, on, disabled, and a controlled example; a play function toggles with Space and asserts state and callback
- [ ] axe passes on every Story; lint, typecheck, build pass
