---
'storybook-addon-md': minor
---

Respect `docs.defaultName`, use leading H1s as standalone titles, and add `tagFields` and the `storybook-addon-md/node` parsing API. Markdown pages retain props, examples, and original manifest source.

Migration: update attached links from `--markdown` to `--docs` (or the configured name), enable Autodocs in preview-level tags, and render the supplied `heading` in custom layouts. MCP component IDs are unchanged.
