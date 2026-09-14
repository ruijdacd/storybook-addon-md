---
'storybook-addon-md': minor
---

Add an opt-in `links` option that rewrites relative Markdown links instead of bundling their targets as assets.

- `links.documents` (default `true` when `links` is set) turns links to other discovered documents into `?path=/docs/...` links. Clicking one navigates the Storybook manager without reloading the preview.
- `links.repository` turns links to other files or folders inside root into `<repository>/<relative path>` links, so source files are no longer copied into the bundle and folder links no longer fail discovery.

Images, image reference definitions, manifests, and the default behavior without `links` are unchanged.
