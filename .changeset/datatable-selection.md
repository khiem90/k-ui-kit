---
"k-ui-kit": minor
---

Add row selection and the loading and empty states to DataTable. With `selectable`, each row has a Checkbox and the header a select-all that covers the current page and shows mixed while only some of its rows are selected. Each row's box is named after the row's first text or number value, and a selected row carries `data-selected`. Selection is keyed by `getRowId`, controlled through `selectedIds` and `onSelectionChange`, or started from `defaultSelectedIds`. With `loading`, the rows give way to a status announced to assistive technology while the header stays. With no rows, one cell spanning the table shows `emptyMessage`.
