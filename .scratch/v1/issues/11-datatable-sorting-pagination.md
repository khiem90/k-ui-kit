# 11: DataTable with sorting and pagination

**What to build:** A Consumer passes typed column definitions and a data array and gets a real HTML table with a caption, sortable headers, and pagination. Screen reader users navigate it as a table and hear the current sort.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] Component is generic over the row type; column definitions use the TanStack Table shape and the column definition type is re-exported from the package entry
- [ ] Props in this ticket: columns, data, getRowId, caption, sortable, pageSize
- [ ] Renders a native table element with a caption, header cells with scope, and body rows; no grid role
- [ ] When sortable, header cells contain a button that cycles ascending, descending, and none; the sorted column exposes aria-sort; a visual indicator uses the inline chevron icon
- [ ] When pageSize is set, previous and next controls built from Button and a page status line are rendered; controls are disabled at the bounds; the status is announced politely on change
- [ ] Forwards ref to the table, accepts className on the root, spreads rest props onto the table
- [ ] Stories for Default, sortable, paginated, sortable and paginated, and a wide table that scrolls horizontally; a play function activates a header with the keyboard and asserts row order and aria-sort, then pages forward and asserts the visible rows
- [ ] axe passes on every Story; lint, typecheck, build pass
