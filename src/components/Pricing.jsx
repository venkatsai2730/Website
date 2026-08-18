import React, { useState } from "react";
import { Check } from "lucide-react";
import { TIERS } from "../data/constants";
import useTilt from "../hooks/useTilt";

function PricingCard({ t, annual }) {
  const { ref, handlers } = useTilt({ max: 10, scale: 1.03 });
  const price = annual ? t.annual : t.monthly;

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      className={"tier reveal price-card-3d" + (t.popular ? " pop" : "")}
      {...handlers}
      style={{
        position: "relative",
        overflow: "hidden",
        animationDelay: t.popular ? "0s" : undefined,
      }}
    >
      {/* Glare */}
      <div className="tilt-glare" style={{
        position: "absolute", inset: 0, borderRadius: "18px",
        pointerEvents: "none", opacity: 0, transition: "opacity 0.35s", zIndex: 2,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {t.popular && <span className="badge">Most popular</span>}
        <div className="name">{t.name}</div>
        <div className="desc">{t.desc}</div>
        <div className="price">
          <span className="num">${price}</span>
          <span className="per">{price === 0 ? "forever" : "/month"}</span>
        </div>
        <div className="billed mono">
          {price === 0 ? "" : annual ? "billed yearly" : "billed monthly"}
        </div>
        <ul>
          {t.features.map((f) => (
            <li key={f}><Check /> {f}</li>
          ))}
        </ul>
        <a
          href="#contact"
          className={"btn " + (t.sec ? "sec" : "btn-primary")}
          onClick={scrollToContact}
        >
          {t.cta}
        </a>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="block" id="pricing">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginBottom: "28px" }}>
          <span className="eyebrow">Pricing</span>
          <h2>Subscribe once. Get everything we build.</h2>
          <p>
            Start free. Upgrade when a product earns it. All-Access unlocks every product we ship
            — present and future.
          </p>
        </div>

        <div className="reveal toggle">
          <span className={"tg-label" + (!annual ? " act" : "")}>Monthly</span>
          <div
            className={"switch" + (annual ? " on" : "")}
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual((a) => !a)}
          >
            <span className="knob" />
          </div>
          <span className={"tg-label" + (annual ? " act" : "")}>Yearly</span>
          <span className="save">save ~20%</span>
        </div>

        <div className="price-grid" style={{ perspective: "1400px" }}>
          {TIERS.map((t) => (
            <PricingCard key={t.name} t={t} annual={annual} />
          ))}
        </div>
        <p className="price-note">Prices in USD · cancel anytime · no card required to start free</p>
      </div>
    </section>
  );
}
