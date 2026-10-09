# Rooftop, the third Theme

Status: ready-for-agent

## Problem statement

The kit has two Themes and both are light. Ridgeline is warm and rounded, Noren is paper and cloth, and a Consumer whose app is dark has nothing: every Token value assumes text darker than the page, and the glossary, ADR 0001, and the Getting started page all say a Theme is light-only. ADR 0005 reserved `data-color-scheme` for the day a dark Color scheme arrives, but no Theme has asked for one. The maintainer has a third board ready, Rooftop 800, and it is dark from the page down. Its surfaces also recess instead of lifting: a field is the page colour inside a lighter panel, which the kit's one raised-surface role cannot say.

## Solution

Add Rooftop as the third Theme. A Consumer sets `data-theme="rooftop"` on the html element, or on any ancestor, and every Component under it turns into the tiny bar on a wet roof from the board: a Wet stone page, Awning panels, Ticket text, Bulb yellow for the one thing you can act on, Stool wood for the second, Big Shoulders signage on every Button and label, fields recessed into the page behind a Fog teal edge, 4px corners on controls and 10px on panels, a black drop shadow under Buttons, and a Bulb ring with a warm glow on anything that floats. Ridgeline stays the default and changes nothing for the Consumer who never sets the attribute.

Two things widen on the way. A Theme now has one Color scheme of its own, declared in its block, and Rooftop's is dark (ADR 0007). And one role splits: `--kui-surface-field` is where a field, a Checkbox box, a Switch track, and a Radio control draw their fill, separate from the panels that read `--kui-surface-raised`. Ridgeline and Noren fill both with the value they already drew, so neither changes.

## User stories

### Choosing a Theme

1. As a Consumer, I want to switch the whole kit to Rooftop by setting one attribute on the html element, so that adopting the third Theme is one line.
2. As a Consumer, I want to set the attribute on any ancestor, so that a Rooftop section can live inside a Ridgeline or Noren page.
3. As a Consumer who never sets the attribute, I want Ridgeline exactly as before, so that adding Rooftop to the package changes nothing for me.
4. As a Consumer, I want all three Themes inside the one stylesheet I already import, so that there is no second stylesheet to discover.
5. As a Consumer, I want my `:root, [data-theme]` Token overrides to keep winning under Rooftop as they do under Noren, so that rebranding stays a handful of lines.
6. As a Consumer, I want a Dialog opened from a Rooftop subtree to be Rooftop too, so that the top layer doesn't lose the Theme.
7. As a Consumer, I want Rooftop to declare a dark Color scheme, so that native scrollbars and form controls inside it go dark without my wiring anything up.
8. As a Consumer, I want a clear statement that Rooftop is dark only and that `data-color-scheme` is still unused, so that I don't wire up a light toggle that does nothing.

### Look and feel

