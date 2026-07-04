import { useRef, useState, useEffect, useCallback } from "react";

/**
 * Modern interactive dot-matrix globe rendered on Canvas.
 * - Fibonacci-distributed dots on a sphere surface
 * - Auto-rotation + drag-to-rotate + mouse-tilt parallax
 * - Transparent background (no image box artifacts)
 * - Gold dots on navy, fading at sphere edges
 */
export default function GlobeWireframe({ className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const stateRef = useRef({
    rotY: 0,
    rotX: 0.3,
    targetTiltX: 0,
    targetTiltY: 0,
    dragStart: { x: 0, y: 0, rotX: 0, rotY: 0 },
  });

  // Generate fibonacci sphere points
  const pointsRef = useRef([]);
  useEffect(() => {
    const N = 600;
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // y from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({
        x: Math.cos(theta) * radius,
        y: y,
        z: Math.sin(theta) * radius,
      });
    }
    pointsRef.current = pts;
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf;
    let last = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (now) => {
      const delta = now - last;
      last = now;
      const s = stateRef.current;

      // Auto-rotate when not dragging
      if (!isDragging) {
        s.rotY += delta * 0.012;
      }

      // Smooth tilt toward target (base 0.3 + mouse offset)
      const desiredX = 0.3 + s.targetTiltX;
      s.rotX += (desiredX - s.rotX) * 0.08;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      // Background glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
      glowGrad.addColorStop(0, "rgba(197,160,101,0.08)");
      glowGrad.addColorStop(0.5, "rgba(197,160,101,0.03)");
      glowGrad.addColorStop(1, "rgba(197,160,101,0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      const cosX = Math.cos(s.rotX);
      const sinX = Math.sin(s.rotX);
      const cosY = Math.cos(s.rotY);
      const sinY = Math.sin(s.rotY);

      // Draw meridian/parallel arcs (faint)
      ctx.strokeStyle = "rgba(197,160,101,0.06)";
      ctx.lineWidth = 1;

      // Parallels (latitude rings)
      for (let lat = -60; lat <= 60; lat += 30) {
        const latRad = (lat * Math.PI) / 180;
        const r = Math.cos(latRad) * radius;
        const yPos = Math.sin(latRad) * radius;
        ctx.beginPath();
        for (let a = 0; a <= 360; a += 4) {
          const aRad = (a * Math.PI) / 180;
          // Point on ring
          let px = Math.cos(aRad) * r / radius;
          let py = yPos / radius;
          let pz = Math.sin(aRad) * r / radius;
          // Rotate around Y
          let nx = px * cosY + pz * sinY;
          let nz = -px * sinY + pz * cosY;
          // Rotate around X
          let ny = py * cosX - nz * sinX;
          nz = py * sinX + nz * cosX;
          if (nz > 0) {
            const sx = cx + nx * radius;
            const sy = cy + ny * radius;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
        }
        ctx.stroke();
      }

      // Draw dots
      const dots = pointsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        // Rotate around Y
        let nx = p.x * cosY + p.z * sinY;
        let nz = -p.x * sinY + p.z * cosY;
        // Rotate around X
        let ny = p.y * cosX - nz * sinX;
        nz = p.y * sinX + nz * cosX;

        if (nz < -0.1) continue; // back hemisphere

        const sx = cx + nx * radius;
        const sy = cy + ny * radius;

        // Depth-based opacity & size
        const depth = (nz + 1) / 2; // 0 (back) to 1 (front)
        const opacity = Math.max(0.05, depth * 0.9);
        const size = 0.8 + depth * 1.8;

        // Gold color with slight variation
        const isHighlight = (i % 7 === 0);
        if (isHighlight && nz > 0.3) {
          ctx.fillStyle = `rgba(232, 213, 160, ${opacity})`;
          ctx.shadowColor = "rgba(197,160,101,0.5)";
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(197, 160, 101, ${opacity})`;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Outer ring
      ctx.strokeStyle = "rgba(197,160,101,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
      ctx.stroke();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isDragging]);

  // Mouse interactions
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    const s = stateRef.current;
    s.dragStart = { x: e.clientX, y: e.clientY, rotX: s.rotY, rotY: s.rotX };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const s = stateRef.current;
    const dx = e.clientX - s.dragStart.x;
    const dy = e.clientY - s.dragStart.y;
    s.rotY = s.dragStart.rotX + dx * 0.008;
    s.targetTiltX = dy * 0.003;
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    stateRef.current.targetTiltX = 0;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    stateRef.current.targetTiltX = dy * 0.3;
    stateRef.current.rotY += dx * 0.001;
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes bokehDrift1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(15px, -20px); opacity: 0.6; }
        }
        @keyframes bokehDrift2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-20px, 15px); opacity: 0.45; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .bokeh-1 { animation: bokehDrift1 7s ease-in-out infinite; }
        .bokeh-2 { animation: bokehDrift2 9s ease-in-out infinite; }
        .globe-aura { animation: glowPulse 5s ease-in-out infinite; }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full globe-aura"
        style={{ background: "radial-gradient(circle, rgba(197,160,101,0.12) 0%, transparent 60%)" }} />

      {/* Bokeh particles */}
      <div className="absolute bokeh-1 rounded-full" style={{ top: "8%", left: "12%", width: 22, height: 22, background: "rgba(197,160,101,0.35)", filter: "blur(8px)" }} />
      <div className="absolute bokeh-2 rounded-full" style={{ top: "15%", right: "8%", width: 16, height: 16, background: "rgba(197,160,101,0.3)", filter: "blur(6px)" }} />
      <div className="absolute bokeh-1 rounded-full" style={{ bottom: "12%", left: "18%", width: 28, height: 28, background: "rgba(197,160,101,0.2)", filter: "blur(10px)" }} />
      <div className="absolute bokeh-2 rounded-full" style={{ bottom: "20%", right: "12%", width: 14, height: 14, background: "rgba(255,255,255,0.15)", filter: "blur(5px)" }} />

      {/* Interactive canvas globe */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); stateRef.current.targetTiltX = 0; }}
        onMouseMove={handleMouseMove}
        onPointerDown={handlePointerDown}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ aspectRatio: "1 / 1", touchAction: "none" }}
        />

        {/* Hint */}
        {!isHovered && !isDragging && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="text-[10px] text-[#c5a065]/40 tracking-wider uppercase">⟲ Otočte glóbus</span>
          </div>
        )}
      </div>
    </div>
  );
}