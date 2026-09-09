'use client';
import { useMemo, useSyncExternalStore } from 'react';
import type { Product } from './products';
import { normalizeQuantity, readQuote, type QuoteItem } from './quote-data';
const key = 'pegalo:quote:v1';
const event = 'pegalo:quote-changed';

let memory = '[]';
let storageUnavailable = false;
function snapshot() {
  if (storageUnavailable) return memory;
  try {
    return localStorage.getItem(key) ?? memory;
  } catch {
    return memory;
  }
}
function subscribe(notify: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) {
      memory = '[]';
      storageUnavailable = false;
      notify();
    }
  };
  window.addEventListener(event, notify);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(event, notify);
    window.removeEventListener('storage', onStorage);
  };
}
function save(items: QuoteItem[]) {
  memory = JSON.stringify(items);
  try {
    localStorage.setItem(key, memory);
    storageUnavailable = false;
  } catch {
    storageUnavailable = true;
    /* Keep the selection in memory if storage is unavailable. */
  }
  window.dispatchEvent(new Event(event));
}
export function useQuote(products: Product[]) {
  const knownIds = useMemo(
    () => new Set(products.map((p) => p.id)),
    [products],
  );
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const items = useMemo(() => readQuote(raw, knownIds), [raw, knownIds]);
  return {
    ids: items.map((item) => item.id),
    quantities: Object.fromEntries(
      items.map((item) => [item.id, item.quantity]),
    ),
    total: items.reduce((sum, item) => sum + item.quantity, 0),
    setIds: (update: (ids: string[]) => string[]) => {
      const current = readQuote(snapshot(), knownIds);
      const ids = [...new Set(update(current.map((item) => item.id)))].filter(
        (id) => knownIds.has(id),
      );
      save(
        ids.map((id) => ({
          id,
          quantity: current.find((item) => item.id === id)?.quantity ?? 1,
        })),
      );
    },
    setQuantity: (id: string, quantity: number) => {
      save(
        readQuote(snapshot(), knownIds).map((item) =>
          item.id === id
            ? { ...item, quantity: normalizeQuantity(quantity) }
            : item,
        ),
      );
    },
  };
}
