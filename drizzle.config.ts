import type { Config } from 'drizzle-kit';
import { env } from './src/env.js';

export default {
  out: './drizzle',
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
} satisfies Config;
