# Contributing

Use Node 24 and [Nub](https://nubjs.com/docs) 0.7.5.

```sh
nub install
nub exec playwright install chromium
nub run storybook
```

The repository uses a hoisted dependency layout and standard Node without Nub runtime hooks. CI installs from `nub.lock` with `--frozen-lockfile`.

## Checks

| Command                   | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `nub run check`           | Build and type-check the addon, examples, and tests. |
| `nub run lint`            | Run Oxlint.                                          |
| `nub run format:check`    | Check formatting. Use `nub run format` to fix it.    |
| `nub run test`            | Run Vitest unit tests.                               |
| `nub run test:browser`    | Run Vitest Browser Mode with Chromium.               |
| `nub run test:e2e`        | Verify development and static Storybooks.            |
| `nub run test:package`    | Verify an installed package in an isolated consumer. |
| `nub run build-storybook` | Build the example site.                              |
| `nub pack`                | Build and package the addon.                         |

Watch modes are available through `test:watch` and `test:browser:watch`. End-to-end tests use ports 16006/16007; the package check uses 16008. Run only one development Storybook per config directory when testing file watching.

## Releases

Run `nub run changeset` for user-facing changes. Choose a version bump and include the generated release note in your PR. Tooling-only changes do not need one.

After CI passes on `main`, Changesets opens or updates a release PR with the version and changelog. Merging it publishes the package after CI passes again.

npm trusted publishing is configured for `ruijdacd/storybook-addon-md`, workflow `release.yml`, with no environment. No `NPM_TOKEN` secret is needed. GitHub Actions must be allowed to create and approve pull requests in the repository settings.

Release PRs created with GitHub’s automatic token do not trigger PR workflows. If required checks block merging, close and reopen the PR yourself to trigger them. The release workflow always waits for CI on the merged commit.
