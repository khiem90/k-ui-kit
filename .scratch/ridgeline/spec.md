# Ridgeline Theme and zero runtime dependencies

Status: ready-for-agent

## Problem statement

The kit works, but it looks like every other unstyled-by-default library: system font, grey borders, small radii. Nothing about it says "pick me" to a developer browsing component libraries, and the maintainer doesn't want to ship 0.1.0 with a look they already plan to replace.

The kit also rests on nine runtime packages that the maintainer doesn't control. Eight are Radix Primitives and one is TanStack Table. Every Consumer installs them, and the kit's keyboard and focus behaviour sits in someone else's code. The maintainer wants to own every line a Consumer installs.

## Solution

Replace the current look with Ridgeline, the first Theme: warm layered tones, arched tops, pill buttons, and three typefaces, taken from the Ridgeline board in the maintainer's moodboard file. The Theme is expressed entirely as Token values, so later Themes can swap in without touching component CSS (ADR 0005).

At the same time, rewrite the behaviour of all ten Components as code in this repo, leaning on the platform where it now does the job: the native dialog element, the Popover API, CSS anchor positioning, and real checkbox and radio inputs. The package ends with zero runtime dependencies (ADR 0004).

The public API of every Component stays exactly as it is, so the existing Story play functions prove the rewrite behaves the same. 0.1.0 waits until this work is finished, and the first published version is the Ridgeline kit.

## User stories

### Look and feel

1. As a Consumer, I want the kit to have a distinctive, finished look out of the box, so that my app doesn't look like a prototype.
2. As a Consumer, I want buttons shaped as pills, so that actions read as Ridgeline at a glance.
3. As a Consumer, I want a primary Button in Ember with a soft warm glow, so that the main action on a screen stands out.
4. As a Consumer, I want a secondary Button as a raised cream pill, so that a second action is clearly available but quieter than the primary.
5. As a Consumer, I want a ghost Button that reads as underlined text, so that I can offer a low-weight action like "Skip".
6. As a Consumer, I want the outline Button to keep a visible border, so that the variant still does what its name says.
7. As a Consumer, I want a danger Button in a cooler red than the primary, so that destructive actions never look like the main action.
8. As a Consumer, I want Button, TextField, and Select trigger heights of 36, 44, and 52 pixels for sm, md, and lg, so that controls line up in a row and the default meets the 44 pixel touch target.
9. As a Consumer, I want labels and button text set in uppercase, tracked Josefin Sans, so that the kit has Ridgeline's label voice.
10. As a Consumer, I want body text and field values set in Nunito Sans, so that long text stays easy to read.
11. As a Consumer, I want Dialog titles set in Fraunces italic, so that dialogs carry the Theme's display type.
12. As a Consumer, I want a Dialog with an arched top and a centred header, so that the kit's most prominent surface shows Ridgeline's signature shape.
13. As a Consumer, I want the arch to stay well-proportioned on a wide Dialog, so that it never clips the title or the close button.
14. As a Consumer, I want depth to come from stacked flat tones and three shadow levels rather than outlines, so that the kit looks layered, not boxed.
15. As a Consumer, I want hover states to use the Peach sky tint, so that interaction feedback feels part of the palette.
16. As a Consumer, I want popups such as Tooltip and the Select list to float with the deepest shadow and a rounded card shape, so that they read as above the page.
17. As a Consumer, I want Tabs that look like Ridgeline pills, so that they match the Buttons beside them.
18. As a Consumer, I want a DataTable that separates rows with tone instead of grid lines, so that it fits the "layer, don't outline" rule.
19. As a Consumer, I want Checkbox, RadioGroup, and Switch drawn by the kit in Ridgeline colours, so that they don't fall back to each browser's native look.

### Accessibility

20. As a Consumer, I want every text field and unchecked control to show an edge with at least 3:1 contrast, so that my app meets WCAG 1.4.11 even though Ridgeline avoids strokes.
21. As a Consumer, I want a visible Ember focus ring on every focusable part, so that keyboard users always know where they are.
22. As a Consumer, I want text fields to show both an Ember border and the focus ring when focused, so that focus is obvious and the field matches the board's focused state.
23. As a Consumer, I want every text and background pair the kit draws to meet WCAG AA, so that I don't have to audit the Theme myself.
24. As a Consumer, I want error text and error borders in the danger colour, so that an invalid field is easy to spot.
25. As a Consumer, I want every keyboard interaction that works today to keep working after the rewrite, so that switching versions doesn't break keyboard users.
26. As a Consumer, I want transitions to switch off when the user prefers reduced motion, as they do today, so that I keep meeting that requirement.

