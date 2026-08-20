import { neon } from "@neondatabase/serverless";
import { validateWaitlist, validateSuggestion, parsePaging } from "./validate.js";

/**
 * Cloudflare Worker serving the Zorivalls API.
 *
 * Mirrors backend/src/index.js, but on the Workers runtime: no TCP sockets,
 * so Postgres is reached over Neon's HTTP driver instead of `pg`.
 * Static assets are handled by the asset layer (see wrangler.jsonc); this
 * only runs for /api/*.
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const MAX_BODY_BYTES = 10 * 1024; // matches express.json({ limit: "10kb" })

async function readJson(request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return { error: "Payload too large" };
  }
  try {
    return { data: await request.json() };
  } catch {
    return { error: "Invalid JSON body" };
  }
}

/**
 * The admin endpoints return every stored email address, so they stay
 * invisible unless ADMIN_TOKEN is set. Returns null when the caller is
 * allowed through, or a Response to short-circuit with.
 */
function guardAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return json({ error: "Not found" }, 404);

  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== env.ADMIN_TOKEN) return json({ error: "Unauthorized" }, 401);

  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Not an API call — hand back to the static assets.
    if (!pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    if (!env.DATABASE_URL) {
      console.error("[api] DATABASE_URL is not configured");
      return json({ error: "Server is not configured." }, 503);
    }

    const sql = neon(env.DATABASE_URL);
    const method = request.method;

    try {
      /* ── GET /api/health ────────────────────────────────── */
      if (pathname === "/api/health" && method === "GET") {
        try {
          await sql`SELECT 1`;
          return json({ status: "ok", db: "connected", ts: new Date().toISOString() });
        } catch {
          return json({ status: "error", db: "disconnected" }, 503);
        }
      }

      /* ── POST /api/waitlist ─────────────────────────────── */
      if (pathname === "/api/waitlist" && method === "POST") {
        const body = await readJson(request);
        if (body.error) return json({ error: body.error }, 400);

        const { error, value } = validateWaitlist(body.data);
        if (error) return json({ error }, 400);

        try {
          const rows = await sql`
            INSERT INTO waitlist (email, plan)
            VALUES (${value.email}, ${value.plan})
            ON CONFLICT (email) DO UPDATE SET plan = EXCLUDED.plan
            RETURNING id, email, plan, created_at
          `;
          return json({
            success: true,
            message: "You're on the list! We'll reach out soon.",
            data: rows[0],
          }, 201);
        } catch (err) {
          console.error("[waitlist] insert error:", err.message);
          return json({ error: "Something went wrong. Please try again." }, 500);
        }
      }

      /* ── GET /api/waitlist/count ────────────────────────── */
      if (pathname === "/api/waitlist/count" && method === "GET") {
        try {
          const rows = await sql`SELECT COUNT(*)::int AS count FROM waitlist`;
          return json({ count: rows[0].count });
        } catch (err) {
          console.error("[waitlist] count error:", err.message);
          return json({ error: "Could not fetch count." }, 500);
        }
      }

      /* ── GET /api/waitlist (admin) ──────────────────────── */
      if (pathname === "/api/waitlist" && method === "GET") {
        const denied = guardAdmin(request, env);
        if (denied) return denied;

        const { page, limit, offset } = parsePaging(url);
        try {
          const rows = await sql`
            SELECT id, email, plan, created_at FROM waitlist
            ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
          `;
          const total = await sql`SELECT COUNT(*)::int AS count FROM waitlist`;
          return json({ data: rows, total: total[0].count, page });
        } catch (err) {
          console.error("[waitlist] list error:", err.message);
          return json({ error: "Could not fetch waitlist." }, 500);
        }
      }

      /* ── POST /api/suggest ──────────────────────────────── */
      if (pathname === "/api/suggest" && method === "POST") {
        const body = await readJson(request);
        if (body.error) return json({ error: body.error }, 400);

        const { error, value } = validateSuggestion(body.data);
        if (error) return json({ error }, 400);

        try {
          const rows = await sql`
            INSERT INTO suggestions (message, email)
            VALUES (${value.message}, ${value.email})
            RETURNING id, message, email, created_at
          `;
          return json({
            success: true,
            message: "Thanks! Your idea is in the queue.",
            data: rows[0],
          }, 201);
        } catch (err) {
          console.error("[suggest] insert error:", err.message);
          return json({ error: "Something went wrong. Please try again." }, 500);
        }
      }

      /* ── GET /api/suggestions (admin) ───────────────────── */
      if (pathname === "/api/suggestions" && method === "GET") {
        const denied = guardAdmin(request, env);
        if (denied) return denied;

        const { page, limit, offset } = parsePaging(url);
        try {
          const rows = await sql`
            SELECT id, message, email, created_at FROM suggestions
            ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
          `;
          const total = await sql`SELECT COUNT(*)::int AS count FROM suggestions`;
          return json({ data: rows, total: total[0].count, page });
        } catch (err) {
          console.error("[suggest] list error:", err.message);
          return json({ error: "Could not fetch suggestions." }, 500);
        }
      }

      return json({ error: "Not found" }, 404);
    } catch (err) {
      console.error("[error]", err.message);
      return json({ error: "Internal server error" }, 500);
    }
  },
};
