import { expect, test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { SortOption, sortCases } from '@ui/data/sortOptions';
import { users } from '@ui/data/users';

test.describe('Product sorting', () => {
  test('sorting by price (low to high) shows the cheapest product first', async ({ loginAs, inventoryPage }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));
    await When('I sort products by price, low to high', () => inventoryPage.sortBy(SortOption.PriceLowToHigh));

    await Then('the first product has the lowest price', async () => {
      const products = await inventoryPage.getProducts();
      const lowestPrice = Math.min(...products.map((product) => product.price));
      expect(products[0].price, `First product "${products[0].name}" should have the lowest price`).toBe(lowestPrice);
    });
  });

  for (const option of Object.values(SortOption)) {
    const { label, compare } = sortCases[option];

    test(`products are fully ordered when sorted by "${label}"`, async ({ loginAs, inventoryPage }) => {
      let countBeforeSort = 0;

      await Given('I am logged in as the standard user', async () => {
        await loginAs(users.standard);
        countBeforeSort = (await inventoryPage.getProducts()).length;
      });

      await When(`I sort products by "${label}"`, () => inventoryPage.sortBy(option));

      await Then('every product is in the expected order', async () => {
        await expect
          .poll(
            async () => {
              const products = await inventoryPage.getProducts();
              const expected = [...products].sort(compare);
              return products.every((product, index) => product.name === expected[index].name);
            },
            { message: `Products should be ordered by "${label}"` },
          )
          .toBe(true);
      });

      await And('no products are lost while sorting', () =>
        expect(inventoryPage.products.items, 'Product count after sorting').toHaveCount(countBeforeSort),
      );
    });
  }
});
