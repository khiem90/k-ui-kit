# 03: TextField

**What to build:** A Consumer renders a TextField with a label, optional description, and error message and gets correct accessible associations without writing any aria attributes. It behaves as a plain input for forms and form libraries.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Simple component with flat props: label, description, error, size, plus every native input prop passed through to the input element
- [ ] Label is associated with the input; description and error are linked via aria-describedby; error sets aria-invalid; required is reflected
- [ ] Sizes sm, md, lg match Button heights
- [ ] Disabled and read-only states styled and announced correctly
- [ ] Forwards ref to the input, accepts className on the root, spreads rest props onto the input
- [ ] Stories for Default, each size, with description, with error, disabled, and a controlled example; a play function types into the field and asserts the value and the error announcement
- [ ] axe passes on every Story; lint, typecheck, build pass
