"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const themes = ["light", "dark", "retro"];
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle text-xl"
      aria-label="Toggle Theme"
    >
      {theme}
    </button>
  );
}
