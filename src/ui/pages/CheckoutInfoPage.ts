import { resilient } from '@core/locators';
import { pageTitles } from '../data/messages';
import type { Customer } from '../models/Customer';
import { SecurePage } from './SecurePage';

export class CheckoutInfoPage extends SecurePage {
  protected override readonly path = '/checkout-step-one.html';
  protected override readonly expectedTitle = pageTitles.checkoutInfo;
  private readonly firstNameInput = resilient(this.page.getByTestId('firstName'), this.page.getByPlaceholder('First Name'));
  private readonly lastNameInput = resilient(this.page.getByTestId('lastName'), this.page.getByPlaceholder('Last Name'));
  private readonly postalCodeInput = resilient(this.page.getByTestId('postalCode'), this.page.getByPlaceholder('Zip/Postal Code'));
  private readonly continueButton = resilient(this.page.getByTestId('continue'), this.page.getByRole('button', { name: 'Continue' }));

  async submit(customer: Customer): Promise<void> {
    await this.perform('submit customer information', async () => {
      await this.firstNameInput.fill(customer.firstName);
      await this.lastNameInput.fill(customer.lastName);
      await this.postalCodeInput.fill(customer.postalCode);
      await this.continueButton.click();
    });
  }
}
