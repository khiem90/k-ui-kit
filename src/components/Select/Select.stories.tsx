import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { useRef, useState, type CSSProperties } from "react";
import { Button, Select, TextField, type SelectSize } from "../../index";

/** The list renders in the browser's top layer. Queries start from body so they find it either way. */
const findListbox = () => within(document.body).findByRole("listbox", {}, { timeout: 2000 });
const queryListbox = () => within(document.body).queryByRole("listbox");

/** The gap Select keeps between the trigger and the list. */
const OFFSET = 4;

/**
 * The list must sit the offset away from the trigger on the given side, be at least as wide as the
 * trigger, and overlap it across. A list that falls back to the middle of the viewport, as it would
 * in a browser without anchor positioning, fails.
 */
const expectPlacedOn = async (
  side: "top" | "bottom",
  listbox: HTMLElement,
  trigger: HTMLElement,
) => {
  await waitFor(() => {
    const box = listbox.getBoundingClientRect();
    const anchor = trigger.getBoundingClientRect();
    if (side === "bottom") expect(box.top - anchor.bottom).toBeCloseTo(OFFSET, 0);
    else expect(anchor.top - box.bottom).toBeCloseTo(OFFSET, 0);
    expect(box.width).toBeGreaterThanOrEqual(anchor.width - 0.5);
    expect(box.left).toBeLessThan(anchor.right);
    expect(box.right).toBeGreaterThan(anchor.left);
  });
};

/** Focus moves into the list as it opens. */
const expectFocus = async (element: HTMLElement) => {
  await waitFor(() => expect(element).toHaveFocus());
};

/** Closing unmounts the list and hands focus back to the trigger. */
const expectClosed = async (trigger: HTMLElement) => {
  await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
  await expectFocus(trigger);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
};

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

/** Resolves a colour Token the way the browser computes it, so it compares with a computed style. */
const tokenColour = (name: string) => {
  const probe = document.createElement("span");
  probe.style.color = `var(${name})`;
  document.body.append(probe);
  const colour = getComputedStyle(probe).color;
  probe.remove();
  return colour;
};

/** Reads a Token off the root as written, such as a font stack or a text-transform keyword. */
const tokenValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Reads a style once any running transition has finished. Reading the style starts a pending
 * transition, and finishing it means the assertion sees the settled value, not the starting one.
 * Finishing rather than waiting also works in a background tab, where transitions don't advance.
 */
const settledStyle = (element: HTMLElement) => {
  void getComputedStyle(element).borderTopColor;
  for (const animation of element.getAnimations()) animation.finish();
  return getComputedStyle(element);
};

/** The trigger keeps TextField's 2px edge, in the given colour Token. */
const expectBorder = async (trigger: HTMLElement, colour: string) => {
  const style = settledStyle(trigger);
  await expect(style.borderTopStyle).toBe("solid");
  await expect(style.borderTopWidth).toBe("2px");
  await expect(style.borderTopColor).toBe(tokenColour(colour));
};

/** The standard focus ring: 2px of the focus ring Token, 2px clear of the element. */
const expectFocusRing = async (element: HTMLElement) => {
  const style = settledStyle(element);
  await expect(style.outlineStyle).toBe("solid");
  await expect(style.outlineWidth).toBe("2px");
  await expect(style.outlineOffset).toBe("2px");
  await expect(style.outlineColor).toBe(tokenColour("--kui-focus-ring"));
};

