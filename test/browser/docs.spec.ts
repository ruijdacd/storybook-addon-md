import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';

for (const [mode, port] of [
  ['development', 16006],
  ['static', 16007],
] as const) {
  test(`${mode}: standalone, attached, shared, assets and customization render`, async ({
    page,
    request,
  }) => {
    const { entries } = await (await request.get(`http://localhost:${port}/index.json`)).json();
    const titles = [
      ...new Set(Object.values(entries).map((entry) => (entry as { title: string }).title)),
    ];
    expect(titles.indexOf('Components/Button')).toBeLessThan(titles.indexOf('Components/Toggle'));

    const errors: string[] = [];

    page.on('pageerror', (error) => errors.push(error.message));

    const open = (id: string) =>
      page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=docs`);

    await open('guides-introduction--docs');

    await expect(
      page.getByRole('heading', { name: 'Ordinary Markdown, inside Storybook' }),
    ).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();

    const chips = page.locator('.storybook-addon-md-tag');

    for (const chip of await chips.all()) {
      await expect(chip).toHaveCSS('margin', '0px');
    }

    expect(
      new Set(
        await chips.evaluateAll((elements) =>
          elements.map((element) => element.getBoundingClientRect().top),
        ),
      ).size,
    ).toBe(1);
    await expect(page.getByRole('list', { name: 'Documentation tags' })).toHaveText(
      'GuideGetting started',
    );
    await expect(page.locator('.storybook-addon-md-tag').first()).toHaveCSS(
      'border-radius',
      '999px',
    );
    await expect(
      page.getByRole('heading', { name: 'Ordinary Markdown, inside Storybook' }),
    ).toHaveCSS('border-bottom-style', 'solid');

    const sourceUrl = await page
      .getByRole('link', { name: 'shared guidance source' })
      .evaluate((element: HTMLAnchorElement) => element.href);
    const response = await request.get(sourceUrl);

    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain('Shared interaction guidance');

    await open('components-button--docs');

    await expect(page.getByRole('heading', { name: /Overview$/ })).toBeVisible();
    await expect(page.locator('[data-status="Stable"]')).toBeVisible();

    const unresolvedThemeVariables = await page
      .locator('.storybook-addon-md-page')
      .evaluate((element) => {
        const styles = getComputedStyle(element);
        return Array.from(styles).filter(
          (name) => name.startsWith('--sbmd-') && !styles.getPropertyValue(name).trim(),
        );
      });

    expect(unresolvedThemeVariables).toEqual([]);
    await expect(page.getByRole('list', { name: 'Documentation tags' })).toContainText('Stable');
    await expect(page.getByRole('heading', { name: /Overview$/ })).toHaveCSS(
      'border-bottom-style',
      'solid',
    );
    await expect(page.getByRole('heading', { name: /Secondary$/ })).not.toHaveCSS(
      'border-bottom-style',
      'solid',
    );
    await expect(page.getByRole('heading', { name: 'Shared interaction guidance' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Unavailable', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Delete branch', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Small', exact: true })).toHaveCSS(
      'min-height',
      '28px',
    );
    await expect(page.getByRole('button', { name: 'Large', exact: true })).toHaveCSS(
      'min-height',
      '40px',
    );
    await expect(page.getByRole('row').filter({ hasText: 'variant' })).toBeVisible();
    await expect(page.getByText('<Button variant="primary" />', { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await open('components-toggle--docs');

    await expect(page.getByRole('heading', { name: 'Shared interaction guidance' })).toBeVisible();

    await expect(page.getByRole('checkbox', { name: 'Security alerts' })).toBeDisabled();
    await expect(page.getByRole('checkbox', { name: 'Watch releases' })).toBeChecked();
    await page.getByRole('checkbox', { name: 'Enable notifications' }).check();

    await expect(page.getByRole('checkbox', { name: 'Enable notifications' })).toBeChecked();

    await open('guides-introduction--docs');

    expect(errors).toEqual([]);

    await page.screenshot({ path: `test-results/${mode}-introduction.png`, fullPage: true });

    const overrides = await page.addStyleTag({
      content: `.storybook-addon-md-page {
      --sbmd-h2-size: 30px;
      --sbmd-table-cell-padding: 20px;
      --sbmd-tag-radius: 14px;
    }`,
    });

    await expect(
      page.getByRole('heading', { name: 'Ordinary Markdown, inside Storybook' }),
    ).toHaveCSS('font-size', '30px');
    await expect(page.getByRole('columnheader').first()).toHaveCSS('padding', '20px');
    await expect(page.locator('.storybook-addon-md-tag').first()).toHaveCSS(
      'border-radius',
      '14px',
    );

    await overrides.evaluate((element) => element.parentNode?.removeChild(element));
    await page.setViewportSize({ width: 390, height: 844 });

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });

  test(`${mode}: native Docs supports light and dark themes`, async ({ page }) => {
    const colors: string[] = [];
    const textColors: string[] = [];

    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto(
        `http://localhost:${port}/iframe.html?id=components-button--docs&viewMode=docs`,
      );

      await expect(page.getByRole('heading', { name: /Overview$/ })).toBeVisible();

      const textColor = await page
        .getByRole('heading', { name: /Overview$/ })
        .evaluate((element) => getComputedStyle(element).color);

      textColors.push(textColor);

      await expect(page.locator('[data-status="Stable"]')).toHaveCSS(
        'color',
        colorScheme === 'dark' ? 'rgb(63, 185, 80)' : 'rgb(26, 127, 55)',
      );
      await expect(page.locator('.storybook-addon-md-tag').first()).toHaveCSS(
        'color',
        colorScheme === 'dark' ? 'rgb(145, 152, 161)' : 'rgb(89, 99, 110)',
      );

      colors.push(
        await page
          .locator('.sbdocs-wrapper')
          .evaluate((element) => getComputedStyle(element).backgroundColor),
      );
      await page.screenshot({ path: `test-results/${mode}-${colorScheme}.png`, fullPage: true });
    }

    expect(colors[0]).not.toEqual(colors[1]);
    expect(textColors[0]).not.toEqual(textColors[1]);
  });
}

