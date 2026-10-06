# 14: DataTable behaviour without TanStack Table

**What to build:** A Consumer's DataTable sorts, paginates, and selects rows exactly as it does today, with the engine written in the kit and the column definition type owned by the kit. It keeps today's look; Ridgeline styling is ticket 15.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Sorting, pagination, and row selection are plain state in the kit
- [x] Sorting is one column at a time and cycles ascending, descending, then unsorted, as today
- [x] The kit's own comparators cover the four sort types the Component uses today, with the same ordering results
- [x] The exported column definition type is the kit's own and keeps every field the Stories and the Getting started page use
- [x] Selection stays controlled and uncontrolled by row id, and page changes keep the selection
- [x] aria-sort, the overflow-aware scroll region, the live status lines, and the loading and empty states are unchanged
- [x] `@tanstack/react-table` is removed from the manifest and the lockfile
- [x] Existing DataTable Stories pass with their behavioural assertions unchanged
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in 771e69d on branch ridgeline-14-datatable-behaviour. DataTable keeps sorting, the page index, and the uncontrolled selection in React state, and `@tanstack/react-table` is gone from package.json and pnpm-lock.yaml. The comparators copy TanStack's rules for the four types it picked automatically. Alphanumeric ignores case and compares runs of digits as numbers. Text ignores case. Datetime compares Dates by time. Basic uses `<` and `>`. Auto detection still reads the first ten values in data order, a missing value still sorts last when ascending and first when descending, and equal rows keep their data order in both directions. A new SortTypes Story pins one column per type plus an `accessorFn` column and an `enableSorting: false` column. I wrote it and ran it against TanStack before the swap, so its expected orders come from the old engine and not from my code. The other eleven DataTable Stories pass with no edits. Verified with `pnpm check`: lint, typecheck, 108 Story tests in Chromium with axe as an error, and the build and its verifier.

Decisions a later ticket needs. ColumnDef keeps `accessorKey`, `accessorFn`, `id`, `header`, `cell`, `enableSorting`, and `sortFn`, which now takes a sort type name or "auto" and no longer a function. Column groups (`columns` inside a column), dotted `accessorKey` paths, `sortUndefined`, `sortDescFirst`, `meta`, `footer`, and the rest of TanStack's fields are gone, so ticket 17's changeset should call this a type change for anyone who used them. The cell context offers `row` (id, index, original), `column.id`, and `getValue()`. `header` and `cell` functions still render as components, as flexRender did, so hooks inside them keep working. The page goes back to the first page on a new `data` reference, a new `pageSize`, and every sort click, as before. onSelectionChange reports ids in object key order, so integer-like ids still come first in numeric order. The header is always one row now, so the selection header lost its rowSpan. Class names and markup are unchanged for ticket 15. The comparators live in DataTable.tsx rather than a sibling `.ts` file, because tsup's entry glob only builds `*.tsx` files under `src/components/*/`, and a `.ts` helper there builds fine in Storybook but is missing from dist. The build verifier catches it.
