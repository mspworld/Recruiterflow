export function parsePrice(text: string): number {
  const digits = text.replace(/[^0-9.]/g, '');
  const price = Number(digits);
  if (!digits || Number.isNaN(price)) throw new Error(`"${text}" is not a price`);
  return price;
}

export function sumPrices(prices: number[]): number {
  const total = prices.reduce((sum, price) => sum + price, 0);
  return Math.round(total * 100) / 100;
}
