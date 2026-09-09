'use client';
import PegaloName from './pegalo-name';
import { useEffect, useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import {
  documentKinds,
  documentLabels,
  type DocumentKind,
} from './document-policy';
export type DocumentInfo = {
  kind: DocumentKind;
  available: boolean;
  updatedAt: string | null;
  size: number | null;
};
export default function Downloads() {
  const [documents, setDocuments] = useState<DocumentInfo[] | null>(null);
  const [error, setError] = useState(false);
  async function refresh() {
    try {
      const response = await fetch('/api/documents', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      setDocuments(await response.json());
      setError(false);
    } catch {
      setError(true);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/documents', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        setDocuments(data as DocumentInfo[]);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, []);
  return (
    <section className="downloads-section" id="descargas">
      <div>
        <p className="eyebrow">INFORMACIÓN PARA TU COMERCIO</p>
        <h2>
          Todo listo.
          <br />
          <span>Para descargar.</span>
        </h2>
        <p>
          Consultá las últimas listas de precios y promociones publicadas por{' '}
          <PegaloName />.
        </p>
      </div>
      <div className="download-cards">
        {documentKinds.map((kind) => {
          const document = documents?.find((item) => item.kind === kind);
          return (
            <article key={kind}>
              <FileText size={30} />
              <h3>{documentLabels[kind]}</h3>
              <p>
                {document?.available
                  ? `Actualizada el ${new Date(document.updatedAt!).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} · PDF`
                  : error
                    ? 'No pudimos consultar la disponibilidad.'
                    : documents
                      ? 'Próximamente disponible.'
                      : 'Consultando disponibilidad…'}
              </p>
              {document?.available ? (
                <a href={`/api/documents/${kind}`} download>
                  Descargar PDF <Download size={18} />
                </a>
              ) : (
                <span className="download-unavailable">
                  {documents ? 'Pendiente de publicación' : 'PDF'}
                </span>
              )}
            </article>
          );
        })}
        {error && (
          <button onClick={refresh} className="download-retry">
            <RefreshCw size={16} /> Volver a intentar
          </button>
        )}
      </div>
    </section>
  );
}
