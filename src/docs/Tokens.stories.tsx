import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  Button,
  Checkbox,
  DataTable,
  Dialog,
  RadioGroup,
  Select,
  Tabs,
  TextField,
  type ColumnDef,
} from "../index";
import { contrast, isTransparentIn, toRGB, tokenColour } from "./contrast";

const colours = [
  "--kui-background",
  "--kui-surface-raised",
  "--kui-surface-stripe",
  "--kui-surface-track",
  "--kui-tint",
  "--kui-foreground",
  "--kui-foreground-muted",
  "--kui-foreground-display",
  "--kui-border",
  "--kui-primary",
  "--kui-primary-hover",
  "--kui-primary-foreground",
  "--kui-primary-on-tint",
  "--kui-secondary",
  "--kui-secondary-hover",
  "--kui-secondary-foreground",
  "--kui-tab",
  "--kui-tab-foreground",
  "--kui-danger",
  "--kui-danger-hover",
  "--kui-danger-foreground",
  "--kui-focus-ring",
  "--kui-focus-ring-on-tint",
  "--kui-overlay",
  "--kui-rail-color",
];
const shadows = [
  "--kui-shadow-rest",
  "--kui-shadow-track",
  "--kui-shadow-raised",
  "--kui-shadow-floating",
];
const radii = ["field", "button", "tab", "check", "row", "card", "pill", "arch"].map(
  (part) => `--kui-radius-${part}`,
);
const widths = ["--kui-border-width-field", "--kui-rail-width"];
const spaces = [1, 2, 3, 4, 5, 6, 7, 8].map((step) => `--kui-space-${step}`);
const paddings = ["--kui-padding-field-inline"];
const fonts = ["--kui-font-display", "--kui-font-label", "--kui-font-body"];
const fontSizes = ["sm", "md", "lg", "display"].map((step) => `--kui-font-size-${step}`);
const labelStyle = ["--kui-label-case", "--kui-label-tracking", "--kui-label-weight"];

/** Every text pair the kit draws, as [text, background]. WCAG 1.4.3 asks 4.5:1. */
const textPairs: [string, string][] = [
  ["--kui-foreground", "--kui-background"],
  ["--kui-foreground", "--kui-surface-raised"],
  ["--kui-foreground", "--kui-tint"],
  // DataTable's striped rows.
  ["--kui-foreground", "--kui-surface-stripe"],
  ["--kui-foreground-muted", "--kui-background"],
  ["--kui-foreground-muted", "--kui-surface-raised"],
  ["--kui-foreground-muted", "--kui-tint"],
  ["--kui-primary-foreground", "--kui-primary"],
  ["--kui-primary-foreground", "--kui-primary-hover"],
  // The secondary Button at rest and hovered.
  ["--kui-secondary-foreground", "--kui-secondary"],
  ["--kui-secondary-foreground", "--kui-secondary-hover"],
  ["--kui-danger-foreground", "--kui-danger"],
  ["--kui-danger-foreground", "--kui-danger-hover"],
  ["--kui-danger", "--kui-background"],
  ["--kui-danger", "--kui-surface-raised"],
  // Tooltip: cream text on a Bark bubble.
  ["--kui-surface-raised", "--kui-foreground"],
  // Dialog: the display title on the panel.
  ["--kui-foreground-display", "--kui-surface-raised"],
];

/**
 * Text pairs whose background a Theme may leave transparent. A transparent fill draws nothing, so
 * the text sits on whatever is under it and the pair is skipped.
 */
const textPairsOnOptionalFill: [string, string][] = [
  // Tabs: an inactive tab's text on its own fill.
  ["--kui-tab-foreground", "--kui-tab"],
  // Tabs: an inactive tab's text on the track, where the tab itself is transparent.
  ["--kui-tab-foreground", "--kui-surface-track"],
  ["--kui-foreground", "--kui-surface-track"],
];

