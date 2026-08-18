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
            We build AI products
            <br />
            <span className="accent">worth subscribing to.</span>
          </h1>
          <p className="lede">
            svAI Solutions turns ideas into AI products, ships them fast, learns from how people
            actually use them, and runs the ones you love as subscriptions. Job-Skill AI is live
            today — and it's only the first.
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
