import {
  ApiError,
  errorResponse,
  readBytes,
  requireAdmin,
} from '@/app/admin-auth';
import { storage } from '@/app/document-store';
import { isPdf, MAX_PDF_BYTES } from '@/app/document-policy';
const types: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
};
function extension(id: string) {
  if (!/^[a-f0-9-]{36}\.(pdf|png|jpg|webp)$/.test(id))
    throw new ApiError('Archivo no encontrado.', 404);
  return id.split('.').pop()!;
}
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const ext = extension(id);
    const object = await storage().get(`media/${id}`);
    if (!object) throw new ApiError('Archivo no encontrado.', 404);
    return new Response(object.body as unknown as ReadableStream, {
      headers: {
        'Content-Type': types[ext],
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "sandbox; default-src 'none'",
        'Content-Disposition': `${ext === 'pdf' ? 'attachment' : 'inline'}; filename="pegalo-${id}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function PUT(request: Request, context: Context) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const ext = extension(id);
    if (request.headers.get('content-type') !== types[ext])
      throw new ApiError('Formato de archivo incorrecto.', 415);
    const b = await readBytes(
      request,
      ext === 'pdf' ? MAX_PDF_BYTES : 5 * 1024 * 1024,
    );
    const valid =
      ext === 'pdf'
        ? isPdf(b)
        : ext === 'png'
          ? [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => b[i] === v)
          : ext === 'jpg'
            ? b[0] === 255 && b[1] === 216 && b[2] === 255
            : new TextDecoder().decode(b.slice(0, 4)) === 'RIFF' &&
              new TextDecoder().decode(b.slice(8, 12)) === 'WEBP';
    if (!valid)
      throw new ApiError(
        'El contenido no coincide con el formato del archivo.',
        415,
      );
    const stored = await storage().put(`media/${id}`, b, {
      onlyIf: { etagDoesNotMatch: '*' },
      httpMetadata: { contentType: types[ext] },
    });
    if (!stored)
      throw new ApiError('El archivo ya existe. Seleccionalo nuevamente.', 409);
    return Response.json(
      { url: `/api/admin/files/${id}` },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
