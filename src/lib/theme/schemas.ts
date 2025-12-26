import { z } from "zod";

// ============================================
// Color Token Validation
// ============================================

// Hex color validation (with optional alpha)
const hexColorSchema = z.string().regex(
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/,
  "Must be a valid hex color (e.g., #FFFFFF, #FFF, #FFFFFF80)"
);

export const ColorTokensSchema = z.object({
  // Page backgrounds
  background: hexColorSchema,
  backgroundSecondary: hexColorSchema,
  
  // Surface/Card colors
  surface: hexColorSchema,
  surfaceHover: hexColorSchema,
  
  // Text colors
  text: hexColorSchema,
  textSecondary: hexColorSchema,
  textMuted: hexColorSchema,
  
  // Border
  border: hexColorSchema,
  borderLight: hexColorSchema,
  
  // Primary action colors
  primary: hexColorSchema,
  primaryHover: hexColorSchema,
  primaryText: hexColorSchema,
  
  // Secondary action colors
  secondary: hexColorSchema,
  secondaryHover: hexColorSchema,
  secondaryText: hexColorSchema,
  
  // Tertiary action colors
  tertiary: hexColorSchema,
  tertiaryHover: hexColorSchema,
  
  // Accent colors
  accent1: hexColorSchema,
  accent2: hexColorSchema,
  
  // Semantic colors
  link: hexColorSchema,
  linkHover: hexColorSchema,
  danger: hexColorSchema,
  success: hexColorSchema,
  warning: hexColorSchema,
});

export type ColorTokens = z.infer<typeof ColorTokensSchema>;

// ============================================
// Typography Token Validation
// ============================================

// Safe font family whitelist
const fontFamilySchema = z.enum([
  "system-ui",
  "Inter",
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
  "Georgia",
  "Times New Roman",
  "serif",
  "Courier New",
  "monospace",
  "Montserrat",
  "Geist Sans",
  "Geist Mono",
]);

export const TypographyTokensSchema = z.object({
  // Font families
  fontFamily: fontFamilySchema,
  fontFamilyHeading: fontFamilySchema.optional(),
  fontFamilyMono: fontFamilySchema.optional(),
  
  // Base font size (clamped to reasonable range)
  baseFontSize: z.number().min(12).max(22).default(16),
  
  // Heading sizes in rem or px
  h1Size: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("3rem"),
  h2Size: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("2.5rem"),
  h3Size: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("2rem"),
  h4Size: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1.5rem"),
  h5Size: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1.25rem"),
  h6Size: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1rem"),
  
  // Line height
  lineHeightBase: z.number().min(1).max(2.5).default(1.6),
  lineHeightHeading: z.number().min(1).max(2).default(1.2),
  
  // Font weights (optional)
  fontWeightNormal: z.number().min(100).max(900).default(400),
  fontWeightMedium: z.number().min(100).max(900).default(500),
  fontWeightBold: z.number().min(100).max(900).default(700),
});

export type TypographyTokens = z.infer<typeof TypographyTokensSchema>;

// ============================================
// Radii Token Validation
// ============================================

export const RadiiTokensSchema = z.object({
  none: z.string().default("0"),
  sm: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("0.25rem"),
  md: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("0.5rem"),
  lg: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1rem"),
  xl: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1.5rem"),
  xxl: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("2rem"),
  round: z.string().default("50%"),
  full: z.string().default("9999px"),
});

export type RadiiTokens = z.infer<typeof RadiiTokensSchema>;

// ============================================
// Spacing Token Validation
// ============================================

export const SpacingTokensSchema = z.object({
  xs: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("0.25rem"),
  sm: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("0.5rem"),
  md: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1rem"),
  lg: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1.5rem"),
  xl: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("2rem"),
  "2xl": z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("3rem"),
  "3xl": z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("4rem"),
});

export type SpacingTokens = z.infer<typeof SpacingTokensSchema>;

// ============================================
// Layout Token Validation
// ============================================

