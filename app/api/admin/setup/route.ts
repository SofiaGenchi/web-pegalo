import { env } from 'cloudflare:workers';
import { timingSafeEqual } from 'node:crypto';
import {
  ApiError,
  errorResponse,
  limitAttempts,
  readJson,
  sameOrigin,
} from '@/app/admin-auth';
import { database } from '@/app/admin-db';
import { digest, hashPassword } from '@/app/password';
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new ApiError('Origen no permitido.', 403);
    await limitAttempts(
      'setup:' + (request.headers.get('cf-connecting-ip') || 'unknown'),
      5,
    );
    const { token, username, password } = await readJson(request);
    const expected = (env as unknown as { ADMIN_SETUP_TOKEN?: string })
      .ADMIN_SETUP_TOKEN;
    if (
      !expected ||
      expected.length < 32 ||
      typeof token !== 'string' ||
      !timingSafeEqual(
        Buffer.from(digest(token)),
        Buffer.from(digest(expected)),
      )
    )
      throw new ApiError('Activación no autorizada.', 403);
    if (
      typeof username !== 'string' ||
      !/^[a-zA-Z0-9@._-]{3,120}$/.test(username) ||
      typeof password !== 'string' ||
      password.length < 15 ||
      password.length > 256
    )
      throw new ApiError(
        'Usá un usuario válido y una contraseña de entre 15 y 256 caracteres.',
      );
    const result = await database()
      .prepare(
        "INSERT INTO admin_users (id, username, password, active) SELECT 'initial-admin', ?, ?, 1 WHERE NOT EXISTS (SELECT 1 FROM admin_users)",
      )
      .bind(username.toLowerCase(), await hashPassword(password))
      .run();
    if (!result.meta.changes)
      throw new ApiError('El panel ya fue activado.', 409);
    return Response.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
