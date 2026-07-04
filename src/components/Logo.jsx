export default function Logo({ className = "h-10" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ height: "inherit" }}>
      <svg viewBox="0 0 44 44" fill="none" className="h-full w-auto">
        <circle cx="22" cy="22" r="20" stroke="#c5a065" strokeWidth="1.5" fill="none" />
        <ellipse cx="22" cy="22" rx="7" ry="20" stroke="#c5a065" strokeWidth="1" fill="none" opacity="0.5" />
        <ellipse cx="22" cy="22" rx="14" ry="20" stroke="#c5a065" strokeWidth="1" fill="none" opacity="0.35" />
        <line x1="2" y1="22" x2="42" y2="22" stroke="#c5a065" strokeWidth="1" opacity="0.35" />
        <path d="M3 22 L14 22 L18 14 L22 22 L26 12 L30 22 L34 16 L41 22"
          stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-heading text-white text-lg tracking-[0.12em] font-semibold">
        GLOB<span className="text-[#c5a065]">E</span>YA
      </span>
    </div>
  );
}