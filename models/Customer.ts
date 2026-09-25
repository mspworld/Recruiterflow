import { DataFactory } from '@core/DataFactory';

export class Customer {
  private _firstName: string;
  private _lastName: string;
  private _postalCode: string;

  constructor(firstName: string, lastName: string, postalCode: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._postalCode = postalCode;
  }

  static random(): Customer {
    return new Customer(DataFactory.firstName(), DataFactory.lastName(), DataFactory.postalCode());
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

  toJSON() {
    return { firstName: this._firstName, lastName: this._lastName, postalCode: this._postalCode };
  }
}
