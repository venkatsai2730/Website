import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer, scene, camera, points, geo, mat, raf;
    let isDisposed = false;

    /* Helper to reliably get non-zero dimensions */
    const getDimensions = () => {
      const parent = canvas.parentElement;
      const w = canvas.offsetWidth || parent?.offsetWidth || window.innerWidth || 1200;
      const h = canvas.offsetHeight || parent?.offsetHeight || window.innerHeight || 800;
      return { width: Math.max(w, 320), height: Math.max(h, 320) };
    };

    const { width, height } = getDimensions();

    try {
      /* ── Renderer ── */
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);

      /* ── Scene / Camera ── */
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
      camera.position.z = 500;

      /* ── Particles ── */
      const COUNT = 2800;
      const positions = new Float32Array(COUNT * 3);
      const colors    = new Float32Array(COUNT * 3);

      const colorA = new THREE.Color("#8B7BFF"); // violet
      const colorB = new THREE.Color("#5FE6C6"); // mint
      const colorC = new THREE.Color("#3a2f8f"); // deep violet

      for (let i = 0; i < COUNT; i++) {
        // sphere distribution
        const r     = 280 + Math.random() * 280;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi) * 0.45; // flatten Z

        const t = Math.random();
        const c = t < 0.5 ? colorA.clone().lerp(colorB, t * 2)
                           : colorB.clone().lerp(colorC, (t - 0.5) * 2);
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

      mat = new THREE.PointsMaterial({
        size: 2.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });

      points = new THREE.Points(geo, mat);
      scene.add(points);

      /* ── Mouse parallax ── */
      let mx = 0, my = 0;
      const onMouseMove = (e) => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      /* ── Resize handler with observer fallback ── */
      const onResize = () => {
        if (!canvas || isDisposed) return;
        const { width: nw, height: nh } = getDimensions();
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      let resizeObserver = null;
      if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
        resizeObserver = new ResizeObserver(() => onResize());
        resizeObserver.observe(canvas.parentElement);
      }

      /* ── Animation loop ── */
      const clock = new THREE.Clock();
      const animate = () => {
        if (isDisposed) return;
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        points.rotation.y = t * 0.028;
        points.rotation.x = t * 0.012;

        // smooth mouse parallax
        camera.position.x += (mx * 40 - camera.position.x) * 0.04;
        camera.position.y += (-my * 30 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        if (resizeObserver) resizeObserver.disconnect();
        try {
          renderer.dispose();
          geo.dispose();
          mat.dispose();
        } catch (_) {}
      };
    } catch (err) {
      console.warn("ParticleField WebGL initialization:", err);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}
