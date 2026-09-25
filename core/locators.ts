import type { Locator } from '@playwright/test';

export const resilient = (primary: Locator, ...fallbacks: Locator[]): Locator =>
  fallbacks.reduce((combined, fallback) => combined.or(fallback), primary).first();
