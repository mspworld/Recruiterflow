import { expect } from '@playwright/test';
import { DataFactory } from '@core/DataFactory';
import { resilient } from '@core/locators';
import { ProductList } from '../components/ProductList';
import { pageTitles } from '../data/messages';
import { sortCases, type SortOption } from '../data/sortOptions';
import type { Product } from '../models/Product';
import { SecurePage } from './SecurePage';

export class InventoryPage extends SecurePage {
  protected override readonly path = '/inventory.html';
  protected override readonly expectedTitle = pageTitles.products;
  readonly products = new ProductList(this.page);
  private readonly sortSelect = resilient(this.page.getByTestId('product-sort-container'), this.page.getByRole('combobox'));
  private readonly activeSort = this.page.getByTestId('active-option');

  async getProducts(): Promise<Product[]> {
    return this.perform('read the product list', () => this.products.read());
  }

  async pickRandomProducts(count: number): Promise<Product[]> {
    return DataFactory.sample(await this.getProducts(), count);
  }

  async addToCart(...products: Product[]): Promise<void> {
    for (const product of products) {
      await this.perform(`add "${product.name}" to the cart`, async () => {
        const card = this.products.card(product.name);
        await card.getByRole('button', { name: 'Add to cart' }).click();
        await expect(card.getByRole('button', { name: 'Remove' })).toBeVisible();
      });
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    const { label } = sortCases[option];
    await this.perform(`sort products by "${label}"`, async () => {
      await this.sortSelect.selectOption(option);
      await expect(this.activeSort).toHaveText(label);
    });
  }
}
