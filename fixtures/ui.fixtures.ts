import { test as base } from '@playwright/test';
import { attachJson } from '@core/evidence';
import { ScenarioContext } from '@core/ScenarioContext';
import type { UiScenario } from '@models/UiScenario';
import type { UserCredentials } from '@models/UserCredentials';
import { CartPage } from '@pages/CartPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { CheckoutInfoPage } from '@pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage } from '@pages/ProductsPage';

interface UiFixtures {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  uiContext: ScenarioContext<UiScenario>;
  loginAs: (user: UserCredentials) => Promise<void>;
  addToCart: (productNames: string[]) => Promise<void>;
}

export const uiTest = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  uiContext: async ({}, use, testInfo) => {
    const context = new ScenarioContext<UiScenario>();
    await use(context);
    if (!context.isEmpty()) await attachJson(testInfo, 'scenario-data', context);
  },

  loginAs: async ({ loginPage, productsPage }, use) => {
    await use(async (user) => {
      await loginPage.open();
      await loginPage.login(user);
      await productsPage.expectLoaded();
    });
  },

  addToCart: async ({ productsPage, uiContext }, use) => {
    await use(async (productNames) => {
      const products = await productsPage.findProducts(productNames);
      await productsPage.addToCart(products);
      uiContext.set('selectedProducts', products);
    });
  },
});
