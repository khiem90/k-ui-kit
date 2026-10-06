import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { useRef, useState } from "react";
import { contrast, luminance, toRGB, tokenColour } from "../../docs/contrast";
import { Button, DataTable, type ColumnDef, type DataTableProps } from "../../index";

interface Member {
  id: string;
  name: string;
  role: string;
  city: string;
  email: string;
  projects: number;
}

/** In the order they joined, which is neither alphabetical nor by project count. */
const members: Member[] = [
  {
    id: "m-01",
    name: "Lena Fischer",
    role: "Engineer",
    city: "Leipzig",
    email: "lena@example.com",
    projects: 12,
  },
  {
    id: "m-02",
    name: "Ada Okafor",
    role: "Engineer",
    city: "Lagos",
    email: "ada@example.com",
    projects: 4,
  },
  {
    id: "m-03",
    name: "Mateo Garcia",
    role: "Researcher",
    city: "Seville",
    email: "mateo@example.com",
    projects: 13,
  },
  {
    id: "m-04",
    name: "Bao Nguyen",
    role: "Designer",
    city: "Hanoi",
    email: "bao@example.com",
    projects: 7,
  },
  {
    id: "m-05",
    name: "Hana Sato",
    role: "Engineer",
    city: "Osaka",
    email: "hana@example.com",
    projects: 8,
  },
  {
    id: "m-06",
    name: "Chiara Ricci",
    role: "Engineer",
    city: "Milan",
    email: "chiara@example.com",
    projects: 2,
  },
  {
    id: "m-07",
    name: "Kwame Asante",
    role: "Designer",
    city: "Accra",
    email: "kwame@example.com",
    projects: 10,
  },
  {
    id: "m-08",
    name: "Dmitri Volkov",
    role: "Manager",
    city: "Tallinn",
    email: "dmitri@example.com",
    projects: 9,
  },
  {
    id: "m-09",
    name: "Ivan Petrov",
    role: "Researcher",
    city: "Sofia",
    email: "ivan@example.com",
    projects: 6,
  },
  {
    id: "m-10",
    name: "Elif Kaya",
    role: "Designer",
    city: "Ankara",
    email: "elif@example.com",
    projects: 5,
  },
  {
    id: "m-11",
    name: "Jae Park",
    role: "Manager",
    city: "Busan",
    email: "jae@example.com",
    projects: 1,
  },
  {
    id: "m-12",
    name: "Farid Haddad",
    role: "Engineer",
    city: "Beirut",
    email: "farid@example.com",
    projects: 11,
  },
  {
    id: "m-13",
    name: "Grace Mbeki",
    role: "Researcher",
    city: "Cape Town",
    email: "grace@example.com",
    projects: 3,
  },
];

/** Four accessor columns and one display column, whose cell renderer reads the typed row. */
const columns: ColumnDef<Member>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "projects", header: "Projects" },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => <a href={`mailto:${row.original.email}`}>{row.original.email}</a>,
  },
];

const byId = (row: { id: string }) => row.id;

type Canvas = ReturnType<typeof within>;

/** The body rows, without the header row. */
const getBodyRows = (canvas: Canvas) => canvas.getAllByRole("row").slice(1);

/** The text down one column of the body, in display order. */
const getColumnText = (canvas: Canvas, header: string) => {
  const index = canvas
    .getAllByRole("columnheader")
    .findIndex((cell: HTMLElement) => cell.textContent === header);
  return getBodyRows(canvas).map(
    (row: HTMLElement) => within(row).getAllByRole("cell")[index]?.textContent,
  );
};

const backgroundOf = (element: Element) => toRGB(getComputedStyle(element).backgroundColor);

/**
 * Asserts the element sets type in the label style. The expected values come from a probe styled
 * with the label Tokens inside the element, so it resolves em-based tracking at the same font size.
 */
async function expectLabelStyle(element: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.fontFamily = "var(--kui-font-label)";
  probe.style.textTransform = "var(--kui-label-case)";
  probe.style.letterSpacing = "var(--kui-label-tracking)";
  element.append(probe);
  const expected = getComputedStyle(probe);
  const want = {
    fontFamily: expected.fontFamily,
    textTransform: expected.textTransform,
    letterSpacing: expected.letterSpacing,
  };
  probe.remove();
  const actual = getComputedStyle(element);
  await expect({
    fontFamily: actual.fontFamily,
    textTransform: actual.textTransform,
    letterSpacing: actual.letterSpacing,
  }).toEqual(want);
}

