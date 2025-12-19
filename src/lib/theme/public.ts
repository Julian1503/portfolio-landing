import { createThemeService } from "./services";
import type { ThemeTokensDTO } from "./schemas";

/**
 * Get theme for public pages (server-side)
 * Returns default theme if none exists in DB
 */
export async function getTheme(): Promise<ThemeTokensDTO> {
  const service = createThemeService();
  return await service.getTheme();
}