/** Every edge and indicator pair the kit draws, as [edge, background]. WCAG 1.4.11 asks 3:1. */
const edgePairs: [string, string][] = [
  ["--kui-border", "--kui-surface-raised"],
  // The off Switch track's edge on the page. The on track is primary on background, below.
  ["--kui-border", "--kui-background"],
  ["--kui-focus-ring", "--kui-background"],
  ["--kui-focus-ring", "--kui-surface-raised"],
  // A checked Checkbox is a filled Ember box on the page or on either row of a table body, with
  // the border and the focus ring around it.
  ["--kui-primary", "--kui-background"],
  ["--kui-primary", "--kui-surface-raised"],
  ["--kui-primary", "--kui-surface-stripe"],
  ["--kui-border", "--kui-surface-stripe"],
  ["--kui-focus-ring", "--kui-surface-stripe"],
  // A hovered or selected DataTable row is Peach sky, where Ember falls under 3:1. The row draws
  // its checked box and its focus ring in the on-tint Tokens instead. A highlighted Select option
  // is Peach sky too, and draws its check in primary on tint.
  ["--kui-primary-on-tint", "--kui-tint"],
  ["--kui-focus-ring-on-tint", "--kui-tint"],
  ["--kui-border", "--kui-tint"],
];

const label = (name: string) => name.replace("--kui-", "");

const sectionStyle: CSSProperties = { display: "grid", gap: "var(--kui-space-3)" };
const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
  gap: "var(--kui-space-4)",
};
const captionStyle: CSSProperties = { fontFamily: "monospace", fontSize: "0.875rem" };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontFamily: "var(--kui-font-display)", fontStyle: "italic" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ name, style }: { name: string; style: CSSProperties }) {
  return (
    <figure style={{ margin: 0, display: "grid", gap: "var(--kui-space-2)" }}>
      <div aria-hidden="true" style={{ blockSize: "4rem", ...style }} />
      <figcaption style={captionStyle}>{label(name)}</figcaption>
    </figure>
  );
}

function Pair({ text, background, edge }: { text: string; background: string; edge?: boolean }) {
  return (
    <div
      style={{
        padding: "var(--kui-space-3) var(--kui-space-4)",
        borderRadius: "var(--kui-radius-field)",
        background: `var(${background})`,
        color: edge ? "var(--kui-foreground)" : `var(${text})`,
        outline: edge ? `2px solid var(${text})` : undefined,
        outlineOffset: edge ? "-6px" : undefined,
        ...captionStyle,
      }}
    >
      {label(text)} on {label(background)}
    </div>
  );
}

/** The Ridgeline Tokens as swatches, plus every colour pair the kit draws. */
function TokenSheet() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--kui-space-6)",
        padding: "var(--kui-space-4)",
        color: "var(--kui-foreground)",
        fontFamily: "var(--kui-font-body)",
      }}
    >
      <Section title="Colour">
        <div style={gridStyle}>
          {colours.map((name) => (
            <Swatch
              key={name}
              name={name}
              style={{
                background: `var(${name})`,
                borderRadius: "var(--kui-radius-field)",
                boxShadow: "var(--kui-shadow-rest)",
              }}
            />
          ))}
        </div>
      </Section>
      <Section title="Colour pairs">
        <div style={gridStyle}>
          {textPairs.map(([text, background]) => (
            <Pair key={`${text} ${background}`} text={text} background={background} />
          ))}
          {edgePairs.map(([edge, background]) => (
            <Pair key={`${edge} ${background}`} text={edge} background={background} edge />
          ))}
        </div>
      </Section>
      <Section title="Shadow">
        <div style={gridStyle}>
          {shadows.map((name) => (
            <Swatch
              key={name}
              name={name}
              style={{
                background: "var(--kui-surface-raised)",
                borderRadius: "var(--kui-radius-card)",
                boxShadow: `var(${name})`,
              }}
            />
          ))}
        </div>
      </Section>
      <Section title="Radius">
        <div style={gridStyle}>
          {radii.map((name) => (
            // The Token goes straight into border-radius, since a radius Token may hold four
            // values and a function around it would reject them. The browser shrinks a radius
            // taller than the swatch, so pill and arch show as the swatch's full curve.
            <Swatch
              key={name}
              name={name}
              style={{ background: "var(--kui-tint)", borderRadius: `var(${name})` }}
            />
          ))}
        </div>
      </Section>
      <Section title="Border">
        <div style={gridStyle}>
          <Swatch
            name="--kui-border-width-field"
            style={{
              background: "var(--kui-surface-raised)",
              borderStyle: "solid",
              borderWidth: "var(--kui-border-width-field)",
              borderColor: "var(--kui-border)",
              borderRadius: "var(--kui-radius-field)",
            }}
          />
          <Swatch
            name="--kui-rail-width"
            style={{
              background: "var(--kui-surface-track)",
              borderBlockStart: "var(--kui-rail-width) solid var(--kui-rail-color)",
              borderRadius: "var(--kui-radius-tab)",
              boxShadow: "var(--kui-shadow-track)",
            }}
          />
        </div>
      </Section>
      <Section title="Spacing">
        <div style={{ display: "grid", gap: "var(--kui-space-2)" }}>
          {spaces.map((name) => (
            <div
              key={name}
              style={{ display: "flex", alignItems: "center", gap: "var(--kui-space-3)" }}
            >
              <span style={{ ...captionStyle, inlineSize: "5rem" }}>{label(name)}</span>
              <div
                aria-hidden="true"
                style={{
                  inlineSize: `var(${name})`,
                  blockSize: "var(--kui-space-4)",
                  background: "var(--kui-primary)",
                  borderRadius: "var(--kui-radius-pill)",
                }}
              />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Type">
        <div style={{ display: "grid", gap: "var(--kui-space-3)" }}>
          <p style={{ margin: 0, fontFamily: "var(--kui-font-display)", fontSize: "1.75rem" }}>
            <em>Weekend escape</em> in font-display
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--kui-font-label)",
              textTransform: "var(--kui-label-case)" as CSSProperties["textTransform"],
              letterSpacing: "var(--kui-label-tracking)",
            }}
          >
            Book a cabin in font-label
          </p>
          <p style={{ margin: 0 }}>Long text stays easy to read in font-body.</p>
        </div>
      </Section>
    </div>
  );
}

