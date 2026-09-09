import { database } from './admin-db';
import { defaultContent, type SiteContent } from './content-policy';
export async function loadContent() {
  const row = await database()
    .prepare("SELECT body, revision FROM site_content WHERE id = 'main'")
    .first<{ body: string; revision: number }>();
  return {
    content: row ? (JSON.parse(row.body) as SiteContent) : defaultContent,
    revision: row?.revision || 0,
  };
}
