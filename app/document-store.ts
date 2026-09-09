import { env } from 'cloudflare:workers';
import { documentKinds, documentLabels } from './document-policy';
export function storage() {
  const bucket = (env as unknown as { DOCUMENTS?: R2Bucket }).DOCUMENTS;
  if (!bucket) throw new Error('Almacenamiento de documentos no disponible.');
  return bucket;
}
export async function listDocuments() {
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
