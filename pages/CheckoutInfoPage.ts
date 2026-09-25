import { pageTitles } from '../test-data/messages';
import type { Customer } from '../models/Customer';
import { SecurePage } from './SecurePage';

export class CheckoutInfoPage extends SecurePage {
  protected override readonly path = '/checkout-step-one.html';
  protected override readonly expectedTitle = pageTitles.checkoutInfo;
  private readonly firstNameInput = this.page.getByTestId('firstName');
  private readonly lastNameInput = this.page.getByTestId('lastName');
  private readonly postalCodeInput = this.page.getByTestId('postalCode');
  private readonly continueButton = this.page.getByRole('button', { name: 'Continue' });

  async submit(customer: Customer): Promise<void> {
    await this.perform('submit customer information', async () => {
      await this.firstNameInput.fill(customer.firstName);
      await this.lastNameInput.fill(customer.lastName);
      await this.postalCodeInput.fill(customer.postalCode);
      await this.continueButton.click();
    });
  }
}
