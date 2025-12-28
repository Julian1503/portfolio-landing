import React from "react";
import type { ThemeTokensDTO } from "@/lib/theme/schemas";

interface ThemePreviewProps {
  theme: ThemeTokensDTO;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const { colors, typography, radii, spacing, shadows, layout, breakpoints, animations } = theme;

  return (
    <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] overflow-hidden">
      <div className="bg-[var(--theme-surface-hover)] px-6 py-4 border-b border-[var(--theme-border)]">
        <h3 className="text-sm font-medium text-[var(--theme-text)]">Live Preview</h3>
        <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
          Preview of your theme across different components and states
        </p>
      </div>

      <div 
        className="p-6 space-y-8"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: `${typography.fontFamily}, sans-serif`,
          fontSize: `${typography.baseFontSize}px`,
          lineHeight: typography.lineHeightBase,
        }}
      >
        {/* Typography Showcase */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Typography
          </h4>
          <div className="space-y-3">
            <h1 
              style={{
                fontSize: typography.h1Size,
                fontWeight: typography.fontWeightBold,
                lineHeight: typography.lineHeightHeading,
                color: colors.text,
              }}
            >
              Heading 1
            </h1>
            <h2 
              style={{
                fontSize: typography.h2Size,
                fontWeight: typography.fontWeightBold,
                lineHeight: typography.lineHeightHeading,
                color: colors.text,
              }}
            >
              Heading 2
            </h2>
            <h3 
              style={{
                fontSize: typography.h3Size,
                fontWeight: typography.fontWeightMedium,
                lineHeight: typography.lineHeightHeading,
                color: colors.text,
              }}
            >
              Heading 3
            </h3>
            <p style={{ color: colors.textSecondary }}>
              Regular paragraph text with{" "}
              <a href="#" style={{ color: colors.link, textDecoration: "underline" }}>
                a link
              </a>{" "}
              and some <strong style={{ fontWeight: typography.fontWeightBold }}>bold text</strong>.
            </p>
            <p style={{ color: colors.textMuted, fontSize: `${typography.baseFontSize - 2}px` }}>
              Muted text for less important content.
            </p>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Color Palette
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ColorSwatch label="Primary" color={colors.primary} textColor={colors.primaryText} />
            <ColorSwatch label="Secondary" color={colors.secondary} textColor={colors.secondaryText} />
            <ColorSwatch label="Tertiary" color={colors.tertiary} textColor={colors.text} />
            <ColorSwatch label="Accent 1" color={colors.accent1} textColor={colors.primaryText} />
            <ColorSwatch label="Accent 2" color={colors.accent2} textColor={colors.primaryText} />
            <ColorSwatch label="Success" color={colors.success} textColor="#FFFFFF" />
            <ColorSwatch label="Danger" color={colors.danger} textColor="#FFFFFF" />
            <ColorSwatch label="Warning" color={colors.warning} textColor="#FFFFFF" />
          </div>
        </div>

        {/* Cards and Surfaces */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Cards & Surfaces
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div 
              className="p-5 transition-all"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.lg,
              }}
            >
              <h5 
                className="font-semibold mb-2"
                style={{
                  color: colors.text,
                  fontSize: typography.h5Size,
                }}
              >
                Surface Card
              </h5>
              <p style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
                This is a card with surface background color.
              </p>
              <div className="flex gap-2">
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textSecondary,
                  }}
                >
                  Tag
                </span>
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryText,
                  }}
                >
                  Featured
                </span>
              </div>
            </div>

            <div 
              className="p-5 transition-all cursor-pointer"
              style={{
                backgroundColor: colors.surfaceHover,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: radii.lg,
              }}
            >
              <h5 
                className="font-semibold mb-2"
                style={{
                  color: colors.text,
                  fontSize: typography.h5Size,
                }}
              >
                Hover State Card
              </h5>
              <p style={{ color: colors.textSecondary }}>
                This card shows the hover background color.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Buttons
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-3 font-semibold transition-all"
              style={{
                backgroundColor: colors.primary,
                color: colors.primaryText,
                borderRadius: radii.md,
                border: "none",
              }}
            >
              Primary Button
            </button>
            <button
              className="px-6 py-3 font-semibold transition-all"
              style={{
                backgroundColor: colors.secondary,
                color: colors.secondaryText,
                borderRadius: radii.md,
                border: "none",
              }}
            >
              Secondary Button
            </button>
            <button
              className="px-6 py-3 font-semibold transition-all"
              style={{
                backgroundColor: "transparent",
                color: colors.text,
                borderRadius: radii.md,
                border: `2px solid ${colors.border}`,
              }}
            >
              Outlined Button
            </button>
            <button
              className="px-6 py-3 font-semibold transition-all"
              style={{
                backgroundColor: colors.danger,
                color: "#FFFFFF",
                borderRadius: radii.md,
                border: "none",
              }}
            >
              Danger Button
            </button>
          </div>
        </div>

        {/* Form Elements */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Form Elements
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Text Input
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-2"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.md,
                }}
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Select Dropdown
              </label>
              <select
                className="w-full px-4 py-2"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.md,
                }}
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spacing Scale */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Spacing Scale
          </h4>
          <div className="space-y-2">
            {Object.entries(spacing).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span 
                  className="text-xs font-mono w-12"
                  style={{ color: colors.textSecondary }}
                >
                  {key}
                </span>
                <div 
                  style={{
                    width: value,
                    height: "1.5rem",
                    backgroundColor: colors.primary,
                    borderRadius: radii.sm,
                  }}
                />
                <span 
                  className="text-xs font-mono"
                  style={{ color: colors.textMuted }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Border Radii */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Border Radii
          </h4>
          <div className="flex flex-wrap gap-4">
            {Object.entries(radii).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-16 h-16 mb-2"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: value,
                  }}
                />
                <span 
                  className="text-xs font-mono block"
                  style={{ color: colors.textSecondary }}
                >
                  {key}
                </span>
                <span 
                  className="text-xs font-mono block"
                  style={{ color: colors.textMuted }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Shadow Scale
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(shadows).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-full h-20 mb-2 rounded-lg"
                  style={{
                    backgroundColor: colors.surface,
                    boxShadow: `var(--theme-shadow-${key})`,
                  }}
                />
                <span 
                  className="text-xs font-mono block"
                  style={{ color: colors.textSecondary }}
                >
                  {key}
                </span>
                <span 
                  className="text-xs font-mono block"
                  style={{ color: colors.textMuted }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Layout Containers */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Layout Containers
          </h4>
          <div className="space-y-2">
            {Object.entries(layout).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span 
                  className="text-xs font-mono w-32"
                  style={{ color: colors.textSecondary }}
                >
                  {key}
                </span>
                <span 
                  className="text-xs font-mono"
                  style={{ color: colors.textMuted }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakpoints */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Responsive Breakpoints
          </h4>
          <div className="space-y-2">
            {Object.entries(breakpoints).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span 
                  className="text-xs font-mono w-12"
                  style={{ color: colors.textSecondary }}
                >
                  {key}
                </span>
                <div 
                  style={{
                    width: '100%',
                    maxWidth: value,
                    height: "1.5rem",
                    backgroundColor: colors.primary,
                    borderRadius: radii.sm,
                  }}
                />
                <span 
                  className="text-xs font-mono"
                  style={{ color: colors.textMuted }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Animations */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Animation Durations
          </h4>
          <div className="space-y-2">
            {Object.entries(animations).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span 
                  className="text-xs font-mono w-20"
                  style={{ color: colors.textSecondary }}
                >
                  {key}
                </span>
                <span 
                  className="text-xs font-mono"
                  style={{ color: colors.textMuted }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div 
        className="h-20 rounded-lg flex items-center justify-center font-medium text-sm"
        style={{ backgroundColor: color, color: textColor }}
      >
        {label}
      </div>
      <span className="text-xs font-mono text-[var(--theme-text-muted)]">{color}</span>
    </div>
  );
}
