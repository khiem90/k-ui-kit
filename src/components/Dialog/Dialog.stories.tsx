import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { useRef, useState, type CSSProperties } from "react";
import { Button, Dialog, TextField } from "../../index";

/** The dialog renders in a portal at the end of body, outside the Story's canvas. */
const findDialog = () => within(document.body).findByRole("dialog", {}, { timeout: 2000 });
const queryDialog = () => within(document.body).queryByRole("dialog");

/** The overlay carries no role. A Consumer styles it through this class, so a test names it the same way. */
const getOverlay = () => {
  const overlay = document.body.querySelector<HTMLElement>(".kui-dialog__overlay");
  if (!overlay) throw new Error("The overlay is not in the document.");
  return overlay;
};

/** Radix moves focus a frame after the dialog mounts, and returns it after the close animation. */
const expectFocus = async (element: HTMLElement) => {
  await waitFor(() => expect(element).toHaveFocus());
};

/** Every way of dismissing the dialog ends the same way. */
const expectDismissed = async (trigger: HTMLElement) => {
  await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
  await expectFocus(trigger);
};

const meta = {
  title: "Components/Dialog",
  component: Dialog.Root,
  subcomponents: {
    Trigger: Dialog.Trigger,
    Content: Dialog.Content,
    Title: Dialog.Title,
    Description: Dialog.Description,
    Close: Dialog.Close,
  },
  args: { onOpenChange: fn() },
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger>
        <Button variant="danger">Delete file</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete report.pdf?</Dialog.Title>
        <Dialog.Description>
          The file goes for everyone with access to it, and this cannot be undone.
        </Dialog.Description>
        <div
          style={{
            display: "flex",
            gap: "var(--kui-space-2)",
            justifyContent: "flex-end",
            marginBlockStart: "var(--kui-space-6)",
          }}
        >
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button variant="danger">Delete</Button>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  ),
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Delete file" });
    await expect(queryDialog()).not.toBeInTheDocument();
    await expect(trigger).toHaveAttribute("data-state", "closed");

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    const dialog = await findDialog();
    const parts = within(dialog);
    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(trigger).toHaveAttribute("data-state", "open");
    await expect(dialog).toHaveAccessibleName("Delete report.pdf?");
    await expect(dialog).toHaveAccessibleDescription(
      "The file goes for everyone with access to it, and this cannot be undone.",
    );
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);

    const cancel = parts.getByRole("button", { name: "Cancel" });
    const remove = parts.getByRole("button", { name: "Delete" });
    const close = parts.getByRole("button", { name: "Close" });
    await expectFocus(cancel);

    await userEvent.tab();
    await expect(remove).toHaveFocus();
    await userEvent.tab();
    await expect(close).toHaveFocus();
    // Tab off the last control and focus wraps, never landing on the trigger behind.
    await userEvent.tab();
    await expect(cancel).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(close).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expectDismissed(trigger);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
    await expect(trigger).toHaveAttribute("data-state", "closed");
  },
};

export const ClosesOnOverlayClick: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Delete file" });
    await userEvent.click(trigger);
    await findDialog();
    await userEvent.click(getOverlay());
    await expectDismissed(trigger);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

export const ClosesOnCloseButton: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button", { name: "Delete file" });
    await userEvent.click(trigger);
    const dialog = await findDialog();
    const close = within(dialog).getByRole("button", { name: "Close" });
    // The icon is hidden from assistive technology, so the button's name comes from the kit.
    await expect(close).toHaveAccessibleName("Close");
    await userEvent.click(close);
    await expectDismissed(trigger);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

const RenameFile = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("report.pdf");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="outline">Rename</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Rename file</Dialog.Title>
          <Dialog.Description>
            Give it a name the rest of the team will recognise.
          </Dialog.Description>
          <form
            style={{
              display: "grid",
              gap: "var(--kui-space-4)",
              marginBlockStart: "var(--kui-space-4)",
            }}
            onSubmit={(event) => {
              event.preventDefault();
              setName(String(new FormData(event.currentTarget).get("filename")));
              setOpen(false);
            }}
          >
            <TextField label="File name" name="filename" defaultValue={name} />
            <div style={{ display: "flex", gap: "var(--kui-space-2)", justifyContent: "flex-end" }}>
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">Save</Button>
            </div>
          </form>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
      <output>The file is called {name}</output>
    </div>
  );
};