/** The trigger is drawn as a TextField: a cream field with the field radius and body text. */
export const Ridgeline: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Select.Root key={size} {...args}>
          <Select.Trigger
            aria-label={`Fruit ${size}`}
            size={size}
            style={{ inlineSize: "16rem" }}
          />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const size of ["sm", "md", "lg"]) {
      const trigger = canvas.getByRole("combobox", { name: `Fruit ${size}` });
      const style = getComputedStyle(trigger);
      await expect(style.backgroundColor).toBe(tokenColour("--kui-surface-raised"));
      await expect(style.color).toBe(tokenColour("--kui-foreground"));
      await expect(style.borderTopLeftRadius).toBe("12px");
      await expect(style.paddingInlineStart).toBe("18px");
      await expect(style.paddingInlineEnd).toBe("18px");
      await expect(style.fontFamily).toBe(tokenValue("--kui-font-body"));
      // Only the height changes with the size, as in TextField.
      await expect(style.fontSize).toBe("16px");
      await expectBorder(trigger, "--kui-border");
      // The padding follows the TextField's Token and the type follows the root size, so a
      // Consumer's root rule reaches both fields alike.
      const root = document.documentElement.style;
      root.setProperty("--kui-padding-field-inline", "20px");
      root.fontSize = "20px";
      const followed = getComputedStyle(trigger);
      const values = [followed.paddingInlineStart, followed.paddingInlineEnd, followed.fontSize];
      root.removeProperty("--kui-padding-field-inline");
      root.removeProperty("font-size");
      await expect(values).toEqual(["20px", "20px", "20px"]);
    }
  },
};

/** Ember against the muted edge is too close a pair to show focus alone, so the ring shows too. */
export const Focused: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expectBorder(trigger, "--kui-primary");
    await expectFocusRing(trigger);
  },
};

/**
 * Select has no error prop. A Consumer who marks the trigger invalid gets TextField's danger edge,
 * and it stays danger under focus, so the error is still visible while the Consumer picks.
 */
export const Invalid: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--kui-space-2)", justifyItems: "start" }}>
      <Select.Root {...args}>
        <Select.Trigger
          aria-label="Fruit"
          aria-invalid
          aria-describedby="fruit-error"
          style={{ inlineSize: "16rem" }}
        />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Content>
      </Select.Root>
      <p id="fruit-error" style={{ margin: 0, color: "var(--kui-danger)" }}>
        We are out of apples.
      </p>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toBeInvalid();
    await expect(trigger).toHaveAccessibleDescription("We are out of apples.");
    await expectBorder(trigger, "--kui-danger");

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expectBorder(trigger, "--kui-danger");
    await expectFocusRing(trigger);
  },
};

/** Resolves a shadow Token the way the browser computes it, so it compares with a computed style. */
const tokenShadow = (name: string) => {
  const probe = document.createElement("span");
  probe.style.boxShadow = `var(${name})`;
  document.body.append(probe);
  const shadow = getComputedStyle(probe).boxShadow;
  probe.remove();
  return shadow;
};

