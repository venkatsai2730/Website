import React from "react";
import { ArrowUpRight, Check, Smartphone, Sparkles, Cpu, Code2 } from "lucide-react";
import useTilt from "../hooks/useTilt";
import useSound from "../hooks/useSound";

/* Reusable tilt card wrapper */
function TiltCard({ className, children, style }) {
  const { ref, handlers } = useTilt({ max: 12, scale: 1.03 });
  const { playHover } = useSound();

  const handleMouseEnter = (e) => {
    playHover();
    if (handlers.onMouseEnter) handlers.onMouseEnter(e);
  };

  return (
    <div
      ref={ref}
      className={"prod " + className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      {...handlers}
      onMouseEnter={handleMouseEnter}
    >
      <div className="tilt-glare" style={{
        position: "absolute", inset: 0, borderRadius: "18px",
        pointerEvents: "none", opacity: 0, transition: "opacity 0.35s",
        zIndex: 2,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default function Products() {
  const { playClick, playHover } = useSound();
  const scrollToSection = (id) => {
    playClick();
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="block" id="products">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The lineup</span>
          <h2>One studio. A growing shelf of products.</h2>
          <p>
            From a live career platform to a mobile assistant and a small language model we're
            training from scratch — here's the shelf, and it keeps growing. One subscription
            unlocks everything new we ship.
          </p>
        </div>

        <div className="prod-grid">
          {/* Flagship — lead card */}
          <TiltCard className="lead reveal" style={{}}>
            <div className="prod-top">
              <span className="pill live">Live · subscriptions open</span>
              <span className="mono" style={{ fontSize: "12.5px", color: "var(--muted-2)" }}>
                product 01
              </span>
            </div>
            <div className="lead-body">
              <div>
                <a
                  href="https://github.com/venkatsai2730/Job-Skill"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3 className="prod-title-link">Job-Skill AI</h3>
                </a>
                <p className="blurb" style={{ marginBottom: "4px" }}>
                  An end-to-end career platform powered by an eleven-node agent graph. It reads
                  your resume, scores it against real ATS engines, finds matching jobs, writes the
                  cover letter, and preps you for the interview — all in one conversation.
                </p>
                <div className="prod-cta">
                  <a
                    href="https://github.com/venkatsai2730/Job-Skill"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open Job-Skill AI <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
              <ul className="feat-list">
                {[
                  "Three-phase ATS scoring across 5 engines",
                  "Hybrid job ranking from a Qdrant vector index",
                  "Multi-turn chat that routes to the right agent",
                  "Cover letters written for the exact job",
                  "LinkedIn optimizer & interview prep",
                ].map((f) => (
                  <li key={f}><Check /> {f}</li>
                ))}
              </ul>
            </div>
          </TiltCard>

          {/* AI Assistant — mobile */}
          <TiltCard className="reveal" style={{}}>
            <div className="icrow">
              <span><Smartphone /></span>
              <span><Sparkles /></span>
            </div>
            <div className="prod-top">
              <span className="pill build">In development</span>
            </div>
            <h3>Daily AI Assistant</h3>
            <p className="blurb">
              A mobile assistant that takes the friction out of everyday life — plan your day,
              remember what matters, draft the message, get the small stuff done. Built to
              actually do things, not just chat back.
            </p>
            <div className="chips">
              <span className="chip">iOS &amp; Android</span>
              <span className="chip">on-the-go</span>
            </div>
          </TiltCard>

          {/* PythonOS */}
          <TiltCard className="reveal" style={{}}>
            <div className="icrow">
              <span><Cpu /></span>
              <span><Code2 /></span>
            </div>
            <div className="prod-top">
              <span className="pill concept">In research</span>
            </div>
            <h3>PythonOS · 1B</h3>
            <p className="blurb">
              A small language model we're building from scratch — a Python specialist across
              algorithms, ML &amp; GenAI, agentic AI, and CS theory. Frontier-model techniques at
              a footprint that fits one GPU. Architecture locked; training next.
            </p>
            <div className="chips">
              <span className="chip">~2B active params</span>
              <span className="chip">32K context</span>
              <span className="chip">single-GPU</span>
              <span className="chip">Python-native</span>
            </div>
          </TiltCard>

          {/* Open slot */}
          <TiltCard className="span reveal" style={{}}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "26px", flexWrap: "wrap", width: "100%" }}>
              <div>
                <div className="prod-top">
                  <span className="pill concept">Your idea</span>
                </div>
                <h3 style={{ marginBottom: "8px" }}>What should we build next?</h3>
                <p className="blurb">
                  Tell us the problem you'd pay to never deal with again. The most-requested ideas
                  jump the queue.
                </p>
              </div>
              <a
                href="#contact"
                className="btn btn-ghost"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
              >
                Suggest a product
              </a>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
