import { database } from './database-cloudflare';
import type { SiteContent } from '../app/catalog/content-policy';
export async function findSession(token: string) {
  return database()
    .prepare(
      'SELECT u.id, u.username FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id WHERE s.token = ? AND s.expires > ? AND u.active = 1',
    )
    .bind(token, Date.now())
    .first<{ id: string; username: string }>();
}
export async function findUser(username: string) {
  return database()
    .prepare(
      'SELECT id, username, password, active FROM admin_users WHERE username = ?',
    )
    .bind(username)
    .first<{
      id: string;
      username: string;
      password: string;
      active: number;
    }>();
}
export async function createInitialUser(username: string, password: string) {
  const r = await database()
    .prepare(
      "INSERT INTO admin_users (id, username, password, active) SELECT 'initial-admin', ?, ?, 1 WHERE NOT EXISTS (SELECT 1 FROM admin_users)",
    )
    .bind(username, password)
    .run();
  return !!r.meta.changes;
}
export async function createSession(
  token: string,
  userId: string,
  expires: number,
) {
  await database().batch([
    database()
      .prepare('DELETE FROM admin_sessions WHERE expires <= ?')
      .bind(Date.now()),
    database()
      .prepare(
        'INSERT INTO admin_sessions (token,user_id,expires) VALUES (?,?,?)',
      )
      .bind(token, userId, expires),
  ]);
}
export async function deleteSession(token: string) {
  await database()
    .prepare('DELETE FROM admin_sessions WHERE token = ?')
    .bind(token)
    .run();
}
export async function countAttempt(key: string) {
  const now = Date.now();
  const r = await database()
    .prepare(
      'INSERT INTO admin_attempts (key, count, expires) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = CASE WHEN expires <= ? THEN 1 ELSE count + 1 END, expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END RETURNING count',
    )
    .bind(key, now + 15 * 60000, now, now)
    .first<{ count: number }>();
  return r?.count ?? Infinity;
}
export async function readContent() {
  const r = await database()
    .prepare("SELECT body, revision FROM site_content WHERE id = 'main'")
    .first<{ body: string; revision: number }>();
  return r
    ? { content: JSON.parse(r.body) as SiteContent, revision: r.revision }
    : null;
}
export async function writeContent(
  content: SiteContent,
  revision: number,
  userId: string,
) {
  const r =
    revision === 0
      ? await database()
          .prepare(
            "INSERT INTO site_content (id, body, revision, updated_by, updated_at) VALUES ('main', ?, 1, ?, ?) ON CONFLICT(id) DO NOTHING",
          )
          .bind(JSON.stringify(content), userId, Date.now())
          .run()
      : await database()
          .prepare(
            "UPDATE site_content SET body = ?, revision = revision + 1, updated_by = ?, updated_at = ? WHERE id = 'main' AND revision = ?",
          )
          .bind(JSON.stringify(content), userId, Date.now(), revision)
          .run();
  return !!r.meta.changes;
}