// An annotation rather than satisfies, so the Stories' args are typed for Member instead of the
// row type's constraint, which is all StoryObj can infer from a generic Component.
const meta: Meta<DataTableProps<Member>> = {
  title: "Components/DataTable",
  component: DataTable,
  args: {
    caption: "Team members",
    columns,
    data: members,
    getRowId: byId,
    onSelectionChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const table = canvas.getByRole("table", { name: "Team members" });
    const headers = within(table).getAllByRole("columnheader");
    await expect(headers.map((header) => header.textContent)).toEqual([
      "Name",
      "Role",
      "City",
      "Projects",
      "Email",
    ]);
    for (const header of headers) {
      await expect(header).toHaveAttribute("scope", "col");
      await expect(header).not.toHaveAttribute("aria-sort");
    }
    await expect(getBodyRows(canvas)).toHaveLength(13);
    await expect(getColumnText(canvas, "Name").slice(0, 3)).toEqual([
      "Lena Fischer",
      "Ada Okafor",
      "Mateo Garcia",
    ]);
    await expect(canvas.getByRole("link", { name: "lena@example.com" })).toHaveAttribute(
      "href",
      "mailto:lena@example.com",
    );
    // Nothing to sort, page, select, or scroll, so no button, status line, checkbox, or focusable
    // region.
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    await expect(canvas.queryByRole("checkbox")).not.toBeInTheDocument();
    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
    await expect(canvas.queryByRole("region")).not.toBeInTheDocument();
  },
};

const originalOrder = ["Lena Fischer", "Ada Okafor", "Mateo Garcia"];

export const Sortable: Story = {
  args: { sortable: true },
  play: async ({ canvas, userEvent }) => {
    const name = canvas.getByRole("columnheader", { name: "Name" });
    const projects = canvas.getByRole("columnheader", { name: "Projects" });
    const email = canvas.getByRole("columnheader", { name: "Email" });
    const sortByName = within(name).getByRole("button", { name: "Name" });
    const nameIcon = name.querySelector(".kui-data-table__sort-icon");
    // A display column has no value to sort by, so its header stays plain text.
    await expect(within(email).queryByRole("button")).not.toBeInTheDocument();
    await expect(name).not.toHaveAttribute("aria-sort");
    // The chevron only shows once the column sorts, so it never stands for two states.
    await expect(nameIcon).not.toBeVisible();
    await expect(getColumnText(canvas, "Name").slice(0, 3)).toEqual(originalOrder);

    // The first header button is the first Tab stop. Enter sorts ascending, then descending, then
    // restores the original order.
    await userEvent.tab();
    await expect(sortByName).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(name).toHaveAttribute("aria-sort", "ascending");
    await expect(nameIcon).toBeVisible();
    await expect(getColumnText(canvas, "Name").slice(0, 3)).toEqual([
      "Ada Okafor",
      "Bao Nguyen",
      "Chiara Ricci",
    ]);
    await userEvent.keyboard("{Enter}");
    await expect(name).toHaveAttribute("aria-sort", "descending");
    await expect(getColumnText(canvas, "Name").slice(0, 3)).toEqual([
      "Mateo Garcia",
      "Lena Fischer",
      "Kwame Asante",
    ]);
    await userEvent.keyboard("{Enter}");
    await expect(name).not.toHaveAttribute("aria-sort");
    await expect(getColumnText(canvas, "Name").slice(0, 3)).toEqual(originalOrder);

    // Numbers sort as numbers and start ascending like text does. One column sorts at a time, so
    // sorting Projects clears Name and aria-sort names only the sorted column.
    await userEvent.keyboard("{Enter}");
    await userEvent.click(within(projects).getByRole("button", { name: "Projects" }));
    await expect(projects).toHaveAttribute("aria-sort", "ascending");
    await expect(name).not.toHaveAttribute("aria-sort");
    await expect(getColumnText(canvas, "Projects")).toEqual(
      Array.from({ length: 13 }, (_, index) => String(index + 1)),
    );
    await expect(
      canvas.getAllByRole("columnheader").filter((header) => header.hasAttribute("aria-sort")),
    ).toHaveLength(1);
  },
};

/** The accessor columns only, so the paging controls are the first Tab stops after any sort buttons. */
const plainColumns = columns.slice(0, 4);

