// src/lib/format.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseCurrencyInput(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}
