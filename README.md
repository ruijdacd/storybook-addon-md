# storybook-addon-md

Ordinary Markdown documentation inside Storybook. Discover files once, then write `.md` files without JSX, imports, or maintained MDX wrappers.

## Supported setup

Tested with **Storybook 10.6.0**, **@storybook/react-vite 10.6.0**, **@storybook/addon-docs 10.6.0**, **Vite 7.3.6**, React 19.2.4 and Node 24.21.0. Requires Node 22.13+; other Storybook versions, renderers and builders are not supported yet.

## Install

This repository is an installable ESM package, written in TypeScript and published as compiled JavaScript with generated declarations. `npm pack` builds it automatically; consumers do not need a TypeScript build step. To try it before publication, run `npm pack` here and install the resulting `.tgz` in your project:

```sh
npm install -D /path/to/storybook-addon-md-0.1.0.tgz @storybook/addon-docs@10.6.0
```

Add to `.storybook/main.ts`, after addon-docs:

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import type { MarkdownOptions } from 'storybook-addon-md';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-docs',
    {
      name: 'storybook-addon-md',
      options: {
        patterns: ['src/**/*.md', 'docs/**/*.md'],
        exclude: ['docs/private/**'],
      } satisfies MarkdownOptions,
    },
  ],
};

export default config;
```

The example uses `parameters.options.storySort` in its preview configuration to put Guides first and sort component titles alphabetically. Generated filenames are opaque identifiers, so configure Storybook sorting when sidebar order matters.

Keep your normal story discovery configuration. Referenced story files must also match it. Do not add Markdown files to Storybook's `stories` list.

| Option         | Meaning                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `patterns`     | Required array of Markdown globs, relative to `root`. Supports negative globs.                                                                    |
| `exclude`      | Optional array of globs relative to `root`. Exclusions take precedence over `patterns`.                                                           |
| `stylesheet`   | Optional CSS file path relative to `root`, loaded for generated documentation pages.                                                              |
| `generatedDir` | Visible folder name under the working directory. Default: `storybook-markdown-generated`. A disposable subdirectory is created per configuration. |
| `root`         | Content root, relative to the Storybook config directory. Default: `..`.                                                                          |
| `presentation` | Optional module path relative to `root`, exporting `Layout` and/or `MarkdownRenderer`.                                                            |

Ignore `storybook-markdown-generated/` (or your configured `generatedDir`) in Git. The addon creates a disposable subdirectory per configuration under your working directory, registers its MDX glob before indexing, and removes obsolete files. This visible directory avoids Storybook 10.6 watcher issues with leading-dot paths and `node_modules`. Do not edit generated files. Keep the config directory inside `root`; restart Storybook after changing addon options.

## Authoring

No frontmatter is required. A plain `docs/Introduction.md` becomes `Documentation/docs/Introduction` in the sidebar. Use `title` to set a standalone page's location:

```md
---
title: Guides/Introduction
---

## Getting started

Write ordinary Markdown here.
```

Attach documentation explicitly:

```md
---
component: Button
category: Actions
status: Stable
tags: [Actions, Stable]
stories: ./Button.stories.tsx
---

## Overview

Use buttons to trigger actions.

## When to use

- Submit a form.
- Confirm a choice.
```

Or name the document **`Button.metadata.md`** beside `Button.stories.tsx`. The convention also checks `.stories.ts`, `.stories.jsx` and `.stories.js`. Missing or ambiguous siblings are errors. An explicit `stories` field takes precedence.

Share a document by specifying an array:

```yaml
stories:
  - ../components/Button.stories.tsx
  - ../components/Toggle.stories.tsx
```

Paths resolve from the Markdown file. Each referenced component gets a **Markdown** Docs entry containing all its attached documents (sorted by source path), its primary example, generated controls/props, and remaining examples. Existing stories and Autodocs pages continue to work. The name `Markdown` is reserved for this addon's attached page; avoid giving a hand-written MDX page that name under the same component.

Frontmatter must be a YAML mapping with lowercase top-level keys. `title` is a non-empty string for standalone pages. `stories` is a relative story-file path or a non-empty array. `tags` is an optional array of non-empty strings, rendered as chips below the title. Shared pages combine tags in document order and remove duplicates. Tags are content labels, not Storybook indexing tags. `status` is an optional non-empty string, displayed after the tags as a chip with its original value in `data-status`. Shared pages deduplicate statuses in document order. Statuses and tags remain separate, even when their labels match. Additional fields are preserved as metadata, with no built-in meaning or display. `title` does not relocate attached documentation. Duplicate standalone sidebar titles, invalid YAML and missing story references produce errors with source paths.

Markdown supports tables, lists, fenced code and reference links. Braces and JSX-like text are never evaluated. Raw HTML is displayed as text by the default renderer; use Markdown image/link syntax for asset handling.

## Links and assets

Relative Markdown images and links resolve from the source `.md` file, including reference-style links, URL-encoded filenames and fragments. Local files are validated and imported through Vite, so static builds contain hashed asset files. Missing files fail startup/builds; development errors appear in the terminal and Vite overlay or Storybook error view and recover when corrected.

**Links to other `.md` files open the original source file**, including its frontmatter, rather than navigating to that file's Storybook page. Such source downloads are not recursively bundled as websites. For sidebar navigation, use an explicit Storybook URL such as `/?path=/docs/guides-introduction--docs` (adjust the deployment prefix if hosted under a subpath).

External URLs, fragment-only links, query-only links and root-relative URLs are left unchanged. Root-relative assets must be supplied through Storybook's `staticDirs`. Source files, story references, presentation modules and local assets must stay inside `root`; linked files are included in the published build, so choose discovery patterns and links accordingly.

## Customization and themes

The addon uses one shared stylesheet for chips and CSS variable overrides, alongside Storybook's `Markdown`, `Title`, `Primary`, `Controls` and `Stories` blocks inside the existing Docs container. Existing `parameters.docs.container` and `parameters.docs.theme` continue to apply. Choose light or dark using Storybook's standard themes in `.storybook/preview.ts`:

```ts
import { themes } from 'storybook/theming';

