import type { MetadataRoute } from 'next';
import { absoluteUrl } from './seo';

// Only the existing public page: sections and product dialogs are not routes.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = absoluteUrl('/');
  return url ? [{ url }] : [];
}