export const LayoutTokensSchema = z.object({
  containerSmall: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("48rem"),
  containerMedium: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("64rem"),
  containerLarge: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("80rem"),
  gridGutters: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1.5rem"),
  flexGap: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1rem"),
});

export type LayoutTokens = z.infer<typeof LayoutTokensSchema>;

// ============================================
// Breakpoint Token Validation
// ============================================

export const BreakpointsSchema = z.object({
  sm: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("640px"),
  md: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("768px"),
  lg: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1024px"),
  xl: z.string().regex(/^\d+(\.\d+)?(rem|px)$/).default("1280px"),
});

export type Breakpoints = z.infer<typeof BreakpointsSchema>;

// ============================================
// Shadow Token Validation
// ============================================

// Shadow presets (no arbitrary CSS allowed)
const shadowPresetSchema = z.enum([
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
]);

export const ShadowTokensSchema = z.object({
  sm: shadowPresetSchema.default("sm"),
  md: shadowPresetSchema.default("md"),
  lg: shadowPresetSchema.default("lg"),
  xl: shadowPresetSchema.default("xl"),
  xxl: shadowPresetSchema.default("2xl"),
});

export type ShadowTokens = z.infer<typeof ShadowTokensSchema>;

// ============================================
// Animation Token Validation
// ============================================

export const AnimationTokensSchema = z.object({
  fast: z.string().regex(/^\d+(\.\d+)?(ms|s)$/).default("150ms"),
  default: z.string().regex(/^\d+(\.\d+)?(ms|s)$/).default("300ms"),
  slow: z.string().regex(/^\d+(\.\d+)?(ms|s)$/).default("500ms"),
});

export type AnimationTokens = z.infer<typeof AnimationTokensSchema>;

// ============================================
// Section Override Schema
// ============================================

// Limited override tokens per section (no arbitrary CSS)
export const SectionOverrideSchema = z.object({
  background: hexColorSchema.optional(),
  surface: hexColorSchema.optional(),
  text: hexColorSchema.optional(),
  textSecondary: hexColorSchema.optional(),
  border: hexColorSchema.optional(),
  primary: hexColorSchema.optional(),
  primaryText: hexColorSchema.optional(),
}).optional();

export type SectionOverride = z.infer<typeof SectionOverrideSchema>;

export const SectionOverridesSchema = z.object({
  hero: SectionOverrideSchema,
  projects: SectionOverrideSchema,
  about: SectionOverrideSchema,
  contact: SectionOverrideSchema,
  footer: SectionOverrideSchema,
}).optional();

export type SectionOverrides = z.infer<typeof SectionOverridesSchema>;

// ============================================
// Complete Theme Token Schema
// ============================================

export const ThemeTokensSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(50).default("Default"),
  isDark: z.boolean().default(false),
  
  colors: ColorTokensSchema,
  typography: TypographyTokensSchema,
  radii: RadiiTokensSchema,
  spacing: SpacingTokensSchema,
  shadows: ShadowTokensSchema,
  layout: LayoutTokensSchema,
  breakpoints: BreakpointsSchema,
  animations: AnimationTokensSchema,
  sectionOverrides: SectionOverridesSchema,
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ThemeTokensDTO = z.infer<typeof ThemeTokensSchema>;

// Update schema (allows partial updates)
export const ThemeTokensUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  isDark: z.boolean().optional(),
  colors: ColorTokensSchema.partial().optional(),
  typography: TypographyTokensSchema.partial().optional(),
  radii: RadiiTokensSchema.partial().optional(),
  spacing: SpacingTokensSchema.partial().optional(),
  shadows: ShadowTokensSchema.partial().optional(),
  layout: LayoutTokensSchema.partial().optional(),
  breakpoints: BreakpointsSchema.partial().optional(),
  animations: AnimationTokensSchema.partial().optional(),
  sectionOverrides: SectionOverridesSchema.optional(),
});

export type ThemeTokensUpdateDTO = z.infer<typeof ThemeTokensUpdateSchema>;