interface Guest {
  id: string;
  name: string;
}

const guestColumns: ColumnDef<Guest>[] = [{ accessorKey: "name", header: "Name" }];
const guests: Guest[] = [{ id: "g-1", name: "Lena Fischer" }];

/** Every part the kit sets in the label style, plus the two headings that share its weight. */
function LabelledParts() {
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", padding: "var(--kui-space-4)" }}>
      <Button>Save</Button>
      <TextField label="Email" />
      <RadioGroup.Root>
        <RadioGroup.Label>Contact method</RadioGroup.Label>
        <RadioGroup.Item value="post" label="Post" />
      </RadioGroup.Root>
      <Tabs.Root defaultValue="profile">
        <Tabs.List aria-label="Account settings">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">Update your name and photo.</Tabs.Content>
      </Tabs.Root>
      <Select.Root defaultValue="lemon">
        <Select.Trigger aria-label="Fruit" />
        <Select.Content>
          <Select.Group label="Citrus">
            <Select.Item value="lemon">Lemon</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <DataTable
        caption="Guests"
        columns={guestColumns}
        data={guests}
        getRowId={(row) => row.id}
        sortable
      />
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="outline">Open</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Weekend escape</Dialog.Title>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

/** Every part whose corners or edge have a shape role of their own. */
function ShapedParts() {
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", padding: "var(--kui-space-4)" }}>
      <Button>Save</Button>
      <TextField label="Email" />
      <Select.Root defaultValue="lemon">
        <Select.Trigger aria-label="Fruit" />
        <Select.Content>
          <Select.Item value="lemon">Lemon</Select.Item>
        </Select.Content>
      </Select.Root>
      <Checkbox label="Remember me" />
      <Tabs.Root defaultValue="profile">
        <Tabs.List aria-label="Account settings">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">Update your name and photo.</Tabs.Content>
      </Tabs.Root>
      <DataTable caption="Guests" columns={guestColumns} data={guests} getRowId={(row) => row.id} />
    </div>
  );
}

