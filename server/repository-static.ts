import { defaultContent } from '../app/content-policy';
import type { SiteContent } from '../app/content-policy';

// Node hosting serves the catalog from the project files while the admin panel
// is not in use. This repository deliberately has no database connection.
export async function findSession(_token: string) {
  return null;
}

export async function findUser(_username: string) {
  return null;
}

export async function createInitialUser(_username: string, _password: string) {
  return false;
}

export async function createSession(
  _token: string,
  _userId: string,
  _expires: number,
) {
  throw new Error('El panel de administración está desactivado.');
}

export async function deleteSession(_token: string) {}

export async function countAttempt(_key: string) {
  return Number.POSITIVE_INFINITY;
}

export async function readContent() {
  return { content: defaultContent, revision: 0 };
}

export async function writeContent(
  _content: SiteContent,
  _revision: number,
  _userId: string,
) {
  return false;
}
