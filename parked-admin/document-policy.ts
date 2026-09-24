export const documentLabels = {
  precios: 'Lista de precios',
  promociones: 'Promociones',
} as const;
export type DocumentKind = keyof typeof documentLabels;
export type DocumentInfo = {
  kind: DocumentKind;
  available: boolean;
  updatedAt: string | null;
  size: number | null;
};
export const documentKinds: readonly DocumentKind[] = [];
export const MAX_PDF_BYTES = 12 * 1024 * 1024;
export function isDocumentKind(value: string): value is DocumentKind {
  return documentKinds.some((kind) => kind === value);
}
export function canManage(email: string | null, allowlist: string) {
  return (
    !!email &&
    allowlist
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .includes(email.toLowerCase())
  );
}
export function isPdf(bytes: Uint8Array) {
  return (
    bytes.length > 5 && new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-'
  );
}
