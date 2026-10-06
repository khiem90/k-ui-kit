import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../src/styles/index.css";
// The opt-in fonts stylesheet, so the docs show the full Theme a Consumer gets with both imports.
import "../src/styles/fonts.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    backgrounds: { disable: true },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
  tags: ["autodocs"],
};

export default preview;
