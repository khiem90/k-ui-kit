# 03: Button

**What to build:** A Consumer's Buttons are Ridgeline pills in five variants and three sizes, and `asChild` still renders a link that looks and acts like a Button, now through a Slot written in the kit. `@radix-ui/react-slot` leaves the package.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] An internal Slot merges props onto its single child, joins class names, composes refs, and composes event handlers so the child's handler runs first and the kit's is skipped when the child prevented the default
- [x] Button's leading and trailing icons still wrap the child's content under `asChild`, and `disabled` still becomes `aria-disabled`
- [x] Primary is an Ember pill with a cream label and the raised shadow, darkening to primary hover
- [x] Secondary is a cream pill with the raised shadow that tints to Peach sky on hover
- [x] Ghost is transparent with a label underlined at a 6px offset and a Peach sky pill on hover
- [x] Outline is transparent with a 2px Bark border and a Peach sky fill on hover
- [x] Danger is a danger pill with a cream label
- [x] Labels use the label font, case, and tracking; sm, md, and lg are 36, 44, and 52 pixels tall
- [x] Button's CSS reads only the new Token names
- [x] `@radix-ui/react-slot` is removed from the manifest and the lockfile
- [x] Existing Button Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in dc3fb6c on branch `ridgeline-03-button`. The Slot lives at `src/slot.tsx`, next to `src/icons.tsx`, and tsup builds it as `dist/slot.js` through a new entry line. It merges the Slot's props onto its single child with the child's props winning, joins class names, merges styles, composes refs (React 18 and 19 both, with React 19 ref cleanups passed through), and runs the child's `on*` handler first, then the kit's unless the child called `preventDefault`. Button wraps the child's own content in the icons with `cloneElement` before handing it to the Slot, so the Slot has no Slottable. `disabled` under asChild still becomes `aria-disabled`. The CSS reads only new Token names: pills on `--kui-radius-pill`, a 2px border on every variant (transparent except outline, which uses Bark through `--kui-foreground`), the raised shadow on primary and secondary, Peach sky hover on secondary, ghost, and outline, and fixed block sizes of 36, 44, and 52px. Danger has no hover Token, so it darkens with a `color-mix` towards Bark. `@radix-ui/react-slot` is gone from the manifest and the lockfile importers. The lockfile still lists it as a transitive dependency of the other Radix packages until their tickets drop them.

Verified: `pnpm check` passes with 116 Story tests in Chromium with axe, and the build check imports `dist/index.js`, which proves `dist/slot.js` resolves. The existing Button Stories are unchanged. New Stories cover the handler order, the skipped kit handler after `preventDefault`, class and ref merging, icons under asChild, `aria-disabled` under asChild, and the three heights with the label font and case. I looked at each variant in Storybook.

For ticket 10. Import the Slot in `Dialog.tsx` with `import { Slot } from "../../slot.js";` and render `<Slot {...props}>{children}</Slot>` for `asChild`. It calls `Children.only`, so it throws on anything but one element. Its ref type is `HTMLElement`.
