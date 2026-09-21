# 02: CI, Pages deploy, and release workflows

**What to build:** A pull request cannot merge with failing lint, types, Story tests, or build. A push to main publishes Storybook to a public GitHub Pages URL a Consumer can browse. Changesets tracks versions and opens a release pull request; publishing to npm runs from CI with provenance once the maintainer supplies a token.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [ ] CI workflow runs lint, typecheck, Story tests in Chromium, and build on every pull request and push to main
- [ ] Pages workflow builds Storybook and deploys it on push to main; the deployed URL is recorded in the README
- [ ] Changesets is configured; every pull request that changes the package carries a changeset file; the release workflow opens or updates a version pull request
- [ ] The release workflow publishes to npm with provenance when the version pull request merges, reading the token from a repository secret named in the README
- [ ] The README tells the maintainer the one-time steps: npm login, create the token, add the secret
- [ ] All three workflows pass on a real run against main
