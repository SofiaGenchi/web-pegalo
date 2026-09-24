'use client';

import type { ManagedProduct } from './content-policy';
import SiteHeader from '../ui/site-header';
import { useQuote } from '../quote/use-quote';

export default function ProductPageHeader({
  products,
}: {
  products: ManagedProduct[];
}) {
  const { ids } = useQuote(products);
  return <SiteHeader quoteCount={ids.length} activeSection="catalogo" />;
}
