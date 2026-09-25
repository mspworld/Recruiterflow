export function parsePrice(text: string): number {
  const price = Number(text.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(price)) throw new Error(`"${text}" is not a price`);
  return price;
}

export function sumPrices(prices: number[]): number {
  const total = prices.reduce((sum, price) => sum + price, 0);
  return Math.round(total * 100) / 100;
}
