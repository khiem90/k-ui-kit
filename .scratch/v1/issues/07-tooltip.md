# 07: Tooltip

**What to build:** A Consumer wraps any focusable element in a Tooltip. It opens on hover and on keyboard focus, closes on Escape, and is announced as the trigger's description.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] Simple component built on the Radix Tooltip Primitive with flat props: content, side, delay, open, defaultOpen, onOpenChange; the child is the trigger
- [x] A single provider is handled internally so the Consumer does not have to add one
- [x] Opens on hover and focus, closes on Escape and blur, positions on the requested side with collision handling
- [x] Content is linked to the trigger via aria-describedby; the tooltip has the tooltip role
- [x] Stories for Default, each side, with a delay, and a controlled example; a play function focuses the trigger with Tab, asserts the tooltip is visible, presses Escape, asserts it is gone
- [x] axe passes on every Story; lint, typecheck, build pass

## Comments

2026-09-22: Implemented in 08729af (Tooltip, stylesheet, Stories, changeset) and a20a153 (code review fixes). Verified locally: lint, typecheck, 67 Story tests in Chromium with axe (12 of them Tooltip), and build all pass, and both Themes were checked by eye in Storybook. Decisions worth knowing. Tooltip is a simple Component: the child is the trigger, and `className`, the ref, and every other prop go to the box, the only element the kit renders. The box exists only while open, so a ref reads null while closed; the MeasuredThroughRef Story uses a callback ref for that reason. Each Tooltip renders its own Radix provider, which is the reading of "a single provider handled internally" that keeps the Consumer's code provider-free. The cost is Radix's skip-delay: inside one shared provider a neighbouring tooltip opens at once within 300ms of another closing, and per-instance providers cannot share that, so every tooltip waits its full delay. An optional exported provider would restore it and is a candidate for a later ticket. Tooltip owns its open state so the trigger and the box carry data-state "open" or "closed", the kit's words, in place of Radix's closed, delayed-open, and instant-open. The CSS keys the entrance animation on the open state only, because a closed box with the same animation makes Radix hold it in the DOM until the animation ends. The animation is scale only: a fade leaves the box half transparent when axe measures its contrast at the end of a Story. Hoverable content stays on, since WCAG 1.4.13 requires the pointer to be able to reach the tooltip, so leaving the trigger closes through Radix's grace area rather than at once. The box is portaled to the end of body with no z-index; a layering Token is a decision for the Dialog ticket. `sideOffset` and `collisionPadding` are px numbers in the component because Radix takes numbers, so they sit outside the Token system, which ADR 0001 scopes to CSS. The Stories query the box through document.body because it renders outside the canvas, and the four side Stories share one play function that reads the side from args.
