import bundledDocuments from './bundled-documents.json';
import { bucket } from '#pegalo-runtime';
import { documentKinds, documentLabels } from './document-policy';
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
    return documentKinds.map((kind) => ({
      kind,
      title: documentLabels[kind],
      available: true,
      updatedAt: bundledDocuments[kind].updatedAt,
      size: bundledDocuments[kind].size,
    }));
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