export const Paginated: Story = {
  args: { columns: plainColumns, pageSize: 5 },
  play: async ({ canvas, userEvent }) => {
    const status = canvas.getByRole("status");
    const previous = canvas.getByRole("button", { name: "Previous" });
    const next = canvas.getByRole("button", { name: "Next" });
    await expect(status).toHaveTextContent("Page 1 of 3");
    await expect(previous).toBeDisabled();
    await expect(getColumnText(canvas, "Name")).toEqual([
      "Lena Fischer",
      "Ada Okafor",
      "Mateo Garcia",
      "Bao Nguyen",
      "Hana Sato",
    ]);

    // A disabled Button is not a Tab stop, so the first Tab lands on Next.
    await userEvent.tab();
    await expect(next).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(status).toHaveTextContent("Page 2 of 3");
    await expect(previous).toBeEnabled();
    await expect(getColumnText(canvas, "Name")).toEqual([
      "Chiara Ricci",
      "Kwame Asante",
      "Dmitri Volkov",
      "Ivan Petrov",
      "Elif Kaya",
    ]);
    await userEvent.keyboard("{Enter}");
    await expect(status).toHaveTextContent("Page 3 of 3");
    await expect(next).toBeDisabled();
    await expect(getColumnText(canvas, "Name")).toEqual([
      "Jae Park",
      "Farid Haddad",
      "Grace Mbeki",
    ]);

    await userEvent.click(previous);
    await expect(status).toHaveTextContent("Page 2 of 3");
    await expect(next).toBeEnabled();
  },
};

export const SortableAndPaginated: Story = {
  args: { columns: plainColumns, sortable: true, pageSize: 5 },
  play: async ({ canvas, userEvent }) => {
    const name = canvas.getByRole("columnheader", { name: "Name" });
    const projects = canvas.getByRole("columnheader", { name: "Projects" });
    const status = canvas.getByRole("status");
    const next = canvas.getByRole("button", { name: "Next" });

    await userEvent.tab();
    await expect(within(name).getByRole("button", { name: "Name" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(name).toHaveAttribute("aria-sort", "ascending");
    await expect(getColumnText(canvas, "Name")).toEqual([
      "Ada Okafor",
      "Bao Nguyen",
      "Chiara Ricci",
      "Dmitri Volkov",
      "Elif Kaya",
    ]);

    // Paging keeps the sort.
    await userEvent.click(next);
    await expect(status).toHaveTextContent("Page 2 of 3");
    await expect(name).toHaveAttribute("aria-sort", "ascending");
    await expect(getColumnText(canvas, "Name")).toEqual([
      "Farid Haddad",
      "Grace Mbeki",
      "Hana Sato",
      "Ivan Petrov",
      "Jae Park",
    ]);
    await userEvent.click(next);
    await expect(status).toHaveTextContent("Page 3 of 3");
    await expect(getColumnText(canvas, "Name")).toEqual([
      "Kwame Asante",
      "Lena Fischer",
      "Mateo Garcia",
    ]);

    // A new sort moves every row, so it starts over from the first page.
    await userEvent.click(within(projects).getByRole("button", { name: "Projects" }));
    await waitFor(() => expect(status).toHaveTextContent("Page 1 of 3"));
    await expect(projects).toHaveAttribute("aria-sort", "ascending");
    await expect(getColumnText(canvas, "Projects")).toEqual(["1", "2", "3", "4", "5"]);
  },
};

interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  started: string;
  timeZone: string;
  status: string;
}

const employees: Employee[] = [
  {
    id: "e-01",
    name: "Ada Okafor",
    title: "Staff Engineer",
    department: "Platform",
    location: "Lagos, Nigeria",
    manager: "Dmitri Volkov",
    email: "ada@example.com",
    phone: "+234 801 234 5678",
    started: "2019-03-11",
    timeZone: "Africa/Lagos",
    status: "Active",
  },
  {
    id: "e-02",
    name: "Bao Nguyen",
    title: "Product Designer",
    department: "Design",
    location: "Hanoi, Vietnam",
    manager: "Jae Park",
    email: "bao@example.com",
    phone: "+84 91 234 5678",
    started: "2021-08-02",
    timeZone: "Asia/Ho_Chi_Minh",
    status: "Active",
  },
  {
    id: "e-03",
    name: "Chiara Ricci",
    title: "Software Engineer",
    department: "Payments",
    location: "Milan, Italy",
    manager: "Dmitri Volkov",
    email: "chiara@example.com",
    phone: "+39 02 1234 5678",
    started: "2023-01-16",
    timeZone: "Europe/Rome",
    status: "On leave",
  },
  {
    id: "e-04",
    name: "Grace Mbeki",
    title: "Research Scientist",
    department: "Research",
    location: "Cape Town, South Africa",
    manager: "Jae Park",
    email: "grace@example.com",
    phone: "+27 21 123 4567",
    started: "2020-11-30",
    timeZone: "Africa/Johannesburg",
    status: "Active",
  },
];

const employeeColumns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "manager", header: "Manager" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "started", header: "Started" },
  { accessorKey: "timeZone", header: "Time zone" },
  { accessorKey: "status", header: "Status" },
];

