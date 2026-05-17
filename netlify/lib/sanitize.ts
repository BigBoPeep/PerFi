export function sanitizeString(
  value: string | undefined,
  maxLength = 500,
): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  return trimmed.slice(0, maxLength);
}
