export function sanitizeString(
  value: string | undefined,
  maxLength = 500,
): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  return trimmed.slice(0, maxLength);
}

export function sanitizeCurrencyAmount(
  value: string | number | undefined,
): number | null {
  if (value === undefined) return null;
  const num = typeof value === "string" ? parseFloat(value.trim()) : value;

  if (value === "") return null;
  if (isNaN(num) || !isFinite(num) || num === 0) return null;

  return Math.round(num * 100) / 100;
}
