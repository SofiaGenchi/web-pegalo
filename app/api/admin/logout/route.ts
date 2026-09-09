import {
  ApiError,
  errorResponse,
  sameOrigin,
  sessionCookie,
  sessionToken,
} from '@/app/admin-auth';
import { database } from '@/app/admin-db';
import { digest } from '@/app/password';
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new ApiError('Origen no permitido.', 403);
    await database()
      .prepare('DELETE FROM admin_sessions WHERE token = ?')
      .bind(digest(sessionToken(request.headers)))
      .run();
    return Response.json(
      { ok: true },
      {
        headers: {
          'Set-Cookie': sessionCookie('', request.url, 0),
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
