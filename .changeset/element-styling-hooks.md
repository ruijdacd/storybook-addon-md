---
'storybook-addon-md': minor
---

Add back focused styling hooks for the page, links, quotes, callouts, tables, and images, built on two new shared tokens.

**New shared tokens**

- `--sbmd-accent-color` colors links and task-list checkboxes. `--sbmd-link-color` now defaults to it.
- `--sbmd-radius` rounds quotes, callouts, images, and code. It is unset by default, so code keeps its `0.1875rem` radius and other elements stay square until you set it.

**New element variables**

| Area     | Variables                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Page     | `--sbmd-page-max-width`, `--sbmd-page-margin`, `--sbmd-page-padding`, `--sbmd-page-background`                                   |
| Links    | `--sbmd-link-hover-decoration`, `--sbmd-link-underline-offset`. `--sbmd-link-decoration` accepts shorthands like `underline 1px` |
| Quotes   | `--sbmd-quote-background`                                                                                                        |
| Callouts | `--sbmd-callout-accent`, `--sbmd-callout-border`, `--sbmd-callout-background`                                                    |
| Tables   | `--sbmd-table-border`, `--sbmd-table-heading-background`                                                                         |
| Images   | `--sbmd-image-border`                                                                                                            |

**Callout accents**

Each callout now exposes its resolved color as `--sbmd-callout-accent`. Reference it from a `.storybook-addon-md-callout` rule to derive tinted backgrounds or borders for every type at once:

```css
.storybook-addon-md-callout {
  --sbmd-callout-background: color-mix(in srgb, var(--sbmd-callout-accent) 8%, transparent);
}
```

**Behavior change**

`--sbmd-quote-border` no longer applies to callouts. Set `--sbmd-callout-border` instead; its default is `0.25rem solid var(--sbmd-callout-accent)`.
