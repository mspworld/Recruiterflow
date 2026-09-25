import { defineConfig, devices } from '@playwright/test';
import { config } from './config/GlobalConfig';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: config.run.isCI,
  retries: config.run.retries,
  workers: config.run.workers,
  timeout: config.timeouts.test,
  expect: { timeout: config.timeouts.expect },
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    actionTimeout: config.timeouts.action,
    navigationTimeout: config.timeouts.navigation,
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.ui.baseUrl,
        testIdAttribute: 'data-test',
        headless: !config.run.headed,
        launchOptions: { slowMo: config.run.slowMoMs },
        ...config.evidence,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: config.api.baseUrl,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'x-api-key': config.api.apiKey,
        },
      },
    },
  ],
});
