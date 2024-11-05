const exchangeRate = 2646.54;

export function convertToUSD(amount) {
  return amount * exchangeRate;
}