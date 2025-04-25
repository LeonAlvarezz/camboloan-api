import {
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { banks } from './banks.schema';
export const loanTypeEnum = pgEnum('loan_type', ['car', 'house']);
export const loans = pgTable('loans', {
  id: uuid().defaultRandom().unique().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  type: loanTypeEnum().default('car'),
  sub_type: varchar({ length: 10 }),
  loan_period: numeric({ mode: 'number', precision: 2 }).array(2).notNull(),
  loan_amount: numeric({ mode: 'number' }).array(2).notNull(),
  rate: numeric({ mode: 'number', scale: 2 }).notNull(),
  requirement: text(),
  required_application: text(),
  lvr_ratio: numeric({ mode: 'number', precision: 2 }),
  metadata: jsonb(),
  bank_id: uuid()
    .notNull()
    .references(() => banks.id, { onDelete: 'cascade' }),
});
