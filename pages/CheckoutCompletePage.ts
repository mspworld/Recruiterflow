import { expect } from '@playwright/test';
import { resilient } from '@core/locators';
import { pageTitles } from '../test-data/messages';
import { SecurePage } from './SecurePage';

export class CheckoutCompletePage extends SecurePage {
  protected override readonly path = '/checkout-complete.html';
  protected override readonly expectedTitle = pageTitles.checkoutComplete;
  private readonly confirmationHeader = resilient(this.page.getByTestId('complete-header'), this.page.getByRole('heading', { level: 2 }));

  async expectOrderConfirmed(message: string): Promise<void> {
    await expect(this.confirmationHeader, 'Order confirmation message').toHaveText(message);
  }
}
