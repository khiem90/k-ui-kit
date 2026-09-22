# k-ui-kit v1

Status: ready-for-agent

## Problem statement

A developer building a React app has two bad options for UI. Either they hand-write every button, dialog, and select and get the keyboard and screen reader behaviour wrong in the ways everyone gets it wrong, or they adopt a large component library that dictates a styling stack, ships a runtime, and breaks under server components. Neither is quick to drop into a Next.js, Remix, or Vite app, and neither lets them restyle without fighting the library.

## Solution

k-ui-kit is a small npm package of React components that are accessible out of the box and styled with plain CSS. A Consumer installs one package, imports one stylesheet, and uses ten Components that meet WCAG 2.2 AA and follow the WAI-ARIA Authoring Practices for keyboard behaviour. Styling is a set of CSS custom properties (Tokens) the Consumer overrides to match their brand, with a built-in dark Theme. Every Component has Stories in a public Storybook that show how it is used, and those Stories are the tests.

## User stories

### Installing and using

1. As a Consumer, I want to install one package and import one stylesheet, so that setup takes under a minute.
2. As a Consumer, I want the package to work in Next.js App Router, Remix, Vite, and Astro islands, so that I do not need to check compatibility before adopting it.
3. As a Consumer, I want interactive Components to carry the client directive in the build output, so that they work inside server component trees without me wrapping them.
4. As a Consumer, I want the package to declare React 18 or later as a peer dependency, so that it does not pull in a second React copy.
5. As a Consumer, I want ESM output with type declarations, so that my bundler tree-shakes unused Components and my editor autocompletes props.
6. As a Consumer, I want every Component to accept a class name and spread unknown props onto its root element, so that I can attach my own classes, data attributes, and event handlers without a wrapper.
7. As a Consumer, I want every Component to forward its ref, so that I can focus, measure, or animate the underlying DOM node.
8. As a Consumer, I want to render a Button as a link with asChild, so that navigation looks like a button without nesting interactive elements.
9. As a Consumer, I want every stateful Component to work both controlled and uncontrolled, so that I can start simple and take control later without swapping Components.
10. As a Consumer, I want the package to be MIT licensed, so that I can use it commercially.

### Theming

11. As a Consumer, I want all colours, spacing, radii, and fonts expressed as Tokens, so that I can rebrand by overriding a few variables.
12. As a Consumer, I want a dark Theme that follows the operating system preference by default, so that dark mode works with no code.
13. As a Consumer, I want to force a Theme with a data attribute on any ancestor, so that I can dark-mode one panel or override the system preference.
14. As a Consumer, I want the attribute to win over the system preference, so that a user's in-app choice is respected.
15. As a Consumer, I want Tokens and class names prefixed, so that the kit never collides with my own CSS.
16. As a Consumer, I want the kit to ship no font files, so that it adds no weight or licensing questions to my app.
17. As a Consumer, I want transitions to switch off when the user prefers reduced motion, so that I meet that requirement without extra work.

### Simple components

18. As a Consumer, I want a Button with primary, secondary, outline, ghost, and danger variants, so that the common actions in my app look consistent.
19. As a Consumer, I want Button in three sizes, so that it fits toolbars, forms, and hero sections.
20. As a Consumer, I want to place an icon before or after Button text, so that actions are recognisable at a glance.
21. As a Consumer, I want a disabled Button that is still discoverable by assistive technology, so that users understand an action is unavailable.
22. As a Consumer, I want a TextField that renders a label, optional description, and error message with the correct associations, so that I never wire aria attributes by hand.
23. As a Consumer, I want TextField to accept native input props such as type, name, and autoComplete, so that it works with forms and form libraries as a plain input.
24. As a Consumer, I want TextField in three sizes matching Button, so that forms line up.
25. As a Consumer, I want a Checkbox with a label and an indeterminate state, so that I can build select-all patterns.
26. As a Consumer, I want a RadioGroup where arrow keys move selection, so that keyboard users get the native radio experience.
27. As a Consumer, I want a Switch with a label that announces as a switch, so that on/off settings are read correctly.
28. As a Consumer, I want a Tooltip that opens on hover and on keyboard focus and closes on Escape, so that it is usable without a mouse.

### Composite components

29. As a Consumer, I want a Select built from parts (trigger, content, item), so that I control the layout of the list.
30. As a Consumer, I want Select to support typeahead and arrow-key navigation, so that keyboard users can pick an option quickly.
31. As a Consumer, I want Select in three sizes, so that it matches TextField in a form row.
32. As a Consumer, I want a Dialog that traps focus, closes on Escape and overlay click, and returns focus to the trigger, so that modal behaviour is correct without me implementing it.
33. As a Consumer, I want Dialog parts for title, description, and close button with the right roles wired up, so that screen readers announce the dialog's purpose.
34. As a Consumer, I want Tabs where arrow keys move between tab headers and only the active panel is in the tab order, so that keyboard users are not sent through hidden panels.