/** The list floats as a cream card with the deepest shadow, and its text is body text. */
export const RidgelineList: Story = {
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger aria-label="Produce" style={{ inlineSize: "16rem" }} />
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
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Produce" }));
    const listbox = await findListbox();
    const list = getComputedStyle(listbox);
    await expect(list.backgroundColor).toBe(tokenColour("--kui-surface-raised"));
    await expect(list.color).toBe(tokenColour("--kui-foreground"));
    await expect(list.borderTopLeftRadius).toBe("24px");
    await expect(list.boxShadow).toBe(tokenShadow("--kui-shadow-floating"));
    await expect(list.fontFamily).toBe(tokenValue("--kui-font-body"));
    await expect(list.fontSize).toBe("16px");

    // Group labels use the label style, in muted text.
    const label = getComputedStyle(within(listbox).getByText("Vegetables"));
    await expect(label.fontFamily).toBe(tokenValue("--kui-font-label"));
    await expect(label.textTransform).toBe(tokenValue("--kui-label-case"));
    await expect(label.letterSpacing).toBe(
      `${parseFloat(tokenValue("--kui-label-tracking")) * parseFloat(label.fontSize)}px`,
    );
    await expect(label.color).toBe(tokenColour("--kui-foreground-muted"));

    const apple = within(listbox).getByRole("option", { name: "Apple" });
    const banana = within(listbox).getByRole("option", { name: "Banana" });
    const check = () => apple.querySelector<HTMLElement>(".kui-select__item-indicator")!;
    await expectFocus(apple);
    await userEvent.keyboard("{ArrowDown}");
    await expect(banana).toHaveAttribute("data-highlighted", "");

    // Options use the field radius. The selected one shows an Ember check.
    await expect(getComputedStyle(apple).borderTopLeftRadius).toBe("12px");
    await expect(getComputedStyle(apple).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    await expect(getComputedStyle(check()).color).toBe(tokenColour("--kui-primary"));

    // The highlighted option is Peach sky. The fill is about 1.6:1 on cream, too faint to mark
    // focus alone, so the focus ring shows as well.
    await expect(settledStyle(banana).backgroundColor).toBe(tokenColour("--kui-tint"));
    await expect(getComputedStyle(banana).color).toBe(tokenColour("--kui-foreground"));
    await expectFocusRing(banana);

    // Ember on Peach sky is under 3:1, so a highlighted check takes primary on tint, and a
    // Consumer's root override of that Token reaches it.
    await userEvent.keyboard("{ArrowUp}");
    await expect(apple).toHaveAttribute("data-highlighted", "");
    await expect(settledStyle(apple).backgroundColor).toBe(tokenColour("--kui-tint"));
    await expect(getComputedStyle(check()).color).toBe(tokenColour("--kui-primary-on-tint"));
    const root = document.documentElement.style;
    root.setProperty("--kui-primary-on-tint", "rgb(1, 2, 3)");
    const overridden = getComputedStyle(check()).color;
    root.removeProperty("--kui-primary-on-tint");
    await expect(overridden).toBe("rgb(1, 2, 3)");
    await expectFocusRing(apple);
  },
};

/** The kit ships no label class for Select, so a Consumer styles their own. This one matches TextField's. */
const labelStyle: CSSProperties = {
  fontFamily: "var(--kui-font-label)",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  fontWeight: 600,
  textTransform: "var(--kui-label-case)" as CSSProperties["textTransform"],
  letterSpacing: "var(--kui-label-tracking)",
};

/** A form row: a TextField and a Select of the same size, each under a visible label. */
const OrderRow = ({ size }: { size: SelectSize }) => (
  <div style={{ display: "flex", gap: "var(--kui-space-4)", alignItems: "flex-end" }}>
    <TextField label="Quantity" size={size} defaultValue="2" />
    <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "var(--kui-space-2)" }}>
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
  play: async ({ canvas }) => expectRowHeight(canvas, 36),
};

export const Medium: Story = {
  render: () => <OrderRow size="md" />,
  play: async ({ canvas }) => expectRowHeight(canvas, 44),
};

export const Large: Story = {
  render: () => <OrderRow size="lg" />,
  play: async ({ canvas }) => expectRowHeight(canvas, 52),
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
    // The arrow keys open the list from the trigger as well as Enter and Space.
    await userEvent.keyboard("{ArrowDown}");
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

    // Left open so axe audits the list with its groups and the check on the picked option. Nothing
    // on the page is hidden from assistive technology meanwhile, so the trigger stays in the Tab
    // order and can still be found by its role.
    await userEvent.keyboard("{Enter}");
    const reopened = await findListbox();
    await expectFocus(within(reopened).getByRole("option", { name: "Carrot" }));
    await expect(trigger).not.toHaveAttribute("tabindex");
    await expect(canvas.getByRole("combobox", { name: "Produce" })).toBe(trigger);
  },
};

