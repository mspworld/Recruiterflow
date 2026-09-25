import type { Product } from '@models/Product';

interface SortRule {
  value: string;
  label: string;
  compare: (a: Product, b: Product) => number;
}

export const sortOptions = {
  nameAToZ: { value: 'az', label: 'Name (A to Z)', compare: (a, b) => a.name.localeCompare(b.name) },
  nameZToA: { value: 'za', label: 'Name (Z to A)', compare: (a, b) => b.name.localeCompare(a.name) },
  priceLowToHigh: { value: 'lohi', label: 'Price (low to high)', compare: (a, b) => a.price - b.price },
  priceHighToLow: { value: 'hilo', label: 'Price (high to low)', compare: (a, b) => b.price - a.price },
} satisfies Record<string, SortRule>;

export type SortOption = keyof typeof sortOptions;
