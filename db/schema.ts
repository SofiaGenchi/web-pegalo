import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const users = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  active: integer('active').notNull().default(1),
});
export const sessions = sqliteTable('admin_sessions', {
  token: text('token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expires: integer('expires').notNull(),
});
export const attempts = sqliteTable('admin_attempts', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  expires: integer('expires').notNull(),
});
export const content = sqliteTable('site_content', {
  id: text('id').primaryKey(),
  body: text('body').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedBy: text('updated_by').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
