import type { Product } from '../models/Product';

export enum SortOption {
  NameAsc = 'az',
  NameDesc = 'za',
  PriceLowToHigh = 'lohi',
  PriceHighToLow = 'hilo',
}

interface SortCase {
  label: string;
  compare: (a: Product, b: Product) => number;
}

export const sortCases: Record<SortOption, SortCase> = {
  [SortOption.NameAsc]: { label: 'Name (A to Z)', compare: (a, b) => a.name.localeCompare(b.name) },
  [SortOption.NameDesc]: { label: 'Name (Z to A)', compare: (a, b) => b.name.localeCompare(a.name) },
  [SortOption.PriceLowToHigh]: { label: 'Price (low to high)', compare: (a, b) => a.price - b.price },
  [SortOption.PriceHighToLow]: { label: 'Price (high to low)', compare: (a, b) => b.price - a.price },
};
