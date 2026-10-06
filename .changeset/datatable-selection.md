---
"k-ui-kit": minor
---

Add row selection and the loading and empty states to DataTable. With `selectable`, each row has a Checkbox and the header a select-all that covers the current page and shows mixed while only some of its rows are selected. Each row's box is named after the row's first text or number value, and a selected row carries `data-selected`. A selected or hovered row turns Peach sky, where Ember falls under 3:1, so its Checkbox draws the checked box in `--kui-primary-on-tint`, and every control in the row, a Button in a cell included, draws its focus ring in `--kui-focus-ring-on-tint`. Both are root Tokens, so a `:root` override of them reaches the row. Selection is keyed by `getRowId`, controlled through `selectedIds` and `onSelectionChange`, or started from `defaultSelectedIds`. With `loading`, the rows give way to a status announced to assistive technology while the header stays. With no rows, one cell spanning the table shows `emptyMessage`.
