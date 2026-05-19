const EUR = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const EUR_COMPACT = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 2,
});

export function formatEUR(value: number, opts: { compact?: boolean; signed?: boolean } = {}) {
  const fmt = opts.compact ? EUR_COMPACT : EUR;
  const abs = fmt.format(Math.abs(value));
  if (!opts.signed) return value < 0 ? `-${abs}` : abs;
  if (value > 0) return `+${abs}`;
  if (value < 0) return `-${abs}`;
  return abs;
}
