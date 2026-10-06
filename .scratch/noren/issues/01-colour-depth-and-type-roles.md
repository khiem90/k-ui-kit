# 01: Split the colour, depth, and type roles Ridgeline hid behind one value

**What to build:** A Consumer on Ridgeline sees nothing change, but can now override `--kui-secondary` and move only the secondary Button, `--kui-tab` and fill only inactive tabs, `--kui-foreground-display` and recolour only the Dialog title, `--kui-surface-track` and `--kui-shadow-track` and restyle only the Tabs track, and `--kui-label-weight` and change the weight of every label at once. These are the roles the Noren spec needs that Ridgeline had been reaching through another Token or a hard-coded weight. This is the expand step: nothing is removed, and Ridgeline renders identically.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The Ridgeline block declares surface track (Cream), shadow track (the rest shadow), foreground display (Ember), secondary (Cream), secondary hover (Peach sky), secondary foreground (Bark), tab (transparent), tab foreground (the muted foreground), and label weight (600), each with a comment naming its role and, where it has one, its palette name
- [x] The secondary Button reads the secondary trio for fill, hover, and text, and no longer reaches surface raised or the tint for those
- [x] Inactive Tab triggers read tab and tab foreground for fill and text; the hover and active rules are unchanged
- [x] The Tabs list reads surface track and shadow track instead of surface raised and the rest shadow
- [x] The Dialog title reads foreground display instead of primary
- [x] Every label rule (Button, TextField label, RadioGroup label, Tabs trigger, Select group label, DataTable header and sort button) reads label weight, and no `font-weight` with a raw number remains in component CSS
- [x] The Tokens Story lists the new roles and its contrast assertions cover the new pairs: secondary foreground on secondary and on secondary hover, tab foreground on tab where tab is not transparent, foreground display on surface raised, and foreground on surface track where the track is not transparent
- [x] A Story proves a plain `:root` override of secondary changes the secondary Button and leaves the primary and outline Buttons alone
- [x] Every existing Story passes unchanged, and Ridgeline renders identically in Storybook; lint, typecheck, tests, and build pass

## Comments

2026-10-06: Landed on branch `noren-01-colour-depth-and-type-roles`. The Ridgeline block in `src/styles/tokens.css` declares surface track, shadow track, foreground display, secondary, secondary hover, secondary foreground, tab, tab foreground, and label weight, each with the value its part used to reach through another Token or a raw 600. Button reads the secondary trio, Tabs reads the track pair and the tab pair, the Dialog title reads foreground display, and every label rule reads label weight. A Consumer on Ridgeline sees nothing change.

Three calls the ticket left open. The Dialog title and the DataTable caption read label weight too, since the spec counts nine hard-coded weights and says label weight replaces all of them, so no display-weight Token was added. The title keeps `font-style: italic` with no Token behind it. The Tabs list radius is untouched, that is ticket 02. The Getting started form, its MDX code block, and the Select Story's label example read `var(--kui-label-weight)` instead of 600, so the one Consumer-written label in the docs follows the Token as well.

One deviation. The `SecondaryTokens` Story reads the resting fill and text but not the hovered fill: a synthetic pointer never matches `:hover` in the Chromium run, as the DataTable Stories already record. The hover rule reads secondary hover, and the fill, the text, and the untouched primary and outline Buttons are asserted.

Verified with `pnpm check` (lint, typecheck, 149 Story tests in Chromium, build). Each new Story went red before its CSS change: the Tokens Story on the first undefined role, the Button and Tabs Stories on a Cream fill that ignored the override, the Dialog Story on an Ember title, and the label weight Story with six parts still at 600 after the override. A deliberate Cream secondary foreground failed the Tokens Story at 1:1 on secondary.

For later tickets. `isTransparentIn` in `src/docs/contrast.ts` skips a pair whose fill is transparent, and the Tokens Story keeps those pairs in `textPairsOnOptionalFill`, so the Noren Story can reuse both for tab and surface track. The Tokens Story now lists seven more colours, shadow track, and label weight, and a Noren block must declare every one. Under Noren the italic title will synthesize an oblique Shippori Mincho, and a 700 label weight will pick the 800 face, which is the nearest. The Getting started Token table has no rows for the nine new roles yet (ticket 06), and `tokens.css` line 1 still calls Ridgeline the only Theme (ticket 03 edits that file).
