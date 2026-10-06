# 06: Switch

**What to build:** A Consumer's Switch is a Ridgeline pill track that toggles with Space or Enter, reports its state to assistive technology, and submits in a form when it has a name, with no Radix underneath.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas)

**Status:** ready-for-agent

- [x] A button with the switch role and aria-checked is the interactive element; Space and Enter toggle it
- [x] The root exposes the same data-state values as today
- [x] When it has a name, a hidden input carries its value into the form, and required is honoured
- [x] Off is a surface raised track with the 2px border and a muted thumb; on is an Ember track with a cream thumb
- [x] A Story asserts the switch's value appears in a submitted form
- [x] Switch's CSS reads only the new Token names
- [x] `@radix-ui/react-switch` is removed from the manifest and the lockfile
- [x] Existing Switch Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 02258b1 on branch ridgeline-06-switch. Switch is a native button with `role="switch"` and `aria-checked`, so Space and Enter toggle it without key handlers. The root, the button, and the thumb carry the same `data-state` and `data-disabled` values Radix gave them. `@radix-ui/react-switch` is gone from package.json and pnpm-lock.yaml. Off is a cream track with the 2px border and a muted thumb, on is an Ember track and border with a cream thumb, and hover goes to Peach sky when off and to primary hover when on. The CSS reads only Ridgeline Token names. I checked the computed colours in Storybook for off, on, and disabled.

I added four Stories before removing Radix and ran them against it first: EnterToggles, RootState, DisabledRootState, and FormResetAndChange. They pin Enter, the root attributes, form reset, and one form onChange per toggle. The existing InForm and Required Stories already assert submission and required, and every existing Story passes unedited. Verified with `pnpm check`: lint, typecheck, 114 Story tests in Chromium with axe as an error, and the build and its verifier.

Decisions a later ticket needs. The hidden input follows Radix's rule rather than the ticket's wording. It renders whenever the button has a form owner (`button.form`, which covers both an ancestor form and the `form` prop), and before mount it assumes a form so server markup submits. That keeps `required` working on a switch with no name. It is an `aria-hidden` checkbox with `tabIndex={-1}`, hidden with inline styles so it stays invisible without the stylesheet, and sized over the track by `.kui-switch__input`. The input's checked state is set through the prototype setter and followed by a bubbling click, the same trick Radix used, so a Consumer's React `onChange` on the form fires. Only user toggles send that click. A controlled change from the parent updates the input silently, which is slightly quieter than Radix. Tokens.stories.tsx gained one edge pair, border on background, for the off track against the page. Ticket 05 had already added primary on background, which covers the on track, so the merge dropped my duplicate of it.
