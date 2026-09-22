# 03: TextField

**What to build:** A Consumer renders a TextField with a label, optional description, and error message and gets correct accessible associations without writing any aria attributes. It behaves as a plain input for forms and form libraries.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] Simple component with flat props: label, description, error, size, plus every native input prop passed through to the input element
- [x] Label is associated with the input; description and error are linked via aria-describedby; error sets aria-invalid; required is reflected
- [x] Sizes sm, md, lg match Button heights
- [x] Disabled and read-only states styled and announced correctly
- [x] Forwards ref to the input, accepts className on the root, spreads rest props onto the input
- [x] Stories for Default, each size, with description, with error, disabled, and a controlled example; a play function types into the field and asserts the value and the error announcement
- [x] axe passes on every Story; lint, typecheck, build pass

## Comments

2026-09-21: Implemented in cc775bd (TextField, stylesheet, Stories, changeset) and 1d1fb42 (code review fixes). Verified locally: lint, typecheck, 24 Story tests in Chromium with axe (11 of them TextField), and build all pass. Four decisions worth knowing. `className` goes on the root and every other prop, including the ref, goes to the input, as this ticket asks; the spec's general convention says root, and the prop types document the split. The native `size` attribute is not passed through because the prop carries sm, md, lg. Required fields carry only the native attribute and no visual marker, so a Consumer who wants an asterisk puts it in the label. The error renders with role alert so it is announced when it appears, and it comes before the description in aria-describedby. Usage notes on Stories (spec story 57) are still missing kit-wide, on Button too.
