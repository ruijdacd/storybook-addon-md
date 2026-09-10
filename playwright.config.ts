import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  testMatch: '**/*.spec.ts',
  workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  use: { browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'npm run storybook -- --ci --exact-port -p 16006',
      url: 'http://localhost:16006/index.json',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'npm run build-storybook && node --experimental-strip-types test/serve-static.ts',
      url: 'http://localhost:16007/index.json',
      timeout: 120000,
    },
  ],
});
