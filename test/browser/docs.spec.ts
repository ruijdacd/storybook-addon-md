import { test, expect } from '@playwright/test';

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
    }

    expect(colors[0]).not.toEqual(colors[1]);
    expect(textColors[0]).not.toEqual(textColors[1]);
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