### Fonts

27. As a Consumer, I want the three Ridgeline fonts shipped inside the package, so that I don't have to find, licence, or host them myself.
28. As a Consumer, I want to load those fonts with one optional stylesheet import, so that I get the full look with one extra line.
29. As a Consumer who already serves these fonts, I want the main stylesheet to load no font files, so that my users don't download them twice.
30. As a Consumer who skips the fonts, I want sensible fallback stacks, so that the kit still looks deliberate with system fonts.
31. As a Consumer, I want the fonts' licence included in the package, so that redistribution stays clean.

### Theming

32. As a Consumer, I want Ridgeline to apply as soon as I import the stylesheet, with no attribute to set, so that setup stays one import.
33. As a Consumer, I want every Ridgeline value, including radii, shadows, fonts, and label styling, exposed as a Token, so that I can adjust the Theme with plain CSS overrides.
34. As a Consumer, I want Token names that describe a role rather than a colour, so that my overrides keep meaning the same thing when more Themes arrive.
35. As a Consumer, I want my plain root-level Token overrides to win without specificity tricks, as ADR 0001 promises, so that rebranding stays a handful of lines.
36. As a Consumer, I want a clear statement that Ridgeline has a light Color scheme only, so that I don't wire up a dark mode toggle that does nothing.

### No runtime dependencies

37. As a Consumer, I want the package to install with no runtime dependencies besides React, so that my lockfile and bundle carry only the kit's own code.
38. As a Consumer, I want a Dialog that traps focus, makes the page behind it inert, locks page scroll, closes on Escape and on an outside click, and returns focus to its trigger, so that it behaves exactly as it does today.
39. As a Consumer, I want a Dialog without a portal, so that it still sits above everything thanks to the browser's top layer.
40. As a Consumer, I want Tooltip and the Select list positioned next to their trigger and flipped when there isn't room, so that they stay visible near the edge of the viewport.
41. As a Consumer, I want a Select with typeahead, arrow keys, Home and End, Escape, and option groups, so that it keeps today's keyboard behaviour.
42. As a Consumer, I want a Select with a name to submit its value in a form and honour required, so that it works in a plain HTML form as it does today.
43. As a Consumer, I want Tabs with arrow-key movement, Home and End, and only the active panel in the Tab order, so that they keep today's keyboard behaviour.
44. As a Consumer, I want a RadioGroup that is one Tab stop with arrow-key selection, so that it keeps today's keyboard behaviour.
45. As a Consumer, I want a Checkbox that supports the indeterminate state and submits in a form, so that "select all" patterns keep working.
46. As a Consumer, I want a Switch that toggles with Space and submits in a form when it has a name, so that it behaves as it does today.
47. As a Consumer, I want asChild on Button and Dialog.Close to keep merging my props, classes, refs, and event handlers onto my element, so that a link styled as a Button keeps working.
48. As a Consumer, I want DataTable sorting, pagination, and row selection to behave exactly as they do today, so that the swap away from TanStack Table is invisible to me.
49. As a Consumer, I want the DataTable column definition type to keep the fields I use today, so that my column arrays still type-check.
50. As a Consumer, I want the data-state attributes I can target in CSS to stay the same, so that my style overrides keep matching.

### Maintainer

