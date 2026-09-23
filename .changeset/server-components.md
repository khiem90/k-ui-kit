---
"k-ui-kit": minor
---

Every Component renders from a React Server Component with no client boundary in your app, the composite namespaces such as `Dialog.Root` included. The package ships one file per Component, each with its own client directive, so a bundler also drops the Components an app does not import.
