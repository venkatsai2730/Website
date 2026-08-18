import pool from "./db.js";

/**
 * Run all schema migrations.
 * Uses IF NOT EXISTS — safe to call on every startup.
 */
export async function migrate() {
  const client = await pool.connect();
  try {
    console.log("[migrate] running schema migrations...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id         SERIAL PRIMARY KEY,
        email      VARCHAR(255) UNIQUE NOT NULL,
        plan       VARCHAR(50)  NOT NULL DEFAULT 'free',
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id         SERIAL PRIMARY KEY,
        message    TEXT         NOT NULL,
        email      VARCHAR(255),
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    /* Optional: indexes for common queries */
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_suggestions_created ON suggestions (created_at DESC);
    `);

    console.log("[migrate] schema up to date ✓");
  } finally {
    client.release();
  }
}
