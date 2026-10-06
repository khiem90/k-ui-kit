import { cp } from "node:fs/promises";

// The fonts stylesheet is copied rather than bundled, so its url() paths stay as written and point
// at ../fonts/, which mirrors src/fonts/ with each family's licence beside its files.
// scripts/verify-build.mjs fails the build if any of those urls has no file behind it.
await cp("src/styles/fonts.css", "dist/styles/fonts.css");
await cp("src/fonts", "dist/fonts", { recursive: true });