9. As a Consumer, I want Rooftop's page to be Wet stone and its panels Awning, so that the Dialog, the Select list, and the DataTable sit a step lighter than the page like the board's awning.
10. As a Consumer, I want Rooftop fields, Checkbox boxes, Switch tracks, and Radio controls recessed to the page colour behind a 2px Fog teal edge, so that they match the board's inputs and read as cut into the surface.
11. As a Consumer, I want Rooftop's primary Button in Bulb with Wet stone text, so that the main action is the warm bulb on a cold room.
12. As a Consumer, I want a hovered primary Button to brighten, so that the bulb gets warmer when I reach for it.
13. As a Consumer, I want Rooftop's secondary Button in Stool with Wet stone text, so that a quieter action still reads as wood on the bar.
14. As a Consumer, I want Rooftop's outline Button to be transparent with a 2px Ticket edge, so that a third action is available without a second warm colour.
15. As a Consumer, I want Rooftop's danger Button in a lifted Tail light, so that a destructive action is orange-red and never yellow.
16. As a Consumer, I want Rooftop Buttons flat-cornered at 4px with a black drop shadow, so that they read as raised metal signs.
17. As a Consumer, I want a focused Rooftop field to turn its edge Bulb and show a Bulb ring, so that focus matches the board's focused input.
18. As a Consumer, I want Rooftop Tabs in a recessed Sign box track with Rain sky text, the active one Bulb with Wet stone text, 4px corners, and no Rail, so that the active tab is the number sign you can read from the street.
19. As a Consumer, I want the Rooftop Dialog with 10px corners, no arch, no Rail, and a 2px Bulb ring with a warm glow, so that the kit's most prominent surface is the lit window.
20. As a Consumer, I want Rooftop Dialog titles in Big Shoulders Display in Sign gold, so that the title reads like the sign over the door.
21. As a Consumer, I want the Rooftop overlay to be Sign box at 75%, so that the page behind a Dialog goes to the dark of the roof.
22. As a Consumer, I want Rooftop popups such as Tooltip and the Select list to carry the Bulb ring and glow, so that the board's "Lit" depth appears where something floats.
23. As a Consumer, I want the Rooftop Tooltip to be a Ticket bubble with Awning text, so that it reads as the paper ticket on the board.
24. As a Consumer, I want the Rooftop DataTable to sit flat with no shadow, Awning rows alternating with a darker stripe, and 2px row ends, so that it reads as a printed list rather than a card.
25. As a Consumer, I want hovered and selected Rooftop rows, the highlighted Select option, and hovered ghost and outline Buttons in Sign box, so that a highlight recesses the way the board's depth scale does.
26. As a Consumer, I want Rooftop Checkbox, Radio, and Switch drawn in Wet stone with a 2px Fog teal edge when off and Bulb when on, so that a control lights up like a bulb.
27. As a Consumer, I want the Rooftop Switch to stay a pill while Buttons go square, so that a toggle still looks like a toggle.
28. As a Consumer, I want every Rooftop label, Button, Tab trigger, and table header in Big Shoulders Display at 800, uppercase, with 0.06em tracking, so that the kit has the board's "Signage first" voice everywhere.
29. As a Consumer, I want Rooftop body and field text in Barlow at 18px, so that reading matches the board.
30. As a Consumer, I want Rooftop spacing on the board's 4px scale, so that the kit's rhythm matches.
31. As a Consumer, I want Rooftop's type scale of 14, 16, 18, and 34px, so that sizes match the board's labels, body, and heading.

### Accessibility

32. As a Consumer, I want every text and background pair Rooftop draws to meet WCAG AA, so that I don't have to audit the Theme myself.
33. As a Consumer, I want every Rooftop field edge, control edge, and focus ring to meet 3:1, so that my app meets WCAG 1.4.11.
34. As a Consumer, I want error text to stay readable on an Awning panel, so that a TextField inside a Dialog doesn't fall under AA.
35. As a Consumer, I want muted text to stay readable on the Sign box highlight, so that a selected row's secondary text passes.
36. As a Consumer, I want every keyboard interaction and every axe check that passes under Ridgeline to pass under Rooftop, so that switching Themes changes nothing a screen reader or keyboard user depends on.
37. As a Consumer, I want transitions to switch off under reduced motion in Rooftop as in the other Themes, so that I keep meeting that requirement.

### Fonts

38. As a Consumer, I want the two Rooftop typefaces shipped inside the package, so that I don't have to find, licence, or host them.
39. As a Consumer, I want to load them with one optional stylesheet import separate from the other two, so that I fetch only the Theme I use.
40. As a Consumer who already serves these fonts, I want the main stylesheet to load no font files, so that nothing downloads twice.
41. As a Consumer who skips the fonts import, I want fallback stacks that reach a narrow system face for signage and the system sans for body, so that the kit still looks deliberate.
42. As a Consumer, I want the fonts' licence included in the package, so that redistribution stays clean.
43. As a Consumer, I want a clear statement that the bundled Rooftop fonts cover latin and latin-ext only, so that I know Vietnamese and other text falls back to my system font.

### Theming

44. As a Consumer, I want every Rooftop value exposed as a Token, so that I can adjust the Theme with plain CSS overrides.
45. As a Consumer, I want the new surface field Token to have a role name like the existing ones, so that an override means the same thing under every Theme.
46. As a Consumer on Ridgeline or Noren, I want to override `--kui-surface-field` and move only my fields and controls, so that a panel and a field no longer share one fill.
47. As a Consumer, I want to turn the Rail on in Rooftop by setting its width, and get a Bulb edge, so that the Rail colour is a sensible default even where the Theme draws none.
48. As a Consumer, I want the Getting started page to list every Token with all three Themes' values side by side, so that I can see what each role means in practice.

### Maintainer

