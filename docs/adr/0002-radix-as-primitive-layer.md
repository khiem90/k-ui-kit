# Radix Primitives as the Primitive layer, Base UI as the fallback

Dialog, Select, Tooltip, Tabs, RadioGroup, Checkbox, and Switch take their keyboard handling, focus management, and ARIA wiring from Radix Primitives instead of code we write. Radix is unstyled, carries the client directive in its own output, and follows the WAI-ARIA Authoring Practices, which is the part we least want to own. Button and TextField stay hand-rolled because the native element already does the job.

Radix's maintenance pace slowed through 2024 and 2025. If it stalls, Base UI, the headless library from the MUI team with the same parts-based model, is the replacement. Primitives are never re-exported from the public entry, so swapping the layer is internal to the kit and leaves a Consumer's imports untouched.

## Considered options

- Hand-roll everything. Full control, but every focus trap and typeahead is a fresh chance to get it wrong.
- Headless UI. No Tooltip, and its conventions lean on Tailwind.
- React Aria Components. Complete, but brings its own render-prop styling model and a larger runtime than the kit needs.
- Radix Primitives. Chosen, with Base UI as the fallback.
