---
"k-ui-kit": minor
---

First release: ten accessible Components in the Ridgeline Theme, with no runtime dependencies besides React.

Ridgeline is warm apricot and cream surfaces, Ember for actions, pill Buttons, an arched Dialog, and three typefaces. It is the default Theme, its Color scheme is light, and it applies as soon as you import `k-ui-kit/styles.css`, with no attribute to set. Every value is a Token on `:root`, named for its role: `--kui-background`, `--kui-surface-raised`, `--kui-surface-stripe`, `--kui-tint`, `--kui-foreground`, `--kui-foreground-muted`, `--kui-border`, `--kui-primary`, `--kui-primary-hover`, `--kui-primary-foreground`, `--kui-primary-on-tint`, `--kui-danger`, `--kui-danger-hover`, `--kui-danger-foreground`, `--kui-focus-ring`, `--kui-focus-ring-on-tint`, `--kui-overlay`, `--kui-shadow-rest`, `-raised`, and `-floating`, `--kui-font-display`, `-label`, and `-body`, `--kui-font-size-sm`, `-md`, `-lg`, and `-display`, `--kui-label-case`, `--kui-label-tracking`, `--kui-radius-field`, `-card`, `-pill`, and `-arch`, `--kui-space-1` to `-8`, `--kui-padding-field-inline`, and `--kui-motion-duration`. The kit's own selector carries zero specificity, so a plain `:root` rule overrides any of them, the Peach sky rows and options included: a control drawn on the tint reads the two on-tint Tokens, so set those beside `--kui-primary` and `--kui-focus-ring`. Every text pair the kit draws meets WCAG AA, and field edges and the focus ring meet 3:1. To get there, `--kui-foreground-muted` is `#654b41`, one step darker than the Ridgeline board's `#6b4f45`, which measured 4.3:1 on the Peach sky tint.

`k-ui-kit/fonts.css` is a separate, optional stylesheet that loads Fraunces, Josefin Sans, and Nunito Sans from woff2 files inside the package, with each family's SIL Open Font License beside them. The main stylesheet loads no font files, so skip the import if you already serve these fonts. Without either, the kit falls back to Georgia and `system-ui`. Fraunces and Nunito Sans ship as latin and latin-ext subsets, so a page fetches only the ranges it draws. Josefin Sans ships whole as one 48 KB file covering both ranges, because its licence reserves the name "Josefin Sans" and forbids it on a subset.

Button has five variants, three sizes, leading and trailing icon slots, and `asChild`. Primary is an Ember pill, secondary a raised cream pill, ghost reads as underlined text, outline keeps a Bark border, and danger is a red pill cooler than Ember. Under `asChild` the kit's Slot merges props, classes, styles, and refs onto your element and runs your event handler first, skipping the kit's when you call `preventDefault`.

The package has no `dependencies` field. Every Component is the kit's own code on top of the platform: the native dialog element, the Popover API, CSS anchor positioning, and real checkbox and radio inputs. The build fails if a runtime dependency comes back. Tooltip and the Select list need CSS anchor positioning, Baseline since January 2026, to sit beside their trigger. An older browser shows them centred in the viewport.

If you used a build from `main` before this release, several things changed:

- The dark Color scheme, its media query, and the `data-theme="light|dark"` switch are gone. `data-theme` now names a Theme, and `data-color-scheme` is reserved for a dark Color scheme.
- Token renames: `--kui-background-subtle` is now `--kui-surface-raised`, `--kui-radius-sm`, `-md`, and `-lg` are now `--kui-radius-field`, `--kui-radius-full` is now `--kui-radius-pill`, and `--kui-font-family` is now `--kui-font-body`. The old names are gone. Spacing is in pixels, and steps 5 to 8 grew to 24, 32, 48, and 72px.
- Button, TextField, and the Select trigger are 36, 44, and 52px tall at sm, md, and lg.
- The Radix and TanStack Table packages are no longer installed with the kit.
