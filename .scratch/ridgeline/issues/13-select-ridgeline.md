# 13: Select Ridgeline styling

**What to build:** A Consumer's Select trigger matches TextField, and its list is a cream Ridgeline card whose highlighted option is visible to keyboard users.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas), 12 (Select behaviour without Radix)

**Status:** ready-for-agent

- [x] The trigger matches TextField: surface raised, field radius, 2px border, Ember border plus focus ring on focus, and the same three heights
- [x] The list is surface raised with the card radius and floating shadow
- [x] Options use the field radius; the selected option shows an Ember check
- [x] The highlighted option gets a Peach sky fill and the focus ring, since the fill alone can't serve as the focus indicator
- [x] Group labels use the label style
- [x] Select's CSS reads only the new Token names
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Landed on branch `ridgeline-13-select-ridgeline`. The changes are in `Select.css`, new Stories, one scroll fix in `Select.tsx`, and a comment in `Tokens.stories.tsx`. Props, markup, and data attributes are as ticket 12 left them.

The trigger is drawn as a TextField. It is cream with the field radius, 18px inline padding, Nunito Sans at 16px at every size, and a 2px edge in the border Token. Heights stay at 36, 44, and 52px. Hover darkens the edge to Bark. Focus turns the edge Ember and adds the 2px Ember ring at a 2px offset.

Ticket 04 asked that the trigger keep its danger edge while focused. Select has no error prop, and the API is frozen, so the hook is `aria-invalid` on the trigger, which a Consumer already passes as a button attribute. A trigger with `aria-invalid` set to anything but "false" gets the danger edge, keeps it under focus, and skips the hover edge. The `Invalid` Story covers it, and it also shows a Consumer wiring an error message through `aria-describedby`.

The list is a cream card with the card radius and the floating shadow. It has no stroke. Its 1px transparent edge shows up only under forced colours, where the shadow and fill go away. Padding grew to 8px so the focus ring fits around an option. Options use the field radius, 40px min height, and a 32px inline start for the check. The 72px `--kui-space-8` padding is gone. The selected option shows an Ember check.

The highlighted option is Peach sky with the focus ring. I put the ring on `[data-highlighted]` rather than `:focus-visible`, because the option under the mouse is the highlighted one too and the ticket asks for the ring wherever the fill shows. The ring sits on the cream around the option, where Ember is 4.6:1. One deviation. Ember on Peach sky is about 2.8:1, under the 3:1 a graphic needs, so the check on a highlighted option turns primary hover (4.4:1). DataTable does the same for its checked box on a Peach sky row, and that pair is already in `edgePairs`. I only extended the comment there.

Group labels use the label font, case, and tracking at 12px, weight 600, in muted text, lined up with the option text.

A behaviour fix. The arrow keys used to scroll a middle option flush with the list's edge, which clipped the ring. `focusOption` now honours the list's `scroll-padding-block`, set to 8px in CSS. The new `ScrollsRingIntoView` Story walks LongList down and back up and checks that the ring is in view at every step. It failed before the fix.

New Stories: `Ridgeline` (all three sizes), `Focused`, `Invalid`, `RidgelineList` (card, group label, option radius, check colour, highlight fill and ring), and `ScrollsRingIntoView`. They finish running transitions before reading colours, as TextField's Stories do. The size Stories' label now uses the label style, with TextField's 8px gap. Every existing behavioural assertion is unchanged.

Verified with `pnpm check` after merging the `ridgeline` tip (lint, typecheck, Story tests in Chromium with axe as an error, build). I also took screenshots from a worktree Storybook with real Playwright input. The triggers, the invalid focused trigger, the grouped list with keyboard and mouse highlight, the scrolled LongList, and the TextField row all look right, with no console errors.

For ticket 16: Select's CSS reads no old Token names now.
