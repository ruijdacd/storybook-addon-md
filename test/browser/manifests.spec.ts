import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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

    expect(docs.docs['guides-introduction--reference'].content).toBe(introduction);
    expect(components['components-button'].docs['components-button--reference'].content).toBe(
      `${button}\n\n${shared}`,
    );
    expect(components['components-toggle'].docs['components-toggle--reference'].content).toBe(
      shared,
    );
  });
}
