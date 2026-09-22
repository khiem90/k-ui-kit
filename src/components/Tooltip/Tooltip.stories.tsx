import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { useCallback, useState } from "react";
import { Button } from "../Button/Button";
import { Tooltip, type TooltipSide } from "./Tooltip";

/** The box renders in a portal at the end of body, outside the Story's canvas. */
const findTooltip = () => within(document.body).findByRole("tooltip", {}, { timeout: 2000 });
const queryTooltip = () => within(document.body).queryByRole("tooltip");

/** Radix positions the box a frame after it mounts, so the rectangles are compared until stable. */
const expectPlacedOn = async (side: TooltipSide, tooltip: HTMLElement, trigger: HTMLElement) => {
  await expect(tooltip).toHaveAttribute("data-side", side);
  await waitFor(() => {
    const box = tooltip.getBoundingClientRect();
    const anchor = trigger.getBoundingClientRect();
    if (side === "top") expect(box.bottom).toBeLessThanOrEqual(anchor.top);
    if (side === "bottom") expect(box.top).toBeGreaterThanOrEqual(anchor.bottom);
    if (side === "left") expect(box.right).toBeLessThanOrEqual(anchor.left);
    if (side === "right") expect(box.left).toBeGreaterThanOrEqual(anchor.right);
  });
};

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Saves your changes",
    onOpenChange: fn(),
    children: <Button variant="outline">Save</Button>,
  },
  // Centred with room on every side, so the requested side is the side the box lands on.
  render: (args) => (
    <div style={{ display: "grid", placeItems: "center", minBlockSize: "12rem" }}>
      <Tooltip {...args} />
    </div>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Save" });
    await expect(queryTooltip()).not.toBeInTheDocument();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    const tooltip = await findTooltip();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveTextContent("Saves your changes");
    await expect(trigger).toHaveAccessibleDescription("Saves your changes");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Escape}");
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(trigger).not.toHaveAttribute("aria-describedby");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
};

export const Top: Story = {
  args: { side: "top" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expectPlacedOn("top", await findTooltip(), canvas.getByRole("button", { name: "Save" }));
  },
};

export const Right: Story = {
  args: { side: "right" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expectPlacedOn(
      "right",
      await findTooltip(),
      canvas.getByRole("button", { name: "Save" }),
    );
  },
};

export const Bottom: Story = {
  args: { side: "bottom" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expectPlacedOn(
      "bottom",
      await findTooltip(),
      canvas.getByRole("button", { name: "Save" }),
    );
  },
};

export const Left: Story = {
  args: { side: "left" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expectPlacedOn("left", await findTooltip(), canvas.getByRole("button", { name: "Save" }));
  },
};

export const FlipsWhenNoRoom: Story = {
  args: { side: "top" },
  // No centring: the trigger sits at the top of the canvas, where a tooltip above it would not fit.
  render: (args) => <Tooltip {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const tooltip = await findTooltip();
    await waitFor(() => expect(tooltip).toHaveAttribute("data-side", "bottom"));
    await expectPlacedOn("bottom", tooltip, canvas.getByRole("button", { name: "Save" }));
  },
};

export const OpensOnHover: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Save" });
    await userEvent.hover(trigger);
    const tooltip = await findTooltip();
    await expect(tooltip).toBeVisible();
    await expect(trigger).not.toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.unhover(trigger);
    await waitFor(() => expect(queryTooltip()).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

const SaveAndCancel = () => (
  <div style={{ display: "flex", gap: "var(--kui-space-2)" }}>
    <Tooltip content="Saves your changes">
      <Button variant="outline">Save</Button>
    </Tooltip>
    <Button variant="ghost">Cancel</Button>
  </div>
);

export const ClosesOnBlur: Story = {
  render: () => <SaveAndCancel />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Save" })).toHaveFocus();
    await expect(await findTooltip()).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await expect(queryTooltip()).not.toBeInTheDocument();
  },
};

export const WithDelay: Story = {
  args: { delay: 1000 },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Save" });
    await userEvent.hover(trigger);
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(await findTooltip()).toBeVisible();
    await userEvent.unhover(trigger);
    await waitFor(() => expect(queryTooltip()).not.toBeInTheDocument());
  },
};

const MeasuredHint = () => {
  const [width, setWidth] = useState<number | null>(null);
  // A callback ref sees the box the moment it mounts, which an effect in this component would miss.
  const measure = useCallback((box: HTMLDivElement | null) => {
    setWidth(box ? Math.round(box.getBoundingClientRect().width) : null);
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--kui-space-4)",
        placeItems: "center",
        alignContent: "center",
        minBlockSize: "12rem",
      }}
    >
      <Tooltip
        ref={measure}
        className="save-hint"
        data-part="hint"
        content="Saves your changes"
        defaultOpen
      >
        <Button variant="outline">Save</Button>
      </Tooltip>
      <output>{width === null ? "The box is not mounted" : `The box is ${width}px wide`}</output>
    </div>
  );
};

export const DefaultOpen: Story = {
  render: () => <MeasuredHint />,
  play: async ({ canvas, userEvent }) => {
    const tooltip = await findTooltip();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveClass("kui-tooltip", "save-hint");
    await expect(tooltip).toHaveAttribute("data-part", "hint");
    await expect(canvas.getByText(/^The box is \d+px wide$/)).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(canvas.getByText("The box is not mounted")).toBeVisible();
  },
};

const DeleteWithHint = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Tooltip content="Deletes the file for good" open={open} onOpenChange={setOpen}>
        <Button variant="danger">Delete</Button>
      </Tooltip>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show the hint
      </Button>
      <output>The hint is {open ? "open" : "closed"}</output>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <DeleteWithHint />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Delete" });
    await expect(canvas.getByText("The hint is closed")).toBeVisible();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await findTooltip()).toBeVisible();
    await expect(canvas.getByText("The hint is open")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(canvas.getByText("The hint is closed")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Show the hint" }));
    await expect(await findTooltip()).toBeVisible();
    await expect(trigger).toHaveAccessibleDescription("Deletes the file for good");
    await expect(canvas.getByText("The hint is open")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(canvas.getByText("The hint is closed")).toBeVisible();
  },
};