/** The two parts a Theme may hang a Rail on: a Tabs list and a Dialog. */
function RailedParts() {
  return (
    <div style={{ display: "grid", gap: "var(--kui-space-4)", padding: "var(--kui-space-4)" }}>
      <Tabs.Root defaultValue="profile">
        <Tabs.List aria-label="Account settings">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">Update your name and photo.</Tabs.Content>
        <Tabs.Content value="security">Change your password.</Tabs.Content>
      </Tabs.Root>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="outline">Open</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Weekend escape</Dialog.Title>
          <Dialog.Description>Two nights in a cabin by the lake.</Dialog.Description>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

/** Reads a Token off the root. An empty string means the Token is not defined. */
const tokenValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** The top edge of an element: the Rail, where a Theme draws one. */
const topEdge = (element: Element) => {
  const style = getComputedStyle(element);
  return { width: style.borderTopWidth, style: style.borderTopStyle, colour: style.borderTopColor };
};

/** An element's four corner radii, clockwise from the top left. */
const corners = (element: Element) => {
  const style = getComputedStyle(element);
  return [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomRightRadius,
    style.borderBottomLeftRadius,
  ];
};

/** An element's four border widths, clockwise from the top. */
const edges = (element: Element) => {
  const style = getComputedStyle(element);
  return [
    style.borderTopWidth,
    style.borderRightWidth,
    style.borderBottomWidth,
    style.borderLeftWidth,
  ];
};

const same = (value: string) => [value, value, value, value];

const meta = {
  title: "Tokens",
  component: TokenSheet,
  tags: ["!autodocs"],
} satisfies Meta<typeof TokenSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelWeight: Story = {
  render: () => <LabelledParts />,
  play: async ({ canvas, userEvent }) => {
    const header = canvas.getByRole("columnheader", { name: /Name/ });
    await userEvent.click(canvas.getByRole("combobox", { name: "Fruit" }));
    const groupLabel = await within(document.body).findByText("Citrus");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await within(document.body).findByRole("dialog", {}, { timeout: 2000 });
    const parts: Record<string, HTMLElement> = {
      button: canvas.getByRole("button", { name: "Save" }),
      textFieldLabel: canvas.getByText("Email", { selector: "label" }),
      radioGroupLabel: canvas.getByText("Contact method"),
      tab: canvas.getByRole("tab", { name: "Profile" }),
      selectGroupLabel: groupLabel,
      dataTableCaption: canvas.getByText("Guests"),
      dataTableHeader: header,
      dataTableSort: within(header).getByRole("button"),
      dialogTitle: within(dialog).getByRole("heading"),
    };
    const weights = () =>
      Object.fromEntries(
        Object.entries(parts).map(([name, part]) => [name, getComputedStyle(part).fontWeight]),
      );
    const every = (weight: string) =>
      Object.fromEntries(Object.keys(parts).map((name) => [name, weight]));

    await expect(weights()).toEqual(every("600"));

    // One override moves every label. The values are read before it is removed, so a failed
    // assertion never leaks into the next Story.
    const root = document.documentElement.style;
    root.setProperty("--kui-label-weight", "300");
    const overridden = weights();
    root.removeProperty("--kui-label-weight");
    await expect(overridden).toEqual(every("300"));
  },
};

export const ShapeTokens: Story = {
  render: () => <ShapedParts />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Save" });
    const input = canvas.getByLabelText("Email");
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    const box = canvas
      .getByRole("checkbox", { name: "Remember me" })
      .closest(".kui-checkbox")
      ?.querySelector(".kui-checkbox__box");
    if (!box) throw new Error("The Checkbox has no box");
    const tab = canvas.getByRole("tab", { name: "Profile" });
    const list = canvas.getByRole("tablist", { name: "Account settings" });
    const cell = canvas.getByRole("cell", { name: "Lena Fischer" });
    const shapes = () => ({
      button: corners(button),
      field: corners(input),
      trigger: corners(trigger),
      fieldEdges: edges(input),
      triggerEdges: edges(trigger),
      box: corners(box),
      tab: corners(tab),
      list: corners(list),
      row: corners(cell),
    });

    await expect(shapes()).toEqual({
      button: same("999px"),
      field: same("12px"),
      trigger: same("12px"),
      fieldEdges: same("2px"),
      triggerEdges: same("2px"),
      box: same("6px"),
      tab: same("999px"),
      list: same("999px"),
      row: same("12px"),
    });

    // Each part follows its own role, and radius pill and radius field no longer reach the parts
    // that moved off them. Radius tab and border width field take four values, so a Consumer gets
    // a square-topped tab and an underlined field from one rule each. The values are read before
    // the overrides are removed, so a failed assertion never leaks into the next Story.
    const overrides: Record<string, string> = {
      "--kui-radius-pill": "7px",
      "--kui-radius-field": "8px",
      "--kui-radius-button": "3px",
      "--kui-radius-tab": "0 0 6px 6px",
      "--kui-radius-check": "1px",
      "--kui-radius-row": "5px",
      "--kui-border-width-field": "0 0 3px",
    };
    const root = document.documentElement.style;
    for (const [name, value] of Object.entries(overrides)) root.setProperty(name, value);
    const overridden = shapes();
    // The focus rule sets only the colour, so it lands on the one side that has width.
    await userEvent.click(input);
    for (const animation of input.getAnimations()) animation.finish();
    const focused = { edges: edges(input), underline: getComputedStyle(input).borderBottomColor };
    for (const name of Object.keys(overrides)) root.removeProperty(name);

    await expect(overridden).toEqual({
      button: same("3px"),
      field: same("8px"),
      trigger: same("8px"),
      fieldEdges: ["0px", "0px", "3px", "0px"],
      triggerEdges: ["0px", "0px", "3px", "0px"],
      box: same("1px"),
      tab: ["0px", "0px", "6px", "6px"],
      list: ["0px", "0px", "6px", "6px"],
      row: same("5px"),
    });
    await expect(input).toHaveFocus();
    await expect(focused.edges).toEqual(["0px", "0px", "3px", "0px"]);
    await expect(toRGB(focused.underline)).toEqual(tokenColour("--kui-primary"));
  },
};

export const RailTokens: Story = {
  render: () => <RailedParts />,
  play: async ({ canvas, userEvent }) => {
    const list = canvas.getByRole("tablist", { name: "Account settings" });
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await within(document.body).findByRole("dialog", {}, { timeout: 2000 });
    const viewport = dialog.querySelector(".kui-dialog__viewport");
    if (!viewport) throw new Error("The dialog has no viewport");

    // Ridgeline sets the Rail's width to 0, so neither part draws one, and the Dialog keeps its
    // arch on top.
    const ember = tokenColour("--kui-rail-color");
    for (const part of [list, viewport]) {
      const edge = topEdge(part);
      await expect(edge.width).toBe("0px");
      await expect(toRGB(edge.colour)).toEqual(ember);
    }
    const archBefore = corners(viewport);

    // One Consumer rule hangs a bar along the top of both parts, and the arch sits under it. The
    // values are read before the overrides are removed, so a failed assertion never leaks into the
    // next Story.
    const root = document.documentElement.style;
    root.setProperty("--kui-rail-width", "10px");
    root.setProperty("--kui-rail-color", "rgb(1, 2, 3)");
    const overridden = { list: topEdge(list), dialog: topEdge(viewport) };
    const archAfter = corners(viewport);
    root.removeProperty("--kui-rail-width");
    root.removeProperty("--kui-rail-color");

    const rail = { width: "10px", style: "solid", colour: "rgb(1, 2, 3)" };
    await expect(overridden).toEqual({ list: rail, dialog: rail });
    await expect(archAfter).toEqual(archBefore);
  },
};

export const Ridgeline: Story = {
  play: async () => {
    for (const name of [
      ...colours,
      ...shadows,
      ...radii,
      ...widths,
      ...spaces,
      ...paddings,
      ...fonts,
      ...fontSizes,
      ...labelStyle,
      "--kui-motion-duration",
    ]) {
      await expect(tokenValue(name), `${name} is defined`).not.toBe("");
    }

    // The formula against WCAG's own extremes, so a broken formula cannot pass every pair.
    await expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21);
    await expect(contrast([118, 118, 118], [255, 255, 255])).toBeCloseTo(4.54, 2);

    for (const [text, background] of textPairs) {
      const ratio = contrast(tokenColour(text), tokenColour(background));
      await expect(ratio, `${text} on ${background}`).toBeGreaterThanOrEqual(4.5);
    }
    for (const [text, background] of textPairsOnOptionalFill) {
      if (isTransparentIn(document.body, background)) continue;
      const ratio = contrast(tokenColour(text), tokenColour(background));
      await expect(ratio, `${text} on ${background}`).toBeGreaterThanOrEqual(4.5);
    }
    for (const [edge, background] of edgePairs) {
      const ratio = contrast(tokenColour(edge), tokenColour(background));
      await expect(ratio, `${edge} on ${background}`).toBeGreaterThanOrEqual(3);
    }
  },
};
