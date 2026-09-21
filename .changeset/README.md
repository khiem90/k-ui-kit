# Changesets

A pull request that changes shipped code adds a file here with `pnpm changeset`. The `changedFilePatterns` list in `config.json` defines shipped code. The Release workflow turns the files into a version bump and a CHANGELOG entry. The Release section of the root README has the details.
