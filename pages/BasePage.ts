import { expect, type Locator, type Page } from '@playwright/test';
import { perform } from '@core/perform';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  protected abstract landmark(): Locator;

  async open(): Promise<void> {
    await this.perform(`open ${this.path}`, async () => {
      await this.page.goto(this.path);
    });
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page, `${this.pageName} URL`).toHaveURL(new RegExp(`${escapeRegExp(this.path)}$`));
    await expect(this.landmark(), `${this.pageName} should be visible`).toBeVisible();
  }

  protected get pageName(): string {
    return this.constructor.name;
  }

  protected perform<T>(description: string, action: () => Promise<T>): Promise<T> {
    return perform(`${description} on ${this.pageName}`, action);
  }
}
