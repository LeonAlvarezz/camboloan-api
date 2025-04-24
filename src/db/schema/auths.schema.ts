import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { bytea, timestamps } from '../common';
import { relations } from 'drizzle-orm';
import { admins } from './admins.schema';
import { sessions } from './sessions.schema';
export const auths = pgTable('auths', {
  id: uuid().defaultRandom().unique().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  totp_key: bytea(),
  last_login: timestamp(),
  ...timestamps,
});

export const authsRelations = relations(auths, ({ one, many }) => ({
  admin: one(admins, {
    fields: [auths.id], // The field in THIS table (auths)
    references: [admins.auth_id], // The field in the RELATED table (admins)
  }),
  sessions: many(sessions),
}));
