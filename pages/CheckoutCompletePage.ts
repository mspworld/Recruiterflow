import { expect } from '@playwright/test';
import { pageTitles } from '../test-data/messages';
import { SecurePage } from './SecurePage';

export class CheckoutCompletePage extends SecurePage {
  protected override readonly path = '/checkout-complete.html';
  protected override readonly expectedTitle = pageTitles.checkoutComplete;
  private readonly confirmationHeader = this.page.getByTestId('complete-header');

  async expectOrderConfirmed(message: string): Promise<void> {
    await expect(this.confirmationHeader, 'Order confirmation message').toHaveText(message);
  }
}