49. As the maintainer, I want a Rooftop entry in the Storybook Theme toolbar, so that I can check every Story under any Theme.
50. As the maintainer, I want the Tokens contrast Story to run once per Theme, so that a Rooftop value can't silently break WCAG.
51. As the maintainer, I want the play-function Stories to run once, under the default Theme, so that the Chromium run doesn't triple for no behavioural coverage.
52. As the maintainer, I want the smoke test to prove that setting the attribute in a fresh Vite app changes the computed primary colour and that the Rooftop faces load in a fresh Next.js build, so that ADR 0003's guarantees hold for the third Theme.
53. As the maintainer, I want the build to fail if the Rooftop fonts stylesheet points at a missing file, so that a Consumer never gets a broken import.
54. As the maintainer, I want the lint to keep rejecting raw colours and lengths in component CSS, so that the new Token is the only way a value gets in.
55. As the maintainer, I want the glossary, ADRs, README, Getting started page, and changesets to describe three Themes and one dark Color scheme, so that nothing in the repo still says the kit is light-only.
56. As the maintainer, I want ADR 0007 to record that a Theme carries its own Color scheme and why `data-color-scheme` stays unused, so that the next person doesn't bolt a second switch onto Rooftop.

## Implementation decisions

### The Rooftop Theme

The values come from the Rooftop 800 board. Token names are roles (ADR 0005). Palette names appear only in comments beside the values. Three board colours have no Token: Sign gold's role as numerals and JetBrains Mono, because the kit draws no numerals and has no mono role; and Window (#7FB0A6, success), because the kit has no success part. Sign gold does reach the Dialog title.

| Token role           | Rooftop value                                                                  | Palette name       | Used for                                                                 |
| -------------------- | ------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------ |
| background           | #1A2224                                                                        | Wet stone          | Page                                                                     |
| surface raised       | #2E3B3E                                                                        | Awning             | Dialog, Select list, DataTable body, Tooltip text                        |
| surface field        | #1A2224                                                                        | Wet stone          | TextField, Select trigger, Checkbox box, Switch track, Radio (new role)  |
| surface stripe       | #1E2829                                                                        |                    | Every other DataTable row, see below                                     |
| surface track        | #141A1B                                                                        | Sign box           | The Tabs list behind the tabs                                            |
| tint                 | #141A1B                                                                        | Sign box           | Hover, highlighted option, selected row                                  |
| foreground           | #EDE6D6                                                                        | Ticket             | Text, outline Button edge                                                |
| foreground muted     | #A9BDBA                                                                        | Rain sky           | Muted text                                                               |
| foreground display   | #D8B26A                                                                        | Sign gold          | Dialog title                                                             |
| border               | #5E7472                                                                        | Fog teal           | Field and control edges                                                  |
| primary              | #F2C46B                                                                        | Bulb               | Primary Button, checked controls, active Tab, focus                      |
| primary hover        | #F7D589                                                                        |                    | Bulb brightened                                                          |
| primary foreground   | #1A2224                                                                        | Wet stone          | Text on primary                                                          |
| primary on tint      | #F2C46B                                                                        | Bulb               | Checked fill on Sign box                                                 |
| secondary            | #B98A55                                                                        | Stool              | Secondary Button                                                         |
| secondary hover      | #CDA06A                                                                        |                    | Stool brightened                                                         |
| secondary foreground | #1A2224                                                                        | Wet stone          | Text on secondary                                                        |
| tab                  | transparent                                                                    |                    | Inactive tab fill, the track shows through                               |
| tab foreground       | #A9BDBA                                                                        | Rain sky           | Inactive tab text                                                        |
| danger               | #E58A6E                                                                        |                    | Tail light lifted until error text passes on Awning, see below           |
| danger hover         | #D2694B                                                                        | Tail light         | Danger Button hover                                                      |
| danger foreground    | #1A2224                                                                        | Wet stone          | Text on danger                                                           |
| focus ring           | #F2C46B                                                                        | Bulb               | Focus outline                                                            |
| focus ring on tint   | #F2C46B                                                                        | Bulb               | Focus outline on Sign box                                                |
| overlay              | rgb(20 26 27 / 0.75)                                                           | Sign box at 75%    | Dialog backdrop                                                          |
| rail width           | 0                                                                              |                    | No Rail                                                                  |
| rail colour          | #F2C46B                                                                        | Bulb               | The Rail, should a Consumer turn it on                                   |
| shadow rest          | none                                                                           | Recessed           | DataTable container                                                      |
| shadow track         | none                                                                           |                    | The Tabs list                                                            |
| shadow raised        | 0 12px 24px -10px rgb(0 0 0 / 0.6)                                             | Raised             | Primary and secondary Buttons                                            |
| shadow floating      | 0 0 0 2px #F2C46B, 0 0 30px rgb(242 196 107 / 0.35)                            | Lit                | Dialog, Tooltip, Select list                                             |
| font display         | Big Shoulders Display, Arial Narrow, Helvetica Neue, system-ui, sans-serif     |                    | Dialog title                                                             |
| font label           | the same stack as font display                                                 |                    | Buttons, field labels, Tab triggers, table headers, group labels         |
| font body            | Barlow, system-ui, sans-serif                                                  |                    | Everything else                                                          |
| label case           | uppercase                                                                      |                    | Applied with font label                                                  |
| label tracking       | 0.06em                                                                         |                    | Between the board's 0.04em Buttons and 0.1em labels                      |
| label weight         | 800                                                                            |                    | The board's heading weight; the Dialog title reads it too                |
| font size sm, md, lg | 14, 16, 18px, in rem                                                           |                    | The three Button and field sizes                                         |
| font size display    | 34px, in rem                                                                   |                    | Dialog title, the board's heading size                                   |
| radius field         | 4px                                                                            | Control 4          | TextField, Select trigger, Select options                                |
| radius button        | 4px                                                                            | Control 4          | Button                                                                   |
| radius tab           | 4px                                                                            | Control 4          | Tab triggers and the horizontal Tabs list                                |
| radius check         | 2px                                                                            | Ticket             | Checkbox box                                                             |
| radius row           | 2px                                                                            | Ticket             | DataTable row ends                                                       |
| radius card          | 10px                                                                           | Panel 10           | Tooltip, Select list, DataTable container, Dialog                        |
| radius pill          | 999px                                                                          |                    | Switch, Dialog close button                                              |
| radius arch          | 10px                                                                           | Panel 10           | Dialog top corners, no arch                                              |
| border width field   | 2px                                                                            |                    | TextField and Select trigger edge                                        |
| space 1 to 8         | 4, 8, 12, 16, 24, 40, 64, 96px                                                 |                    | The board's scale, extended one step                                     |
| padding field inline | 16px                                                                           |                    | TextField input and Select trigger                                       |
| motion duration      | unchanged                                                                      |                    | Still 0ms under reduced motion                                           |

