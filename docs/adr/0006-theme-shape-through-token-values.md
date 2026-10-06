# A Theme changes shape through Token values, not selectors

Noren is the second Theme, and its identity is shape: Tabs cut like cloth with square tops, fields with only a bottom edge, a Rail along the top of a Tabs list and a Dialog. ADR 0005 said a Theme is Token values only and named this moment, a Theme that needs structure, as the point to revisit it. We keep the rule and widen what a Token may hold. A radius or border-width Token may carry a four-value shorthand, and a Token may be `0`, `none`, or `transparent` in one Theme so that a part the other Theme draws is switched off. Component CSS still has one stylesheet, no Theme selector, and no element that exists for one Theme only.

## Considered options

- Strict single values. Noren would be Ridgeline's shapes in teal and paper: 4px pills, fully bordered fields, no Rail. It loses the rule the board is named for.
- Theme selectors in component CSS. Rejected in ADR 0005 and still rejected: every Component change would be made once per Theme.
- Shorthand and zero-valued Tokens, with the Rail as a width and colour pair. Chosen.

## Consequences

- A Token that may hold a shorthand cannot be read through `calc()` or a longhand corner property. Checkbox and the DataTable rows read their own radius Tokens instead of deriving from the field radius.
- A part switched off by a zero-width Token still exists in the DOM and in the accessibility tree. The Rail is decorative, so this costs nothing today. A part that carries meaning cannot be switched off this way.
- The Token list grows with roles that Ridgeline fills with the same value as another Token or with nothing. That is the price of keeping one stylesheet, and the contrast Story runs once per Theme so a Theme cannot leave a role unfilled.
