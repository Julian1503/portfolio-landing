"use client";

import React from "react";
import type { ThemeTokensDTO, ColorTokens, TypographyTokens, RadiiTokens, SpacingTokens } from "@/lib/theme/schemas";

type PresetInfo = {
  key: string;
  name: string;
  isDark: boolean;
};

export function ThemeAdminSection() {
  const [theme, setTheme] = React.useState<ThemeTokensDTO | null>(null);
  const [presets, setPresets] = React.useState<PresetInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sectionOverrides, setSectionOverrides] = React.useState({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"colors" | "typography" | "layout">("colors");

  // Fetch theme data and presets
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [themeRes, presetsRes] = await Promise.all([
          fetch("/api/admin/theme"),
          fetch("/api/admin/theme/presets"),
        ]);
        
        if (!themeRes.ok) throw new Error("Failed to fetch theme");
        if (!presetsRes.ok) throw new Error("Failed to fetch presets");
        
        const themeData = await themeRes.json();
        const presetsData = await presetsRes.json();
        
        setTheme(themeData);
        setPresets(presetsData.presets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load theme");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setError(null);

    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...theme,
          sectionOverrides: sectionOverrides || {}, // Ensure it is never null
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update theme");
      }

      const updated = await res.json();
      setTheme(updated);
      setIsDirty(false);
    } catch (err : Error | any) {
      setError(err.message || "Failed to update theme");
    }
  };

  const handleLoadPreset = async (presetKey: string) => {
    if (!confirm(`Load the "${presetKey}" preset? This will replace all current theme settings.`)) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/theme/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: presetKey }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to load preset");
      }

      const updated = await res.json();
      setTheme(updated);
      setIsDirty(false);
      setSuccessMessage(`Preset "${presetKey}" loaded successfully!`);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preset");
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorChange = (key: keyof ColorTokens, value: string) => {
    if (!theme) return;
    setTheme({
      ...theme,
      colors: { ...theme.colors, [key]: value },
    });
    setIsDirty(true);
  };

  const handleTypographyChange = (key: keyof TypographyTokens, value: string | number) => {
    if (!theme) return;
    setTheme({
      ...theme,
      typography: { ...theme.typography, [key]: value },
    });
    setIsDirty(true);
  };

  const handleRadiiChange = (key: keyof RadiiTokens, value: string) => {
    if (!theme) return;
    setTheme({
      ...theme,
      radii: { ...theme.radii, [key]: value },
    });
    setIsDirty(true);
  };

  const handleSpacingChange = (key: keyof SpacingTokens, value: string) => {
    if (!theme) return;
    setTheme({
      ...theme,
      spacing: { ...theme.spacing, [key]: value },
    });
    setIsDirty(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error || "Theme not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Theme & Design System</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure colors, typography, and layout for your portfolio.
          </p>
        </div>
        {isDirty && (
          <span className="text-xs text-amber-600 font-medium">● Unsaved changes</span>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {/* Presets */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => handleLoadPreset(preset.key)}
              disabled={isSaving}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {preset.name} {preset.isDark && "🌙"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("colors")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "colors"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Colors
          </button>
          <button
            onClick={() => setActiveTab("typography")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "typography"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Typography
          </button>
          <button
            onClick={() => setActiveTab("layout")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "layout"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Layout
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            {/* Background Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Background Colors</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <ColorInput
                  label="Primary Background"
                  value={theme.colors.background}
                  onChange={(v) => handleColorChange("background", v)}
                />
                <ColorInput
                  label="Secondary Background"
                  value={theme.colors.backgroundSecondary}
                  onChange={(v) => handleColorChange("backgroundSecondary", v)}
                />
              </div>
            </div>

            {/* Surface Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Surface/Card Colors</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <ColorInput
                  label="Surface"
                  value={theme.colors.surface}
                  onChange={(v) => handleColorChange("surface", v)}
                />
                <ColorInput
                  label="Surface Hover"
                  value={theme.colors.surfaceHover}
                  onChange={(v) => handleColorChange("surfaceHover", v)}
                />
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Text Colors</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <ColorInput
                  label="Primary Text"
                  value={theme.colors.text}
                  onChange={(v) => handleColorChange("text", v)}
                />
                <ColorInput
                  label="Secondary Text"
                  value={theme.colors.textSecondary}
                  onChange={(v) => handleColorChange("textSecondary", v)}
                />
                <ColorInput
                  label="Muted Text"
                  value={theme.colors.textMuted}
                  onChange={(v) => handleColorChange("textMuted", v)}
                />
              </div>
            </div>

            {/* Border Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Border Colors</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <ColorInput
                  label="Border"
                  value={theme.colors.border}
                  onChange={(v) => handleColorChange("border", v)}
                />
                <ColorInput
                  label="Border Light"
                  value={theme.colors.borderLight}
                  onChange={(v) => handleColorChange("borderLight", v)}
                />
              </div>
            </div>

            {/* Primary Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Primary Action Colors</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <ColorInput
                  label="Primary"
                  value={theme.colors.primary}
                  onChange={(v) => handleColorChange("primary", v)}
                />
                <ColorInput
                  label="Primary Hover"
                  value={theme.colors.primaryHover}
                  onChange={(v) => handleColorChange("primaryHover", v)}
                />
                <ColorInput
                  label="Primary Text"
                  value={theme.colors.primaryText}
                  onChange={(v) => handleColorChange("primaryText", v)}
                />
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Secondary Action Colors</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <ColorInput
                  label="Secondary"
                  value={theme.colors.secondary}
                  onChange={(v) => handleColorChange("secondary", v)}
                />
                <ColorInput
                  label="Secondary Hover"
                  value={theme.colors.secondaryHover}
                  onChange={(v) => handleColorChange("secondaryHover", v)}
                />
                <ColorInput
                  label="Secondary Text"
                  value={theme.colors.secondaryText}
                  onChange={(v) => handleColorChange("secondaryText", v)}
                />
              </div>
            </div>

            {/* Link and Semantic Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Links & Semantic Colors</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <ColorInput
                  label="Link"
                  value={theme.colors.link}
                  onChange={(v) => handleColorChange("link", v)}
                />
                <ColorInput
                  label="Link Hover"
                  value={theme.colors.linkHover}
                  onChange={(v) => handleColorChange("linkHover", v)}
                />
                <ColorInput
                  label="Danger"
                  value={theme.colors.danger}
                  onChange={(v) => handleColorChange("danger", v)}
                />
                <ColorInput
                  label="Success"
                  value={theme.colors.success}
                  onChange={(v) => handleColorChange("success", v)}
                />
                <ColorInput
                  label="Warning"
                  value={theme.colors.warning}
                  onChange={(v) => handleColorChange("warning", v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === "typography" && (
          <div className="space-y-6">
            {/* Font Families */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Font Families</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Body Font
                  </label>
                  <select
                    value={theme.typography.fontFamily}
                    onChange={(e) => handleTypographyChange("fontFamily", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="system-ui">System UI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Base Font Size (px)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="22"
                    value={theme.typography.baseFontSize}
                    onChange={(e) => handleTypographyChange("baseFontSize", parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Base Line Height
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={theme.typography.lineHeightBase}
                    onChange={(e) => handleTypographyChange("lineHeightBase", parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Heading Sizes */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Heading Sizes</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="H1 Size"
                  value={theme.typography.h1Size}
                  onChange={(v) => handleTypographyChange("h1Size", v)}
                  placeholder="3rem"
                />
                <TextInput
                  label="H2 Size"
                  value={theme.typography.h2Size}
                  onChange={(v) => handleTypographyChange("h2Size", v)}
                  placeholder="2.5rem"
                />
                <TextInput
                  label="H3 Size"
                  value={theme.typography.h3Size}
                  onChange={(v) => handleTypographyChange("h3Size", v)}
                  placeholder="2rem"
                />
                <TextInput
                  label="H4 Size"
                  value={theme.typography.h4Size}
                  onChange={(v) => handleTypographyChange("h4Size", v)}
                  placeholder="1.5rem"
                />
                <TextInput
                  label="H5 Size"
                  value={theme.typography.h5Size}
                  onChange={(v) => handleTypographyChange("h5Size", v)}
                  placeholder="1.25rem"
                />
                <TextInput
                  label="H6 Size"
                  value={theme.typography.h6Size}
                  onChange={(v) => handleTypographyChange("h6Size", v)}
                  placeholder="1rem"
                />
              </div>
            </div>

            {/* Font Weights */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Font Weights</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Normal Weight
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="900"
                    step="100"
                    value={theme.typography.fontWeightNormal}
                    onChange={(e) => handleTypographyChange("fontWeightNormal", parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Medium Weight
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="900"
                    step="100"
                    value={theme.typography.fontWeightMedium}
                    onChange={(e) => handleTypographyChange("fontWeightMedium", parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Bold Weight
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="900"
                    step="100"
                    value={theme.typography.fontWeightBold}
                    onChange={(e) => handleTypographyChange("fontWeightBold", parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === "layout" && (
          <div className="space-y-6">
            {/* Border Radii */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Border Radii</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Small"
                  value={theme.radii.sm}
                  onChange={(v) => handleRadiiChange("sm", v)}
                  placeholder="0.25rem"
                />
                <TextInput
                  label="Medium"
                  value={theme.radii.md}
                  onChange={(v) => handleRadiiChange("md", v)}
                  placeholder="0.5rem"
                />
                <TextInput
                  label="Large"
                  value={theme.radii.lg}
                  onChange={(v) => handleRadiiChange("lg", v)}
                  placeholder="1rem"
                />
                <TextInput
                  label="Extra Large"
                  value={theme.radii.xl}
                  onChange={(v) => handleRadiiChange("xl", v)}
                  placeholder="1.5rem"
                />
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Spacing Scale</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Extra Small"
                  value={theme.spacing.xs}
                  onChange={(v) => handleSpacingChange("xs", v)}
                  placeholder="0.25rem"
                />
                <TextInput
                  label="Small"
                  value={theme.spacing.sm}
                  onChange={(v) => handleSpacingChange("sm", v)}
                  placeholder="0.5rem"
                />
                <TextInput
                  label="Medium"
                  value={theme.spacing.md}
                  onChange={(v) => handleSpacingChange("md", v)}
                  placeholder="1rem"
                />
                <TextInput
                  label="Large"
                  value={theme.spacing.lg}
                  onChange={(v) => handleSpacingChange("lg", v)}
                  placeholder="1.5rem"
                />
                <TextInput
                  label="Extra Large"
                  value={theme.spacing.xl}
                  onChange={(v) => handleSpacingChange("xl", v)}
                  placeholder="2rem"
                />
                <TextInput
                  label="2X Large"
                  value={theme.spacing["2xl"]}
                  onChange={(v) => handleSpacingChange("2xl", v)}
                  placeholder="3rem"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-medium text-slate-700 mb-4">Live Preview</h3>
        <div 
          className="space-y-4 p-6 rounded-lg" 
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          }}
        >
          <div 
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.lg,
            }}
          >
            <h4 
              className="font-bold mb-2"
              style={{
                color: theme.colors.text,
                fontSize: theme.typography.h4Size,
              }}
            >
              Card Title
            </h4>
            <p 
              className="mb-3"
              style={{
                color: theme.colors.textSecondary,
                fontSize: `${theme.typography.baseFontSize}px`,
              }}
            >
              This is a preview of how your theme will look.
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded font-medium"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryText,
                  borderRadius: theme.radii.md,
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded font-medium"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.secondaryText,
                  borderRadius: theme.radii.md,
                }}
              >
                Secondary Button
              </button>
            </div>
          </div>
          <p style={{ color: theme.colors.textMuted, fontSize: `${theme.typography.baseFontSize - 2}px` }}>
            Muted text example with a <a href="#" style={{ color: theme.colors.link }}>sample link</a>.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 border-t pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className={`rounded-lg px-6 py-2 text-sm font-semibold text-white ${
            isSaving || !isDirty
              ? "cursor-not-allowed bg-slate-400"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// Helper Components
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 rounded border border-slate-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
