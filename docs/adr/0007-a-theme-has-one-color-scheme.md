# A Theme has one Color scheme

Rooftop is the third Theme and the first dark one. ADR 0005 reserved `data-color-scheme` to select light or dark, and the glossary, ADR 0001, and the Getting started page said every Theme is light-only. We decide that a Theme carries exactly one Color scheme, declared as `color-scheme` inside its own block, and that `data-theme` is the only switch. Rooftop is dark under `data-theme="rooftop"` alone. `data-color-scheme` stays reserved for the day one Theme ships a light and a dark set of values, and is not used before then.

## Considered options

- Introduce `data-color-scheme="dark"` now and make Rooftop render only under both attributes. Rooftop would be the one Theme that needs two attributes, for a switch no other Theme uses, and a Consumer who set only `data-theme` would get a light Rooftop that doesn't exist.
- Keep the kit light-only and turn the board away. The kit would have no answer for a dark app.
- One Color scheme per Theme, declared in its block. Chosen.

## Consequences

- A Consumer who wants Ridgeline or Noren dark waits for a dark block of that Theme, not a Rooftop override. When one arrives, `data-color-scheme` selects between that Theme's two sets, and this ADR gets revisited for how the two blocks sit in the stylesheet.
- The Tokens contrast Story, the build check, and the smoke test treat a dark Theme like any other: every pair is measured, no pair is assumed.
- `color-scheme: dark` on a Rooftop subtree inside a light page turns that subtree's native scrollbars and form controls dark. That is the platform doing its job, and the kit does not fight it.
- ADR 0001's "light Color scheme only" consequence is reworded to say each Theme declares its own.
