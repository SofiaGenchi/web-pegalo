import Link from 'next/link';
import Home from './home';
import { loadContent } from './content-store';
export const dynamic = 'force-dynamic';
export default async function Page() {
  let data;
  try {
    data = await loadContent();
  } catch {
    return (
      <main style={{ padding: '10vh 8vw' }}>
        <h1>Pegalo</h1>
        <p>
          No pudimos cargar el catálogo. Intentá nuevamente en unos minutos.
        </p>
        <Link href="/">Reintentar</Link>
        <p>
          <a href="https://wa.me/541164174036">Contactar a ventas</a>
        </p>
      </main>
    );
  }
  return (
    <Home
      products={data.content.products.filter((p) => p.active)}
      distributors={data.content.distributors.filter((d) => d.active)}
    />
  );
}
