import { expect, test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { expectCreatedUser, expectUserFields } from '@api/assertions/userAssertions';
import { CreatedUser } from '@models/CreatedUser';
import { morpheus, newUserPayload } from '@data/userPayloads';

test.describe('Users API', () => {
  test('GET /api/users?page=2 returns a list of users with the required fields', async ({ usersClient }) => {
    const response = await When('I request page 2 of users', () => usersClient.listUsers(2));

    await Then('the status is 200', async () => {
      expect(response.status).toBe(200);
    });

    await And('the response has a "data" array', async () => {
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    await And('every user has id, email, first_name and last_name', async () => {
      response.body.data.forEach(expectUserFields);
    });
  });

  test('POST /api/users creates a user and echoes back name and job', async ({ usersClient }) => {
    const requestedAt = Date.now();
    const response = await When('I create the user "morpheus"', () => usersClient.createUser(morpheus));

    await Then('the status is 201', async () => {
      expect(response.status).toBe(201);
    });

    await And('the response has the same name and job, plus an id and createdAt', async () => {
      expectCreatedUser(response.body, morpheus, requestedAt);
    });
  });

  test('create-then-verify: the created user is saved and checked in the next step', async ({ usersClient, apiContext }) => {
    await Given('I have a new user to create', async () => {
      apiContext.set('payload', newUserPayload());
    });

    await When('I create the user and save the result', async () => {
      apiContext.set('requestedAt', Date.now());
      const response = await usersClient.createUser(apiContext.get('payload'));
      expect(response.status).toBe(201);
      apiContext.set('createdUser', CreatedUser.fromResponse(response.body));
    });

    await Then('the saved user matches what I sent', async () => {
      const createdUser = apiContext.get('createdUser');
      expectCreatedUser(createdUser.toJSON(), apiContext.get('payload'), apiContext.get('requestedAt'));
    });
  });
});
