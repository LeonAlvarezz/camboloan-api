import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { auths } from './auths.schema';
import { relations } from 'drizzle-orm';

export const sessions = pgTable('sessions', {
  id: varchar({ length: 100 }).unique().primaryKey(),
  two_factor_verified: boolean().default(false),
  expires_at: timestamp().notNull(),
  auth_id: uuid().references(() => auths.id, { onDelete: 'cascade' }),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  auth: one(auths, {
    fields: [sessions.auth_id],
    references: [auths.id],
  }),
}));
