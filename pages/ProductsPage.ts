import { expect } from '@playwright/test';
import { ProductList } from '@components/ProductList';
import type { Product } from '@models/Product';
import { sortOptions, type SortOption } from '@data/sortOptions';
import { SecurePage } from './SecurePage';

export class ProductsPage extends SecurePage {
  readonly path = '/inventory.html';
  readonly title = 'Products';
  readonly productList = new ProductList(this.page);
  private readonly sortDropdown = this.page.getByTestId('product-sort-container');
  private readonly activeSort = this.page.getByTestId('active-option');

  async getProducts(): Promise<Product[]> {
    return this.productList.read();
  }

  async findProducts(names: string[]): Promise<Product[]> {
    const products = await this.getProducts();
    return names.map((name) => {
      const product = products.find((item) => item.name === name);
      if (!product) throw new Error(`Product "${name}" is not on the products page`);
      return product;
    });
  }

  async addToCart(products: Product[]): Promise<void> {
    for (const product of products) {
      await this.perform(`add "${product.name}" to the cart`, async () => {
        const card = this.productList.card(product.name);
        await card.getByRole('button', { name: 'Add to cart' }).click();
        await expect(card.getByRole('button', { name: 'Remove' })).toBeVisible();
      });
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    const { value, label } = sortOptions[option];
    await this.perform(`sort by "${label}"`, async () => {
      await this.sortDropdown.selectOption(value);
      await expect(this.activeSort).toHaveText(label);
    });
  }
}