export const Wide: Story = {
  render: () => (
    <div style={{ inlineSize: "32rem" }}>
      <DataTable caption="Employees" columns={employeeColumns} data={employees} getRowId={byId} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    // Wider than its container, the table scrolls sideways inside a region named by the caption.
    // The region is a Tab stop, which is what lets the browser scroll it from the keyboard.
    const region = await canvas.findByRole("region", { name: "Employees" });
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    await expect(within(region).getByRole("table", { name: "Employees" })).toBeVisible();
    await userEvent.tab();
    await expect(region).toHaveFocus();
  },
};

const TeamWithRef = () => {
  const ref = useRef<HTMLTableElement>(null);
  const [report, setReport] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <DataTable
        ref={ref}
        className="team"
        data-part="table"
        caption="Team members"
        columns={plainColumns}
        data={members}
        getRowId={byId}
      />
      <Button
        variant="outline"
        onClick={() => setReport(`a ${ref.current?.tagName} with ${ref.current?.rows.length} rows`)}
      >
        Report the table
      </Button>
      <output>The ref holds {report}</output>
    </div>
  );
};

export const RowsCountedThroughRef: Story = {
  render: () => <TeamWithRef />,
  play: async ({ canvas, userEvent }) => {
    const table = canvas.getByRole("table", { name: "Team members" });
    await expect(table).toHaveAttribute("data-part", "table");
    await expect(table).not.toHaveClass("team");
    await expect(table.closest(".kui-data-table")).toHaveClass("kui-data-table", "team");
    await userEvent.click(canvas.getByRole("button", { name: "Report the table" }));
    // The header row counts too.
    await expect(canvas.getByText("The ref holds a TABLE with 14 rows")).toBeVisible();
  },
};

const memberIds = members.map(byId);

export const Selectable: Story = {
  args: { columns: plainColumns, selectable: true },
  play: async ({ canvas, userEvent, args }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Select all rows" });
    const lena = canvas.getByRole("checkbox", { name: "Select Lena Fischer" });
    const ada = canvas.getByRole("checkbox", { name: "Select Ada Okafor" });
    const rows = getBodyRows(canvas);
    await expect(canvas.getAllByRole("checkbox")).toHaveLength(14);
    await expect(selectAll).not.toBeChecked();
    await expect(selectAll).not.toBePartiallyChecked();

    // Select-all is the first Tab stop, then each row's box in order. Space selects a row, the
    // callback gets the selected ids, and select-all turns mixed.
    await userEvent.tab();
    await expect(selectAll).toHaveFocus();
    await userEvent.tab();
    await expect(lena).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(lena).toBeChecked();
    await expect(rows[0]).toHaveAttribute("data-selected", "");
    await expect(rows[1]).not.toHaveAttribute("data-selected");
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith(["m-01"]);
    await expect(selectAll).toBePartiallyChecked();
    await userEvent.tab();
    await userEvent.keyboard(" ");
    await expect(ada).toBeChecked();
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith(["m-01", "m-02"]);

    // Select-all from the mixed state selects every row. Again, it clears them all.
    await userEvent.keyboard("{Shift>}{Tab}{Tab}{/Shift}");
    await expect(selectAll).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(selectAll).toBeChecked();
    await expect(selectAll).not.toBePartiallyChecked();
    for (const checkbox of canvas.getAllByRole("checkbox")) await expect(checkbox).toBeChecked();
    for (const row of rows) await expect(row).toHaveAttribute("data-selected", "");
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith(memberIds);
    await userEvent.keyboard(" ");
    await expect(selectAll).not.toBeChecked();
    for (const checkbox of canvas.getAllByRole("checkbox"))
      await expect(checkbox).not.toBeChecked();
    for (const row of rows) await expect(row).not.toHaveAttribute("data-selected");
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([]);
  },
};

