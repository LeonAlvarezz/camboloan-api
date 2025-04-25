import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const banks = pgTable('banks', {
  id: uuid().defaultRandom().unique().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  url: varchar({ length: 255 }),
  home_loan_url: varchar({ length: 255 }),
  car_loan_url: varchar({ length: 255 }),
});
