import { expect, type Locator } from '@playwright/test';
import { resilient } from '@core/locators';
import { Header } from '../components/Header';
import { BasePage } from './BasePage';

export abstract class SecurePage extends BasePage {
  protected abstract readonly expectedTitle: string;
  readonly header = new Header(this.page);
  protected readonly title = resilient(this.page.getByTestId('title'), this.page.locator('.title'));

  protected override landmark(): Locator {
    return this.title;
  }

  override async expectLoaded(): Promise<void> {
    await super.expectLoaded();
    await expect(this.title, `${this.pageName} title`).toHaveText(this.expectedTitle);
  }
}
