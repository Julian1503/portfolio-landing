"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentThemeInfo = availableThemes.find((t) => t.key === currentTheme);

  return (
    <div className="relative md:mx-3" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] transition-colors"
        aria-label="Switch theme"
        aria-expanded={isOpen}
      >
        <span className="text-xl" role="img" aria-label="Theme icon">
          {currentThemeInfo?.isDark ? "🌙" : "☀️"}
        </span>
        <span className="hidden sm:inline text-sm font-medium text-[var(--theme-text)]">
          {currentThemeInfo?.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-lg overflow-hidden z-50"
          >
            <div className="py-1">
              {availableThemes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => {
                    setTheme(theme.key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                    currentTheme === theme.key
                      ? "bg-[var(--theme-primary)] text-[var(--theme-primary-text)]"
                      : "text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]"
                  }`}
                >
                  <span className="text-lg" role="img" aria-label="Theme icon">
                    {theme.isDark ? "🌙" : "☀️"}
                  </span>
                  <span>{theme.name}</span>
                  {currentTheme === theme.key && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
