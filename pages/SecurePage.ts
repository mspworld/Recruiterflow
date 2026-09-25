import { expect } from '@playwright/test';
import { Header } from '@components/Header';
import { BasePage } from './BasePage';

export abstract class SecurePage extends BasePage {
  abstract readonly title: string;
  readonly header = new Header(this.page);
  private readonly pageTitle = this.page.getByTestId('title');

  override async expectLoaded(): Promise<void> {
    await super.expectLoaded();
    await expect(this.pageTitle).toHaveText(this.title);
  }
}
