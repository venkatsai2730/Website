import React, { useState, useEffect } from "react";
import { ArrowRight, Check, Loader } from "lucide-react";

const API = "/api";

export default function WaitlistForm() {
  const [email, setEmail]   = useState("");
  const [plan, setPlan]     = useState("free");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg]       = useState("");
  const [count, setCount]   = useState(null);

  /* Fetch live waitlist count on mount */
  useEffect(() => {
    fetch(`${API}/waitlist/count`)
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch(`${API}/waitlist`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("success");
      setMsg(data.message);
      setCount((c) => (c !== null ? c + 1 : null));
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message);
    }
  };

  return (
    <div className="waitlist-wrap reveal">
      {count !== null && (
        <p className="waitlist-count">
          <span className="bdot" style={{ display: "inline-block", marginRight: 8, verticalAlign: "middle" }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "var(--mint)" }}>
            {count.toLocaleString()} {count === 1 ? "person" : "people"} already on the list
          </span>
        </p>
      )}

      {status === "success" ? (
        <div className="waitlist-success">
          <span className="waitlist-check"><Check size={18} /></span>
          <span>{msg}</span>
        </div>
      ) : (
        <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
          {/* Plan selector */}
          <div className="plan-pills">
            {[
              { id: "free",       label: "Free" },
              { id: "pro",        label: "Pro" },
              { id: "all-access", label: "All-Access" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                className={"plan-pill" + (plan === p.id ? " active" : "")}
                onClick={() => setPlan(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Email row */}
          <div className="waitlist-row">
            <input
              id="waitlist-email"
              type="email"
              className="waitlist-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
              aria-label="Email address"
            />
            <button
              type="submit"
              className="btn btn-primary waitlist-btn"
              disabled={status === "loading" || !email}
            >
              {status === "loading" ? (
                <Loader size={16} className="spin" />
              ) : (
                <>Join waitlist <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          {status === "error" && (
            <p className="waitlist-error">{msg}</p>
          )}
        </form>
      )}
    </div>
  );
}
