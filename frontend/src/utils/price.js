const USD_TO_INR = 83.5;

export function formatINR(price) {
  const p = Number(price);
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(2)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
}

export function formatUSD(price) {
  const usd = Number(price) / USD_TO_INR;
  if (usd >= 1000000) return `$${(usd / 1000000).toFixed(2)}M`;
  return `$${Math.round(usd).toLocaleString('en-US')}`;
}

export function formatBoth(price) {
  return { inr: formatINR(price), usd: formatUSD(price) };
}
