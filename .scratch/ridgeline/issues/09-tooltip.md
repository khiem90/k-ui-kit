# 09: Tooltip

**What to build:** A Consumer's Tooltip appears next to its trigger and flips to the other side when there isn't room, placed by CSS anchor positioning in the browser's top layer. It's a Bark bubble with no arrow. This ticket sets up the popover and positioning pattern that Select reuses.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [ ] The content is a manual popover, so it renders in the top layer without a portal
- [ ] It is anchored to the trigger on the requested side with the existing offset, with position-try fallbacks that flip it to the opposite side
- [ ] The popover and anchoring setup lives somewhere Select can reuse it
- [ ] Opening on hover after the delay, opening on focus, closing on Escape, controlled and uncontrolled open state, and the trigger's description link all behave as today
- [ ] The kit still writes the same data-state values as today
- [ ] Bark fill, cream body text at 14px, card radius, floating shadow, and no arrow
- [ ] A Story asserts the tooltip sits next to its trigger on the expected side by comparing bounding boxes, so a tooltip that lands in the middle of the viewport fails
- [ ] Tooltip's CSS reads only the new Token names
- [ ] `@radix-ui/react-tooltip` is removed from the manifest and the lockfile
- [ ] Existing Tooltip Stories pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
