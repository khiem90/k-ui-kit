# A Theme is token values only

Ridgeline is the first Theme, and more are planned. Every Theme shares the same component CSS, and a Theme changes the kit only through Token values. Shape, depth, and type are Tokens alongside colour: corner radii including the arch, the three shadow levels, the display, label, and body font families, and the case and tracking of labels. A Consumer's `:root` override keeps working the way ADR 0001 describes, because there is still one stylesheet and no Theme-specific selector inside component CSS.

Token names describe a role, such as `--kui-primary`, `--kui-surface-raised`, or `--kui-radius-arch`, and never a colour such as `--kui-ember`. A second Theme has to fill the same names, and a colour name stops making sense in a Theme that doesn't use that colour.

## Considered options

- One component stylesheet per Theme. A Theme could change structure as well as values, but every component change would have to be made once per Theme, and a Consumer override would have to target each Theme.
- A public layer of colour names under the role names. Easier for a Theme author, but it doubles the public Token surface and ADR 0001 already ruled it out.
- Token values only, with role names. Chosen.

## Consequences

- A Theme that needs a structurally different component, not just different values, can't be expressed. Revisit this ADR when a real Theme needs it, rather than adding Theme selectors to component CSS.
- While Ridgeline is the only Theme, its values sit on `:root` with no attribute. When a second Theme arrives, `data-theme="<name>"` selects it and `data-color-scheme` selects light or dark. The old `data-theme="light|dark"` switch is gone.
