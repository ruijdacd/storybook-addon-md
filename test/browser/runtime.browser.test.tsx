import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ThemeProvider, convert, themes } from 'storybook/theming';
import { Documentation } from '../../src/runtime.js';
import type { LayoutProps, MarkdownDocument } from '../../src/runtime.js';
import '../../src/styles.css';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const document: MarkdownDocument = {
  source: 'Guide.md',
  metadata: { tags: ['Guide', 'Stable'] },
  markdown:
    '## Overview\n\nOrdinary {value} and <Button /> text.\n\n> Read this first.\n\n| Name | Value |\n| --- | --- |\n| Theme | Custom |',
};

const container = globalThis.document.createElement('div');

container.className = 'sbdocs-content';
globalThis.document.body.append(container);

let root: ReturnType<typeof createRoot>;

async function render(
  theme = themes.light,
  documents = [document],
  presentation = {},
  tagFields: string[] = [],
) {
  root = createRoot(container);
  await act(async () => {
    root.render(
      <ThemeProvider theme={convert(theme)}>
        <Documentation
          documents={documents}
          title="Guides/Introduction"
          presentation={presentation}
          tagFields={tagFields}
        />
      </ThemeProvider>,
    );
  });
}

afterEach(async () => {
  await act(async () => root?.unmount());
  container.removeAttribute('style');
});

test('renders ordinary Markdown, tables, and deduplicated tags below the title', async () => {
  await render(themes.light, [
    document,
    { source: 'Shared.md', markdown: 'Shared guidance.', metadata: { tags: ['Stable', 'Shared'] } },
  ]);

  await expect.element(page.getByRole('heading', { name: 'Introduction' })).toBeVisible();
  await expect.element(page.getByRole('heading', { name: /Overview/ })).toBeVisible();
  await expect.element(page.getByText('Ordinary {value} and <Button /> text.')).toBeVisible();
  await expect.element(page.getByRole('table')).toBeVisible();

  await expect
    .element(page.getByRole('list', { name: 'Documentation tags' }))
    .toHaveTextContent('GuideStableShared');

  expect(container.querySelector('.storybook-addon-md-title')?.nextElementSibling?.className).toBe(
    'storybook-addon-md-tags',
  );
});

for (const [name, theme] of [
  ['light', themes.light],
  ['dark', themes.dark],
] as const) {
  test(`uses the ${name} Docs theme`, async () => {
    await render(theme);

    const heading = container.querySelector('h2')!;
    const expected = globalThis.document.createElement('span');

    expected.style.color = convert(theme).color.defaultText;
    container.append(expected);

    expect(getComputedStyle(heading).color).toBe(getComputedStyle(expected).color);

    expected.remove();
  });
}

test('CSS variables control headings, quotes, tables, and tags', async () => {
  container.style.cssText =
    '--sbmd-h2-size: 30px; --sbmd-quote-padding: 18px; --sbmd-table-cell-padding: 20px; --sbmd-tag-radius: 14px;';
  await render();

  expect(getComputedStyle(container.querySelector('h2')!).fontSize).toBe('30px');
  expect(getComputedStyle(container.querySelector('blockquote')!).padding).toBe('18px');
  expect(getComputedStyle(container.querySelector('th')!).padding).toBe('20px');
  expect(getComputedStyle(container.querySelector('.storybook-addon-md-tag')!).borderRadius).toBe(
    '14px',
  );
});

test('custom layouts and renderers receive documents and metadata', async () => {
  const Layout = ({ children, documents }: LayoutProps) => (
    <section aria-label="Team layout">
      <h1>{documents[0].source}</h1>
      {children}
    </section>
  );
  const MarkdownRenderer = ({ metadata }: MarkdownDocument) => (
    <p>Tags: {(metadata.tags as string[]).join(', ')}</p>
  );

  await render(themes.light, [document], { Layout, MarkdownRenderer });

  await expect.element(page.getByRole('region', { name: 'Team layout' })).toBeVisible();
  await expect.element(page.getByRole('heading', { name: 'Guide.md' })).toBeVisible();
  await expect.element(page.getByText('Tags: Guide, Stable')).toBeVisible();
});

