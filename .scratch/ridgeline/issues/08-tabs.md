# 08: Tabs

**What to build:** A Consumer's Tabs are a cream pill track with an Ember pill on the active tab, and keyboard users move between tabs exactly as before, through roving tabindex written in the kit.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] The kit wires the tablist, tab, and tabpanel roles and the id links between each tab and its panel
- [x] Arrow keys follow the orientation, Home and End jump to the ends, moving focus activates a tab, and disabled tabs are skipped
- [x] Only the active tab is in the Tab order, and only the active panel is reachable with Tab
- [x] Controlled and uncontrolled use the existing props; parts expose the same data-state values as today
- [x] The list is a surface raised pill track; triggers use the label style; the active trigger is an Ember pill with cream text; hover tints Peach sky
- [x] Tabs' CSS reads only the new Token names
- [x] `@radix-ui/react-tabs` is removed from the manifest and the lockfile
- [x] Existing Tabs Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 16338a8 on branch ridgeline-08-tabs. Tabs.tsx no longer imports Radix, and `@radix-ui/react-tabs` is gone from package.json and pnpm-lock.yaml. Root keeps the active value (controlled when `value` is defined, as before) and calls onValueChange only when the value changes. Each Trigger is a button with the tab role, `aria-selected`, `aria-controls`, and the same `data-state`, `data-disabled`, and `data-orientation` attributes Radix gave it. Each Content panel has the tabpanel role, `aria-labelledby`, `tabIndex` 0, and `hidden` with no children while inactive. A primary mouse press or a focus activates a tab. Arrow keys move focus with wraparound and skip disabled tabs, and Home and End jump to the ends. PageUp and PageDown act like Home and End, as they did under Radix. Keys pressed with a modifier do nothing, also as before.

Before the swap I added two checks and ran them against Radix. The Default Story now asserts that each tab's `aria-controls` names its panel and the panel's `aria-labelledby` names the tab, hidden panels included. A new NoInitialTab Story has no defaultValue and a disabled first tab, and checks that Tab lands on the first enabled tab and activates it. The six existing Stories pass with no edits to their assertions. Verified with `pnpm check`: lint, typecheck, 111 Story tests in Chromium with axe as an error, and the build and its verifier. I also looked at the horizontal and vertical Stories in Storybook.

Decisions a later ticket needs. Only one element in the list is ever a Tab stop. Radix made the tablist itself focusable when nothing was active and forwarded focus to the first tab. Now the first enabled tab takes `tabIndex` 0 instead, which a Consumer sees as the same thing. The Root no longer renders `dir="ltr"`. Left and Right swap when the list's computed direction is rtl, so a Consumer's `dir="rtl"` on a parent now works. Spaces in a value become hyphens in the generated ids, since a space would split an id reference. The vertical track uses the card radius, because a full pill radius on a tall column curves past the first and last tabs. No new Token pairs: cream on Ember, muted on cream, and Bark on Peach sky are already in the Tokens Story.
