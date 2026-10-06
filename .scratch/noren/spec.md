# Noren, the second Theme

Status: ready-for-agent

## Problem statement

The kit has one Theme. Ridgeline is warm and rounded, and a Consumer who wants a different mood has to override thirty Tokens by hand and still ends up with pills and an arched Dialog, because the shapes are not theirs to change. ADR 0005 promised that a second Theme would arrive as Token values and nothing else, and reserved `data-theme` for it, but nothing has tested that promise. The maintainer has a second board ready, Noren, and it is the kind of Theme the promise is weakest on: its identity is shape, not colour.

## Solution

Add Noren as the second Theme. A Consumer sets `data-theme="noren"` on the html element, or on any ancestor, and every Component under it turns into the late-night ramen counter from the board: Washi and Paper surfaces, Cat text, Lantern red for the one thing that says "order", Tabs cut like cloth hanging from a Cedar Rail, fields with a bottom edge only, flat square buttons, and a gold lantern glow on anything that floats. Ridgeline stays the default and changes nothing for the Consumer who never sets the attribute.

To get there, the kit widens what a Token may hold rather than adding Theme selectors to component CSS (ADR 0006). A radius or border-width Token may carry four values, and a Token may be zero or none in one Theme so that a part the other Theme draws is switched off. Six new role Tokens appear where Ridgeline had been hiding two roles behind one value.

## User stories

### Choosing a Theme

1. As a Consumer, I want to switch the whole kit to Noren by setting one attribute on the html element, so that adopting the second Theme is one line.
2. As a Consumer, I want to set the attribute on any ancestor rather than only the root, so that a Noren section can live inside a Ridgeline page.
3. As a Consumer who never sets the attribute, I want Ridgeline exactly as before, so that adding Noren to the package changes nothing for me.
4. As a Consumer, I want both Themes inside the one stylesheet I already import, so that there is no second stylesheet to discover.
5. As a Consumer, I want my plain `:root` Token overrides to keep winning under either Theme, so that rebranding stays a handful of lines as ADR 0001 promises.
6. As a Consumer, I want a Dialog opened from a Noren subtree to be Noren too, so that the top layer doesn't lose the Theme.
7. As a Consumer, I want a clear statement that Noren has a light Color scheme only, so that I don't wire up a dark toggle that does nothing.

### Look and feel

8. As a Consumer, I want Noren's page background to be Washi and its raised surfaces Paper, so that text always sits on paper as the board's own rule says.
9. As a Consumer, I want Noren's primary Button in Lantern red with Paper text, so that the main action is the lantern.
10. As a Consumer, I want Noren's outline Button as Paper with a 2px Cat edge, so that it matches the board's second button.
11. As a Consumer, I want Noren's secondary Button in Cedar with Paper text, so that a quieter action still reads as part of the counter.
12. As a Consumer, I want Noren's ghost Button as underlined Cat text, so that a low-weight action is available.
13. As a Consumer, I want Noren's danger Button in a cool crimson distinct from Lantern, so that a destructive action never looks like the lantern.
14. As a Consumer, I want Noren Buttons flat with 4px corners and no shadow, so that they read as painted signs rather than pills.
15. As a Consumer, I want Noren fields with a 3px Cat underline, square bottom corners, and 4px top corners, so that they match the board's inputs.
16. As a Consumer, I want a focused Noren field to turn its underline Lantern and show the focus ring, so that focus is obvious and matches the board's focused select.
17. As a Consumer, I want Noren Tabs to hang as cloth from a Cedar Rail: Old wall strips with Paper text, the active one Lantern, square on top and rounded below, so that the Component the Theme is named after looks like a noren.
18. As a Consumer, I want a hovered Noren tab to turn Broth with Cat text, so that hover feedback uses the board's highlight colour.
19. As a Consumer, I want the Noren Dialog with a Cedar Rail along its top instead of an arch, so that the kit's most prominent surface shows the Theme's signature structure.
20. As a Consumer, I want Noren Dialog titles in Shippori Mincho B1 in Cat, so that the Dialog carries the board's heading voice without a second patch of red beside the primary Button.
21. As a Consumer, I want the Noren overlay to be Old wall teal, so that the page behind a Dialog becomes the shop wall.
22. As a Consumer, I want Noren popups such as Tooltip and the Select list to float with the lantern glow, so that the board's gold light appears where something is lifted off the page.
23. As a Consumer, I want Noren cards such as the DataTable container to sit on a 3px card edge, so that resting surfaces have the board's second depth level.
24. As a Consumer, I want Noren DataTable rows to alternate Paper and a light Washi tone with square 2px row ends, so that the table reads as planks rather than pills.
25. As a Consumer, I want hovered and selected Noren rows and the highlighted Select option in Broth, so that highlight states share one accent.
26. As a Consumer, I want Noren Checkbox, Radio, and Switch drawn in Paper with a 2px Cat edge when off and Lantern when on, so that controls match the fields beside them.
27. As a Consumer, I want the Noren Switch to stay a pill while Buttons go square, so that a toggle still looks like a toggle.
28. As a Consumer, I want Noren labels, button text, tab text, and table headers in bold sentence case with no tracking, so that the kit has the board's hand-painted sign voice rather than Ridgeline's tracked capitals.
29. As a Consumer, I want Noren body and field text in Zen Kaku Gothic New at 17px, so that reading matches the board.
30. As a Consumer, I want Noren spacing on a 6px base, so that the kit's rhythm matches the board's counter planks.
31. As a Consumer, I want Noren's type scale of 13, 15, 17, and 30px, so that sizes match the board's labels, small body, body, and headings.

