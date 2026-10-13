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
          <h2>Products shipping soon. More in the pipeline.</h2>
          <p>
            Each product solves a specific problem end-to-end — from data ingestion to
            user-facing output. Built solo, currently in testing ahead of launch.
          </p>
        </div>

        <div className="prod-grid">
          {/* Flagship — lead card */}
          <TiltCard className="lead reveal" style={{}}>
            <div className="prod-top">
              <span className="pill build">
                In testing · launching soon
              </span>
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
                  Job matching engine, now in testing and launching shortly. 11-node LangGraph
                  agentic workflow with intent routing, multi-provider LLM routing
                  (Claude/Gemini/Groq/Mistral) with automatic fallback, and Qdrant-backed hybrid
                  RAG. Built with auth, Postgres, scheduled ingestion, React/TS frontend, Docker,
                  and CI/CD—designed and built solo. We're validating latency and ATS integrations
                  before going live.
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
                  "Targeting sub-200ms matching latency across 11-node agentic workflow",
                  "ATS scoring for Greenhouse, Lever, Ashby, Workday, Naukri (in testing)",
                  "Hybrid dense+sparse Qdrant retrieval with semantic re-ranking",
                  "Multi-provider LLM routing with graceful fallback under degradation",
                  "Regression harness (Claude Code + MCP) gates every deploy on metrics",
                  "Scheduled ingestion from 10+ sources → Postgres + vector index",
                ].map((f) => (
                  <li key={f}><Check /> {f}</li>
                ))}
              </ul>
            </div>
          </TiltCard>

          {/* AI Assistant — mobile */}
          <TiltCard className="upcoming reveal" style={{}}>
            <div className="icrow">
              <span><Smartphone /></span>
              <span><Sparkles /></span>
            </div>
            <div className="prod-top">
              <span className="pill build">In development · core architecture complete</span>
            </div>
            <h3>Daily AI Assistant</h3>
            <p className="blurb">
              Action-first mobile agent — executes tasks (scheduling, drafting, reminders)
              rather than just responding. On-device intent classification routes to
              specialized tool-calling agents. Targeting &lt;300ms time-to-first-action.
            </p>
            <div className="chips">
              <span className="chip">iOS &amp; Android</span>
              <span className="chip">on-device routing</span>
              <span className="chip">tool-calling agents</span>
            </div>
          </TiltCard>

          {/* PythonOS */}
          <TiltCard className="upcoming reveal" style={{}}>
            <div className="icrow">
              <span><Cpu /></span>
              <span><Code2 /></span>
            </div>
            <div className="prod-top">
              <span className="pill concept">Research · training Q3</span>
            </div>
            <a
              href="https://github.com/venkatsai2730/PythonOs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3 className="prod-title-link">PythonOS-1B</h3>
            </a>
            <p className="blurb">
              Custom Mixture-of-Experts transformer built from first principles. Designed for
              efficient Python code understanding with top-2 gating, expert balancing loss, and
              RoPE embeddings for 32K context. Complete pre-training pipeline: MinHash dedup,
              BPE tokenizer training, quality scoring on Python corpora. Targets <strong>single-GPU
              inference</strong> with <strong>multi-GPU distributed training (FSDP)</strong>.
            </p>
            <div className="chips">
              <span className="chip">~2B active params (MoE)</span>
              <span className="chip">32K context window</span>
              <span className="chip">RoPE positional embeddings</span>
              <span className="chip">top-2 gating + expert balancing</span>
              <span className="chip">MinHash + BPE pipeline</span>
              <span className="chip">FSDP distributed training</span>
            </div>
            <div className="prod-cta" style={{ marginTop: "18px" }}>
              <a
                href="https://github.com/venkatsai2730/PythonOs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                View on GitHub <ArrowUpRight size={16} />
              </a>
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
