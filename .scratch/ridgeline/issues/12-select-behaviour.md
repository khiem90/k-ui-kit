# 12: Select behaviour without Radix

**What to build:** A Consumer's Select is a listbox written in the kit, anchored to its trigger with the positioning from Tooltip, and keyboard and form behaviour match today. It keeps today's look; Ridgeline styling is ticket 13.

**Blocked by:** 09 (Tooltip), for the popover and anchoring pattern

**Status:** ready-for-agent

- [x] The trigger has the combobox role and the existing labelling; the list is a manual popover with the listbox role, anchored below the trigger and at least as wide, flipping when there isn't room
- [x] Opening moves focus into the list onto the selected option, or the first one
- [x] Arrow keys, Home, End, typeahead, Enter, and Space behave as today; disabled options are skipped; Escape closes and returns focus to the trigger
- [x] Groups have the group role labelled by their label
- [x] The list closes on an outside pointer press or when focus leaves it; the rest of the page is not hidden from assistive technology
- [x] The trigger no longer needs to leave the Tab order while the list is open, since nothing is aria-hidden
- [x] A visually hidden native select mirrors the value, so name, required, and form reset behave as today
- [x] The list scrolls natively with a visible scrollbar; the scroll-up and scroll-down buttons are removed
- [x] Parts expose the same data-state values as today
- [x] A Story asserts the list sits below its trigger by comparing bounding boxes
- [x] A Story asserts the selected value appears in a submitted form, and that required blocks submission when empty
- [x] `@radix-ui/react-select` is removed from the manifest and the lockfile, and no Radix package remains
- [x] Existing Select Stories pass with their behavioural assertions unchanged; any Story that queried the scroll buttons is updated and the change is noted in this ticket's comments
- [x] axe passes on every Story, including those that end with the list open; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in b65127a on branch ridgeline-12-select-behaviour, merged with the ridgeline tip (tickets 04 and 10 included) in 1dca705. Select no longer uses Radix. The trigger is a button with the combobox role, `aria-expanded`, `aria-controls` while open, `aria-required`, and `aria-autocomplete="none"`, as before. The list is a `popover="manual"` div with the listbox role, anchored below the trigger by `useAnchoredPopover` from `src/popover.tsx` with a 4px gap, at least as wide as the trigger through `min-inline-size: anchor-size(width)`, and flipped above by `position-try-fallbacks` when it doesn't fit below. Groups have the group role and `aria-labelledby` pointing at their label. Options carry real focus with tabindex -1, and disabled ones leave the focus order. `@radix-ui/react-select` is gone from package.json and pnpm-lock.yaml, and with ticket 10 merged the lockfile has no Radix package left. The `dependencies` field is now an empty object; ticket 16 removes the field.

Behaviour kept from Radix. Enter, Space, ArrowDown, ArrowUp, and click open the list. Focus lands on the selected option, or the first enabled one. Arrow keys skip disabled options and don't wrap. Home and End jump to the ends. Typeahead builds a search over one second, cycles on a repeated letter, and on the closed trigger picks the match outright. Enter or Space picks, and a space typed mid-search is part of the search. Escape closes and returns focus to the trigger, and it stops propagating, so a Dialog around the Select stays open. A mouse opens the list on press and picks on release, so press, drag, and release still works. Touch and pen open on click. Hovering an option focuses it. data-state is open/closed on the trigger and list and checked/unchecked on options, plus `data-highlighted`, `data-disabled`, and `data-placeholder`, as before. One small change. `aria-selected` now follows the value alone, where Radix set it only on the selected option while that option was focused. The Story assertions hold either way.

New behaviour. Nothing is aria-hidden while the list is open, so the trigger keeps its Tab stop. The list closes on a pointer press outside it and the trigger, and when focus leaves it (Tab, Shift+Tab, a click elsewhere, or the window losing focus). Tab moves on to the next control instead of being swallowed as Radix did. The list scrolls natively with the browser's scrollbar, capped at `min(20rem, 100dvh - 16px)`.

Form behaviour. Inside a form, Root renders a visually hidden native select (aria-hidden, tabindex -1) with an empty option plus one option per Item, so name, required, and autofill work. Each value change dispatches a bubbling change event from it, as Radix did. A form reset sets the value back to the one the Select started with and calls onValueChange with it, or with "" when it started empty. Radix passed undefined there, which the prop's type never allowed.

Story changes. WithGroups ended by asserting `tabindex="-1"` on the trigger while open. It now asserts the trigger has no tabindex and is still found by its role. LongList queried the scroll buttons and `.kui-select__viewport`, both gone. It now asserts the list is at most 320px, has `overflow-y: auto` with a scrollbar not set to none, starts at scrollTop 0 with December below the fold, and that End scrolls December into view and Home back to 0. It keeps its old checks on height, End, and the pick. It no longer waits on hover timers, so it is deterministic: five runs in a row passed. InForm adds a reset button and asserts that reset brings back the placeholder, that required then blocks submission again, and that a new pick submits. New Stories: PlacedBelowTrigger and FlipsWhenNoRoom compare bounding boxes (gap equals the offset, list at least as wide as the trigger and overlapping it), ClosesOnOutsidePress, and ClosesWhenFocusLeaves. Every other behavioural assertion is unchanged.

Verified with `pnpm check` after the merge: lint, typecheck, 136 Story tests in Chromium with axe as an error (WithGroups and WithDisabledItem end with the list open), and the build with its verifier. I also drove a worktree Storybook with real Playwright input to cover what user-event's synthetic events can't. Click, press-drag-release, Escape, Tab, outside click, wheel scrolling, and the flip all worked, with no console errors.

For ticket 13. The look is unchanged apart from what the rewrite forced. The viewport's padding moved onto `.kui-select__content`, the scroll-button rules are gone, and the list resets the UA popover box inside `@supports (position-area: bottom)`. The list has `outline: none`, since it only takes focus itself while the pointer rests on a disabled option or a group label. The CSS still reads the old Token names (radius-md/sm, font-family) and the 72px `--kui-space-8` inline padding on options and group labels. The list is always in the DOM and the UA hides it while closed, so `[data-state="closed"]` styles on it never show. `useAnchoredPopover` gained an `open` option: pass it to keep the popup mounted and show it only while true.
