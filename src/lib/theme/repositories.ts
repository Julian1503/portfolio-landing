import prisma from "@/lib/prisma";
import type { IThemeRepository } from "./interfaces";
import type { ThemeTokensDTO, ThemeTokensUpdateDTO } from "./schemas";
import { DEFAULT_THEME } from "./defaults";

const THEME_ID = "theme_singleton";

// ============================================
// Theme Repository Implementation
// ============================================

export class PrismaThemeRepository implements IThemeRepository {
  async findUnique(): Promise<ThemeTokensDTO | null> {
    const theme = await prisma.themeTokens.findUnique({
      where: { id: THEME_ID },
    });

    if (!theme) {
      return null;
    }

    // Map Prisma model to DTO
    return {
      id: theme.id,
      name: theme.name,
      isDark: theme.isDark,
      colors: theme.colors as any,
      typography: theme.typography as any,
      radii: theme.radii as any,
      spacing: theme.spacing as any,
      shadows: theme.shadows as any,
      sectionOverrides: theme.sectionOverrides as any,
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt,
    };
  }

  async upsert(data: ThemeTokensUpdateDTO): Promise<ThemeTokensDTO> {
    // Get existing theme to merge with updates
    const existing = await this.findUnique();
    
    // Merge with defaults if no existing theme
    const baseTheme = existing || DEFAULT_THEME;
    
    // Prepare update data
    const updateData: any = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    
    if (data.isDark !== undefined) {
      updateData.isDark = data.isDark;
    }
    
    // Merge token groups (partial updates supported)
    if (data.colors) {
      updateData.colors = {
        ...baseTheme.colors,
        ...data.colors,
      };
    }
    
    if (data.typography) {
      updateData.typography = {
        ...baseTheme.typography,
        ...data.typography,
      };
    }
    
    if (data.radii) {
      updateData.radii = {
        ...baseTheme.radii,
        ...data.radii,
      };
    }
    
    if (data.spacing) {
      updateData.spacing = {
        ...baseTheme.spacing,
        ...data.spacing,
      };
    }
    
    if (data.shadows) {
      updateData.shadows = {
        ...baseTheme.shadows,
        ...data.shadows,
      };
    }
    
    if (data.sectionOverrides !== undefined) {
      updateData.sectionOverrides = data.sectionOverrides;
    }

    // Perform upsert
    const theme = await prisma.themeTokens.upsert({
      where: { id: THEME_ID },
      update: updateData,
      create: {
        id: THEME_ID,
        name: baseTheme.name,
        isDark: baseTheme.isDark,
        colors: baseTheme.colors,
        typography: baseTheme.typography,
        radii: baseTheme.radii,
        spacing: baseTheme.spacing,
        shadows: baseTheme.shadows,
        sectionOverrides: baseTheme.sectionOverrides || null,
        ...updateData,
      },
    });

    // Map to DTO
    return {
      id: theme.id,
      name: theme.name,
      isDark: theme.isDark,
      colors: theme.colors as any,
      typography: theme.typography as any,
      radii: theme.radii as any,
      spacing: theme.spacing as any,
      shadows: theme.shadows as any,
      sectionOverrides: theme.sectionOverrides as any,
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt,
    };
  }
}
