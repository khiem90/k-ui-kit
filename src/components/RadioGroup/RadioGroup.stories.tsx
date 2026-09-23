import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { useRef, useState } from "react";
import { Button, RadioGroup, type RadioGroupRootProps } from "../../index";

/**
 * Radix selects the item an arrow key moves focus to, but only while the key is still down. The
 * focus move is a zero-delay timer, and user-event releases a key in the same task it presses it,
 * so the key is held across the timer here the way a finger holds it.
 */
const pressArrow = async (
  userEvent: { keyboard: (text: string) => Promise<void> },
  key: string,
) => {
  await userEvent.keyboard(`{${key}>}`);
  await userEvent.keyboard(`{/${key}}`);
};

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup.Root,
  subcomponents: { Item: RadioGroup.Item, Label: RadioGroup.Label },
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Label>Contact method</RadioGroup.Label>
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="sms" label="Text message" />
      <RadioGroup.Item value="phone" label="Phone call" />
    </RadioGroup.Root>
  ),
} satisfies Meta<typeof RadioGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Contact method" })).toBeVisible();
    const email = canvas.getByRole("radio", { name: "Email" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    const phone = canvas.getByRole("radio", { name: "Phone call" });
    await expect(email).not.toBeChecked();
    await expect(sms).not.toBeChecked();
    await expect(phone).not.toBeChecked();
    await userEvent.tab();
    await expect(email).toHaveFocus();
    await expect(email).not.toBeChecked();
    await pressArrow(userEvent, "ArrowDown");
    await expect(sms).toHaveFocus();
    await expect(sms).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("sms");
    await pressArrow(userEvent, "ArrowDown");
    await expect(phone).toBeChecked();
    await pressArrow(userEvent, "ArrowDown");
    await expect(email).toBeChecked();
    await pressArrow(userEvent, "ArrowUp");
    await expect(phone).toBeChecked();
    await pressArrow(userEvent, "ArrowRight");
    await expect(email).toBeChecked();
    await pressArrow(userEvent, "ArrowLeft");
    await expect(phone).toBeChecked();
    await expect(phone).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenCalledTimes(6);
  },
};

export const Selected: Story = {
  args: { defaultValue: "sms" },
  play: async ({ canvas, userEvent, args }) => {
    const sms = canvas.getByRole("radio", { name: "Text message" });
    const phone = canvas.getByRole("radio", { name: "Phone call" });
    await expect(sms).toBeChecked();
    await userEvent.tab();
    await expect(sms).toHaveFocus();
    await userEvent.click(phone);
    await expect(phone).toBeChecked();
    await expect(sms).not.toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith("phone");
  },
};

export const LabelSelects: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const sms = canvas.getByRole("radio", { name: "Text message" });
    await userEvent.click(canvas.getByText("Text message"));
    await expect(sms).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith("sms");
  },
};

const GroupBetweenButtons = () => (
  <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
    <Button variant="outline">Before</Button>
    <RadioGroup.Root defaultValue="sms">
      <RadioGroup.Label>Contact method</RadioGroup.Label>
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="sms" label="Text message" />
      <RadioGroup.Item value="phone" label="Phone call" />
    </RadioGroup.Root>
    <Button variant="outline">After</Button>
  </div>
);