export const WithDisabledItem: Story = {
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
    await userEvent.keyboard(" ");
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

    // Typeahead skips it too: the first option starting with b is Blueberry.
    await userEvent.keyboard("b");
    await expect(blueberry).toHaveFocus();

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

    // The list is capped well under the window, so it scrolls natively, with the browser's own
    // scrollbar. It opens at the top, with December out of view below.
    await expect(listbox.getBoundingClientRect().height).toBeLessThanOrEqual(320);
    await expect(getComputedStyle(listbox).overflowY).toBe("auto");
    await expect(getComputedStyle(listbox).scrollbarWidth).not.toBe("none");
    await expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    await expect(listbox.scrollTop).toBe(0);
    await expect(december.getBoundingClientRect().bottom).toBeGreaterThan(
      listbox.getBoundingClientRect().bottom,
    );

    // End lands on the last option and scrolls it into view.
    await userEvent.keyboard("{End}");
    await expect(december).toHaveFocus();
    await expect(listbox.scrollTop).toBeGreaterThan(0);
    await expect(december.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      listbox.getBoundingClientRect().bottom,
    );
    // Home goes back to the top.
    await userEvent.keyboard("{Home}");
    await expect(january).toHaveFocus();
    await expect(listbox.scrollTop).toBe(0);
    await userEvent.keyboard("{End}");
    await userEvent.keyboard("{Enter}");
    await expectClosed(trigger);
    await expect(trigger).toHaveTextContent("December");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("december");
  },
};

/** The arrow keys scroll far enough that the focus ring around the option is in view too. */
export const ScrollsRingIntoView: Story = {
  ...LongList,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Month" }));
    const listbox = await findListbox();
    const visible = () => {
      const box = listbox.getBoundingClientRect();
      const top = box.top + listbox.clientTop;
      return { top, bottom: top + listbox.clientHeight };
    };
    // The ring is 2px wide and 2px clear of the option.
    const ring = 4;

    await expectFocus(within(listbox).getByRole("option", { name: "January" }));
    for (const month of months.slice(1, -1)) {
      await userEvent.keyboard("{ArrowDown}");
      const option = within(listbox).getByRole("option", { name: month });
      await expect(option).toHaveFocus();
      await expect(option.getBoundingClientRect().bottom + ring).toBeLessThanOrEqual(
        visible().bottom,
      );
    }
    await expect(listbox.scrollTop).toBeGreaterThan(0);
    for (const month of months.slice(1, -1).reverse().slice(1)) {
      await userEvent.keyboard("{ArrowUp}");
      const option = within(listbox).getByRole("option", { name: month });
      await expect(option).toHaveFocus();
      await expect(option.getBoundingClientRect().top - ring).toBeGreaterThanOrEqual(visible().top);
    }
    await userEvent.keyboard("{Escape}");
  },
};

export const PlacedBelowTrigger: Story = {
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger aria-label="Fruit" style={{ inlineSize: "16rem" }} />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await userEvent.click(trigger);
    await expectPlacedOn("bottom", await findListbox(), trigger);
  },
};

export const FlipsWhenNoRoom: Story = {
  args: { defaultValue: "january" },
  // Pinned to the bottom of the window, where the list cannot fit below the trigger.
  render: (args) => (
    <div style={{ position: "fixed", insetInline: "1rem", insetBlockEnd: "1rem" }}>
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
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Month" });
    await userEvent.click(trigger);
    await expectPlacedOn("top", await findListbox(), trigger);
  },
};

