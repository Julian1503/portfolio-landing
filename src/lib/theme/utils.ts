import type { ThemeTokensDTO, SectionOverride } from "./schemas";

// ============================================
// CSS Variable Generation
// ============================================

/**
 * Safely get section override if it exists
 */
function getSectionOverride(
  sectionOverrides: ThemeTokensDTO["sectionOverrides"],
  section: string
): SectionOverride | undefined {
  if (!sectionOverrides) {
    return undefined;
  }
  
  // Type-safe access to section overrides
  const validSections = ["hero", "projects", "about", "contact", "footer"] as const;
  if (!validSections.includes(section as any)) {
    return undefined;
  }
  
  return sectionOverrides[section as keyof typeof sectionOverrides];
}

/**
 * Generate CSS variables from theme tokens
 * Returns a CSS string that can be injected into <style> tag
 */
export function generateThemeCSS(theme: ThemeTokensDTO, section?: string): string {
  const { colors, typography, radii, spacing, shadows, layout, breakpoints, animations, sectionOverrides } = theme;
  
  // Get section-specific overrides if applicable
  let activeColors = colors;
  if (section) {
    const override = getSectionOverride(sectionOverrides, section);
    if (override) {
      activeColors = { ...colors, ...override };
    }
  }
  
  // Build CSS variable declarations
  const cssVars: string[] = [];
  
  // Colors
  cssVars.push(`  /* Theme Colors */`);
  cssVars.push(`  --theme-bg-primary: ${activeColors.background};`);
  cssVars.push(`  --theme-bg-secondary: ${activeColors.backgroundSecondary};`);
  cssVars.push(`  --theme-surface: ${activeColors.surface};`);
  cssVars.push(`  --theme-surface-hover: ${activeColors.surfaceHover};`);
  cssVars.push(`  --theme-text: ${activeColors.text};`);
  cssVars.push(`  --theme-text-secondary: ${activeColors.textSecondary};`);
  cssVars.push(`  --theme-text-muted: ${activeColors.textMuted};`);
  cssVars.push(`  --theme-border: ${activeColors.border};`);
  cssVars.push(`  --theme-border-light: ${activeColors.borderLight};`);
  cssVars.push(`  --theme-primary: ${activeColors.primary};`);
  cssVars.push(`  --theme-primary-hover: ${activeColors.primaryHover};`);
  cssVars.push(`  --theme-primary-text: ${activeColors.primaryText};`);
  cssVars.push(`  --theme-secondary: ${activeColors.secondary};`);
  cssVars.push(`  --theme-secondary-hover: ${activeColors.secondaryHover};`);
  cssVars.push(`  --theme-secondary-text: ${activeColors.secondaryText};`);
  cssVars.push(`  --theme-tertiary: ${activeColors.tertiary};`);
  cssVars.push(`  --theme-tertiary-hover: ${activeColors.tertiaryHover};`);
  cssVars.push(`  --theme-accent1: ${activeColors.accent1};`);
  cssVars.push(`  --theme-accent2: ${activeColors.accent2};`);
  cssVars.push(`  --theme-link: ${activeColors.link};`);
  cssVars.push(`  --theme-link-hover: ${activeColors.linkHover};`);
  cssVars.push(`  --theme-danger: ${activeColors.danger};`);
  cssVars.push(`  --theme-success: ${activeColors.success};`);
  cssVars.push(`  --theme-warning: ${activeColors.warning};`);
  
  // Typography
  cssVars.push(`\n  /* Theme Typography */`);
  cssVars.push(`  --theme-font-family: ${typography.fontFamily}, sans-serif;`);
  if (typography.fontFamilyHeading) {
    cssVars.push(`  --theme-font-family-heading: ${typography.fontFamilyHeading}, sans-serif;`);
  }
  if (typography.fontFamilyMono) {
    cssVars.push(`  --theme-font-family-mono: ${typography.fontFamilyMono}, monospace;`);
  }
  cssVars.push(`  --theme-font-size-base: ${typography.baseFontSize}px;`);
  cssVars.push(`  --theme-font-size-h1: ${typography.h1Size};`);
  cssVars.push(`  --theme-font-size-h2: ${typography.h2Size};`);
  cssVars.push(`  --theme-font-size-h3: ${typography.h3Size};`);
  cssVars.push(`  --theme-font-size-h4: ${typography.h4Size};`);
  cssVars.push(`  --theme-font-size-h5: ${typography.h5Size};`);
  cssVars.push(`  --theme-font-size-h6: ${typography.h6Size};`);
  cssVars.push(`  --theme-line-height-base: ${typography.lineHeightBase};`);
  cssVars.push(`  --theme-line-height-heading: ${typography.lineHeightHeading};`);
  cssVars.push(`  --theme-font-weight-normal: ${typography.fontWeightNormal};`);
  cssVars.push(`  --theme-font-weight-medium: ${typography.fontWeightMedium};`);
  cssVars.push(`  --theme-font-weight-bold: ${typography.fontWeightBold};`);
  
  // Radii
  cssVars.push(`\n  /* Theme Radii */`);
  cssVars.push(`  --theme-radius-none: ${radii.none};`);
  cssVars.push(`  --theme-radius-sm: ${radii.sm};`);
  cssVars.push(`  --theme-radius-md: ${radii.md};`);
  cssVars.push(`  --theme-radius-lg: ${radii.lg};`);
  cssVars.push(`  --theme-radius-xl: ${radii.xl};`);
  cssVars.push(`  --theme-radius-xxl: ${radii.xxl};`);
  cssVars.push(`  --theme-radius-round: ${radii.round};`);
  cssVars.push(`  --theme-radius-full: ${radii.full};`);
  
  // Spacing
  cssVars.push(`\n  /* Theme Spacing */`);
  cssVars.push(`  --theme-spacing-xs: ${spacing.xs};`);
  cssVars.push(`  --theme-spacing-sm: ${spacing.sm};`);
  cssVars.push(`  --theme-spacing-md: ${spacing.md};`);
  cssVars.push(`  --theme-spacing-lg: ${spacing.lg};`);
  cssVars.push(`  --theme-spacing-xl: ${spacing.xl};`);
  cssVars.push(`  --theme-spacing-2xl: ${spacing["2xl"]};`);
  cssVars.push(`  --theme-spacing-3xl: ${spacing["3xl"]};`);
  
  // Shadows (map to Tailwind shadow utilities)
  cssVars.push(`\n  /* Theme Shadows */`);
  cssVars.push(`  --theme-shadow-sm: ${getShadowValue(shadows.sm)};`);
  cssVars.push(`  --theme-shadow-md: ${getShadowValue(shadows.md)};`);
  cssVars.push(`  --theme-shadow-lg: ${getShadowValue(shadows.lg)};`);
  cssVars.push(`  --theme-shadow-xl: ${getShadowValue(shadows.xl)};`);
  cssVars.push(`  --theme-shadow-2xl: ${getShadowValue(shadows["2xl"])};`);
  
  // Layout
  cssVars.push(`\n  /* Theme Layout */`);
  cssVars.push(`  --theme-container-sm: ${layout.containerSmall};`);
  cssVars.push(`  --theme-container-md: ${layout.containerMedium};`);
  cssVars.push(`  --theme-container-lg: ${layout.containerLarge};`);
  cssVars.push(`  --theme-grid-gutters: ${layout.gridGutters};`);
  cssVars.push(`  --theme-flex-gap: ${layout.flexGap};`);
  
  // Breakpoints
  cssVars.push(`\n  /* Theme Breakpoints */`);
  cssVars.push(`  --theme-breakpoint-sm: ${breakpoints.sm};`);
  cssVars.push(`  --theme-breakpoint-md: ${breakpoints.md};`);
  cssVars.push(`  --theme-breakpoint-lg: ${breakpoints.lg};`);
  cssVars.push(`  --theme-breakpoint-xl: ${breakpoints.xl};`);
  
  // Animations
  cssVars.push(`\n  /* Theme Animations */`);
  cssVars.push(`  --theme-animation-fast: ${animations.fast};`);
  cssVars.push(`  --theme-animation-default: ${animations.default};`);
  cssVars.push(`  --theme-animation-slow: ${animations.slow};`);
  
  return `:root {\n${cssVars.join("\n")}\n}`;
}

/**
 * Map shadow preset to actual CSS shadow value
 */
function getShadowValue(preset: string): string {
  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  };
  
  return shadowMap[preset] || shadowMap.md;
}

/**
 * Generate inline style object from theme tokens
 * Useful for applying theme dynamically to specific elements
 */
export function generateInlineThemeStyles(theme: ThemeTokensDTO): Record<string, string> {
  const { colors, typography } = theme;
  
  return {
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: `${typography.fontFamily}, sans-serif`,
    fontSize: `${typography.baseFontSize}px`,
    lineHeight: `${typography.lineHeightBase}`,
  };
}
