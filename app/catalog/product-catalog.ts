import { cache } from 'react';
import { loadContent } from './content-store';

export const loadActiveProducts = cache(async () => {
  const data = await loadContent();
  return data.content.products.filter((product) => product.active);
});
