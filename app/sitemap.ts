import type { MetadataRoute } from 'next';
import { absoluteUrl } from './seo';
import { loadActiveProducts } from './catalog/product-catalog';
import { productPath, uniqueProducts } from './catalog/product-links';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await loadActiveProducts();
  return ['/', ...uniqueProducts(products).map(productPath)].flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
