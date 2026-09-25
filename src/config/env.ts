import { config } from 'dotenv';

config({ quiet: true });

const readNumber = (key: string, fallback: number): number => {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) throw new Error(`Environment variable ${key} must be a number, received "${raw}"`);
  return parsed;
};

export const env = {
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://reqres.in',
  apiKey: process.env.REQRES_API_KEY ?? 'reqres-free-v1',
  saucePassword: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
  apiMaxRetries: readNumber('API_MAX_RETRIES', 2),
  isCI: Boolean(process.env.CI),
} as const;
