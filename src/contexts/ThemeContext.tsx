"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemePreset = "default" | "dark" | "warm" | "minimal";

interface ThemeContextType {
  currentTheme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  availableThemes: { key: ThemePreset; name: string; isDark: boolean }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>("default");
  const [isLoaded, setIsLoaded] = useState(false);

  const availableThemes = [
    { key: "default" as ThemePreset, name: "Default", isDark: false },
    { key: "dark" as ThemePreset, name: "Dark", isDark: true },
    { key: "warm" as ThemePreset, name: "Warm", isDark: false },
    { key: "minimal" as ThemePreset, name: "Minimal", isDark: false },
  ];

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme-preference");
    if (stored && ["default", "dark", "warm", "minimal"].includes(stored)) {
      setCurrentTheme(stored as ThemePreset);
    }
    setIsLoaded(true);
  }, []);

  // Apply theme by fetching and injecting CSS
  useEffect(() => {
    if (!isLoaded) return;

    const applyTheme = async () => {
      try {
        const response = await fetch(`/api/theme/preview?preset=${currentTheme}`);
        if (!response.ok) throw new Error("Failed to fetch theme");
        
        const data = await response.json();
        
        // Remove existing theme style if any
        const existingStyle = document.getElementById("dynamic-theme");
        if (existingStyle) {
          existingStyle.remove();
        }
        
        // Inject new theme CSS
        const style = document.createElement("style");
        style.id = "dynamic-theme";
        style.textContent = data.css;
        document.head.appendChild(style);
      } catch (error) {
        console.error("Failed to apply theme:", error);
      }
    };

    applyTheme();
  }, [currentTheme, isLoaded]);

  const setTheme = (theme: ThemePreset) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme-preference", theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
