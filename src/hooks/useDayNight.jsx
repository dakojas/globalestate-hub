import { useState, useEffect } from "react";

// Shared module-level state so all components stay in sync
let currentTheme = (() => {
  const override = localStorage.getItem("theme-override");
  if (override !== null) return override;
  const hour = new Date().getHours();
  return (hour < 6 || hour >= 18) ? "dark" : "light";
})();

const listeners = new Set();
const notify = () => listeners.forEach(fn => fn(currentTheme));

export function useDayNight() {
  const [isDark, setIsDark] = useState(currentTheme === "dark");

  useEffect(() => {
    const listener = (theme) => setIsDark(theme === "dark");
    listeners.add(listener);
    // Sync immediately in case state drifted
    setIsDark(currentTheme === "dark");
    return () => { listeners.delete(listener); };
  }, []);

  // Set data-theme on <html> so CSS variables apply globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Auto time-based switching (only when no manual override)
  useEffect(() => {
    if (localStorage.getItem("theme-override") !== null) return;
    const checkTime = () => {
      const hour = new Date().getHours();
      const autoDark = hour < 6 || hour >= 18;
      if (autoDark !== (currentTheme === "dark")) {
        currentTheme = autoDark ? "dark" : "light";
        notify();
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme-override", currentTheme);
    notify();
  };

  return { isDark, toggleTheme };
}