### Accessibility

32. As a Consumer, I want every text and background pair Noren draws to meet WCAG AA, so that I don't have to audit the Theme myself.
33. As a Consumer, I want every Noren field edge, control edge, and focus ring to meet 3:1, so that my app meets WCAG 1.4.11.
34. As a Consumer, I want muted text to stay readable on the Broth highlight, so that a selected row's secondary text doesn't fall under AA.
35. As a Consumer, I want controls drawn on Broth to switch to Cat for their checked fill and focus ring, so that a selected row's Checkbox stays visible where Lantern falls under 3:1.
36. As a Consumer, I want every keyboard interaction and every axe check that passes under Ridgeline to pass under Noren, so that switching Themes changes nothing a screen reader or keyboard user depends on.
37. As a Consumer, I want transitions to switch off under reduced motion in Noren as in Ridgeline, so that I keep meeting that requirement.

### Fonts

38. As a Consumer, I want the two Noren typefaces shipped inside the package, so that I don't have to find, licence, or host them.
39. As a Consumer, I want to load them with one optional stylesheet import separate from Ridgeline's, so that I fetch only the Theme I use.
40. As a Consumer who already serves these fonts, I want the main stylesheet to load no font files, so that nothing downloads twice.
41. As a Consumer who skips the fonts import, I want fallback stacks that reach a mincho and a gothic on a Japanese system and Georgia and the system sans elsewhere, so that the kit still looks deliberate.
42. As a Consumer, I want the fonts' licence included in the package, so that redistribution stays clean.
43. As a Consumer, I want a clear statement that the bundled Noren fonts cover latin and latin-ext only, so that I know Japanese text in my app falls back to my system font.

### Theming

44. As a Consumer, I want every Noren value exposed as a Token, so that I can adjust the Theme with plain CSS overrides.
45. As a Consumer, I want the new Tokens to have role names like the existing ones, so that an override means the same thing under either Theme.
46. As a Consumer, I want to switch the Rail off in my own Theme by setting its width to zero, so that I don't need a selector to remove it.
47. As a Consumer, I want the field radius and border-width Tokens to accept four values, so that I can make my own flat-topped or underlined fields without a selector.
48. As a Consumer, I want the Getting started page to list every Token with its Ridgeline and Noren values side by side, so that I can see what each role means in practice.

### Maintainer

