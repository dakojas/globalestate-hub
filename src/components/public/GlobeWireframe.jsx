import { useRef, useState, useEffect, useCallback } from "react";

export default function GlobeWireframe({ className = "" }) {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dragStart = useRef({ x: 0, rotation: 0 });
  const autoRotateRef = useRef(null);
  const rafRef = useRef(null);

  // Auto-rotate when not interacting
  useEffect(() => {
    if (isDragging || isHovered) {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
      return;
    }
    let last = performance.now();
    const tick = (now) => {
      const delta = now - last;
      last = now;
      setRotation((r) => r + delta * 0.015);
      autoRotateRef.current = requestAnimationFrame(tick);
    };
    autoRotateRef.current = requestAnimationFrame(tick);
    return () => { if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current); };
  }, [isDragging, isHovered]);

  // Mouse move → parallax tilt
  const handleMouseMove = useCallback((e) => {
    if (isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 15, y: dx * 15 });
  }, [isDragging]);

  // Reset tilt on mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  // Drag to rotate
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, rotation };
    if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
  }, [rotation]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStart.current.x;
    setRotation(dragStart.current.rotation + delta * 0.5);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
        @keyframes globeGlowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.06); }
        }
        @keyframes bokehDrift1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(15px, -20px); opacity: 0.6; }
        }
        @keyframes bokehDrift2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-20px, 15px); opacity: 0.45; }
        }
        @keyframes bokehDrift3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(10px, 20px); opacity: 0.5; }
        }
        .globe-glow { animation: globeGlowPulse 5s ease-in-out infinite; }
        .bokeh-1 { animation: bokehDrift1 7s ease-in-out infinite; }
        .bokeh-2 { animation: bokehDrift2 9s ease-in-out infinite; }
        .bokeh-3 { animation: bokehDrift3 8s ease-in-out infinite; }
      `}</style>

      {/* Ambient glow behind globe */}
      <div className="absolute inset-0 rounded-full globe-glow"
        style={{ background: "radial-gradient(circle, rgba(197,160,101,0.18) 0%, transparent 65%)" }} />

      {/* Bokeh particles */}
      <div className="absolute bokeh-1 rounded-full" style={{ top: "10%", left: "15%", width: 24, height: 24, background: "rgba(197,160,101,0.4)", filter: "blur(8px)" }} />
      <div className="absolute bokeh-2 rounded-full" style={{ top: "20%", right: "10%", width: 18, height: 18, background: "rgba(197,160,101,0.3)", filter: "blur(6px)" }} />
      <div className="absolute bokeh-3 rounded-full" style={{ bottom: "15%", left: "20%", width: 30, height: 30, background: "rgba(197,160,101,0.25)", filter: "blur(10px)" }} />
      <div className="absolute bokeh-1 rounded-full" style={{ bottom: "25%", right: "15%", width: 16, height: 16, background: "rgba(255,255,255,0.2)", filter: "blur(5px)" }} />
      <div className="absolute bokeh-2 rounded-full" style={{ top: "45%", left: "5%", width: 12, height: 12, background: "rgba(197,160,101,0.35)", filter: "blur(4px)" }} />

      {/* Interactive globe */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{
          perspective: "800px",
          touchAction: "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onPointerDown={handlePointerDown}
      >
        {/* Spinning ring (non-tilted, rotates around Y) */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.1s linear",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: "60%",
              height: "60%",
              border: "1px solid rgba(197,160,101,0.15)",
              borderTopColor: "rgba(197,160,101,0.6)",
              borderRightColor: "rgba(197,160,101,0.35)",
            }}
          />
        </div>

        {/* Globe image with 3D tilt + rotation */}
        <div
          className="relative z-10"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + rotation * 0.3}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <img
            src="https://media.base44.com/images/public/69b801924dae038161790d9a/d495f4361_generated_image.png"
            alt="Interaktívny glóbus"
            draggable={false}
            className="w-full h-auto object-contain"
            style={{
              WebkitMaskImage: "radial-gradient(circle 38% at 50% 48%, #000 55%, #000 68%, transparent 72%)",
              maskImage: "radial-gradient(circle 38% at 50% 48%, #000 55%, #000 68%, transparent 72%)",
            }}
          />
        </div>

        {/* Hint label */}
        {!isHovered && !isDragging && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <span className="text-[10px] text-[#c5a065]/50 tracking-wider uppercase">⟲ Otočte glóbus</span>
          </div>
        )}
      </div>
    </div>
  );
}