- The board's primary Button has `background: {{accent}}`, an unfilled placeholder. The palette names Bulb as primary, so Bulb it is.
- The board has no hover states. On a dark page a hover brightens: primary to #F7D589 (Wet stone text 11.4:1), secondary to #CDA06A (6.8:1). Danger is the exception and darkens back to the board's Tail light.
- Tail light #D2694B is 4.5:1 as a Button fill under Wet stone text but 3.2:1 as error text on Awning, where a TextField inside a Dialog draws its message. One Token holds both. #E58A6E is 4.5:1 on Awning, 6.3:1 on the page, and 6.3:1 under Wet stone text. Same move both Themes made for muted text.
- Fog teal is 3.25:1 on Wet stone and 2.33:1 on Awning. That is why fields read surface field (Wet stone) and not surface raised, and why the tint is Sign box and not the board's lighter "Raised" #3B4A4C, where Fog teal is 1.86:1. A hover recesses, which is the board's depth scale read from the top.
- The stripe is the darkest step between Awning and Wet stone where Fog teal still reaches 3:1: #1E2829 at 3.03:1. The stripe is darker than the Awning body, so the table alternates panel and recess.
- Measured pairs: Ticket on Wet stone 13.0:1, on Awning 9.3:1, on the stripe 12.2:1, on Sign box 14.2:1. Rain sky on Wet stone 8.2:1, on Awning 5.9:1, on Sign box 9.0:1. Wet stone on Bulb 9.9:1, on Stool 5.3:1, on #E58A6E 6.3:1. #E58A6E on Wet stone 6.3:1 and on Awning 4.5:1. Sign gold on Awning 5.8:1. Awning on Ticket 9.3:1 for the Tooltip. Fog teal on Wet stone 3.25:1, on Sign box 3.5:1, on the stripe 3.0:1. Bulb on Wet stone 9.9:1, on Awning 7.1:1, on Sign box 10.8:1, on the stripe 9.3:1. Ticket on Awning 9.3:1 for the outline Button's edge.

