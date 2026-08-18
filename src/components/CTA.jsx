import React, { useState } from "react";
import { ArrowRight, Send, Check, Loader } from "lucide-react";
import useSound from "../hooks/useSound";

const API = "/api";

export default function CTA() {
  const [form, setForm]     = useState({ message: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg]       = useState("");
  const { playHover, playClick, playSuccess } = useSound();

  const scrollToProducts = (e) => {
    e.preventDefault();
    playClick();
    const el = document.querySelector("#products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    if (form.message.trim().length < 10) {
      setStatus("error");
      setMsg("Please write at least 10 characters.");
      return;
    }
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch(`${API}/suggest`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("success");
      setMsg(data.message);
      setForm({ message: "", email: "" });
      playSuccess();
    } catch (err) {
      setStatus("error");
      setMsg(err.message);
    }
  };

  return (
    <section className="block" id="roadmap">
      <div className="wrap">
        <div className="cta reveal" id="contact">
          <span className="eyebrow">Get started</span>
          <h2 style={{ marginTop: "14px" }}>Start exploring our AI product studio.</h2>
          <p>
            Explore Job-Skill AI today, or tell us what you'd build next — the products on this page
            started exactly that way.
          </p>
          <div className="cta-actions">
            <a
              href="#products"
              className="btn btn-primary"
              onMouseEnter={playHover}
              onClick={scrollToProducts}
            >
              See the products <ArrowRight size={17} />
            </a>
          </div>

          {/* ── Product Suggestion Form ── */}
          <div className="suggest-card reveal">
            <div className="suggest-header">
              <span className="eyebrow" style={{ fontSize: "11px" }}>Product Suggestion</span>
              <h3 style={{ marginTop: 10, marginBottom: 6 }}>What should we build next?</h3>
              <p style={{ color: "var(--muted)", fontSize: 14.5 }}>
                Tell us the problem you'd pay to never deal with again.
                The most-requested ideas jump the queue.
              </p>
            </div>

            {status === "success" ? (
              <div className="suggest-success">
                <span className="suggest-check"><Check size={20} /></span>
                <div>
                  <strong>Idea submitted!</strong>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{msg}</p>
                </div>
              </div>
            ) : (
              <form className="suggest-form" onSubmit={handleSubmit} noValidate>
                <textarea
                  name="message"
                  id="suggest-message"
                  className="suggest-textarea"
                  placeholder="I wish there was a tool that could automatically..."
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  maxLength={2000}
                  disabled={status === "loading"}
                  required
                />
                <div className="suggest-row">
                  <input
                    name="email"
                    id="suggest-email"
                    type="email"
                    className="suggest-email-input"
                    placeholder="your@email.com (optional — we'll notify you)"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === "loading"}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === "loading" || form.message.trim().length < 10}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {status === "loading" ? (
                      <Loader size={16} className="spin" />
                    ) : (
                      <><Send size={15} /> Submit idea</>
                    )}
                  </button>
                </div>
                {status === "error" && (
                  <p className="suggest-error">{msg}</p>
                )}
                <p style={{ color: "var(--muted-2)", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", marginTop: 8 }}>
                  {form.message.length}/2000 characters
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
