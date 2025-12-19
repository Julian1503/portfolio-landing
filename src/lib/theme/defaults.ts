import type {
  ThemeTokensDTO,
  ColorTokens,
  TypographyTokens,
  RadiiTokens,
  SpacingTokens,
  ShadowTokens,
} from "./schemas";

// ============================================
// Default Theme Tokens
// Matches current design in globals.css
// ============================================

export const DEFAULT_COLORS: ColorTokens = {
  // Page backgrounds
  background: "#FAFAF9", // Stone-50
  backgroundSecondary: "#FFFFFF",
  
  // Surface/Card colors
  surface: "#FFFFFF",
  surfaceHover: "#F5F5F4", // Stone-100
  
  // Text colors
  text: "#1C1917", // Stone-900
  textSecondary: "#57534E", // Stone-600
  textMuted: "#78716C", // Stone-500
  
  // Border
  border: "#E7E5E4", // Stone-200
  borderLight: "#F5F5F4", // Stone-100
  
  // Primary action colors (architectural accent - sage green)
  primary: "#65816A", // Sage green
  primaryHover: "#7D9982",
  primaryText: "#FFFFFF",
  
  // Secondary action colors (dark)
  secondary: "#1C1917", // Stone-900
  secondaryHover: "#292524", // Stone-800
  secondaryText: "#FFFFFF",
  
  // Semantic colors
  link: "#65816A",
  linkHover: "#7D9982",
  danger: "#DC2626", // Red-600
  success: "#16A34A", // Green-600
  warning: "#EA580C", // Orange-600
};

export const DEFAULT_TYPOGRAPHY: TypographyTokens = {
  fontFamily: "Montserrat",
  fontFamilyHeading: "Montserrat",
  fontFamilyMono: "Geist Mono",
  
  baseFontSize: 16,
  
  h1Size: "3rem",
  h2Size: "2.5rem",
  h3Size: "2rem",
  h4Size: "1.5rem",
  h5Size: "1.25rem",
  h6Size: "1rem",
  
  lineHeightBase: 1.6,
  lineHeightHeading: 1.2,
  
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
};

export const DEFAULT_RADII: RadiiTokens = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

export const DEFAULT_SPACING: SpacingTokens = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export const DEFAULT_SHADOWS: ShadowTokens = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

// Complete default theme
export const DEFAULT_THEME: ThemeTokensDTO = {
  name: "Default",
  isDark: false,
  colors: DEFAULT_COLORS,
  typography: DEFAULT_TYPOGRAPHY,
  radii: DEFAULT_RADII,
  spacing: DEFAULT_SPACING,
  shadows: DEFAULT_SHADOWS,
  sectionOverrides: undefined,
};

// ============================================
// Dark Theme Preset
// ============================================

export const DARK_THEME: ThemeTokensDTO = {
  name: "Dark",
  isDark: true,
  colors: {
    background: "#0F0F0F",
    backgroundSecondary: "#1A1A1A",
    surface: "#1A1A1A",
    surfaceHover: "#262626",
    text: "#F5F5F5",
    textSecondary: "#A3A3A3",
    textMuted: "#737373",
    border: "#404040",
    borderLight: "#262626",
    primary: "#7D9982",
    primaryHover: "#9BB19F",
    primaryText: "#0F0F0F",
    secondary: "#F5F5F5",
    secondaryHover: "#FFFFFF",
    secondaryText: "#0F0F0F",
    link: "#7D9982",
    linkHover: "#9BB19F",
    danger: "#EF4444",
    success: "#22C55E",
    warning: "#F97316",
  },
  typography: DEFAULT_TYPOGRAPHY,
  radii: DEFAULT_RADII,
  spacing: DEFAULT_SPACING,
  shadows: DEFAULT_SHADOWS,
  sectionOverrides: undefined,
};

// ============================================
// Warm Theme Preset
// ============================================

export const WARM_THEME: ThemeTokensDTO = {
  name: "Warm",
  isDark: false,
  colors: {
    background: "#FEF7EF",
    backgroundSecondary: "#FFFBF5",
    surface: "#FFFBF5",
    surfaceHover: "#FEF3E7",
    text: "#451A03",
    textSecondary: "#78350F",
    textMuted: "#92400E",
    border: "#FED7AA",
    borderLight: "#FFEDD5",
    primary: "#D97706",
    primaryHover: "#B45309",
    primaryText: "#FFFFFF",
    secondary: "#451A03",
    secondaryHover: "#78350F",
    secondaryText: "#FFFFFF",
    link: "#D97706",
    linkHover: "#B45309",
    danger: "#DC2626",
    success: "#16A34A",
    warning: "#EA580C",
  },
  typography: DEFAULT_TYPOGRAPHY,
  radii: DEFAULT_RADII,
  spacing: DEFAULT_SPACING,
  shadows: DEFAULT_SHADOWS,
  sectionOverrides: undefined,
};

// ============================================
// Minimal Theme Preset
// ============================================

export const MINIMAL_THEME: ThemeTokensDTO = {
  name: "Minimal",
  isDark: false,
  colors: {
    background: "#FFFFFF",
    backgroundSecondary: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceHover: "#F5F5F5",
    text: "#000000",
    textSecondary: "#525252",
    textMuted: "#737373",
    border: "#E5E5E5",
    borderLight: "#F5F5F5",
    primary: "#000000",
    primaryHover: "#262626",
    primaryText: "#FFFFFF",
    secondary: "#FFFFFF",
    secondaryHover: "#F5F5F5",
    secondaryText: "#000000",
    link: "#000000",
    linkHover: "#262626",
    danger: "#DC2626",
    success: "#16A34A",
    warning: "#EA580C",
  },
  typography: DEFAULT_TYPOGRAPHY,
  radii: {
    none: "0",
    sm: "0",
    md: "0",
    lg: "0.125rem",
    xl: "0.25rem",
    full: "9999px",
  },
  spacing: DEFAULT_SPACING,
  shadows: {
    sm: "none",
    md: "sm",
    lg: "md",
  },
  sectionOverrides: undefined,
};

// ============================================
// Preset Registry
// ============================================

export const THEME_PRESETS = {
  default: DEFAULT_THEME,
  dark: DARK_THEME,
  warm: WARM_THEME,
  minimal: MINIMAL_THEME,
} as const;

export type ThemePresetKey = keyof typeof THEME_PRESETS;
