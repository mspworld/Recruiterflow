const firstNames = ['Asha', 'Liam', 'Priya', 'Noah', 'Meera', 'Ethan'];
const lastNames = ['Kumar', 'Smith', 'Iyer', 'Garcia', 'Nair', 'Brown'];
const jobs = ['qa engineer', 'developer', 'product manager', 'designer'];

const pick = (list: string[]): string => list[Math.floor(Math.random() * list.length)];

export const DataFactory = {
  firstName: () => pick(firstNames),
  lastName: () => pick(lastNames),
  job: () => pick(jobs),
  postalCode: () => String(Math.floor(10000 + Math.random() * 90000)),
  uniqueName: (prefix: string) => `${prefix}-${Date.now()}`,
};
