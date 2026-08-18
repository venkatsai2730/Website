import React, { useEffect, useRef } from "react";
import { Lightbulb, Rocket, Activity, Repeat } from "lucide-react";

const steps = [
  {
    ic: <Lightbulb />,
    k: "01",
    h: "Spot the idea",
    p: "A real problem we can point agents at — usually one we've felt ourselves.",
  },
  {
    ic: <Rocket />,
    k: "02",
    h: "Ship a slice",
    p: "A working product in weeks, in front of real users — not a mockup.",
  },
  {
    ic: <Activity />,
    k: "03",
    h: "Listen & sharpen",
    p: "We keep what gets used and cut what doesn't. The product earns its place.",
  },
  {
    ic: <Repeat />,
    k: "04",
    h: "Run it as a subscription",
    p: "Winners become products you subscribe to — and they keep getting better.",
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
          <h2>Idea to subscription, on repeat.</h2>
          <p>
            We don't sell slideware or six-month roadmaps. We build, ship, and let real usage
            decide what's worth keeping.
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
