# 08: Tabs

**What to build:** A Consumer assembles Tabs from parts. Arrow keys move between tab headers, only the active panel is in the Tab order, and the active state is exposed for styling.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] Composite component built on the Radix Tabs Primitive, exposed as a namespace with root, list, trigger, and content parts
- [x] Controlled and uncontrolled via value, defaultValue, onValueChange
- [x] Arrow keys move between triggers with automatic activation; Home and End jump to first and last; disabled triggers are skipped
- [x] Inactive panels are not rendered into the Tab order; active trigger and panel expose their state via data attributes
- [x] Parts forward refs, accept className, spread rest props
- [x] Stories for Default, with a disabled tab, vertical orientation, and a controlled example; a play function arrows across tabs and asserts the visible panel changes
- [x] axe passes on every Story; lint, typecheck, build pass

## Comments

2026-09-22: Implemented in d25043e (Tabs parts, stylesheet, Stories, changeset) and cc8be9d (code review fixes). Verified locally: lint, typecheck, 73 Story tests in Chromium with axe (6 of them Tabs), and build all pass, and both Themes and both orientations were checked by eye in Storybook. Decisions worth knowing. The parts are Root, List, Trigger, and Content, and each is a thin pass-through to Radix. Unlike RadioGroup and Tooltip, Tabs does not own its state: Radix writes data-state "active" or "inactive", data-disabled, and data-orientation straight onto the elements the parts render, and those are already the kit's words, so there is nothing to rename. `orientation` does reach Radix here, the opposite of the RadioGroup call, because the APG Tabs pattern limits the arrow keys to one axis: Left and Right for a horizontal list, Up and Down for a vertical one, and the Vertical Story asserts the other pair does nothing. Radix's activationMode, loop, forceMount, and dir are not exposed. Activation is automatic as the ticket asks, focus loops at the ends, and right-to-left is out of scope. Radix always mounts every panel element and unmounts only the children of inactive ones, so inactive panels sit in the DOM as hidden empty divs, aria-controls always resolves, and a Consumer's panel state resets when they switch tabs; forceMount is a candidate for a later ticket if that bites. Without `value` or `defaultValue` no tab is active and no panel shows. That is Radix's behaviour, Root cannot pick the first tab without reading its children, and the prop doc says so. Every panel is a Tab stop, as the APG recommends, so the stylesheet gives the panel a focus ring, and the ActivePanelInTabOrder Story walks Before, tab, panel, the panel's button, After, and back, with the hidden panels' buttons absent from the document. The list divider is an inset box-shadow rather than a border so the active tab's 2px line paints over it without a negative margin. The Stories need no hold-the-key helper like RadioGroup's, because a tab activates on focus whatever the key state. Every Story names the tablist with `aria-label`; the kit generates no name for it since the APG only recommends one, and there is no Label part. Kit-wide, the class-name join is now in six Components and verify-build.mjs gained two more lines, so the shared helper and the derived build check from ticket 06's notes are still open candidates.
