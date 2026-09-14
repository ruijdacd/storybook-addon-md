# CSS variable reference

Set these variables on `.storybook-addon-md-page` in the file configured by `stylesheet`. All are optional. The shared addon stylesheet supplies defaults, with text, links, borders, and inline-code backgrounds taken from the active Storybook Docs theme.

```css
.storybook-addon-md-page {
  --sbmd-font-size: 1rem;
  --sbmd-monospace-font-family: 'JetBrains Mono', monospace;
  --sbmd-h2-size: 1.625rem;
  --sbmd-paragraph-spacing: 1.25rem;
  --sbmd-quote-border: 0.1875rem solid currentColor;
  --sbmd-quote-radius: 0.5rem;
  --sbmd-table-cell-padding: 0.75rem 1rem;
  --sbmd-tag-radius: 0.375rem;
}
```

Default lengths use `rem`, preserving their original sizes at a 16px root font size and scaling with the document root font size. Set `--sbmd-monospace-font-family` to customize inline code and fenced code blocks; it defaults to Storybook’s monospace theme font.

Variables accept normal CSS values for the property listed below, including `clamp()`, `calc()`, and references to your own theme variables. Border variables accept full border shorthands. Heading margins set space above the heading; title margin sets space below it. Paragraph spacing also applies to lists. Tag margin sets space below the chip list.

Use your theme selector to override colors in dark mode. The [complete example](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/markdown.css) maps the addon variables to Tailwind v4 theme variables. Its `light-dark()` colors follow the system preference.

