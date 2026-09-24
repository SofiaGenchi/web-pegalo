export function setupSecret() {
  return process.env.ADMIN_SETUP_TOKEN;
}
export const adminEnabled = false;
// Independent remote file storage will be configured next. Never use local disk as a fallback.
export function bucket(): R2Bucket | undefined {
  return undefined;
}
// Do not trust user-supplied proxy headers on an unknown hosting environment.
// A global limit complements per-user limits until the hosting's trusted proxy is configured.
export function rateLimitSource(_request: Request) {
  return 'node-global';
}
