---
'storybook-addon-md': minor
---

Remove the `exclude` option. Move exclusions into `patterns` with a leading `!`:

```ts
patterns: ['docs/**/*.md', '!docs/private/**'];
```

Negative globs take precedence regardless of order. Configurations that still use `exclude` now report a migration error instead of silently including excluded files.
