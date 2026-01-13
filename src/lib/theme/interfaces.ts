import type { ThemeTokensDTO, ThemeTokensUpdateDTO } from "./schemas";

// ============================================
// Theme Repository Interface
// ============================================

export interface IThemeRepository {
  /**
   * Find a theme by its unique name
   */
  findByName(name: string): Promise<ThemeTokensDTO | null>;

  /**
   * Retrieve all themes
   */
  findAll(): Promise<ThemeTokensDTO[]>;

  /**
   * Create or update theme tokens
   */
  upsert(data: ThemeTokensUpdateDTO): Promise<ThemeTokensDTO>;

  findUnique(): Promise<ThemeTokensDTO | null>;
}
