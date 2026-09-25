import { expect, test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { expectCreatedUser, expectUserShape } from '@api/assertions/userAssertions';
import { buildUserPayload, LIST_PAGE, userPayloads } from '@data/userPayloads';
import { CreatedUser } from '@models/CreatedUser';

test.describe('Users API', () => {
  test(`GET /api/users?page=${LIST_PAGE} returns users with the required fields`, async ({ usersClient }) => {
    const response = await When(`I request page ${LIST_PAGE} of users`, () => usersClient.listUsers(LIST_PAGE));

    await Then('the status is 200', async () => {
      expect(response.status, 'Status code').toBe(200);
    });

    await And('the body contains a non-empty data array for the requested page', async () => {
      expect(response.body.page, 'Returned page number').toBe(LIST_PAGE);
      expect(Array.isArray(response.body.data), '"data" should be an array').toBe(true);
      expect(response.body.data.length, '"data" should not be empty').toBeGreaterThan(0);
    });

    await And('every user has id, email, first_name and last_name', async () => {
      response.body.data.forEach(expectUserShape);
    });
  });

  test('POST /api/users creates a user and echoes name and job', async ({ usersClient }) => {
    const payload = userPayloads.morpheus;
    const requestedAt = Date.now();

    const response = await When(`I create the user "${payload.name}"`, () => usersClient.createUser(payload));

    await Then('the status is 201', async () => {
      expect(response.status, 'Status code').toBe(201);
    });

    await And('the response echoes name and job with an id and createdAt', async () => {
      expectCreatedUser(response.body, payload, requestedAt);
    });
  });

  test('create-then-verify: a created user is stored and verified in a follow-up step', async ({
    usersClient,
    apiContext,
  }) => {
    await Given('a new user payload with unique data', async () => {
      apiContext.set('payload', buildUserPayload());
    });

    await When('I create the user', async () => {
      apiContext.set('requestedAt', Date.now());
      const response = await usersClient.createUser(apiContext.get('payload'));
      expect(response.status, 'Status code').toBe(201);
      apiContext.set('createdUser', CreatedUser.fromResponse(response.body));
    });

    await Then('the stored user matches what I sent', async () => {
      const createdUser = apiContext.get('createdUser');
      expectCreatedUser(createdUser.toJSON(), apiContext.get('payload'), apiContext.get('requestedAt'));
    });
  });
});
