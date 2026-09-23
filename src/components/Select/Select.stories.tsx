import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { useRef, useState, type CSSProperties } from "react";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { Select, type SelectSize } from "./Select";

/** The list renders in a portal at the end of body, outside the Story's canvas. */
const findListbox = () => within(document.body).findByRole("listbox", {}, { timeout: 2000 });
const queryListbox = () => within(document.body).queryByRole("listbox");

/** Radix moves focus into the list a frame after it mounts. */
const expectFocus = async (element: HTMLElement) => {
  await waitFor(() => expect(element).toHaveFocus());
};

/** Closing unmounts the list and hands focus back to the trigger. */
const expectClosed = async (trigger: HTMLElement) => {
  await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  await expectFocus(trigger);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
};

/**
 * While the list is open, Radix hides the rest of the page from assistive technology and traps focus
 * inside the list, so nothing outside it can be reached. axe cannot see the trap: it flags the
 * trigger, which is focusable and now inside aria-hidden. A Story that ends with the list open, so
 * that axe audits the options, switches that one rule off.
 */
const openListA11y = { a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } };

const meta = {
  title: "Components/Select",
  component: Select.Root,
  subcomponents: {
    Trigger: Select.Trigger,
    Content: Select.Content,
    Item: Select.Item,
    Group: Select.Group,
  },
  args: { defaultValue: "apple", onValueChange: fn() },
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger aria-label="Fruit" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="blueberry">Blueberry</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = ReturnType<typeof within>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toHaveTextContent("Apple");
    await expect(trigger).toHaveAttribute("data-state", "closed");

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    const listbox = await findListbox();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveAttribute("data-state", "open");
    const options = within(listbox).getAllByRole("option");
    await expect(options.map((option) => option.textContent)).toEqual([
      "Apple",
      "Banana",
      "Blueberry",
      "Cherry",
    ]);
    const apple = within(listbox).getByRole("option", { name: "Apple" });
    const banana = within(listbox).getByRole("option", { name: "Banana" });
    const cherry = within(listbox).getByRole("option", { name: "Cherry" });
    // Opening lands on the selected option, which is the one marked selected.
    await expectFocus(apple);
    await expect(apple).toHaveAttribute("aria-selected", "true");
    await expect(apple).toHaveAttribute("data-state", "checked");
    await expect(banana).toHaveAttribute("aria-selected", "false");

    await userEvent.keyboard("{ArrowDown}");
    await expect(banana).toHaveFocus();
    await expect(banana).toHaveAttribute("data-highlighted", "");
    await userEvent.keyboard("{ArrowUp}");
    await expect(apple).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(cherry).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(apple).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("Banana");
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("banana");
  },
};

/** The kit ships no label class for Select, so a Consumer styles their own. This one matches TextField's. */
const labelStyle: CSSProperties = { fontSize: "0.875rem", lineHeight: "1.25rem", fontWeight: 500 };

/** A form row: a TextField and a Select of the same size, each under a visible label. */
const OrderRow = ({ size }: { size: SelectSize }) => (
  <div style={{ display: "flex", gap: "var(--kui-space-4)", alignItems: "flex-end" }}>
    <TextField label="Quantity" size={size} defaultValue="2" />
    <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "var(--kui-space-1)" }}>
      <label htmlFor={`fruit-${size}`} style={labelStyle}>
        Fruit
      </label>
      <Select.Root defaultValue="apple">
        <Select.Trigger id={`fruit-${size}`} size={size} />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  </div>
);

/** The trigger is named by the visible label, and is the same height as the TextField beside it. */
const expectRowHeight = async (canvas: Canvas, px: number) => {
  const trigger = canvas.getByRole("combobox", { name: "Fruit" });
  const input = canvas.getByLabelText("Quantity");
  await expect(trigger.getBoundingClientRect().height).toBe(px);
  await expect(input.getBoundingClientRect().height).toBe(px);
  await expect(trigger.getBoundingClientRect().top).toBe(input.getBoundingClientRect().top);
};

export const Small: Story = {
  render: () => <OrderRow size="sm" />,
  play: async ({ canvas }) => expectRowHeight(canvas, 32),
};

export const Medium: Story = {
  render: () => <OrderRow size="md" />,
  play: async ({ canvas }) => expectRowHeight(canvas, 40),
};

export const Large: Story = {
  render: () => <OrderRow size="lg" />,
  play: async ({ canvas }) => expectRowHeight(canvas, 48),
};

export const WithPlaceholder: Story = {
  render: (args) => (
    <Select.Root onValueChange={args.onValueChange}>
      <Select.Trigger aria-label="Fruit" placeholder="Pick a fruit" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="blueberry">Blueberry</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toHaveTextContent("Pick a fruit");
    await expect(trigger).toHaveAttribute("data-placeholder", "");

    await userEvent.click(trigger);
    const listbox = await findListbox();
    // Nothing is selected yet, so opening lands on the first option.
    const apple = within(listbox).getByRole("option", { name: "Apple" });
    await expectFocus(apple);
    await expect(apple).toHaveAttribute("data-state", "unchecked");
    await expect(within(listbox).queryByRole("option", { selected: true })).not.toBeInTheDocument();

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("Blueberry");
    await expect(trigger).not.toHaveAttribute("data-placeholder");
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("blueberry");
  },
};

