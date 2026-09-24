import bundledDocuments from './bundled-documents.json';
import { bucket } from '#pegalo-runtime';
import {
  documentKinds,
  documentLabels,
  type DocumentKind,
} from './document-policy';
type BundledDocument = {
  url: string;
  updatedAt: string | null;
  size: number | null;
};
const bundledDocumentMap = bundledDocuments as Partial<
  Record<DocumentKind, BundledDocument>
>;
export function storage() {
  const result = bucket();
  if (!result) throw new Error('Almacenamiento de documentos no disponible.');
  return result;
}
export function canUploadDocuments() {
  return !!bucket();
}
export async function listDocuments() {
  if (!canUploadDocuments())
    return documentKinds.map((kind) => {
      const document = bundledDocumentMap[kind];
      return {
        kind,
        title: documentLabels[kind],
        available: !!document,
        updatedAt: document?.updatedAt ?? null,
        size: document?.size ?? null,
      };
    });
  return Promise.all(
    documentKinds.map(async (kind) => {
      const object = await storage().head(`downloads/${kind}.pdf`);
      return {
        kind,
        title: documentLabels[kind],
        available: !!object,
        updatedAt: object?.uploaded.toISOString() ?? null,
        size: object?.size ?? null,
      };
    }),
  );
}
