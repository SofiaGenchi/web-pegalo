import {
  ApiError,
  errorResponse,
  sameOrigin,
  sessionCookie,
  sessionToken,
} from '@/app/admin-auth';
import { deleteSession } from '#pegalo-repository';
import { digest } from '@/app/password';
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new ApiError('Origen no permitido.', 403);
    await deleteSession(digest(sessionToken(request.headers)));
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
