import React, { useEffect, useRef } from "react";
import { Lightbulb, Rocket, Activity, Repeat } from "lucide-react";

const steps = [
  {
    ic: <Lightbulb />,
    k: "01",
    h: "Identify high-signal problems",
    p: "Find friction worth automating — validated by real pain, not assumptions. Every product starts from a problem we've hit ourselves.",
  },
  {
    ic: <Rocket />,
    k: "02",
    h: "Ship to real users in weeks",
    p: "Working product, not a prototype. Full lifecycle: auth, data pipeline, CI/CD, containerized deployment — built to go live from day one.",
  },
  {
    ic: <Activity />,
    k: "03",
    h: "Measure, don't guess",
    p: "Regression harnesses gate every deploy. Quality is tracked with evaluation benchmarks — changes ship only when metrics improve.",
  },
  {
    ic: <Repeat />,
    k: "04",
    h: "Scale what earns its place",
    p: "Products that retain users become subscriptions. The rest get cut. No roadmap theater — just compounding iteration.",
  },
];

export default function HowItWorks() {
  const stepRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stepRefs.current.forEach((el) => {
        if (el) el.classList.add("flip-in");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || "0", 10);
            setTimeout(() => el.classList.add("flip-in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    stepRefs.current.forEach((el) => {
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section className="block" id="model">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The model</span>
          <h2>Ship fast. Measure everything. Keep what works.</h2>
          <p>
            No six-month roadmaps. Every product is deployed, instrumented, and evaluated
            against real usage data before it earns a subscription.
          </p>
        </div>
        <div className="loop" style={{ perspective: "1200px" }}>
          {steps.map((s, i) => (
            <div
              key={s.k}
              className="lstep lstep-3d"
              ref={(el) => (stepRefs.current[i] = el)}
              data-delay={i * 140}
            >
              <div className="ic">{s.ic}</div>
              <div className="k mono">{s.k}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
