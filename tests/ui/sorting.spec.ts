import { expect, test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { SortOption, sortCases } from '@data/sortOptions';
import { users } from '@data/users';

test.describe('Product sorting', () => {
  test('sorting by price (low to high) shows the cheapest product first', async ({ loginAs, productsPage }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));
    await When('I sort products by price, low to high', () => productsPage.sortBy(SortOption.PriceLowToHigh));

    await Then('the first product has the lowest price', async () => {
      const products = await productsPage.getProducts();
      const lowestPrice = Math.min(...products.map((product) => product.price));
      expect(products[0].price, `First product "${products[0].name}" should have the lowest price`).toBe(lowestPrice);
    });
  });

  for (const option of Object.values(SortOption)) {
    const { label, compare } = sortCases[option];

    test(`products are fully ordered when sorted by "${label}"`, async ({ loginAs, productsPage }) => {
      let countBeforeSort = 0;

      await Given('I am logged in as the standard user', async () => {
        await loginAs(users.standard);
        countBeforeSort = (await productsPage.getProducts()).length;
      });

      await When(`I sort products by "${label}"`, () => productsPage.sortBy(option));

      await Then('every product is in the expected order', async () => {
        await expect
          .poll(
            async () => {
              const products = await productsPage.getProducts();
              const expected = [...products].sort(compare);
              return products.every((product, index) => product.name === expected[index].name);
            },
            { message: `Products should be ordered by "${label}"` },
          )
          .toBe(true);
      });

      await And('no products are lost while sorting', () =>
        expect(productsPage.products.items, 'Product count after sorting').toHaveCount(countBeforeSort),
      );
    });
  }
});
