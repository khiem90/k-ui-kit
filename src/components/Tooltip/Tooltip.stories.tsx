import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { useCallback, useState } from "react";
import { Button, Tooltip, type TooltipSide } from "../../index";

/** The box renders in the browser's top layer. Queries start from body so they find it either way. */
const findTooltip = () => within(document.body).findByRole("tooltip", {}, { timeout: 2000 });
const queryTooltip = () => within(document.body).queryByRole("tooltip");

/** The gap Tooltip keeps between the trigger and the box. */
const OFFSET = 6;

/**
 * The box may flip after it opens, so the side and the rectangles are checked until they settle.
 * Besides landing on the requested side of the trigger, the box must sit the offset away from it
 * and overlap it along the other axis. A box that falls back to the middle of the viewport, as it
 * would in a browser without anchor positioning, fails.
 */
const expectPlacedOn = async (side: TooltipSide, tooltip: HTMLElement, trigger: HTMLElement) => {
  await waitFor(() => {
    expect(tooltip).toHaveAttribute("data-side", side);
    const box = tooltip.getBoundingClientRect();
    const anchor = trigger.getBoundingClientRect();
    if (side === "top") expect(box.bottom).toBeLessThanOrEqual(anchor.top);
    if (side === "bottom") expect(box.top).toBeGreaterThanOrEqual(anchor.bottom);
    if (side === "left") expect(box.right).toBeLessThanOrEqual(anchor.left);
    if (side === "right") expect(box.left).toBeGreaterThanOrEqual(anchor.right);
    const gap = {
      top: anchor.top - box.bottom,
      bottom: box.top - anchor.bottom,
      left: anchor.left - box.right,
      right: box.left - anchor.right,
    }[side];
    expect(gap).toBeCloseTo(OFFSET, 0);
    if (side === "top" || side === "bottom") {
      expect(box.left).toBeLessThan(anchor.right);
      expect(box.right).toBeGreaterThan(anchor.left);
    } else {
      expect(box.top).toBeLessThan(anchor.bottom);
      expect(box.bottom).toBeGreaterThan(anchor.top);
    }
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
    await expect(trigger).toHaveAttribute("data-state", "closed");
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    const tooltip = await findTooltip();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveTextContent("Saves your changes");
    await expect(tooltip).toHaveAttribute("data-state", "open");
    await expect(trigger).toHaveAttribute("data-state", "open");
    await expect(trigger).toHaveAccessibleDescription("Saves your changes");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Escape}");
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(trigger).not.toHaveAttribute("aria-describedby");
    await expect(trigger).toHaveAttribute("data-state", "closed");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
};

/** Shared by the side Stories. The side under test comes from the Story's args. */
const placesOnRequestedSide: NonNullable<Story["play"]> = async ({ canvas, userEvent, args }) => {
  await userEvent.tab();
  const trigger = canvas.getByRole("button", { name: "Save" });
  await expectPlacedOn(args.side ?? "top", await findTooltip(), trigger);
};

export const Top: Story = { args: { side: "top" }, play: placesOnRequestedSide };

export const Right: Story = { args: { side: "right" }, play: placesOnRequestedSide };

export const Bottom: Story = { args: { side: "bottom" }, play: placesOnRequestedSide };

export const Left: Story = { args: { side: "left" }, play: placesOnRequestedSide };

export const FlipsWhenNoRoom: Story = {
  args: { side: "top" },
  // No centring: the trigger sits at the top of the canvas, where a box above it would not fit.
  render: (args) => <Tooltip {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole("button", { name: "Save" });
    await expectPlacedOn("bottom", await findTooltip(), trigger);
  },
};

/**
 * The trigger sits in a small box that clips its overflow and starts its own stacking context. The
 * tooltip is in the browser's top layer, so it still shows in full above the box, and it renders
 * next to its trigger in the DOM rather than in a portal at the end of body.
 */
export const EscapesClippingContainer: Story = {
  render: (args) => (
    <div style={{ display: "grid", placeItems: "center", minBlockSize: "12rem" }}>
      <div
        style={{
          position: "relative",
          zIndex: 0,
          overflow: "hidden",
          padding: "var(--kui-space-1)",
        }}
      >
        <Tooltip {...args} />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole("button", { name: "Save" });
    const tooltip = await findTooltip();
    await expect(canvasElement).toContainElement(tooltip);
    await expectPlacedOn("top", tooltip, trigger);
    const box = tooltip.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    await expect(tooltip).toContainElement(hit as HTMLElement | null);
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

/** WCAG 1.4.13 asks that hover content stay while the pointer moves onto it. */
export const StaysOpenWhilePointerIsOnTheBox: Story = {
  args: { delay: 0 },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Save" });
    await userEvent.hover(trigger);
    const tooltip = await findTooltip();
    await userEvent.unhover(trigger);
    await userEvent.hover(tooltip);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(tooltip).toBeVisible();
    await userEvent.unhover(tooltip);
    await waitFor(() => expect(queryTooltip()).not.toBeInTheDocument());
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

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas, userEvent, args }) => {
    await expect(await findTooltip()).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Save" })).not.toHaveFocus();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
    await userEvent.keyboard("{Escape}");
    await expect(queryTooltip()).not.toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

const MeasuredHint = () => {
  const [width, setWidth] = useState<number | null>(null);
  // A callback ref runs with the box when it mounts and with null when it unmounts.
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

export const MeasuredThroughRef: Story = {
  render: () => <MeasuredHint />,
  play: async ({ canvas, userEvent }) => {
    const tooltip = await findTooltip();
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
