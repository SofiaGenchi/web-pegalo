import Link from 'next/link';
import { headers } from 'next/headers';
import { adminUser } from '../admin-auth';
import { loadContent } from '../content-store';
import { listDocuments, canUploadDocuments } from '../document-store';
import LoginForm from './login-form';
import ContentManager from './content-manager';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Administración | Pegalo',
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
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
