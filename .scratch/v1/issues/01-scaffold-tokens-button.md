# 01: Scaffold, Tokens, and Button end to end

**What to build:** A Consumer can install the built package, import the stylesheet, and use a Button with every variant, size, icon slot, and asChild in light and dark Themes. A maintainer can run one command that executes every Story as a browser test with axe and get a pass. This ticket is the tracer bullet: it proves every layer from source to published-shape output.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Repository initialised in git with a public GitHub repo at khiem90/k-ui-kit, default branch main, MIT license
- [ ] pnpm via corepack; tsup builds ESM plus declaration files; the client directive survives in the built output of interactive Components
- [ ] Package exports a root entry and a single stylesheet, marks CSS as side-effectful, declares React 18 or later as a peer dependency, version 0.1.0
- [ ] Storybook 9 on Vite with autodocs, the Vitest addon running Stories in Chromium, and the a11y addon configured to fail the run on any violation
- [ ] A global Storybook toolbar toggle sets the theme attribute so every Story can be viewed in the dark Theme
- [ ] ESLint flat config with the jsx-a11y plugin and Prettier, both passing
- [ ] Full semantic Token set, prefixed kui, with light values on the root and dark values under both the theme attribute and the colour-scheme media query, attribute winning; spacing scale, radii, system font, focus-visible outline, reduced-motion handling
- [ ] Button: variants primary, secondary, outline, ghost, danger; sizes sm, md, lg; leading and trailing icon nodes; asChild; disabled; forwards ref, accepts className, spreads rest props
- [ ] Stories for Default, every variant, every size, with icons, asChild as a link, and disabled; a play function proves keyboard activation with Enter and Space
- [ ] One placeholder Getting started MDX page exists so the docs shape is in place
- [ ] Glossary is current and two ADRs are written: plain CSS with Tokens over Tailwind or CSS-in-JS, and Radix as the Primitive layer with Base UI noted as fallback
- [ ] Story test run, lint, typecheck, and build all pass locally
