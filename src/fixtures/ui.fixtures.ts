import { test as base, type Page } from '@playwright/test';
import { attachJson } from '@core/evidence';
import { ScenarioContext } from '@core/ScenarioContext';
import type { UserCredentials } from '@ui/models/UserCredentials';
import type { UiScenario } from '@ui/models/UiScenario';
import { CartPage } from '@ui/pages/CartPage';
import { CheckoutCompletePage } from '@ui/pages/CheckoutCompletePage';
import { CheckoutInfoPage } from '@ui/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@ui/pages/CheckoutOverviewPage';
import { InventoryPage } from '@ui/pages/InventoryPage';
import { LoginPage } from '@ui/pages/LoginPage';

type PageConstructor<T> = new (page: Page) => T;

const pageFixture =
  <T>(PageClass: PageConstructor<T>) =>
  async ({ page }: { page: Page }, use: (instance: T) => Promise<void>): Promise<void> => {
    await use(new PageClass(page));
  };

export interface UiFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  loginAs: (user: UserCredentials) => Promise<InventoryPage>;
  uiContext: ScenarioContext<UiScenario>;
}

export const uiTest = base.extend<UiFixtures>({
  loginPage: pageFixture(LoginPage),
  inventoryPage: pageFixture(InventoryPage),
  cartPage: pageFixture(CartPage),
  checkoutInfoPage: pageFixture(CheckoutInfoPage),
  checkoutOverviewPage: pageFixture(CheckoutOverviewPage),
  checkoutCompletePage: pageFixture(CheckoutCompletePage),

  loginAs: async ({ loginPage, inventoryPage }, use) => {
    await use(async (user) => {
      await loginPage.open();
      await loginPage.login(user);
      await inventoryPage.expectLoaded();
      return inventoryPage;
    });
  },

  uiContext: async ({}, use, testInfo) => {
    const context = new ScenarioContext<UiScenario>();
    await use(context);
    if (!context.isEmpty()) await attachJson(testInfo, 'scenario-data', context);
  },
});
