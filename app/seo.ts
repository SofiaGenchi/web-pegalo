import type { Metadata } from 'next';

// Main domain confirmed by the company. The alias pegalo.com.ar must redirect
// at the final host, preserving paths. Never derive canonicals from Host input.
const configuredOrigin =
  process.env.PEGALO_SITE_URL?.trim() || 'https://adhesivospegalo.com.ar';
export const siteOrigin = (() => {
  if (!configuredOrigin) return null;
  const url = new URL(configuredOrigin);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'PEGALO_SITE_URL debe ser un origen HTTPS, sin ruta ni credenciales.',
    );
  }
  return url.origin;
})();

export function absoluteUrl(path: string) {
  return siteOrigin ? new URL(path, siteOrigin).href : undefined;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = absoluteUrl(path);
  return {
    title: `${title} | Pegalo`,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_AR',
      siteName: 'Pegalo',
      ...(url ? { url } : {}),
    },
    twitter: { card: 'summary', title, description },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