test('status chips preserve the authored value and deduplicate shared statuses', async () => {
  await render(themes.light, [
    { ...document, metadata: { tags: ['Guide'], status: 'Stable' } },
    { source: 'Shared.md', markdown: '', metadata: { status: 'Stable' } },
    { source: 'Review.md', markdown: '', metadata: { status: 'In review' } },
  ]);

  const chips = container.querySelectorAll('[data-status]');

  expect(chips).toHaveLength(2);
  expect(chips[0].textContent).toBe('Stable');
  expect(chips[0].getAttribute('data-status')).toBe('Stable');
  expect(chips[1].getAttribute('data-status')).toBe('In review');
  expect(container.querySelector('.storybook-addon-md-tag:not([data-status])')?.textContent).toBe(
    'Guide',
  );
});

test('status is rendered even without tags', async () => {
  await render(themes.light, [{ ...document, metadata: { status: 'stable' } }]);

  await expect.element(page.getByRole('list', { name: 'Documentation tags' })).toBeVisible();
  expect(container.querySelector('[data-status="stable"]')?.textContent).toBe('stable');
});

test('default lengths scale with the root font size', async () => {
  const html = globalThis.document.documentElement;
  const original = html.style.fontSize;

  try {
    html.style.fontSize = '16px';
    await render();

    const heading = container.querySelector('h2')!;
    const tag = container.querySelector('.storybook-addon-md-tag')!;

    expect(getComputedStyle(heading).fontSize).toBe('24px');
    expect(getComputedStyle(tag).padding).toBe('2px 8px');
    html.style.fontSize = '20px';
    expect(getComputedStyle(heading).fontSize).toBe('30px');
    expect(getComputedStyle(tag).padding).toBe('2.5px 10px');
  } finally {
    html.style.fontSize = original;
  }
});

test('monospace font follows the theme and supports a CSS override', async () => {
  await render({ ...themes.light, fontCode: 'Courier New, monospace' }, [
    { ...document, markdown: 'Inline `value`.\n\n```js\nconst value = 1;\n```' },
  ]);

  await expect.poll(() => container.querySelectorAll('code, pre.prismjs > div').length).toBe(2);

  const code = container.querySelectorAll('code, pre.prismjs > div');
  const expected = globalThis.document.createElement('span');

  container.append(expected);
  expected.style.fontFamily = 'Courier New, monospace';

  for (const element of code) {
    expect(getComputedStyle(element).fontFamily).toBe(getComputedStyle(expected).fontFamily);
  }

  container.style.setProperty('--sbmd-monospace-font-family', 'Consolas, monospace');
  expected.style.fontFamily = 'Consolas, monospace';

  for (const element of code) {
    expect(getComputedStyle(element).fontFamily).toBe(getComputedStyle(expected).fontFamily);
  }

  expected.remove();
});

test('standalone heading reaches custom layouts and renderers without duplicate titles', async () => {
  const Layout = ({ heading, children }: LayoutProps) => (
    <section>
      {heading}
      {children}
    </section>
  );
  const doc = {
    ...document,
    heading: '# A *visible* title',
    markdown: 'Body without the heading.',
  };
  await render(themes.light, [doc], { Layout });
  await expect
    .element(page.getByRole('heading', { level: 1 }))
    .toHaveTextContent('A visible title');
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  expect(container.querySelector('h1 em')?.textContent).toBe('visible');
});

test('default layout uses the prepared Markdown heading', async () => {
  await render(themes.light, [{ ...document, heading: '# Visible title', markdown: 'Body' }]);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  await expect.element(page.getByRole('heading', { level: 1 })).toHaveTextContent('Visible title');
});

test('configured metadata tags deduplicate across fields and statuses without mutating metadata', async () => {
  const metadata = {
    tags: ['Actions', 'Stable'],
    status: 'Stable',
    category: 'Actions',
    subcategory: ['Inputs', 'Actions'],
    ignored: { nested: true },
  };
  const original = structuredClone(metadata);
  await render(themes.light, [{ ...document, metadata }], {}, [
    'category',
    'subcategory',
    'ignored',
    'missing',
  ]);
  await expect
    .element(page.getByRole('list', { name: 'Documentation tags' }))
    .toHaveTextContent('ActionsInputsStable');
  expect(container.querySelector('[data-status="Stable"]')?.textContent).toBe('Stable');
  expect(metadata).toEqual(original);
});

test('extra metadata fields are not displayed by default', async () => {
  await render(themes.light, [{ ...document, metadata: { category: 'Hidden' } }]);
  expect(container.querySelector('.storybook-addon-md-tags')).toBeNull();
});
