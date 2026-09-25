import { parsePrice } from '@utils/price';

export class Product {
  private _name: string;
  private _price: number;

  constructor(name: string, price: number) {
    this._name = name;
    this._price = price;
  }

  static fromPage(name: string, priceText: string): Product {
    return new Product(name.trim(), parsePrice(priceText));
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  toJSON() {
    return { name: this._name, price: this._price };
  }
}
