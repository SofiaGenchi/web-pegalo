import {
  ApiError,
  errorResponse,
  limitAttempts,
  readJson,
  sameOrigin,
  sessionCookie,
  sessionSeconds,
} from '@/app/admin-auth';
import { database } from '@/app/admin-db';
import { digest, randomToken, verifyPassword } from '@/app/password';
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new ApiError('Origen no permitido.', 403);
    await limitAttempts(
      'login-ip:' + (request.headers.get('cf-connecting-ip') || 'unknown'),
      30,
    );
    const { username, password } = await readJson(request);
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      username.length > 120 ||
      password.length > 256
    )
      throw new ApiError('Usuario o contraseña incorrectos.', 401);
    const normalized = username.trim().toLowerCase();
    await limitAttempts('login-user:' + normalized, 8);
    const user = await database()
      .prepare(
        'SELECT id, password, active FROM admin_users WHERE username = ?',
      )
      .bind(normalized)
      .first<{ id: string; password: string; active: number }>();
    const dummy =
      'pbkdf2-sha256$600000$00000000000000000000000000000000$' + '0'.repeat(64);
    const valid = await verifyPassword(password, user?.password || dummy);
    if (!user || !valid || !user.active)
      throw new ApiError('Usuario o contraseña incorrectos.', 401);
    const token = randomToken();
    await database().batch([
      database()
        .prepare('DELETE FROM admin_sessions WHERE expires <= ?')
        .bind(Date.now()),
      database()
        .prepare(
          'INSERT INTO admin_sessions (token, user_id, expires) VALUES (?, ?, ?)',
        )
        .bind(digest(token), user.id, Date.now() + sessionSeconds * 1000),
    ]);
    return Response.json(
      { ok: true },
      {
        headers: {
          'Set-Cookie': sessionCookie(token, request.url),
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
