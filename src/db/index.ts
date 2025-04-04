import { config } from '@/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';
export type DrizzleTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

const url = config.databaseUrl;
export const db = drizzle(url, {
  schema,
});
