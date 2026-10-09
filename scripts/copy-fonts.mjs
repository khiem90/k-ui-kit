import { cp } from "node:fs/promises";

// The fonts stylesheets are copied rather than bundled, so their url() paths stay as written and
// point at ../fonts/, which mirrors src/fonts/ with each family's licence beside its files.
// scripts/verify-build.mjs fails the build if any of those urls has no file behind it.
await cp("src/styles/fonts.css", "dist/styles/fonts.css");
await cp("src/styles/fonts-noren.css", "dist/styles/fonts-noren.css");
await cp("src/styles/fonts-rooftop.css", "dist/styles/fonts-rooftop.css");
await cp("src/fonts", "dist/fonts", { recursive: true });