export const SelectableAndPaginated: Story = {
  args: { columns: plainColumns, selectable: true, pageSize: 5, defaultSelectedIds: ["m-08"] },
  play: async ({ canvas, userEvent, args }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Select all rows on this page" });
    const status = canvas.getByRole("status");
    const next = canvas.getByRole("button", { name: "Next" });
    const previous = canvas.getByRole("button", { name: "Previous" });
    await expect(canvas.getAllByRole("checkbox")).toHaveLength(6);
    // Dmitri is selected from the start, but he is on the second page, so select-all here is clear.
    await expect(selectAll).not.toBeChecked();
    await expect(selectAll).not.toBePartiallyChecked();

    await userEvent.click(canvas.getByRole("checkbox", { name: "Select Ada Okafor" }));
    await expect(selectAll).toBePartiallyChecked();
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith(["m-08", "m-02"]);

    // Select-all on the second page adds that page's rows and keeps Ada.
    await userEvent.click(next);
    await expect(status).toHaveTextContent("Page 2 of 3");
    await expect(canvas.getByRole("checkbox", { name: "Select Dmitri Volkov" })).toBeChecked();
    await expect(selectAll).toBePartiallyChecked();
    await userEvent.click(selectAll);
    await expect(selectAll).toBeChecked();
    for (const row of getBodyRows(canvas)) await expect(row).toHaveAttribute("data-selected", "");
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([
      "m-08",
      "m-02",
      "m-06",
      "m-07",
      "m-09",
      "m-10",
    ]);

    // Back on the first page only Ada is selected. Select-all fills the page, and clearing it
    // clears the page and nothing else.
    await userEvent.click(previous);
    await expect(status).toHaveTextContent("Page 1 of 3");
    await expect(selectAll).toBePartiallyChecked();
    await expect(canvas.getByRole("checkbox", { name: "Select Ada Okafor" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "Select Lena Fischer" })).not.toBeChecked();
    await userEvent.click(selectAll);
    await expect(selectAll).toBeChecked();
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([
      "m-08",
      "m-02",
      "m-06",
      "m-07",
      "m-09",
      "m-10",
      "m-01",
      "m-03",
      "m-04",
      "m-05",
    ]);
    await userEvent.click(selectAll);
    await expect(selectAll).not.toBeChecked();
    for (const row of getBodyRows(canvas)) await expect(row).not.toHaveAttribute("data-selected");
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([
      "m-08",
      "m-06",
      "m-07",
      "m-09",
      "m-10",
    ]);
  },
};

const engineerIds = members.filter((member) => member.role === "Engineer").map(byId);

const TeamWithControlledSelection = () => {
  const [selectedIds, setSelectedIds] = useState(["m-02"]);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <DataTable
        caption="Team members"
        columns={plainColumns}
        data={members}
        getRowId={byId}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <Button variant="outline" onClick={() => setSelectedIds(engineerIds)}>
        Select the engineers
      </Button>
      <output>Selected: {selectedIds.length === 0 ? "none" : selectedIds.join(", ")}</output>
    </div>
  );
};

export const ControlledSelection: Story = {
  render: () => <TeamWithControlledSelection />,
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Select all rows" });
    const lena = canvas.getByRole("checkbox", { name: "Select Lena Fischer" });
    const ada = canvas.getByRole("checkbox", { name: "Select Ada Okafor" });
    await expect(ada).toBeChecked();
    await expect(canvas.getByText("Selected: m-02")).toBeVisible();
    await userEvent.click(lena);
    await expect(lena).toBeChecked();
    await expect(canvas.getByText("Selected: m-02, m-01")).toBeVisible();

    // A value set outside the table shows in the boxes, and select-all reads mixed for it.
    await userEvent.click(canvas.getByRole("button", { name: "Select the engineers" }));
    await expect(canvas.getByText("Selected: m-01, m-02, m-05, m-06, m-12")).toBeVisible();
    await expect(canvas.getByRole("checkbox", { name: "Select Hana Sato" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "Select Mateo Garcia" })).not.toBeChecked();
    await expect(selectAll).toBePartiallyChecked();
    await userEvent.click(selectAll);
    await expect(selectAll).toBeChecked();
    // The engineers stay first and select-all appends the rest.
    await expect(
      canvas.getByText(
        "Selected: m-01, m-02, m-05, m-06, m-12, m-03, m-04, m-07, m-08, m-09, m-10, m-11, m-13",
      ),
    ).toBeVisible();
  },
};

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    // The header stays, so the columns are known while the rows are on their way. The status
    // region is the one body cell, spanning every column.
    await expect(canvas.getAllByRole("columnheader").map((header) => header.textContent)).toEqual([
      "Name",
      "Role",
      "City",
      "Projects",
      "Email",
    ]);
    const status = canvas.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("Loading"));
    const cell = canvas.getByRole("cell");
    await expect(cell).toHaveAttribute("colspan", "5");
    await expect(cell).toContainElement(status);
    await expect(getBodyRows(canvas)).toHaveLength(1);
  },
};

