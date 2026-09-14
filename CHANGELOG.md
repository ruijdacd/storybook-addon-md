# storybook-addon-md

## 0.5.0

### Minor Changes

- 76c1a71: Render GitHub-style alerts (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`) as labelled callouts in Docs. Ordinary blockquotes and unrecognized markers are unchanged, Markdown and relative assets inside callouts keep working, and manifests keep the original source.

  Style callouts with the new `--sbmd-callout-*` variables, including per-type accent colors, or target `.storybook-addon-md-callout[data-callout]`. Custom `MarkdownRenderer` implementations receive the original blockquote syntax and must render callouts themselves. See the [callout syntax](https://github.com/ruijdacd/storybook-addon-md#callouts) and [styling reference](https://github.com/ruijdacd/storybook-addon-md/blob/main/STYLING.md#callouts).

## 0.4.0

### Minor Changes

- 8bf5398: Respect `docs.defaultName`, use leading H1s as standalone titles, and add `tagFields` and the `storybook-addon-md/node` parsing API. Markdown pages retain props, examples, and original manifest source.

  Migration: update attached links from `--markdown` to `--docs` (or the configured name), enable Autodocs in preview-level tags, and render the supplied `heading` in custom layouts. MCP component IDs are unchanged.

## 0.3.0

### Minor Changes

- 2052cb5: Add opt-in documentation manifests with original Markdown, frontmatter summaries, and live updates for standalone and attached docs. Enable `manifests: true` to use [Storybook 10.6.0 manifests](https://storybook.js.org/docs/ai/manifests) and [@storybook/addon-mcp](https://storybook.js.org/docs/ai/mcp/overview) without a custom preset.

  See the [setup guide](https://github.com/ruijdacd/storybook-addon-md#documentation-manifests-and-mcp) and [examples with and without MCP](https://github.com/ruijdacd/storybook-addon-md#examples-and-contributing).

### Patch Changes

- d3c7300: Use rem values for default Markdown styles so they scale with the root font size. Add `--sbmd-monospace-font-family` to customize inline code and code blocks, with Storybook’s monospace theme font as the default. See the [CSS variable reference](https://github.com/ruijdacd/storybook-addon-md/blob/main/STYLING.md).

## 0.2.0

### Minor Changes

- dc93b21: Remove the `exclude` option. Move exclusions into `patterns` with a leading `!`:

  ```ts
  patterns: ['docs/**/*.md', '!docs/private/**'];
  ```

  Negative globs take precedence regardless of order. Configurations that still use `exclude` now report a migration error instead of silently including excluded files.

### Patch Changes

- dc93b21: Upgrade Chokidar to v5 and replace fast-glob with tinyglobby. Keep explicit glob matching, negative-pattern exclusions, and live Markdown updates.

## 0.1.0

Initial release.

- Discover ordinary Markdown through configurable include and exclude patterns.
- Render standalone pages or attach shared documentation to component stories.
- Support frontmatter, sibling-story associations, and status and tag chips.
- Bundle relative assets and update documentation during development.
- Customize Markdown rendering, layouts, stylesheets, and CSS variables.
- Include a GitHub-inspired example with system light and dark themes.

Tested with Storybook 10.6.0, React 19.2.4, and Vite 7.3.6.
