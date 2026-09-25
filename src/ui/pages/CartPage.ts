import { resilient } from '@core/locators';
import { ProductList } from '../components/ProductList';
import { pageTitles } from '../data/messages';
import { SecurePage } from './SecurePage';

export class CartPage extends SecurePage {
  protected override readonly path = '/cart.html';
  protected override readonly expectedTitle = pageTitles.cart;
  readonly products = new ProductList(this.page);
  private readonly checkoutButton = resilient(this.page.getByTestId('checkout'), this.page.getByRole('button', { name: 'Checkout' }));

  async proceedToCheckout(): Promise<void> {
    await this.perform('start checkout', () => this.checkoutButton.click());
  }
}
