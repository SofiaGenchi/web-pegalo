'use client';
import { FileText } from 'lucide-react';
import type { DocumentKind } from './document-policy';
export type DocumentInfo = {
  kind: DocumentKind;
  available: boolean;
  updatedAt: string | null;
  size: number | null;
};
export default function Downloads() {
  return (
    <section className="downloads-section" id="descargas">
      <div>
        <p className="eyebrow">          RECURSOS PARA TU NEGOCIO</p>
        <h2>
          Información para tu negocio.
        </h2>
        <p>
          Descargá nuestros catálogos y materiales comerciales.
        </p>
      </div>
      <div className="download-cards">
        <article>
          <FileText size={30} aria-hidden="true" />
          <h3>Catálogo</h3>
          <p>vista de productos disponibles en catálogo</p>
          <span className="download-unavailable">Descargar PDF</span>
        </article>
        <article>
          <FileText size={30} aria-hidden="true" />
          <h3>Folleto</h3>
          <p>Descargá el folleto institucional y comercial de Pegalo.</p>
          <a href="/documentos/folleto-pegalo-comprimido.pdf" download>
            Descargar PDF
          </a>
        </article>
      </div>
    </section>
  );
}