export const WithGroups: Story = {
  parameters: openListA11y,
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger aria-label="Produce" />
      <Select.Content>
        <Select.Group label="Fruit">
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Group>
        <Select.Group label="Vegetables">
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="leek">Leek</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Produce" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const listbox = await findListbox();
    // The label heads each group in the list and names it for assistive technology.
    const fruit = within(listbox).getByRole("group", { name: "Fruit" });
    const vegetables = within(listbox).getByRole("group", { name: "Vegetables" });
    await expect(within(fruit).getByText("Fruit")).toBeVisible();
    await expect(
      within(fruit)
        .getAllByRole("option")
        .map((o) => o.textContent),
    ).toEqual(["Apple", "Banana"]);
    await expect(
      within(vegetables)
        .getAllByRole("option")
        .map((o) => o.textContent),
    ).toEqual(["Carrot", "Leek"]);

    // Arrow keys walk straight across the group boundary.
    await expectFocus(within(fruit).getByRole("option", { name: "Apple" }));
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(vegetables).getByRole("option", { name: "Carrot" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("Carrot");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("carrot");

    // Left open so axe audits the list with its groups and the check on the picked option.
    await userEvent.keyboard("{Enter}");
    const reopened = await findListbox();
    await expectFocus(within(reopened).getByRole("option", { name: "Carrot" }));
  },
};

export const WithDisabledItem: Story = {
  parameters: openListA11y,
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger aria-label="Fruit" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana" disabled>
          Banana
        </Select.Item>
        <Select.Item value="blueberry">Blueberry</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const listbox = await findListbox();
    const apple = within(listbox).getByRole("option", { name: "Apple" });
    const banana = within(listbox).getByRole("option", { name: "Banana" });
    const blueberry = within(listbox).getByRole("option", { name: "Blueberry" });
    await expect(banana).toHaveAttribute("aria-disabled", "true");
    await expect(banana).toHaveAttribute("data-disabled", "");

    // The arrow keys step over the disabled option in both directions.
    await expectFocus(apple);
    await userEvent.keyboard("{ArrowDown}");
    await expect(blueberry).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(apple).toHaveFocus();

    // Clicking it picks nothing and leaves the list open, for axe to audit the disabled option.
    await userEvent.click(banana);
    await expect(queryListbox()).toBeInTheDocument();
    await expect(trigger).toHaveTextContent("Apple");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const Typeahead: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const listbox = await findListbox();
    const banana = within(listbox).getByRole("option", { name: "Banana" });
    const blueberry = within(listbox).getByRole("option", { name: "Blueberry" });

    // A letter jumps to the first option that starts with it, and the next letter narrows it.
    await userEvent.keyboard("b");
    await expect(banana).toHaveFocus();
    await userEvent.keyboard("l");
    await expect(blueberry).toHaveFocus();

    // Escape closes the list without picking the option under focus.
    await userEvent.keyboard("{Escape}");
    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("Apple");
    await expect(args.onValueChange).not.toHaveBeenCalled();

    // On the closed trigger, typing picks the match outright, the way a native select does.
    await userEvent.keyboard("c");
    await expect(trigger).toHaveTextContent("Cherry");
    await expect(queryListbox()).not.toBeInTheDocument();
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("cherry");
  },
};

const FruitOrder = () => {
  const [fruit, setFruit] = useState("apple");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Select.Root value={fruit} onValueChange={setFruit}>
        <Select.Trigger aria-label="Fruit" style={{ inlineSize: "16rem" }} />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button variant="outline" onClick={() => setFruit("cherry")}>
        Choose cherry
      </Button>
      <output>Ordered {fruit}</output>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <FruitOrder />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toHaveTextContent("Apple");
    await expect(canvas.getByText("Ordered apple")).toBeVisible();

    await userEvent.click(trigger);
    const listbox = await findListbox();
    await userEvent.click(within(listbox).getByRole("option", { name: "Banana" }));
    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("Banana");
    await expect(canvas.getByText("Ordered banana")).toBeVisible();

    // A change from application code reaches the trigger too.
    await userEvent.click(canvas.getByRole("button", { name: "Choose cherry" }));
    await expect(trigger).toHaveTextContent("Cherry");
    await expect(canvas.getByText("Ordered cherry")).toBeVisible();
  },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** The scroll buttons carry no role, so a test names them the way a Consumer's stylesheet would. */
const queryScrollButton = (side: "up" | "down") =>
  document.body.querySelector<HTMLElement>(`.kui-select__scroll-button[data-side="${side}"]`);

