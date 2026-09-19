'use client';

import type { ManagedProduct } from './content-policy';
import SiteHeader from './site-header';
import { useQuote } from './use-quote';

export default function ProductPageHeader({
  products,
}: {
  products: ManagedProduct[];
}) {
  const { ids } = useQuote(products);
  return <SiteHeader quoteCount={ids.length} activeSection="catalogo" />;
}
