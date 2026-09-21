# 13: Getting started page and consumer smoke test

**What to build:** A Consumer reads one page in Storybook and can install, import the stylesheet, and switch Themes. The packed package is proven inside a fresh Next.js App Router app and a fresh Vite app before the first release is cut.

**Blocked by:** 02 (CI, Pages deploy, and release workflows), 03 (TextField), 04 (Checkbox), 05 (Switch), 06 (RadioGroup), 07 (Tooltip), 08 (Tabs), 09 (Dialog), 10 (Select), 11 (DataTable with sorting and pagination), 12 (DataTable selection and states)

**Status:** ready-for-agent

- [ ] Getting started MDX page covers install, the single stylesheet import, the theme attribute, overriding Tokens, and a short example composing a form from TextField, Select, Checkbox, and Button
- [ ] The package is packed to a tarball and installed into a fresh Next.js App Router app in a temporary folder; a server component page renders every Component without a client boundary added by the Consumer, and the build succeeds
- [ ] The tarball is installed into a fresh Vite app; the production bundle contains only the imported Components, confirming tree-shaking, and the stylesheet is included
- [ ] Dark Theme is verified in both apps through the attribute and through the system preference
- [ ] Any defect found in the smoke test is fixed in this ticket or filed as a new ticket before proceeding
- [ ] A changeset for the 0.1.0 release is added and the version pull request opened by the release workflow is reviewed and merged, publishing to npm once the maintainer's token is in place
- [ ] The README links the Pages URL and the npm package
