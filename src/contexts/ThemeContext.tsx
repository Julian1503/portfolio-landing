"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type ThemePreset = "default" | "dark" | "warm" | "minimal";

interface ThemeContextType {
  currentTheme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  availableThemes: { key: ThemePreset; name: string; isDark: boolean }[];
}
const themeCache = new Map<ThemePreset, string>();

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>("default");
  const [isLoaded, setIsLoaded] = useState(false);
  const isApplyingTheme = useRef(false);

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
    if (!isLoaded || isApplyingTheme.current) return;

    const applyTheme = async () => {
      isApplyingTheme.current = true;
      try {
        let cssContent = themeCache.get(currentTheme);

        if (!cssContent) {
          const res = await fetch(`/api/theme/preview?preset=${currentTheme}`);
          if (!res.ok) {
            const errText = await res.text().catch(() => res.statusText || "Unknown error");
            console.error("Failed to fetch theme:", res.status, errText);
            return;
          }

          const data = await res.json();
          cssContent = data.css as string;

          themeCache.set(currentTheme, cssContent);
        }
        
        const existingStyle = document.getElementById("dynamic-theme");
        if (existingStyle) {
          existingStyle.remove();
        }
        
        const style = document.createElement("style");
        style.id = "dynamic-theme";
        style.textContent = cssContent || "";
        document.head.appendChild(style);
      } catch (error) {
        console.error("Failed to apply theme:", error);
      } finally {
        isApplyingTheme.current = false;
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
