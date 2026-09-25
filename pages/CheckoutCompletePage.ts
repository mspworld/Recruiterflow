import { expect } from '@playwright/test';
import { SecurePage } from './SecurePage';

export class CheckoutCompletePage extends SecurePage {
  readonly path = '/checkout-complete.html';
  readonly title = 'Checkout: Complete!';
  private readonly confirmationMessage = this.page.getByTestId('complete-header');

  async expectOrderConfirmed(message: string): Promise<void> {
    await expect(this.confirmationMessage).toHaveText(message);
  }
}
