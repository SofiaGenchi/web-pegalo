import {
  adminUser,
  ApiError,
  errorResponse,
  readJson,
  requireAdmin,
} from '@/app/admin-auth';
import { writeContent } from '#pegalo-repository';
import { loadContent } from '@/app/content-store';
import { validateContent } from '@/app/content-policy';
export async function GET(request: Request) {
  try {
    if (!(await adminUser(request.headers)))
      throw new ApiError('Ingresá para continuar.', 401);
    return Response.json(await loadContent(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function PUT(request: Request) {
  try {
    const user = await requireAdmin(request);
    const { content, revision } = await readJson(request);
    if (
      !validateContent(content) ||
      !Number.isInteger(revision) ||
      revision < 0
    )
      throw new ApiError(
        'Revisá los campos obligatorios, archivos y coordenadas.',
      );
    const saved = await writeContent(content, revision, user.id);
    if (!saved)
      throw new ApiError(
        'Otra persona publicó cambios. Copiá tus cambios y recargá antes de volver a guardar.',
        409,
      );
    return Response.json(
      { ok: true, revision: revision + 1 },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
