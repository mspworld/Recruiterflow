import { expect } from '@playwright/test';
import type { UserCredentials } from '@models/UserCredentials';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/';
  private readonly usernameInput = this.page.getByTestId('username');
  private readonly passwordInput = this.page.getByTestId('password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly errorMessage = this.page.getByTestId('error');

  override async expectLoaded(): Promise<void> {
    await super.expectLoaded();
    await expect(this.loginButton).toBeVisible();
  }

  async login(user: UserCredentials): Promise<void> {
    await this.perform(`log in as ${user.username}`, async () => {
      await this.usernameInput.fill(user.username);
      await this.passwordInput.fill(user.password);
      await this.loginButton.click();
    });
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(message);
  }
}
