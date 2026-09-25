export const parsePrice = (text: string): number => {
  const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  if (!match) throw new Error(`Could not read a price from "${text}"`);
  return Number(match[1]);
};

export const sumPrices = (prices: readonly number[]): number =>
  Math.round(prices.reduce((total, price) => total + price, 0) * 100) / 100;
