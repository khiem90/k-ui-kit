import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox, Select, TextField } from "../index";

/** The form on the Getting started page. Keep it in step with the code block there. */
function SignUpForm() {
  return (
    <form
      action="/sign-up"
      method="post"
      style={{ display: "grid", gap: "var(--kui-space-4)", maxWidth: "24rem" }}
    >
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <div style={{ display: "grid", gap: "var(--kui-space-1)" }}>
        <label htmlFor="plan">Plan</label>
        <Select.Root name="plan" defaultValue="free">
          <Select.Trigger id="plan" />
          <Select.Content>
            <Select.Item value="free">Free</Select.Item>
            <Select.Item value="team">Team</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <Checkbox name="terms" label="I agree to the terms" required />
      <Button type="submit">Create account</Button>
    </form>
  );
}

const meta = {
  title: "Examples/Sign-up form",
  component: SignUpForm,
  // The Getting started page shows it through a Canvas block, so it needs no sidebar entry and no
  // docs page of its own. It still runs as a test.
  tags: ["!dev", "!autodocs"],
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignUp: Story = {};
