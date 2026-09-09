import { database } from './admin-db';
import { digest } from './password';
export const cookieName = 'pegalo_admin';
export const sessionSeconds = 8 * 60 * 60;
export function sessionCookie(
  token: string,
  url: string,
  seconds = sessionSeconds,
) {
  return `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${seconds}${new URL(url).protocol === 'https:' ? '; Secure' : ''}`;
}
export function sessionToken(headers: Headers) {
  return (
    headers
      .get('cookie')
      ?.split(';')
      .map((p) => p.trim())
      .find((p) => p.startsWith(cookieName + '='))
      ?.slice(cookieName.length + 1) || ''
  );
}
export async function adminUser(headers: Headers) {
  const token = sessionToken(headers);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return database()
    .prepare(
      'SELECT u.id, u.username FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id WHERE s.token = ? AND s.expires > ? AND u.active = 1',
    )
    .bind(digest(token), Date.now())
    .first<{ id: string; username: string }>();
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
export async function requireAdmin(request: Request) {
  if (!sameOrigin(request)) throw new ApiError('Origen no permitido.', 403);
  const user = await adminUser(request.headers);
  if (!user) throw new ApiError('Tu sesión venció. Volvé a ingresar.', 401);
  return user;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function errorResponse(error: unknown) {
  if (!(error instanceof ApiError))
    console.error(
      'Admin operation failed',
      error instanceof Error ? error.message : 'unknown',
    );
  return Response.json(
    {
      error:
        error instanceof ApiError
          ? error.message
          : 'Servicio no disponible. Conservá tus cambios e intentá nuevamente.',
    },
    {
      status: error instanceof ApiError ? error.status : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
export async function readBytes(request: Request, max: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError('Falta el contenido.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new ApiError('El archivo supera el tamaño permitido.', 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}
export async function readJson(request: Request) {
  try {
    const value = JSON.parse(
      new TextDecoder().decode(await readBytes(request, 512000)),
    );
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new ApiError('Contenido inválido.');
    return value;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError('Contenido inválido.');
  }
}
export async function limitAttempts(key: string, max: number) {
  const now = Date.now();
  const result = await database()
    .prepare(
      'INSERT INTO admin_attempts (key, count, expires) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = CASE WHEN expires <= ? THEN 1 ELSE count + 1 END, expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END RETURNING count',
    )
    .bind(digest(key), now + 15 * 60000, now, now)
    .first<{ count: number }>();
  if (!result || result.count > max)
    throw new ApiError(
      'Demasiados intentos. Esperá 15 minutos antes de volver a ingresar.',
      429,
    );
}
