import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { auths } from './auths.schema';
import { timestamps } from '../common';

export const users = pgTable('users', {
  id: uuid().defaultRandom().unique().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  auth_id: uuid().references(() => auths.id, { onDelete: 'cascade' }),
  ...timestamps,
});
