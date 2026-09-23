"use client";

import {
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  functionalUpdate,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef as TableColumnDef,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortDirection,
} from "@tanstack/react-table";
import {
  forwardRef,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type TableHTMLAttributes,
} from "react";
import { ChevronDownIcon } from "../../icons.js";
import { Button } from "../Button/Button.js";
import { Checkbox } from "../Checkbox/Checkbox.js";

// TanStack picks a sort function by value type and only finds the ones registered here. Their
// names are also valid `sortFn` strings in a column definition.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});

const ARIA_SORT: Record<SortDirection, "ascending" | "descending"> = {
  asc: "ascending",
  desc: "descending",
};

/** The page size TanStack documents for one page that holds every row. */
const ALL_ROWS = Infinity;

/**
 * A column definition in the TanStack Table shape. `accessorKey` names the row field and `header`
 * the column, and `cell` renders the value with the typed row in `row.original`. A column with an
 * `id` and no accessor is a display column, which never sorts. `enableSorting: false` keeps an
 * accessor column out of sorting too.
 */
export type ColumnDef<TData extends RowData, TValue = unknown> = TableColumnDef<
  typeof features,
  TData,
  TValue
>;

/**
 * `className` lands on the root element. The ref and every other prop go to the table element.
 */
export interface DataTableProps<TData extends RowData> extends Omit<
  TableHTMLAttributes<HTMLTableElement>,
  "children"
> {
  /** Column definitions. Keep the reference stable between renders: module scope, state, or useMemo. */
  columns: readonly ColumnDef<TData>[];
  /** The rows. Keep the reference stable between renders, or every render reprocesses the data. */
  data: readonly TData[];
  /**
   * Returns a stable id for a row, used as its key and as its selection id. Defaults to the row's
   * index in `data`.
   */
  getRowId?: (row: TData, index: number) => string;
  /** Visible caption above the table. It is also the table's accessible name. */
  caption: ReactNode;
  /**
   * Turns every accessor column's header into a sort button. Activating it cycles ascending,
   * descending, and unsorted, and one column sorts at a time.
   */
  sortable?: boolean;
  /**
   * Rows per page. Adds previous and next Buttons and a status line that announces the page. A
   * new value starts over from the first page. Without it every row renders on one page.
   */
  pageSize?: number;
  /**
   * Replaces the rows with a loading status, announced to assistive technology. The header stays,
   * so the columns are known while the rows are on their way.
   */
  loading?: boolean;
  /** Shown in one cell spanning the table when there are no rows. Defaults to "Nothing to show". */
  emptyMessage?: ReactNode;
  /**
   * Adds a Checkbox to each row and a select-all Checkbox to the header. Select-all covers the
   * rows on the current page, and shows mixed while only some of them are selected. Each row's
   * box is named "Select" plus the row's first text or number value, so put the column that
   * identifies a row first.
   */
  selectable?: boolean;
  /** Controlled selected row ids. Pair it with onSelectionChange. */
  selectedIds?: readonly string[];
  /** Initial selected row ids when uncontrolled. */
  defaultSelectedIds?: readonly string[];
  /** Called with every selected row id, across all pages, when the user changes the selection. */
  onSelectionChange?: (selectedIds: string[]) => void;
}

/** "Select" plus the row's first text or number value, so the box is named after its row. */
function getSelectLabel<TData extends RowData>(row: Row<typeof features, TData>) {
  for (const cell of row.getAllCells()) {
    const value: unknown = cell.getValue();
    if ((typeof value === "string" && value.trim() !== "") || Number.isFinite(value)) {
      return `Select ${value}`;
    }
  }
  return `Select row ${row.index + 1}`;
}

function toRowSelection(ids: readonly string[]): RowSelectionState {
  return Object.fromEntries(ids.map((id) => [id, true as const]));
}

