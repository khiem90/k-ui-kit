# 01: Split the surface field role out of surface raised

**What to build:** A Consumer on Ridgeline or Noren sees nothing change, but can now override `--kui-surface-field` and move only the fill of TextField, the Select trigger, the Checkbox box, the Switch track, and the RadioGroup control, leaving the Dialog, Tooltip, Select list, and DataTable body on `--kui-surface-raised`. This is the role the Rooftop spec needs, where fields recess to the page colour inside a lighter panel. This is the expand step: nothing is removed, and both light Themes render identically.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The Ridgeline block declares `--kui-surface-field` as Cream and the Noren block as Paper, each with a comment naming the role and the palette name, placed beside surface raised
- [ ] TextField, the Select trigger, the Checkbox box, the Switch track, and the RadioGroup control read surface field for their fill; the Select list and its options, the Dialog, the Tooltip, and the DataTable body still read surface raised
- [ ] The Tokens Story lists surface field among the colours a Theme must fill, and its edge pairs change for every Theme: border on surface field replaces border on surface raised, and foreground on surface raised is added for the outline Button's edge; border on the page, on the stripe, and on the tint stay
- [ ] A Story proves a `:root` override of surface field changes a TextField's fill and leaves a Dialog panel alone
- [ ] The Getting started form and any docs example that reads surface raised for a field now reads surface field
- [ ] Every existing Story passes unchanged, and Ridgeline and Noren render identically in Storybook; lint, typecheck, tests, and build pass

## Comments
