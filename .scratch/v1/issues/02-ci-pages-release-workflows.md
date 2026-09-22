# 02: CI, Pages deploy, and release workflows

**What to build:** A pull request cannot merge with failing lint, types, Story tests, or build. A push to main publishes Storybook to a public GitHub Pages URL a Consumer can browse. Changesets tracks versions and opens a release pull request; publishing to npm runs from CI with provenance once the maintainer supplies a token.

**Blocked by:** 01 (Scaffold, Tokens, and Button end to end)

**Status:** ready-for-agent

- [x] CI workflow runs lint, typecheck, Story tests in Chromium, and build on every pull request and push to main
- [x] Pages workflow builds Storybook and deploys it on push to main; the deployed URL is recorded in the README
- [x] Changesets is configured; every pull request that changes the package carries a changeset file; the release workflow opens or updates a version pull request
- [x] The release workflow publishes to npm with provenance when the version pull request merges, reading the token from a repository secret named in the README
- [x] The README tells the maintainer the one-time steps: npm login, create the token, add the secret
- [x] All three workflows pass on a real run against main

## Comments

2026-09-21: Implemented in 814bf75 (workflows, Changesets, README) and 2735d99 (code review fixes), landed through https://github.com/khiem90/k-ui-kit/pull/1 where both checks passed. Verified on main at 2735d99: the CI, Pages, and Release runs all succeeded. The Storybook serves at https://khiem90.github.io/k-ui-kit/ with all 15 entries. Release opened https://github.com/khiem90/k-ui-kit/pull/2, which bumps the version to 0.1.0, writes CHANGELOG.md, and deletes the changeset. Publishing is skipped until the NPM_TOKEN secret exists; the README has the one-time steps. Repository settings changed outside the diff: Pages enabled with the Actions source, Actions allowed to open pull requests, and a ruleset named Protect main that requires the ci and changeset checks with admin bypass. The bypass is also how the version pull request gets merged, because a pull request opened by the Actions bot triggers no CI. The package version dropped from 0.1.0 to 0.0.0 so the first release comes from a changeset and lands as 0.1.0 with a changelog entry; ticket 01 carries a note. npm's docs say publishing with a token ends in January 2027, and the README explains the switch to trusted publishing.