export const LongList: Story = {
  args: { defaultValue: "january" },
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger aria-label="Month" />
      <Select.Content>
        {months.map((month) => (
          <Select.Item key={month} value={month.toLowerCase()}>
            {month}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Month" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const listbox = await findListbox();
    await expect(within(listbox).getAllByRole("option")).toHaveLength(12);
    const january = within(listbox).getByRole("option", { name: "January" });
    const december = within(listbox).getByRole("option", { name: "December" });
    await expectFocus(january);

    // The list is capped well under the window, so it scrolls, and only the button for the
    // direction with more items shows.
    await expect(listbox.getBoundingClientRect().height).toBeLessThanOrEqual(320);
    await expect(december.getBoundingClientRect().bottom).toBeGreaterThan(
      listbox.getBoundingClientRect().bottom,
    );
    await waitFor(() => expect(queryScrollButton("down")).toBeVisible());
    await expect(queryScrollButton("up")).not.toBeInTheDocument();

    // Resting the pointer on a button scrolls the list that way. Moving it off stops the scroll.
    const viewport = listbox.querySelector<HTMLElement>(".kui-select__viewport");
    if (!viewport) throw new Error("The viewport is not in the list.");
    await expect(viewport.scrollTop).toBe(0);
    await userEvent.hover(queryScrollButton("down") as HTMLElement);
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
    await userEvent.hover(listbox);

    // End lands on the last option and brings it into view.
    await userEvent.keyboard("{End}");
    await expect(december).toHaveFocus();
    await waitFor(() => expect(queryScrollButton("up")).toBeVisible());
    await expect(queryScrollButton("down")).not.toBeInTheDocument();
    await expect(december.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      listbox.getBoundingClientRect().bottom,
    );
    await userEvent.keyboard("{Enter}");
    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("December");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("december");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toBeDisabled();
    await expect(trigger).toHaveAttribute("data-disabled", "");
    await expect(trigger).toHaveTextContent("Apple");
    await userEvent.click(trigger);
    await expect(queryListbox()).not.toBeInTheDocument();
    // A disabled trigger is not a Tab stop.
    await userEvent.tab();
    await expect(trigger).not.toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

const FruitOrderForm = () => {
  const [submitted, setSubmitted] = useState("nothing yet");
  return (
    <form
      style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get("fruit")));
      }}
    >
      <Select.Root name="fruit" required>
        <Select.Trigger
          aria-label="Fruit"
          placeholder="Pick a fruit"
          style={{ inlineSize: "16rem" }}
        />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button type="submit">Order</Button>
      <output>Submitted {submitted}</output>
    </form>
  );
};

export const InForm: Story = {
  render: () => <FruitOrderForm />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toHaveAttribute("aria-required", "true");
    // Required and still empty, so the form does not submit.
    await userEvent.click(canvas.getByRole("button", { name: "Order" }));
    await expect(canvas.getByText("Submitted nothing yet")).toBeVisible();

    await userEvent.click(trigger);
    const listbox = await findListbox();
    await userEvent.click(within(listbox).getByRole("option", { name: "Banana" }));
    await expectClosed(trigger);
    await userEvent.click(canvas.getByRole("button", { name: "Order" }));
    await expect(canvas.getByText("Submitted banana")).toBeVisible();
  },
};

const FruitWithRefs = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Select.Root
        defaultValue="apple"
        // The list is still mounted when a pick is reported, so every ref is attached here.
        onValueChange={(value) =>
          setReport(
            `${value} from a ${triggerRef.current?.getAttribute("role")}, ${contentRef.current?.getAttribute("role")}, ${groupRef.current?.getAttribute("role")}, and ${itemRef.current?.getAttribute("role")}`,
          )
        }
      >
        <Select.Trigger
          ref={triggerRef}
          className="fruit__trigger"
          data-part="trigger"
          aria-label="Fruit"
          style={{ inlineSize: "16rem" }}
        />
        <Select.Content ref={contentRef} className="fruit__list" data-part="content">
          <Select.Group ref={groupRef} className="fruit__group" data-part="group" label="Fruit">
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item ref={itemRef} className="fruit__item" data-part="item" value="banana">
              Banana
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Button variant="outline" onClick={() => triggerRef.current?.focus()}>
        Focus the trigger
      </Button>
      <output>Parts: {report}</output>
    </div>
  );
};

export const PartsThroughRefs: Story = {
  render: () => <FruitWithRefs />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toHaveClass("kui-select__trigger", "fruit__trigger");
    await expect(trigger).toHaveAttribute("data-part", "trigger");
    await userEvent.click(canvas.getByRole("button", { name: "Focus the trigger" }));
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    const listbox = await findListbox();
    await expect(listbox).toHaveClass("kui-select__content", "fruit__list");
    await expect(listbox).toHaveAttribute("data-part", "content");
    const group = within(listbox).getByRole("group", { name: "Fruit" });
    await expect(group).toHaveClass("kui-select__group", "fruit__group");
    await expect(group).toHaveAttribute("data-part", "group");
    const banana = within(listbox).getByRole("option", { name: "Banana" });
    await expect(banana).toHaveClass("kui-select__item", "fruit__item");
    await expect(banana).toHaveAttribute("data-part", "item");

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await expectClosed(trigger);
    await expect(
      canvas.getByText("Parts: banana from a combobox, listbox, group, and option"),
    ).toBeVisible();
  },
};
