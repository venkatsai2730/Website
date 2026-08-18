import { Router } from "express";
import { body, validationResult } from "express-validator";
import pool from "../db.js";

const router = Router();

/* ── POST /api/waitlist ─────────────────────────────────── */
router.post(
  "/",
  [
    body("email")
      .isEmail().withMessage("Valid email is required")
      .normalizeEmail(),
    body("plan")
      .optional()
      .isIn(["free", "pro", "all-access"])
      .withMessage("Plan must be free, pro, or all-access"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, plan = "free" } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO waitlist (email, plan)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET plan = EXCLUDED.plan
         RETURNING id, email, plan, created_at`,
        [email, plan]
      );
      return res.status(201).json({
        success: true,
        message: "You're on the list! We'll reach out soon.",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("[waitlist] insert error:", err.message);
      return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
);

/* ── GET /api/waitlist/count ────────────────────────────── */
router.get("/count", async (_req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*)::int AS count FROM waitlist");
    return res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error("[waitlist] count error:", err.message);
    return res.status(500).json({ error: "Could not fetch count." });
  }
});

/* ── GET /api/waitlist (admin) ──────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await pool.query(
      "SELECT id, email, plan, created_at FROM waitlist ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [parseInt(limit), offset]
    );
    const total = await pool.query("SELECT COUNT(*)::int AS count FROM waitlist");
    return res.json({
      data: result.rows,
      total: total.rows[0].count,
      page: parseInt(page),
    });
  } catch (err) {
    console.error("[waitlist] list error:", err.message);
    return res.status(500).json({ error: "Could not fetch waitlist." });
  }
});

export default router;
