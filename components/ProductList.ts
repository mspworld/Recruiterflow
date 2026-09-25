import { expect, type Locator, type Page } from '@playwright/test';
import { Product } from '@models/Product';

export class ProductList {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
  }

  card(name: string): Locator {
    return this.items.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  async read(): Promise<Product[]> {
    await expect(this.items.first()).toBeVisible();
    const names = await this.items.getByTestId('inventory-item-name').allInnerTexts();
    const prices = await this.items.getByTestId('inventory-item-price').allInnerTexts();
    return names.map((name, index) => Product.fromPage(name, prices[index]));
  }

  async expectExactly(products: Product[]): Promise<void> {
    await expect(this.items.getByTestId('inventory-item-name')).toHaveText(products.map((product) => product.name));
    await expect(this.items.getByTestId('inventory-item-price')).toHaveText(
      products.map((product) => `$${product.price.toFixed(2)}`),
    );
  }
}
