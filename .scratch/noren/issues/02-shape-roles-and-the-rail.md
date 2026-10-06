# 02: Shape roles and the Rail

**What to build:** A Consumer on Ridgeline sees nothing change, but can now give Buttons, Tab triggers, Checkbox boxes, and DataTable row ends their own radius, write a four-corner field radius such as `4px 4px 0 0`, write a four-side field border width such as `0 0 3px` to get an underlined field, and set a Rail width and colour to draw a bar along the top of every Tabs list and Dialog. Ridgeline sets the Rail width to 0, so it draws nothing today. This is the second half of the expand step and the first use of ADR 0006.

**Blocked by:** 01 (shares the Button and Tabs stylesheets)

**Status:** resolved

- [x] The Ridgeline block declares radius button (999px), radius tab (999px), radius check (6px), radius row (12px), border width field (2px), rail width (0), and rail colour (Ember), with comments
- [x] Button reads radius button, Tab triggers read radius tab, Checkbox reads radius check instead of half the field radius, and DataTable rows read radius row at their ends; radius pill is read only by Switch and the Dialog close button
- [x] The TextField input and the Select trigger read border width field for the edge, and the hover, focus, error, and read-only rules still set only the border colour, so they apply to whichever sides have width
- [x] No Token that may hold four values is read through `calc()` or a longhand corner or side property; radius field, radius tab, and border width field are the only three that may
- [x] The Tabs list draws the Rail as a top border from rail width and rail colour, and the Dialog viewport draws the same Rail above its arch corners
- [x] The Tokens Story lists the new roles, and a Story proves from computed style that a `:root` override setting rail width to 10px shows a bar on a Tabs list and on an open Dialog, that an override of border width field to `0 0 3px` leaves a rendered TextField with a 3px bottom border and no top border, and that an override of radius tab to `0 0 6px 6px` leaves a Tab trigger with square top corners
- [x] The comment above the Ridgeline shape Tokens points at ADR 0006
- [x] Every existing Story passes unchanged, and Ridgeline renders identically in Storybook; lint, typecheck, tests, and build pass

## Comments

2026-10-06: Landed on branch `noren-02-shape-roles-and-the-rail`. The Ridgeline block in `src/styles/tokens.css` declares radius button and radius tab (999px), radius check (6px), radius row (12px), border width field (2px), rail width (0), and rail colour (Ember), under a comment that points at ADR 0006. Button reads radius button, Tab triggers read radius tab, Checkbox reads radius check, the DataTable row ends read radius row through their longhand corners, and radius pill is left to Switch and the Dialog close button. The TextField input and the Select trigger draw their edge from the three border longhands with the width from border width field, and their hover, focus, read-only, and error rules still set only the colour. The Tabs list and the Dialog viewport draw the Rail as a `border-block-start` from the two rail Tokens. A Consumer on Ridgeline sees nothing change.

Two calls the ticket left open. The Tabs list reads radius tab for its own radius, since the spec names nothing for it and 999px keeps Ridgeline's pill track, while Noren's `0 0 6px 6px` puts square-topped tabs in a square-topped track under the Rail. The vertical list keeps radius card. The Rail Token for colour is spelled `--kui-rail-color`, matching the kit's other names, which are role words with British spelling only in comments.

The Rail is a `border-block-start` rather than `border-top`, matching the logical properties the component sheets already use. On the Dialog viewport it sits inside the arch's longhand corners, so under Noren the 10px bar follows the 4px arch and under Ridgeline a 0 width draws nothing. The viewport is border-box, so a Theme's Rail comes out of its padding, not its height.

The Tokens Story's radius swatch used `min(var(name), 50%)`, which a four-value Token breaks, so each radius now goes straight into `border-radius` and the browser shrinks the pill and the arch to the swatch. A Border section shows the field edge and the Rail. The Getting started override example now sets `--kui-radius-button`, and the radius pill row names Switch and the Dialog close button; the table has no rows for the seven new roles yet (ticket 06).

Verified with `pnpm check` (lint, typecheck, 151 Story tests in Chromium, build). Each Story went red before its change: the Ridgeline Story on `--kui-rail-color` undefined, RailTokens on a 0px top edge under the 10px override, and ShapeTokens on Button, tab, box, and row corners that ignored their overrides while the field radius followed. One deliberate failure after everything was green: pointing Button back at radius pill made ShapeTokens report the 7px decoy instead of 3px, so the decoys bite.

For later tickets. Ticket 03's Noren block must declare all seven: `--kui-radius-button`, `--kui-radius-tab`, `--kui-radius-check`, `--kui-radius-row`, `--kui-border-width-field`, `--kui-rail-width`, and `--kui-rail-color`; the Ridgeline Story lists them, so a Noren Story that reuses its lists fails on any one missing. `src/docs/Tokens.stories.tsx` exports nothing, but its `corners`, `edges`, `topEdge`, and `same` helpers and the `ShapedParts` and `RailedParts` trees are there to lift into a Noren Story, which under a `data-theme="noren"` root can assert the field's `["0px", "0px", "3px", "0px"]` edges and the tab's `["0px", "0px", "6px", "6px"]` corners the same way. `--kui-rail-color` sits in the `colours` list for a swatch and in no contrast pair, since the Rail is decorative. The existing Ridgeline Stories still assert `borderTopWidth` "2px" on the field and the trigger and "12px" and "999px" radii, so they pin Ridgeline as the attribute-less default.
