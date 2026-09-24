import Home from './home';
import { loadContent } from './content-store';
import { absoluteUrl, jsonLd, pageMetadata } from './seo';
import { faqStructuredData } from './faq-data';
import { productPath, uniqueProducts } from './product-links';
import { redirect } from 'next/navigation';
export const metadata = pageMetadata(
  'Adhesivos Pegalo | Venta mayorista de adhesivos y selladores',
  'Somos fabricantes e importadores de una alta gama de productos  orientados a mercados como el  Automotor, Construcción, Hogar,  Artesanía, Zapatero o Carpintería.',
  '/',
);
export const dynamic = 'force-dynamic';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const data = await loadContent().catch((error: unknown) => {
    console.error('No se pudo cargar el catálogo público', error);
    return null;
  });
  if (!data) {
    return <Home products={[]} distributors={[]} catalogUnavailable />;
  }
  const { producto } = await searchParams;
  const linkedProduct = data.content.products.find(
    (product) => product.active && product.id === producto,
  );
  if (linkedProduct) redirect(productPath(linkedProduct));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Pegalo',
            url: absoluteUrl('/'),
            description:
              'Importación y comercialización mayorista de adhesivos y selladores en Argentina.',
            email: 'ventas@pegalo.com.ar',
            telephone: '0800-122-0975',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Asamblea 4355',
              addressLocality: 'Santos Lugares',
              addressRegion: 'Buenos Aires',
              postalCode: '1676',
              addressCountry: 'AR',
            },
            sameAs: [
              'https://www.instagram.com/adhesivospegalo/',
              'https://www.facebook.com/adhesivospegalo/',
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqStructuredData.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Catálogo mayorista de adhesivos y selladores Pegalo',
            itemListElement: uniqueProducts(
              data.content.products.filter((product) => product.active),
            ).map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                url: absoluteUrl(productPath(product)),
                name: product.name,
                brand: {
                  '@type': 'Brand',
                  name: product.line,
                },
                description: product.use,
                category: product.family,
                ...(product.image ? { image: absoluteUrl(product.image) } : {}),
                ...(product.technicalPdf
                  ? { subjectOf: absoluteUrl(product.technicalPdf) }
                  : {}),
              },
            })),
          }),
        }}
      />
      <Home
        products={data.content.products.filter((p) => p.active)}
        distributors={data.content.distributors.filter((d) => d.active)}
      />
    </>
  );
}
