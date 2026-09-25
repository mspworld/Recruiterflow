import type { Customer } from './Customer';
import type { Product } from './Product';

export interface UiScenario {
  selectedProducts: Product[];
  customer: Customer;
}