51. As the maintainer, I want every line of runtime code in the package written in this repo, so that I can fix and change any behaviour without waiting on another project.
52. As the maintainer, I want the build to fail if a runtime dependency creeps back in, so that ADR 0004 holds without anyone having to remember it.
53. As the maintainer, I want the build to fail if the fonts stylesheet points at a missing file, so that a Consumer never gets a broken font import.
54. As the maintainer, I want a Story that checks the contrast of every colour pair the kit draws, so that a Token change can't silently break WCAG.
55. As the maintainer, I want the existing Story play functions to pass with their behavioural assertions unchanged, so that I can trust the rewrite didn't break anything.
56. As the maintainer, I want Storybook to show Ridgeline on its own apricot background with no Theme toolbar, so that the docs show what Consumers actually get.
57. As the maintainer, I want the glossary, ADRs, README, and Getting started page to describe Ridgeline and zero dependencies, so that nothing in the repo still describes Radix or a dark Theme.
58. As the maintainer, I want the pending changesets rewritten to describe the Ridgeline kit, so that the first release notes are accurate.
59. As the maintainer, I want the Consumer smoke test to pass in fresh Next.js and Vite apps after the rewrite, so that ADR 0003's guarantees still hold.

## Implementation decisions

### The Ridgeline Theme

The values below come from the Ridgeline board. Token names are roles (ADR 0005). Palette names appear only in comments beside the values.

| Token role                  | Ridgeline value                         | Palette name | Used for                                                     |
| --------------------------- | --------------------------------------- | ------------ | ------------------------------------------------------------ |
| background                  | #F6E6D6                                 | Apricot      | Page and default surface                                     |
| surface raised              | #FFF9F2                                 | Cream        | Fields, secondary Button, popups, Dialog, table body         |
| tint                        | #F2B8A2                                 | Peach sky    | Hover, highlighted option, selected row                      |
| foreground                  | #3A2B26                                 | Bark         | Text                                                         |
| foreground muted            | #654B41                                 |              | Secondary text, descriptions                                 |
| border                      | #6B4F45                                 |              | Field and unchecked-control edge only (see Accessibility)    |
| primary                     | #BD5038                                 | Ember        | Primary Button, checked controls, active Tab, focus          |
| primary hover               | #8E3826                                 |              | Primary Button hover and press                               |
| primary foreground          | #FFF9F2                                 | Cream        | Text on primary                                              |
| danger                      | #9B2335                                 |              | Danger Button, error text and border                         |
| danger foreground           | #FFF9F2                                 | Cream        | Text on danger                                               |
| focus ring                  | #BD5038                                 | Ember        | Focus outline                                                |
| overlay                     | Bark at 50% opacity                     |              | Dialog backdrop                                              |
| shadow rest                 | 0 2px 0, Bark at 8%                     |              | Resting raised surfaces                                      |
| shadow raised               | 0 10px 24px -8px, rgb(140 60 40) at 35% |              | Primary and secondary Buttons                                |
| shadow floating             | 0 24px 48px -16px, rgb(90 35 25) at 45% |              | Dialog, Tooltip, Select list                                 |
| font display                | Fraunces, then Georgia, serif           |              | Dialog title                                                 |
| font label                  | Josefin Sans, then system-ui            |              | Buttons, field labels, Tab triggers, table headers           |
| font body                   | Nunito Sans, then system-ui             |              | Everything else                                              |
| label case                  | uppercase                               |              | Applied with font label                                      |
| label tracking              | 0.24em                                  |              | Applied with font label                                      |
| radius field                | 12px                                    |              | TextField, Select trigger, Select options                    |
| radius card                 | 24px                                    |              | Tooltip, Select list, DataTable container, Dialog bottom     |
| radius pill                 | 999px                                   |              | Buttons, Switch, Tabs                                        |
| radius arch                 | 160px                                   |              | Dialog top corners, capped at half the Dialog's width        |
| space 1 to 8                | 4, 8, 12, 16, 24, 32, 48, 72 px         |              | Spacing scale                                                |
| motion duration             | unchanged                               |              | Still 0ms under reduced motion                               |

- The remaining board colours (Coral glow, Lake, Sage, Pine) get no Token yet. They arrive with Tag and Card, the first Components that use them.
- Ridgeline values sit on the root, wrapped in `:where()` as ADR 0001 requires. The dark Color scheme, the dark media query block, and the `data-theme="light|dark"` switch are removed. `data-theme` and `data-color-scheme` stay reserved for later (ADR 0005).
- The old Token names (background subtle, the sm/md/lg/full radii) are replaced by the names above. Nothing is published, so there is no deprecation path.

### Fonts

