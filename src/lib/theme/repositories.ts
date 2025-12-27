import prisma from "@/lib/prisma";
import type { IThemeRepository } from "./interfaces";
import type { ThemeTokensDTO, ThemeTokensUpdateDTO } from "./schemas";
import { DEFAULT_THEME } from "./defaults";
import { mapPrismaThemeToDTO, preparePrismaThemeData } from "./mappers";

const THEME_ID = "theme_singleton";

// ============================================
// Theme Repository Implementation
// ============================================

export class PrismaThemeRepository implements IThemeRepository {
  async findUnique(): Promise<ThemeTokensDTO | null> {
    const theme = await prisma.themeTokens?.findUnique({
      where: { id: THEME_ID },
    });

    if (!theme) {
      return null;
    }

    return mapPrismaThemeToDTO(theme);
  }

  async upsert(data: ThemeTokensUpdateDTO): Promise<ThemeTokensDTO> {
    // Get existing theme to merge with updates
    const existing = await this.findUnique();

    // Merge with defaults if no existing theme
    const baseTheme = existing || DEFAULT_THEME;

    // Prepare update data with merged tokens
    const mergedData : ThemeTokensDTO = {
      name: data.name || baseTheme.name,
      isDark: data.isDark || baseTheme.isDark,
      colors: data.colors ? { ...baseTheme.colors, ...data.colors } : baseTheme.colors,
      typography: data.typography ? { ...baseTheme.typography, ...data.typography } : baseTheme.typography,
      radii: data.radii ? { ...baseTheme.radii, ...data.radii } : baseTheme.radii,
      spacing: data.spacing ? { ...baseTheme.spacing, ...data.spacing } : baseTheme.spacing,
      shadows: data.shadows ? { ...baseTheme.shadows, ...data.shadows } : baseTheme.shadows,
      layout: data.layout ? { ...baseTheme.layout, ...data.layout } : baseTheme.layout,
      breakpoints: data.breakpoints ? { ...baseTheme.breakpoints, ...data.breakpoints } : baseTheme.breakpoints,
      animations: data.animations ? { ...baseTheme.animations, ...data.animations } : baseTheme.animations,
      sectionOverrides: data.sectionOverrides,
    };

    const updateData = preparePrismaThemeData(mergedData);
    const createData = preparePrismaThemeData({
      name: baseTheme.name,
      isDark: baseTheme.isDark,
      colors: mergedData.colors || baseTheme.colors,
      typography: mergedData.typography || baseTheme.typography,
      radii: mergedData.radii || baseTheme.radii,
      spacing: mergedData.spacing || baseTheme.spacing,
      shadows: mergedData.shadows || baseTheme.shadows,
      layout: mergedData.layout || baseTheme.layout,
      breakpoints: mergedData.breakpoints || baseTheme.breakpoints,
      animations: mergedData.animations || baseTheme.animations,
      sectionOverrides: mergedData.sectionOverrides || baseTheme.sectionOverrides,
    });

    // Perform upsert
    const theme = await prisma.themeTokens.upsert({
      where: { id: THEME_ID },
      update: updateData,
      create: {
        id: THEME_ID,
        ...createData,
      },
    });

    return mapPrismaThemeToDTO(theme);
  }
}