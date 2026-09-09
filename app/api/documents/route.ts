import { listDocuments } from '@/app/document-store';
export async function GET() {
  try {
    return Response.json(await listDocuments(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      { error: 'No pudimos consultar los documentos. Intentá nuevamente.' },
      { status: 503 },
    );
  }
}
