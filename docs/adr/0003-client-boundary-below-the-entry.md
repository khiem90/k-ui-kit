# The client boundary sits below the public entry

The kit has to render from a React Server Component with no `"use client"` in the Consumer's app, and a Consumer's bundler has to drop the Components they do not import. The first build shape, one bundle with the directive on top, did neither. The Consumer smoke test in ticket 13 found both failures in a fresh Next.js app and a fresh Vite app.

A server component that imports a client module gets one client reference per export and cannot reach into it. `Dialog` was a reference, so `Dialog.Root` was `undefined` and Next.js failed the build with "Element type is invalid". And a bundler cannot drop a Component from a single file, because `forwardRef(...)` and `createContext(...)` are calls it cannot prove pure, so the Vite bundle carried all ten Components when the app imported two.

## Considered options

- One bundle with the directive on top. Simple, and it is what tsup produces by default, but it fails both requirements above.
- A server-safe entry that imports one client bundle. The namespaces become plain objects and `Dialog.Root` works, but everything still shares one file, so nothing tree-shakes.
- Flat exports such as `DialogRoot`, or subpath exports such as `k-ui-kit/dialog`. Both work with server components. Both change the public API the spec settled on: namespaces of parts, and no subpaths in v1.
- One output file per source file, with the entry free of the directive. Each Component's file keeps its own `"use client"`, the entry assembles the namespaces as plain objects, and a bundler drops whole files that nothing imports because `package.json` marks only CSS as side-effectful. Chosen.

## Consequences

- `dist/` mirrors `src/`. tsup gets every source file as an entry and leaves relative imports in place. `dist/index.js` must never contain Component code, because hooks in it would run on the server, and `scripts/verify-build.mjs` fails the build if it does or if any Component file lacks the directive.
- Relative imports in shipped source end in `.js`, because the build keeps them as written and Node needs the extension to load the package outside a bundler. Stories are not shipped and stay extensionless.
- The composite namespaces live in `src/index.ts`, not in the Component files. Those files export their parts under prefixed names such as `DialogRoot`, which the entry does not re-export.
- The stylesheet is built to `dist/styles/index.css`. The `k-ui-kit/styles.css` subpath hides that.
- A function still cannot cross from a server component to a client one. That is React's rule, not the kit's, and the Getting started page says so.
- `pnpm smoke` reruns the Consumer check in fresh apps. Run it before merging a version pull request.
