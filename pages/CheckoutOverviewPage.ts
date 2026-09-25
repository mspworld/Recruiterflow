import { expect } from '@playwright/test';
import { ProductList } from '../components/ProductList';
import { pageTitles } from '../test-data/messages';
import { parsePrice } from '../utils/price';
import { SecurePage } from './SecurePage';

export class CheckoutOverviewPage extends SecurePage {
  protected override readonly path = '/checkout-step-two.html';
  protected override readonly expectedTitle = pageTitles.checkoutOverview;
  readonly products = new ProductList(this.page);
  private readonly itemTotal = this.page.getByTestId('subtotal-label');
  private readonly finishButton = this.page.getByRole('button', { name: 'Finish' });

  async expectItemTotal(expected: number): Promise<void> {
    await expect
      .poll(async () => parsePrice(await this.itemTotal.innerText()), { message: 'Checkout item total' })
      .toBeCloseTo(expected, 2);
  }

  async finish(): Promise<void> {
    await this.perform('finish the order', () => this.finishButton.click());
  }
}
