---
"k-ui-kit": minor
---

Add DataTable: a Component that takes column definitions and a data array and renders a native table with a caption and scoped column headers. With `sortable`, each column header is a button that cycles ascending, descending, and unsorted, and the sorted column carries aria-sort. With `pageSize`, previous and next outline Buttons page through the rows and a status line announces the page. A table wider than its container scrolls sideways, and the scrolling region is then a Tab stop named by the caption. The table sits in a cream card, and rows alternate cream and light apricot with no grid lines.

The entry exports the `ColumnDef` type. A column takes `accessorKey`, `accessorFn`, `id`, `header`, `cell`, `enableSorting`, and `sortFn`. `sortFn` names one of four built-in sorts, `"alphanumeric"`, `"text"`, `"datetime"`, or `"basic"`, or `"auto"` to pick one from the first ten values. It can also be a comparator, `(rowA, rowB, columnId) => number`, that returns the ascending order. Each row it receives has `id`, `index`, `original`, and `getValue(columnId)`, and the table reverses the result for descending. A `cell` function receives `row` with its `id`, `index`, and `original`, `column.id`, and `getValue()`.

If you used a build from `main` before this release, `ColumnDef` was TanStack Table's type. A custom `sortFn` comparator still works if it reads `original` or `getValue(columnId)` from its rows, but the other TanStack row methods are gone. Column groups, dotted `accessorKey` paths, `sortUndefined`, `sortDescFirst`, `meta`, `footer`, and TanStack's other fields are gone too, so a column array using them no longer type-checks.
