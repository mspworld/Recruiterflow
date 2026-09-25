import { DataFactory } from '@core/DataFactory';

export class Customer {
  private _firstName = '';
  private _lastName = '';
  private _postalCode = '';

  static random(): Customer {
    const customer = new Customer();
    customer.firstName = DataFactory.firstName();
    customer.lastName = DataFactory.lastName();
    customer.postalCode = DataFactory.postalCode();
    return customer;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  set postalCode(value: string) {
    this._postalCode = value;
  }

  toJSON(): { firstName: string; lastName: string; postalCode: string } {
    return { firstName: this._firstName, lastName: this._lastName, postalCode: this._postalCode };
  }
}