- Fraunces (400 italic, 600 upright, 600 italic), Josefin Sans (400, 600), and Nunito Sans (400, 600, 700) ship as woff2 files for the latin and latin-ext ranges, with the SIL Open Font License text alongside them.
- A separate opt-in stylesheet, exported as its own subpath next to the main one, holds the font-face rules with font-display swap. The main stylesheet contains no font-face rules.
- The font files are committed to the repo. They are assets, not runtime code, so they don't conflict with ADR 0004.

### Accessibility exceptions to the board

- "Layer, don't outline" gets one exception. TextField, the Select trigger, an unchecked Checkbox, an unchecked radio, and the off Switch track draw a 2px border in the border Token (7.1:1 on cream). The cream field on apricot alone is 1.17:1, which fails WCAG 1.4.11.
- On focus, a field's border turns Ember and the standard focus ring also shows. Ember against the muted border is too close a pair to be the only focus signal.
- On error, a field's border and its error message use the danger colour (6.4:1 on apricot).
- Measured pairs: Bark on apricot 11.1:1, muted on apricot 6.5:1, muted on Peach sky 4.6:1, cream on Ember 4.6:1, cream on danger 7.5:1, Bark on Peach sky 7.8:1, Ember focus ring on apricot 3.9:1.

### Component styling

- **Button.**
  - Primary: an Ember pill with cream label and the raised shadow, darkening to primary hover.
  - Secondary: a cream pill with the raised shadow, tinting to Peach sky on hover.
  - Ghost: transparent with an underlined label offset 6px, Peach sky pill behind it on hover.
  - Outline: transparent with a 2px Bark border, Peach sky on hover. It is the one Button allowed a stroke, because its name promises one.
  - Danger: a danger pill with cream label.
  - All labels use the label font, case, and tracking.
- **TextField.** The label uses the label style. The field is cream with the field radius, 18px inline padding, and Nunito Sans at 16px. The description is muted body text.
- **Checkbox and RadioGroup.** Controls are 22px. Unchecked is cream with the 2px border. Checked is Ember with a cream check or dot. Indeterminate is Ember with a cream bar. Option labels use the body font at 16px. The RadioGroup label uses the label style.
- **Switch.** The track is a pill. Off is cream with the 2px border and a muted thumb. On is an Ember track with a cream thumb.
- **Tabs.** The list is a cream pill track. Triggers use the label style. The active trigger is an Ember pill with cream text. Hover tints Peach sky.
- **Tooltip.** Bark fill, cream body text at 14px, card radius, floating shadow. There is no arrow. The board has no pointer shapes, and a CSS-only arrow can't follow a flipped popup reliably.
- **Dialog.**
  - The content is cream with the floating shadow on the overlay.
  - The top corners use the arch radius, capped at half the content's width. The bottom corners use the card radius.
  - The header is centred: Title in Fraunces italic in Ember, Description in muted body text below it, as on the board's "Weekend escape" card.
  - The close button sits fully inside the arch's curve, never in the clipped corner.
- **Select.** The trigger matches TextField. The list is cream with card radius and the floating shadow. Options use the field radius and an Ember check on the selected one. The highlighted option gets a Peach sky fill and the focus ring, because the fill alone is about 1.6:1 against cream and can't serve as the focus indicator. Group labels use the label style.
- **DataTable.** The table sits in a cream container with card radius. Header cells use the label style. Rows separate by alternating cream and a light apricot tone, with no grid lines. Hover and selected rows use Peach sky. Sort buttons use the label style with the existing direction indicator.

### Behaviour without runtime dependencies

- **Public API.** Frozen. Every prop, part, default, data attribute, and ref target stays as it is today. The namespaces keep their parts, and the client boundary stays where ADR 0003 puts it.
- **Slot.** A small in-house Slot replaces Radix Slot for Button's and Dialog.Close's asChild. It merges props onto the single child, joins class names, composes refs, and composes event handlers so the child's handler runs first and the kit's handler is skipped if the child prevented the default. Button's leading and trailing icons still wrap the child's content. With asChild, `disabled` still becomes `aria-disabled`.
- **Checkbox.** A real checkbox input, visually replaced by the kit's drawn box. Indeterminate is set on the input's DOM property, which gives the mixed state to assistive technology. Name, value, and required work through the native input. The root exposes the same data-state values as today.
- **RadioGroup.** Real radio inputs sharing one generated name. The browser provides the single Tab stop and arrow-key selection. Root renders the radiogroup role with the existing labelling and orientation wiring.
- **Switch.** A button with the switch role and aria-checked. Space and Enter toggle it. When it has a name, a hidden input carries its value into the form.
- **Tabs.** Hand-written roving tabindex. Arrow keys follow the orientation, Home and End jump to the ends, focus moves activate a tab, and only the active panel is in the Tab order. Tab, tablist, and tabpanel roles and their id links are wired by the kit.
- **Tooltip.**
  - The content is a manual popover, so it renders in the top layer without a portal.
  - It is placed with CSS anchor positioning on the requested side, with the existing offset and position-try fallbacks that flip it to the opposite side.
  - Open, close, delay, Escape, and the trigger's description link follow today's behaviour.