export const WithForm: Story = {
  render: () => <RenameFile />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Rename" });
    await expect(canvas.getByText("The file is called report.pdf")).toBeVisible();
    await userEvent.click(trigger);

    const dialog = await findDialog();
    const input = within(dialog).getByRole("textbox", { name: "File name" });
    // Focus lands on the first control in the panel, which in a form dialog is the first field.
    await expectFocus(input);
    await userEvent.clear(input);
    await userEvent.type(input, "budget.xlsx");
    await userEvent.keyboard("{Enter}");
    await expectDismissed(trigger);
    await expect(canvas.getByText("The file is called budget.xlsx")).toBeVisible();

    await userEvent.click(trigger);
    const reopened = await findDialog();
    const cancel = within(reopened).getByRole("button", { name: "Cancel" });
    await expect(cancel).toHaveAttribute("type", "button");
    await userEvent.click(cancel);
    await expectDismissed(trigger);
    await expect(canvas.getByText("The file is called budget.xlsx")).toBeVisible();
  },
};

const lastClause =
  "This agreement is updated in place, and the date at the top records the last change.";

const clauses = [
  "You keep the rights to everything you upload, and we keep the rights to the service itself.",
  "We store your files in the region you pick when you create the workspace.",
  "Either side can end the agreement with thirty days of notice, in writing.",
  "We publish a notice at least a week before a price change takes effect.",
  "Support answers within one business day on weekdays.",
  "We may suspend an account that is used to send unsolicited mail.",
  "Backups are kept for ninety days and then deleted for good.",
  "You are responsible for anything done with your own API keys.",
  "We do not sell your data, and we never have.",
  "Disputes are settled in the courts of the state the company is registered in.",
  "Each workspace owner names one billing contact, and invoices go to that address.",
  "Trials run for fourteen days and end without a charge unless you add a card.",
  "An account that has been idle for a year gets an email before anything is archived.",
  "You can export every file you have uploaded, at any time, in its original format.",
  "We report a security incident that touches your data within seventy-two hours.",
  "Seats can be added mid-cycle, and the next invoice is prorated to the day.",
  "The service is offered as it is, with the availability target in the appendix.",
  "We keep audit logs for a year so you can see who opened what, and when.",
  "Third-party integrations you switch on are governed by their own terms as well.",
  lastClause,
];

export const LongBody: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", minBlockSize: "150vh" }}>
      <p style={{ margin: 0 }}>This page is taller than the window, so it scrolls on its own.</p>
      <Dialog.Root {...args}>
        <Dialog.Trigger>
          <Button variant="outline">Read the terms</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Terms of service</Dialog.Title>
          <Dialog.Description>The short version of what we agree to.</Dialog.Description>
          {clauses.map((clause) => (
            <p key={clause}>{clause}</p>
          ))}
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const dialog = await findDialog();
    // defaultOpen opens the panel without reporting a change.
    await expect(args.onOpenChange).not.toHaveBeenCalled();
    // Everything behind an open dialog leaves the accessibility tree, the trigger included, so
    // the role query only finds it with hidden elements included.
    await expect(canvas.queryByRole("button", { name: "Read the terms" })).not.toBeInTheDocument();
    const trigger = canvas.getByRole("button", { name: "Read the terms", hidden: true });
    await expect(trigger).toHaveAttribute("data-state", "open");

    const close = within(dialog).getByRole("button", { name: "Close" });
    const end = within(dialog).getByText(lastClause);
    // The panel scales as it opens, so it has to settle before anything is measured against it.
    await waitFor(() => expect(dialog.getAnimations()).toHaveLength(0));
    const closeTop = close.getBoundingClientRect().top;
    const endTop = end.getBoundingClientRect().top;

    // The page behind the dialog is locked. The lock shows as the body's own overflow, since a
    // Story has no way to raise the trusted wheel or key event a user would scroll the page with.
    await expect(getComputedStyle(document.body).overflow).toBe("hidden");

    // Reading to the end leaves the close button in the corner, where it can still be clicked.
    end.scrollIntoView();
    await waitFor(() => expect(end.getBoundingClientRect().top).toBeLessThan(endTop));
    await expect(close.getBoundingClientRect().top).toBe(closeTop);
    await userEvent.click(close);
    await expectDismissed(trigger);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(getComputedStyle(document.body).overflow).not.toBe("hidden");
  },
};

/** The kit ships no class for this, so a Consumer applies their own, here inline. */
const visuallyHidden: CSSProperties = {
  position: "absolute",
  inlineSize: 1,
  blockSize: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

export const VisuallyHiddenTitle: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger>
        <Button variant="outline">Share</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        {/* The field below says what this dialog is for, so the heading would only repeat it. */}
        <Dialog.Title style={visuallyHidden}>Share this document</Dialog.Title>
        <Dialog.Description>Anyone with the link can read the document.</Dialog.Description>
        <div
          style={{
            display: "flex",
            gap: "var(--kui-space-2)",
            alignItems: "flex-end",
            marginBlockStart: "var(--kui-space-4)",
          }}
        >
          <TextField
            label="Link"
            readOnly
            defaultValue="https://example.com/d/8fc1"
            style={{ inlineSize: "100%" }}
          />
          <Button>Copy</Button>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async () => {
    const dialog = await findDialog();
    const title = within(dialog).getByRole("heading", { name: "Share this document" });
    await expect(dialog).toHaveAccessibleName("Share this document");
    const box = title.getBoundingClientRect();
    await expect(box.width).toBeLessThanOrEqual(1);
    await expect(box.height).toBeLessThanOrEqual(1);
    await expect(within(dialog).getByRole("textbox", { name: "Link" })).toBeVisible();
  },
};

