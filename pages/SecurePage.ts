import { expect, type Locator } from '@playwright/test';
import { Header } from '../components/Header';
import { BasePage } from './BasePage';

export abstract class SecurePage extends BasePage {
  protected abstract readonly expectedTitle: string;
  readonly header = new Header(this.page);
  protected readonly title = this.page.getByTestId('title');

  protected override landmark(): Locator {
    return this.title;
  }

  override async expectLoaded(): Promise<void> {
    await super.expectLoaded();
    await expect(this.title, `${this.pageName} title`).toHaveText(this.expectedTitle);
  }
}
