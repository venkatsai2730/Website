import React, { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Volume2, VolumeX } from "lucide-react";
import Brand from "./Brand";
import { NAV } from "../data/constants";
import useSound from "../hooks/useSound";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { enabled: soundOn, toggle: toggleSound, playHover, playClick } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    playClick();
    setMenu(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={"hdr" + (scrolled ? " scrolled" : "")}>
      <div className="wrap">
        <nav className="nav">
          <Brand />
          <div className="nav-links">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onMouseEnter={playHover}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.href);
                }}
              >
                {n.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Sound Toggle Button */}
            <button
              className={"sound-btn" + (soundOn ? " on" : " off")}
              onClick={() => {
                toggleSound();
              }}
              onMouseEnter={playHover}
              aria-label={soundOn ? "Mute audio effects" : "Unmute audio effects"}
              title={soundOn ? "Sound Effects: ON (Click to mute)" : "Sound Effects: MUTED (Click to unmute)"}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="sound-label mono">{soundOn ? "FX ON" : "MUTED"}</span>
            </button>

            <a
              href="#products"
              className="btn btn-primary"
              onMouseEnter={playHover}
              onClick={(e) => {
                e.preventDefault();
                go("#products");
              }}
            >
              See products <ArrowRight size={16} />
            </a>

            <button
              className="menu-btn"
              aria-label="Menu"
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setMenu((m) => !m);
              }}
            >
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      <div className={"mobile-menu" + (menu ? " open" : "")}>
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            onClick={(e) => {
              e.preventDefault();
              go(n.href);
            }}
          >
            {n.label}
          </a>
        ))}
      </div>
    </header>
  );
}
