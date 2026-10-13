import React, { useEffect, useRef } from "react";
import useReveal from "./hooks/useReveal";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  useReveal();

  /* ── Scroll parallax for background glow orbs ── */
  const glowV = useRef(null);
  const glowM = useRef(null);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (glowV.current) {
          glowV.current.style.transform = `translateY(${y * 0.18}px) translateZ(0)`;
        }
        if (glowM.current) {
          glowM.current.style.transform = `translateY(${-y * 0.12}px) translateZ(0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="svai">
      {/* Parallax Background Glow Orbs */}
      <div ref={glowV} className="glow v" />
      <div ref={glowM} className="glow m" />
      {/* Extra decorative orb */}
      <div className="glow extra" />

      {/* Navigation Header */}
      <Header />

      {/* Hero Section (includes Three.js particle field) */}
      <Hero />

      {/* Studio Model (How It Works) — sets context before showing products */}
      <HowItWorks />

      {/* Products Shelf — the proof */}
      <Products />

      {/* Technology Stack Strip — credibility after they've seen what you build */}
      <div className="strip">
        <div className="wrap strip-inner">
          <span className="lab">Our stack</span>
          <div className="stack">
            {["Python", "LangGraph", "Claude", "Qdrant", "Supabase", "React", "Node"].map((s) => (
              <span key={s} className="stack-item">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* About the Builder — personal trust, breaks visual rhythm */}
      <About />

      {/* CTA & Roadmap Section — single clear action point */}
      <CTA />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
