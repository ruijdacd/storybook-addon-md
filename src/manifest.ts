import type { StorybookConfigRaw } from 'storybook/internal/types';
import type { ContentOptions, DiscoveredDocument } from './content.js';
import path from 'node:path';
import { slash } from './content.js';
import { pageFile } from './generator.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function updateManifests(
  manifests: NonNullable<StorybookConfigRaw['experimental_manifests']>,
  documents: DiscoveredDocument[],
  config: ContentOptions,
) {
  const pages = new Map<string, DiscoveredDocument[]>();

  for (const document of documents) {
    const keys = document.stories.length
      ? document.stories.map((story) => `story:${slash(path.relative(config.root, story))}`)
      : [`doc:${document.source}`];

    for (const key of keys) {
      const file = path.join(config.output, pageFile(key));

      if (!pages.has(file)) pages.set(file, []);
      pages.get(file)!.push(document);
    }
  }

  function update<T extends object>(manifest: T) {
    if (!('docs' in manifest) || !isRecord(manifest.docs)) return manifest;

    return {
      ...manifest,
      docs: Object.fromEntries(
        Object.entries(manifest.docs).map(([id, entry]) => {
          if (!isRecord(entry) || typeof entry.path !== 'string') return [id, entry];

          const matched = pages.get(path.resolve(entry.path));

          if (!matched) return [id, entry];

          const summaries = matched.flatMap((document) =>
            typeof document.metadata.description === 'string'
              ? [document.metadata.description]
              : [],
          );
          const replacement = { ...entry };

          delete replacement.summary;
          delete replacement.error;

          return [
            id,
            {
              ...replacement,
              content: matched.map((document) => document.original).join('\n\n'),
              ...(summaries.length ? { summary: summaries.join('\n\n') } : {}),
            },
          ];
        }),
      ),
    };
  }

  return {
    ...manifests,
    ...(isRecord(manifests.docs) && manifests.docs.v === 0 ? { docs: update(manifests.docs) } : {}),
    ...(manifests.components?.v === 0
      ? {
          components: {
            ...manifests.components,
            components: Object.fromEntries(
              Object.entries(manifests.components.components).map(([id, component]) => [
                id,
                update(component),
              ]),
            ),
          },
        }
      : {}),
  };
}
