---
"k-ui-kit": minor
---

Add Tooltip: a short description of any focusable element. It opens on hover after a delay and at once on keyboard focus, stays open while the pointer moves onto it, closes on Escape and blur, and is read as the trigger's description. The box is a popover in the top layer, so no portal is needed and no overflow or stacking context clips it. CSS anchor positioning places it 6px from the trigger on the side you ask for and flips it to the opposite side when it would not fit. Controlled or uncontrolled, with a configurable side and hover delay. It is a Bark card with cream text and no arrow.

If you used a build from `main` before this release, the box had an arrow and slid along the viewport edge to stay inside it. Now it only flips.