export default {
  parameters: { docs: { theme: themes.dark } },
};
```

To override Markdown styles, set `stylesheet: '.storybook/markdown.css'` in the addon options:

```css
.storybook-addon-md h2 {
  border-bottom-style: dashed;
}

.storybook-addon-md p {
  line-height: 1.8;
}
```

Common styles can be changed with CSS variables in that same stylesheet:

```css
.storybook-addon-md-page {
  --sbmd-font-size: 16px;
  --sbmd-line-height: 1.8;
  --sbmd-heading-color: currentColor;
  --sbmd-tag-radius: 6px;
  --sbmd-tag-background: transparent;
  --sbmd-tag-border: 1px solid currentColor;
}
```

| Variables (all prefixed `--sbmd-`)                        | Affects                                    |
| --------------------------------------------------------- | ------------------------------------------ |
| `font-family`, `font-size`, `line-height`, `color`        | Markdown text                              |
| `background`, `max-width`                                 | Documentation page wrapper                 |
| `heading-color`, `heading-font-family`                    | Markdown headings and page title           |
| `link-color`, `code-radius`, `image-radius`               | Links, code blocks and images              |
| `tag-color`, `tag-background`, `tag-border`, `tag-radius` | Chip appearance                            |
| `tag-padding`, `tag-font-size`, `tag-font-weight`         | Chip typography and spacing                |
| `tag-gap`, `tag-margin`                                   | Space between chips and below the tag list |

Variables inherit, so they can also be set on your theme container. Text and link colors default to the active Storybook Docs theme. Use theme-specific variable values when choosing custom colors. Variables cover most content styling, including heading sizes, spacing, link states, lists, quotes, code, tables, images, separators, and chips. See the [complete CSS variable reference](STYLING.md). Ordinary CSS can override any other property. Stable selectors are `.storybook-addon-md-page`, `.storybook-addon-md-title`, `.storybook-addon-md-tags`, `.storybook-addon-md-tag`, and `.storybook-addon-md`. Custom layouts can reuse `DefaultLayout` to retain the title and chips, or render metadata themselves. Custom renderers control their own element structure.

Each Markdown document is wrapped in `.storybook-addon-md`, including custom renderer output. Page titles, generated props and story examples sit outside this wrapper. Scope your selectors to it: the stylesheet is ordinary global CSS in the preview, not automatically isolated. CSS specificity still applies; `.sbdocs-content .storybook-addon-md h2` can override a more specific Storybook rule. Use theme-aware colors such as `currentColor` or your own theme variables for light/dark support.

The CSS file must be inside `root`. Missing files produce a source-specific error. Vite handles CSS edits, `@import` and relative `url()` assets, and bundles the stylesheet in static builds. This option is independent of `presentation`; no custom renderer or layout is required.

Status chips use the same `--sbmd-tag-*` variables as tags. Select a status by its data attribute to customize its appearance:

```css
.storybook-addon-md-tag[data-status='stable' i] {
  --sbmd-tag-color: var(--team-success-text, #1a7f37);
  --sbmd-tag-background: var(--team-success-background, #dafbe1);
  --sbmd-tag-border: 1px solid currentColor;
}
```

The `i` flag matches `Stable` and `stable` without changing the authored value. The addon accepts any status and leaves color mappings to your stylesheet. The example maps Stable to success colors in both themes.

### Complete styling example

The example theme is based on [GitHub’s Primer design system](https://primer.style/product/) and its [semantic color guidance](https://primer.style/product/getting-started/foundations/color-usage/). It uses neutral surfaces, blue links, system typography, subtle borders, and outlined labels in light and dark mode. This is a local adaptation, with no Primer runtime dependency.

Open **Guides → Introduction** or the component Markdown pages to see the shared theme.

Copy [`example/.storybook/markdown.css`](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/markdown.css) as a starting point. Its `--sbmd-*` variables reference Tailwind theme variables defined in [`tailwind.css`](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/tailwind.css), including colors, typography, spacing, and radii. The theme uses `light-dark()` with `color-scheme: light dark`. The example’s manager and Docs container also subscribe to system theme changes, so Storybook’s sidebar, controls, and Docs surfaces update without reloading.

The standalone content is in [`example/docs/Introduction.md`](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/docs/Introduction.md). Styles remain in one shared stylesheet.

To reuse a layout or renderer, configure `presentation: '.storybook/markdown-presentation.tsx'` and export either or both components:

```tsx
import { DefaultLayout, DefaultMarkdownRenderer } from 'storybook-addon-md/runtime';
import type { LayoutProps, MarkdownDocument } from 'storybook-addon-md/runtime';

export function Layout(props: LayoutProps) {
  return <DefaultLayout {...props} />;
}

export function MarkdownRenderer(document: MarkdownDocument) {
  return <DefaultMarkdownRenderer {...document} />;
}
```

`MarkdownRenderer` receives `{ markdown, metadata, source }`: the processed Markdown string with resolved asset URLs, all frontmatter fields, and the root-relative source path. Replace it with your existing Markdown renderer or wrap it to display selected metadata.

`Layout` receives `{ documents, title, attached, children, examples }`. `children` contains rendered documentation; `examples` contains native example and props blocks, or `null` for standalone pages. Render both to retain documentation and examples. `title` is the sidebar title for standalone pages and an empty string for attached pages; `DefaultLayout` uses Storybook's `Title` block for attached pages. You own any custom layout styles, without changing generated pages.

## Development and verification

```sh
npm install
npm run build
npm run storybook
npm test
npm run test:watch
npm run check
npm run lint
npm run format:check
npm run build-storybook
npx playwright install chromium
npm run test:browser
npm run test:e2e
npm run test:package
npm pack
```

The example uses Tailwind CSS v4 through `@tailwindcss/vite`, `class-variance-authority` for variants, and `clsx` for composing class names. These are development dependencies used only by the example. Tailwind’s theme and utility layers are imported without Preflight to preserve Storybook Docs defaults. Static theme variables keep the tokens referenced by `markdown.css` available in production builds.

The example components use `light-dark()` color pairs with `color-scheme: light dark` on `:root`, so standalone stories follow the system preference without reloading.

The example includes standalone pages, sibling association, shared documentation, relative Markdown links, and custom styling. The package smoke test creates its own image fixture to verify asset bundling. Its Docs theme follows changes to the browser's system color preference without reloading.

All tests, helpers, and runner configurations are written in TypeScript and included in `npm run check`. Standalone test helpers use Node’s built-in type stripping. Vitest runs unit tests directly against the TypeScript source, covering discovery, frontmatter, associations, asset resolution and watcher recovery. `npm test` runs once; `npm run test:watch` reruns affected tests as files change. Vitest Browser Mode with the Playwright provider runs rendering, metadata, CSS variable, and theme tests using Chromium (`npm run test:browser`, or `npm run test:browser:watch` for watch mode). The full Storybook end-to-end suite (`npm run test:e2e`) and isolated package smoke check remain separate. The end-to-end suite starts development and static servers on ports 16006/16007, verifies rendered docs, working examples, generated props, assets, customization, light/dark themes, and live sidebar additions/edits/deletions. Screenshots and failure traces go to `test-results/`. `test:package` installs a tarball in an isolated consumer, checks successful/failing static builds, and verifies the first Markdown file added to an initially empty discovery directory. It uses port 16008 and Chromium.

The development watcher observes `root` and rescans when matching Markdown or its referenced stories, assets, stylesheet, or presentation module changes and lets Storybook/Vite refresh the preview; interactive story state may reset. Keep `root` focused on your project. Large monorepos, simultaneous Storybooks sharing one config directory, symlinked content directories, raw-HTML assets and MDX authoring are outside this initial scope.

Oxlint checks code with `npm run lint`; `npm run lint:fix` applies available fixes. Oxfmt formats source, examples, tests, and documentation with `npm run format`; `npm run format:check` checks without writing. Both exclude generated files, build output, and test reports.

## Integration

`src/content.ts` handles content and validation; `src/generator.ts` writes disposable modules; `src/preset.ts` connects discovery and watching; `src/runtime.tsx` renders Docs blocks. The preset uses Storybook's existing MDX compilation and indexing, with no custom indexer.

Integration references: [preset APIs](https://storybook.js.org/docs/addons/writing-presets), [Meta association](https://storybook.js.org/docs/api/doc-blocks/doc-block-meta), [Markdown block](https://storybook.js.org/docs/api/doc-blocks/doc-block-markdown), and [Vite static assets](https://vite.dev/guide/assets).

CI runs the supported configuration on Node 24 and Linux, including Chromium browser tests, static builds, and the packed-consumer smoke check. Asset filenames containing URL-reserved characters are copied to safe disposable filenames in the generated folder before Vite bundles them.
