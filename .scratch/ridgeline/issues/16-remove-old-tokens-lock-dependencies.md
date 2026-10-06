# 16: Remove old Token names and lock out dependencies

**What to build:** Once no Component reads the old Token names, they are deleted, so a Consumer sees only the Ridgeline role names. The package manifest has no dependencies field, and the build fails if a runtime dependency ever comes back (ADR 0004).

**Blocked by:** 03 (Button), 04 (TextField), 05 (Checkbox), 06 (Switch), 07 (RadioGroup), 08 (Tabs), 09 (Tooltip), 11 (Dialog Ridgeline styling), 13 (Select Ridgeline styling), 15 (DataTable Ridgeline styling)

**Status:** ready-for-agent

- [ ] No component CSS or Story reads an old Token name, and the old names are deleted
- [ ] The manifest has no dependencies field; React and React DOM stay as peer dependencies
- [ ] "radix" is removed from the package keywords
- [ ] The build verification script fails when the manifest has a dependencies field
- [ ] The build verification script fails when any file in the build output imports a package other than react or react-dom
- [ ] Lint, typecheck, tests, and build pass
