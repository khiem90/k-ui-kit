import { defineConfig } from "tsup";

// One output file per source file, and relative imports are left in place. Each Component's file
// keeps its own client directive, a Consumer's bundler drops the files they do not import, and the
// entry stays a server-safe module that assembles the composite namespaces. See
// docs/adr/0003-client-boundary-below-the-entry.md.
export default defineConfig({
  entry: [
    "src/index.ts",
    "src/icons.tsx",
    "src/components/*/*.tsx",
    "!src/components/*/*.stories.tsx",
    "src/styles/index.css",
  ],
  format: ["esm"],
  splitting: false,
  dts: { entry: { index: "src/index.ts" } },
  sourcemap: true,
  clean: true,
  target: "es2022",
  esbuildOptions(options) {
    // Relative imports in the source already carry the .js extension, so left as they are they
    // resolve inside dist/, which mirrors src/.
    options.external = [...(options.external ?? []), "./*.js", "../*.js"];
  },
});