export const SingleTabStop: Story = {
  render: () => <GroupBetweenButtons />,
  play: async ({ canvas, userEvent }) => {
    const before = canvas.getByRole("button", { name: "Before" });
    const after = canvas.getByRole("button", { name: "After" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    await userEvent.tab();
    await expect(before).toHaveFocus();
    await userEvent.tab();
    await expect(sms).toHaveFocus();
    await userEvent.tab();
    await expect(after).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(sms).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(before).toHaveFocus();
  },
};

export const WithDisabledItem: Story = {
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Label>Contact method</RadioGroup.Label>
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="sms" label="Text message" disabled />
      <RadioGroup.Item value="phone" label="Phone call" />
    </RadioGroup.Root>
  ),
  play: async ({ canvas, userEvent, args }) => {
    const email = canvas.getByRole("radio", { name: "Email" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    const phone = canvas.getByRole("radio", { name: "Phone call" });
    await expect(sms).toBeDisabled();
    await userEvent.tab();
    await expect(email).toHaveFocus();
    await pressArrow(userEvent, "ArrowDown");
    await expect(phone).toHaveFocus();
    await expect(phone).toBeChecked();
    await userEvent.click(canvas.getByText("Text message"));
    await userEvent.click(sms);
    await expect(sms).not.toBeChecked();
    await expect(phone).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
  },
};

export const DisabledGroup: Story = {
  args: { disabled: true, defaultValue: "email" },
  play: async ({ canvas, userEvent, args }) => {
    const email = canvas.getByRole("radio", { name: "Email" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    await expect(email).toBeDisabled();
    await expect(email).toBeChecked();
    await expect(sms).toBeDisabled();
    await userEvent.tab();
    await expect(email).not.toHaveFocus();
    await expect(sms).not.toHaveFocus();
    await userEvent.click(canvas.getByText("Text message"));
    await expect(sms).not.toBeChecked();
    await expect(email).toBeChecked();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  play: async ({ canvas, userEvent, args }) => {
    const group = canvas.getByRole("radiogroup", { name: "Contact method" });
    await expect(group).toHaveAttribute("aria-orientation", "horizontal");
    const email = canvas.getByRole("radio", { name: "Email" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    const phone = canvas.getByRole("radio", { name: "Phone call" });
    await userEvent.tab();
    await expect(email).toHaveFocus();
    await pressArrow(userEvent, "ArrowRight");
    await expect(sms).toBeChecked();
    await pressArrow(userEvent, "ArrowDown");
    await expect(phone).toBeChecked();
    await pressArrow(userEvent, "ArrowLeft");
    await expect(sms).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledTimes(3);
  },
};

export const NamedByAriaLabel: Story = {
  render: (args) => (
    <RadioGroup.Root aria-label="Contact method" {...args}>
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="sms" label="Text message" />
      <RadioGroup.Item value="phone" label="Phone call" />
    </RadioGroup.Root>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup", { name: "Contact method" });
    await expect(group).not.toHaveAttribute("aria-labelledby");
  },
};

const ContactPreference = () => {
  const [method, setMethod] = useState("email");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <RadioGroup.Root value={method} onValueChange={setMethod}>
        <RadioGroup.Label>Contact method</RadioGroup.Label>
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="sms" label="Text message" />
        <RadioGroup.Item value="phone" label="Phone call" />
      </RadioGroup.Root>
      <Button variant="outline" onClick={() => setMethod("phone")}>
        Prefer phone
      </Button>
      <output>We will reach you by {method}</output>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ContactPreference />,
  play: async ({ canvas, userEvent }) => {
    const email = canvas.getByRole("radio", { name: "Email" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    const phone = canvas.getByRole("radio", { name: "Phone call" });
    await expect(email).toBeChecked();
    await expect(canvas.getByText("We will reach you by email")).toBeVisible();
    await userEvent.tab();
    await expect(email).toHaveFocus();
    await pressArrow(userEvent, "ArrowDown");
    await expect(sms).toBeChecked();
    await expect(canvas.getByText("We will reach you by sms")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Prefer phone" }));
    await expect(phone).toBeChecked();
    await expect(sms).not.toBeChecked();
    await expect(canvas.getByText("We will reach you by phone")).toBeVisible();
  },
};

const RadioGroupWithRefs = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const itemRef = useRef<HTMLButtonElement>(null);
  const [report, setReport] = useState("nothing yet");
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}>
      <RadioGroup.Root ref={rootRef} className="contact-method">
        <RadioGroup.Label ref={labelRef} className="contact-method__label" data-part="label">
          Contact method
        </RadioGroup.Label>
        <RadioGroup.Item
          ref={itemRef}
          className="contact-method__item"
          value="email"
          label="Email"
          onFocus={() =>
            setReport(
              `${rootRef.current?.getAttribute("role")} named ${labelRef.current?.textContent}`,
            )
          }
        />
        <RadioGroup.Item value="sms" label="Text message" />
      </RadioGroup.Root>
      <Button variant="outline" onClick={() => itemRef.current?.focus()}>
        Focus the first item
      </Button>
      <output>Focused: {report}</output>
    </div>
  );
};

export const FocusThroughRef: Story = {
  render: () => <RadioGroupWithRefs />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const email = canvas.getByRole("radio", { name: "Email" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus the first item" }));
    await expect(email).toHaveFocus();
    await expect(canvas.getByText("Focused: radiogroup named Contact method")).toBeVisible();
    const root = canvasElement.querySelector(".contact-method");
    await expect(root).toBe(canvas.getByRole("radiogroup", { name: "Contact method" }));
    const label = canvasElement.querySelector(".contact-method__label");
    await expect(label).toHaveTextContent("Contact method");
    await expect(label).toHaveAttribute("data-part", "label");
    const item = canvasElement.querySelector(".contact-method__item");
    await expect(item).toContainElement(email);
    await expect(item).toContainElement(canvas.getByText("Email"));
  },
};

const ContactForm = (props: Omit<RadioGroupRootProps, "name" | "children">) => {
  const [submitted, setSubmitted] = useState("nothing yet");
  return (
    <form
      style={{ display: "grid", gap: "var(--kui-space-4)", justifyItems: "start" }}
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("contact");
        setSubmitted(typeof value === "string" ? value : "no contact field");
      }}
    >
      <RadioGroup.Root name="contact" {...props}>
        <RadioGroup.Label>Contact method</RadioGroup.Label>
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="sms" label="Text message" />
      </RadioGroup.Root>
      <div style={{ display: "flex", gap: "var(--kui-space-2)" }}>
        <Button type="submit" variant="outline">
          Save
        </Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
      <output>Submitted: {submitted}</output>
    </form>
  );
};

export const InForm: Story = {
  render: () => <ContactForm />,
  play: async ({ canvas, userEvent }) => {
    const submit = canvas.getByRole("button", { name: "Save" });
    const sms = canvas.getByRole("radio", { name: "Text message" });
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: no contact field")).toBeVisible();
    await userEvent.click(sms);
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: sms")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(sms).not.toBeChecked();
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: no contact field")).toBeVisible();
  },
};

export const Required: Story = {
  render: () => <ContactForm required />,
  play: async ({ canvas, userEvent }) => {
    const group = canvas.getByRole("radiogroup", { name: "Contact method" });
    await expect(group).toHaveAttribute("aria-required", "true");
    const submit = canvas.getByRole("button", { name: "Save" });
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: nothing yet")).toBeVisible();
    await userEvent.click(canvas.getByRole("radio", { name: "Email" }));
    await userEvent.click(submit);
    await expect(canvas.getByText("Submitted: email")).toBeVisible();
  },
};
