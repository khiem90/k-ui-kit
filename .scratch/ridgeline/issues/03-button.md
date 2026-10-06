# 03: Button

**What to build:** A Consumer's Buttons are Ridgeline pills in five variants and three sizes, and `asChild` still renders a link that looks and acts like a Button, now through a Slot written in the kit. `@radix-ui/react-slot` leaves the package.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [ ] An internal Slot merges props onto its single child, joins class names, composes refs, and composes event handlers so the child's handler runs first and the kit's is skipped when the child prevented the default
- [ ] Button's leading and trailing icons still wrap the child's content under `asChild`, and `disabled` still becomes `aria-disabled`
- [ ] Primary is an Ember pill with a cream label and the raised shadow, darkening to primary hover
- [ ] Secondary is a cream pill with the raised shadow that tints to Peach sky on hover
- [ ] Ghost is transparent with a label underlined at a 6px offset and a Peach sky pill on hover
- [ ] Outline is transparent with a 2px Bark border and a Peach sky fill on hover
- [ ] Danger is a danger pill with a cream label
- [ ] Labels use the label font, case, and tracking; sm, md, and lg are 36, 44, and 52 pixels tall
- [ ] Button's CSS reads only the new Token names
- [ ] `@radix-ui/react-slot` is removed from the manifest and the lockfile
- [ ] Existing Button Stories pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
