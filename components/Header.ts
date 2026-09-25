import { expect, type Locator, type Page } from '@playwright/test';
import { resilient } from '@core/locators';
import { perform } from '@core/perform';

export class Header {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.cartLink = resilient(page.getByTestId('shopping-cart-link'), page.locator('.shopping_cart_link'));
    this.cartBadge = resilient(page.getByTestId('shopping-cart-badge'), page.locator('.shopping_cart_badge'));
  }

  async openCart(): Promise<void> {
    await perform('open the cart from the header', () => this.cartLink.click());
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge, 'Cart badge should be hidden when the cart is empty').toBeHidden();
      return;
    }
    await expect(this.cartBadge, 'Cart badge count').toHaveText(String(count));
  }
}
