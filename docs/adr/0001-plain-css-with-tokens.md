# Plain CSS with Tokens instead of Tailwind or CSS-in-JS

The kit has to work unchanged in Next.js App Router, Remix, Vite, and Astro, and a Consumer has to be able to restyle it without adopting our tooling. We ship one plain stylesheet, every design value in it is a CSS custom property (a Token) prefixed `kui`, and there is no styling runtime.

## Considered options

- Tailwind. A Consumer would have to run our preset through their own build, and a Consumer without Tailwind gets unstyled markup. Utility class names also put implementation detail in the DOM.
- CSS-in-JS. Runtime libraries such as styled-components and Emotion break under React Server Components unless wrapped in a client boundary. Zero-runtime libraries such as vanilla-extract need a bundler plugin on the Consumer's side.
- Plain CSS with Tokens. One `import "k-ui-kit/styles.css"` works in every bundler, and a rebrand is a handful of variable overrides. Chosen.

## Consequences

- Every colour, spacing step, radius, and font in component CSS must come from a Token. A hard-coded value is a bug.
- The kit's own selectors are wrapped in `:where()` so they carry zero specificity. A Consumer's plain `:root` override always wins, including over the kit's dark colour-scheme media query.
- package.json marks CSS as side-effectful so bundlers keep the stylesheet.
- Modern CSS such as `color-mix()` and `:focus-visible` is used without fallbacks. Evergreen browsers only.
