"use client";

import {
  createElement,
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

/**
 * The sort types a column can use. Each comparator returns the ascending order, and the table
 * flips it for descending.
 * - `alphanumeric` ignores case and compares runs of digits as numbers, so "v1.2" comes before
 *   "v1.10".
 * - `text` ignores case and compares the strings as they are.
 * - `datetime` compares Dates by their time.
 * - `basic` compares the values with `<` and `>`, which suits numbers.
 */
type SortType = "alphanumeric" | "basic" | "datetime" | "text";

type Compare = (a: unknown, b: unknown) => number;

/** Numbers and strings become text, and anything else, NaN and the infinities included, is empty. */
function toText(value: unknown): string {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  return typeof value === "string" ? value : "";
}

function compareBasic(a: unknown, b: unknown): number {
  if (a === b) return 0;
  // The comparison operators accept any two values, which is the point of the basic sort.
  return (a as number) > (b as number) ? 1 : -1;
}

const chunks = /\d+|\D+/g;
const digits = /^\d/;

function compareAlphanumeric(a: string, b: string): number {
  const aChunks = a.match(chunks) ?? [];
  const bChunks = b.match(chunks) ?? [];
  const shared = Math.min(aChunks.length, bChunks.length);
  for (let index = 0; index < shared; index++) {
    const aChunk = aChunks[index] as string;
    const bChunk = bChunks[index] as string;
    const aIsNumber = digits.test(aChunk);
    // A run of digits sorts after a run of anything else.
    if (aIsNumber !== digits.test(bChunk)) return aIsNumber ? 1 : -1;
    const result = aIsNumber
      ? compareBasic(Number(aChunk), Number(bChunk))
      : compareBasic(aChunk, bChunk);
    if (result !== 0) return result;
  }
  // When one is a prefix of the other, the one with fewer runs comes first.
  return aChunks.length - bChunks.length;
}

const toTime = (value: unknown) => (value instanceof Date ? value.getTime() : value);

const compareBySortType: Record<SortType, Compare> = {
  alphanumeric: (a, b) => compareAlphanumeric(toText(a).toLowerCase(), toText(b).toLowerCase()),
  basic: compareBasic,
  datetime: (a, b) => {
    const aTime = toTime(a) as number;
    const bTime = toTime(b) as number;
    return aTime > bTime ? 1 : aTime < bTime ? -1 : 0;
  },
  text: (a, b) => compareBasic(toText(a).toLowerCase(), toText(b).toLowerCase()),
};

/** How many leading values the automatic sort type looks at. */
const SAMPLE_SIZE = 10;

/**
 * Picks a sort type from a column's first values in data order. A Date makes it datetime, a string
 * with a digit in it alphanumeric, any other string text, and anything else basic.
 */
function detectSortType(values: readonly unknown[]): SortType {
  let sawString = false;
  for (const value of values.slice(0, SAMPLE_SIZE)) {
    if (Object.prototype.toString.call(value) === "[object Date]") return "datetime";
    if (typeof value === "string") {
      sawString = true;
      if (/\d/.test(value)) return "alphanumeric";
    }
  }
  return sawString ? "text" : "basic";
}

/** What a function `header` receives. */
interface HeaderContext {
  column: { id: string };
}

/** What a function `cell` receives. `row.original` is the typed row. */
interface CellContext<TData, TValue> {
  row: { id: string; index: number; original: TData };
  column: { id: string };
  getValue: () => TValue;
}

interface ColumnDefBase<TData, TValue> {
  /** The column's header. A function is rendered as a component. Defaults to the accessor key or id. */
  header?: ReactNode | ((context: HeaderContext) => ReactNode);
  /** Renders a cell. A function is rendered as a component. Defaults to the value as text. */
  cell?: ReactNode | ((context: CellContext<TData, TValue>) => ReactNode);
  /** `false` keeps an accessor column out of sorting. */
  enableSorting?: boolean;
  /** How the column sorts. "auto", the default, picks a sort type from the first ten values. */
  sortFn?: "auto" | SortType;
}

interface AccessorKeyColumnDef<TData, TValue> extends ColumnDefBase<TData, TValue> {
  /** The row field this column shows and sorts by. */
  accessorKey: keyof TData & string;
  /** Defaults to `accessorKey`. */
  id?: string;
  accessorFn?: never;
}

interface AccessorFnColumnDef<TData, TValue> extends ColumnDefBase<TData, TValue> {
  /** Computes the value this column shows and sorts by. */
  accessorFn: (row: TData, index: number) => TValue;
  id: string;
  accessorKey?: never;
}

interface DisplayColumnDef<TData, TValue> extends ColumnDefBase<TData, TValue> {
  id: string;
  accessorKey?: never;
  accessorFn?: never;
}

/**
 * A column definition. `accessorKey` names the row field, or `accessorFn` computes the value, and
 * `header` names the column. `cell` renders the value with the typed row in `row.original`. A
 * column with an `id` and no accessor is a display column, which never sorts. `enableSorting:
 * false` keeps an accessor column out of sorting too.
 */
export type ColumnDef<TData, TValue = unknown> =
  | AccessorKeyColumnDef<TData, TValue>
  | AccessorFnColumnDef<TData, TValue>
  | DisplayColumnDef<TData, TValue>;

/**
 * `className` lands on the root element. The ref and every other prop go to the table element.
 */
export interface DataTableProps<TData> extends Omit<
  TableHTMLAttributes<HTMLTableElement>,
  "children"
> {
  /** Column definitions. Keep the reference stable between renders: module scope, state, or useMemo. */
  columns: readonly ColumnDef<TData>[];
  /**
   * The rows. Keep the reference stable between renders, or every render reprocesses the data and
   * returns to the first page.
   */
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

/** A column definition resolved to an id and a way to read its value. */
interface Column<TData> {
  id: string;
  def: ColumnDef<TData>;
  /** Undefined for a display column. */
  getValue?: (row: TData, index: number) => unknown;
}

interface Row<TData> {
  id: string;
  index: number;
  original: TData;
}

interface Sorting {
  columnId: string;
  desc: boolean;
}

type SortDirection = "ascending" | "descending";

function resolveColumn<TData>(def: ColumnDef<TData>): Column<TData> {
  const { accessorKey, accessorFn } = def;
  const getValue = accessorFn
    ? accessorFn
    : accessorKey !== undefined
      ? (row: TData) => row[accessorKey]
      : undefined;
  const id = def.id ?? accessorKey ?? (typeof def.header === "string" ? def.header : "");
  return { id, def, getValue };
}

/** Renders a header or cell template. A function is a component, so it may use hooks. */
function renderTemplate<TContext extends object>(
  template: ReactNode | ((context: TContext) => ReactNode),
  context: TContext,
): ReactNode {
  return typeof template === "function" ? createElement(template, context) : template;
}

function renderHeader<TData>(column: Column<TData>): ReactNode {
  const { header } = column.def;
  if (header === undefined) {
    return column.def.accessorKey ?? (column.def.accessorFn ? column.id : null);
  }
  return renderTemplate(header, { column: { id: column.id } });
}

function DefaultCell({ getValue }: CellContext<unknown, unknown>): ReactNode {
  const value = getValue() as { toString?: () => string } | null | undefined;
  return value?.toString?.() ?? null;
}

function renderCell<TData>(column: Column<TData>, row: Row<TData>): ReactNode {
  const context: CellContext<TData, unknown> = {
    row,
    column: { id: column.id },
    getValue: () => column.getValue?.(row.original, row.index),
  };
  return renderTemplate(column.def.cell ?? DefaultCell, context);
}

/** "Select" plus the row's first text or number value, so the box is named after its row. */
function getSelectLabel<TData>(columns: readonly Column<TData>[], row: Row<TData>) {
  for (const column of columns) {
    const value = column.getValue?.(row.original, row.index);
    if ((typeof value === "string" && value.trim() !== "") || Number.isFinite(value)) {
      return `Select ${value as string | number}`;
    }
  }
  return `Select row ${row.index + 1}`;
}

/**
 * Sets the given rows' selection and returns every selected id. The ids come back in the order of
 * an object's keys, which is the order onSelectionChange has always reported: integer-like ids
 * first in numeric order, then the rest in the order they were selected.
 */
function updateSelection(
  selectedIds: readonly string[],
  rowIds: readonly string[],
  selected: boolean,
): string[] {
  const selection: Record<string, true> = Object.create(null) as Record<string, true>;
  for (const id of selectedIds) selection[id] = true;
  for (const id of rowIds) {
    if (selected) selection[id] = true;
    else delete selection[id];
  }
  return Object.keys(selection);
}

function DataTableInner<TData>(
  {
    columns: columnDefs,
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

  const columns = useMemo(() => columnDefs.map(resolveColumn), [columnDefs]);
  const rows = useMemo(
    () =>
      data.map((original, index): Row<TData> => ({
        id: getRowId?.(original, index) ?? String(index),
        index,
        original,
      })),
    [data, getRowId],
  );

  const canSort = (column: Column<TData>) =>
    sortable && column.getValue !== undefined && column.def.enableSorting !== false;

  // Sorting outlives `sortable` and the column it names, and the rows ignore it while it does
  // not apply.
  const [sorting, setSorting] = useState<Sorting | null>(null);
  const sortedColumn = columns.find((column) => column.id === sorting?.columnId && canSort(column));
  const sortDirection = (column: Column<TData>): SortDirection | undefined =>
    sortedColumn === column ? (sorting?.desc ? "descending" : "ascending") : undefined;

  const sortedRows = useMemo(() => {
    const getValue = sortedColumn?.getValue;
    if (!sortedColumn || !getValue || !sorting) return rows;
    const values = rows.map((row) => getValue(row.original, row.index));
    const sortFn = sortedColumn.def.sortFn ?? "auto";
    const compare = compareBySortType[sortFn === "auto" ? detectSortType(values) : sortFn];
    const direction = sorting.desc ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const aValue = values[a.index];
      const bValue = values[b.index];
      let result = 0;
      // A missing value sorts last when ascending, and first when descending.
      if (aValue === undefined || bValue === undefined) {
        if (aValue !== bValue) result = aValue === undefined ? 1 : -1;
      } else {
        result = compare(aValue, bValue);
      }
      // Rows that compare equal keep their order in `data`, whichever the direction.
      return result * direction || a.index - b.index;
    });
  }, [rows, sortedColumn, sorting]);

  const size = pageSize ?? Infinity;
  const [pageIndex, setPageIndex] = useState(0);
  const [pagedSize, setPagedSize] = useState(size);
  const [pagedData, setPagedData] = useState(data);
  if (pagedSize !== size || pagedData !== data) {
    // A new page size or new data starts over from the first page.
    setPagedSize(size);
    setPagedData(data);
    setPageIndex(0);
  }
  const pageCount =
    size === Infinity ? (sortedRows.length > 0 ? 1 : 0) : Math.ceil(sortedRows.length / size);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const toggleSorting = (column: Column<TData>) => {
    const direction = sortDirection(column);
    // Ascending, then descending, then unsorted. Every column starts ascending, so the cycle is
    // the same for text and numbers.
    setSorting(
      direction === undefined
        ? { columnId: column.id, desc: false }
        : direction === "ascending"
          ? { columnId: column.id, desc: true }
          : null,
    );
    // A new sort moves every row, so it starts over from the first page.
    setPageIndex(0);
  };

  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(defaultSelectedIds);
  const isSelectionControlled = selectedIdsProp !== undefined;
  const selectedIds = isSelectionControlled ? selectedIdsProp : uncontrolledSelectedIds;
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const setSelected = (rowIds: readonly string[], selected: boolean) => {
    const next = updateSelection(selectedIds, rowIds, selected);
    if (!isSelectionControlled) setUncontrolledSelectedIds(next);
    onSelectionChange?.(next);
  };

  // While loading the body shows the status in place of the rows, so select-all has nothing to
  // act on.
  const pageRows = loading
    ? []
    : size === Infinity && pageIndex === 0
      ? sortedRows
      : sortedRows.slice(pageIndex * size, (pageIndex + 1) * size);
  const hasRows = pageRows.length > 0;
  const pageSelectedCount = pageRows.filter((row) => selectedIdSet.has(row.id)).length;
  const allPageRowsSelected = hasRows && pageSelectedCount === pageRows.length;
  const somePageRowsSelected = pageSelectedCount > 0;
  const columnCount = columns.length + (selectable ? 1 : 0);
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
            <tr>
              {selectable && (
                <th className="kui-data-table__header kui-data-table__selection" scope="col">
                  <Checkbox
                    label={pageCount > 1 ? "Select all rows on this page" : "Select all rows"}
                    hideLabel
                    checked={allPageRowsSelected}
                    indeterminate={!allPageRowsSelected && somePageRowsSelected}
                    disabled={!hasRows}
                    onCheckedChange={(next) =>
                      setSelected(
                        pageRows.map((row) => row.id),
                        next,
                      )
                    }
                  />
                </th>
              )}
              {columns.map((column) => {
                const direction = sortDirection(column);
                const content = renderHeader(column);
                return (
                  <th
                    key={column.id}
                    className="kui-data-table__header"
                    scope="col"
                    aria-sort={direction}
                  >
                    {canSort(column) ? (
                      <button
                        type="button"
                        className="kui-data-table__sort"
                        onClick={() => toggleSorting(column)}
                      >
                        {content}
                        <span
                          className="kui-data-table__sort-icon"
                          data-direction={direction ?? "ascending"}
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
              // Selection outlives `selectable` too, and the rows ignore it then.
              const selected = selectable && selectedIdSet.has(row.id);
              return (
                <tr
                  key={row.id}
                  className="kui-data-table__row"
                  data-selected={selected ? "" : undefined}
                >
                  {selectable && (
                    <td className="kui-data-table__cell kui-data-table__selection">
                      <Checkbox
                        label={getSelectLabel(columns, row)}
                        hideLabel
                        checked={selected}
                        onCheckedChange={(next) => setSelected([row.id], next)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} className="kui-data-table__cell">
                      {renderCell(column, row)}
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
            Page {pageIndex + 1} of {Math.max(pageCount, 1)}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={!canPreviousPage}
            onClick={() => setPageIndex((index) => index - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canNextPage}
            onClick={() => setPageIndex((index) => index + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Rows from a data array, laid out by column definitions. Renders a native table with a caption
 * and scoped column headers, so a screen reader navigates it as a table. With `sortable`, each
 * accessor column's header is a button that cycles ascending, descending, and unsorted, and the
 * sorted column carries aria-sort. With `pageSize`, previous and next Buttons page through the
 * rows, and a status line announces the page. Sorting returns to the first page. With
 * `selectable`, each row has a Checkbox and the header a select-all for the current page, keyed by
 * `getRowId`. A table wider than its container scrolls sideways, and the scrolling region is then
 * a Tab stop named by the caption.
 */
export const DataTable = forwardRef(DataTableInner) as <TData>(
  props: DataTableProps<TData> & RefAttributes<HTMLTableElement>,
) => ReactElement;
