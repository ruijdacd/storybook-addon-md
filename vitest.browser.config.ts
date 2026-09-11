import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    include: ['test/browser/*.browser.test.tsx'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: { channel: process.env.PLAYWRIGHT_CHANNEL } }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
