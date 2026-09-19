import type { Product } from './products';

const slugs: Record<string, string> = {
  contacto: 'adhesivo-de-contacto-pegalo',
  lubricante: 'lubricante-pegalo',
  flexitapa: 'flexitapa-pegalo',
};

export function productSlug(product: Product) {
  if (product.id.startsWith('ciano-')) return 'cianoacrilato-pegalo';
  return product.url || slugs[product.id] || product.id;
}

export function productPath(product: Product) {
  return `/productos/${productSlug(product)}`;
}

export function uniqueProducts<T extends Product>(products: T[]): T[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    const slug = productSlug(product);
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}
