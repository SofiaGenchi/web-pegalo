import { requireAdmin, errorResponse } from '@/app/admin-auth';
import bundledDocuments from '@/app/bundled-documents.json';
import { storage, canUploadDocuments } from '@/app/document-store';
import {
  isDocumentKind,
  isPdf,
  MAX_PDF_BYTES,
  type DocumentKind,
} from '@/app/document-policy';
type BundledDocument = { url: string };
const bundledDocumentMap = bundledDocuments as Partial<
  Record<DocumentKind, BundledDocument>
>;
type Context = { params: Promise<{ kind: string }> };
export async function GET(_request: Request, context: Context) {
  const { kind } = await context.params;
  if (!isDocumentKind(kind))
    return new Response('Documento no encontrado', { status: 404 });
  if (!canUploadDocuments()) {
    const document = bundledDocumentMap[kind];
    if (!document)
      return new Response('Documento no encontrado', { status: 404 });
    return new Response(null, {
      status: 307,
      headers: {
        Location: document.url,
        'Cache-Control': 'no-store',
      },
    });
  }
  try {
    const object = await storage().get(`downloads/${kind}.pdf`);
    if (!object)
      return new Response('Documento aún no publicado', { status: 404 });
    return new Response(object.body as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pegalo-${kind}.pdf"`,
        'Content-Length': String(object.size),
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Descarga no disponible temporalmente', {
      status: 503,
    });
  }
}
export async function PUT(request: Request, context: Context) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return errorResponse(error);
  }
  if (!canUploadDocuments())
    return Response.json(
      { error: 'Los PDF se actualizan desde el proyecto en esta etapa.' },
      { status: 409 },
    );
  const { kind } = await context.params;
  if (!isDocumentKind(kind))
    return Response.json({ error: 'Documento inválido.' }, { status: 400 });
  if (request.headers.get('content-type') !== 'application/pdf')
    return Response.json(
      { error: 'Seleccioná un archivo PDF.' },
      { status: 415 },
    );
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: 'Falta el archivo.' }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > MAX_PDF_BYTES) {
      await reader.cancel();
      return Response.json(
        { error: 'El PDF debe pesar menos de 12 MB.' },
        { status: 413 },
      );
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  if (!isPdf(bytes))
    return Response.json(
      { error: 'El archivo no contiene un PDF válido.' },
      { status: 415 },
    );
  try {
    await storage().put(`downloads/${kind}.pdf`, bytes, {
      httpMetadata: { contentType: 'application/pdf' },
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: 'No se pudo guardar. La versión anterior sigue disponible.' },
      { status: 503 },
    );
  }
}
