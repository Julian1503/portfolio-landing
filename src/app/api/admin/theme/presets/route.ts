import { NextRequest, NextResponse } from "next/server";
import { createThemeService } from "@/lib/theme/services";
import { THEME_PRESETS, type ThemePresetKey } from "@/lib/theme/defaults";
import { z } from "zod";

/**
 * GET /api/admin/theme/presets
 * List available theme presets
 */
export async function GET() {
  try {
    const presets = Object.entries(THEME_PRESETS).map(([key, theme]) => ({
      key,
      name: theme.name,
      isDark: theme.isDark,
    }));
    
    return NextResponse.json({ presets }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/theme/presets]", error);
    
    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/theme/presets
 * Load a preset theme
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate preset key
    const schema = z.object({
      preset: z.enum(["default", "dark", "warm", "minimal"]),
    });
    
    const { preset } = schema.parse(body);
    
    const service = createThemeService();
    const theme = await service.loadPreset(preset as ThemePresetKey);
    
    return NextResponse.json(theme, { status: 200 });
  } catch (error) {
    console.error("[POST /api/admin/theme/presets]", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid preset key",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to load preset" },
      { status: 500 }
    );
  }
}
