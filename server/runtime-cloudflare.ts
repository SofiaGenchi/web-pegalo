import { env } from 'cloudflare:workers';
export const adminEnabled = true;
export function setupSecret() {
  return (env as unknown as { ADMIN_SETUP_TOKEN?: string }).ADMIN_SETUP_TOKEN;
}
export function bucket(): R2Bucket | undefined {
  return (env as unknown as { DOCUMENTS?: R2Bucket }).DOCUMENTS;
}
export function rateLimitSource(request: Request) {
  return request.headers.get('cf-connecting-ip') || 'unknown';
}
