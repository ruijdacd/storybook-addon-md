# Storybook Markdown

Write ordinary `.md` files and browse them inside Storybook. Attach documentation to component stories or create standalone pages, with no JSX, imports, or MDX wrappers to maintain.

- Discover Markdown automatically, including live additions, edits, and deletions.
- Show component docs alongside existing examples and generated props.
- Bundle relative images and downloads in static builds.
- Customize native Docs styling with CSS variables or your own renderer.

## Install

```sh
nub add -D storybook-addon-md @storybook/addon-docs@10.6.0
```

Tested with **Storybook 10.6.0**, **React Vite 10.6.0**, **Vite 7.3.6**, and **React 19.2.4**. Requires Node 22.13+. Other builders and renderers are not tested.

Add the addon after `@storybook/addon-docs` in `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-docs',
    {
      name: 'storybook-addon-md',
      options: {
        patterns: ['src/**/*.md', 'docs/**/*.md', '!docs/private/**'],
      },
    },
  ],
};

export default config;
```

Keep Markdown globs in the addon’s `patterns` and story globs in Storybook’s `stories`. Add `storybook-markdown-generated/` to `.gitignore`.

## Write documentation

### Component docs

Place `Button.metadata.md` beside `Button.stories.tsx`:

```md
---
status: Stable
tags: [Actions]
---

## Overview

Use buttons to trigger actions.

## When to use

- Submit a form.
- Confirm a choice.
```

The component gets a **Markdown** Docs entry with the content, status and tag chips, examples, and props. Existing stories and Autodocs remain available.

The sibling convention supports `.stories.tsx`, `.stories.ts`, `.stories.jsx`, and `.stories.js`. To associate a different file, or share a document across components, set `stories` relative to the Markdown file:

```yaml
stories:
  - ../components/Button.stories.tsx
  - ../components/Toggle.stories.tsx
```

A single path is also accepted. Explicit `stories` takes precedence over the filename convention, and referenced files must match Storybook’s story globs.

### Standalone pages

Any discovered Markdown file can stand alone. Use `title` to choose its sidebar location:

```md
---
title: Guides/Introduction
---

## Getting started

Write ordinary Markdown here.
```

Without a title, `docs/Introduction.md` appears at `Documentation/docs/Introduction`.

### Frontmatter

YAML frontmatter is optional. Use lowercase field names.

| Field        | Meaning                                            |
| ------------ | -------------------------------------------------- |
| `title`      | Sidebar location for standalone pages.             |
| `stories`    | Relative story-file path or array of paths.        |
| `tags`       | Array of labels rendered as chips below the title. |
| `status`     | A chip with its value preserved in `data-status`.  |
| Other fields | Preserved as metadata for custom presentation.     |

Invalid frontmatter, missing or ambiguous story references, and missing local assets produce source-specific errors.

## Configuration

| Option         | Default                        | Purpose                                                       |
| -------------- | ------------------------------ | ------------------------------------------------------------- |
| `patterns`     | Required                       | Markdown globs; prefix with `!` to exclude files.             |
| `root`         | `..`                           | Project folder, resolved from the Storybook config directory. |
| `generatedDir` | `storybook-markdown-generated` | Disposable output folder under the working directory.         |
| `stylesheet`   | None                           | Custom stylesheet path.                                       |
| `presentation` | None                           | Module exporting `Layout` and/or `MarkdownRenderer`.          |

Globs and customization paths start from your project folder (the parent of `.storybook` by default). Keep the config and local files inside that folder. Restart Storybook after changing options.

`generatedDir` must be a visible folder name using letters, digits, hyphens, or underscores. Hidden folders, nested paths, `node_modules`, and `storybook-static` are unsupported. Ignore the folder in Git; the addon manages its contents.

## Styling

Set `stylesheet: '.storybook/markdown.css'` to override the defaults:

```css
.storybook-addon-md-page {
  --sbmd-font-size: 16px;
  --sbmd-line-height: 1.8;
  --sbmd-tag-radius: 6px;
}
```

Variables cover typography, spacing, links, code, tables, images, and chips. Defaults follow Storybook’s Docs theme in light and dark mode.

See [Styling](STYLING.md) for all variables, status colors, theme switching, and custom layouts or Markdown renderers. The [example stylesheet](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/markdown.css) provides a complete GitHub-inspired theme.

## Links and limitations

- Relative links and images resolve from the Markdown source and are included in static builds. Root-relative assets use Storybook’s `staticDirs`.
- Links to `.md` files open the original source, not a rendered Docs page. Use a Storybook URL such as `/?path=/docs/guides-introduction--docs` for page navigation.
- Braces and JSX-like text are treated as content. Raw HTML renders as text by default.
- Set Storybook’s `parameters.options.storySort` for explicit sidebar ordering. See the [example preview](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/preview.ts).
- The attached Docs entry name **Markdown** is reserved. Multiple development Storybooks sharing one config directory are unsupported.

## Example and contributing

Run the included Storybook with **Nub 0.7.5** and **Node 24**:

```sh
nub install
nub run storybook
```

Browse **Guides → Introduction**, **Components → Button**, and **Components → Toggle** for standalone, attached, and shared docs with system light/dark styling.

See [Contributing](CONTRIBUTING.md) for tests and releases, or [open an issue](https://github.com/ruijdacd/storybook-addon-md/issues).