export const Empty: Story = {
  args: {
    columns: plainColumns,
    data: [],
    selectable: true,
    emptyMessage: "No members yet. Invite one to get started.",
  },
  play: async ({ canvas }) => {
    // The message is the one body cell, spanning the selection column and the four others.
    const cell = canvas.getByRole("cell");
    await expect(cell).toHaveTextContent("No members yet. Invite one to get started.");
    await expect(cell).toHaveAttribute("colspan", "5");
    await expect(getBodyRows(canvas)).toHaveLength(1);
    await expect(canvas.getAllByRole("columnheader")).toHaveLength(5);
    // Nothing to select, so select-all is disabled. Nothing is loading, so there is no status.
    await expect(canvas.getByRole("checkbox", { name: "Select all rows" })).toBeDisabled();
    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
  },
};

/** Ridgeline's "layer, don't outline" rule. A cream card, label-style headers, and rows told apart by tone. */
export const Layered: Story = {
  args: { columns: plainColumns, sortable: true, selectable: true, pageSize: 5 },
  play: async ({ canvas, userEvent }) => {
    const table = canvas.getByRole("table", { name: "Team members" });
    const card = table.closest(".kui-data-table__scroll") as HTMLElement;
    const cream = tokenColour("--kui-surface-raised");

    // The table sits in a cream card with the card radius.
    await expect(backgroundOf(card)).toEqual(cream);
    await expect(getComputedStyle(card).borderRadius).toBe(
      getComputedStyle(document.documentElement).getPropertyValue("--kui-radius-card").trim(),
    );

    // Header cells and their sort buttons set type in the label style, and the sort buttons keep
    // the direction chevron.
    for (const header of canvas.getAllByRole("columnheader")) await expectLabelStyle(header);
    const sortButtons = within(table).getAllByRole("button");
    await expect(sortButtons).toHaveLength(4);
    for (const button of sortButtons) {
      await expectLabelStyle(button);
      await expect(button.querySelector(".kui-data-table__sort-icon svg")).not.toBeNull();
    }

    // No grid lines anywhere in the table.
    for (const cell of [...canvas.getAllByRole("columnheader"), ...canvas.getAllByRole("cell")]) {
      const style = getComputedStyle(cell);
      await expect([
        style.borderTopWidth,
        style.borderRightWidth,
        style.borderBottomWidth,
        style.borderLeftWidth,
      ]).toEqual(["0px", "0px", "0px", "0px"]);
    }

    // Rows alternate between a light apricot tone and cream, starting with the tone so the first
    // row stands apart from the header. The tone sits between the page's apricot and cream.
    const apricot = tokenColour("--kui-background");
    const rows = getBodyRows(canvas);
    const tone = backgroundOf(
      within(rows[0] as HTMLElement).getAllByRole("cell")[1] as HTMLElement,
    );
    await expect(tone).not.toEqual(cream);
    await expect(luminance(tone)).toBeGreaterThan(luminance(apricot));
    await expect(luminance(tone)).toBeLessThan(luminance(cream));
    for (const [index, row] of rows.entries()) {
      for (const cell of within(row).getAllByRole("cell")) {
        await expect(backgroundOf(cell)).toEqual(index % 2 === 0 ? tone : cream);
      }
    }

    // A selected row turns Peach sky, and its text keeps 4.5:1 there. Hover shares the rule, but
    // a synthetic pointer never matches :hover, so only selection is checked here.
    const peach = tokenColour("--kui-tint");
    const [first, second] = rows as [HTMLElement, HTMLElement];
    await userEvent.click(within(first).getByRole("checkbox"));
    for (const cell of within(first).getAllByRole("cell")) {
      await waitFor(() => expect(backgroundOf(cell)).toEqual(peach));
      const ratio = contrast(toRGB(getComputedStyle(cell).color), peach);
      await expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
    for (const cell of within(second).getAllByRole("cell")) {
      await expect(backgroundOf(cell)).toEqual(cream);
    }

    // The checked box and the focus ring around it need 3:1 against the row (WCAG 1.4.11). Ember
    // on Peach sky is under that, so the row draws both in the on-tint Tokens.
    const box = first.querySelector(".kui-checkbox__box") as HTMLElement;
    const boxStyle = () => {
      void getComputedStyle(box).backgroundColor;
      for (const animation of box.getAnimations()) animation.finish();
      return getComputedStyle(box);
    };
    await expect(toRGB(boxStyle().backgroundColor)).toEqual(tokenColour("--kui-primary-on-tint"));
    await expect(contrast(toRGB(boxStyle().backgroundColor), peach)).toBeGreaterThanOrEqual(3);
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(within(first).getByRole("checkbox")).toHaveFocus();
    await expect(toRGB(boxStyle().outlineColor)).toEqual(tokenColour("--kui-focus-ring-on-tint"));
    await expect(contrast(toRGB(boxStyle().outlineColor), peach)).toBeGreaterThanOrEqual(3);

    // The row reads those Tokens where the root defines them, so a Consumer's plain root rule
    // reaches it like any other.
    const root = document.documentElement.style;
    root.setProperty("--kui-primary-on-tint", "rgb(1, 2, 3)");
    root.setProperty("--kui-focus-ring-on-tint", "rgb(4, 5, 6)");
    const overridden = [boxStyle().backgroundColor, boxStyle().outlineColor];
    root.removeProperty("--kui-primary-on-tint");
    root.removeProperty("--kui-focus-ring-on-tint");
    await expect(overridden).toEqual(["rgb(1, 2, 3)", "rgb(4, 5, 6)"]);

    // Paging uses the kit's outline Button, outside the card, as it did before Ridgeline.
    for (const name of ["Previous", "Next"]) {
      const button = canvas.getByRole("button", { name });
      await expect(button).toHaveClass("kui-button");
      await expect(button).toHaveAttribute("data-variant", "outline");
      await expect(card).not.toContainElement(button);
    }
  },
};

interface Release {
  id: string;
  tag: string;
  owner: string;
  shipped: Date;
  downloads: number;
  sizeMb: number;
  notes: string;
}

/** Values chosen so each sort type gives a different order from a plain string comparison. */
const releases: Release[] = [
  {
    id: "r-1",
    tag: "v1.10",
    owner: "bao",
    shipped: new Date("2024-03-01"),
    downloads: 900,
    sizeMb: 12,
    notes: "Bigger",
  },
  {
    id: "r-2",
    tag: "v1.2",
    owner: "Ada",
    shipped: new Date("2023-11-15"),
    downloads: 1200,
    sizeMb: 3,
    notes: "Small",
  },
  {
    id: "r-3",
    tag: "V1.9",
    owner: "chiara",
    shipped: new Date("2024-01-20"),
    downloads: 40,
    sizeMb: 120,
    notes: "Assets",
  },
  {
    id: "r-4",
    tag: "v1.3",
    owner: "Dmitri",
    shipped: new Date("2022-06-30"),
    downloads: 75,
    sizeMb: 7,
    notes: "Fixes",
  },
];

/** One column per sort type, an accessor function column, and one that opts out of sorting. */
const releaseColumns: ColumnDef<Release>[] = [
  { accessorKey: "tag", header: "Tag" },
  { accessorKey: "owner", header: "Owner" },
  {
    accessorKey: "shipped",
    header: "Shipped",
    cell: ({ row }) => row.original.shipped.toISOString().slice(0, 10),
  },
  { accessorKey: "downloads", header: "Downloads" },
  { id: "size", accessorFn: (release) => `${release.sizeMb} MB`, header: "Size" },
  { accessorKey: "notes", header: "Notes", enableSorting: false },
];

export const SortTypes: Story = {
  render: () => (
    <DataTable
      caption="Releases"
      columns={releaseColumns}
      data={releases}
      getRowId={byId}
      sortable
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const sortBy = (header: string) =>
      userEvent.click(
        within(canvas.getByRole("columnheader", { name: header })).getByRole("button", {
          name: header,
        }),
      );

    // Text with digits in it compares the digits as numbers, and case does not count.
    await sortBy("Tag");
    await expect(getColumnText(canvas, "Tag")).toEqual(["v1.2", "v1.3", "V1.9", "v1.10"]);
    await sortBy("Tag");
    await expect(getColumnText(canvas, "Tag")).toEqual(["v1.10", "V1.9", "v1.3", "v1.2"]);

    // Plain text ignores case too.
    await sortBy("Owner");
    await expect(getColumnText(canvas, "Owner")).toEqual(["Ada", "bao", "chiara", "Dmitri"]);

    // Dates sort by time.
    await sortBy("Shipped");
    await expect(getColumnText(canvas, "Shipped")).toEqual([
      "2022-06-30",
      "2023-11-15",
      "2024-01-20",
      "2024-03-01",
    ]);
    await sortBy("Shipped");
    await expect(getColumnText(canvas, "Shipped")).toEqual([
      "2024-03-01",
      "2024-01-20",
      "2023-11-15",
      "2022-06-30",
    ]);

    // Numbers sort as numbers, and a value from an accessor function sorts like any other.
    await sortBy("Downloads");
    await expect(getColumnText(canvas, "Downloads")).toEqual(["40", "75", "900", "1200"]);
    await sortBy("Size");
    await expect(getColumnText(canvas, "Size")).toEqual(["3 MB", "7 MB", "12 MB", "120 MB"]);

    // A column can opt out of sorting, and its header stays plain text.
    const notes = canvas.getByRole("columnheader", { name: "Notes" });
    await expect(within(notes).queryByRole("button")).not.toBeInTheDocument();
  },
};

/** The order a release team ranks its owners in, which no built-in sort type gives. */
const ownerRank: Record<string, number> = { Dmitri: 0, chiara: 1, Ada: 2, bao: 3 };

/**
 * Custom comparators, the function form of `sortFn`. One reads the typed row, the other reads its
 * own column's value by id, as a comparator written for the TanStack-based build did.
 */
const comparatorColumns: ColumnDef<Release>[] = [
  { accessorKey: "tag", header: "Tag" },
  {
    accessorKey: "owner",
    header: "Owner",
    sortFn: (rowA, rowB) =>
      (ownerRank[rowA.original.owner] ?? 0) - (ownerRank[rowB.original.owner] ?? 0),
  },
  {
    accessorKey: "downloads",
    header: "Downloads",
    // Most downloaded first when ascending.
    sortFn: (rowA, rowB, columnId) =>
      rowB.getValue<number>(columnId) - rowA.getValue<number>(columnId),
  },
];

export const CustomSortFn: Story = {
  render: () => (
    <DataTable
      caption="Releases"
      columns={comparatorColumns}
      data={releases}
      getRowId={byId}
      sortable
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const sortBy = (header: string) =>
      userEvent.click(
        within(canvas.getByRole("columnheader", { name: header })).getByRole("button", {
          name: header,
        }),
      );

    await sortBy("Owner");
    await expect(getColumnText(canvas, "Owner")).toEqual(["Dmitri", "chiara", "Ada", "bao"]);
    // Descending reverses whatever the comparator returns.
    await sortBy("Owner");
    await expect(getColumnText(canvas, "Owner")).toEqual(["bao", "Ada", "chiara", "Dmitri"]);

    await sortBy("Downloads");
    await expect(getColumnText(canvas, "Downloads")).toEqual(["1200", "900", "75", "40"]);
    await expect(canvas.getByRole("columnheader", { name: "Downloads" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  },
};

/** A column that puts one of the kit's Buttons in every row. */
const actionColumns: ColumnDef<Member>[] = [
  ...plainColumns,
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" aria-label={`Message ${row.original.name}`}>
        Message
      </Button>
    ),
  },
];

/**
 * Any control a Consumer puts in a selected row draws its focus ring in the on-tint Token, since
 * Ember is under 3:1 on Peach sky, and a root override of that Token reaches it.
 */
export const FocusRingOnTint: Story = {
  args: { columns: actionColumns, selectable: true, defaultSelectedIds: ["m-01"], pageSize: 5 },
  play: async ({ canvas, userEvent }) => {
    const row = canvas.getByRole("row", { name: /Lena Fischer/ });
    await expect(row).toHaveAttribute("data-selected", "");
    within(row).getByRole("checkbox").focus();
    await userEvent.tab();
    const button = within(row).getByRole("button", { name: "Message Lena Fischer" });
    await expect(button).toHaveFocus();
    const ring = () => {
      void getComputedStyle(button).outlineColor;
      for (const animation of button.getAnimations()) animation.finish();
      return getComputedStyle(button).outlineColor;
    };
    await expect(toRGB(ring())).toEqual(tokenColour("--kui-focus-ring-on-tint"));
    await expect(contrast(toRGB(ring()), tokenColour("--kui-tint"))).toBeGreaterThanOrEqual(3);

    const root = document.documentElement.style;
    root.setProperty("--kui-focus-ring-on-tint", "rgb(4, 5, 6)");
    const overridden = ring();
    root.removeProperty("--kui-focus-ring-on-tint");
    await expect(overridden).toBe("rgb(4, 5, 6)");
  },
};
