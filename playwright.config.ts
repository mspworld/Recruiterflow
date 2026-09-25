import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 1,
  workers: env.isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.uiBaseUrl,
        testIdAttribute: 'data-test',
        screenshot: 'on',
        video: 'on',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'x-api-key': env.apiKey,
        },
      },
    },
  ],
});
