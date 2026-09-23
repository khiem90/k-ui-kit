import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { useRef, useState } from "react";
import { Button, Tabs } from "../../index";

const meta = {
  title: "Components/Tabs",
  component: Tabs.Root,
  subcomponents: { List: Tabs.List, Trigger: Tabs.Trigger, Content: Tabs.Content },
  args: { defaultValue: "profile", onValueChange: fn() },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List aria-label="Account settings">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="profile">Update your name and photo.</Tabs.Content>
      <Tabs.Content value="security">Change your password and two-factor settings.</Tabs.Content>
      <Tabs.Content value="billing">Manage your plan and payment method.</Tabs.Content>
    </Tabs.Root>
  ),
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("tablist", { name: "Account settings" })).toBeVisible();
    const profile = canvas.getByRole("tab", { name: "Profile" });
    const security = canvas.getByRole("tab", { name: "Security" });
    const billing = canvas.getByRole("tab", { name: "Billing" });
    await expect(profile).toHaveAttribute("aria-selected", "true");
    await expect(profile).toHaveAttribute("data-state", "active");
    await expect(security).toHaveAttribute("data-state", "inactive");
    const profilePanel = canvas.getByRole("tabpanel", { name: "Profile" });
    await expect(profilePanel).toBeVisible();
    await expect(profilePanel).toHaveTextContent("Update your name and photo.");
    await expect(profilePanel).toHaveAttribute("data-state", "active");
    await expect(
      canvas.queryByText("Change your password and two-factor settings."),
    ).not.toBeInTheDocument();
    await userEvent.tab();
    await expect(profile).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(security).toHaveFocus();
    await expect(security).toHaveAttribute("aria-selected", "true");
    await expect(profile).toHaveAttribute("aria-selected", "false");
    await expect(canvas.getByRole("tabpanel", { name: "Security" })).toBeVisible();
    await expect(canvas.queryByText("Update your name and photo.")).not.toBeInTheDocument();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("security");
    await userEvent.keyboard("{ArrowRight}");
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Billing" })).toBeVisible();
    await userEvent.keyboard("{ArrowRight}");
    await expect(profile).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Home}");
    await expect(profile).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{End}");
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await expect(billing).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenCalledTimes(6);
    await userEvent.click(security);
    await expect(security).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Security" })).toBeVisible();
    await expect(args.onValueChange).toHaveBeenCalledTimes(7);
  },
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List aria-label="Account settings">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="security" disabled>
          Security
        </Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="profile">Update your name and photo.</Tabs.Content>
      <Tabs.Content value="security">Change your password and two-factor settings.</Tabs.Content>
      <Tabs.Content value="billing">Manage your plan and payment method.</Tabs.Content>
    </Tabs.Root>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const profile = canvas.getByRole("tab", { name: "Profile" });
    const security = canvas.getByRole("tab", { name: "Security" });
    const billing = canvas.getByRole("tab", { name: "Billing" });
    await expect(security).toBeDisabled();
    await expect(security).toHaveAttribute("data-disabled", "");
    await userEvent.tab();
    await expect(profile).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(billing).toHaveFocus();
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Billing" })).toBeVisible();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(profile).toHaveFocus();
    await expect(profile).toHaveAttribute("aria-selected", "true");
    await userEvent.click(security);
    await expect(security).toHaveAttribute("aria-selected", "false");
    await expect(profile).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.queryByText("Change your password and two-factor settings."),
    ).not.toBeInTheDocument();
    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvas, userEvent, args }) => {
    const list = canvas.getByRole("tablist", { name: "Account settings" });
    await expect(list).toHaveAttribute("aria-orientation", "vertical");
    const profile = canvas.getByRole("tab", { name: "Profile" });
    const security = canvas.getByRole("tab", { name: "Security" });
    const billing = canvas.getByRole("tab", { name: "Billing" });
    // The stylesheet keys the vertical layout on data-orientation, so every part must carry it.
    await expect(list.parentElement).toHaveAttribute("data-orientation", "vertical");
    await expect(list).toHaveAttribute("data-orientation", "vertical");
    await expect(profile).toHaveAttribute("data-orientation", "vertical");
    await expect(canvas.getByRole("tabpanel", { name: "Profile" })).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    await userEvent.tab();
    await expect(profile).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(security).toHaveFocus();
    await expect(security).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Security" })).toBeVisible();
    await userEvent.keyboard("{ArrowDown}");
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowUp}");
    await expect(security).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(security).toHaveFocus();
    await expect(security).toHaveAttribute("aria-selected", "true");
    await expect(args.onValueChange).toHaveBeenCalledTimes(3);
  },
};

