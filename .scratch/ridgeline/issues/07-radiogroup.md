# 07: RadioGroup

**What to build:** A Consumer's RadioGroup is built from real radio inputs, so the browser provides the single Tab stop and arrow-key selection, and it is drawn in Ridgeline colours with no Radix underneath.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] Items are native radio inputs sharing one generated name, or the Consumer's name when given
- [x] Root renders the radiogroup role with the existing labelling and orientation wiring
- [x] The group is one Tab stop, and arrow keys move the selection, as today
- [x] Controlled and uncontrolled use the existing value, defaultValue, and onValueChange props; disabled items are skipped
- [x] Items expose the same data-state values as today
- [x] Radios are 22px; unchecked is surface raised with the 2px border, checked is Ember with a cream dot
- [x] The group label uses the label style; item labels use the body font at 16px
- [x] RadioGroup's CSS reads only the new Token names
- [x] `@radix-ui/react-radio-group` is removed from the manifest and the lockfile
- [x] Existing RadioGroup Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 53a2812 on branch ridgeline-07-radiogroup. Each RadioGroup.Item is a native radio input. All items share one name, generated with useId unless the Consumer passes `name`, so the browser gives the group its single Tab stop and its arrow-key selection, and two groups on a page stay apart. Root is a plain div with the radiogroup role, aria-labelledby or aria-label as before, aria-orientation, aria-required, and data-disabled. Items keep data-state and data-disabled on their root. `@radix-ui/react-radio-group` is out of package.json and pnpm-lock.yaml. The input sits invisible over a 24px control and the kit draws a 22px circle under it. Unchecked is surface raised with a 2px border, and hover darkens the border to foreground. Checked is primary with a cream dot, and checked hover uses primary hover. The focus ring sits on the circle. The group label uses the label font, case, and tracking at weight 600, and item labels use the body font at 16px. The CSS reads only Ridgeline Token names. I checked the look in Storybook screenshots.

Verified with `pnpm check`: lint, typecheck, 112 Story tests in Chromium with axe as an error, and the build and its verifier. The existing RadioGroup Stories keep every behavioural assertion. Two of them changed outside their assertions. FocusThroughRef now types its item ref as HTMLInputElement, and the pressArrow helper lost its comment about Radix timing. Two Stories are new. NativeRadios checks the inputs, the shared generated name, the Consumer's name, and that two groups don't share a selection. ResetRestoresDefault checks a form reset.

Decisions a later ticket needs. The item ref and props now type as `HTMLInputElement` and `InputHTMLAttributes`, minus value, type, name, children, checked, and defaultChecked. The ref still lands on the element with the radio role, which is what the frozen API promises, but ticket 17's changeset should mention the type change. Checkbox will hit the same question. A form reset now returns an uncontrolled group to defaultValue, as native radios do, where Radix cleared it. A controlled group ignores the reset. Radix put `dir="ltr"`, `tabindex="0"`, and an inline outline style on the root. Those are gone, so the group inherits direction from the page. A Consumer's onChange on an item still runs, before the kit reports the value.
