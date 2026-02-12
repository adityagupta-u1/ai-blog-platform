import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from "../../env.js";
import * as schema from "../../server/db/schema";

const sql = neon(env.DATABASE_URL!);
// Initialize the database connection
export const db = drizzle({client:sql, schema});

// Example usage of 'db' to avoid unused variable error
console.log('Database initialized:', db);
