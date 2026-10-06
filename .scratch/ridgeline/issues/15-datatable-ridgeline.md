# 15: DataTable Ridgeline styling

**What to build:** A Consumer's DataTable sits in a cream card and separates rows with tone instead of grid lines, following "layer, don't outline".

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas), 14 (DataTable behaviour without TanStack Table)

**Status:** ready-for-agent

- [x] The table sits in a surface raised container with the card radius
- [x] Header cells and sort buttons use the label style, keeping the existing direction indicator
- [x] Rows alternate surface raised and a light apricot tone, with no grid lines
- [x] Hovered and selected rows use Peach sky, and text on them keeps at least 4.5:1
- [x] Pagination controls use the Ridgeline Button
- [x] DataTable's CSS reads only the new Token names
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-06: Implemented in ba4d1e8 and e5caf9e on branch `ridgeline-15-datatable-ridgeline`, merged with `ridgeline` at 4adb640 (tickets 05 and 06 in).

The card is `.kui-data-table__scroll`, the element that already wraps the table and scrolls it. It gets surface raised, the card radius, the rest shadow, and 8px/12px padding. The padding keeps each row's rounded ends and the focus ring of a box in the last row clear of the 24px corner, which would otherwise clip them. The caption sits inside the card because it belongs to the table. The paging row sits below the card on the page. Header cells use the label font, case, and tracking at 0.75rem. The sort button has to inherit `text-transform` and `letter-spacing` explicitly, because Chromium's button styles reset both and `font: inherit` doesn't cover them. The chevron is unchanged.

Grid lines are gone. The table switched to `border-collapse: separate` with zero spacing, because collapsed borders ignore the radius on the end cells. Cells carry the fill, not rows, since a row background would show square corners behind them. Odd rows take a light apricot tone, `color-mix(in srgb, background 70%, surface raised)`, and even rows are cream, so the first row stands apart from the cream header. Hovered and selected rows are Peach sky through one shared rule. Bark on Peach sky is 7.8:1, and axe checks the cell text too.

The 1.4.11 problem ticket 05 flagged is real. Ember on Peach sky is about 2.8:1, so a checked box and the focus ring would both fail in a selected row. Those rows now set `--kui-primary` to `var(--kui-primary-hover)` (4.4:1 on the tint) and `--kui-focus-ring` to `var(--kui-foreground)` (7.8:1), and the Checkbox inside reads both. It stays at the Token level, so it doesn't depend on Checkbox markup. Two trade-offs a later ticket should know. A checked box in a tinted row no longer darkens on hover, since its rest colour is already primary hover. And a Consumer's override of `--kui-primary` or `--kui-focus-ring` on `:root` doesn't reach these rows, which use their primary hover and foreground values instead. The Tokens Story gains both pairs (`primary-hover` on tint, `foreground` on tint) in `edgePairs`.

The paging Buttons moved from the outline variant to secondary. They sit on the apricot page below the card, and the spec keeps strokes for fields, so a cream pill with the raised shadow fits better than a Bark outline. The markup and behaviour are unchanged, so Paginated and the other paging Stories pass as they were.

A new Layered Story asserts each checkbox above through computed styles. It checks the card colour and radius, and the label style on every header and sort button against a probe styled with the label Tokens. It checks zero border widths on every cell, the stripe order, and that the tone sits between apricot and cream. It checks the Peach sky fill and 4.5:1 text on a selected row, 3:1 for primary and the focus ring inside that row, and the secondary `kui-button` paging controls outside the card. Hover isn't asserted, because user-event's synthetic pointer never matches `:hover`. It shares the selected rule, and I checked it by eye in Storybook. No existing Story changed. All 13 DataTable Stories pass.

Verified with `pnpm check` after the merge: lint, typecheck, 117 Story tests in Chromium with axe as an error, and the build with its verifier. Old Token names in DataTable.css: none.
