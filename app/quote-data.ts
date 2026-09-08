export type QuoteItem = { id: string; quantity: number };
export const QUOTE_LIMIT = 9999;
export function normalizeQuantity(value: number) {
  return Number.isFinite(value)
    ? Math.max(1, Math.min(QUOTE_LIMIT, Math.trunc(value)))
    : 1;
}
export function readQuote(
  raw: string,
  knownIds: ReadonlySet<string>,
): QuoteItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Map<string, QuoteItem>();
    for (const item of parsed) {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof item.id !== 'string' ||
        !knownIds.has(item.id)
      )
        continue;
      valid.set(item.id, {
        id: item.id,
        quantity: normalizeQuantity(
          typeof item.quantity === 'number' ? item.quantity : 1,
        ),
      });
    }
    return [...valid.values()];
  } catch {
    return [];
  }
}
