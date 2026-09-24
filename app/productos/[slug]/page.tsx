import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { loadActiveProducts } from '../../product-catalog';
import { productPath, productSlug, uniqueProducts } from '../../product-links';
import { absoluteUrl, jsonLd, pageMetadata } from '../../seo';
import ProductDetail from '../../product-detail';
import ProductPageHeader from '../../product-page-header';
import SiteFooter from '../../site-footer';
import '../../refinements.css';
import '../../story.css';
import '../../documents.css';
import './product-page.css';

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await loadActiveProducts();
  return uniqueProducts(products).map((product) => ({ slug: productSlug(product) }));
}

async function productData(params: Props['params']) {
  const { slug } = await params;
  const products = await loadActiveProducts();
  const variants = products.filter((product) => productSlug(product) === slug);
  if (!variants.length) notFound();
  return { products, variants, product: variants[0] };
}

export async function generateMetadata({ params }: Props) {
  const { product, variants } = await productData(params);
  const name = variants.length > 1 ? 'Cianoacrilato Pegalo' : product.name;
  const description = `${name}: venta mayorista para ferreterías y distribuidores. Consultá aplicaciones, presentaciones y ficha técnica.`;
  const metadata = pageMetadata(
    `${name} | Venta mayorista`,
    description,
    productPath(product),
  );
  const image = product.image && absoluteUrl(product.image);
  return {
    ...metadata,
    title: `${name} | Venta mayorista`,
    openGraph: {
      ...metadata.openGraph,
      ...(image ? { images: [{ url: image, alt: name }] } : {}),
    },
    twitter: {
      ...metadata.twitter,
      ...(image
        ? { card: 'summary_large_image' as const, images: [image] }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { products, variants, product } = await productData(params);
  const name = variants.length > 1 ? 'Cianoacrilato Pegalo' : product.name;
  const related = uniqueProducts(products)
    .filter(
      (item) =>
        productSlug(item) !== productSlug(product) &&
        item.family &&
        item.family === product.family,
    )
    .slice(0, 4);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name,
        description: product.use,
        url: absoluteUrl(productPath(product)),
        brand: { '@type': 'Brand', name: product.line },
        category: product.family,
        ...(variants.length === 1 ? { sku: product.id } : {}),
        image: variants
          .filter((item) => item.image)
          .map((item) => absoluteUrl(item.image!)),
        ...(product.technicalPdf
          ? {
              subjectOf: {
                '@type': 'DigitalDocument',
                name: 'Ficha técnica',
                url: absoluteUrl(product.technicalPdf),
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name,
            item: absoluteUrl(productPath(product)),
          },
        ],
      },
    ],
  };
  return (
    <div className="site product-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <a href="#ficha" className="skip-link">
        Saltar al producto
      </a>
      <ProductPageHeader products={products} />
      <main id="ficha" className="product-page-main">
        <nav className="product-breadcrumb" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/#catalogo">Productos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>
        <ProductDetail products={products} variants={variants} />
        {related.length > 0 && (
          <section className="product-related" aria-labelledby="related-title">
            <div className="section-heading">
              <h2 id="related-title">Productos relacionados</h2>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <article className="product-card" key={item.id}>
                  <Link className="product-open" href={productPath(item)}>
                    <div className="product-image">
                      <span className="product-line">{item.line}</span>
                      <Image
                        unoptimized
                        width={500}
                        height={500}
                        src={item.image || '/product-placeholder.svg'}
                        alt={item.name}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <span className="product-application">{item.use}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter home={false} />
    </div>
  );
}
