"use client";

import {
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  functionalUpdate,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef as TableColumnDef,
  type RowData,
  type SortDirection,
} from "@tanstack/react-table";
import {
  forwardRef,
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
import { ChevronDownIcon } from "../../icons";
import { Button } from "../Button/Button";

// The registered sort functions are the ones TanStack picks by value type: text and alphanumeric
// for strings, datetime for dates, basic for everything else. Their names are also valid `sortFn`
// strings in a column definition.
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
});

const ARIA_SORT: Record<SortDirection, "ascending" | "descending"> = {
  asc: "ascending",
  desc: "descending",
};

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
  /** Returns a stable id for a row, used as its key. Defaults to the row's index in `data`. */
  getRowId?: (row: TData, index: number) => string;
  /** Visible caption above the table. It is also the table's accessible name. */
  caption: ReactNode;
  /**
   * Turns every accessor column's header into a sort button. Activating it cycles ascending,
   * descending, and unsorted, and one column sorts at a time.
   */
  sortable?: boolean;
  /**
   * Rows per page. Adds previous and next controls and a status line that announces the page.
   * Without it every row renders on one page and there are no controls.
   */
  pageSize?: number;
}

function DataTableInner<TData extends RowData>(
  {
    columns,
    data,
    getRowId,
    caption,
    sortable = false,
    pageSize,
    className,
    ...props
  }: DataTableProps<TData>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const captionId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  useImperativeHandle(ref, () => tableRef.current as HTMLTableElement, []);

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

  const [pageIndex, setPageIndex] = useState(0);
  const [lastPageSize, setLastPageSize] = useState(pageSize);
  if (pageSize !== lastPageSize) {
    // A new page size starts over from the first page.
    setLastPageSize(pageSize);
    setPageIndex(0);
  }
  // Infinity is the page size TanStack documents for one page that holds every row.
  const size = pageSize ?? Infinity;
  const pagination = useMemo(() => ({ pageIndex, pageSize: size }), [pageIndex, size]);

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
    state: { pagination },
    onPaginationChange: (updater) =>
      setPageIndex(
        (previous) => functionalUpdate(updater, { pageIndex: previous, pageSize: size }).pageIndex,
      ),
  });

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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  const sorted = column.getIsSorted();
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
                          {/* Points the way the column is sorted, or the way the next activation sorts it. */}
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="kui-data-table__row">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="kui-data-table__cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageSize !== undefined && (
        <div className="kui-data-table__pagination">
          <p className="kui-data-table__page-status" role="status">
            Page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
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
 * unsorted, and the sorted column carries aria-sort. With `pageSize`, previous and next controls
 * page through the rows, and a status line announces the page. Sorting returns to the first page.
 * A table wider than its container scrolls sideways, and the scrolling region is then a Tab stop
 * named by the caption.
 */
export const DataTable = forwardRef(DataTableInner) as <TData extends RowData>(
  props: DataTableProps<TData> & RefAttributes<HTMLTableElement>,
) => ReactElement;
