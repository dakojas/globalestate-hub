export default function GlobeWireframe({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes globeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
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
        @keyframes spin3d {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .globe-float { animation: globeFloat 6s ease-in-out infinite; }
        .globe-glow { animation: globeGlowPulse 5s ease-in-out infinite; }
        .bokeh-1 { animation: bokehDrift1 7s ease-in-out infinite; }
        .bokeh-2 { animation: bokehDrift2 9s ease-in-out infinite; }
        .bokeh-3 { animation: bokehDrift3 8s ease-in-out infinite; }
        .globe-spin-rim { animation: spin3d 30s linear infinite; }
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

      {/* Globe image — heavy radial mask so edges fully dissolve into page background */}
      <div className="relative globe-float">
        <img
          src="https://media.base44.com/images/public/69b801924dae038161790d9a/d495f4361_generated_image.png"
          alt="Globe"
          className="w-full h-auto object-contain relative z-10"
          style={{
            WebkitMaskImage: "radial-gradient(circle 42% at 50% 50%, #000 30%, #000 45%, transparent 72%)",
            maskImage: "radial-gradient(circle 42% at 50% 50%, #000 30%, #000 45%, transparent 72%)",
          }}
        />
        {/* Rotating gold ring overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="globe-spin-rim rounded-full"
            style={{
              width: "62%",
              height: "62%",
              border: "1px solid rgba(197,160,101,0.15)",
              borderTopColor: "rgba(197,160,101,0.5)",
              borderRightColor: "rgba(197,160,101,0.3)",
            }} />
        </div>
      </div>
    </div>
  );
}