49. As the maintainer, I want a Theme toolbar in Storybook that defaults to Ridgeline, so that I can check every Story under either Theme.
50. As the maintainer, I want the Tokens contrast Story to run once per Theme, so that a Noren value can't silently break WCAG.
51. As the maintainer, I want the play-function Stories to run once, under the default Theme, so that the Chromium run doesn't double for no behavioural coverage.
52. As the maintainer, I want the smoke test to prove that setting the attribute in fresh Next.js and Vite apps changes the computed primary colour, so that ADR 0003's guarantees hold for the second Theme.
53. As the maintainer, I want the build to fail if the Noren fonts stylesheet points at a missing file, so that a Consumer never gets a broken import.
54. As the maintainer, I want the lint to keep rejecting raw colours and lengths in component CSS, so that the new Tokens are the only way a value gets in.
55. As the maintainer, I want the glossary, ADRs, README, Getting started page, and changesets to describe two Themes, so that nothing in the repo still says Ridgeline is the only one.
56. As the maintainer, I want ADR 0006 to record why a Token may hold four values or a zero, so that the next person doesn't "simplify" it back.

## Implementation decisions

### The Noren Theme

The values come from the Noren board. Token names are roles (ADR 0005). Palette names appear only in comments beside the values. Shopfront teal (#4E8A86) is the one board colour with no Token, because Paper on it is 3.7:1, under the 4.5:1 that 16px bold tab text needs. The inactive cloth is Old wall instead.

| Token role                 | Noren value                                                      | Palette name    | Used for                                              |
| -------------------------- | ---------------------------------------------------------------- | --------------- | ----------------------------------------------------- |
| background                 | #EFE3C8                                                          | Washi           | Page and default surface                              |
| surface raised             | #FFF8E8                                                          | Paper           | Fields, outline Button, popups, Dialog, table body    |
| surface stripe             | #F7EED8                                                          |                 | Every other DataTable row, Paper halfway to Washi     |
| surface track              | transparent                                                      |                 | The Tabs list behind the cloth (Ridgeline: Cream)     |
| tint                       | #E3B04B                                                          | Broth           | Hover, highlighted option, selected row               |
| foreground                 | #1C2022                                                          | Cat             | Text                                                  |
| foreground muted           | #574333                                                          |                 | One step darker than the board's #5A4636, see below   |
| foreground display         | #1C2022                                                          | Cat             | Dialog title (Ridgeline: Ember)                       |
| border                     | #1C2022                                                          | Cat             | Field underline, control edges, outline Button        |
| primary                    | #C8402B                                                          | Lantern         | Primary Button, checked controls, active Tab, focus   |
| primary hover              | #8F2A1B                                                          |                 | The board's link hover                                |
| primary foreground         | #FFF8E8                                                          | Paper           | Text on primary                                       |
| primary on tint            | #1C2022                                                          | Cat             | Checked fill on Broth, where Lantern is 2.5:1         |
| secondary                  | #8A5A36                                                          | Cedar           | Secondary Button (Ridgeline: Cream)                   |
| secondary hover            | #6F4729                                                          |                 | Secondary Button hover (Ridgeline: Peach sky)         |
| secondary foreground       | #FFF8E8                                                          | Paper           | Text on secondary (Ridgeline: Bark)                   |
| tab                        | #2F5755                                                          | Old wall        | Inactive tab fill (Ridgeline: transparent)            |
| tab foreground             | #FFF8E8                                                          | Paper           | Inactive tab text (Ridgeline: foreground muted)       |
| danger                     | #9B2335                                                          |                 | Danger Button, error text and underline               |
| danger hover               | #8C2433                                                          |                 | Danger Button hover                                   |
| danger foreground          | #FFF8E8                                                          | Paper           | Text on danger                                        |
| focus ring                 | #C8402B                                                          | Lantern         | Focus outline                                         |
| focus ring on tint         | #1C2022                                                          | Cat             | Focus outline on Broth                                |
| overlay                    | rgb(47 87 85 / 0.7)                                              | Old wall at 70% | Dialog backdrop                                       |
| rail width                 | 10px                                                             |                 | The bar on the Tabs list and the Dialog (Ridgeline 0) |
| rail colour                | #8A5A36                                                          | Cedar           | The bar's colour                                      |
| shadow rest                | 0 3px 0 #D6C6A4                                                  | Card edge       | DataTable container                                   |
| shadow track               | none                                                             |                 | The Tabs list (Ridgeline: the rest shadow)            |
| shadow raised              | none                                                             | Pinned flat     | Buttons                                               |
| shadow floating            | 0 0 0 1px #E3B04B, 0 0 28px rgb(227 176 75 / 0.55)               | Lantern glow    | Dialog, Tooltip, Select list                          |
| font display               | Shippori Mincho B1, Hiragino Mincho ProN, Yu Mincho, Georgia, serif |              | Dialog title                                          |
| font label                 | Zen Kaku Gothic New, Hiragino Sans, Yu Gothic, system-ui, sans-serif |             | Buttons, field labels, Tab triggers, table headers    |
| font body                  | the same stack as font label                                     |                 | Everything else                                       |
| label case                 | none                                                             |                 | Applied with font label (Ridgeline: uppercase)        |
| label tracking             | 0                                                                |                 | Applied with font label (Ridgeline: 0.24em)           |
| label weight               | 700                                                              |                 | Applied with font label (Ridgeline: 600)              |
| font size sm, md, lg       | 13, 15, 17px, in rem                                             |                 | The three Button and field sizes                      |
| font size display          | 30px, in rem                                                     |                 | Dialog title, the board's heading size                |
| radius field               | 4px 4px 0 0                                                      | Paper 4         | TextField, Select trigger, Select options             |
| radius button              | 4px                                                              |                 | Button (Ridgeline: 999px)                             |
| radius tab                 | 0 0 6px 6px                                                      | Curtain         | Tab triggers (Ridgeline: 999px)                       |
| radius check               | 2px                                                              |                 | Checkbox box (Ridgeline 6px, half the field radius)   |
| radius row                 | 2px                                                              |                 | DataTable row ends (Ridgeline 12px)                   |
| radius card                | 4px                                                              |                 | Tooltip, Select list, DataTable container, Dialog     |
| radius pill                | 999px                                                            |                 | Switch, Dialog close button                           |
| radius arch                | 4px                                                              |                 | Dialog top corners, under the Rail                    |
| space 1 to 8               | 6, 12, 18, 24, 36, 48, 72, 96px                                  | Counter planks  | Spacing scale, extended one step past the board       |
| padding field inline       | 16px                                                             |                 | TextField input and Select trigger                    |
| motion duration            | unchanged                                                        |                 | Still 0ms under reduced motion                        |

- The board's muted #5A4636 is 4.47:1 on Broth. #574333 is the nearest step towards Cat that clears 4.5:1 there (4.69:1), and it is 7.3:1 on Washi and 8.8:1 on Paper. Same move Ridgeline made with its muted colour.
- The board has no danger colour. The crimson above is 7.4:1 under Paper and 6.1:1 on Washi, cool enough to read as "not the lantern".
- Measured pairs: Cat on Washi 12.9:1, Cat on Paper 15.5:1, Paper on Lantern 4.7:1, Paper on Cedar 5.5:1, Paper on Old wall 7.6:1, Cat on Broth 8.3:1, Lantern focus ring on Washi 3.9:1 and on Paper 4.7:1, Lantern on the stripe 4.3:1 (an edge, so 3:1 applies), Washi on Cat 12.9:1 for the Tooltip.

### Selecting a Theme

- Ridgeline stays on the root with no attribute, in the block that exists today. Noren sits in a second block selected by `[data-theme="noren"]`, wrapped in `:where()` like the first so it carries zero specificity, placed after Ridgeline's so source order picks it. A Consumer's plain `:root` override beats both, as ADR 0001 promises.
- The attribute works on any ancestor because Tokens inherit. A native dialog in the top layer is still a descendant of its subtree, so it inherits too.
- Both blocks declare `color-scheme: light`. `data-color-scheme` stays reserved and unused.
- Both Themes ship in the one stylesheet. The Noren block is a few kilobytes.

### New and changed Tokens

Nothing is published, so every change below is free of a deprecation path.

- Six new colour roles: surface track, foreground display, secondary, secondary hover, secondary foreground, tab, tab foreground. Ridgeline fills each with the value its component CSS used to reach through another Token, so Ridgeline's rendering doesn't change.
- Two new shape roles for the Rail: rail width and rail colour. Ridgeline sets the width to 0.
- One new depth role: shadow track. Ridgeline sets it to the rest shadow.
- One new type role: label weight. Ridgeline sets it to 600, which replaces the nine hard-coded weights in component CSS.
- Four new radius roles: button, tab, check, row. Button reads radius button instead of radius pill, Tab triggers read radius tab, Checkbox reads radius check instead of half the field radius, and DataTable rows read radius row instead of radius field. Radius pill stays for Switch and the Dialog close button.
- One new border-width role: border width field, read by TextField and the Select trigger. Ridgeline sets it to 2px, Noren to `0 0 3px`.
- Radius field and radius tab may hold four values. Border width field may hold four values. No other Token may, and no Token that may is read through `calc()` or a longhand corner property (ADR 0006).

### Component changes

Each Component keeps one stylesheet with no Theme selector. The changes make every Noren value reachable.

- **Button.** Reads radius button, label weight, and the secondary trio. The hover rule for secondary uses secondary hover instead of the tint.
- **TextField and Select trigger.** Read border width field for the edge. The focus and error rules keep setting border colour, which applies to whichever sides have width.
- **Checkbox.** Reads radius check.
- **Tabs.** The list reads surface track and shadow track, and draws the Rail as a top border from the two rail Tokens. Inactive triggers read tab and tab foreground for fill and text. Hover and active rules are unchanged. Triggers read radius tab. In Noren the list's padding leaves 6px of panel between the Rail and the cloth; the taller active tab on the board is structure and stays out.
- **Dialog.** The viewport draws the Rail as a top border above the arch corners. The title reads foreground display. The arch maths is unchanged and sits under the Rail.
- **DataTable.** Rows read radius row at their ends.
- **Tooltip, Select list, Switch, RadioGroup.** No CSS change. Their Tokens already cover Noren.
- All label rules (Button, TextField label, RadioGroup label, Tabs, Select group label, DataTable header) read label weight.

### Fonts

- Shippori Mincho B1 at 800 and Zen Kaku Gothic New at 400 and 700 ship as woff2 files for the latin and latin-ext ranges, with the SIL Open Font License text beside them. Three files.
- A second opt-in stylesheet, exported as `k-ui-kit/fonts/noren.css`, holds the font-face rules with font-display swap. `k-ui-kit/fonts.css` stays Ridgeline's and is untouched. The main stylesheet contains no font-face rules.
- The fonts copy script and the build check learn the second stylesheet.
- Japanese subsets stay out. The kit draws no Japanese text, and the full coverage is several megabytes across about 120 slices per weight.

### Storybook and docs

- A Theme toolbar global sets `data-theme` on the html element. Its default is Ridgeline, and its Noren option sets the attribute. The canvas body keeps reading the background and font body Tokens, so it turns Washi under Noren.
- The preview imports both fonts stylesheets.
- The Tokens Story becomes one Story per Theme. Each sets the attribute on its own root and runs the same contrast assertions, extended by the new pairs: Paper on secondary and secondary hover, tab foreground on tab, foreground display on surface raised, and foreground on surface track where the track is not transparent.
- The Getting started page gains a Themes section with the attribute, the second fonts import, and a Token table with both Themes' values. The README's description and the first-release changeset stop calling Ridgeline the only Theme. A new minor changeset describes Noren.
- The glossary names Noren beside Ridgeline and defines Rail. ADR 0006 records the widening of ADR 0005.

## Testing decisions

There is one seam, the same one Ridgeline uses: the public package entry, rendered through Stories and run by Storybook's Vitest addon in Chromium. The build check and the Consumer smoke test, both already in the repo, guard the package shape. No new seam is added.

A good test renders a Component the way a Consumer would and asserts on what a user or assistive technology would observe. For a Theme that means computed colours, computed radii and border widths, and the attribute's effect, never the stylesheet's text.

- **Existing Stories.** Unchanged. Every play function runs once under the default Theme, since a Theme changes no behaviour. axe runs on every Story and fails on any violation.
- **Contrast.** The Tokens Story runs once per Theme and asserts 4.5:1 for every text pair and 3:1 for every edge pair, including the new roles. A Noren Story that leaves any Token undefined fails, which is how the kit proves a Theme is complete.
- **Shape.** The Noren Tokens Story also asserts, from computed style on a rendered TextField and Tab trigger, that the field has a 3px bottom border and no top border, and that the trigger's top corners are square. This is the one place the four-value Tokens are proven to reach the Components.
- **Theme switch.** A Story renders a Button inside a `data-theme="noren"` wrapper beside one outside it and asserts their computed backgrounds differ and match the two Themes' primary values. A second assertion in the same Story proves a plain `:root` override of primary beats both.
- **Build check.** The existing script additionally checks that the Noren fonts stylesheet is exported, that every face it references exists in the build output, that the main stylesheet contains the Noren block, and that the Noren licence file ships.
- **Smoke test.** The Next.js app sets the attribute on html and imports the Noren fonts stylesheet; the test asserts the computed primary is Lantern and every Noren face loads. The Vite app keeps its Ridgeline override check.

There is still no visual regression testing. The maintainer checks the look against the board in Storybook.

Prior art: the Tokens Story and its contrast helpers, the play functions in every Story file, the build verification script, and the smoke test script.

## Out of scope

- Tag, Stamp, lantern, and menu Card Components from the board.
- The taller active tab. Height is structure.
- Japanese font subsets for the Noren typefaces.
- A dark Color scheme for either Theme.
- Any change to a Component's public API or data attributes.
- A third Theme, or a Theme switcher Component.
- Visual regression testing.
- Shopfront teal, which has no role a Consumer can read text on.

## Further notes

- The design source is the Noren board, the third of six systems in the maintainer's "Moodboard Design Systems" HTML file, outside the repo. Every value the kit needs is in the Theme table above, so implementers don't need the file.
- Suggested build order: a foundation slice (the new Tokens on Ridgeline with unchanged rendering, the label weight and radius reads in component CSS, ADR 0006, the Storybook toolbar), then the Noren block and its contrast Story, then the fonts, then the shape changes to Tabs, TextField, Select, Checkbox, DataTable, and Dialog, then docs, changesets, the build check, and the smoke test.
- The foundation slice should leave every existing Story green with Ridgeline pixel-identical. That is the proof that the new roles were split, not invented.
- The board's "use red once per view" rule is composition guidance for the Consumer's page, not a constraint the kit can enforce. The board itself shows a red tab, a red Order button, and a red stamp in one view.
- Two deviations from the board, recorded by ticket 03. The outline Button's fill stays transparent in component CSS, so under Noren it shows Washi inside its Cat edge rather than Paper (story 10). The Dialog title keeps its italic from component CSS, so under Noren the browser synthesizes an oblique Shippori Mincho B1 (story 20). Neither is reachable through a Token value, and neither earns a Theme selector (ADR 0005).
- A `:root` override does not reach inside a `data-theme` wrapper, because the Theme block re-declares the Token on the wrapper itself. It beats both Themes when the attribute is on the html element. A Consumer who themes a subtree writes `:root, [data-theme] { ... }` for an override that reaches it.
- Label weight reaches further than the table says, recorded by ticket 01. The Dialog title and the DataTable caption read `--kui-label-weight` too, since the spec counts nine hard-coded weights and names label weight as the replacement for all of them, so there is no display-weight Token. Under Noren the 700 picks the 800 Shippori Mincho B1 face, the nearest one shipped.
- The horizontal Tabs list reads `--kui-radius-tab` for its own corners, recorded by ticket 02. The table names nothing for the list; 999px keeps Ridgeline's pill track and Noren's `0 0 6px 6px` puts square-topped cloth in a square-topped track under the Rail. The vertical list keeps radius card. The Rail colour Token is spelled `--kui-rail-color`.
- The Noren fonts ship as six files, not three, recorded by ticket 04. Google Fonts serves the latin and latin-ext subsets of a static face as separate files, so each of the three faces has two, mirroring Fraunces and Nunito Sans rather than Josefin Sans. 55 KB in all. The latin-ext slices are 1.6 to 1.7 KB each because the families barely draw that range: Shippori Mincho B1 has the dotless i and the OE ligature, Zen Kaku Gothic New adds the Welsh circumflexes, the capital sharp s, and the grave Y, and neither has Ł, ź, or the other Polish and Czech letters. So story 43's "cover latin and latin-ext" holds for the unicode ranges declared, not for the glyphs, and the docs say that most latin-ext letters fall back along with Japanese text.