- **Dialog.**
  - A native dialog element opened as modal. That provides the focus trap, the inert page, and Escape. The kit listens for the cancel event so controlled open state stays in sync.
  - A pointer press outside the content box closes it.
  - Page scroll locks while it is open.
  - Focus returns to the trigger on close.
  - Title and Description are linked with generated ids. No portal is needed because the dialog renders in the top layer.
- **Select.**
  - The trigger has the combobox role. The list is a manual popover with the listbox role, anchored to the trigger with the same positioning approach as Tooltip.
  - Focus moves into the list on the selected option, or the first one.
  - Arrow keys, Home, End, typeahead, Enter, and Space work as today, and Escape closes and returns focus to the trigger.
  - Groups have the group role labelled by their label.
  - A visually hidden native select mirrors the value, so name, required, and form reset behave as today.
  - The list scrolls natively. The scroll-up and scroll-down buttons are dropped.
  - The rest of the page is not hidden from assistive technology while the list is open. The list closes on an outside pointer press or when focus leaves it.
- **DataTable.**
  - Sorting, pagination, and selection are plain state in the kit. Sorting is one column at a time and cycles ascending, descending, then unsorted, as today.
  - The kit ships its own comparators covering the four sort types the Component uses today.
  - The exported column definition type is the kit's own and keeps the fields used today.
  - aria-sort, the overflow-aware scroll region, the live status lines, and the reuse of Checkbox and Button stay as they are.
- **Icons.** The internal icon module stays as it is.

### Package and tooling

- The dependencies field is removed from the package manifest. React and React DOM stay as peer dependencies.
- "radix" comes out of the package keywords.
- The Storybook themes addon and its toolbar are removed. The preview canvas uses the background Token.
- ADR 0001 currently describes the dark values appearing twice. That consequence is updated, since there is no dark Color scheme now.

## Testing decisions

There is one seam, the same one v1 uses: the public package entry, rendered through Stories and run by Storybook's Vitest addon in Chromium. The build check and the Consumer smoke test, both already in the repo, guard the package shape.

A good test renders a Component the way a Consumer would, drives it through the DOM with keyboard and pointer events in a play function, and asserts on what a user or assistive technology would observe: visible text, focus position, roles and aria attributes, data-state attributes, callbacks, and form values. Tests never reach into a Component's internals.

- **Existing Stories.** These are the regression net for the rewrite. Their behavioural assertions should pass unchanged. A Story changes only where it depended on Radix-specific markup that a Consumer couldn't rely on, and each such change is called out in its ticket.
- **Positioning.** Tooltip and Select Stories gain an assertion that the popup sits next to its trigger on the expected side, by comparing bounding boxes. A popup that falls back to the middle of the viewport fails.
- **Native behaviour.** Checkbox, Switch, and Select Stories gain form-submission assertions where they don't have them, since those now run through native inputs or a mirrored select.
- **Contrast.** A new Tokens Story renders the Theme and its play function reads the computed Token values. It asserts AA contrast for every text pair the kit draws and 3:1 for the border on cream and for the focus ring on apricot and on cream. axe covers text contrast inside Components, but not WCAG 1.4.11.
- **axe.** Still runs on every Story and fails on any violation.
- **Build check.** The existing build verification script additionally fails when the manifest has a dependencies field, when any file in the build output imports a package other than react or react-dom, or when the fonts stylesheet refers to a font file missing from the build output.
- **Smoke test.** The existing smoke test runs again at the end in fresh Next.js and Vite apps.

