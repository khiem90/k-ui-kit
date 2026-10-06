# 01: Split the colour, depth, and type roles Ridgeline hid behind one value

**What to build:** A Consumer on Ridgeline sees nothing change, but can now override `--kui-secondary` and move only the secondary Button, `--kui-tab` and fill only inactive tabs, `--kui-foreground-display` and recolour only the Dialog title, `--kui-surface-track` and `--kui-shadow-track` and restyle only the Tabs track, and `--kui-label-weight` and change the weight of every label at once. These are the roles the Noren spec needs that Ridgeline had been reaching through another Token or a hard-coded weight. This is the expand step: nothing is removed, and Ridgeline renders identically.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The Ridgeline block declares surface track (Cream), shadow track (the rest shadow), foreground display (Ember), secondary (Cream), secondary hover (Peach sky), secondary foreground (Bark), tab (transparent), tab foreground (the muted foreground), and label weight (600), each with a comment naming its role and, where it has one, its palette name
- [ ] The secondary Button reads the secondary trio for fill, hover, and text, and no longer reaches surface raised or the tint for those
- [ ] Inactive Tab triggers read tab and tab foreground for fill and text; the hover and active rules are unchanged
- [ ] The Tabs list reads surface track and shadow track instead of surface raised and the rest shadow
- [ ] The Dialog title reads foreground display instead of primary
- [ ] Every label rule (Button, TextField label, RadioGroup label, Tabs trigger, Select group label, DataTable header and sort button) reads label weight, and no `font-weight` with a raw number remains in component CSS
- [ ] The Tokens Story lists the new roles and its contrast assertions cover the new pairs: secondary foreground on secondary and on secondary hover, tab foreground on tab where tab is not transparent, foreground display on surface raised, and foreground on surface track where the track is not transparent
- [ ] A Story proves a plain `:root` override of secondary changes the secondary Button and leaves the primary and outline Buttons alone
- [ ] Every existing Story passes unchanged, and Ridgeline renders identically in Storybook; lint, typecheck, tests, and build pass
