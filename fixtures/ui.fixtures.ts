import { test as base, type Page } from '@playwright/test';
import { attachJson } from '@core/evidence';
import { ScenarioContext } from '@core/ScenarioContext';
import type { UserCredentials } from '@models/UserCredentials';
import type { UiScenario } from '@models/UiScenario';
import { CartPage } from '@pages/CartPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { CheckoutInfoPage } from '@pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { ProductsPage } from '@pages/ProductsPage';
import { LoginPage } from '@pages/LoginPage';

type PageConstructor<T> = new (page: Page) => T;

const pageFixture =
  <T>(PageClass: PageConstructor<T>) =>
  async ({ page }: { page: Page }, use: (instance: T) => Promise<void>): Promise<void> => {
    await use(new PageClass(page));
  };

export interface UiFixtures {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  loginAs: (user: UserCredentials) => Promise<ProductsPage>;
  uiContext: ScenarioContext<UiScenario>;
}

export const uiTest = base.extend<UiFixtures>({
  loginPage: pageFixture(LoginPage),
  productsPage: pageFixture(ProductsPage),
  cartPage: pageFixture(CartPage),
  checkoutInfoPage: pageFixture(CheckoutInfoPage),
  checkoutOverviewPage: pageFixture(CheckoutOverviewPage),
  checkoutCompletePage: pageFixture(CheckoutCompletePage),

  loginAs: async ({ loginPage, productsPage }, use) => {
    await use(async (user) => {
      await loginPage.open();
      await loginPage.login(user);
      await productsPage.expectLoaded();
      return productsPage;
    });
  },

  uiContext: async ({}, use, testInfo) => {
    const context = new ScenarioContext<UiScenario>();
    await use(context);
    if (!context.isEmpty()) await attachJson(testInfo, 'scenario-data', context);
  },
});
