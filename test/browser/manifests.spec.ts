import { test, expect } from '@playwright/test';
import { readFile, writeFile, rm } from 'node:fs/promises';

for (const [mode, port] of [
  ['development', 16009],
  ['static', 16010],
] as const) {
  test(`${mode}: manifests contain complete standalone, attached and shared Markdown`, async ({
    request,
  }) => {
    const docs = await (await request.get(`http://localhost:${port}/manifests/docs.json`)).json();
    const { components } = await (
      await request.get(`http://localhost:${port}/manifests/components.json`)
    ).json();
    const introduction = await readFile('example/docs/Introduction.md', 'utf8');
    const button = await readFile('example/components/Button.metadata.md', 'utf8');
    const shared = await readFile('example/docs/Shared.md', 'utf8');

    expect(docs.docs['guides-introduction--docs'].content).toBe(introduction);
    expect(components['components-button'].docs['components-button--markdown'].content).toBe(
      `${button}\n\n${shared}`,
    );
    expect(components['components-toggle'].docs['components-toggle--markdown'].content).toBe(
      shared,
    );
  });
}

test('development: manifests refresh additions, edits, associations and deletions', async ({
  request,
}) => {
  const file = 'example/docs/Manifest-live.md';
  const source =
    '---\ntitle: Guides/Manifest live\ndescription: Live summary\n---\n# Full source\n';
  const docs = async () =>
    (await (await request.get('http://localhost:16009/manifests/docs.json')).json()).docs;
  const attached = async () =>
    (await (await request.get('http://localhost:16009/manifests/components.json')).json())
      .components['components-toggle'].docs['components-toggle--markdown'];
  const shared = await readFile('example/docs/Shared.md', 'utf8');

  try {
    await writeFile(file, source);
    await expect
      .poll(async () => (await docs())['guides-manifest-live--docs']?.content)
      .toBe(source);
    expect((await docs())['guides-manifest-live--docs'].summary).toBe('Live summary');

    const edited = source.replace('Full source', 'Edited source');

    await writeFile(file, edited);
    await expect
      .poll(async () => (await docs())['guides-manifest-live--docs']?.content)
      .toBe(edited);

    const associated = '---\nstories: ../components/Toggle.stories.tsx\n---\n# Attached live\n';

    await writeFile(file, associated);
    await expect.poll(async () => (await attached()).content).toBe(`${associated}\n\n${shared}`);
    await expect.poll(async () => (await docs())['guides-manifest-live--docs']).toBeUndefined();
    await rm(file);
    await expect.poll(async () => (await attached()).content).toBe(shared);
  } finally {
    await rm(file, { force: true });
  }
});
