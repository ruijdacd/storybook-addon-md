# CSS variable reference

Set these variables on `.storybook-addon-md-page` in the file configured by `stylesheet`. All are optional. The shared addon stylesheet supplies defaults, with text, links, borders, and inline-code backgrounds taken from the active Storybook Docs theme.

```css
.storybook-addon-md-page {
  --sbmd-font-size: 1rem;
  --sbmd-monospace-font-family: 'JetBrains Mono', monospace;
  --sbmd-border-color: #d1d9e0;
  --sbmd-block-spacing: 1.25rem;
  --sbmd-quote-border: 0.1875rem solid currentColor;
  --sbmd-table-cell-padding: 0.75rem 1rem;
  --sbmd-tag-radius: 0.375rem;
}
```

Default lengths use `rem`, preserving their original sizes at a 16px root font size and scaling with the document root font size. Set `--sbmd-monospace-font-family` to customize inline code and fenced code blocks; it defaults to Storybook’s monospace theme font.

Variables accept normal CSS values for the property listed below, including `clamp()`, `calc()`, and references to your own theme variables. Border variables accept full border shorthands.

Three shared tokens cover most of the page. `--sbmd-border-color` colors heading rules, table cells, inline code, horizontal rules, and the default quote border. `--sbmd-block-spacing` sets the vertical rhythm of paragraphs, lists, quotes, callouts, tables, the title, and the tag list. `--sbmd-heading-spacing` sets the space above headings and around horizontal rules.

Use your theme selector to override colors in dark mode. The [complete example](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/markdown.css) maps the addon variables to Tailwind v4 theme variables. Its `light-dark()` colors follow the system preference.

| Variable                         | Applies to                                        |
| -------------------------------- | ------------------------------------------------- |
| `--sbmd-font-family`             | Page and Markdown text                            |
| `--sbmd-font-size`               | Markdown text                                     |
| `--sbmd-line-height`             | Markdown text                                     |
| `--sbmd-color`                   | Page and Markdown text                            |
| `--sbmd-monospace-font-family`   | Inline code and code blocks                       |
| `--sbmd-border-color`            | Heading rules, tables, inline code, rules, quotes |
| `--sbmd-block-spacing`           | Vertical margin of blocks, title, and tag list    |
| `--sbmd-heading-spacing`         | Space above headings and around rules             |
| `--sbmd-heading-color`           | Headings and title                                |
| `--sbmd-heading-font-family`     | Headings and title                                |
| `--sbmd-heading-weight`          | Headings and title                                |
| `--sbmd-h1-size`                 | Title and `h1`                                    |
| `--sbmd-h2-size`                 | `h2`                                              |
| `--sbmd-h3-size`                 | `h3`                                              |
| `--sbmd-h4-size`                 | `h4`                                              |
| `--sbmd-h5-size`                 | `h5`                                              |
| `--sbmd-h6-size`                 | `h6`                                              |
| `--sbmd-link-color`              | Links                                             |
| `--sbmd-link-decoration`         | Link `text-decoration`                            |
| `--sbmd-list-item-spacing`       | Space between list items                          |
| `--sbmd-quote-border`            | Start border of quotes and callouts               |
| `--sbmd-quote-padding`           | Quote padding                                     |
| `--sbmd-callout-padding`         | Callout padding                                   |
| `--sbmd-callout-label-weight`    | Callout label weight                              |
| `--sbmd-callout-note-color`      | Note accent color                                 |
| `--sbmd-callout-tip-color`       | Tip accent color                                  |
| `--sbmd-callout-important-color` | Important accent color                            |
| `--sbmd-callout-warning-color`   | Warning accent color                              |
| `--sbmd-callout-caution-color`   | Caution accent color                              |
| `--sbmd-code-radius`             | Inline code and code block radius                 |
| `--sbmd-code-padding`            | Code block padding                                |
| `--sbmd-inline-code-padding`     | Inline code padding                               |
| `--sbmd-inline-code-background`  | Inline code background                            |
| `--sbmd-inline-code-size`        | Inline code font size                             |
| `--sbmd-table-cell-padding`      | Table cell padding                                |
| `--sbmd-table-stripe-background` | Even table row background                         |
| `--sbmd-tag-color`               | Tag text                                          |
| `--sbmd-tag-background`          | Tag background                                    |
| `--sbmd-tag-border`              | Tag border                                        |
| `--sbmd-tag-radius`              | Tag radius                                        |
| `--sbmd-tag-padding`             | Tag padding                                       |
| `--sbmd-tag-font-size`           | Tag font size                                     |

Status chips have `data-status` set to the original frontmatter value. Override `--sbmd-tag-*` on selectors such as `.storybook-addon-md-tag[data-status="stable" i]` to assign a status-specific appearance.

Callouts are `.storybook-addon-md-callout` elements with `data-callout` set to `note`, `tip`, `important`, `warning`, or `caution`, and a `.storybook-addon-md-callout-label` paragraph. Each type’s accent color sets the border color and label color. Per-type accent variables default to Storybook theme colors chosen for the light or dark base. Callouts share `--sbmd-quote-border` for the border width and style.

