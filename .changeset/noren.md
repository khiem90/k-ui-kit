---
"k-ui-kit": minor
---

Add Noren, a second Theme. Set `data-theme="noren"` on the html element, or on any ancestor, and every Component under it turns into the late-night ramen counter: Washi and Paper surfaces, Cat text, Lantern red for the primary Button, checked controls, the active tab, and the focus ring, a Cedar secondary Button, Tabs hung like cloth from a Cedar Rail, fields with a 3px underline and no other edge, flat 4px Buttons with no shadow, a Dialog with the Rail along its top in place of the arch, an Old wall overlay, Broth for hover and selection, and a gold lantern glow on the Dialog, Tooltip, and the Select list. A Dialog opened from inside a Noren subtree is Noren too. Noren ships beside Ridgeline in `k-ui-kit/styles.css`, and each declares a light Color scheme. Without the attribute, Ridgeline is unchanged.

Noren is Token values only (ADR 0005). To carry its shapes, a Token may now hold more than one value (ADR 0006): `--kui-radius-field`, `--kui-radius-tab`, and `--kui-border-width-field` may hold four values, one per corner or side, and a width may be `0` and a shadow `none`. Sixteen roles are new, and Ridgeline fills each with the value its part already drew, so Ridgeline renders as before:

- `--kui-surface-track` and `--kui-shadow-track` for the Tabs list.
- `--kui-foreground-display` for the Dialog title.
- `--kui-secondary`, `--kui-secondary-hover`, and `--kui-secondary-foreground` for the secondary Button.
- `--kui-tab` and `--kui-tab-foreground` for an inactive tab.
- `--kui-label-weight` in place of the hard-coded 600 on every label, the Dialog title, and the DataTable caption.
- `--kui-radius-button` for Button, `--kui-radius-tab` for Tab triggers and the Tabs list, `--kui-radius-check` for the Checkbox box, and `--kui-radius-row` for DataTable row ends.
- `--kui-border-width-field` for the edge of TextField and the Select trigger.
- `--kui-rail-width` and `--kui-rail-color` for the Rail, which Ridgeline sets to 0.

`--kui-radius-pill` stays for Switch and the Dialog close button. A plain `:root` override still beats either Theme when the attribute is on the html element. It does not reach inside a `data-theme` wrapper lower down the page, so an override meant for a themed subtree is written as `:root, [data-theme] { ... }`.

`k-ui-kit/fonts/noren.css` is a second optional stylesheet that loads Shippori Mincho B1 at 800 and Zen Kaku Gothic New at 400 and 700 from woff2 files inside the package, 55 KB across six files, with each family's SIL Open Font License beside them. `k-ui-kit/fonts.css` stays Ridgeline's, so import the one for the Theme you use. The files are the latin and latin-ext subsets, and the two families draw almost no latin-ext glyphs, so Japanese text and most accented Central European letters fall back along the font stack: to the system mincho and gothic on a Japanese system, and to Georgia and `system-ui` elsewhere.
