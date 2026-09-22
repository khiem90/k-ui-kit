import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { useRef, useState } from "react";
import { Button } from "../Button/Button";
import { Switch, type SwitchProps } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { label: "Push notifications", onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await expect(toggle).not.toBeChecked();
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};

export const LabelToggles: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await userEvent.click(canvas.getByText("Push notifications"));
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const On: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await expect(toggle).toBeDisabled();
    await userEvent.click(canvas.getByText("Push notifications"));
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await expect(toggle).toBeDisabled();
    await expect(toggle).toBeChecked();
  },
};

const NotificationSettings = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-2)" }}>
      <Switch label="Notifications" checked={enabled} onCheckedChange={setEnabled} />
      <Switch label="Daily digest" defaultChecked disabled={!enabled} />
      <output>Notifications are {enabled ? "on" : "off"}</output>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <NotificationSettings />,
  play: async ({ canvas, userEvent }) => {
    const notifications = canvas.getByRole("switch", { name: "Notifications" });
    const digest = canvas.getByRole("switch", { name: "Daily digest" });
    await expect(notifications).not.toBeChecked();
    await expect(digest).toBeDisabled();
    await expect(canvas.getByText("Notifications are off")).toBeVisible();
    await userEvent.tab();
    await expect(notifications).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(notifications).toBeChecked();
    await expect(digest).toBeEnabled();
    await expect(canvas.getByText("Notifications are on")).toBeVisible();
    await userEvent.keyboard(" ");
    await expect(notifications).not.toBeChecked();
    await expect(digest).toBeDisabled();
    await expect(canvas.getByText("Notifications are off")).toBeVisible();
  },
};

const SwitchWithFocusButton = () => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Switch ref={ref} className="notifications" label="Push notifications" />
      <Button variant="outline" onClick={() => ref.current?.focus()}>
        Focus the switch
      </Button>
    </div>
  );
};

export const FocusThroughRef: Story = {
  render: () => <SwitchWithFocusButton />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus the switch" }));
    await expect(toggle).toHaveFocus();
    const root = canvasElement.querySelector(".notifications");
    await expect(root).toContainElement(toggle);
    await expect(root).toContainElement(canvas.getByText("Push notifications"));
  },
};

const SettingsForm = (props: Omit<SwitchProps, "label" | "name">) => {
  const [submitted, setSubmitted] = useState("nothing yet");
  return (
    <form
      style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("notifications");
        setSubmitted(typeof value === "string" ? value : "no notifications field");
      }}
    >
      <Switch label="Push notifications" name="notifications" {...props} />
      <Button type="submit" variant="outline">
        Save
      </Button>
      <output>Submitted: {submitted}</output>
    </form>
  );
};

export const InForm: Story = {
  render: () => <SettingsForm value="push" />,
  play: async ({ canvas, userEvent }) => {
    const submit = canvas.getByRole("button", { name: "Save" });
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: no notifications field")).toBeVisible();
    await userEvent.click(canvas.getByRole("switch", { name: "Push notifications" }));
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: push")).toBeVisible();
  },
};

export const Required: Story = {
  render: () => <SettingsForm required />,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: "Push notifications" });
    await expect(toggle).toHaveAttribute("aria-required", "true");
    const submit = canvas.getByRole("button", { name: "Save" });
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: nothing yet")).toBeVisible();
    await userEvent.click(toggle);
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: on")).toBeVisible();
  },
};
