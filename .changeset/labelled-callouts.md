---
'storybook-addon-md': minor
---

Render GitHub-style alerts (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`) as labelled callouts in Docs. Ordinary blockquotes and unrecognized markers are unchanged, Markdown and relative assets inside callouts keep working, and manifests keep the original source.

Style callouts with the new `--sbmd-callout-*` variables, including per-type accent colors, or target `.storybook-addon-md-callout[data-callout]`. Custom `MarkdownRenderer` implementations receive the original blockquote syntax and must render callouts themselves. See the [callout syntax](https://github.com/ruijdacd/storybook-addon-md#callouts) and [styling reference](https://github.com/ruijdacd/storybook-addon-md/blob/main/STYLING.md#callouts).
