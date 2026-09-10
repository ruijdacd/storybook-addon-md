# CSS variable reference

Set these variables on `.storybook-addon-md-page` in the file configured by `stylesheet`. All are optional. The shared addon stylesheet supplies defaults, with text, links, borders, and inline-code backgrounds taken from the active Storybook Docs theme.

```css
.storybook-addon-md-page {
  --sbmd-font-size: 16px;
  --sbmd-h2-size: 26px;
  --sbmd-paragraph-spacing: 20px;
  --sbmd-quote-border: 3px solid currentColor;
  --sbmd-quote-radius: 8px;
  --sbmd-table-cell-padding: 12px 16px;
  --sbmd-tag-radius: 6px;
}
```

Variables accept normal CSS values for the property listed below, including `clamp()`, `calc()`, and references to your own theme variables. Border variables accept full border shorthands. Heading margins set space above the heading; title margin sets space below it. Paragraph spacing also applies to lists. Tag margin sets space below the chip list.

Use your theme selector to override colors in dark mode. The [complete example](https://github.com/ruijdacd/storybook-addon-md/blob/main/example/.storybook/markdown.css) maps the addon variables to Tailwind v4 theme variables. Its `light-dark()` colors follow the system preference.

| Variable                          | CSS property                |
| --------------------------------- | --------------------------- |
| `--sbmd-background`               | `background`                |
| `--sbmd-checkbox-color`           | `accent-color`              |
| `--sbmd-checkbox-gap`             | `margin-inline-end`         |
| `--sbmd-code-border`              | `border`                    |
| `--sbmd-code-padding`             | `padding`                   |
| `--sbmd-code-radius`              | `border-radius`             |
| `--sbmd-color`                    | `color`                     |
| `--sbmd-font-family`              | `font-family`               |
| `--sbmd-font-size`                | `font-size`                 |
| `--sbmd-h1-size`                  | `font-size`                 |
| `--sbmd-h2-border`                | `border-bottom`             |
| `--sbmd-h2-letter-spacing`        | `letter-spacing`            |
| `--sbmd-h2-margin`                | `margin-top`                |
| `--sbmd-h2-padding`               | `padding-bottom`            |
| `--sbmd-h2-size`                  | `font-size`                 |
| `--sbmd-h3-letter-spacing`        | `letter-spacing`            |
| `--sbmd-h3-margin`                | `margin-top`                |
| `--sbmd-h3-size`                  | `font-size`                 |
| `--sbmd-h4-size`                  | `font-size`                 |
| `--sbmd-h5-size`                  | `font-size`                 |
| `--sbmd-h6-size`                  | `font-size`                 |
| `--sbmd-heading-color`            | `color`                     |
| `--sbmd-heading-font-family`      | `font-family`               |
| `--sbmd-heading-line-height`      | `line-height`               |
| `--sbmd-heading-weight`           | `font-weight`               |
| `--sbmd-image-border`             | `border`                    |
| `--sbmd-image-margin`             | `margin-block`              |
| `--sbmd-image-radius`             | `border-radius`             |
| `--sbmd-inline-code-background`   | `background`                |
| `--sbmd-inline-code-border`       | `border`                    |
| `--sbmd-inline-code-color`        | `color`                     |
| `--sbmd-inline-code-padding`      | `padding`                   |
| `--sbmd-inline-code-radius`       | `border-radius`             |
| `--sbmd-inline-code-size`         | `font-size`                 |
| `--sbmd-line-height`              | `line-height`               |
| `--sbmd-link-color`               | `color`                     |
| `--sbmd-link-decoration`          | `text-decoration`           |
| `--sbmd-link-focus-offset`        | `outline-offset`            |
| `--sbmd-link-focus-outline`       | `outline`                   |
| `--sbmd-link-hover-thickness`     | `text-decoration-thickness` |
| `--sbmd-link-radius`              | `border-radius`             |
| `--sbmd-link-thickness`           | `text-decoration-thickness` |
| `--sbmd-link-underline-offset`    | `text-underline-offset`     |
| `--sbmd-list-item-spacing`        | `margin-top`                |
| `--sbmd-list-marker-color`        | `color`                     |
| `--sbmd-max-width`                | `max-width`                 |
| `--sbmd-page-border`              | `border`                    |
| `--sbmd-page-padding`             | `padding`                   |
| `--sbmd-page-radius`              | `border-radius`             |
| `--sbmd-paragraph-spacing`        | `margin-block`              |
| `--sbmd-quote-background`         | `background`                |
| `--sbmd-quote-border`             | `border-inline-start`       |
| `--sbmd-quote-margin`             | `margin`                    |
| `--sbmd-quote-padding`            | `padding`                   |
| `--sbmd-quote-radius`             | `border-radius`             |
| `--sbmd-rule-color`               | `background`                |
| `--sbmd-rule-height`              | `height`                    |
| `--sbmd-rule-margin`              | `margin-block`              |
| `--sbmd-table-align`              | `text-align`                |
| `--sbmd-table-background`         | `background`                |
| `--sbmd-table-border`             | `border`                    |
| `--sbmd-table-cell-padding`       | `padding`                   |
| `--sbmd-table-heading-background` | `background`                |
| `--sbmd-table-heading-weight`     | `font-weight`               |
| `--sbmd-table-margin`             | `margin-block`              |
| `--sbmd-table-stripe-background`  | `background`                |
| `--sbmd-tag-background`           | `background`                |
| `--sbmd-tag-border`               | `border`                    |
| `--sbmd-tag-color`                | `color`                     |
| `--sbmd-tag-font-size`            | `font-size`                 |
| `--sbmd-tag-font-weight`          | `font-weight`               |
| `--sbmd-tag-gap`                  | `gap`                       |
| `--sbmd-tag-line-height`          | `line-height`               |
| `--sbmd-tag-padding`              | `padding`                   |
| `--sbmd-tag-radius`               | `border-radius`             |
| `--sbmd-title-letter-spacing`     | `letter-spacing`            |
| `--sbmd-title-line-height`        | `line-height`               |
| `--sbmd-title-margin`             | `margin-bottom`             |
| `--sbmd-title-size`               | `font-size`                 |

Status chips have `data-status` set to the original frontmatter value. Override `--sbmd-tag-*` on selectors such as `.storybook-addon-md-tag[data-status="stable" i]` to assign a status-specific appearance.

These styles target Markdown content and its title/chips. Story canvases, props controls, and syntax highlighting still use Storybook’s theme. Custom renderers can use the shared styles when they produce matching HTML elements; custom layouts own any additional structure. Internal `--sbmd-native-*` variables carry Storybook theme values and are not customization hooks.
