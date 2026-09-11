import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  testMatch: '**/*.spec.ts',
  workers: 2,
  timeout: 60000,
  globalTimeout: 180000,
  expect: { timeout: 15000 },
  use: { browserName: 'chromium', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    {
      name: 'rendering',
      testIgnore: '**/watching.spec.ts',
      fullyParallel: true,
    },
    {
      name: 'watching',
      testMatch: '**/watching.spec.ts',
      dependencies: ['rendering'],
      workers: 1,
    },
  ],
  webServer: [
    {
      command:
        'nub run build && node node_modules/storybook/dist/bin/dispatcher.js dev -c example/.storybook --ci --no-open --disable-telemetry --exact-port -p 16006',
      url: 'http://localhost:16006/index.json',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command:
        'node node_modules/storybook/dist/bin/dispatcher.js build -c example/.storybook --disable-telemetry && node --experimental-strip-types test/serve-static.ts',
      url: 'http://localhost:16007/index.json',
      timeout: 120000,
    },
    {
      command:
        'node node_modules/storybook/dist/bin/dispatcher.js dev -c example/.storybook-mcp --ci --no-open --disable-telemetry --exact-port -p 16009',
      url: 'http://localhost:16009/index.json',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command:
        'node node_modules/storybook/dist/bin/dispatcher.js build -c example/.storybook-mcp -o storybook-static-mcp --disable-telemetry && node --experimental-strip-types test/serve-static.ts storybook-static-mcp 16010',
      url: 'http://localhost:16010/index.json',
      timeout: 120000,
    },
  ],
});
