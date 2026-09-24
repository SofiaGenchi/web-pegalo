/* oxlint-disable next/no-html-link-for-pages -- SIWC requires top-level, non-prefetched navigation. */
'use client';
import PegaloName from '../pegalo-name';
import { useState } from 'react';
import {
  documentKinds,
  documentLabels,
  MAX_PDF_BYTES,
  type DocumentKind,
} from '../document-policy';
import type { DocumentInfo } from '../downloads';
export default function DocumentManager({
  initial,
  onChange,
  uploadsEnabled = true,
}: {
  initial: DocumentInfo[];
  uploadsEnabled?: boolean;
  onChange?: (documents: DocumentInfo[]) => void;
}) {
  const [documents, setDocuments] = useState(initial);
  const [files, setFiles] = useState<Partial<Record<DocumentKind, File>>>({});
  const [busy, setBusy] = useState<DocumentKind | null>(null);
  const [message, setMessage] = useState('');
  async function upload(kind: DocumentKind) {
    const file = files[kind];
    if (!file || busy) return;
    if (file.size > MAX_PDF_BYTES) {
      setMessage('El PDF debe pesar menos de 12 MB.');
      return;
    }
    setBusy(kind);
    setMessage('');
    try {
      const response = await fetch(`/api/documents/${kind}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      const updated = documents.map((doc) =>
        doc.kind === kind
          ? {
              ...doc,
              available: true,
              updatedAt: new Date().toISOString(),
              size: file.size,
            }
          : doc,
      );
      setDocuments(updated);
      onChange?.(updated);
      setFiles((previous) => ({ ...previous, [kind]: undefined }));
      setMessage(
        `${documentLabels[kind]} publicada. Los visitantes ya pueden descargar la nueva versión.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo publicar el archivo.',
      );
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="admin-page">
      <p>
        <PegaloName /> / ADMINISTRACIÓN
      </p>
      <h1>Listas y promociones</h1>
      <p>
        {uploadsEnabled
          ? 'Subí el PDF actualizado. Máximo 12 MB por archivo.'
          : 'Los PDF están incluidos en el proyecto. Para reemplazarlos, solicitá la actualización a quien mantiene la web.'}
      </p>
      <div className="admin-documents">
        {documentKinds.map((kind) => {
          const doc = documents.find((item) => item.kind === kind);
          return (
            <section key={kind}>
              <h2>{documentLabels[kind]}</h2>
              <p>
                {doc?.available
                  ? `Última publicación: ${new Date(doc.updatedAt!).toLocaleDateString('es-AR')}`
                  : 'Todavía no hay un PDF publicado.'}
              </p>
              {doc?.available && (
                <a href={`/api/documents/${kind}`}>Descargar versión actual</a>
              )}
              <label htmlFor={kind}>Seleccionar nuevo PDF</label>
              <input
                id={kind}
                type="file"
                accept="application/pdf,.pdf"
                disabled={!uploadsEnabled || !!busy}
                onChange={(event) =>
                  setFiles((previous) => ({
                    ...previous,
                    [kind]: event.target.files?.[0],
                  }))
                }
              />
              <button
                className="admin-button"
                disabled={!uploadsEnabled || !files[kind] || !!busy}
                onClick={() => upload(kind)}
              >
                {busy === kind ? 'Publicando…' : 'Publicar PDF'}
              </button>
            </section>
          );
        })}
      </div>
      <output aria-live="polite">{message}</output>
    </section>
  );
}
