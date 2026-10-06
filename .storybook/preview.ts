import type { Preview } from "@storybook/react-vite";
import "../src/styles/index.css";
// The opt-in fonts stylesheet, so the docs show the full Theme a Consumer gets with both imports.
import "../src/styles/fonts.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    // The canvas takes the background Token in preview.css, so the background picker stays off.
    backgrounds: { disable: true },
  },
  tags: ["autodocs"],
};

export default preview;
