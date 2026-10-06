# 11: Dialog Ridgeline styling

**What to build:** A Consumer's Dialog has an arched top with a centred header, the kit's signature shape, and the arch stays well proportioned at any width.

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas), 10 (Dialog behaviour without Radix)

**Status:** ready-for-agent

- [x] The content is surface raised with the floating shadow over the overlay Token
- [x] The top corners use the arch radius, capped at half the content's width; the bottom corners use the card radius
- [x] The header is centred: Title in the display font, italic, in Ember; Description in muted body text below it
- [x] The close button sits fully inside the arch's curve at every supported width
- [x] A Story shows a narrow and a wide Dialog, so the arch cap can be checked by eye
- [x] Dialog's CSS reads only the new Token names
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 32abc35 on branch ridgeline-11-dialog-ridgeline. Only Dialog.css, Dialog.stories.tsx, and one line of Tokens.stories.tsx changed. Dialog.tsx is untouched.

The panel's look moved from the dialog element to `.kui-dialog__viewport`. A percentage radius resolves against the width horizontally and the height vertically, so `min(var(--kui-radius-arch), 50%)` draws an ellipse whenever the panel isn't square. The arch has to be a circle capped at half the width, and a box can't read its own width for its own radius. So the dialog is now `container-type: inline-size` with a transparent background and visible overflow, and the viewport draws the cream surface, the floating shadow, and the radii with `min(var(--kui-radius-arch), 50cqi)` on both axes. The bottom corners take `--kui-radius-card`. The viewport has a minimum height of the arch plus a card corner, because a browser scales every radius down when two on one side add up to more than that side. The backdrop is still `::backdrop` reading `--kui-overlay`. The old 1px border is gone.

The close button sits at `r(1 - 1/sqrt(2))` plus space-2 from the top and end edges, where r is the capped arch. That is where a quarter circle crosses the 45-degree line, so the button's outer corner and its 4px focus ring stay inside the curve at any width. The title is Fraunces italic, weight 600, 1.5rem, in Ember, centred, with equal inline margins that clear the button. A long title wraps before it reaches the button. The description is centred, muted, in the body font. The viewport's top padding grew to space-7 so the header sits level with the button. The close button's hover is now the tint, and its shape is a circle.

Verified with `pnpm check`: lint, typecheck, 133 Story tests in Chromium with axe as an error, and the build and its verifier. The built CSS keeps `sqrt()` and `cqi` as written. The new ArchAtTwoWidths Story opens an 18rem panel (the default width on a 320px phone, under twice the arch) and a 40rem panel. On each one it checks the surface colour and shadow, the backdrop colour, that both top radii equal min(arch, width / 2) on both axes, the card radius at the bottom, the minimum height, that the title and description are centred on the panel with the right fonts and colours, and that the close button's ring lies inside the arch circle and clear of the title. It ends with the wide panel open. I also took screenshots from this worktree's own Storybook at 1000px, 360px, and 320px. The narrow panel's top is a semicircle, the wide one keeps the 160px arch, and the close ring sits inside the curve. The Tokens Story gained the pair `--kui-primary` on `--kui-surface-raised` for the Ember title. It measures 4.6:1.

Story change. The Default Story's button row now wraps. At 320px the tracked Cancel and Delete labels were wider than the panel, and the viewport clipped Cancel.

Decisions a later ticket needs.
- A Consumer who styled `.kui-dialog`'s background, border, or radius now has to target `.kui-dialog__viewport`. The class names and markup are unchanged. Ticket 17's changeset should mention this.
- The dialog has size containment on the inline axis, so a Consumer must give the Content a definite width. A rule like `inline-size: fit-content` collapses it. The default is `inline-size: 28rem` with `max-inline-size: calc(100% - 2 * var(--kui-space-4))`, which also keeps a Consumer's wider panel inside the window.
- If the dialog itself takes focus (it holds nothing focusable), the focus ring is drawn on the viewport, so it follows the arch.
- Outside presses are unchanged from ticket 10. A press in a corner the arch cuts away is inside the dialog's box, so it doesn't close the dialog.
