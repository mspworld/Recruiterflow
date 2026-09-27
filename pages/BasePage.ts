import { expect, type Page } from '@playwright/test';
import { registerPage } from '@core/evidence';
import { perform } from '@core/perform';

export abstract class BasePage {
  abstract readonly path: string;

  constructor(protected readonly page: Page) {
    registerPage(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === this.path);
  }

  protected perform<T>(description: string, action: () => Promise<T>): Promise<T> {
    return perform(`${description} on ${this.constructor.name}`, action);
  }
}
