# Plain CSS with Tokens instead of Tailwind or CSS-in-JS

The kit has to work unchanged in Next.js App Router, Remix, Vite, and Astro, and a Consumer has to be able to restyle it without adopting our tooling. We ship one plain stylesheet, every design value in it is a CSS custom property (a Token) prefixed `kui`, and there is no styling runtime.

## Considered options

- Tailwind. A Consumer would have to run our preset through their own build, and a Consumer without Tailwind gets unstyled markup. Utility class names also put implementation detail in the DOM.
- CSS-in-JS. Runtime libraries such as styled-components and Emotion break under React Server Components unless wrapped in a client boundary. Zero-runtime libraries such as vanilla-extract need a bundler plugin on the Consumer's side.
- Plain CSS with Tokens. One `import "k-ui-kit/styles.css"` works in every bundler, and a rebrand is a handful of Token overrides. Chosen.

## Consequences

- Every colour, spacing step, radius, font family, and font size in component CSS must come from a Token. A hard-coded value is a bug, and `pnpm lint` fails on one: Stylelint rejects a raw colour anywhere in `src/**/*.css` outside `tokens.css`, and a px or rem length in a spacing, radius, or font-size property, allowing only `0`, `1px`, `2px`, and `-1px`.
- The Token selectors are wrapped in `:where()` so they carry zero specificity, and a Consumer's plain `:root` override always wins.
- Each Theme carries one Color scheme of its own, declared in its block (ADR 0007), so each Token is declared once per Theme: Ridgeline's on the root, Noren's under `data-theme="noren"`, and Rooftop's, the dark one, under `data-theme="rooftop"`. There is no dark media query and no `data-theme="light|dark"` switch to restate in an override. `data-color-scheme` stays reserved for the day one Theme ships a light and a dark set of values.
- package.json marks CSS as side-effectful so bundlers keep the stylesheet.
- Modern CSS such as `color-mix()` and `:focus-visible` is used without fallbacks. Evergreen browsers only.
