import { ProductList } from '../components/ProductList';
import { pageTitles } from '../test-data/messages';
import { SecurePage } from './SecurePage';

export class CartPage extends SecurePage {
  protected override readonly path = '/cart.html';
  protected override readonly expectedTitle = pageTitles.cart;
  readonly products = new ProductList(this.page);
  private readonly checkoutButton = this.page.getByRole('button', { name: 'Checkout' });

  async proceedToCheckout(): Promise<void> {
    await this.perform('start checkout', () => this.checkoutButton.click());
  }
}
