/* oxlint-disable next/no-html-link-for-pages -- SIWC requires top-level, non-prefetched navigation. */
import PegaloName from '../pegalo-name';
import { headers } from 'next/headers';
import { isAdmin, listDocuments } from '../document-store';
import DocumentManager from './document-manager';
import '../documents.css';
export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  const email = (await headers()).get('oai-authenticated-user-email');
  if (!email)
    return (
      <main className="admin-page">
        <a href="/">
          ← Volver a <PegaloName />
        </a>
        <h1>Administrar documentos</h1>
        <p>Ingresá con la cuenta autorizada de la empresa.</p>
        <a
          className="admin-button"
          href="/signin-with-chatgpt?return_to=%2Fadmin"
          target="_top"
        >
          Ingresar con ChatGPT
        </a>
      </main>
    );
  if (!isAdmin(email))
    return (
      <main className="admin-page">
        <h1>Acceso restringido</h1>
        <p>Esta cuenta no tiene permiso para actualizar documentos.</p>
        <a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">
          Ingresar con otra cuenta
        </a>
        <a href="/">
          Volver a <PegaloName />
        </a>
      </main>
    );
  let documents;
  try {
    documents = await listDocuments();
  } catch {
    return (
      <main className="admin-page">
        <h1>Documentos</h1>
        <p>
          El almacenamiento aún no está disponible. Intentá nuevamente más
          tarde.
        </p>
        <a href="/">
          Volver a <PegaloName />
        </a>
      </main>
    );
  }
  return <DocumentManager initial={documents} />;
}
