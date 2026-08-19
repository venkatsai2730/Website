import React from "react";
import { GitBranch, Star, GitCommit, Zap, ExternalLink } from "lucide-react";

const CREDENTIALS = [
  "LangGraph",
  "PyTorch",
  "Qdrant",
  "Claude API",
  "React/TypeScript",
  "Postgres",
  "Docker/K8s",
  "FSDP",
  "MCP",
  "AWS",
];


const PROJECTS = [
  {
    name: "Job-Skill AI",
    desc: "11-node LangGraph workflow, sub-200ms latency, 5+ ATS integrations, multi-provider LLM routing",
    status: "live",
    statusLabel: "Live",
  },
  {
    name: "PythonOS-1B",
    desc: "Custom MoE transformer, 2B active params, 32K context, FSDP distributed training, MinHash pipeline",
    status: "research",
    statusLabel: "Training Q3",
  },
];

export default function About() {
  return (
    <section className="block about-section" aria-label="About the builder">
      <div className="wrap">
        <div className="about-grid reveal">
          {/* Left — Builder card (40%) */}
          <div className="about-left">
            <div className="about-builder-card">
              <span className="eyebrow">Built by</span>
              <h3 className="about-name">Venkat Sai</h3>
              <p className="about-tagline">
                Full-stack AI engineer building production systems end-to-end. From transformer
                architecture and multi-GPU distributed training to LangGraph agentic workflows,
                Qdrant RAG pipelines, and containerized deployments with CI/CD. Every product on
                this page: architected, built, deployed, and maintained solo. Shipping fast,
                measuring everything.
              </p>
              <div className="about-links">
                <a
                  href="https://github.com/venkatsai2730"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link"
                  aria-label="GitHub profile"
                >
                  <GitBranch size={16} />
                  <span>github.com/venkatsai2730</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Credential chips */}
              <div className="about-credentials">
                {CREDENTIALS.map((c) => (
                  <span key={c} className="about-credential-chip">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — GitHub stats + Currently Building (60%) */}
          <div className="about-right">
            {/* Open Source stats card */}
            <div className="about-stats-card">
              <div className="about-stats-header">
                <span className="pill concept">Open Source</span>
              </div>
              <div className="about-stats-row">
                <div className="about-stat">
                  <Star size={16} className="about-stat-icon" />
                  <span className="about-stat-value">★</span>
                  <span className="about-stat-label">Stars</span>
                </div>
                <div className="about-stat">
                  <GitCommit size={16} className="about-stat-icon" />
                  <span className="about-stat-value">●●●</span>
                  <span className="about-stat-label">Commits</span>
                </div>
                <div className="about-stat-badge">
                  <Zap size={12} />
                  <span>Active Development</span>
                </div>
              </div>
            </div>

            {/* Currently Building */}
            <div className="about-building">
              <span className="about-building-label mono">Currently Building</span>
              <div className="about-building-cards">
                {PROJECTS.map((p) => (
                  <div key={p.name} className="about-project-card">
                    <div className="about-project-info">
                      <span className="about-project-name">{p.name}</span>
                      <span className="about-project-desc">{p.desc}</span>
                    </div>
                    <span className={`about-project-status ${p.status}`}>
                      {p.status === "live" && <span className="pulse-dot" />}
                      {p.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
