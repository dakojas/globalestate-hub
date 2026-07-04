export default function Logo({ className = "h-10" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ height: "inherit" }}>
      <img
        src="https://media.base44.com/images/public/69b801924dae038161790d9a/033217bb2_53a52fc6-809b-4011-b39f-4b437564147f.jpeg"
        alt="GLOBEYA"
        className="h-full w-auto rounded-lg object-contain"
      />
      <span className="font-heading text-white text-lg tracking-[0.12em] font-semibold">
        GLOB<span className="text-[#c5a065]">E</span>YA
      </span>
    </div>
  );
}