export const ClosesOnOutsidePress: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Select.Root {...args}>
        <Select.Trigger aria-label="Fruit" style={{ inlineSize: "16rem" }} />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Content>
      </Select.Root>
      <p>Fresh fruit every morning.</p>
    </div>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    // A press on the trigger itself toggles the list rather than counting as outside.
    await userEvent.click(trigger);
    await findListbox();
    await userEvent.click(trigger);
    await expectClosed(trigger);

    await userEvent.click(trigger);
    await findListbox();
    await userEvent.click(canvas.getByText("Fresh fruit every morning."));
    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveTextContent("Apple");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const ClosesWhenFocusLeaves: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Select.Root {...args}>
        <Select.Trigger aria-label="Fruit" style={{ inlineSize: "16rem" }} />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button variant="outline">Add to basket</Button>
    </div>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    const basket = canvas.getByRole("button", { name: "Add to basket" });

    // Tab moves on from the list to the next control, and the list closes behind it.
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expectFocus(within(await findListbox()).getByRole("option", { name: "Apple" }));
    await userEvent.tab();
    await expect(basket).toHaveFocus();
    await waitFor(() => expect(queryListbox()).not.toBeInTheDocument());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Shift+Tab from the list lands back on the trigger, which never left the Tab order.
    await userEvent.click(trigger);
    await expectFocus(within(await findListbox()).getByRole("option", { name: "Apple" }));
    await userEvent.tab({ shift: true });
    await expectClosed(trigger);
    await expect(args.onValueChange).not.toHaveBeenCalled();
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
      <div style={{ display: "flex", gap: "var(--kui-space-2)" }}>
        <Button type="submit">Order</Button>
        <Button type="reset" variant="outline">
          Start over
        </Button>
      </div>
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

    // Resetting the form clears the pick, so required blocks the next submit again.
    await userEvent.click(canvas.getByRole("button", { name: "Start over" }));
    await expect(trigger).toHaveTextContent("Pick a fruit");
    await expect(trigger).toHaveAttribute("data-placeholder", "");
    await userEvent.click(canvas.getByRole("button", { name: "Order" }));
    await expect(canvas.getByText("Submitted banana")).toBeVisible();

    // Picked again, the new value is the one submitted.
    await userEvent.click(trigger);
    await userEvent.click(within(await findListbox()).getByRole("option", { name: "Cherry" }));
    await expectClosed(trigger);
    await userEvent.click(canvas.getByRole("button", { name: "Order" }));
    await expect(canvas.getByText("Submitted cherry")).toBeVisible();
  },
};

/** A reset returns the Select to the value it started with, as a native select would. */
export const ResetToDefault: Story = {
  args: { name: "fruit", defaultValue: "banana" },
  render: (args) => {
    const OrderForm = () => {
      const [submitted, setSubmitted] = useState("nothing yet");
      return (
        <form
          style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(String(new FormData(event.currentTarget).get("fruit")));
          }}
        >
          <Select.Root {...args}>
            <Select.Trigger aria-label="Fruit" style={{ inlineSize: "16rem" }} />
            <Select.Content>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="banana">Banana</Select.Item>
              <Select.Item value="cherry">Cherry</Select.Item>
            </Select.Content>
          </Select.Root>
          <div style={{ display: "flex", gap: "var(--kui-space-2)" }}>
            <Button type="submit">Order</Button>
            <Button type="reset" variant="outline">
              Start over
            </Button>
          </div>
          <output>Submitted {submitted}</output>
        </form>
      );
    };
    return <OrderForm />;
  },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    const order = canvas.getByRole("button", { name: "Order" });
    const startOver = canvas.getByRole("button", { name: "Start over" });

    // A reset with nothing changed keeps the value and reports nothing.
    await userEvent.click(startOver);
    await expect(trigger).toHaveTextContent("Banana");
    await userEvent.click(order);
    await expect(canvas.getByText("Submitted banana")).toBeVisible();
    await expect(args.onValueChange).not.toHaveBeenCalled();

    // After a pick, a reset goes back to the starting value and reports it.
    await userEvent.click(trigger);
    await userEvent.click(within(await findListbox()).getByRole("option", { name: "Cherry" }));
    await expectClosed(trigger);
    await expect(args.onValueChange).toHaveBeenLastCalledWith("cherry");
    await userEvent.click(startOver);
    await expect(trigger).toHaveTextContent("Banana");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("banana");
    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
    await userEvent.click(order);
    await expect(canvas.getByText("Submitted banana")).toBeVisible();

    // The form is still in step with the trigger for the next submit.
    await userEvent.click(trigger);
    await userEvent.click(within(await findListbox()).getByRole("option", { name: "Apple" }));
    await expectClosed(trigger);
    await userEvent.click(order);
    await expect(canvas.getByText("Submitted apple")).toBeVisible();
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