| Variable                          | CSS property                  |
| --------------------------------- | ----------------------------- |
| `--sbmd-background`               | `background`                  |
| `--sbmd-callout-background`       | `background`                  |
| `--sbmd-callout-border`           | `border-inline-start`         |
| `--sbmd-callout-caution-color`    | Caution accent color          |
| `--sbmd-callout-color`            | `color`                       |
| `--sbmd-callout-important-color`  | Important accent color        |
| `--sbmd-callout-label-color`      | `color`                       |
| `--sbmd-callout-label-margin`     | `margin-bottom`               |
| `--sbmd-callout-label-size`       | `font-size`                   |
| `--sbmd-callout-label-weight`     | `font-weight`                 |
| `--sbmd-callout-margin`           | `margin`                      |
| `--sbmd-callout-note-color`       | Note accent color             |
| `--sbmd-callout-padding`          | `padding`                     |
| `--sbmd-callout-radius`           | `border-radius`               |
| `--sbmd-callout-tip-color`        | Tip accent color              |
| `--sbmd-callout-warning-color`    | Warning accent color          |
| `--sbmd-checkbox-color`           | `accent-color`                |
| `--sbmd-checkbox-gap`             | `margin-inline-end`           |
| `--sbmd-code-border`              | `border`                      |
| `--sbmd-code-padding`             | `padding`                     |
| `--sbmd-code-radius`              | `border-radius`               |
| `--sbmd-color`                    | `color`                       |
| `--sbmd-font-family`              | `font-family`                 |
| `--sbmd-font-size`                | `font-size`                   |
| `--sbmd-h1-size`                  | `font-size`                   |
| `--sbmd-h2-border`                | `border-bottom`               |
| `--sbmd-h2-letter-spacing`        | `letter-spacing`              |
| `--sbmd-h2-margin`                | `margin-top`                  |
| `--sbmd-h2-padding`               | `padding-bottom`              |
| `--sbmd-h2-size`                  | `font-size`                   |
| `--sbmd-h3-letter-spacing`        | `letter-spacing`              |
| `--sbmd-h3-margin`                | `margin-top`                  |
| `--sbmd-h3-size`                  | `font-size`                   |
| `--sbmd-h4-size`                  | `font-size`                   |
| `--sbmd-h5-size`                  | `font-size`                   |
| `--sbmd-h6-size`                  | `font-size`                   |
| `--sbmd-heading-color`            | `color`                       |
| `--sbmd-heading-font-family`      | `font-family`                 |
| `--sbmd-heading-line-height`      | `line-height`                 |
| `--sbmd-heading-weight`           | `font-weight`                 |
| `--sbmd-image-border`             | `border`                      |
| `--sbmd-image-margin`             | `margin-block`                |
| `--sbmd-image-radius`             | `border-radius`               |
| `--sbmd-inline-code-background`   | `background`                  |
| `--sbmd-inline-code-border`       | `border`                      |
| `--sbmd-inline-code-color`        | `color`                       |
| `--sbmd-inline-code-padding`      | `padding`                     |
| `--sbmd-inline-code-radius`       | `border-radius`               |
| `--sbmd-inline-code-size`         | `font-size`                   |
| `--sbmd-line-height`              | `line-height`                 |
| `--sbmd-link-color`               | `color`                       |
| `--sbmd-link-decoration`          | `text-decoration`             |
| `--sbmd-link-focus-offset`        | `outline-offset`              |
| `--sbmd-link-focus-outline`       | `outline`                     |
| `--sbmd-link-hover-thickness`     | `text-decoration-thickness`   |
| `--sbmd-link-radius`              | `border-radius`               |
| `--sbmd-link-thickness`           | `text-decoration-thickness`   |
| `--sbmd-link-underline-offset`    | `text-underline-offset`       |
| `--sbmd-list-item-spacing`        | `margin-top`                  |
| `--sbmd-list-marker-color`        | `color`                       |
| `--sbmd-monospace-font-family`    | `font-family` (Markdown code) |
| `--sbmd-max-width`                | `max-width`                   |
| `--sbmd-page-border`              | `border`                      |
| `--sbmd-page-padding`             | `padding`                     |
| `--sbmd-page-radius`              | `border-radius`               |
| `--sbmd-paragraph-spacing`        | `margin-block`                |
| `--sbmd-quote-background`         | `background`                  |
| `--sbmd-quote-border`             | `border-inline-start`         |
| `--sbmd-quote-margin`             | `margin`                      |
| `--sbmd-quote-padding`            | `padding`                     |
| `--sbmd-quote-radius`             | `border-radius`               |
| `--sbmd-rule-color`               | `background`                  |
| `--sbmd-rule-height`              | `height`                      |
| `--sbmd-rule-margin`              | `margin-block`                |
| `--sbmd-table-align`              | `text-align`                  |
| `--sbmd-table-background`         | `background`                  |
| `--sbmd-table-border`             | `border`                      |
| `--sbmd-table-cell-padding`       | `padding`                     |
| `--sbmd-table-heading-background` | `background`                  |
| `--sbmd-table-heading-weight`     | `font-weight`                 |
| `--sbmd-table-margin`             | `margin-block`                |
| `--sbmd-table-stripe-background`  | `background`                  |
| `--sbmd-tag-background`           | `background`                  |
| `--sbmd-tag-border`               | `border`                      |
| `--sbmd-tag-color`                | `color`                       |
| `--sbmd-tag-font-size`            | `font-size`                   |
| `--sbmd-tag-font-weight`          | `font-weight`                 |
| `--sbmd-tag-gap`                  | `gap`                         |
| `--sbmd-tag-line-height`          | `line-height`                 |
| `--sbmd-tag-padding`              | `padding`                     |
| `--sbmd-tag-radius`               | `border-radius`               |
| `--sbmd-title-letter-spacing`     | `letter-spacing`              |
| `--sbmd-title-line-height`        | `line-height`                 |
| `--sbmd-title-margin`             | `margin-bottom`               |
| `--sbmd-title-size`               | `font-size`                   |

Status chips have `data-status` set to the original frontmatter value. Override `--sbmd-tag-*` on selectors such as `.storybook-addon-md-tag[data-status="stable" i]` to assign a status-specific appearance.

Callouts are `.storybook-addon-md-callout` elements with `data-callout` set to `note`, `tip`, `important`, `warning`, or `caution`, and a `.storybook-addon-md-callout-label` paragraph. Each type’s accent color sets the default border color and label color. Per-type accent variables default to Storybook theme colors chosen for the light or dark base. `--sbmd-callout-color` applies to text inside callouts; `--sbmd-callout-border` and `--sbmd-callout-label-color` replace the accent for every type.

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

Variables cover typography, spacing, links, code, tables, images, and chips. They inherit from your theme container, and default text and link colors follow the active Docs theme. See [Variables](#variables) for the complete list.

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
  --sbmd-callout-radius: 0.375rem;
  --sbmd-callout-label-weight: 500;
}
```

Use `data-callout` for anything that differs per type beyond the accent color, such as a tinted background or a different border width:

```css
.storybook-addon-md-callout[data-callout='caution'] {
  --sbmd-callout-background: light-dark(#ffebe9, #2d1214);
  --sbmd-callout-border: 0.375rem solid var(--sbmd-callout-caution-color);
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
