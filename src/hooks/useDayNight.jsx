import { useState, useEffect } from "react";

export function useDayNight() {
  const [isDark, setIsDark] = useState(() => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  });

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsDark(hour < 6 || hour >= 18);
    };
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return isDark;
}