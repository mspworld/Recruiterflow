import { test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { cartProductNames } from '@data/products';
import { users } from '@data/users';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginAs }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));
  });

  test('adding two products updates the cart badge to 2', async ({ addToCart, productsPage }) => {
    await When('I add two products to the cart', () => addToCart(cartProductNames));
    await Then('the cart badge shows 2', () => productsPage.header.expectCartCount(2));
  });

  test('the cart page lists the products that were added', async ({ addToCart, productsPage, cartPage, uiContext }) => {
    await And('I have added two products to the cart', () => addToCart(cartProductNames));

    await When('I open the cart', async () => {
      await productsPage.header.openCart();
      await cartPage.expectLoaded();
    });

    await Then('the cart lists exactly those products', () =>
      cartPage.productList.expectExactly(uiContext.get('selectedProducts')),
    );
  });
});