### Selecting a Theme

- Ridgeline stays on the root with no attribute. Rooftop sits in a third block selected by `[data-theme="rooftop"]`, wrapped in `:where()` like the other two so it carries zero specificity, placed after Noren's so source order picks it. A Consumer's `:root, [data-theme]` override beats all three.
- The attribute works on any ancestor because Tokens inherit. A native dialog in the top layer is still a descendant of its subtree, so it inherits too.
- The Rooftop block declares `color-scheme: dark`. The other two declare light. A Theme carries one Color scheme in its own block, and `data-color-scheme` stays reserved and unused (ADR 0007). Inside a Rooftop subtree on a light page, native scrollbars and form controls go dark with it, which is what `color-scheme` is for.
- All three Themes ship in the one stylesheet. The Rooftop block is a few kilobytes.

### New and changed Tokens

Nothing is published, so the change below is free of a deprecation path.

- One new colour role: surface field. TextField, the Select trigger, the Checkbox box, the Switch track, and the RadioGroup control read it for their fill. Ridgeline fills it with Cream and Noren with Paper, the values those parts already drew, so neither renders differently. The Select list and its options, the Dialog, the Tooltip, and the DataTable body keep reading surface raised.
- No new shape, depth, or type role. Every Rooftop shape is a single value within what ADR 0006 already allows.

### Component changes

Each Component keeps one stylesheet with no Theme selector.

- **TextField, Select trigger, Checkbox, Switch, RadioGroup.** The fill reads surface field instead of surface raised. Nothing else changes.
- **Button, Tabs, Dialog, DataTable, Tooltip, Select list.** No CSS change. Their Tokens already cover Rooftop.

### Fonts

- Big Shoulders Display at 800 and Barlow at 400 ship as woff2 files for the latin and latin-ext ranges, with the SIL Open Font License text beside each family. Two faces, four files, under `src/fonts/big-shoulders-display/` and `src/fonts/barlow/`.
- A third opt-in stylesheet, exported as `k-ui-kit/fonts/rooftop.css` from `src/styles/fonts-rooftop.css`, holds the font-face rules with font-display swap. The other two sheets are untouched. The main stylesheet contains no font-face rules.
- The fonts copy script and the build check learn the third stylesheet.
- No Vietnamese subset, though Barlow draws one and the board embeds it. Same scope as Noren: latin and latin-ext only.
- Every bold in the kit reads label weight, which is on Big Shoulders, so Barlow ships at 400 only.

### Storybook and docs

- The Theme toolbar gains a Rooftop entry that sets `data-theme="rooftop"` on the html element. The canvas body keeps reading the background and font body Tokens, so it turns Wet stone under Rooftop.
- The preview imports all three fonts stylesheets.
- The Tokens Story gains a Rooftop Story. It sets the attribute on its own root, fails on any Token the Rooftop block leaves undeclared, and runs the same contrast assertions. The edge pairs change for every Theme: border on surface field replaces border on surface raised, and foreground on surface raised is added for the outline Button's edge. Border on the page, on the stripe, and on the tint stay.
- The Getting started page's Themes section covers the third attribute value, the third fonts import, and the dark Color scheme, and its Token table gains a Rooftop column plus a surface field row. If three value columns overflow Storybook's 1000px column, the table splits into one per Theme.
- The README's description and the first-release changeset describe three Themes. A new minor changeset describes Rooftop and the surface field role.
- The glossary names Rooftop beside the other two and says each Theme has one Color scheme, done. ADR 0007 records the dark Color scheme decision. ADR 0001's light-only consequence and the Getting started "light only" paragraph are reworded.

## Testing decisions

There is one seam, the same one the other Themes use: the public package entry, rendered through Stories and run by Storybook's Vitest addon in Chromium. The build check and the Consumer smoke test, both already in the repo, guard the package shape. No new seam is added.

A good test renders a Component the way a Consumer would and asserts on what a user or assistive technology would observe. For a Theme that means computed colours, computed radii and shadows, and the attribute's effect, never the stylesheet's text.

