import { expect } from '@playwright/test';
import { ProductList } from '../components/ProductList';
import { pageTitles } from '../test-data/messages';
import { sortCases, type SortOption } from '../test-data/sortOptions';
import type { Product } from '../models/Product';
import { SecurePage } from './SecurePage';

export class ProductsPage extends SecurePage {
  protected override readonly path = '/inventory.html';
  protected override readonly expectedTitle = pageTitles.products;
  readonly products = new ProductList(this.page);
  private readonly sortSelect = this.page.getByTestId('product-sort-container');
  private readonly activeSort = this.page.getByTestId('active-option');

  async getProducts(): Promise<Product[]> {
    return this.perform('read the product list', () => this.products.read());
  }

  async findProducts(names: readonly string[]): Promise<Product[]> {
    const listed = await this.getProducts();
    return names.map((name) => {
      const product = listed.find((candidate) => candidate.name === name);
      if (!product) {
        throw new Error(`Product "${name}" is not listed. Available: ${listed.map((item) => item.name).join(', ')}`);
      }
      return product;
    });
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
