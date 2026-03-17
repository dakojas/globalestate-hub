export default function Logo({ className = "h-10" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ height: "inherit" }}>
      <svg viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        {/* Circle */}
        <circle cx="22" cy="20" r="17" stroke="white" strokeWidth="1.8" fill="none"/>
        {/* Palm fronds */}
        <path d="M22 28 C22 28 14 22 14 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 28 C22 28 11 19 12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 28 C22 28 10 17 13 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 28 C22 28 30 22 30 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 28 C22 28 33 19 32 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 28 C22 28 34 17 31 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M22 28 C22 28 22 18 22 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Stem */}
        <path d="M22 28 L22 34" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Teardrop/pin bottom */}
        <ellipse cx="22" cy="38" rx="3.5" ry="5" stroke="white" strokeWidth="1.5" fill="none"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-white font-bold text-sm tracking-widest uppercase">Nehnuteľnosti</span>
        <span className="text-white/70 text-[9px] tracking-[0.25em] uppercase">v zahraničí</span>
      </div>
    </div>
  );
}