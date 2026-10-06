import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

/** Every face the Ridgeline and Noren Themes draw, from the two opt-in fonts stylesheets. */
const faces = [
  { family: "Fraunces", style: "italic", weight: 400 },
  { family: "Fraunces", style: "italic", weight: 600 },
  { family: "Fraunces", style: "normal", weight: 600 },
  { family: "Josefin Sans", style: "normal", weight: 400 },
  { family: "Josefin Sans", style: "normal", weight: 600 },
  { family: "Nunito Sans", style: "normal", weight: 400 },
  { family: "Nunito Sans", style: "normal", weight: 600 },
  { family: "Nunito Sans", style: "normal", weight: 700 },
  { family: "Shippori Mincho B1", style: "normal", weight: 800 },
  { family: "Zen Kaku Gothic New", style: "normal", weight: 400 },
  { family: "Zen Kaku Gothic New", style: "normal", weight: 700 },
] as const;

/** One sample from the latin subset and one from latin-ext, so both files of each face load. */
const latin = "Weekend escape";
const latinExt = "Łódź, Ærøskøbing";

function FontSpecimens() {
  return (
    <ul style={{ display: "grid", gap: "var(--kui-space-2)", padding: 0, listStyle: "none" }}>
      {faces.map(({ family, style, weight }) => (
        <li
          key={`${family} ${style} ${weight}`}
          style={{ fontFamily: `"${family}"`, fontStyle: style, fontWeight: weight }}
        >
          {family} {weight} {style}: {latin}, {latinExt}
        </li>
      ))}
    </ul>
  );
}

const meta = {
  title: "Fonts",
  component: FontSpecimens,
  // A check that Storybook loads the fonts stylesheet and that every face resolves to a real file.
  // It runs as a test and needs no sidebar entry.
  tags: ["!dev", "!autodocs"],
} satisfies Meta<typeof FontSpecimens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EveryFaceLoads: Story = {
  play: async () => {
    for (const { family, style, weight } of faces) {
      const font = `${style} ${weight} 16px "${family}"`;
      for (const sample of [latin, latinExt]) {
        // load() resolves with no faces when nothing matches, and rejects when a file is missing.
        const loaded = await document.fonts.load(font, sample);
        await expect(loaded, `${font} for "${sample}"`).not.toHaveLength(0);
        await expect(document.fonts.check(font, sample), font).toBe(true);
      }
    }
  },
};
