# 08: Tabs

**What to build:** A Consumer's Tabs are a cream pill track with an Ember pill on the active tab, and keyboard users move between tabs exactly as before, through roving tabindex written in the kit.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [ ] The kit wires the tablist, tab, and tabpanel roles and the id links between each tab and its panel
- [ ] Arrow keys follow the orientation, Home and End jump to the ends, moving focus activates a tab, and disabled tabs are skipped
- [ ] Only the active tab is in the Tab order, and only the active panel is reachable with Tab
- [ ] Controlled and uncontrolled use the existing props; parts expose the same data-state values as today
- [ ] The list is a surface raised pill track; triggers use the label style; the active trigger is an Ember pill with cream text; hover tints Peach sky
- [ ] Tabs' CSS reads only the new Token names
- [ ] `@radix-ui/react-tabs` is removed from the manifest and the lockfile
- [ ] Existing Tabs Stories pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
