import "dotenv/config";
import express from "express";
import cors from "cors";
import { waitForDB } from "./db.js";
import { migrate } from "./migrate.js";
import waitlistRouter from "./routes/waitlist.js";
import suggestionsRouter from "./routes/suggestions.js";

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ──────────────────────────────────────────── */
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "10kb" }));

/* ── Request logger ─────────────────────────────────────── */
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/* ── Routes ─────────────────────────────────────────────── */
app.get("/api/health", async (_req, res) => {
  try {
    const { default: pool } = await import("./db.js");
    await pool.query("SELECT 1");
    return res.json({ status: "ok", db: "connected", ts: new Date().toISOString() });
  } catch {
    return res.status(503).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/waitlist",   waitlistRouter);
app.use("/api/suggest",    suggestionsRouter);
app.use("/api/suggestions", suggestionsRouter);

/* ── 404 catch-all ──────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* ── Global error handler ───────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

/* ── Boot sequence ──────────────────────────────────────── */
async function boot() {
  try {
    await waitForDB();
    await migrate();
    const server = app.listen(PORT, () => {
      console.log(`[api] svAI backend running on port ${PORT} ✓`);
    });

    /* Graceful shutdown */
    const shutdown = () => {
      console.log("[api] shutting down...");
      server.close(() => process.exit(0));
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT",  shutdown);
  } catch (err) {
    console.error("[boot] fatal:", err.message);
    process.exit(1);
  }
}

boot();
