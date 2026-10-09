import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import "../src/styles/index.css";
// The opt-in fonts stylesheets, so the docs show the full Theme a Consumer gets with each import.
import "../src/styles/fonts.css";
import "../src/styles/fonts-noren.css";
import "../src/styles/fonts-rooftop.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    // The canvas takes the background Token in preview.css, so the background picker stays off.
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: "The Theme the canvas renders in",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "ridgeline", title: "Ridgeline" },
          { value: "noren", title: "Noren" },
          { value: "rooftop", title: "Rooftop" },
        ],
        dynamicTitle: true,
      },
    },
  },
  // Ridgeline is the default, so the Vitest run plays every Story once under it.
  initialGlobals: { theme: "ridgeline" },
  decorators: [
    (Story, { globals }) => {
      const theme = globals.theme as string;
      // The attribute goes on the html element, the same place a Consumer puts it, so the canvas
      // body and the top layer follow the Theme. Ridgeline is the attribute-less default.
      useEffect(() => {
        const html = document.documentElement;
        if (theme === "noren" || theme === "rooftop") html.setAttribute("data-theme", theme);
        else html.removeAttribute("data-theme");
      }, [theme]);
      return <Story />;
    },
  ],
  tags: ["autodocs"],
};

export default preview;
