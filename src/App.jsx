import React, { useEffect, useRef } from "react";
import useReveal from "./hooks/useReveal";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  useReveal();

  /* ── Scroll parallax for background glow orbs ── */
  const glowV = useRef(null);
  const glowM = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

      {/* Technology Stack Strip */}
      <div className="strip">
        <div className="wrap strip-inner">
          <span className="lab">Our stack</span>
          <div className="stack">
            {["LangGraph", "Claude", "Qdrant", "Supabase", "React", "Node"].map((s) => (
              <span key={s} className="stack-item">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Products Shelf */}
      <Products />

      {/* Studio Model (How It Works) */}
      <HowItWorks />


      {/* CTA & Roadmap Section */}
      <CTA />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
