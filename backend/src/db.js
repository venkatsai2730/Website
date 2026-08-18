import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.DB_HOST     || "postgres",
  port:     parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME     || "svai",
  user:     process.env.DB_USER     || "svai",
  password: process.env.DB_PASSWORD || "svai_secret",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("[db] unexpected pool error:", err.message);
});

/**
 * Wait for DB to be ready (retries on startup).
 */
export async function waitForDB(retries = 10, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log("[db] connected ✓");
      return;
    } catch (err) {
      console.warn(`[db] not ready (attempt ${i}/${retries}): ${err.message}`);
      if (i === retries) throw new Error("Could not connect to PostgreSQL after retries");
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export default pool;
