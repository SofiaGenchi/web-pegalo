import { env } from 'cloudflare:workers';
export function database() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error('Administración no disponible temporalmente.');
  return db;
}
