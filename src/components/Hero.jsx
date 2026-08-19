import React from "react";
import { ArrowRight } from "lucide-react";
import Graph from "./Graph";
import ParticleField from "./ParticleField";
import useSound from "../hooks/useSound";

export default function Hero() {
  const { playHover, playClick } = useSound();

  const scrollToSection = (id) => {
    playClick();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      {/* Three.js particle background */}
      <div className="hero-canvas-wrap">
        <ParticleField />
      </div>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-copy reveal">
          <span className="eyebrow">AI product studio</span>
          <h1>
            Ship production AI
            <br />
            <span className="accent">faster than you thought possible.</span>
          </h1>
          <p className="lede">
            Building agent-powered products that work in production. Job-Skill AI is live with
            sub-200ms latency across an 11-node LangGraph workflow with multi-provider LLM routing
            and hybrid RAG. PythonOS-1B (custom MoE transformer, 2B params, 32K context) training
            Q3. Measured against real usage, not benchmarks. Deployed solo, scaled with care.
          </p>
          <div className="hero-actions">
            <a
              href="#products"
              className="btn btn-primary"
              onMouseEnter={playHover}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#products");
              }}
            >
              See the products <ArrowRight size={17} />
            </a>
            <a
              href="#model"
              className="btn btn-ghost"
              onMouseEnter={playHover}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#model");
              }}
            >
              How it works
            </a>
          </div>
        </div>
        <Graph />
      </div>
    </section>
  );
}
