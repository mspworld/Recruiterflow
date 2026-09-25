import { parsePrice } from '../utils/price';

export class Product {
  private _name = '';
  private _price = 0;

  static fromListing(name: string, priceText: string): Product {
    const product = new Product();
    product.name = name;
    product.price = parsePrice(priceText);
    return product;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    const trimmed = value.trim();
    if (!trimmed) throw new Error('Product name cannot be empty');
    this._name = trimmed;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid product price: ${value}`);
    this._price = value;
  }

  toJSON(): { name: string; price: number } {
    return { name: this._name, price: this._price };
  }
}
