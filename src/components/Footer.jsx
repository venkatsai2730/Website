import React from "react";
import { GitBranch, Mail, ArrowUpRight } from "lucide-react";
import Brand from "./Brand";
import { NAV } from "../data/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  const go = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="wrap">
        {/* Main footer grid */}
        <div className="foot-grid">
          {/* Brand column */}
          <div className="foot-brand-col">
            <Brand />
            <p className="foot-desc">
              Production AI products built end-to-end by a single engineer. Architected,
              deployed, instrumented. Shipped fast. Measured against real metrics.
            </p>
            <div className="foot-social">
              <a
                href="https://github.com/venkatsai2730"
                target="_blank"
                rel="noopener noreferrer"
                className="foot-social-link"
                aria-label="GitHub"
              >
                <GitBranch size={18} />
              </a>
              <a
                href="mailto:hello@svai.dev"
                className="foot-social-link"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div className="foot-nav-col">
            <h4 className="foot-col-title">Navigate</h4>
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="foot-nav-link"
                onClick={(e) => go(e, n.href)}
              >
                {n.label}
              </a>
            ))}
          </div>

          {/* Products column */}
          <div className="foot-nav-col">
            <h4 className="foot-col-title">Products</h4>
            <a
              href="https://github.com/venkatsai2730/Job-Skill"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-nav-link"
            >
              Job-Skill AI <ArrowUpRight size={12} />
            </a>
            <span className="foot-nav-link muted">Daily Assistant <span className="foot-badge">Q3</span></span>
            <a
              href="https://github.com/venkatsai2730/PythonOS-1B"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-nav-link"
            >
              PythonOS-1B <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Status column */}
          <div className="foot-nav-col">
            <h4 className="foot-col-title">Status</h4>
            <div className="foot-status">
              <span className="foot-status-dot live" />
              <span>All systems operational</span>
            </div>
            <a
              href="https://github.com/venkatsai2730"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-nav-link"
            >
              Open Source <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="foot-bottom">
          <span className="foot-copy">© {year} svAI Solutions. Built, deployed, and maintained solo by Venkat Sai.</span>
          <span className="foot-built-with mono">
            LangGraph · Claude API · React/TS · Postgres · Qdrant · Docker · FSDP
          </span>
        </div>
      </div>
    </footer>
  );
}
