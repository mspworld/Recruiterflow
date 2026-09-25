import { test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { messages } from '@data/messages';
import { cartProductNames } from '@data/products';
import { users } from '@data/users';
import { Customer } from '@models/Customer';
import { sumPrices } from '@utils/price';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginAs, addToCart, productsPage, cartPage, checkoutInfoPage, checkoutOverviewPage, uiContext }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));
    await And('I have two products in my cart', () => addToCart(cartProductNames));

    await And('I have entered my checkout information', async () => {
      uiContext.set('customer', Customer.random());
      await productsPage.header.openCart();
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.expectLoaded();
      await checkoutInfoPage.submit(uiContext.get('customer'));
      await checkoutOverviewPage.expectLoaded();
    });
  });

  test('the overview shows the selected products and the correct item total', async ({ checkoutOverviewPage, uiContext }) => {
    const selected = uiContext.get('selectedProducts');

    await Then('the overview lists the selected products', () => checkoutOverviewPage.productList.expectExactly(selected));
    await And('the item total is the sum of their prices', () =>
      checkoutOverviewPage.expectItemTotal(sumPrices(selected.map((product) => product.price))),
    );
  });

  test('finishing the order shows the "Thank you for your order!" message', async ({ checkoutOverviewPage, checkoutCompletePage }) => {
    await When('I finish the order', async () => {
      await checkoutOverviewPage.finish();
      await checkoutCompletePage.expectLoaded();
    });

    await Then('I see the thank-you message', () => checkoutCompletePage.expectOrderConfirmed(messages.orderComplete));
  });

  test('the cart is empty after the order is placed', async ({ checkoutOverviewPage, checkoutCompletePage }) => {
    await When('I finish the order', async () => {
      await checkoutOverviewPage.finish();
      await checkoutCompletePage.expectLoaded();
    });

    await Then('the cart badge is gone', () => checkoutCompletePage.header.expectCartCount(0));
  });
});
