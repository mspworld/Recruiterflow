import { expect } from '@playwright/test';
import { ProductList } from '@components/ProductList';
import { SecurePage } from './SecurePage';

export class CheckoutOverviewPage extends SecurePage {
  readonly path = '/checkout-step-two.html';
  readonly title = 'Checkout: Overview';
  readonly productList = new ProductList(this.page);
  private readonly itemTotal = this.page.getByTestId('subtotal-label');
  private readonly finishButton = this.page.getByRole('button', { name: 'Finish' });

  async expectItemTotal(total: number): Promise<void> {
    await expect(this.itemTotal).toHaveText(`Item total: $${total.toFixed(2)}`);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
