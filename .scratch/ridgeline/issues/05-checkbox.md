# 05: Checkbox

**What to build:** A Consumer's Checkbox is a real checkbox input drawn by the kit in Ridgeline colours. It keeps the indeterminate state, Space to toggle, and form submission, with no Radix underneath.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] A native checkbox input is the interactive element, visually replaced by a 22px drawn box
- [x] Indeterminate is set on the input's DOM property, so assistive technology reports the mixed state
- [x] The root exposes the same data-state values as today: checked, unchecked, and indeterminate
- [x] Name, value, and required work through the native input
- [x] Unchecked is surface raised with the 2px border; checked is Ember with a cream check; indeterminate is Ember with a cream bar
- [x] The label uses the body font at 16px; `hideLabel` still gives an accessible name with no visible text
- [x] A Story asserts the checkbox's value appears in a submitted form
- [x] Checkbox's CSS reads only the new Token names
- [x] `@radix-ui/react-checkbox` is removed from the manifest and the lockfile
- [x] Existing Checkbox Stories, and the DataTable selection Stories that use Checkbox, pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 6855f18 on branch `ridgeline-05-checkbox`. Checkbox renders a native checkbox input inside a 24px `kui-checkbox__control`. The input fills the control at opacity 0, and the 22px `kui-checkbox__box` sits on top with `pointer-events: none`, so the browser handles clicks, label clicks, Space, and form submission. A layout effect sets the input's `indeterminate` property from the prop. A click clears that property, so the change handler puts it back straight away. Without that, a Consumer that ignores the change would never re-render to restore it. Toggling a mixed box still reports true. The root keeps `data-state` (checked, unchecked, indeterminate), `data-disabled`, and `data-label-hidden`. `@radix-ui/react-checkbox` is gone from package.json and pnpm-lock.yaml.

Styling reads only Ridgeline Tokens. Unchecked is surface raised with a 2px border. Checked and indeterminate fill with primary and show a primary-foreground check or bar, and hover darkens them to primary hover. The spec gives no radius for a 22px box, and the field radius (12px) would make it round, so the box uses `calc(var(--kui-radius-field) / 2)`. That's 6px today, and it follows a future Theme's field radius.

Three Story lines changed, each one because it read Radix markup a native input lacks. Indeterminate asserted `aria-checked="mixed"` and now asserts the `indeterminate` DOM property, before and after a click. Required asserted `aria-required="true"` and now uses `toBeRequired()`, which reads the native attribute. FocusThroughRef types its ref as `HTMLInputElement`. Every other behavioural assertion is untouched. Two new Stories: NativeInput (the checkbox role is an input of type checkbox, and a checked box submits its value) and DataState (the root's three data-state values). InForm already asserted the submitted value. The Tokens Story gains edge pairs for primary on background and primary on surface raised, since the filled box draws them.

Verified with `pnpm check`: lint, typecheck, 112 Story tests in Chromium with axe as an error (all 12 DataTable Stories pass unchanged), and the build with its verifier. I also read computed styles in Storybook. The box is 22px, the target is 24px, the label is Nunito Sans at 16px, and Tab puts the Ember ring around the drawn box.

For later tickets. The ref and the spread props now go to an `HTMLInputElement`, and `CheckboxProps` extends `InputHTMLAttributes`, because the element with the checkbox role is now an input. Ticket 17's changeset should call this a type change for Consumers who typed the ref as a button. Ticket 15 plans to tint selected rows Peach sky, and Ember on Peach sky is under 3:1. The cream check inside the box still carries the state, but ticket 15 should look at it. The DataTable selection margin assumes a 1.5rem control, which still holds.
