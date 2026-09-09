import { storage, isAdmin } from '@/app/document-store';
import { isDocumentKind, isPdf, MAX_PDF_BYTES } from '@/app/document-policy';
type Context = { params: Promise<{ kind: string }> };
export async function GET(_request: Request, context: Context) {
  const { kind } = await context.params;
  if (!isDocumentKind(kind))
    return new Response('Documento no encontrado', { status: 404 });
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
  if (!isAdmin(request.headers.get('oai-authenticated-user-email')))
    return Response.json(
      { error: 'No tenés permiso para publicar documentos.' },
      { status: 403 },
    );
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return Response.json({ error: 'Origen no permitido.' }, { status: 403 });
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
