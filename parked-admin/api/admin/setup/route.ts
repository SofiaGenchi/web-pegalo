import { setupSecret, rateLimitSource } from '#pegalo-runtime';
import { timingSafeEqual } from 'node:crypto';
import {
  ApiError,
  errorResponse,
  limitAttempts,
  readJson,
  sameOrigin,
} from '@/app/admin-auth';
import { createInitialUser } from '#pegalo-repository';
import { digest, hashPassword } from '@/app/password';
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new ApiError('Origen no permitido.', 403);
    await limitAttempts('setup:' + rateLimitSource(request), 5);
    const { token, username, password } = await readJson(request);
    const expected = setupSecret();
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
    const created = await createInitialUser(
      username.toLowerCase(),
      await hashPassword(password),
    );
    if (!created) throw new ApiError('El panel ya fue activado.', 409);
    return Response.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
