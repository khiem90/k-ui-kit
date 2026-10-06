# 14: DataTable behaviour without TanStack Table

**What to build:** A Consumer's DataTable sorts, paginates, and selects rows exactly as it does today, with the engine written in the kit and the column definition type owned by the kit. It keeps today's look; Ridgeline styling is ticket 15.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Sorting, pagination, and row selection are plain state in the kit
- [ ] Sorting is one column at a time and cycles ascending, descending, then unsorted, as today
- [ ] The kit's own comparators cover the four sort types the Component uses today, with the same ordering results
- [ ] The exported column definition type is the kit's own and keeps every field the Stories and the Getting started page use
- [ ] Selection stays controlled and uncontrolled by row id, and page changes keep the selection
- [ ] aria-sort, the overflow-aware scroll region, the live status lines, and the loading and empty states are unchanged
- [ ] `@tanstack/react-table` is removed from the manifest and the lockfile
- [ ] Existing DataTable Stories pass with their behavioural assertions unchanged
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
