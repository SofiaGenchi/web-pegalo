import { mongoDatabase } from './mongodb-client.mjs';
import { MongoServerError } from 'mongodb';
import type { SiteContent } from '../app/catalog/content-policy';
type User = { _id: string; username: string; password: string; active: number };
type Session = { _id: string; userId: string; expiresAt: Date };
type Attempt = { _id: string; count: number; expiresAt: Date };
type Content = {
  _id: string;
  content: SiteContent;
  revision: number;
  updatedBy: string;
  updatedAt: Date;
  history?: {
    content: SiteContent;
    revision: number;
    updatedBy: string;
    updatedAt: Date;
  }[];
};
export async function findSession(token: string) {
  const db = await mongoDatabase();
  const session = await db
    .collection<Session>('admin_sessions')
    .findOne({ _id: token, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await db
    .collection<User>('admin_users')
    .findOne({ _id: session.userId, active: 1 });
  return user ? { id: user._id, username: user.username } : null;
}
export async function findUser(username: string) {
  const user = await (
    await mongoDatabase()
  )
    .collection<User>('admin_users')
    .findOne({ username });
  return user
    ? {
        id: user._id,
        username: user.username,
        password: user.password,
        active: user.active,
      }
    : null;
}
export async function createInitialUser(username: string, password: string) {
  try {
    await (
      await mongoDatabase()
    )
      .collection<User>('admin_users')
      .insertOne({ _id: 'initial-admin', username, password, active: 1 });
    return true;
  } catch (e) {
    if (e instanceof MongoServerError && e.code === 11000) return false;
    throw e;
  }
}
export async function createSession(
  token: string,
  userId: string,
  expires: number,
) {
  await (
    await mongoDatabase()
  )
    .collection<Session>('admin_sessions')
    .insertOne({ _id: token, userId, expiresAt: new Date(expires) });
}
export async function deleteSession(token: string) {
  await (
    await mongoDatabase()
  )
    .collection<Session>('admin_sessions')
    .deleteOne({ _id: token });
}
export async function countAttempt(key: string) {
  const collection = (await mongoDatabase()).collection<Attempt>(
    'admin_attempts',
  );
  const now = new Date();
  const expired = { $lte: [{ $ifNull: ['$expiresAt', new Date(0)] }, now] };
  const update = [
    {
      $set: {
        count: { $cond: [expired, 1, { $add: ['$count', 1] }] },
        expiresAt: {
          $cond: [expired, new Date(now.getTime() + 15 * 60000), '$expiresAt'],
        },
      },
    },
  ];
  // Concurrent first upserts may collide on _id. The loser retries against the existing row.
  let row;
  try {
    row = await collection.findOneAndUpdate({ _id: key }, update, {
      upsert: true,
      returnDocument: 'after',
    });
  } catch (e) {
    if (!(e instanceof MongoServerError && e.code === 11000)) throw e;
    row = await collection.findOneAndUpdate({ _id: key }, update, {
      returnDocument: 'after',
    });
  }
  return row?.count ?? Infinity;
}
export async function readContent() {
  const row = await (
    await mongoDatabase()
  )
    .collection<Content>('site_content')
    .findOne({ _id: 'main' }, { projection: { content: 1, revision: 1 } });
  if (!row) throw new Error('Inicialización de MongoDB pendiente.');
  return { content: row.content, revision: row.revision };
}
export async function writeContent(
  content: SiteContent,
  revision: number,
  userId: string,
) {
  const c = (await mongoDatabase()).collection<Content>('site_content');
  const previous = await c.findOne(
    { _id: 'main', revision },
    { projection: { content: 1, revision: 1, updatedBy: 1, updatedAt: 1 } },
  );
  if (!previous) return false;
  const r = await c.updateOne(
    { _id: 'main', revision },
    {
      $set: { content, updatedBy: userId, updatedAt: new Date() },
      $inc: { revision: 1 },
      $push: {
        history: {
          $each: [
            {
              content: previous.content,
              revision: previous.revision,
              updatedBy: previous.updatedBy,
              updatedAt: previous.updatedAt,
            },
          ],
          $slice: -10,
        },
      },
    },
  );
  return r.modifiedCount === 1;
}
