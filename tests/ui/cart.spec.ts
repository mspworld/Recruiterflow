import { test } from '@fixtures';
import { Given, Then, When } from '@core/bdd';
import { PRODUCTS_TO_ADD } from '@data/checkout';
import { users } from '@data/users';

test.describe('Cart', () => {
  test('adding two products updates the cart badge to 2', async ({ loginAs, productsPage, uiContext }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));

    await When(`I add ${PRODUCTS_TO_ADD} products to the cart`, async () => {
      const products = await productsPage.pickRandomProducts(PRODUCTS_TO_ADD);
      await productsPage.addToCart(...products);
      uiContext.set('selectedProducts', products);
    });

    await Then(`the cart badge shows ${PRODUCTS_TO_ADD}`, () => productsPage.header.expectCartCount(PRODUCTS_TO_ADD));
  });
});