### DataTable

35. As a Consumer, I want a DataTable that takes column definitions and a data array, so that I can display records with a few lines of code.
36. As a Consumer, I want column definitions typed against the row type, so that cell renderers are type-checked.
37. As a Consumer, I want column definitions in the TanStack Table shape, so that I can reuse knowledge and examples from its documentation.
38. As a Consumer, I want client-side sorting by activating a column header, so that users can order data without me writing sort logic.
39. As a Consumer, I want pagination with a configurable page size, so that large arrays stay readable.
40. As a Consumer, I want row selection with checkboxes keyed by row id, so that I can build bulk actions.
41. As a Consumer, I want selection to work controlled or uncontrolled, so that it fits both simple and complex screens.
42. As a Consumer, I want a loading state and an empty state with a custom message, so that the table never shows a confusing blank.
43. As a Consumer, I want to provide a caption, so that the table is described for assistive technology.
44. As a Consumer, I want the table rendered as a real HTML table with scoped headers and sort state exposed, so that screen reader table navigation works.

### Accessibility, for the people using the Consumer's app

45. As a keyboard user, I want every interactive Component reachable and operable with Tab, Enter, Space, arrows, and Escape as the APG specifies, so that I never need a mouse.
46. As a keyboard user, I want a visible focus indicator that appears only on keyboard focus, so that I can see where I am while mouse users do not see rings on every click.
47. As a screen reader user, I want every form control to have an accessible name, so that I know what I am filling in.
48. As a screen reader user, I want errors announced and associated with the field, so that I know what to fix.
49. As a screen reader user, I want dialogs, tooltips, and listboxes to use correct roles and states, so that my reader describes them accurately.
50. As a low-vision user, I want text and control colours in both Themes to meet AA contrast, so that I can read the interface.
51. As a user with a vestibular disorder, I want animations to stop when I set reduced motion, so that the interface does not make me unwell.

### Documentation and Storybook

52. As a Consumer, I want a public Storybook, so that I can see every Component before installing.
53. As a Consumer, I want each Component's props table generated from its types, so that documentation never drifts from the code.
54. As a Consumer, I want a Story for each variant, size, and state, so that I can see exactly what I will get.
55. As a Consumer, I want a toolbar toggle in Storybook for the dark Theme, so that I can check every Component in both Themes.
56. As a Consumer, I want a Getting started page covering install, the stylesheet import, and theming, so that I do not read source to begin.
57. As a Consumer, I want usage notes attached to Stories rather than a separate prose page, so that they stay next to the code they describe.

### Maintaining

58. As a maintainer, I want Stories to run as tests in a real browser with accessibility checks, so that a regression in keyboard or aria behaviour fails CI.
59. As a maintainer, I want the accessibility check to fail the run on any violation, so that a11y bugs cannot merge.
60. As a maintainer, I want lint rules for JSX accessibility, so that obvious mistakes are caught before tests run.
61. As a maintainer, I want lint, typecheck, tests, and build to run on every pull request, so that main always builds.
62. As a maintainer, I want Storybook deployed to GitHub Pages on every push to main, so that the public docs match the released code.
63. As a maintainer, I want releases driven by changeset files with a generated changelog, so that versioning is not a manual chore.
64. As a maintainer, I want CI to publish to npm with provenance, so that Consumers can verify the package came from this repository.
65. As a maintainer, I want minimal comments and no polymorphic as-prop typing, so that the code stays readable and the types stay fast.
66. As a maintainer, I want a glossary and decision records in the repo, so that future contributors and agents use the same vocabulary and know why the hard choices were made.

## Implementation decisions

### Package

- One package named k-ui-kit, public on npm, MIT, initial version 0.1.0, in the GitHub repository khiem90/k-ui-kit. The repository does not exist yet and is created during scaffolding.
- pnpm installed through corepack. tsup builds ESM plus declaration files. The client directive is preserved on interactive Components.
- Peer dependency on React 18 or later. Runtime dependencies are Radix Primitives and TanStack Table only.
- The public entry exports all Components, their prop types, and TanStack's column definition type. A single stylesheet is exported alongside. The package marks CSS as side-effectful so bundlers keep it.
- No per-component subpath exports in v1.
- Evergreen browsers only. Modern CSS is used without polyfills.

### Styling and Tokens

