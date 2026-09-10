import { test } from 'vitest';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { generate, pageFile } from '../src/generator.ts';
import { experimental_manifests, stories } from '../src/preset.ts';
import { updateManifests } from '../src/manifest.ts';

test('manifests preserve original source and only replace known generated pages', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'sbmd-manifest-'));

  t.onTestFinished(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'docs'));
  await writeFile(path.join(root, 'Button.stories.tsx'), 'export default {};');
  await writeFile(path.join(root, 'Toggle.stories.tsx'), 'export default {};');

  const standalone =
    '\uFEFF---\r\ntitle: Guide\r\ndescription: A guide\r\n---\r\n# Original {text}\r\n';
  const attached = '---\nstatus: Stable\n---\n# Button\n';
  const shared =
    '---\nstories: [../Button.stories.tsx, ../Toggle.stories.tsx]\ndescription: Shared guidance\n---\n# Shared\n';

  await writeFile(path.join(root, 'docs/Guide.md'), standalone);
  await writeFile(path.join(root, 'Button.metadata.md'), attached);
  await writeFile(path.join(root, 'docs/Shared.md'), shared);

  const config = { root, output: path.join(root, 'generated'), patterns: ['**/*.md'] };
  const documents = await generate(config);
  const entry = (key: string) => ({
    id: key,
    name: 'Docs',
    title: 'Same title',
    path: `./${path.relative(process.cwd(), path.join(config.output, pageFile(key)))}`,
    content: 'generated MDX',
    summary: 'wrapper summary',
    custom: 'preserved',
    error: { name: 'Error', message: 'wrapper error' },
  });
  const unrelated = { ...entry('other'), path: './unrelated.mdx' };
  const component = (story: string) => ({
    id: story,
    name: story,
    path: story,
    stories: [],
    jsDocTags: {},
    docs: { markdown: entry(`story:${story}`), unrelated, autodocs: { id: 'auto' } },
  });
  const manifests = {
    custom: { retained: true },
    docs: { v: 0, custom: 'kept', docs: { guide: entry('doc:docs/Guide.md'), unrelated } },
    components: {
      v: 0,
      components: {
        button: component('Button.stories.tsx'),
        toggle: component('Toggle.stories.tsx'),
      },
    },
  };
  const before = structuredClone(manifests);
  const result = JSON.parse(JSON.stringify(updateManifests(manifests, documents, config)));

  assert.deepEqual(manifests, before);
  assert.equal(result.docs.docs.guide.content, standalone);
  assert.equal(result.docs.docs.guide.summary, 'A guide');
  assert.equal(result.docs.docs.guide.custom, 'preserved');
  assert.equal(result.docs.docs.guide.error, undefined);
  assert.equal(result.docs.custom, 'kept');
  assert.deepEqual(result.custom, manifests.custom);
  assert.equal(
    result.components.components.button.docs.markdown.content,
    `${attached}\n\n${shared}`,
  );
  assert.equal(result.components.components.toggle.docs.markdown.content, shared);
  assert.equal(result.components.components.button.docs.markdown.summary, 'Shared guidance');
  assert.deepEqual(result.docs.docs.unrelated, unrelated);
  assert.deepEqual(result.components.components.button.docs.unrelated, unrelated);
  assert.deepEqual(result.components.components.button.docs.autodocs, { id: 'auto' });

  const onlyAttached = JSON.parse(
    JSON.stringify(
      updateManifests(
        manifests,
        documents.filter((document) => document.original === attached),
        config,
      ),
    ),
  );

  assert.equal(onlyAttached.components.components.button.docs.markdown.summary, undefined);
  assert.deepEqual(
    updateManifests(
      { docs: { v: 1, docs: { guide: { mdx: { $ref: 'service.json' } } } } },
      documents,
      config,
    ),
    { docs: { v: 1, docs: { guide: { mdx: { $ref: 'service.json' } } } } },
  );
});

test('manifest preset is opt-in and reuses the discovery session', async (t) => {
  const root = await mkdtemp(path.join(process.cwd(), 'sbmd-manifest-preset-'));
  const source = `${path.basename(root)}/Guide.md`;
  const options = {
    configDir: path.join(root, '.storybook'),
    root: process.cwd(),
    patterns: [source],
  };

  t.onTestFinished(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'Guide.md'), '# Original');

  const entries = await stories([], options);
  const generated = entries[0];

  assert(typeof generated !== 'string');
  t.onTestFinished(() => rm(generated.directory, { recursive: true, force: true }));

  const manifests = {
    docs: {
      v: 0,
      docs: {
        guide: {
          path: path.join(generated.directory, pageFile(`doc:${source}`)),
          content: 'wrapper',
        },
      },
    },
  };

  assert.equal(await experimental_manifests(manifests, options), manifests);
  assert.equal(
    await experimental_manifests(manifests, { ...options, manifests: false }),
    manifests,
  );
  await rm(path.join(root, 'Guide.md'));

  const enabled = JSON.parse(
    JSON.stringify(await experimental_manifests(manifests, { ...options, manifests: true })),
  );

  assert.equal(enabled.docs.docs.guide.content, '# Original');
});
