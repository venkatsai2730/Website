import { useRef, useCallback } from "react";

/**
 * useTilt — returns event handlers that apply a 3D perspective tilt
 * and a glare position to a card element via inline styles.
 *
 * Usage:
 *   const { ref, style, glareStyle, handlers } = useTilt();
 *   <div ref={ref} style={style} {...handlers}>
 *     <div className="glare" style={glareStyle} />
 *   </div>
 */
export default function useTilt(options = {}) {
  const {
    max = 15,        // max tilt degrees
    glare = true,
    scale = 1.04,
    speed = 400,     // ms transition on enter/leave
  } = options;

  const ref = useRef(null);
  const frameRef = useRef(null);
  const styleRef = useRef({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    transition: `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`,
    willChange: "transform",
  });
  const glareRef = useRef({ opacity: 0, left: "50%", top: "50%" });

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;   // -1 … 1
    const dy = (y - cy) / cy;   // -1 … 1

    const rotY = dx * max;
    const rotX = -dy * max;

    const glareX = ((x / rect.width) * 100).toFixed(1) + "%";
    const glareY = ((y / rect.height) * 100).toFixed(1) + "%";

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},${scale})`;
      ref.current.style.transition = "transform 0.08s linear";

      const glareEl = ref.current.querySelector(".tilt-glare");
      if (glareEl && glare) {
        glareEl.style.opacity = "0.18";
        glareEl.style.background = `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.55) 0%, transparent 65%)`;
      }
    });
  }, [max, scale, glare]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    ref.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    ref.current.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;

    const glareEl = ref.current.querySelector(".tilt-glare");
    if (glareEl) glareEl.style.opacity = "0";
  }, [speed]);

  const onMouseEnter = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = "transform 0.08s linear";
  }, []);

  return {
    ref,
    handlers: { onMouseMove, onMouseLeave, onMouseEnter },
  };
}
