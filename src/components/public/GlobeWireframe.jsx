export default function GlobeWireframe({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c5a065" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#c5a065" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="250" r="240" fill="url(#globeGlow)" />
        <circle cx="250" cy="250" r="200" stroke="#c5a065" strokeWidth="1" opacity="0.5" />
        <ellipse cx="250" cy="250" rx="60" ry="200" stroke="#c5a065" strokeWidth="0.5" opacity="0.35" />
        <ellipse cx="250" cy="250" rx="130" ry="200" stroke="#c5a065" strokeWidth="0.5" opacity="0.25" />
        <ellipse cx="250" cy="250" rx="200" ry="200" stroke="#c5a065" strokeWidth="0.5" opacity="0.15" />
        <line x1="50" y1="250" x2="450" y2="250" stroke="#c5a065" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="250" cy="250" rx="200" ry="60" stroke="#c5a065" strokeWidth="0.5" opacity="0.25" />
        <ellipse cx="250" cy="250" rx="200" ry="130" stroke="#c5a065" strokeWidth="0.5" opacity="0.2" />
        <circle cx="180" cy="180" r="5" fill="#c5a065" />
        <circle cx="320" cy="220" r="5" fill="#ffffff" />
        <circle cx="250" cy="330" r="5" fill="#c5a065" />
        <circle cx="180" cy="180" r="12" stroke="#c5a065" strokeWidth="1" opacity="0.3" fill="none" />
        <circle cx="320" cy="220" r="12" stroke="#ffffff" strokeWidth="1" opacity="0.3" fill="none" />
        <circle cx="250" cy="330" r="12" stroke="#c5a065" strokeWidth="1" opacity="0.3" fill="none" />
      </svg>
    </div>
  );
}