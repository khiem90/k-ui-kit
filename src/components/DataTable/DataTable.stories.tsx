import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { useRef, useState } from "react";
import { Button } from "../Button/Button";
import { DataTable, type ColumnDef, type DataTableProps } from "./DataTable";

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

// An annotation rather than satisfies, so the Stories' args are typed for Member instead of the
// row type's constraint, which is all StoryObj can infer from a generic Component.
const meta: Meta<DataTableProps<Member>> = {
  title: "Components/DataTable",
  component: DataTable,
  args: { caption: "Team members", columns, data: members, getRowId: (member) => member.id },
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
    // Nothing to sort, page, or scroll, so no button, status line, or focusable region.
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
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
    // A display column has no value to sort by, so its header stays plain text.
    await expect(within(email).queryByRole("button")).not.toBeInTheDocument();
    await expect(name).not.toHaveAttribute("aria-sort");
    await expect(getColumnText(canvas, "Name").slice(0, 3)).toEqual(originalOrder);

    // The first header button is the first Tab stop. Enter sorts ascending, then descending, then
    // restores the original order.
    await userEvent.tab();
    await expect(sortByName).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(name).toHaveAttribute("aria-sort", "ascending");
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

    // A disabled control is not a Tab stop, so the first Tab lands on Next.
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
      <DataTable
        caption="Employees"
        columns={employeeColumns}
        data={employees}
        getRowId={(employee) => employee.id}
      />
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
        getRowId={(member) => member.id}
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

export const TableThroughRef: Story = {
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
