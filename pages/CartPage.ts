import { ProductList } from '@components/ProductList';
import { SecurePage } from './SecurePage';

export class CartPage extends SecurePage {
  readonly path = '/cart.html';
  readonly title = 'Your Cart';
  readonly productList = new ProductList(this.page);
  private readonly checkoutButton = this.page.getByRole('button', { name: 'Checkout' });

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
