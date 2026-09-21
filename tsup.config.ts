import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", styles: "src/styles/index.css" },
  format: ["esm"],
  dts: { entry: { index: "src/index.ts" } },
  sourcemap: true,
  clean: true,
  target: "es2022",
  // esbuild drops "use client" from non-entry modules, so the whole bundle declares it.
  // Every Component in the kit is interactive, so the boundary is correct for all of them.
  banner: { js: '"use client";' },
});
