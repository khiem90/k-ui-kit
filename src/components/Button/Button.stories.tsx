import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRef, type MouseEvent } from "react";
import { expect, fn } from "storybook/test";
import { Button } from "../../index";

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = { args: { variant: "primary" } };

export const Secondary: Story = { args: { variant: "secondary" } };

export const Outline: Story = { args: { variant: "outline" } };

export const Ghost: Story = { args: { variant: "ghost" } };

export const Danger: Story = { args: { variant: "danger", children: "Delete" } };

export const Small: Story = { args: { size: "sm" } };

export const Medium: Story = { args: { size: "md" } };

export const Large: Story = { args: { size: "lg" } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--kui-space-3)" }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = ["Small", "Medium", "Large"].map(
      (name) => canvas.getByRole("button", { name }).getBoundingClientRect().height,
    );
    await expect(heights).toEqual([36, 44, 52]);
    const label = getComputedStyle(canvas.getByRole("button", { name: "Medium" }));
    await expect(label.textTransform).toBe("uppercase");
    await expect(label.fontFamily).toContain("Josefin Sans");
  },
};

/** A style as the browser resolves it, so a Token compares with what a Button draws. */
const resolveColour = (value: string) => {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

/** The settled fill and text of a Button, with any colour transition finished. */
const settled = (button: HTMLElement) => {
  for (const animation of button.getAnimations()) animation.finish();
  const style = getComputedStyle(button);
  return { fill: style.backgroundColor, text: style.color };
};

export const SecondaryTokens: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--kui-space-3)" }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const primary = canvas.getByRole("button", { name: "Primary" });
    const secondary = canvas.getByRole("button", { name: "Secondary" });
    const outline = canvas.getByRole("button", { name: "Outline" });
    const before = { primary: settled(primary), outline: settled(outline) };

    // A Consumer moves the secondary Button alone through its own fill and text. The values are
    // read before the override is removed, so a failed assertion never leaks into the next Story.
    // The hover fill is not read: a synthetic pointer never matches :hover.
    const root = document.documentElement.style;
    root.setProperty("--kui-secondary", "rgb(1, 2, 3)");
    root.setProperty("--kui-secondary-foreground", "rgb(4, 5, 6)");
    const overridden = settled(secondary);
    const others = { primary: settled(primary), outline: settled(outline) };
    root.removeProperty("--kui-secondary");
    root.removeProperty("--kui-secondary-foreground");

    await expect(overridden).toEqual({ fill: "rgb(1, 2, 3)", text: "rgb(4, 5, 6)" });
    await expect(others).toEqual(before);
    await expect(before.primary.fill).toBe(resolveColour("var(--kui-primary)"));
    await expect(before.outline.fill).toBe("rgba(0, 0, 0, 0)");
  },
};

export const WithIcons: Story = {
  args: { leadingIcon: <PlusIcon />, trailingIcon: <ArrowIcon />, children: "Add item" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Add item" })).toBeVisible();
  },
};

export const AsLink: Story = {
  args: { asChild: true, variant: "outline" },
  render: (args) => (
    <Button {...args}>
      <a href="#top">Go to top</a>
    </Button>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Go to top" })).toBeVisible();
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

const clicks: string[] = [];

export const AsLinkRunsTheChildHandlerFirst: Story = {
  args: {
    asChild: true,
    variant: "outline",
    onClick: fn((event: MouseEvent<HTMLButtonElement>) => {
      clicks.push("Button");
      // Following the link would navigate the test page away.
      event.preventDefault();
    }),
  },
  render: (args) => (
    <Button {...args}>
      <a href="#top" onClick={() => clicks.push("link")}>
        Go to top
      </a>
    </Button>
  ),
  play: async ({ canvas, userEvent }) => {
    clicks.length = 0;
    await userEvent.click(canvas.getByRole("link", { name: "Go to top" }));
    await expect(clicks).toEqual(["link", "Button"]);
  },
};

const preventingClick = fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());

export const AsLinkSkipsTheKitHandlerWhenTheChildPreventsDefault: Story = {
  args: { asChild: true, variant: "outline" },
  render: (args) => (
    <Button {...args}>
      <a href="#top" onClick={preventingClick}>
        Go to top
      </a>
    </Button>
  ),
  play: async ({ canvas, userEvent, args }) => {
    preventingClick.mockClear();
    await userEvent.click(canvas.getByRole("link", { name: "Go to top" }));
    await expect(preventingClick).toHaveBeenCalledTimes(1);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

const buttonRef = createRef<HTMLButtonElement>();
const linkRef = createRef<HTMLAnchorElement>();

export const AsLinkMergesClassNamesAndRefs: Story = {
  args: { asChild: true, variant: "secondary", className: "consumer-button" },
  render: (args) => (
    <Button {...args} ref={buttonRef}>
      <a href="#top" className="consumer-link" ref={linkRef}>
        Go to top
      </a>
    </Button>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Go to top" });
    await expect(link).toHaveClass("kui-button", "consumer-button", "consumer-link");
    await expect(link).toHaveAttribute("data-variant", "secondary");
    await expect(buttonRef.current).toBe(link);
    await expect(linkRef.current).toBe(link);
  },
};

export const AsLinkWithIcons: Story = {
  args: { asChild: true, leadingIcon: <PlusIcon />, trailingIcon: <ArrowIcon /> },
  render: (args) => (
    <Button {...args}>
      <a href="#top">Add item</a>
    </Button>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Add item" });
    await expect(link.querySelectorAll("svg")).toHaveLength(2);
    await expect(link).toHaveTextContent(/^Add item$/);
  },
};

export const AsLinkDisabled: Story = {
  args: { asChild: true, disabled: true },
  render: (args) => (
    <Button {...args}>
      <a href="#top">Go to top</a>
    </Button>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Go to top" });
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).not.toHaveAttribute("disabled");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Button" });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const KeyboardActivation: Story = {
  args: { children: "Press Enter or Space" },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Press Enter or Space" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};
