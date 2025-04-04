import { customType, timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export const bytea = customType<{
  data: Uint8Array;
  notNull: false;
  default: false;
}>({
  dataType() {
    return 'bytea';
  },
});
