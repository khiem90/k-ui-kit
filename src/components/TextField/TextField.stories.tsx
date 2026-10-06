import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useRef, useState } from "react";
import { Button, TextField } from "../../index";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: { label: "Email" },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: "email", name: "email", autoComplete: "email" },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "email");
    await expect(input).toHaveAttribute("name", "email");
    await expect(input).toHaveAttribute("autocomplete", "email");
  },
};

export const WithDescription: Story = {
  args: { description: "We only use this for receipts." },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toHaveAccessibleDescription("We only use this for receipts.");
    await expect(canvas.getByText("We only use this for receipts.")).toBeVisible();
  },
};

export const WithError: Story = {
  args: {
    description: "We only use this for receipts.",
    error: "Enter an email address that contains @.",
    defaultValue: "khiem",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Enter an email address that contains @.",
    );
    await expect(input).toHaveAccessibleDescription(
      "Enter an email address that contains @. We only use this for receipts.",
    );
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
 * The border colour transitions. Reading the style starts any pending transition, and waiting for
 * every running one to finish means the assertion sees the settled colour, not the starting one.
 */
const expectBorder = async (input: HTMLElement, colour: string) => {
  const style = getComputedStyle(input);
  await expect(style.borderTopStyle).toBe("solid");
  await expect(style.borderTopWidth).toBe("2px");
  await Promise.all(input.getAnimations().map((animation) => animation.finished));
  await expect(getComputedStyle(input).borderTopColor).toBe(tokenColour(colour));
};

export const Ridgeline: Story = {
  args: { description: "We only use this for receipts." },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    const field = getComputedStyle(input);
    await expect(field.backgroundColor).toBe(tokenColour("--kui-surface-raised"));
    await expect(field.borderTopLeftRadius).toBe("12px");
    await expect(field.paddingInlineStart).toBe("18px");
    await expect(field.paddingInlineEnd).toBe("18px");
    await expect(field.fontFamily).toBe(tokenValue("--kui-font-body"));
    await expect(field.fontSize).toBe("16px");
    await expectBorder(input, "--kui-border");

    const label = getComputedStyle(canvas.getByText("Email"));
    await expect(label.fontFamily).toBe(tokenValue("--kui-font-label"));
    await expect(label.textTransform).toBe(tokenValue("--kui-label-case"));
    await expect(label.letterSpacing).toBe(
      `${parseFloat(tokenValue("--kui-label-tracking")) * parseFloat(label.fontSize)}px`,
    );

    const description = getComputedStyle(canvas.getByText("We only use this for receipts."));
    await expect(description.fontFamily).toBe(tokenValue("--kui-font-body"));
    await expect(description.color).toBe(tokenColour("--kui-foreground-muted"));
  },
};

export const Focused: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Email");
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expectBorder(input, "--kui-primary");
    const field = getComputedStyle(input);
    await expect(field.outlineStyle).toBe("solid");
    await expect(field.outlineWidth).toBe("2px");
    await expect(field.outlineColor).toBe(tokenColour("--kui-focus-ring"));
  },
};

export const ErrorColours: Story = {
  args: { error: "Enter an email address that contains @.", defaultValue: "khiem" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Email");
    await expectBorder(input, "--kui-danger");
    await expect(getComputedStyle(canvas.getByRole("alert")).color).toBe(
      tokenColour("--kui-danger"),
    );

    // Focus adds the ring but keeps the danger border, so the error stays visible while typing.
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expectBorder(input, "--kui-danger");
    await expect(getComputedStyle(input).outlineColor).toBe(tokenColour("--kui-focus-ring"));
  },
};

const expectHeight = async (input: HTMLElement, px: number) => {
  await expect(input.getBoundingClientRect().height).toBe(px);
};

export const Small: Story = {
  args: { size: "sm" },
  play: async ({ canvas }) => expectHeight(canvas.getByLabelText("Email"), 36),
};

export const Medium: Story = {
  args: { size: "md" },
  play: async ({ canvas }) => expectHeight(canvas.getByLabelText("Email"), 44),
};

export const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvas }) => expectHeight(canvas.getByLabelText("Email"), 52),
};

export const Required: Story = {
  args: { required: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Email" })).toBeRequired();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toBeDisabled();
    await userEvent.type(input, "khiem");
    await expect(input).toHaveValue("");
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "khiem@example.com" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toHaveAttribute("readonly");
    await userEvent.type(input, "x");
    await expect(input).toHaveValue("khiem@example.com");
  },
};

const ControlledTextField = () => {
  const [value, setValue] = useState("");
  const error =
    value && !value.includes("@") ? "Enter an email address that contains @." : undefined;
  return (
    <TextField
      label="Email"
      type="email"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      error={error}
    />
  );
};

export const Controlled: Story = {
  render: () => <ControlledTextField />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Email");
    await userEvent.type(input, "khiem");
    await expect(input).toHaveValue("khiem");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Enter an email address that contains @.",
    );
    await userEvent.type(input, "@example.com");
    await expect(input).toHaveValue("khiem@example.com");
    await expect(input).not.toHaveAttribute("aria-invalid");
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

const TextFieldWithFocusButton = () => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <TextField ref={ref} label="Email" />
      <Button variant="outline" onClick={() => ref.current?.focus()}>
        Focus the email field
      </Button>
    </div>
  );
};

export const FocusThroughRef: Story = {
  render: () => <TextFieldWithFocusButton />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Focus the email field" }));
    await expect(canvas.getByLabelText("Email")).toHaveFocus();
  },
};
