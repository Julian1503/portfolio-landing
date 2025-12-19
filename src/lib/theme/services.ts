import type { IThemeRepository } from "./interfaces";
import type { ThemeTokensDTO, ThemeTokensUpdateDTO } from "./schemas";
import { PrismaThemeRepository } from "./repositories";
import { DEFAULT_THEME, THEME_PRESETS, type ThemePresetKey } from "./defaults";

// ============================================
// Theme Service Interface
// ============================================

export interface IThemeService {
  /**
   * Get current active theme tokens
   * Returns default theme if none exists in DB
   */
  getTheme(): Promise<ThemeTokensDTO>;

  /**
   * Update theme tokens (partial update supported)
   */
  updateTheme(data: ThemeTokensUpdateDTO): Promise<ThemeTokensDTO>;

  /**
   * Load a preset theme
   */
  loadPreset(presetKey: ThemePresetKey): Promise<ThemeTokensDTO>;

  /**
   * Reset theme to default
   */
  resetToDefault(): Promise<ThemeTokensDTO>;
}

// ============================================
// Theme Service Implementation
// ============================================

export class ThemeService implements IThemeService {
  constructor(private repository: IThemeRepository = new PrismaThemeRepository()) {}

  async getTheme(): Promise<ThemeTokensDTO> {
    const theme = await this.repository.findUnique();
    
    if (!theme) {
      return DEFAULT_THEME;
    }
    
    return theme;
  }

  async updateTheme(data: ThemeTokensUpdateDTO): Promise<ThemeTokensDTO> {
    return await this.repository.upsert(data);
  }

  async loadPreset(presetKey: ThemePresetKey): Promise<ThemeTokensDTO> {
    const preset = THEME_PRESETS[presetKey];
    
    if (!preset) {
      throw new Error(`Unknown preset: ${presetKey}`);
    }
    
    // Load preset by upserting all its tokens
    return await this.repository.upsert({
      name: preset.name,
      isDark: preset.isDark,
      colors: preset.colors,
      typography: preset.typography,
      radii: preset.radii,
      spacing: preset.spacing,
      shadows: preset.shadows,
      sectionOverrides: preset.sectionOverrides,
    });
  }

  async resetToDefault(): Promise<ThemeTokensDTO> {
    return await this.loadPreset("default");
  }
}

// ============================================
// Service Factory (for dependency injection)
// ============================================

export function createThemeService(): IThemeService {
  return new ThemeService();
}
