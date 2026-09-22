import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useRef, useState } from "react";
import { Button } from "../Button/Button";
import { TextField } from "./TextField";

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

const expectHeight = async (input: HTMLElement, px: number) => {
  await expect(input.getBoundingClientRect().height).toBe(px);
};

export const Small: Story = {
  args: { size: "sm" },
  play: async ({ canvas }) => expectHeight(canvas.getByLabelText("Email"), 32),
};

export const Medium: Story = {
  args: { size: "md" },
  play: async ({ canvas }) => expectHeight(canvas.getByLabelText("Email"), 40),
};

export const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvas }) => expectHeight(canvas.getByLabelText("Email"), 48),
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
