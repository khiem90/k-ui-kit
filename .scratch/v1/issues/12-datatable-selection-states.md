# 12: DataTable selection and states

**What to build:** A Consumer enables row selection and gets a Checkbox per row plus a select-all in the header, keyed by row id and usable controlled or uncontrolled. Loading and empty states replace a blank table with something a user understands.

**Blocked by:** 04 (Checkbox), 11 (DataTable with sorting and pagination)

**Status:** ready-for-agent

- [ ] Props added: selectable, selectedIds, onSelectionChange, loading, emptyMessage
- [ ] When selectable, a selection column renders a Checkbox in each row and a select-all Checkbox in the header that shows indeterminate when some rows are selected; each row checkbox has an accessible name derived from the row
- [ ] Selection is keyed by getRowId and follows the value, defaultValue, onValueChange convention; select-all applies to the current page when paginated
- [ ] Selected rows expose their state via a data attribute for styling
- [ ] Loading renders a status region announced to assistive technology and keeps the header visible; empty renders the custom message in a single spanning cell
- [ ] Stories for selectable, selectable and paginated, controlled selection, loading, and empty; a play function selects rows with Space, asserts the callback payload and the select-all indeterminate state, then uses select-all and asserts every row on the page is selected
- [ ] axe passes on every Story; lint, typecheck, build pass
