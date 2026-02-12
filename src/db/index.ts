import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "@/db/schema";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL. Add it to .env.local (Supabase Postgres connection string)."
    );
  }
  return url;
}

declare global {
  // eslint-disable-next-line no-var
  var __ezfin_sql: ReturnType<typeof postgres> | undefined;
}

const sql = globalThis.__ezfin_sql ??
  postgres(getDatabaseUrl(), {
    // Recommended for serverless.
    max: 1,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") globalThis.__ezfin_sql = sql;

export const db = drizzle(sql, { schema });