- **Existing Stories.** Unchanged. Every play function runs once under the default Theme, since a Theme changes no behaviour. axe runs on every Story and fails on any violation.
- **Surface field.** A Story proves a `:root` override of surface field moves a TextField's fill and leaves the Dialog panel alone, under Ridgeline. Every existing Story stays green and both light Themes render pixel-identical, which is the proof that the role was split, not invented.
- **Contrast.** The Tokens Story runs once per Theme and asserts 4.5:1 for every text pair and 3:1 for every edge pair, with the edge pairs updated as above. A Rooftop Story that leaves any Token undefined fails.
- **Depth and surfaces.** The Rooftop Tokens Story asserts, from computed style on a rendered TextField inside a Dialog, that the field's fill is Wet stone on an Awning panel and its edge is Fog teal, and that the Dialog's box shadow carries the 2px Bulb ring. It also asserts the html element's computed `color-scheme` is dark under the attribute.
- **Theme switch.** The existing ThemeSwitch Story gains a Rooftop case: a Button inside a `data-theme="rooftop"` wrapper is Bulb beside a Ridgeline one, and the `:root, [data-theme]` override reaches both.
- **Build check.** The script additionally checks that the Rooftop fonts stylesheet is exported, that every face it references exists in the build output, that the main stylesheet contains the Rooftop block, and that both licence files ship.
- **Smoke test.** The Next.js app imports the third fonts stylesheet and asserts the two Rooftop faces load for the latin and latin-ext samples. The Vite app renders a Rooftop section beside its Noren one and asserts the override colour on the primary Button in all three, that the Rooftop section's TextField is Wet stone with a Fog teal edge, and that the body is still Apricot.

There is still no visual regression testing. The maintainer checks the look against the board in Storybook, and in particular reads a 12px DataTable header in Big Shoulders before ticket 02 closes.

Prior art: the Noren spec and its six tickets, the Tokens Story and its contrast helpers, the build verification script, and the smoke test script.

## Out of scope

- Tag, Stamp, sign box, lantern string, and ticket card Components from the board.
- A mono font role or JetBrains Mono. The kit draws no numerals.
- A success colour role. Window stays on the board.
- A card edge role for the board's 3px sign box. The Lit ring already outlines floating panels.
- A separate Button font or a glow on the primary Button alone. Both would be a role for one Theme.
- A Vietnamese subset for Barlow.
- A light Color scheme for Rooftop, or a dark one for Ridgeline or Noren. ADR 0007 says where that goes when it comes.
- `data-color-scheme`. Reserved, still unused.
- Any change to a Component's public API or data attributes.
- A fourth Theme, or a Theme switcher Component.
- Visual regression testing.

## Further notes

- The design source is the Rooftop 800 board, the sixth of six systems in the maintainer's "Moodboard Design Systems" HTML file, outside the repo. Every value the kit needs is in the Theme table above, so implementers don't need the file.
- Suggested build order: the surface field split on both light Themes with unchanged rendering (ticket 01), then the Rooftop block, the toolbar entry, and its contrast Story (02), then the fonts (03), then the smoke test and build check (04), then docs and changesets (05).
- Three deviations from the board, decided in the grilling. The outline Button's edge reads foreground, so under Rooftop it is Ticket, not the board's Fog teal. The primary Button's own glow is not carried, because one raised shadow serves both Buttons; the glow appears on floating panels instead. The Dialog title keeps its italic from component CSS, so the browser synthesises an oblique Big Shoulders Display. None is reachable through a Token value, and none earns a Theme selector (ADR 0005).
- The board's "Signage first" principle is applied to every label through the shared label Tokens, so a 12px DataTable header and a Select group label are Big Shoulders Display at 800 as well. If the maintainer finds that unreadable in Storybook, the fallback is a `--kui-font-button` trio of family, weight, and tracking that the two light Themes fill from their label values, recorded here before ticket 02 closes.
- Label tracking is 0.06em, between the board's 0.04em on Buttons and 0.1em on field labels, because one Token serves both.
- A `:root` override does not reach inside a `data-theme` wrapper, for the reason the Noren spec records. The `:root, [data-theme]` form reaches all three.
- The 800 in the board's title is the sign number. The Theme is Rooftop.