const LeavePage = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("still here");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="outline">Leave the page</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Leave without saving?</Dialog.Title>
          <Dialog.Description>Your draft has changes that are not saved yet.</Dialog.Description>
          <div
            style={{
              display: "flex",
              gap: "var(--kui-space-2)",
              justifyContent: "flex-end",
              marginBlockStart: "var(--kui-space-6)",
            }}
          >
            <Dialog.Close asChild>
              <Button variant="outline">Keep editing</Button>
            </Dialog.Close>
            {/* Closing from the app's own code, rather than through a Close part. */}
            <Button
              variant="danger"
              onClick={() => {
                setDraft("thrown away");
                setOpen(false);
              }}
            >
              Leave
            </Button>
          </div>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
      <output>
        The dialog is {open ? "open" : "closed"} and the draft is {draft}
      </output>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <LeavePage />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Leave the page" });
    await expect(
      canvas.getByText("The dialog is closed and the draft is still here"),
    ).toBeVisible();

    await userEvent.click(trigger);
    await findDialog();
    await expect(canvas.getByText("The dialog is open and the draft is still here")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expectDismissed(trigger);
    await expect(
      canvas.getByText("The dialog is closed and the draft is still here"),
    ).toBeVisible();

    // Closing from the app returns focus to the trigger, the same as Escape and the Close parts.
    await userEvent.click(trigger);
    const reopened = await findDialog();
    await userEvent.click(within(reopened).getByRole("button", { name: "Leave" }));
    await expectDismissed(trigger);
    await expect(
      canvas.getByText("The dialog is closed and the draft is thrown away"),
    ).toBeVisible();
  },
};

const ShareWithRefs = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [report, setReport] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <Dialog.Root>
        <Dialog.Trigger ref={triggerRef} className="share__trigger" data-part="trigger">
          <Button variant="outline">Share</Button>
        </Dialog.Trigger>
        <Dialog.Content ref={contentRef} className="share" data-part="content">
          <Dialog.Title ref={titleRef} className="share__title" data-part="title">
            Share this document
          </Dialog.Title>
          <Dialog.Description
            ref={descriptionRef}
            className="share__description"
            data-part="description"
          >
            Anyone with the link can read the document.
          </Dialog.Description>
          <Button
            style={{ marginBlockStart: "var(--kui-space-6)" }}
            onClick={() => {
              closeRef.current?.focus();
              setReport(
                `${triggerRef.current?.dataset.state} from ${contentRef.current?.getAttribute("role")}, ${titleRef.current?.tagName} title, ${descriptionRef.current?.tagName} description, ${closeRef.current?.getAttribute("aria-label")} button`,
              );
            }}
          >
            Report the parts
          </Button>
          <Dialog.Close ref={closeRef} className="share__close" data-part="close" />
        </Dialog.Content>
      </Dialog.Root>
      <output>Parts: {report}</output>
    </div>
  );
};

export const PartsThroughRefs: Story = {
  render: () => <ShareWithRefs />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Share" });
    // The Trigger part passes its class name and rest props to the element it is given.
    await expect(trigger).toHaveClass("kui-button", "share__trigger");
    await expect(trigger).toHaveAttribute("data-part", "trigger");
    await userEvent.click(trigger);

    const dialog = await findDialog();
    const parts = within(dialog);
    await expect(dialog).toHaveClass("kui-dialog", "share");
    await expect(dialog).toHaveAttribute("data-part", "content");
    const title = parts.getByRole("heading", { name: "Share this document" });
    await expect(title).toHaveClass("kui-dialog__title", "share__title");
    await expect(title).toHaveAttribute("data-part", "title");
    const description = parts.getByText("Anyone with the link can read the document.");
    await expect(description).toHaveClass("kui-dialog__description", "share__description");
    await expect(description).toHaveAttribute("data-part", "description");
    const close = parts.getByRole("button", { name: "Close" });
    await expect(close).toHaveClass("kui-dialog__close", "share__close");
    await expect(close).toHaveAttribute("data-part", "close");

    await userEvent.click(parts.getByRole("button", { name: "Report the parts" }));
    await expect(close).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expectDismissed(trigger);
    await expect(
      canvas.getByText("Parts: open from dialog, H2 title, P description, Close button"),
    ).toBeVisible();
  },
};
