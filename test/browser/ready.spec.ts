import { test, expect } from '@playwright/test';

for (const [port, suffix] of [
  [16006, 'docs'],
  [16009, 'reference'],
] as const) {
  test(`development ${port}: Docs and story dependencies are ready`, async ({ page }) => {
    await page.goto(
      `http://localhost:${port}/iframe.html?id=components-button--${suffix}&viewMode=docs`,
    );
    await expect(page.getByRole('heading', { name: /Overview$/ })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'variant' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
  });
}