const AccountSettings = () => {
  const [section, setSection] = useState("profile");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Tabs.Root value={section} onValueChange={setSection} style={{ justifySelf: "stretch" }}>
        <Tabs.List aria-label="Account settings">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">Update your name and photo.</Tabs.Content>
        <Tabs.Content value="security">Change your password and two-factor settings.</Tabs.Content>
        <Tabs.Content value="billing">Manage your plan and payment method.</Tabs.Content>
      </Tabs.Root>
      <Button variant="outline" onClick={() => setSection("billing")}>
        Go to billing
      </Button>
      <output>Showing {section}</output>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <AccountSettings />,
  play: async ({ canvas, userEvent }) => {
    const profile = canvas.getByRole("tab", { name: "Profile" });
    const security = canvas.getByRole("tab", { name: "Security" });
    const billing = canvas.getByRole("tab", { name: "Billing" });
    await expect(profile).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("Showing profile")).toBeVisible();
    await userEvent.tab();
    await expect(profile).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(security).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Security" })).toBeVisible();
    await expect(canvas.getByText("Showing security")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Go to billing" }));
    await expect(billing).toHaveAttribute("aria-selected", "true");
    await expect(security).toHaveAttribute("aria-selected", "false");
    await expect(canvas.getByRole("tabpanel", { name: "Billing" })).toBeVisible();
    await expect(canvas.getByText("Showing billing")).toBeVisible();
  },
};

const TabsBetweenButtons = () => (
  <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
    <Button variant="outline">Before</Button>
    <Tabs.Root defaultValue="profile" style={{ justifySelf: "stretch" }}>
      <Tabs.List aria-label="Account settings">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="profile">
        <p style={{ marginBlockStart: 0 }}>Update your name and photo.</p>
        <Button variant="outline">Edit profile</Button>
      </Tabs.Content>
      <Tabs.Content value="security">
        <p style={{ marginBlockStart: 0 }}>Change your password and two-factor settings.</p>
        <Button variant="outline">Change password</Button>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <p style={{ marginBlockStart: 0 }}>Manage your plan and payment method.</p>
        <Button variant="outline">Update card</Button>
      </Tabs.Content>
    </Tabs.Root>
    <Button variant="outline">After</Button>
  </div>
);

export const ActivePanelInTabOrder: Story = {
  render: () => <TabsBetweenButtons />,
  play: async ({ canvas, userEvent }) => {
    const before = canvas.getByRole("button", { name: "Before" });
    const profile = canvas.getByRole("tab", { name: "Profile" });
    const panel = canvas.getByRole("tabpanel", { name: "Profile" });
    const editProfile = canvas.getByRole("button", { name: "Edit profile" });
    const after = canvas.getByRole("button", { name: "After" });
    await expect(canvas.queryByRole("button", { name: "Change password" })).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Update card" })).not.toBeInTheDocument();
    await userEvent.tab();
    await expect(before).toHaveFocus();
    await userEvent.tab();
    await expect(profile).toHaveFocus();
    await userEvent.tab();
    await expect(panel).toHaveFocus();
    await userEvent.tab();
    await expect(editProfile).toHaveFocus();
    await userEvent.tab();
    await expect(after).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(editProfile).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(panel).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(profile).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(before).toHaveFocus();
  },
};

const TabsWithRefs = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Tabs.Root
        ref={rootRef}
        className="account"
        defaultValue="profile"
        data-part="root"
        style={{ justifySelf: "stretch" }}
      >
        <Tabs.List ref={listRef} className="account__list" aria-label="Account settings">
          <Tabs.Trigger className="account__tab" value="profile">
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger ref={triggerRef} className="account__tab" value="security" data-part="tab">
            Security
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="account__panel" value="profile">
          Update your name and photo.
        </Tabs.Content>
        <Tabs.Content
          ref={contentRef}
          className="account__panel"
          value="security"
          data-part="panel"
        >
          Change your password and two-factor settings.
        </Tabs.Content>
      </Tabs.Root>
      <Button
        variant="outline"
        onClick={() => {
          triggerRef.current?.focus();
          setReport(
            `${triggerRef.current?.textContent} tab in ${listRef.current?.getAttribute("aria-label")}, ${rootRef.current?.dataset.orientation} root, panel ${contentRef.current?.id}`,
          );
        }}
      >
        Focus the Security tab
      </Button>
      <output>Focused: {report}</output>
    </div>
  );
};

export const FocusThroughRef: Story = {
  render: () => <TabsWithRefs />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const security = canvas.getByRole("tab", { name: "Security" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus the Security tab" }));
    await expect(security).toHaveFocus();
    await expect(security).toHaveAttribute("aria-selected", "true");
    const panel = canvas.getByRole("tabpanel", { name: "Security" });
    await expect(panel).toBeVisible();
    await expect(
      canvas.getByText(
        `Focused: Security tab in Account settings, horizontal root, panel ${panel.id}`,
      ),
    ).toBeVisible();
    const root = canvasElement.querySelector(".account");
    await expect(root).toHaveClass("kui-tabs", "account");
    await expect(root).toHaveAttribute("data-part", "root");
    await expect(root).toContainElement(security);
    const list = canvasElement.querySelector(".account__list");
    await expect(list).toBe(canvas.getByRole("tablist", { name: "Account settings" }));
    await expect(list).toHaveClass("kui-tabs__list");
    await expect(security).toHaveClass("kui-tabs__trigger", "account__tab");
    await expect(security).toHaveAttribute("data-part", "tab");
    await expect(panel).toHaveClass("kui-tabs__content", "account__panel");
    await expect(panel).toHaveAttribute("data-part", "panel");
  },
};
