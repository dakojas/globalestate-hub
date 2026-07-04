export default function GlobeWireframe({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes globeRotate {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pulseRing {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.2); }
        }
        @keyframes glowBreathe {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.2; }
        }
        @keyframes shimmer {
          0% { opacity: 0.15; }
          50% { opacity: 0.4; }
          100% { opacity: 0.15; }
        }
        .globe-wrap { perspective: 1000px; }
        .globe-rotor { transform-style: preserve-3d; animation: globeRotate 40s linear infinite; }
        .pulse-dot { animation: pulseDot 2.5s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .pulse-ring { animation: pulseRing 2.5s ease-out infinite; transform-origin: center; transform-box: fill-box; }
        .glow-breathe { animation: glowBreathe 5s ease-in-out infinite; }
        .meridian-shimmer { animation: shimmer 6s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full globe-wrap">
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c5a065" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#c5a065" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#c5a065" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sphereGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1a2a42" />
            <stop offset="60%" stopColor="#0d1623" />
            <stop offset="100%" stopColor="#070d16" />
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx="250" cy="250" r="240" fill="url(#globeGlow)" className="glow-breathe" />

        {/* Sphere */}
        <circle cx="250" cy="250" r="200" fill="url(#sphereGrad)" />

        {/* Wireframe (rotating group) */}
        <g className="globe-rotor" style={{ transformOrigin: "250px 250px" }}>
          {/* Outer ring */}
          <circle cx="250" cy="250" r="200" stroke="#c5a065" strokeWidth="1" opacity="0.4" />
          {/* Longitudes */}
          <ellipse cx="250" cy="250" rx="60" ry="200" stroke="#c5a065" strokeWidth="0.6" opacity="0.3" className="meridian-shimmer" />
          <ellipse cx="250" cy="250" rx="130" ry="200" stroke="#c5a065" strokeWidth="0.5" opacity="0.2" />
          <ellipse cx="250" cy="250" rx="200" ry="200" stroke="#c5a065" strokeWidth="0.4" opacity="0.12" />
          {/* Latitudes */}
          <ellipse cx="250" cy="250" rx="200" ry="60" stroke="#c5a065" strokeWidth="0.5" opacity="0.22" />
          <ellipse cx="250" cy="250" rx="200" ry="130" stroke="#c5a065" strokeWidth="0.5" opacity="0.17" />
          {/* Equator */}
          <line x1="50" y1="250" x2="450" y2="250" stroke="#c5a065" strokeWidth="0.6" opacity="0.3" />
        </g>

        {/* Location dots (fixed, pulsing) */}
        {/* Egypt */}
        <g>
          <circle cx="180" cy="180" r="4" fill="#c5a065" className="pulse-dot" style={{ animationDelay: "0s" }} />
          <circle cx="180" cy="180" r="4" fill="none" stroke="#c5a065" strokeWidth="1.5" className="pulse-ring" style={{ animationDelay: "0s" }} />
        </g>
        {/* Dubai */}
        <g>
          <circle cx="320" cy="220" r="4" fill="#ffffff" className="pulse-dot" style={{ animationDelay: "0.8s" }} />
          <circle cx="320" cy="220" r="4" fill="none" stroke="#ffffff" strokeWidth="1.5" className="pulse-ring" style={{ animationDelay: "0.8s" }} />
        </g>
        {/* Albania */}
        <g>
          <circle cx="250" cy="330" r="4" fill="#c5a065" className="pulse-dot" style={{ animationDelay: "1.6s" }} />
          <circle cx="250" cy="330" r="4" fill="none" stroke="#c5a065" strokeWidth="1.5" className="pulse-ring" style={{ animationDelay: "1.6s" }} />
        </g>
        {/* Bulgaria */}
        <g>
          <circle cx="340" cy="320" r="3.5" fill="#ffffff" className="pulse-dot" style={{ animationDelay: "1.2s" }} />
          <circle cx="340" cy="320" r="3.5" fill="none" stroke="#ffffff" strokeWidth="1.5" className="pulse-ring" style={{ animationDelay: "1.2s" }} />
        </g>
        {/* Spain */}
        <g>
          <circle cx="150" cy="310" r="3.5" fill="#c5a065" className="pulse-dot" style={{ animationDelay: "2s" }} />
          <circle cx="150" cy="310" r="3.5" fill="none" stroke="#c5a065" strokeWidth="1.5" className="pulse-ring" style={{ animationDelay: "2s" }} />
        </g>

        {/* Connection arcs */}
        <path d="M180 180 Q230 120 320 220" stroke="#c5a065" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="3 4" />
        <path d="M180 180 Q200 260 250 330" stroke="#c5a065" strokeWidth="1" fill="none" opacity="0.15" strokeDasharray="3 4" />
        <path d="M320 220 Q340 270 340 320" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.12" strokeDasharray="3 4" />
      </svg>
    </div>
  );
}