import Link from 'next/link';
import { headers } from 'next/headers';
import { adminUser } from '../admin-auth';
import { loadContent } from '../content-store';
import { listDocuments, canUploadDocuments } from '../document-store';
import LoginForm from './login-form';
import ContentManager from './content-manager';
import { adminEnabled } from '#pegalo-runtime';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Administración | Pegalo',
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  if (!adminEnabled)
    return (
      <main className="admin-unavailable">
        <h1>Panel de administración desactivado</h1>
        <p>El catálogo se gestiona desde los archivos del proyecto.</p>
        <Link href="/">Volver a la web</Link>
      </main>
    );
  let user, data, documents;
  let storageAvailable = canUploadDocuments();
  try {
    user = await adminUser(await headers());
    if (user)
      [data, documents] = await Promise.all([
        loadContent(),
        listDocuments().catch(() => {
          storageAvailable = false;
          return [];
        }),
      ]);
  } catch {
    return (
      <main className="admin-unavailable">
        <h1>Administración no disponible</h1>
        <p>No pudimos cargar el panel. Intentá nuevamente en unos minutos.</p>
        <Link href="/admin">Reintentar</Link>
      </main>
    );
  }
  if (!user || !data || !documents) return <LoginForm />;
  return (
    <ContentManager
      initial={data.content}
      initialRevision={data.revision}
      documents={documents}
      username={user.username}
      storageAvailable={storageAvailable}
    />
  );
}
