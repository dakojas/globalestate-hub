import React from "react";
import { Sun, Moon } from "lucide-react";
import { useDayNight } from "@/hooks/useDayNight";

export default function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useDayNight();
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all ${className || ""}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}