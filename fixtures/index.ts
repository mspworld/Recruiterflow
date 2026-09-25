import { mergeTests } from '@playwright/test';
import { apiTest } from './api.fixtures';
import { uiTest } from './ui.fixtures';

export const test = mergeTests(uiTest, apiTest);
export { expect } from '@playwright/test';
