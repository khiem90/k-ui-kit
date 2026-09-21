# 09: Dialog

**What to build:** A Consumer assembles a modal Dialog from parts. Opening traps focus inside, Escape and overlay click close it, focus returns to the trigger, and screen readers announce the title and description.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Composite component built on the Radix Dialog Primitive, exposed as a namespace with root, trigger, content, title, description, and close parts; the overlay and portal are handled inside the content part
- [ ] Controlled and uncontrolled via open, defaultOpen, onOpenChange
- [ ] Focus moves into the dialog on open, is trapped while open, and returns to the trigger on close; body scroll is locked while open
- [ ] Escape and overlay click close; the close part renders an accessible close button with the inline close icon
- [ ] Title and description are wired to the dialog's labelling attributes; a Story shows how to hide the title visually while keeping it for assistive technology
- [ ] Open and close transitions are removed under reduced motion
- [ ] Stories for Default, with a form inside, with a long scrolling body, and a controlled example; a play function opens with the keyboard, asserts focus is inside, presses Escape, asserts focus returned to the trigger
- [ ] axe passes on every Story; lint, typecheck, build pass
