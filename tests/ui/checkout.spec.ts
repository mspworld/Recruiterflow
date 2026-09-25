import { test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { PRODUCTS_TO_ADD } from '@data/checkout';
import { messages } from '@data/messages';
import { users } from '@data/users';
import { Customer } from '@models/Customer';
import { sumPrices } from '@utils/price';

test.describe('Checkout', () => {
  test('user completes checkout and sees the order confirmation', async ({
    loginAs,
    productsPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    uiContext,
  }) => {
    await Given('I am logged in as the standard user', () => loginAs(users.standard));

    await And(`I have ${PRODUCTS_TO_ADD} products in my cart`, async () => {
      const products = await productsPage.pickRandomProducts(PRODUCTS_TO_ADD);
      await productsPage.addToCart(...products);
      uiContext.set('selectedProducts', products);
    });

    await When('I open the cart', async () => {
      await productsPage.header.openCart();
      await cartPage.expectLoaded();
    });

    await Then('the cart contains exactly the selected products', () =>
      cartPage.products.expectExactly(uiContext.get('selectedProducts')),
    );

    await When('I check out with my details', async () => {
      uiContext.set('customer', Customer.random());
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.expectLoaded();
      await checkoutInfoPage.submit(uiContext.get('customer'));
      await checkoutOverviewPage.expectLoaded();
    });

    await Then('the overview lists the selected products and the correct item total', async () => {
      const selected = uiContext.get('selectedProducts');
      await checkoutOverviewPage.products.expectExactly(selected);
      await checkoutOverviewPage.expectItemTotal(sumPrices(selected.map((product) => product.price)));
    });

    await When('I finish the order', async () => {
      await checkoutOverviewPage.finish();
      await checkoutCompletePage.expectLoaded();
    });

    await Then('I see the thank-you message', () => checkoutCompletePage.expectOrderConfirmed(messages.orderComplete));
    await And('my cart is empty', () => checkoutCompletePage.header.expectCartCount(0));
  });
});
