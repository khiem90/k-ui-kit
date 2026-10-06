# 09: Tooltip

**What to build:** A Consumer's Tooltip appears next to its trigger and flips to the other side when there isn't room, placed by CSS anchor positioning in the browser's top layer. It's a Bark bubble with no arrow. This ticket sets up the popover and positioning pattern that Select reuses.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] The content is a manual popover, so it renders in the top layer without a portal
- [x] It is anchored to the trigger on the requested side with the existing offset, with position-try fallbacks that flip it to the opposite side
- [x] The popover and anchoring setup lives somewhere Select can reuse it
- [x] Opening on hover after the delay, opening on focus, closing on Escape, controlled and uncontrolled open state, and the trigger's description link all behave as today
- [x] The kit still writes the same data-state values as today
- [x] Bark fill, cream body text at 14px, card radius, floating shadow, and no arrow
- [x] A Story asserts the tooltip sits next to its trigger on the expected side by comparing bounding boxes, so a tooltip that lands in the middle of the viewport fails
- [x] Tooltip's CSS reads only the new Token names
- [x] `@radix-ui/react-tooltip` is removed from the manifest and the lockfile
- [x] Existing Tooltip Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 224f138 on branch ridgeline-09-tooltip. The tooltip box is a `popover="manual"` element that mounts only while open and shows itself from its ref, so it sits in the top layer next to its trigger in the DOM with no portal. CSS anchor positioning places it with `position-area` on the requested side, the 6px offset as the margin facing the trigger, and `position-try-fallbacks` set to flip-block or flip-inline. Hover opens after the delay and ignores touch, focus opens at once unless a pointer press caused it, a click or blur closes it, and Escape anywhere in the document closes it. Opening one tooltip closes any other, as Radix did. The trigger's `aria-describedby` points at the box only while it is open, joined with any id the child already had. The trigger and box keep data-state "open" and "closed", and the box keeps `data-side`, now measured from where it landed. `@radix-ui/react-tooltip` is gone from package.json and pnpm-lock.yaml.

The look is a Bark fill, cream body text at 14px, the card radius, the floating shadow, and no arrow. The CSS reads only new Token names. Tokens.stories.tsx gained the surface-raised on foreground pair.

Every existing behavioural assertion in the Stories is unchanged. `expectPlacedOn` now also checks that the gap equals the 6px offset and that the box overlaps the trigger on the other axis, so a box that falls back to the centre of the viewport fails. I checked this by breaking the anchor name, which failed all six placement Stories. EscapesClippingContainer is new. It puts the trigger in an overflow-hidden box with its own stacking context, then asserts the tooltip renders inside the canvas and is the top element at its centre. StaysOpenWhilePointerIsOnTheBox is also new and covers WCAG 1.4.13. Verified with `pnpm check`: lint, typecheck, 112 Story tests in Chromium with axe as an error, and the build and its verifier.

Decisions a later ticket needs. The anchoring lives in `src/popover.tsx` (`useAnchoredPopover`, `composeRefs`), which tsup builds to `dist/popover.js` through a new entry line beside `src/icons.tsx`. verify-build checks that file. Select imports it as `../../popover.js`. Each Component's CSS must reset the UA popover box inside `@supports (position-area: top)` with `inset: auto` and `margin: 0`. Without anchor positioning the box keeps the UA centring, as ADR 0004 says. Radix's 8px collision padding and its slide along the viewport edge are gone, and the box only flips. Hoverable content uses a 100ms grace timer in place of Radix's pointer polygon. With no arrow the gap is 6px, where Radix added the 5px arrow on top.
