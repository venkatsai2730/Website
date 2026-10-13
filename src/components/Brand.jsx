import React from "react";

export default function Brand() {
  return (
    <div className="brand">
      {/* alt is empty on purpose — the wordmark beside it already names the
          brand, so a description here would be announced twice. */}
      <img
        className="brand-mark"
        src="/logo-mark-512.png"
        alt=""
        width="128"
        height="128"
        decoding="async"
      />
      <div className="brand-text-group">
        <span className="brand-word">Velalyn</span>
        <span className="brand-tag">AI STUDIO</span>
      </div>
    </div>
  );
}
