import { test as base } from '@playwright/test';
import { UsersClient } from '@api/clients/UsersClient';
import { attachJson } from '@core/evidence';
import { ScenarioContext } from '@core/ScenarioContext';
import type { ApiScenario } from '@models/ApiScenario';

interface ApiFixtures {
  usersClient: UsersClient;
  apiContext: ScenarioContext<ApiScenario>;
}

export const apiTest = base.extend<ApiFixtures>({
  usersClient: async ({ request }, use, testInfo) => {
    await use(new UsersClient(request, testInfo));
  },

  apiContext: async ({}, use, testInfo) => {
    const context = new ScenarioContext<ApiScenario>();
    await use(context);
    if (!context.isEmpty()) await attachJson(testInfo, 'scenario-data', context);
  },
});
