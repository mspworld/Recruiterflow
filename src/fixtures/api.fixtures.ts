import { test as base } from '@playwright/test';
import { attachJson } from '@core/evidence';
import { ScenarioContext } from '@core/ScenarioContext';
import { UsersClient } from '@api/clients/UsersClient';
import type { ApiScenario } from '@api/models/ApiScenario';

export interface ApiFixtures {
  usersClient: UsersClient;
  apiContext: ScenarioContext<ApiScenario>;
}

export const apiTest = base.extend<ApiFixtures>({
  usersClient: async ({ request }, use, testInfo) => {
    await use(
      new UsersClient(request, (exchange) =>
        attachJson(testInfo, `${exchange.request.method} ${exchange.request.path}`, exchange),
      ),
    );
  },

  apiContext: async ({}, use, testInfo) => {
    const context = new ScenarioContext<ApiScenario>();
    await use(context);
    if (!context.isEmpty()) await attachJson(testInfo, 'scenario-data', context);
  },
});
