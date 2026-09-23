import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { useRef, useState } from "react";
import { Button, Checkbox, type CheckboxProps } from "../../index";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { label: "Email me about new releases", onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await expect(checkbox).not.toBeChecked();
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
    await userEvent.keyboard("{Enter}");
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};

export const LabelToggles: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await userEvent.click(canvas.getByText("Email me about new releases"));
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Select all rows" },
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Select all rows" });
    await expect(checkbox).toBePartiallyChecked();
    await expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    await expect(checkbox).toBePartiallyChecked();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await expect(checkbox).toBeDisabled();
    await userEvent.click(canvas.getByText("Email me about new releases"));
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).toBeChecked();
  },
};

const SelectAll = () => {
  const [selected, setSelected] = useState({ invoices: false, receipts: false });
  const values = Object.values(selected);
  const all = values.every(Boolean);
  const some = values.some(Boolean);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-2)" }}>
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={some && !all}
        onCheckedChange={(next) => setSelected({ invoices: next, receipts: next })}
      />
      <div
        style={{
          display: "grid",
          gap: "var(--kui-space-2)",
          paddingInlineStart: "var(--kui-space-6)",
        }}
      >
        <Checkbox
          label="Invoices"
          checked={selected.invoices}
          onCheckedChange={(next) => setSelected((prev) => ({ ...prev, invoices: next }))}
        />
        <Checkbox
          label="Receipts"
          checked={selected.receipts}
          onCheckedChange={(next) => setSelected((prev) => ({ ...prev, receipts: next }))}
        />
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <SelectAll />,
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Select all" });
    const invoices = canvas.getByRole("checkbox", { name: "Invoices" });
    const receipts = canvas.getByRole("checkbox", { name: "Receipts" });
    await expect(selectAll).not.toBeChecked();
    await userEvent.click(invoices);
    await expect(selectAll).toBePartiallyChecked();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(selectAll).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(selectAll).toBeChecked();
    await expect(invoices).toBeChecked();
    await expect(receipts).toBeChecked();
    await userEvent.keyboard(" ");
    await expect(selectAll).not.toBeChecked();
    await expect(invoices).not.toBeChecked();
    await expect(receipts).not.toBeChecked();
  },
};

const CheckboxWithFocusButton = () => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Checkbox ref={ref} className="newsletter" label="Email me about new releases" />
      <Button variant="outline" onClick={() => ref.current?.focus()}>
        Focus the checkbox
      </Button>
    </div>
  );
};

export const FocusThroughRef: Story = {
  render: () => <CheckboxWithFocusButton />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus the checkbox" }));
    await expect(checkbox).toHaveFocus();
    const root = canvasElement.querySelector(".newsletter");
    await expect(root).toContainElement(checkbox);
    await expect(root).toContainElement(canvas.getByText("Email me about new releases"));
  },
};

const SubscribeForm = (props: Omit<CheckboxProps, "label" | "name">) => {
  const [submitted, setSubmitted] = useState("nothing yet");
  return (
    <form
      style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("newsletter");
        setSubmitted(typeof value === "string" ? value : "no newsletter field");
      }}
    >
      <Checkbox label="Email me about new releases" name="newsletter" {...props} />
      <Button type="submit" variant="outline">
        Subscribe
      </Button>
      <output>Submitted: {submitted}</output>
    </form>
  );
};

export const InForm: Story = {
  render: () => <SubscribeForm value="weekly" />,
  play: async ({ canvas, userEvent }) => {
    const submit = canvas.getByRole("button", { name: "Subscribe" });
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: no newsletter field")).toBeVisible();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Email me about new releases" }));
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: weekly")).toBeVisible();
  },
};

export const Required: Story = {
  render: () => <SubscribeForm required />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about new releases" });
    await expect(checkbox).toHaveAttribute("aria-required", "true");
    const submit = canvas.getByRole("button", { name: "Subscribe" });
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: nothing yet")).toBeVisible();
    await userEvent.click(checkbox);
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: on")).toBeVisible();
  },
};

export const HiddenLabel: Story = {
  args: { label: "Select row", hideLabel: true },
  play: async ({ canvas, userEvent, args }) => {
    // The label stays in the DOM, so it still names the box, and still toggles it when clicked.
    const checkbox = canvas.getByRole("checkbox", { name: "Select row" });
    const label = canvas.getByText("Select row");
    const { width, height } = label.getBoundingClientRect();
    await expect(width).toBeLessThanOrEqual(1);
    await expect(height).toBeLessThanOrEqual(1);
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(label);
    await expect(checkbox).not.toBeChecked();
  },
};
