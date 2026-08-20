/**
 * One-off schema migration against Neon.
 *
 * The Worker never runs migrations (Express did it on boot; a serverless
 * runtime shouldn't), so this is run by hand from your machine:
 *
 *   DATABASE_URL="postgresql://..." npm run db:migrate
 *
 * Statements use IF NOT EXISTS — safe to re-run.
 */
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("[migrate] DATABASE_URL is not set.");
  console.error('[migrate] usage: DATABASE_URL="postgresql://..." npm run db:migrate');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS waitlist (
     id         SERIAL PRIMARY KEY,
     email      VARCHAR(255) UNIQUE NOT NULL,
     plan       VARCHAR(50)  NOT NULL DEFAULT 'free',
     created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS suggestions (
     id         SERIAL PRIMARY KEY,
     message    TEXT         NOT NULL,
     email      VARCHAR(255),
     created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_suggestions_created ON suggestions (created_at DESC)`,
];

try {
  console.log("[migrate] running schema migrations...");
  for (const statement of statements) {
    await sql.query(statement);
  }
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM waitlist`;
  console.log(`[migrate] schema up to date ✓ (waitlist rows: ${count})`);
} catch (err) {
  console.error("[migrate] failed:", err.message);
  process.exit(1);
}
