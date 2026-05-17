export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency,
  }).format(amount);
}

export function isValidAmount(value: string): string | null {
  const num = parseFloat(value);
  if (value.trim() === "") return "Amount is required";
  if (isNaN(num)) return "Amount must be a valid number";
  if (!isFinite(num)) return "Amount must be a finite number";
  if (num === 0) return "Amount cannot be zero";
  if (!/^-?\d+(\.\d{1,2})?$/.test(value.trim()))
    return "Amount cannot have more than 2 decimal places";
  return null;
}