test('development: additions after startup appear in the sidebar, update, and disappear', async ({
  page,
  request,
}) => {
  const directory = 'example/docs/live-test';
  const file = `${directory}/Added.md`;
  const index = async () =>
    (await (await request.get('http://localhost:16006/index.json')).json()).entries;

  try {
    await page.goto('http://localhost:16006/?path=/docs/guides-introduction--docs');

    const preview = page.frameLocator('#storybook-preview-iframe');

    await expect(preview.getByRole('heading', { name: 'Introduction', exact: true })).toBeVisible();
    await mkdir(directory, { recursive: true });
    await writeFile(file, '---\ntitle: Guides/Added live\n---\n# Added after startup\n');

    await expect.poll(async () => Boolean((await index())['guides-added-live--docs'])).toBeTruthy();
    await expect(page.getByText('Added live', { exact: true })).toBeVisible();

    await page.getByText('Added live', { exact: true }).click();

    await expect(preview.getByRole('heading', { name: 'Added after startup' })).toBeVisible();
    await expect(preview.locator('.storybook-addon-md-page h1')).toHaveCount(1);

    await writeFile(file, '---\ntitle: Guides/Added live\n---\n## Edited without restart\n');

    await expect(preview.getByRole('heading', { name: 'Edited without restart' })).toBeVisible();
    await expect(preview.getByRole('heading', { name: 'Added live', exact: true })).toBeVisible();
    await expect(preview.locator('.storybook-addon-md-page h1')).toHaveCount(1);

    await rm(directory, { recursive: true });

    await expect.poll(async () => Boolean((await index())['guides-added-live--docs'])).toBeFalsy();
    await expect(page.getByText('Added live', { exact: true })).toHaveCount(0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('development: source errors are visible and recover after correction', async ({
  page,
  request,
}) => {
  const directory = 'example/docs/error-test';
  const file = `${directory}/Recovery.md`;

  try {
    await mkdir(directory, { recursive: true });
    await writeFile(file, '---\ntitle: Guides/Recovery\n---\n## Valid document\n');
    await expect
      .poll(async () =>
        Boolean(
          (await (await request.get('http://localhost:16006/index.json')).json()).entries[
            'guides-recovery--docs'
          ],
        ),
      )
      .toBeTruthy();
    await page.goto('http://localhost:16006/iframe.html?id=guides-recovery--docs&viewMode=docs');

    await expect(page.getByRole('heading', { name: 'Valid document' })).toBeVisible();

    for (const [content, message] of [
      ['---\ntitle: [\n---', 'invalid frontmatter'],
      ['---\nstories: ./Missing.stories.tsx\n---', 'missing story reference'],
      ['![Unavailable](missing.svg)', 'missing local asset'],
    ]) {
      await writeFile(file, content);

      await expect(
        page
          .locator('vite-error-overlay')
          .filter({ hasText: message })
          .or(page.getByRole('heading', { name: new RegExp(message) }))
          .first(),
      ).toBeVisible();

      await writeFile(file, '---\ntitle: Guides/Recovery\n---\n## Valid document\n');

      await expect(page.getByRole('heading', { name: 'Valid document' })).toBeVisible();
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: /\[storybook-addon-md\]/ })).toHaveCount(0);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('development: stylesheet edits update the Markdown content live', async ({ page }) => {
  const file = 'example/.storybook/markdown.css';
  const original = await readFile(file, 'utf8');

  try {
    await page.goto('http://localhost:16006/iframe.html?id=components-button--docs&viewMode=docs');

    const heading = page.getByRole('heading', { name: /Overview$/ });

    await expect(heading).toHaveCSS('border-bottom-style', 'solid');

    await writeFile(
      file,
      original.replace('--sbmd-h2-border: 1px solid', '--sbmd-h2-border: 1px dotted'),
    );

    await expect(heading).toHaveCSS('border-bottom-style', 'dotted');
  } finally {
    await writeFile(file, original);
  }
});

for (const [mode, port] of [
  ['development', 16006],
  ['static', 16007],
] as const) {
  test(`${mode}: story colors follow the system preference without reloading`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(
      `http://localhost:${port}/iframe.html?id=components-button--secondary&viewMode=story`,
    );

    const button = page.getByRole('button', { name: 'Cancel', exact: true });

    await expect(page.locator('html')).toHaveCSS('color-scheme', 'light dark');
    await expect(button).toHaveCSS('background-color', 'rgb(246, 248, 250)');
    await expect(button).toHaveCSS('color', 'rgb(31, 35, 40)');

    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(button).toHaveCSS('background-color', 'rgb(33, 40, 48)');
    await expect(button).toHaveCSS('color', 'rgb(240, 246, 252)');
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(13, 17, 23)');

    await page.goto(
      `http://localhost:${port}/iframe.html?id=components-toggle--default&viewMode=story`,
    );

    const toggle = page.getByRole('checkbox', { name: 'Enable notifications' });
    const track = page.locator('[data-slot="toggle-track"]');

    await expect(track).toHaveCSS('background-color', 'rgb(45, 52, 64)');
    await page.keyboard.press('Tab');
    await expect(toggle).toBeFocused();
    await expect(track).toHaveCSS('outline-style', 'solid');
    await expect(track).toHaveCSS('outline-width', '2px');
    await page.keyboard.press('Space');
    await expect(toggle).toBeChecked();
    await page.mouse.move(700, 450);
    await expect(track).toHaveCSS('background-color', 'rgb(35, 134, 54)');

    await page.emulateMedia({ colorScheme: 'light' });

    await expect(track).toHaveCSS('background-color', 'rgb(31, 136, 61)');
    await expect(toggle).toBeChecked();
  });
}

for (const [mode, port] of [
  ['development', 16006],
  ['static', 16007],
] as const) {
  test(`${mode}: manager and Docs follow system theme changes without reloading`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(`http://localhost:${port}/?path=/docs/components-button--docs`);

    const docs = page.frameLocator('#storybook-preview-iframe');
    const wrapper = docs.locator('.sbdocs-wrapper');
    const sidebar = page.locator('.sidebar-container');

    await expect(docs.getByRole('heading', { name: /Overview$/ })).toBeVisible();
    await expect(wrapper).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const sidebarLight = await sidebar.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    const managerOrigin = await page.evaluate(() => performance.timeOrigin);
    const docsOrigin = await wrapper.evaluate(() => performance.timeOrigin);

    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(wrapper).toHaveCSS('background-color', 'rgb(13, 17, 23)');
    await expect(sidebar).not.toHaveCSS('background-color', sidebarLight);
    await expect(docs.getByRole('button', { name: 'Cancel', exact: true })).toHaveCSS(
      'color',
      'rgb(240, 246, 252)',
    );
    await page.screenshot({ path: `test-results/${mode}-system-dark.png`, fullPage: true });

    await page.emulateMedia({ colorScheme: 'light' });

    await expect(wrapper).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(sidebar).toHaveCSS('background-color', sidebarLight);
    await expect(docs.getByRole('button', { name: 'Cancel', exact: true })).toHaveCSS(
      'color',
      'rgb(31, 35, 40)',
    );
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(managerOrigin);
    expect(await wrapper.evaluate(() => performance.timeOrigin)).toBe(docsOrigin);
  });
}

for (const [mode, port, name, suffix] of [
  ['development', 16006, 'Docs', 'docs'],
  ['static', 16007, 'Docs', 'docs'],
  ['development custom name', 16009, 'Reference', 'reference'],
  ['static custom name', 16010, 'Reference', 'reference'],
] as const) {
  test(`${mode}: Markdown replaces Autodocs while ordinary Autodocs and authored MDX remain`, async ({
    request,
    page,
  }) => {
    const {
      entries,
    }: {
      entries: Record<
        string,
        { id: string; name: string; type: string; title: string; importPath: string }
      >;
    } = await (await request.get(`http://localhost:${port}/index.json`)).json();
    const componentDocs = Object.values(entries).filter(
      (entry) => entry.type === 'docs' && entry.title === 'Components/Button',
    ) as { id: string; name: string }[];
    expect(componentDocs.map((entry) => entry.name).sort()).toEqual([name, 'Design notes'].sort());
    expect(entries[`components-button--${suffix}`].importPath).toContain('page-');
    expect(entries[`examples-autodocs--${suffix}`].importPath).toContain('Autodocs.stories');
    expect(entries[`guides-authored--${suffix}`].importPath).toContain('Authored.mdx');
    for (const [id, heading] of [
      [`components-button--${suffix}`, /Overview$/],
      [`examples-autodocs--${suffix}`, 'Autodocs'],
      [`guides-authored--${suffix}`, 'Authored MDX'],
      ['components-button--design-notes', 'Authored design notes'],
      [`guides-heading-example--${suffix}`, 'A visible Markdown title'],
    ] as const) {
      await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=docs`);
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      if (id.startsWith('guides-heading-example'))
        await expect(page.locator('.storybook-addon-md-page h1')).toHaveCount(1);
      if (id === `components-button--${suffix}`) {
        await expect(page.getByRole('row').filter({ hasText: 'variant' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
      }
    }
  });
}

test('development: adding and removing Markdown replaces and restores ordinary Autodocs', async ({
  page,
  request,
}) => {
  const file = 'example/docs/Autodocs-live.md';
  const id = 'examples-autodocs--docs';
  const entry = async () =>
    (await (await request.get('http://localhost:16006/index.json')).json()).entries[id];
  try {
    expect((await entry()).importPath).toContain('Autodocs.stories');
    await writeFile(
      file,
      '---\nstories: ../components/Autodocs.stories.tsx\n---\n## Added guidance\n',
    );
    await expect.poll(async () => (await entry()).importPath).toContain('page-');
    await page.goto(`http://localhost:16006/iframe.html?id=${id}&viewMode=docs`);
    await expect(page.getByRole('heading', { name: 'Added guidance' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Automatic example', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'variant' })).toBeVisible();
    await rm(file);
    await expect.poll(async () => (await entry()).importPath).toContain('Autodocs.stories');
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Autodocs', exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Automatic example', exact: true }),
    ).toBeVisible();
  } finally {
    await rm(file, { force: true });
  }
});
