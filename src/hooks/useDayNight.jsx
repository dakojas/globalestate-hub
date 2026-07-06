import { useState, useEffect } from "react";

export function useDayNight() {
  const [manualOverride, setManualOverride] = useState(() => localStorage.getItem("theme-override"));
  const [isDark, setIsDark] = useState(() => {
    const override = localStorage.getItem("theme-override");
    if (override !== null) return override === "dark";
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  });

  useEffect(() => {
    if (manualOverride !== null) {
      setIsDark(manualOverride === "dark");
      return;
    }
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsDark(hour < 6 || hour >= 18);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [manualOverride]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const value = next ? "dark" : "light";
    setManualOverride(value);
    localStorage.setItem("theme-override", value);
  };

  return { isDark, toggleTheme };
}