import { expect, type Locator } from '@playwright/test';
import { resilient } from '@core/locators';
import type { UserCredentials } from '../models/UserCredentials';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected override readonly path = '/';
  private readonly usernameInput = resilient(this.page.getByTestId('username'), this.page.getByPlaceholder('Username'));
  private readonly passwordInput = resilient(this.page.getByTestId('password'), this.page.getByPlaceholder('Password'));
  private readonly loginButton = resilient(this.page.getByTestId('login-button'), this.page.getByRole('button', { name: 'Login' }));
  private readonly errorMessage = resilient(this.page.getByTestId('error'), this.page.getByRole('heading', { name: /epic sadface/i }));

  protected override landmark(): Locator {
    return this.loginButton;
  }

  async login(user: UserCredentials): Promise<void> {
    await this.perform(`log in as "${user.username}"`, async () => {
      await this.usernameInput.fill(user.username);
      await this.passwordInput.fill(user.password);
      await this.loginButton.click();
    });
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage, 'Login error message').toHaveText(message);
  }
}