- Plain CSS, one stylesheet. No CSS-in-JS, no Tailwind, no runtime.
- Tokens are semantic only, prefixed kui. Roles: background, subtle background, foreground, muted foreground, border, primary, primary foreground, danger, danger foreground, focus ring. A spacing scale of eight steps on a 4px base, four radii including a pill, and a font family defaulting to system-ui.
- Light Token values live on the root element. Dark values are set under both a data-theme dark attribute selector and the dark colour-scheme media query. The attribute selector is written so it wins over the media query.
- Class names are prefixed kui. Component state is exposed through data attributes so Consumers can target it.
- Focus uses a 2px outline with offset on focus-visible only. Transitions are removed under prefers-reduced-motion.

### Component conventions

- Simple components: Button, TextField, Checkbox, Switch, Tooltip. Flat props.
- Composite components: Dialog, Select, Tabs, RadioGroup. Exposed as a namespace of parts mirroring the underlying Primitive.
- Primitives from Radix underlie Dialog, Select, Tooltip, Tabs, RadioGroup, Checkbox, and Switch. Button and TextField are hand-rolled. Primitives are never re-exported.
- Polymorphism uses asChild via Radix Slot. There is no as prop.
- State follows the value, defaultValue, onValueChange convention for every stateful Component.
- Button variants: primary, secondary, outline, ghost, danger. Sizes sm, md, lg. TextField and Select share the sizes. Checkbox, Radio, and Switch have no size prop.
- Every Component forwards its ref, accepts a class name, and spreads remaining props onto its root.
- Icons the kit needs (chevron, check, close, indeterminate) are inline SVG in one internal module. Consumers pass React nodes where a Component accepts an icon.

### DataTable

- TanStack Table is the engine. The kit owns rendering and accessibility only.
- Props: columns, data, getRowId, caption, sortable, pageSize, selectable, selectedIds, onSelectionChange, loading, emptyMessage.
- Renders a native table element with a caption, scoped header cells, header buttons for sortable columns, and aria-sort on the sorted column. It does not use the grid role.
- Selection is by row id and follows the controlled/uncontrolled convention.
- Sorting and pagination are client-side.

### Storybook and docs

- Storybook 9 on Vite. Autodocs generates props tables. One Getting started MDX page. A global toolbar toggle sets the theme attribute on the preview.
- Each Component has a Default Story plus one Story per variant, size, and state.
- Storybook deploys to GitHub Pages from main.

### Repository

- One folder per Component holding the source, its CSS, and its Stories. Shared Tokens in a styles folder. One public entry module.
- Three GitHub Actions workflows: CI on pull requests and main, Pages deploy on main, Changesets release on main.
- ESLint flat config with the JSX accessibility plugin. Prettier.
- CONTEXT.md holds the glossary. Two ADRs record the styling choice and the Primitive choice.

## Testing decisions

There is one seam: the public package entry, rendered through Stories and executed by Storybook's Vitest addon in a real Chromium browser.

A good test renders a Component the way a Consumer would, drives it through the DOM with keyboard and pointer events in a play function, and asserts on what a user or assistive technology would observe: visible text, focus position, aria attributes, data-state attributes, and callback invocations. Tests never reach into Radix internals, TanStack state, or a Component's module scope.

Every Story is a test. The a11y addon runs axe on each Story and fails the run on any violation. Play functions cover keyboard behaviour for every interactive Component: Tab order, arrow navigation, Escape, focus trap and return for Dialog, typeahead for Select, sort and select for DataTable.

No unit tests against internal modules in v1. If a piece of logic cannot be expressed through a Story, a plain Vitest test against the public entry is acceptable, but that is the exception.

Prior art: none in this repository. The pattern is the standard Storybook interaction test with play functions and the a11y addon in test mode.

## Out of scope

- Filtering, column resizing, virtualisation, and server-side mode for DataTable.
- Toast, DatePicker, Combobox, Menu, Popover, Accordion, and any Component not in the ten listed.
- A raw palette tier of Tokens.
- Per-component subpath exports.
- Per-component hand-written documentation pages.
- An icon library or icon API.
- React 17 or older, and non-evergreen browsers.
- Right-to-left layout verification.
- Manual screen reader test scripts. These happen before release but are not automated or specified here.
- Visual regression testing.

## Further notes

- Build order: tooling and Tokens first, then Button end to end including Stories, tests, and CI, then TextField, Checkbox, RadioGroup, Switch, Select, Dialog, Tooltip, Tabs, DataTable. Each Component lands as its own pull request with a changeset.
- Publishing needs an npm login and an access token stored as a repository secret. The maintainer creates both.
- Radix's maintenance pace slowed in 2024 and 2025. Base UI is the fallback if that becomes a problem. The ADR records this.
