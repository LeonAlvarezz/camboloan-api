import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '@/db/common';
import { InferSelectModel, relations } from 'drizzle-orm';
import { auths } from './auths.schema';

export const admins = pgTable('admins', {
  id: uuid().defaultRandom().unique().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  auth_id: uuid().references(() => auths.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const adminsRelations = relations(admins, ({ one }) => ({
  auth: one(auths, {
    fields: [admins.auth_id],
    references: [auths.id],
  }),
}));

// Infer the type for the `admins` table
export type Admin = InferSelectModel<typeof admins>;
