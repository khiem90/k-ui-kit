import type { Preview } from "@storybook/react-vite";
import "../src/styles/index.css";
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
