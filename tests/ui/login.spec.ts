import { test } from '@fixtures';
import { And, Given, Then, When } from '@core/bdd';
import { messages } from '@ui/data/messages';
import { users } from '@ui/data/users';

test.describe('Login', () => {
  test('standard user logs in and lands on the products page', async ({ loginPage, inventoryPage }) => {
    await Given('I am on the login page', () => loginPage.open());
    await When('I log in as the standard user', () => loginPage.login(users.standard));
    await Then('I land on the products page', () => inventoryPage.expectLoaded());
  });

  test('locked-out user sees an error and is not logged in', async ({ loginPage }) => {
    await Given('I am on the login page', () => loginPage.open());
    await When('I log in as the locked-out user', () => loginPage.login(users.lockedOut));
    await Then('I see the locked-out error message', () => loginPage.expectError(messages.lockedOut));
    await And('I am still on the login page', () => loginPage.expectLoaded());
  });
});
