# 01: Split the surface field role out of surface raised

**What to build:** A Consumer on Ridgeline or Noren sees nothing change, but can now override `--kui-surface-field` and move only the fill of TextField, the Select trigger, the Checkbox box, the Switch track, and the RadioGroup control, leaving the Dialog, Tooltip, Select list, and DataTable body on `--kui-surface-raised`. This is the role the Rooftop spec needs, where fields recess to the page colour inside a lighter panel. This is the expand step: nothing is removed, and both light Themes render identically.

**Blocked by:** None (can start immediately)

**Status:** resolved

**GitHub:** https://github.com/khiem90/k-ui-kit/issues/6

- [x] The Ridgeline block declares `--kui-surface-field` as Cream and the Noren block as Paper, each with a comment naming the role and the palette name, placed beside surface raised
- [x] TextField, the Select trigger, the Checkbox box, the Switch track, and the RadioGroup control read surface field for their fill; the Select list and its options, the Dialog, the Tooltip, and the DataTable body still read surface raised
- [x] The Tokens Story lists surface field among the colours a Theme must fill, and its edge pairs change for every Theme: border on surface field replaces border on surface raised, and foreground on surface raised is added for the outline Button's edge; border on the page, on the stripe, and on the tint stay
- [x] A Story proves a `:root` override of surface field changes a TextField's fill and leaves a Dialog panel alone
- [x] The Getting started form and any docs example that reads surface raised for a field now reads surface field
- [x] Every existing Story passes unchanged, and Ridgeline and Noren render identically in Storybook; lint, typecheck, tests, and build pass

## Comments

2026-10-09: Landed on branch `claude/kind-lamport-q4wrek`. `--kui-surface-field` sits right under surface raised in both light blocks of `src/styles/tokens.css`, Cream under Ridgeline and Paper under Noren, each with a comment naming the role and the palette. TextField's input, the Select trigger, the Checkbox box, the Switch track, and the RadioGroup control now read it; the Select list, the Dialog viewport, the Tooltip's text colour, and both DataTable fills still read surface raised. No other CSS changed.

`src/docs/Tokens.stories.tsx` lists the new Token among the colours a Theme must fill, so the Noren Story fails if the Noren block ever drops it. The edge pairs changed as the spec asks: border on surface field replaces border on surface raised, and foreground on surface raised is added for the outline Button's edge inside a Dialog; border on the page, the stripe, and the tint stay. The Border swatch draws its field on surface field. A new `SurfaceField` Story opens a Dialog beside a TextField, reads both fills as Cream, then sets `--kui-surface-field` on the html element and reads the field as the override and the Dialog viewport still Cream. The Getting started table's surface raised row no longer says "Fields", and a surface field row follows it; the Rooftop column waits for ticket 05.

Verified with `pnpm lint`, `pnpm typecheck`, and `pnpm test` (154 Story tests in Chromium, 153 green). The one red test, Tooltip "Flips When No Room", fails the same way on the untouched base in this container's Chromium 141, where `position-try` does not flip the box, so it is not this ticket's. Ridgeline and Noren render identically because both values are the ones those parts already drew.
