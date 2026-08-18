import { Router } from "express";
import { body, validationResult } from "express-validator";
import pool from "../db.js";

const router = Router();

/* ── POST /api/suggest ──────────────────────────────────── */
router.post(
  "/",
  [
    body("message")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters"),
    body("email")
      .optional({ checkFalsy: true })
      .isEmail().withMessage("If provided, email must be valid")
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { message, email = null } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO suggestions (message, email)
         VALUES ($1, $2)
         RETURNING id, message, email, created_at`,
        [message, email]
      );
      return res.status(201).json({
        success: true,
        message: "Thanks! Your idea is in the queue.",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("[suggest] insert error:", err.message);
      return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
);

/* ── GET /api/suggestions (admin) ──────────────────────── */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await pool.query(
      `SELECT id, message, email, created_at
       FROM suggestions
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );
    const total = await pool.query("SELECT COUNT(*)::int AS count FROM suggestions");
    return res.json({
      data: result.rows,
      total: total.rows[0].count,
      page: parseInt(page),
    });
  } catch (err) {
    console.error("[suggest] list error:", err.message);
    return res.status(500).json({ error: "Could not fetch suggestions." });
  }
});

export default router;
