import { mergeTests } from '@playwright/test';
import { uiTest } from './ui.fixtures';

export const test = mergeTests(uiTest);
export { expect } from '@playwright/test';
