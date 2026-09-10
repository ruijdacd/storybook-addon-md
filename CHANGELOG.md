# storybook-addon-md

## 0.2.0

### Minor Changes

- 58f8a64: Remove the `exclude` option. Move exclusions into `patterns` with a leading `!`:

  ```ts
  patterns: ['docs/**/*.md', '!docs/private/**'];
  ```

  Negative globs take precedence regardless of order. Configurations that still use `exclude` now report a migration error instead of silently including excluded files.

### Patch Changes

- 58f8a64: Upgrade Chokidar to v5 and replace fast-glob with tinyglobby. Keep explicit glob matching, negative-pattern exclusions, and live Markdown updates.

## 0.1.0

Initial release.

- Discover ordinary Markdown through configurable include and exclude patterns.
- Render standalone pages or attach shared documentation to component stories.
- Support frontmatter, sibling-story associations, and status and tag chips.
- Bundle relative assets and update documentation during development.
- Customize Markdown rendering, layouts, stylesheets, and CSS variables.
- Include a GitHub-inspired example with system light and dark themes.

Tested with Storybook 10.6.0, React 19.2.4, and Vite 7.3.6.
