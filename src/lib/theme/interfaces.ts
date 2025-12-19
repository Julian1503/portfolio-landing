import type { ThemeTokensDTO, ThemeTokensUpdateDTO } from "./schemas";

// ============================================
// Theme Repository Interface
// ============================================

export interface IThemeRepository {
  /**
   * Find the current active theme
   */
  findUnique(): Promise<ThemeTokensDTO | null>;

  /**
   * Upsert (create or update) theme tokens
   */
  upsert(data: ThemeTokensUpdateDTO): Promise<ThemeTokensDTO>;
}
