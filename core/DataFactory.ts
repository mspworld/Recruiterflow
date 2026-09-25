const FIRST_NAMES = ['Asha', 'Liam', 'Priya', 'Noah', 'Meera', 'Ethan', 'Kavya', 'Omar'] as const;
const LAST_NAMES = ['Kumar', 'Smith', 'Iyer', 'Garcia', 'Nair', 'Brown', 'Patel', 'Silva'] as const;
const JOBS = ['qa engineer', 'developer', 'product manager', 'designer', 'sdet'] as const;

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const pickOne = <T>(items: readonly T[]): T => items[randomInt(0, items.length - 1)];

export const DataFactory = {
  uniqueSuffix: (): string => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  firstName: (): string => pickOne(FIRST_NAMES),
  lastName: (): string => pickOne(LAST_NAMES),
  jobTitle: (): string => pickOne(JOBS),
  postalCode: (): string => String(randomInt(10000, 99999)),
};
