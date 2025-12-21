// Type alias for Prisma's ThemeTokens model
// This will be properly typed once Prisma client is generated
type PrismaThemeTokens = {
  id: string;
  colors: any;
  typography: any;
  radii: any;
  spacing: any;
  shadows: any;
  sectionOverrides: any;
  name: string;
  isDark: boolean;
  createdAt: Date;
  updatedAt: Date;
};

import type { 
  ThemeTokensDTO, 
  ColorTokens, 
  TypographyTokens, 
  RadiiTokens, 
  SpacingTokens, 
  ShadowTokens, 
  SectionOverrides 
} from "./schemas";

/**
 * Map Prisma ThemeTokens model to ThemeTokensDTO
 * Handles JSON field casting with type safety
 */
export function mapPrismaThemeToDTO(prismaTheme: PrismaThemeTokens): ThemeTokensDTO {
  return {
    id: prismaTheme.id,
    name: prismaTheme.name,
    isDark: prismaTheme.isDark,
    colors: prismaTheme.colors as ColorTokens,
    typography: prismaTheme.typography as TypographyTokens,
    radii: prismaTheme.radii as RadiiTokens,
    spacing: prismaTheme.spacing as SpacingTokens,
    shadows: prismaTheme.shadows as ShadowTokens,
    sectionOverrides: prismaTheme.sectionOverrides as SectionOverrides | undefined,
    createdAt: prismaTheme.createdAt,
    updatedAt: prismaTheme.updatedAt,
  };
}

/**
 * Prepare theme data for Prisma upsert
 * Returns a properly typed object for database operations
 */
export function preparePrismaThemeData(theme: ThemeTokensDTO ): Omit<PrismaThemeTokens, "id" | "createdAt" | "updatedAt"> {
  return {
    name: theme.name,
    isDark: theme.isDark,
    colors: theme.colors as any,
    typography: theme.typography as any,
    radii: theme.radii as any,
    spacing: theme.spacing as any,
    shadows: theme.shadows as any,
    sectionOverrides: theme.sectionOverrides as any,
  };
}
