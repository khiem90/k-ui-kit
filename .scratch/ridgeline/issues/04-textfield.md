# 04: TextField

**What to build:** A Consumer's TextField is a cream Ridgeline field whose edge stays visible on the apricot page, turns Ember with a focus ring when focused, and shows errors in the danger colour.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] The label uses the label style; the description is muted body text
- [x] The field is surface raised with the field radius, 18px inline padding, body font at 16px, and a 2px border in the border Token
- [x] On focus the border turns Ember and the standard focus ring also shows
- [x] On error the border and the error message use the danger colour
- [x] sm, md, and lg are 36, 44, and 52 pixels tall, matching Button
- [x] TextField's CSS reads only the new Token names
- [x] Existing TextField Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Landed on branch `ridgeline-04-textfield`. Only `TextField.css` changed, plus new Stories. The Component's markup and props are as they were.

The field is cream with the field radius, 18px inline padding, Nunito Sans at 16px, and a 2px edge in the border Token. Font size and padding are the same at every size now, and only the height changes: 36, 44, and 52px. The label takes the label font, case, and tracking at 14px and weight 600. The description is muted body text at 14px. Focus turns the edge Ember and keeps the 2px Ember ring at a 2px offset. Hover darkens the edge to Bark. Read-only fields take the apricot background so they sit back from editable ones, and disabled fields stay at half opacity. The CSS reads only new Token names.

One decision the ticket left open. When a field is both invalid and focused, the edge stays danger and the Ember ring shows, so the error stays visible while the Consumer types. Ticket 13 should do the same for the Select trigger.

Verified with `pnpm check` after merging the `ridgeline` tip (lint, typecheck, 131 Story tests in Chromium with axe, build). The existing Stories keep their behavioural assertions. Small, Medium, and Large now expect 36, 44, and 52px. New Stories `Ridgeline`, `Focused`, and `ErrorColours` compare computed styles with the Tokens. The border check calls `finish()` on running transitions before it reads the colour. Without that, the 150ms transition shows the starting colour, and waiting instead would hang in a background tab where transitions don't advance. Moving the focus rule after the invalid rule made `ErrorColours` fail, so the check does catch that mistake.

One edit outside TextField, in its own commit. Select's Small, Medium, and Large Stories render a TextField beside the trigger and assert both share a height. So I raised the trigger's three `min-block-size` values in `Select.css` to 36, 44, and 52px and updated those Stories. Nothing else in Select changed. Ticket 13 still owns the trigger's padding, font size, border, and radius. If ticket 12 rewrites `Select.css`, expect a small conflict on those three lines and keep the new heights.