Properties without a variable use ordinary CSS. The addon does not set backgrounds, radii, or borders on the page, quotes, callouts, or images, so selectors such as `.storybook-addon-md img` work at any specificity. Properties the addon does set, such as heading letter spacing or table alignment, need a selector that matches the addon’s specificity, for example `.sbdocs-content .storybook-addon-md h2`.

These styles target Markdown content and its title/chips. Story canvases, props controls, and syntax-highlighting colors still use Storybook’s theme. Custom renderers can use the shared styles when they produce matching HTML elements; custom layouts own any additional structure. Internal `--sbmd-native-*` variables carry Storybook theme values and are not customization hooks.

## Customization

The default presentation uses native Storybook Docs blocks and one shared stylesheet. Existing `parameters.docs.container` and `parameters.docs.theme` still apply.

### CSS Variables

Set `stylesheet: '.storybook/markdown.css'` in the addon options, then define your overrides:

```css
.storybook-addon-md-page {
  --sbmd-font-size: 1rem;
  --sbmd-monospace-font-family: 'JetBrains Mono', monospace;
  --sbmd-line-height: 1.8;
  --sbmd-heading-color: currentColor;
  --sbmd-tag-radius: 0.375rem;
  --sbmd-tag-border: 0.0625rem solid currentColor;
}
```

Variables cover typography, spacing, borders, links, code, tables, callouts, and chips. They inherit from your theme container, and default text and link colors follow the active Docs theme. See the [reference](#css-variable-reference) for the complete list.

Use ordinary CSS for other properties. `.storybook-addon-md` wraps Markdown content, including custom renderer output; titles, props, and examples sit outside it. Other stable selectors are `.storybook-addon-md-page`, `.storybook-addon-md-title`, `.storybook-addon-md-tags`, and `.storybook-addon-md-tag`.

The stylesheet is global to the preview, so scope selectors and account for Storybook’s specificity. For example, use `.sbdocs-content .storybook-addon-md h2` when overriding its heading rules. Vite handles CSS edits, imports, and relative `url()` assets.

### Status Chips

Status chips share the tag variables. Use `data-status` to map values to your theme:

```css
.storybook-addon-md-tag[data-status='stable' i] {
  --sbmd-tag-color: light-dark(#1a7f37, #3fb950);
  --sbmd-tag-background: light-dark(#dafbe1, #12261e);
  --sbmd-tag-border: 0.0625rem solid currentColor;
}
```

The `i` flag matches both `Stable` and `stable`. The addon accepts any status; your stylesheet decides its colors. Set `color-scheme: light dark` on the theme container when using `light-dark()`.

### Callouts

Map the accent colors to your design tokens, and adjust the shared box and label styles:

```css
.storybook-addon-md-page {
  --sbmd-callout-note-color: light-dark(#0969da, #4493f8);
  --sbmd-callout-tip-color: light-dark(#1a7f37, #3fb950);
  --sbmd-callout-important-color: light-dark(#8250df, #ab7df8);
  --sbmd-callout-warning-color: light-dark(#9a6700, #d29922);
  --sbmd-callout-caution-color: light-dark(#d1242f, #f85149);
  --sbmd-callout-padding: 0.5rem 1rem;
  --sbmd-callout-label-weight: 500;
}
```

Use `data-callout` for anything that differs per type beyond the accent color, such as a tinted background or a rounded corner:

```css
.storybook-addon-md-callout[data-callout='caution'] {
  background: light-dark(#ffebe9, #2d1214);
  border-radius: 0.375rem;
}
```

The label is visible text, so callouts remain distinguishable without color. The markup is static: no `role="alert"` or live region is used.

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

`MarkdownRenderer` receives `{ markdown, metadata, source, heading? }`: processed Markdown with resolved asset URLs, preserved frontmatter, and the source path relative to the project folder.

Callouts are rendered by `DefaultMarkdownRenderer`. A custom `MarkdownRenderer` receives them as ordinary blockquotes whose first line is the `[!NOTE]` marker, serialized as `\[!NOTE]` so that renderers treat the brackets as text. Render callouts yourself or delegate to `DefaultMarkdownRenderer`. Custom layouts are unaffected because callouts are part of `children`.

`Layout` receives `{ documents, title, attached, children, examples, heading, tagFields }`. A standalone leading H1 is extracted in the default pipeline and supplied as the rendered `heading` node; render it instead of your fallback title. The remaining Markdown is supplied through `children`, while source files and manifests stay intact. `tagFields` lists configured metadata fields for tag display. Render `children` and `examples` to keep documentation and native example/props blocks. `examples` is `null` for standalone pages. `title` contains the standalone sidebar title and is empty for attached pages; `DefaultLayout` uses Storybook’s `Title` block for those.

Customization paths are relative to the project folder and must stay inside it. Missing files produce source-specific errors. Styling and presentation are independent options.

[Docs container]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/SystemDocsContainer.tsx
[manager configuration]: https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/manager.ts
