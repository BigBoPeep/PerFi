export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency,
  }).format(amount);
}
