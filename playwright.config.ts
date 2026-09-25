import { defineConfig, devices } from '@playwright/test';
import { config } from './config/GlobalConfig';

const evidenceSettings = {
  off: { screenshot: 'off', video: 'off', trace: 'off' },
  failure: { screenshot: 'only-on-failure', video: 'off', trace: 'retain-on-failure' },
  full: { screenshot: 'on', video: 'on', trace: 'retain-on-failure' },
} as const;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: config.isCI,
  retries: config.isCI ? 2 : 1,
  workers: config.isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.uiBaseUrl,
        testIdAttribute: 'data-test',
        headless: !config.headed,
        launchOptions: { slowMo: config.slowMo },
        ...evidenceSettings[config.evidence],
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: config.apiBaseUrl,
        extraHTTPHeaders: { 'x-api-key': config.apiKey },
      },
    },
  ],
});