function DataTableInner<TData extends RowData>(
  {
    columns,
    data,
    getRowId,
    caption,
    sortable = false,
    pageSize,
    loading = false,
    emptyMessage = "Nothing to show",
    selectable = false,
    selectedIds: selectedIdsProp,
    defaultSelectedIds = [],
    onSelectionChange,
    className,
    ...props
  }: DataTableProps<TData>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const captionId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  useImperativeHandle<HTMLTableElement | null, HTMLTableElement | null>(
    ref,
    () => tableRef.current,
    [],
  );

  // While the table is wider than its container, the container is a named region and a Tab stop,
  // so a keyboard user can reach it and scroll it. Measured, because a Tab stop that scrolls
  // nothing is noise.
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const scroller = scrollerRef.current;
    const tableElement = tableRef.current;
    if (!scroller || !tableElement) return;
    const observer = new ResizeObserver(() => {
      setScrollable(scroller.scrollWidth > scroller.clientWidth);
    });
    observer.observe(scroller);
    observer.observe(tableElement);
    return () => observer.disconnect();
  }, []);

  const size = pageSize ?? ALL_ROWS;
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: size });
  if (pagination.pageSize !== size) {
    // A new page size starts over from the first page.
    setPagination({ pageIndex: 0, pageSize: size });
  }

  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(defaultSelectedIds);
  const isSelectionControlled = selectedIdsProp !== undefined;
  const selectedIds = isSelectionControlled ? selectedIdsProp : uncontrolledSelectedIds;
  const rowSelection = useMemo(() => toRowSelection(selectedIds), [selectedIds]);

  const table = useTable({
    features,
    columns,
    data,
    getRowId,
    enableSorting: sortable,
    // One sorted column at a time, so aria-sort can name it.
    enableMultiSort: false,
    // Every column starts ascending. TanStack would start numbers descending, and a cycle that
    // differs by column is one a user cannot learn.
    sortDescFirst: false,
    enableRowSelection: selectable,
    state: { pagination, rowSelection },
    onPaginationChange: setPagination,
    onRowSelectionChange: (updater) => {
      const next = Object.keys(functionalUpdate(updater, rowSelection));
      if (!isSelectionControlled) setUncontrolledSelectedIds(next);
      onSelectionChange?.(next);
    },
  });

  const headerGroups = table.getHeaderGroups();
  // While loading the body shows the status in place of the rows, so select-all has nothing to
  // act on.
  const pageRows = loading ? [] : table.getRowModel().rows;
  const hasRows = pageRows.length > 0;
  const allPageRowsSelected = hasRows && table.getIsAllPageRowsSelected();
  const somePageRowsSelected = hasRows && table.getIsSomePageRowsSelected();
  const columnCount = table.getAllLeafColumns().length + (selectable ? 1 : 0);
  // A live region announces a change to its text, not text it arrives with, so the loading text
  // lands one render after the region mounts. React 18 has no initial value and fills it at once.
  const announceLoading = useDeferredValue(loading, false);

  return (
    <div className={["kui-data-table", className].filter(Boolean).join(" ")}>
      <div
        ref={scrollerRef}
        className="kui-data-table__scroll"
        role={scrollable ? "region" : undefined}
        aria-labelledby={scrollable ? captionId : undefined}
        tabIndex={scrollable ? 0 : undefined}
      >
        <table ref={tableRef} className="kui-data-table__table" {...props}>
          <caption id={captionId} className="kui-data-table__caption">
            {caption}
          </caption>
          <thead>
            {headerGroups.map((headerGroup, groupIndex) => (
              <tr key={headerGroup.id}>
                {selectable && groupIndex === 0 && (
                  <th
                    className="kui-data-table__header kui-data-table__selection"
                    scope="col"
                    rowSpan={headerGroups.length > 1 ? headerGroups.length : undefined}
                  >
                    <Checkbox
                      label={
                        table.getPageCount() > 1
                          ? "Select all rows on this page"
                          : "Select all rows"
                      }
                      hideLabel
                      checked={allPageRowsSelected}
                      indeterminate={!allPageRowsSelected && somePageRowsSelected}
                      disabled={!hasRows}
                      onCheckedChange={(next) => table.toggleAllPageRowsSelected(next)}
                    />
                  </th>
                )}
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  // Sorting state outlives `sortable`, and the rows ignore it then, so the header
                  // ignores it too.
                  const sorted = column.getCanSort() && column.getIsSorted();
                  const content = header.isPlaceholder
                    ? null
                    : flexRender(column.columnDef.header, header.getContext());
                  return (
                    <th
                      key={header.id}
                      className="kui-data-table__header"
                      scope="col"
                      aria-sort={sorted ? ARIA_SORT[sorted] : undefined}
                    >
                      {column.getCanSort() ? (
                        <button
                          type="button"
                          className="kui-data-table__sort"
                          onClick={() => column.toggleSorting()}
                        >
                          {content}
                          <span
                            className="kui-data-table__sort-icon"
                            data-direction={
                              ARIA_SORT[sorted || column.getNextSortingOrder() || "asc"]
                            }
                            aria-hidden="true"
                          >
                            <ChevronDownIcon />
                          </span>
                        </button>
                      ) : (
                        content
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {!hasRows && (
              <tr>
                <td className="kui-data-table__cell kui-data-table__message" colSpan={columnCount}>
                  {loading ? (
                    <p className="kui-data-table__loading" role="status">
                      {announceLoading ? "Loading…" : null}
                    </p>
                  ) : (
                    emptyMessage
                  )}
                </td>
              </tr>
            )}
            {pageRows.map((row) => {
              // Selection state outlives `selectable` too, and the rows ignore it then.
              const selected = selectable && row.getIsSelected();
              return (
                <tr
                  key={row.id}
                  className="kui-data-table__row"
                  data-selected={selected ? "" : undefined}
                >
                  {selectable && (
                    <td className="kui-data-table__cell kui-data-table__selection">
                      <Checkbox
                        label={getSelectLabel(row)}
                        hideLabel
                        checked={selected}
                        onCheckedChange={(next) => row.toggleSelected(next)}
                      />
                    </td>
                  )}
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="kui-data-table__cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pageSize !== undefined && (
        <div className="kui-data-table__pagination">
          <p className="kui-data-table__page-status" role="status">
            Page {pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Rows from a data array, laid out by column definitions in the TanStack Table shape. Renders a
 * native table with a caption and scoped column headers, so a screen reader navigates it as a table.
 * With `sortable`, each accessor column's header is a button that cycles ascending, descending, and
 * unsorted, and the sorted column carries aria-sort. With `pageSize`, previous and next Buttons
 * page through the rows, and a status line announces the page. Sorting returns to the first page.
 * With `selectable`, each row has a Checkbox and the header a select-all for the current page,
 * keyed by `getRowId`. A table wider than its container scrolls sideways, and the scrolling region
 * is then a Tab stop named by the caption.
 */
export const DataTable = forwardRef(DataTableInner) as <TData extends RowData>(
  props: DataTableProps<TData> & RefAttributes<HTMLTableElement>,
) => ReactElement;
