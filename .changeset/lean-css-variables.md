---
'storybook-addon-md': minor
---

Consolidate the CSS variables into a smaller set built around shared tokens. Every remaining variable keeps its name and meaning.

**New shared tokens**

| Variable                 | Replaces                                                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sbmd-border-color`    | `--sbmd-h2-border`, `--sbmd-table-border`, `--sbmd-inline-code-border`, `--sbmd-rule-color`, and the color of the default quote border        |
| `--sbmd-block-spacing`   | `--sbmd-paragraph-spacing`, `--sbmd-quote-margin`, `--sbmd-callout-margin`, `--sbmd-table-margin`, `--sbmd-title-margin`, `--sbmd-tag-margin` |
| `--sbmd-heading-spacing` | `--sbmd-h2-margin`, `--sbmd-h3-margin`, `--sbmd-rule-margin`                                                                                  |

**Widened variables**

| Variable              | Now also controls                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--sbmd-h1-size`      | The page title, replacing `--sbmd-title-size`                                                              |
| `--sbmd-code-radius`  | Inline code, replacing `--sbmd-inline-code-radius`                                                         |
| `--sbmd-quote-border` | The width and style of callout borders, replacing `--sbmd-callout-border`. The accent color still applies. |

**Removed without replacement**

The addon no longer sets these properties, so ordinary CSS at any specificity applies. For example, `.storybook-addon-md img { border-radius: 0.5rem }`.

- Page: `--sbmd-background`, `--sbmd-max-width`, `--sbmd-page-padding`, `--sbmd-page-border`, `--sbmd-page-radius`. Style `.storybook-addon-md-page`.
- Images: `--sbmd-image-border`, `--sbmd-image-margin`, `--sbmd-image-radius`.
- Quotes and callouts: `--sbmd-quote-background`, `--sbmd-quote-radius`, `--sbmd-callout-background`, `--sbmd-callout-radius`.
- Links: `--sbmd-link-underline-offset`, `--sbmd-link-thickness`, `--sbmd-link-hover-thickness`, `--sbmd-link-focus-outline`, `--sbmd-link-focus-offset`, `--sbmd-link-radius`. Storybook's underline metrics and the browser focus ring apply.
- Lists and checkboxes: `--sbmd-list-marker-color`, `--sbmd-checkbox-color`, `--sbmd-checkbox-gap`.
- Headings: `--sbmd-title-letter-spacing`, `--sbmd-h2-letter-spacing`, `--sbmd-h3-letter-spacing`, `--sbmd-title-line-height`, `--sbmd-heading-line-height`.
- Code: `--sbmd-code-border`, `--sbmd-inline-code-color`.
- Tables: `--sbmd-table-background`, `--sbmd-table-heading-background`, `--sbmd-table-heading-weight`, `--sbmd-table-align`.
- Tags: `--sbmd-tag-gap`, `--sbmd-tag-font-weight`, `--sbmd-tag-line-height`.
- Callouts: `--sbmd-callout-color`, `--sbmd-callout-label-color`, `--sbmd-callout-label-size`, `--sbmd-callout-label-margin`.

For properties the addon still sets, such as the `h2` padding or the tag gap, match the addon's specificity: `.sbdocs-content .storybook-addon-md-tags { gap: 0.5rem }`.

**Migration**

1. Set `--sbmd-border-color`, `--sbmd-block-spacing`, and `--sbmd-heading-spacing` to the values you used for the replaced variables.
2. Rename `--sbmd-title-size` to `--sbmd-h1-size` and `--sbmd-inline-code-radius` to `--sbmd-code-radius`.
3. Move any per-type callout border, background, or radius to a `.storybook-addon-md-callout[data-callout='...']` rule.
4. Replace the remaining removed variables with CSS rules. The example stylesheet shows the pattern for links, images, and inline code.
