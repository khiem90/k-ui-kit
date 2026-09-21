# 07: Tooltip

**What to build:** A Consumer wraps any focusable element in a Tooltip. It opens on hover and on keyboard focus, closes on Escape, and is announced as the trigger's description.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Simple component built on the Radix Tooltip Primitive with flat props: content, side, delay, open, defaultOpen, onOpenChange; the child is the trigger
- [ ] A single provider is handled internally so the Consumer does not have to add one
- [ ] Opens on hover and focus, closes on Escape and blur, positions on the requested side with collision handling
- [ ] Content is linked to the trigger via aria-describedby; the tooltip has the tooltip role
- [ ] Stories for Default, each side, with a delay, and a controlled example; a play function focuses the trigger with Tab, asserts the tooltip is visible, presses Escape, asserts it is gone
- [ ] axe passes on every Story; lint, typecheck, build pass
