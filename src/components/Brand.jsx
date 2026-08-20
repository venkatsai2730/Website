import React, { useId } from "react";

export default function Brand() {
  // Header and footer both render Brand — scope gradient ids so they don't collide.
  const uid = useId().replace(/:/g, "");
  const ring = `zvRing-${uid}`;
  const z = `zvZ-${uid}`;
  const v = `zvV-${uid}`;

  return (
    <div className="brand">
      <svg className="brand-mark" viewBox="0 0 128 128" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={ring} x1="8" y1="70" x2="114" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2F6BFF" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id={z} x1="22" y1="20" x2="88" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A9C6FF" />
            <stop offset=".5" stopColor="#4C7CFF" />
            <stop offset="1" stopColor="#2445B8" />
          </linearGradient>
          <linearGradient id={v} x1="54" y1="42" x2="108" y2="106" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#D0A6FF" />
            <stop offset=".5" stopColor="#9B4DFF" />
            <stop offset="1" stopColor="#6D28D9" />
          </linearGradient>
        </defs>

        <g className="brand-orbit">
          <path
            d="M14.5 76.6A52 52 0 0 1 108 39.2"
            stroke={`url(#${ring})`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="108" cy="39.2" r="6" fill="#A855F7" />
        </g>

        <path d="M26 26H84v13L48 79h36v13H24V79l36-40H26z" fill={`url(#${z})`} />
        <path d="M55 45h16l9 33 9-33h16l-17 57H72z" fill={`url(#${v})`} />
      </svg>

      <span className="brand-word">Zorivalls</span>
    </div>
  );
}
