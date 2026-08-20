/**
 * Hand-rolled equivalents of the express-validator chains used by the
 * Express backend. Error strings are kept identical so the messages the
 * forms already render stay the same.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PLANS = ["free", "pro", "all-access"];

/** Lowercase + trim. Narrower than express-validator's normalizeEmail(). */
export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function validateWaitlist(body) {
  const email = normalizeEmail(body?.email);
  if (!EMAIL_RE.test(email)) {
    return { error: "Valid email is required" };
  }

  const plan = body?.plan ?? "free";
  if (!PLANS.includes(plan)) {
    return { error: "Plan must be free, pro, or all-access" };
  }

  return { value: { email, plan } };
}

export function validateSuggestion(body) {
  const message = String(body?.message ?? "").trim();
  if (message.length < 10 || message.length > 2000) {
    return { error: "Message must be between 10 and 2000 characters" };
  }

  // Email is optional here, but must be valid when it is not blank.
  const raw = body?.email;
  let email = null;
  if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
    email = normalizeEmail(raw);
    if (!EMAIL_RE.test(email)) {
      return { error: "If provided, email must be valid" };
    }
  }

  return { value: { message, email } };
}

/** Clamps ?page / ?limit the way the Express admin routes did. */
export function parsePaging(url) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10) || 50));
  return { page, limit, offset: (page - 1) * limit };
}
