const exchangeRate = 2646.54;

export function convertToUSD(amount) {
  return amount * exchangeRate;
}

export function shortenAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}