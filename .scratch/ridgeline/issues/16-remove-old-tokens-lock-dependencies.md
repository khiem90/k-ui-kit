# 16: Remove old Token names and lock out dependencies

**What to build:** Once no Component reads the old Token names, they are deleted, so a Consumer sees only the Ridgeline role names. The package manifest has no dependencies field, and the build fails if a runtime dependency ever comes back (ADR 0004).

**Blocked by:** 03 (Button), 04 (TextField), 05 (Checkbox), 06 (Switch), 07 (RadioGroup), 08 (Tabs), 09 (Tooltip), 11 (Dialog Ridgeline styling), 13 (Select Ridgeline styling), 15 (DataTable Ridgeline styling)

**Status:** ready-for-agent

- [x] No component CSS or Story reads an old Token name, and the old names are deleted
- [x] The manifest has no dependencies field; React and React DOM stay as peer dependencies
- [x] "radix" is removed from the package keywords
- [x] The build verification script fails when the manifest has a dependencies field
- [x] The build verification script fails when any file in the build output imports a package other than react or react-dom
- [x] Lint, typecheck, tests, and build pass

## Comments

2026-10-05: Landed on branch `ridgeline-16-remove-old-tokens`.

The alias block for the six pre-Ridgeline names is gone from `tokens.css`. A grep found no Component CSS or Story reading any of them. The one live read left in code was the smoke test's body font, which now uses `--kui-font-body`. The Getting started page still lists the old names in its Token table, and three old changesets mention them. Both are prose that ticket 17 rewrites, so I left them alone. Until 17 lands, that table documents Tokens that no longer exist.

`package.json` has no `dependencies` field and no "radix" keyword. React and React DOM stay as peers. The lockfile needed no change, and `pnpm install --frozen-lockfile` passes.

`scripts/verify-build.mjs` gained three checks:

- `package.json` has no `dependencies` field. An empty `{}` fails too, so nobody adds to it by accident.
- No `.js` or `.d.ts` file in `dist/` imports a package other than react or react-dom. It catches static, side-effect, dynamic, and `require` imports, scoped names, and `node:` builtins. Subpaths such as `react/jsx-runtime` count as react. The scan runs before the script imports `dist/index.js` in Node, because that import throws on a missing package before anything gets reported. CSS is not scanned. CSS reads a bare `@import` path as relative, so the scan would flag false positives, and tsup inlines CSS imports anyway.
- `dist/styles/index.css` defines none of the six old Token names. The ticket didn't ask for this one. It keeps the deletion from quietly coming back.

Verified red before green. The dependencies check failed on the old manifest. The old Token checks failed before I deleted the block. For the import check I appended imports of `@radix-ui/react-slot`, `@tanstack/react-table` through a dynamic import, `node:fs`, and a type export from `@tanstack/table-core` to built files, and each one failed. The fonts check that the spec lists under the build check was already in place from ticket 02. Then `pnpm check` passed: lint, typecheck, 142 Story tests in 13 files, and the build.

For ticket 17: the smoke test still fails on the dark Theme panels, as before. Only its font line changed here.
