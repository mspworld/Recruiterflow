import { expect, type Locator, type Page } from '@playwright/test';
import { Product } from '../models/Product';

const byName = (a: Product, b: Product): number => a.name.localeCompare(b.name);

export class ProductList {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
  }

  card(name: string): Locator {
    return this.items.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  async read(): Promise<Product[]> {
    await expect(this.items.first(), 'At least one product should be listed').toBeVisible();
    const names = await this.items.getByTestId('inventory-item-name').allInnerTexts();
    const prices = await this.items.getByTestId('inventory-item-price').allInnerTexts();
    if (names.length !== prices.length) {
      throw new Error(`Product list is inconsistent: ${names.length} names but ${prices.length} prices`);
    }
    return names.map((name, index) => Product.fromListing(name, prices[index]));
  }

  async expectExactly(expected: readonly Product[]): Promise<void> {
    await expect(this.items, 'Number of listed products').toHaveCount(expected.length);
    const actual = await this.read();
    expect(
      actual.sort(byName).map((product) => product.toJSON()),
      'Listed products should match the selected products',
    ).toEqual([...expected].sort(byName).map((product) => product.toJSON()));
  }
}
