import { expect, test } from '@fixtures';
import { Given, Then, When } from '@core/bdd';
import { sortOptions, type SortOption } from '@data/sortOptions';
import { users } from '@data/users';

test.describe('Product sorting', () => {
  test.beforeEach(async ({ loginAs }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));
  });

  test('sorting by price (low to high) shows the cheapest product first', async ({ productsPage }) => {
    await When('I sort by price, low to high', () => productsPage.sortBy('priceLowToHigh'));

    await Then('the first product has the lowest price', async () => {
      const products = await productsPage.getProducts();
      const lowestPrice = Math.min(...products.map((product) => product.price));
      expect(products[0].price).toBe(lowestPrice);
    });
  });

  for (const option of Object.keys(sortOptions) as SortOption[]) {
    const { label, compare } = sortOptions[option];

    test(`every product is in order when sorted by "${label}"`, async ({ productsPage }) => {
      await When(`I sort by "${label}"`, () => productsPage.sortBy(option));

      await Then('the whole list is in the expected order', async () => {
        const products = await productsPage.getProducts();
        const expected = [...products].sort(compare);
        expect(products.map((product) => product.name)).toEqual(expected.map((product) => product.name));
      });
    });
  }
});
