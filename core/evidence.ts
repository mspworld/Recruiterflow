import { test, type Page, type TestInfo } from '@playwright/test';
import { config } from '@config/GlobalConfig';

let activePage: Page | undefined;

export function registerPage(page: Page): void {
  activePage = page;
}

export async function captureStep(stepTitle: string): Promise<void> {
  if (config.evidence !== 'full' || !activePage || activePage.isClosed()) return;
  try {
    const screenshot = await activePage.screenshot();
    await test.info().attach(`step: ${stepTitle}`, { body: screenshot, contentType: 'image/png' });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    test.info().annotations.push({ type: 'evidence', description: `No screenshot for "${stepTitle}": ${reason}` });
  }
}

export async function attachJson(testInfo: TestInfo, name: string, data: unknown): Promise<void> {
  await testInfo.attach(name, { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
}