There is still no visual regression testing. The maintainer checks the look against the board in Storybook.

Prior art: the play functions in every existing Story file, the Getting started Stories, the build verification script, and the smoke test script.

## Out of scope

- Tag and Card Components, and the Coral glow, Lake, Sage, and Pine Tokens they would use. These get their own spec.
- A dark Color scheme for Ridgeline.
- A second Theme, and the attributes that would select it.
- Any change to a Component's public API.
- A JavaScript positioning fallback for browsers older than the January 2026 anchor positioning Baseline.
- Visual regression testing.
- Typography Components or global heading styles.
- Publishing 0.1.0. v1 ticket 13 does that once this work lands.
- Right-to-left layout verification and manual screen reader scripts, as in v1.

## Further notes

- The design source is the Ridgeline board, the first of six systems in the maintainer's "Moodboard Design Systems" HTML file, outside the repo. Every value the kit needs is in the Theme table above, so implementers don't need the file.
- Suggested build order: a foundation slice (Tokens, fonts, Storybook preview, Slot, the Tokens Story, and the build check), then one slice per Component that does the rewrite and restyle together, simplest first (Button, TextField, Checkbox, Switch, RadioGroup, Tabs, Tooltip, Dialog, Select, DataTable), then docs, changesets, and the smoke test.
- v1 ticket 13 should be blocked on the last slice of this work.
- The 13 pending changesets describe the Radix-based kit. They are rewritten in the final slice.
- ADR 0004 records the move to zero runtime dependencies and supersedes ADR 0002. ADR 0005 records that a Theme is Token values only.

## Comments

2026-10-06: Code review findings applied on branch `ridgeline-review-fixes`.

Shared code. `src/compose.ts` holds the one `composeRefs` and `setRef` (the React 19 cleanup-aware version), `getElementRef`, and `composeEventHandlers`, which runs the Consumer's handler first and skips the kit's when it called preventDefault. The Slot, the popover hook, Dialog, Select, Tooltip, and Tabs use them, and Switch, RadioGroup, and Tabs.List lost their inline ref merges. `src/controllable-state.ts` holds `useControllableState`, used by Checkbox, Switch, RadioGroup, Select, Tabs, Tooltip, Dialog, and DataTable selection. Its setter reports every call, so Components that report only real changes still compare first, and a silent form covers RadioGroup's reset. Both files have a tsup entry and a build check line. The Stories passed unchanged across this refactor. `src/docs/contrast.ts` holds the contrast helpers that DataTable's Stories and the Tokens Story share, and nothing in the package imports it.

New Tokens. `--kui-padding-field-inline` (18px) replaces the hard-coded padding in TextField and the Select trigger, and field font sizes are in rem. The two fields keep separate box rules that read the same Tokens, since a shared class would not have been cleaner. `--kui-danger-hover` and `--kui-surface-stripe` replace the inline color-mix values. DataTable no longer reassigns `--kui-primary` and `--kui-focus-ring` in tinted rows. `--kui-primary-on-tint` and `--kui-focus-ring-on-tint` on the root draw the row Checkbox and the highlighted Select option's check instead, and Stories prove a root override reaches both. The Tokens Story checks the new pairs. A kit Button placed in a tinted row now keeps the normal focus ring, where the old reassignment gave it Bark.

DataTable. `sortFn` takes a `(rowA, rowB, columnId)` comparator again, with `id`, `index`, `original`, and `getValue(columnId)` on each row. The paging Buttons are outline again.

Select reset. Radix 2.3.7 restored the starting value on reset and reported it only if it changed, and its uncontrolled native select reset itself to the same option. The kit matched the first part, but its controlled native select had no default option, so a reset with nothing changed submitted "". The Root now marks the starting option as the default. The one remaining difference is that a Select that started empty reports "" on reset where Radix passed undefined, and the Select changeset says so.

Docs. CLAUDE.md describes the kit as built on the platform with zero runtime dependencies. The Getting started page uses Color scheme wording and lists the new Tokens. The first release, DataTable, DataTable selection, and Select changesets describe these changes.

Left as they were, per the review: Dialog's `container-type`, the Select `aria-invalid` edge, the read-only TextField tint, the old Token name build check, and the muted foreground value.
