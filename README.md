# Storybook Markdown

A Storybook addon for **ordinary Markdown documentation**. Write `.md` files beside your components or in a docs folder, and browse them inside Storybook.

- **Automatic discovery.** Configure file patterns once. Additions, edits, and deletions update during development.
- **Component and standalone docs.** Attach guidance to existing stories, share it across components, or publish a page on its own.
- **Native Docs.** Keep Storybook’s examples, generated props, and documentation styling.
- **Your theme.** Customize content through CSS variables, a stylesheet, or your own layout and Markdown renderer.
- **Static builds.** Relative images and downloads are bundled with your documentation.

Write `Button.metadata.md` beside `Button.stories.tsx`:

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

The component gets a **Markdown** Docs entry with your guidance, status and tag chips, examples, and props. Authors manage Markdown files; the addon manages disposable MDX wrappers.

## Table of Contents

- [Install](#install)
- [Guide](#guide)
- [Configuration](#configuration)
- [Styling](#styling)
- [Example](#example)
- [Development](#development)
- [Releasing](#releasing)
- [Limitations](#limitations)

## Install

The tested setup is **Storybook 10.6.0**, **@storybook/react-vite 10.6.0**, **@storybook/addon-docs 10.6.0**, **Vite 7.3.6**, and **React 19.2.4**. Node 22.13+ is required; local verification uses Node 24.21.0 and CI uses Node 24 on Linux.

This repository uses [Nub](https://nubjs.com/docs) 0.7.5. The checked-in `nub.lock` pins dependencies, and `.npmrc` selects the hoisted layout for Storybook and Vitest. CI installs with `nub install --frozen-lockfile`.

To build an installable tarball from this repository:

```sh
nub install
nub pack
```

Install it in your Storybook project:

```sh
nub add -D /path/to/storybook-addon-md-0.1.0.tgz @storybook/addon-docs@10.6.0
```

The package ships compiled JavaScript and TypeScript declarations. Consumers do not need to compile the addon.

Register it after addon-docs in `.storybook/main.ts`:

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

Keep your normal story patterns: referenced story files must match them. Markdown files belong in the addon’s `patterns`, not Storybook’s `stories` list.

Add `storybook-markdown-generated/` to `.gitignore`.

## Guide

### Standalone Pages

A plain `docs/Introduction.md` appears at `Documentation/docs/Introduction`. No frontmatter, component, or story file is required.

Use `title` to choose its sidebar location:

```md
---
title: Guides/Introduction
---

## Getting started

Write ordinary Markdown here.
```

### Component Documentation

Name a document `Button.metadata.md` beside `Button.stories.tsx` to associate it automatically. The convention also checks `.stories.ts`, `.stories.jsx`, and `.stories.js`. Missing or ambiguous siblings produce an error.

For a different location or filename, set `stories` relative to the Markdown file:

```yaml
stories: ../components/Button.stories.tsx
```

An explicit `stories` field takes precedence over the filename convention. Existing stories and Autodocs pages remain available. Each component’s **Markdown** entry combines its attached documents in source-path order, followed by its primary example, controls/props, and remaining examples.

### Shared Documentation

Use an array to attach one document to several story files:

```yaml
stories:
  - ../components/Button.stories.tsx
  - ../components/Toggle.stories.tsx
```

Each referenced component displays the shared content alongside its own documentation and examples.

### Frontmatter

Frontmatter is optional YAML with lowercase top-level keys.

| Field        | Value                                     | Behavior                                                                              |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `title`      | Non-empty string                          | Sidebar location for a standalone page. Does not relocate attached docs.              |
| `stories`    | Relative path or non-empty array of paths | Associates the document with story files.                                             |
| `tags`       | Array of non-empty strings                | Renders chips below the title. These are content labels, not Storybook indexing tags. |
| `status`     | Non-empty string                          | Renders a chip after the tags, preserving the value in `data-status`.                 |
| Other fields | YAML values                               | Preserved as metadata for custom layouts and renderers.                               |

Shared pages deduplicate tags and statuses separately in document order. A tag and status with the same label remain separate chips. Fields such as `component` and `category` have no built-in meaning.

Invalid frontmatter, duplicate standalone sidebar titles, and missing references produce errors with source paths. Development errors appear in the terminal and Vite overlay or Storybook error view, then recover when corrected.

### Links and Assets

Use Markdown links and images, including reference-style syntax:

```md
![Button states](./assets/button-states.svg)

[Download the checklist](./checklist.pdf)
```

Local paths resolve from the source `.md` file. URL-encoded filenames and fragments are supported. Files are validated and bundled as hashed assets in static builds. Filenames containing URL-reserved characters use safe disposable copies in the generated folder.

**Links to `.md` files open their original source**, including frontmatter. They do not navigate to the rendered Storybook page or recursively bundle the linked document’s assets. For page navigation, use a Storybook URL such as `/?path=/docs/guides-introduction--docs`, adjusted for your deployment prefix.

External, fragment-only, query-only, and root-relative URLs are unchanged. Supply root-relative assets through Storybook’s `staticDirs`. Source files and local references must stay inside `root`; referenced files become part of the static build.

## Configuration

| Option         | Default                        | Description                                                              |
| -------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `patterns`     | Required                       | Array of Markdown globs relative to `root`. Supports negative globs.     |
| `exclude`      | `[]`                           | Excluded globs relative to `root`. Exclusions take precedence.           |
| `root`         | `..`                           | Content root relative to the Storybook config directory.                 |
| `generatedDir` | `storybook-markdown-generated` | Visible folder name under the working directory.                         |
| `stylesheet`   | None                           | CSS file relative to `root`, loaded for documentation pages.             |
| `presentation` | None                           | Module relative to `root`, exporting `Layout` and/or `MarkdownRenderer`. |

Keep the Storybook config directory inside `root`. Restart Storybook after changing addon options.

### Generated Files

The addon creates a disposable subdirectory per configuration, registers its MDX glob before indexing, and removes obsolete files. Ignore your configured `generatedDir` in Git and leave its contents to the addon.

The folder must be a visible name containing letters, digits, hyphens, or underscores. Leading-dot paths and `node_modules` interfere with Storybook 10.6’s watcher; nested paths and `storybook-static` are also rejected.

### Sidebar Order

Generated filenames are opaque identifiers. Set Storybook’s `parameters.options.storySort` when sidebar order matters. The [example preview] puts Guides first and sorts component titles alphabetically.

## Styling

The default presentation uses native Storybook Docs blocks and one shared stylesheet. Existing `parameters.docs.container` and `parameters.docs.theme` still apply.

### CSS Variables

Set `stylesheet: '.storybook/markdown.css'` in the addon options, then define your overrides:

```css
.storybook-addon-md-page {
  --sbmd-font-size: 16px;
  --sbmd-line-height: 1.8;
  --sbmd-heading-color: currentColor;
  --sbmd-tag-radius: 6px;
  --sbmd-tag-border: 1px solid currentColor;
}
```

Variables cover typography, spacing, links, code, tables, images, and chips. They inherit from your theme container, and default text and link colors follow the active Docs theme. See the [CSS variable reference](STYLING.md) for the complete list.

Use ordinary CSS for other properties. `.storybook-addon-md` wraps Markdown content, including custom renderer output; titles, props, and examples sit outside it. Other stable selectors are `.storybook-addon-md-page`, `.storybook-addon-md-title`, `.storybook-addon-md-tags`, and `.storybook-addon-md-tag`.

The stylesheet is global to the preview, so scope selectors and account for Storybook’s specificity. For example, use `.sbdocs-content .storybook-addon-md h2` when overriding its heading rules. Vite handles CSS edits, imports, and relative `url()` assets.

### Status Chips

Status chips share the tag variables. Use `data-status` to map values to your theme:

```css
.storybook-addon-md-tag[data-status='stable' i] {
  --sbmd-tag-color: light-dark(#1a7f37, #3fb950);
  --sbmd-tag-background: light-dark(#dafbe1, #12261e);
  --sbmd-tag-border: 1px solid currentColor;
}
```

The `i` flag matches both `Stable` and `stable`. The addon accepts any status; your stylesheet decides its colors. Set `color-scheme: light dark` on the theme container when using `light-dark()`.

### Light and Dark Themes

Use Storybook’s standard Docs theme configuration for a fixed theme:

```ts
import { themes } from 'storybook/theming';

export default {
  parameters: { docs: { theme: themes.dark } },
};
```

For live system-preference switching, follow the example’s [Docs container] and [manager configuration]. They subscribe to preference changes so Storybook’s interface and documentation update together without reloading.

### Custom Layouts and Renderers

Set `presentation: '.storybook/markdown-presentation.tsx'` and export either or both components:

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

`MarkdownRenderer` receives `{ markdown, metadata, source }`: processed Markdown with resolved asset URLs, preserved frontmatter, and the source path relative to `root`.

`Layout` receives `{ documents, title, attached, children, examples }`. Render `children` and `examples` to keep documentation and native example/props blocks. `examples` is `null` for standalone pages. `title` contains the standalone sidebar title and is empty for attached pages; `DefaultLayout` uses Storybook’s `Title` block for those.

Both customization files must stay inside `root`. Missing files produce source-specific errors. Styling and presentation are independent options.

## Example

Run the included Storybook:

```sh
nub install
nub run storybook
```

Open **Guides → Introduction**, **Components → Button**, or **Components → Toggle** for standalone, attached, and shared documentation.

The theme takes its direction from [GitHub Primer]. [Markdown styles] reference [Tailwind theme variables] for shared colors, typography, spacing, and radii. The example uses Tailwind v4, `clsx`, and `class-variance-authority`; these are development dependencies, not addon requirements. Tailwind Preflight is omitted to preserve native Docs styles.

Components use `light-dark()` and `color-scheme: light dark` on `:root`. The manager and Docs container also follow system-preference changes live.

## Development

Install Chromium for the browser suites:

```sh
nub exec playwright install chromium
```

| Command                   | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `nub run build`           | Compile the addon and its declarations.                       |
| `nub run check`           | Build the addon, then type-check source, examples, and tests. |
| `nub run lint`            | Run Oxlint. Use `lint:fix` for automatic fixes.               |
| `nub run format:check`    | Check Oxfmt formatting. Use `format` to write changes.        |
| `nub run test`            | Run Vitest unit tests.                                        |
| `nub run test:browser`    | Run Vitest Browser Mode with Playwright/Chromium.             |
| `nub run test:e2e`        | Verify development and static Storybooks in Chromium.         |
| `nub run test:package`    | Install and verify a packed addon in an isolated consumer.    |
| `nub run build-storybook` | Build the example as a static site.                           |
| `nub pack`                | Build and package the addon.                                  |

Use `test:watch` or `test:browser:watch` while developing. End-to-end tests use ports 16006/16007, and the package smoke check uses 16008. Browser screenshots and failure traces go to `test-results/`.

[CI] runs the checks on Node 24 and Linux, including a dependency audit. Tests cover discovery, associations, watcher recovery, assets, customization, keyboard interaction, and live theme switching. The package smoke check supplies its own image fixture.

Content parsing lives in `src/content.ts`, disposable generation in `src/generator.ts`, Storybook integration in `src/preset.ts`, and presentation in `src/runtime.tsx`. The addon uses Storybook’s MDX compilation and indexing; it does not install a custom indexer.

Report reproducible bugs in the [issue tracker].

## Releasing

Releases use [Changesets](https://changesets.dev/guide/automating). For a user-facing change, run `nub run changeset`, choose a patch/minor/major bump, and include the generated release note in your PR. Tooling-only changes do not need a release note.

After CI passes for a push to `main`, `release.yml` opens or updates a release PR with the version and changelog. Merge that PR to publish after CI passes again. Nub manages dependencies and scripts; Changesets invokes npm for publishing.

One-time setup:

1. If the package does not exist on npm yet, publish the initial version from a clean checkout: `nub run build`, `npm login`, then `npm publish --access public`.
2. In the npm package’s **Settings → Trusted publishing**, select GitHub Actions, owner `ruijdacd`, repository `storybook-addon-md`, workflow `release.yml`, and allow publishing. Leave the environment empty.
3. In GitHub’s **Settings → Actions → General**, enable **Allow GitHub Actions to create and approve pull requests**.

No `NPM_TOKEN` secret is needed. The workflow uses GitHub’s automatic token for release PRs and OIDC for [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/). It installs npm 11 with Node 24 to support OIDC.

Release PRs created with the automatic GitHub token do not trigger PR workflows. If branch protection requires those checks, close and reopen the release PR yourself to trigger CI before merging. The release workflow always waits for CI on the merged commit.

## Limitations

- Only the Storybook, React, and Vite setup listed under [Install](#install) has been tested. Other renderers and builders are unsupported.
- Markdown supports tables, lists, fenced code, and reference links. Braces and JSX-like text are content, never evaluated. The default renderer displays raw HTML as text; use Markdown syntax for links and images.
- The **Markdown** page name is reserved under attached components. Avoid giving a hand-written MDX page the same name there.
- The watcher observes `root` and rescans matching Markdown when documentation or its dependencies change. Interactive story state may reset. Keep `root` focused on your project.
- Large monorepos, simultaneous Storybooks sharing one config directory, symlinked content directories, and MDX authoring are outside the initial scope.

[example preview]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/preview.ts
[Docs container]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/SystemDocsContainer.tsx
[manager configuration]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/manager.ts
[GitHub Primer]: https://primer.style/product/
[Markdown styles]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/markdown.css
[Tailwind theme variables]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/tailwind.css
[CI]: https://github.com/ruijdacd/storybook-addon-md/actions/workflows/ci.yml
[issue tracker]: https://github.com/ruijdacd/storybook-addon-md/issues
