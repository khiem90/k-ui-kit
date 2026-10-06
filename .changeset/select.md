---
"k-ui-kit": minor
---

Add Select: a composite Component with Root, Trigger, Content, Item, and Group parts. The trigger shows the picked option or a placeholder, drawn like a TextField in the same three sizes. Enter, Space, the arrow keys, and a click open the list, arrows move through the options and skip disabled ones, Home and End jump to the ends, typing jumps to a match, Enter picks, and Escape closes and returns focus to the trigger. The list is a cream card in the top layer, placed below the trigger with CSS anchor positioning and flipped above when it would not fit. A long list scrolls natively. Controlled or uncontrolled. Inside a form, a hidden native select submits its value under the name it is given and honours `required`.

If you used a build from `main` before this release, several behaviours changed. The rest of the page is no longer hidden from assistive technology while the list is open, and the trigger keeps its Tab stop. Tab now closes the list and moves on to the next control instead of being swallowed, and the list also closes on a press outside it. A form reset returns the Select to the value it started with and calls `onValueChange` with that value, or with `""` if it started empty, where it used to pass `undefined`. The scroll buttons at either end of a long list are gone. `aria-selected` follows the value, not focus.
