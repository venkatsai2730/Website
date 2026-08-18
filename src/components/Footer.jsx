import React from "react";
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
      <div className="wrap foot">
        <div>
          <Brand />
          <p className="tagline">We build the products. You keep the ones you love. © {year}</p>
        </div>
        <div className="foot-links">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => go(e, n.href)}
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
